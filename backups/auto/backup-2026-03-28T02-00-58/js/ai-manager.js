/**
 * Photo Monster AI 管理器
 * 核心逻辑：MCP优先 → 规则引擎兜底
 */

class AIManager {
    constructor() {
        this.config = null;
        this.mcpClient = null;
        this.qwenAnalyzer = null;
        this.workbuddyAnalyzer = null;
        this.ruleEngineInstance = null;
    }

    // 初始化（每次都读取最新配置，不缓存）
    initialize() {
        // 加载最新配置
        this.config = AIConfig.getConfig();
        
        // 按需初始化通义千问（仅在配置变化时重建）
        const qwenConfig = this.config.qwen?.enabled && this.config.qwen?.apiKey ? this.config.qwen : null;
        if (qwenConfig) {
            if (!this.qwenAnalyzer || 
                this.qwenAnalyzer.apiKey !== qwenConfig.apiKey || 
                this.qwenAnalyzer.model !== qwenConfig.model) {
                this.qwenAnalyzer = new QwenAnalyzer(qwenConfig);
                console.log('[AI] 通义千问分析器已初始化');
            }
        } else {
            this.qwenAnalyzer = null;
        }
        
        // 按需初始化 WorkBuddy
        const wbConfig = this.config.workbuddy?.enabled && this.config.workbuddy?.apiKey && this.config.workbuddy?.endpoint
            ? this.config.workbuddy : null;
        if (wbConfig) {
            if (!this.workbuddyAnalyzer || 
                this.workbuddyAnalyzer.apiKey !== wbConfig.apiKey) {
                this.workbuddyAnalyzer = new WorkBuddyAnalyzer(wbConfig);
                console.log('[AI] WorkBuddy 分析器已初始化');
            }
        } else {
            this.workbuddyAnalyzer = null;
        }
        
        // 初始化规则引擎（只需一次）
        if (!this.ruleEngineInstance && typeof RuleEngine !== 'undefined') {
            this.ruleEngineInstance = new RuleEngine();
        }
        
        // 按需初始化 MCP
        if (this.config.mcp?.enabled && !this.mcpClient) {
            this.mcpClient = new MCPClient(this.config.mcp);
            console.log('[AI] MCP 客户端已初始化');
        }
    }

    // 执行分析（核心方法）- 融合 AI + 规则引擎
    // imageBase64: 可选，图片的base64数据，用于视觉分析
    async analyze(imageInfo, exifData, imageBase64 = null) {
        this.initialize();
        
        let ruleEngineResult = null;
        
        // ===== 判断用户选择的模式 =====
        const userProvider = this.config.provider;
        const useRuleEngineOnly = (userProvider === 'ruleengine');
        
        if (useRuleEngineOnly) {
            // 用户选择纯规则引擎模式，不调用任何 AI
            console.log('[AI] 用户选择规则引擎模式，跳过 AI 增强');
            try {
                const ruleEngineResult = this.analyzeWithRuleEngine(exifData);
                // analyzeWithRuleEngine 返回 { success, content, type } 格式
                if (ruleEngineResult && ruleEngineResult.success && ruleEngineResult.content) {
                    return ruleEngineResult.content;  // 返回完整结果对象
                }
            } catch (ruleError) {
                console.warn('[AI] 规则引擎失败:', ruleError.message);
            }
            return { success: false, error: '规则引擎分析失败' };
        }
        
        // ===== 用户选择 AI 模式：先执行规则引擎分析（必执行，作为基础） =====
        try {
            console.log('[AI] 正在执行规则引擎分析...');
            const ruleEngineResponse = this.analyzeWithRuleEngine(exifData);
            // analyzeWithRuleEngine 返回 { success, content, type }
            if (ruleEngineResponse && ruleEngineResponse.success && ruleEngineResponse.content) {
                ruleEngineResult = ruleEngineResponse.content;  // 提取完整结果对象
                console.log('[AI] 规则引擎分析完成');
            }
        } catch (ruleError) {
            console.warn('[AI] 规则引擎失败:', ruleError.message);
            ruleEngineResult = null;
        }

        // ===== 尝试 AI 分析增强 =====
        let aiEnhancedResult = null;
        
        // 2.1 尝试通义千问（优先使用视觉分析）
        if (this.qwenAnalyzer && this.config.qwen?.enabled) {
            try {
                // 如果有图片数据，使用视觉分析
                if (imageBase64 && this.config.qwen?.enableVision !== false) {
                    console.log('[AI] 正在使用通义千问视觉分析...');
                    showToast('AI 视觉分析中...', 'info');
                    
                    aiEnhancedResult = await this.callWithTimeout(
                        this.qwenAnalyzer.analyze(imageInfo, exifData, imageBase64),
                        this.config.settings.timeout
                    );
                } else {
                    // 否则使用传统文本分析
                    console.log('[AI] 正在使用通义千问 AI 增强分析...');
                    showToast('AI 智能分析融合中...', 'info');
                    
                    aiEnhancedResult = await this.callWithTimeout(
                        this.qwenAnalyzer.analyzeWithRuleContext(imageInfo, exifData, ruleEngineResult),
                        this.config.settings.timeout
                    );
                }
                
                if (aiEnhancedResult && aiEnhancedResult.success) {
                    console.log('[AI] 通义千问分析成功');
                    aiEnhancedResult.ruleEngineData = ruleEngineResult;
                    return aiEnhancedResult;
                }
            } catch (qwenError) {
                console.warn('[AI] 通义千问调用失败:', qwenError.message);
                showToast('AI 增强失败，使用规则引擎结果...', 'warning');
            }
        }

        // 2.2 尝试 MCP
        if (this.mcpClient && this.config.mcp?.enabled) {
            try {
                console.log('[AI] 正在尝试 MCP 融合分析...');
                showToast('AI 智能分析融合中...', 'info');
                
                aiEnhancedResult = await this.callWithTimeout(
                    this.mcpClient.analyzePhoto(imageInfo, exifData),
                    this.config.settings.timeout
                );
                
                if (aiEnhancedResult && aiEnhancedResult.success) {
                    console.log('[AI] MCP 融合分析成功');
                    aiEnhancedResult.ruleEngineData = ruleEngineResult;
                    return aiEnhancedResult;
                }
            } catch (mcpError) {
                console.warn('[AI] MCP 调用失败:', mcpError.message);
            }
        }

        // 2.3 尝试 WorkBuddy API
        if (this.workbuddyAnalyzer) {
            try {
                console.log('[AI] 正在使用 WorkBuddy API 融合分析...');
                
                aiEnhancedResult = await this.callWithTimeout(
                    this.workbuddyAnalyzer.analyze(imageInfo, exifData),
                    this.config.settings.timeout
                );
                
                if (aiEnhancedResult && aiEnhancedResult.success) {
                    console.log('[AI] WorkBuddy API 融合分析成功');
                    aiEnhancedResult.ruleEngineData = ruleEngineResult;
                    return aiEnhancedResult;
                }
            } catch (error) {
                console.warn('[AI] WorkBuddy API 失败:', error.message);
            }
        }

        // ===== 第3步：所有 AI 都失败，使用规则引擎结果 =====
        console.log('[AI] AI 增强不可用，使用规则引擎结果');
        if (ruleEngineResult && ruleEngineResult.summary) {
            return ruleEngineResult;  // 直接返回完整结果对象
        }

        // ===== 第4步：规则引擎也失败 =====
        console.error('[AI] 规则引擎分析失败');
        return { success: false, error: '规则引擎分析失败，请检查EXIF数据' };
    }

    // 规则引擎分析
    analyzeWithRuleEngine(exifData) {
        console.log('[AI] 使用规则引擎 fallback...');
        
        if (this.ruleEngineInstance) {
            try {
                const result = this.ruleEngineInstance.fullAnalysis(exifData);
                // 返回兼容格式：有 summary 字段表示成功
                if (result && result.summary) {
                    return {
                        success: true,
                        content: result,  // 传递完整结果对象
                        type: 'ruleengine'
                    };
                }
                return { success: false, error: '规则引擎返回结果无效' };
            } catch (error) {
                console.error('[AI] 规则引擎失败:', error);
                return { success: false, error: error.message };
            }
        }

        return { success: false, error: '规则引擎不可用' };
    }

    // 超时包装器
    callWithTimeout(promise, timeout) {
        return Promise.race([
            promise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('AI 请求超时，请检查网络连接')), timeout)
            )
        ]);
    }

    // 格式化规则引擎结果
    formatRuleEngineResult(result) {
        if (!result) return '规则引擎分析结果为空';
        
        let content = '';
        
        if (result.overall) {
            content += `## 📊 综合评分\n\n`;
            content += `**整体得分**: ${result.overall.score || 'N/A'}/10\n\n`;
        }
        
        if (result.composition) {
            content += `## 🎯 构图分析\n\n`;
            content += `${result.composition.analysis || '暂无分析'}\n\n`;
            if (result.composition.suggestions?.length) {
                content += `**建议**: ${result.composition.suggestions.join('、')}\n\n`;
            }
        }
        
        if (result.exposure) {
            content += `## 💡 光影评价\n\n`;
            content += `${result.exposure.analysis || '暂无分析'}\n\n`;
        }
        
        if (result.technical) {
            content += `## ⚙️ 技术参数\n\n`;
            content += `${result.technical.analysis || '暂无分析'}\n\n`;
        }
        
        return content || '规则引擎分析结果为空';
    }

    // 重载配置（配置页面调用后自动生效，无需手动刷新）
    reloadConfig() {
        this.config = AIConfig.getConfig();
        console.log('[AI] 配置已重载，当前模式:', this.config.provider);
        
        // 重建所有分析器（下次调用时生效）
        this.qwenAnalyzer = null;
        this.workbuddyAnalyzer = null;
        
        // 通知其他标签页配置已更新
        try {
            localStorage.setItem('photoMonster_ai_config_updated', Date.now().toString());
        } catch (e) {
            // ignore
        }
    }

    // 获取当前提供者名称（带融合信息）
    getProviderName(resultType) {
        if (resultType === 'qwen_fused' || resultType === 'mcp_fused') {
            return '通义千问 AI + 规则引擎';
        }
        if (this.qwenAnalyzer) return '通义千问 AI';
        if (this.workbuddyAnalyzer) return 'WorkBuddy AI';
        return '规则引擎';
    }
    
    // 获取分析类型描述
    getAnalysisTypeDescription(resultType) {
        const types = {
            'qwen_fused': '🔬 AI 融合分析（规则引擎 + 通义千问）',
            'qwen': '🤖 AI 分析（通义千问）',
            'workbuddy': '🤖 AI 分析（WorkBuddy）',
            'mcp': '🤖 AI 分析（MCP）',
            'ruleengine': '📊 规则引擎分析',
            'basic': '📋 基础分析'
        };
        return types[resultType] || '📊 分析完成';
    }
}

/**
 * WorkBuddy 分析器
 */
class WorkBuddyAnalyzer {
    constructor(config) {
        this.endpoint = config.endpoint;
        this.apiKey = config.apiKey;
        this.model = config.model || 'gpt-4o';
    }

    // 执行分析
    async analyze(imageInfo, exifData) {
        const prompt = this.buildPrompt(imageInfo, exifData);
        
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: `你是一位专业摄影导师，擅长从构图、光影、色彩、拍摄参数等维度分析照片。
请用中文回复，给出专业且实用的改进建议。
回复格式使用 Markdown，包含以下部分：
1. 综合评分（1-10分）
2. 构图分析
3. 光影评价  
4. 色彩表现
5. 技术参数建议
6. 改进建议（3条具体可执行的）`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API错误 (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        return this.parseResult(result);
    }

    // 构建提示词
    buildPrompt(imageInfo, exifData) {
        return `
请分析这张照片的技术表现：

📷 拍摄参数信息：
${exifData.camera ? `- 相机：${exifData.camera}` : ''}
${exifData.lens ? `- 镜头：${exifData.lens}` : ''}
${exifData.focalLength ? `- 焦距：${exifData.focalLength}mm` : ''}
${exifData.aperture ? `- 光圈：f/${exifData.aperture}` : ''}
${exifData.shutterSpeed ? `- 快门：${exifData.shutterSpeed}` : ''}
${exifData.iso ? `- ISO：${exifData.iso}` : ''}
${exifData.dateTime ? `- 拍摄时间：${exifData.dateTime}` : ''}

请给出详细的摄影点评和改进建议。
`;
    }

    // 解析结果
    parseResult(apiResult) {
        const content = apiResult.choices?.[0]?.message?.content || '';
        
        if (!content) {
            throw new Error('API 返回内容为空');
        }

        return {
            success: true,
            type: 'workbuddy',
            content: content,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * 通义千问（阿里云百炼）分析器
 * 支持文本模型和视觉模型
 */
class QwenAnalyzer {
    constructor(config) {
        this.endpoint = config.endpoint || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
        this.apiKey = config.apiKey;
        this.model = config.model || 'qwen-plus';
        this.visionModel = config.visionModel || 'qwen-vl-plus'; // 视觉模型
        this.enableVision = config.enableVision !== false; // 默认启用视觉
    }

    // 执行分析（带视觉）
    async analyze(imageInfo, exifData, imageBase64 = null) {
        // 如果有图片数据且启用了视觉，使用视觉分析
        if (this.enableVision && imageBase64) {
            return this.analyzeWithVision(imageInfo, exifData, imageBase64);
        }
        // 否则使用传统文本分析
        return this.analyzeTextOnly(imageInfo, exifData);
    }
    
    // 视觉分析 - AI真正"看到"图片
    async analyzeWithVision(imageInfo, exifData, imageBase64) {
        const prompt = this.buildVisionPrompt(exifData);
        
        const response = await fetch(`${this.endpoint}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.visionModel,
                messages: [
                    {
                        role: 'system',
                        content: `你是一位专业摄影导师，能够直接观察照片并给出专业分析。
请用中文回复，给出专业且实用的改进建议。
回复格式使用 Markdown，包含以下部分：
1. 综合评分（1-10分）
2. 构图分析（观察画面布局、主体位置、线条引导等）
3. 光影评价（观察光线方向、质感、氛围）
4. 色彩表现（观察色调、饱和度、色彩和谐度）
5. 技术参数建议（结合EXIF数据）
6. 后期调色与修图建议
7. 改进建议（3条具体可执行的）`
                    },
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: prompt },
                            { 
                                type: 'image_url', 
                                image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
                            }
                        ]
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`通义千问视觉 API 错误 (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        return this.parseResult(result, true); // true 表示是视觉分析
    }
    
    // 纯文本分析（原有逻辑）
    async analyzeTextOnly(imageInfo, exifData) {
        const prompt = this.buildPrompt(imageInfo, exifData);
        
        const response = await fetch(`${this.endpoint}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: `你是一位专业摄影导师，擅长从构图、光影、色彩、拍摄参数等维度分析照片。
请用中文回复，给出专业且实用的改进建议。
回复格式使用 Markdown，包含以下部分：
1. 综合评分（1-10分）
2. 构图分析
3. 光影评价  
4. 色彩表现
5. 技术参数建议
6. 改进建议（3条具体可执行的）`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`通义千问 API 错误 (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        return this.parseResult(result);
    }

    // 构建文本提示词
    buildPrompt(imageInfo, exifData) {
        return `
请分析这张照片的摄影表现：

📷 拍摄参数：
${exifData.camera ? `- 相机：${exifData.camera}` : ''}
${exifData.lens ? `- 镜头：${exifData.lens}` : ''}
${exifData.focalLength ? `- 焦距：${exifData.focalLength}mm` : ''}
${exifData.aperture ? `- 光圈：f/${exifData.aperture}` : ''}
${exifData.shutterSpeed ? `- 快门：${exifData.shutterSpeed}` : ''}
${exifData.iso ? `- ISO：${exifData.iso}` : ''}

请从以下维度分析：
1. 构图优点与改进建议
2. 光影运用评价
3. 色彩表现
4. 技术参数合理性
5. 综合评分（1-10分）
6. 3条具体改进建议
`;
    }
    
    // 构建视觉分析提示词
    buildVisionPrompt(exifData) {
        let paramText = '';
        if (exifData && Object.keys(exifData).length > 0) {
            paramText = '\n📷 拍摄参数参考：\n';
            if (exifData.camera) paramText += `- 相机：${exifData.camera}\n`;
            if (exifData.lens) paramText += `- 镜头：${exifData.lens}\n`;
            if (exifData.focalLength) paramText += `- 焦距：${exifData.focalLength}mm\n`;
            if (exifData.aperture) paramText += `- 光圈：f/${exifData.aperture}\n`;
            if (exifData.shutterSpeed) paramText += `- 快门：${exifData.shutterSpeed}\n`;
            if (exifData.iso) paramText += `- ISO：${exifData.iso}\n`;
        }
        
        return `请直接观察这张照片，给出专业的摄影分析。${paramText}

请重点关注：
1. 画面构图（主体位置、线条引导、留白、平衡感）
2. 光影效果（光线方向、质感、明暗对比、氛围营造）
3. 色彩表现（色调倾向、饱和度、色彩和谐度）
4. 主题表达（故事性、情感传达、视觉焦点）
5. 技术执行（清晰度、曝光、对焦）`;
    }

    // 解析结果
    parseResult(apiResult, isVision = false) {
        const content = apiResult.choices?.[0]?.message?.content || '';
        
        if (!content) {
            throw new Error('通义千问 API 返回内容为空');
        }

        return {
            success: true,
            type: isVision ? 'qwen-vision' : 'qwen',
            content: content,
            timestamp: new Date().toISOString()
        };
    }
    
    // 通用聊天方法（用于问答、方案生成等）
    async chat(systemPrompt, userMessage) {
        const response = await fetch(`${this.endpoint}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`通义千问 API 错误 (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        return this.parseResult(result);
    }
    
    // 融合规则引擎的智能分析
    async analyzeWithRuleContext(imageInfo, exifData, ruleEngineResult) {
        // 构建包含规则引擎结果的增强提示词
        const prompt = this.buildEnhancedPrompt(exifData, ruleEngineResult);
        
        const response = await fetch(`${this.endpoint}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: `你是一位专业摄影导师，擅长从构图、光影、色彩、拍摄参数等维度分析照片。
请用中文回复，给出专业且实用的改进建议。

【重要】你会收到两部分分析：
1. 规则引擎的技术评估（基于 EXIF 数据的精确分析，包括 ISO、快门、光圈等技术参数是否合理）
2. 请综合这两部分，给出最终的分析报告

回复格式使用 Markdown，包含以下部分：
1. 综合评分（1-10分）
2. 构图分析
3. 光影评价
4. 色彩表现
5. 技术参数评估（重点参考规则引擎的分析）
6. 后期调色与修图建议（包括调色方向、降噪/锐化、格式处理等具体可操作的建议）
7. 改进建议（3条具体可执行的）`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`通义千问 API 错误 (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        const content = result.choices?.[0]?.message?.content || '';
        
        if (!content) {
            throw new Error('通义千问 API 返回内容为空');
        }

        return {
            success: true,
            type: 'qwen_fused',
            content: content,
            timestamp: new Date().toISOString()
        };
    }
    
    // 构建融合提示词
    buildEnhancedPrompt(exifData, ruleEngineResult) {
        let prompt = `
📷 拍摄参数：
`;
        if (exifData.camera) prompt += `- 相机：${exifData.camera}\n`;
        if (exifData.lens) prompt += `- 镜头：${exifData.lens}\n`;
        if (exifData.focalLength) prompt += `- 焦距：${exifData.focalLength}mm\n`;
        if (exifData.aperture) prompt += `- 光圈：f/${exifData.aperture}\n`;
        if (exifData.shutterSpeed) prompt += `- 快门：${exifData.shutterSpeed}\n`;
        if (exifData.iso) prompt += `- ISO：${exifData.iso}\n`;
        
        // 添加规则引擎的技术分析结果
        if (ruleEngineResult && ruleEngineResult.content) {
            prompt += `
━━━━━━━━━━━━━━━━━━━━
🔧 规则引擎技术评估：
${ruleEngineResult.content}
━━━━━━━━━━━━━━━━━━━━

请综合以上规则引擎的技术评估，给出最终的分析建议。规则引擎的分析基于 EXIF 数据的精确计算（如安全快门、ISO 合理范围等），请在技术参数评估部分重点参考。
`;
        } else {
            prompt += `
请从以下维度分析：
1. 构图优点与改进建议
2. 光影运用评价
3. 色彩表现
4. 技术参数合理性
5. 综合评分（1-10分）
6. 3条具体改进建议
`;
        }
        
        return prompt;
    }
    
    // 供方案规划、知识库、器材推荐使用
    async chat(systemPrompt, userMessage, options = {}) {
        this.initialize();
        
        const { loadingId, resultId, loadingText = 'AI 思考中...' } = options;
        
        // 显示加载状态
        if (loadingId) {
            const loadingEl = document.getElementById(loadingId);
            if (loadingEl) {
                loadingEl.innerHTML = `<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> ${loadingText}</div>`;
            }
        }
        
        // 优先使用通义千问
        if (this.qwenAnalyzer && this.config.qwen?.enabled) {
            try {
                console.log('[AI] 通用聊天使用通义千问...');
                
                const result = await this.callWithTimeout(
                    this.qwenAnalyzer.chat(systemPrompt, userMessage),
                    this.config.settings.timeout
                );
                
                if (result && result.success) {
                    if (resultId) {
                        const resultEl = document.getElementById(resultId);
                        if (resultEl) {
                            resultEl.innerHTML = `<div class="ai-result">${this.formatMarkdown(result.content)}</div>`;
                        }
                    }
                    return result;
                }
            } catch (error) {
                console.warn('[AI] 通义千问聊天失败:', error.message);
            }
        }
        
        // 通义千问不可用，显示错误
        if (resultId) {
            const resultEl = document.getElementById(resultId);
            if (resultEl) {
                resultEl.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> 请先在 AI 配置页面启用并设置通义千问 API Key</div>';
            }
        }
        return null;
    }
    
    // 简单的Markdown格式化
    formatMarkdown(text) {
        if (!text) return '';
        return text
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }
    
    // 检查通义千问是否可用
    isQwenAvailable() {
        return !!(this.qwenAnalyzer && this.config.qwen?.enabled);
    }
}

// 创建全局实例
window.aiManager = new AIManager();

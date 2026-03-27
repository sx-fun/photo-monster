/**
 * Photo Monster AI 助手模块
 * 通用于各个页面的AI增强功能
 */

const AIHelper = (function() {
    // 获取配置
    function getConfig() {
        try {
            const stored = localStorage.getItem('photoMonster_ai_config');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('加载 AI 配置失败:', e);
        }
        return null;
    }

    // 检查通义千问是否可用
    function isQwenAvailable() {
        const config = getConfig();
        return config && 
               config.provider === 'qwen' && 
               config.qwen && 
               config.qwen.enabled && 
               config.qwen.apiKey;
    }

    // 获取通义千问配置
    function getQwenConfig() {
        const config = getConfig();
        if (!config || !config.qwen) return null;
        return {
            endpoint: config.qwen.endpoint || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            apiKey: config.qwen.apiKey,
            model: config.qwen.model || 'qwen-plus'
        };
    }

    // 显示加载状态
    function showLoading(elementId) {
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> AI 思考中...</div>';
        }
    }

    // 显示错误
    function showError(elementId, message) {
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
        }
    }

    // 通义千问问答
    async function askQwen(systemPrompt, userMessage) {
        const config = getQwenConfig();
        if (!config || !config.apiKey) {
            throw new Error('请先在 AI 配置页面设置通义千问 API Key');
        }

        const response = await fetch(`${config.endpoint}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
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
            throw new Error(`AI 服务错误 (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        return result.choices?.[0]?.message?.content || '';
    }

    // 通用问答接口
    async function chat(prompt, loadingId, resultId) {
        if (!isQwenAvailable()) {
            showError(resultId, '请先在 AI 配置页面启用并设置通义千问');
            return null;
        }

        showLoading(loadingId);
        
        try {
            const result = await askQwen(
                '你是一位专业摄影导师，擅长各类拍摄场景的方案规划。请用中文详细回答。',
                prompt
            );
            
            const el = document.getElementById(resultId);
            if (el) {
                el.innerHTML = `<div class="ai-result">${formatMarkdown(result)}</div>`;
            }
            return result;
        } catch (error) {
            showError(resultId, error.message);
            return null;
        }
    }

    // 简单的Markdown格式化
    function formatMarkdown(text) {
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

    return {
        isQwenAvailable,
        chat,
        showLoading,
        showError
    };
})();

// 创建全局实例
window.AIHelper = AIHelper;

/**
 * Photo Monster MCP 客户端
 * 用于调用 WorkBuddy MCP Server
 */

class MCPClient {
    constructor(config = {}) {
        this.config = {
            enabled: config.enabled ?? true,
            command: config.command || 'npx',           // MCP Server 启动命令
            args: config.args || ['-y', '@workbuddy/mcp-server'],  // MCP Server 参数
            timeout: config.timeout || 30000,            // 超时时间
            ...config
        };
        this.isConnected = false;
        this.process = null;
    }

    // 检查 MCP 是否可用
    async checkAvailability() {
        if (!this.config.enabled) {
            return { available: false, reason: 'MCP 未启用' };
        }

        try {
            // 尝试连接 MCP Server
            const result = await this.callTool('ping', { message: 'test' });
            return { available: true };
        } catch (error) {
            return { available: false, reason: error.message };
        }
    }

    // 调用 MCP 工具
    async callTool(toolName, args = {}) {
        // MCP 协议调用
        // 这里需要根据实际的 MCP Server 实现来调用
        // 常见方式：HTTP SSE、STDIO、WebSocket
        
        const request = {
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: {
                name: toolName,
                arguments: args
            }
        };

        try {
            // 尝试 STDIO 方式调用
            const result = await this.callViaStdio(request);
            return result;
        } catch (stdioError) {
            // 尝试 HTTP 方式调用
            try {
                return await this.callViaHttp(request);
            } catch (httpError) {
                throw new Error(`MCP 调用失败: ${stdioError.message}`);
            }
        }
    }

    // 通过 STDIO 调用（需要本地运行 MCP Server）
    async callViaStdio(request) {
        return new Promise((resolve, reject) => {
            // 检查是否已有运行中的进程
            if (!this.process) {
                reject(new Error('MCP Server 未运行'));
                return;
            }

            const timeout = setTimeout(() => {
                reject(new Error('MCP 请求超时'));
            }, this.config.timeout);

            // 发送请求
            this.process.stdin.write(JSON.stringify(request) + '\n');

            // 监听响应
            const handleData = (data) => {
                try {
                    const response = JSON.parse(data.toString());
                    clearTimeout(timeout);
                    this.process.stdout.removeListener('data', handleData);
                    resolve(response.result);
                } catch (e) {
                    // 忽略非 JSON 数据
                }
            };

            this.process.stdout.on('data', handleData);
        });
    }

    // 通过 HTTP 调用（如果 MCP Server 提供 HTTP 端点）
    async callViaHttp(request) {
        const endpoint = this.config.httpEndpoint || 'http://localhost:3000/mcp';
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error(`HTTP 错误: ${response.status}`);
        }

        const result = await response.json();
        return result.result;
    }

    // 摄影分析专用方法
    async analyzePhoto(imageInfo, exifData) {
        const prompt = this.buildAnalysisPrompt(imageInfo, exifData);
        
        // 尝试调用 MCP 工具
        try {
            const result = await this.callTool('analyze_photo', {
                prompt: prompt,
                exifData: exifData,
                imageName: imageInfo.fileName
            });
            
            return {
                success: true,
                type: 'mcp',
                content: result.content || result.text || result,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            console.warn('MCP 分析失败:', error.message);
            throw error;
        }
    }

    // 构建分析提示词
    buildAnalysisPrompt(imageInfo, exifData) {
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

    // 关闭连接
    disconnect() {
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
        this.isConnected = false;
    }
}

// 创建全局实例
window.mcpClient = null;

// 初始化 MCP 客户端
function initMCPClient(config = {}) {
    window.mcpClient = new MCPClient(config);
    return window.mcpClient;
}

// 检查 MCP 是否可用
async function checkMCPAvailability() {
    if (!window.mcpClient) {
        return { available: false, reason: 'MCP 客户端未初始化' };
    }
    return await window.mcpClient.checkAvailability();
}

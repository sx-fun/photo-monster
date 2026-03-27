/**
 * Photo Monster AI 配置模块
 * 管理 AI 分析服务配置，支持 MCP / WorkBuddy / 规则引擎
 */

const AIConfig = (function() {
    // 默认配置
    const defaultConfig = {
        // 当前使用的 AI 服务
        provider: 'ruleengine',  // 'qwen' | 'mcp' | 'workbuddy' | 'ruleengine'
        
        // MCP 配置
        mcp: {
            enabled: true,
            command: 'npx',
            args: ['-y', '@workbuddy/mcp-server'],
            httpEndpoint: '',
            timeout: 30000
        },
        
        // 通义千问配置（阿里云百炼）
        qwen: {
            enabled: false,
            endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
            apiKey: '',
            model: 'qwen-plus',  // 文本模型
            visionModel: 'qwen-vl-plus',  // 视觉模型
            enableVision: true   // 是否启用视觉分析
        },
        
        // WorkBuddy 配置
        workbuddy: {
            enabled: false,
            endpoint: '',
            apiKey: '',
            model: 'gpt-4o'
        },
        
        // 规则引擎配置
        ruleEngine: {
            enabled: true
        },
        
        // 请求设置
        settings: {
            timeout: 25000,     // 超时时间(ms)
            maxRetries: 2      // 最大重试次数
        }
    };

    // 从 localStorage 加载配置
    function loadConfig() {
        try {
            const stored = localStorage.getItem('photoMonster_ai_config');
            if (stored) {
                const parsed = JSON.parse(stored);
                return { ...defaultConfig, ...parsed };
            }
        } catch (e) {
            console.warn('加载 AI 配置失败:', e);
        }
        return { ...defaultConfig };
    }

    // 保存配置到 localStorage
    function saveConfig(config) {
        try {
            localStorage.setItem('photoMonster_ai_config', JSON.stringify(config));
            return true;
        } catch (e) {
            console.error('保存 AI 配置失败:', e);
            return false;
        }
    }

    // 获取当前配置
    function getConfig() {
        return loadConfig();
    }

    // 更新配置
    function updateConfig(newConfig) {
        const current = loadConfig();
        const updated = { ...current, ...newConfig };
        return saveConfig(updated);
    }

    // 重置为默认配置
    function resetConfig() {
        localStorage.removeItem('photoMonster_ai_config');
        return { ...defaultConfig };
    }

    // 检查通义千问是否可用
    function isQwenAvailable() {
        const config = loadConfig();
        return config.provider === 'qwen' && 
               config.qwen.enabled && 
               config.qwen.apiKey;
    }
    
    // 检查 WorkBuddy 是否可用
    function isWorkBuddyAvailable() {
        const config = loadConfig();
        return config.provider === 'workbuddy' && 
               config.workbuddy.enabled && 
               config.workbuddy.apiKey && 
               config.workbuddy.endpoint;
    }

    // 检查规则引擎是否可用
    function isRuleEngineAvailable() {
        const config = loadConfig();
        return config.ruleEngine && config.ruleEngine.enabled;
    }

    return {
        getConfig,
        updateConfig,
        resetConfig,
        isQwenAvailable,
        isWorkBuddyAvailable,
        isRuleEngineAvailable,
        defaultConfig
    };
})();

// 导出到全局
window.AIConfig = AIConfig;

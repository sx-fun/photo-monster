/**
 * Photo Monster 安全配置中心
 * 统一管理所有安全策略和验证规则
 */

const SecurityConfig = {
    // ========== 网络安全配置 ==========
    network: {
        // 允许访问的域名白名单
        allowedDomains: [
            'dpreview.com',
            'www.dpreview.com',
            'sony.com',
            'www.sony.com',
            'canon.com',
            'global.canon',
            'www.canon.com',
            'nikon.com',
            'www.nikon.com',
            'fujifilm.com',
            'www.fujifilm.com',
            'leica-camera.com',
            'www.leica-camera.com',
            'hasselblad.com',
            'www.hasselblad.com'
        ],
        
        // 请求超时配置
        timeout: {
            connect: 10000,    // 连接超时 10秒
            read: 30000,       // 读取超时 30秒
            total: 60000       // 总超时 60秒
        },
        
        // 请求限制
        limits: {
            maxRedirects: 3,           // 最大重定向次数
            maxResponseSize: 5 * 1024 * 1024,  // 最大响应 5MB
            maxRequestsPerMinute: 30   // 每分钟最大请求数
        },
        
        // 禁止的协议和端口
        blockedProtocols: ['file:', 'ftp:', 'gopher:', 'mailto:'],
        blockedPorts: [22, 23, 25, 135, 139, 445, 3389]
    },

    // ========== 输入验证配置 ==========
    validation: {
        // 品牌白名单
        allowedBrands: [
            'sony', 'canon', 'nikon', 'fujifilm', 
            'panasonic', 'olympus', 'leica', 'hasselblad',
            'sigma', 'tamron', 'unknown'
        ],
        
        // 相机类型白名单
        allowedCameraTypes: [
            'mirrorless', 'dslr', 'compact', 
            'cinema', 'rangefinder', 'medium'
        ],
        
        // 传感器类型白名单
        allowedSensors: [
            'fullframe', 'apsc', 'm43', 
            'medium', '1inch', 'compact'
        ],
        
        // 卡口白名单
        allowedMounts: {
            sony: ['FE', 'E'],
            canon: ['RF', 'EF', 'EF-M', 'EF-S'],
            nikon: ['Z', 'F'],
            fujifilm: ['X', 'GF'],
            panasonic: ['L', 'M43'],
            olympus: ['M43'],
            leica: ['M', 'L', 'R'],
            hasselblad: ['XCD', 'H'],
            sigma: ['SA', 'L'],
            tamron: ['SP']
        },
        
        // 字段长度限制
        maxLengths: {
            brand: 20,
            model: 100,
            type: 20,
            sensor: 20,
            mount: 10,
            source: 50,
            title: 200,
            summary: 1000,
            url: 500
        },
        
        // 数值范围限制
        numericRanges: {
            mp: { min: 1, max: 400 },           // 像素
            lowLight: { min: 1, max: 15 },      // 弱光性能
            price: { min: 0, max: 1000000 }     // 价格
        }
    },

    // ========== 内容过滤配置 ==========
    filtering: {
        // 禁止的关键词（防止注入）
        forbiddenPatterns: [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,  // 脚本标签
            /javascript:/gi,                                        // javascript协议
            /on\w+\s*=/gi,                                          // 事件处理器
            /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,  // iframe
            /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,  // object标签
            /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,     // embed标签
            /eval\s*\(/gi,                                          // eval函数
            /expression\s*\(/gi,                                    // CSS表达式
            /url\s*\(\s*['"]*\s*javascript:/gi                      // CSS中的js
        ],
        
        // 需要转义的特殊字符
        escapeChars: {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        },
        
        // 允许的HTML标签（清理HTML时使用）
        allowedHtmlTags: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
        allowedHtmlAttributes: []
    },

    // ========== 文件安全配置 ==========
    file: {
        // 允许的文件扩展名
        allowedExtensions: ['.json', '.txt', '.js', '.md'],
        
        // 禁止的文件模式
        forbiddenPatterns: [
            /\.exe$/i,
            /\.dll$/i,
            /\.bat$/i,
            /\.cmd$/i,
            /\.ps1$/i,
            /\.sh$/i,
            /\.php$/i,
            /\.jsp$/i,
            /\.asp$/i,
            /\.aspx$/i
        ],
        
        // 文件大小限制
        maxFileSize: 10 * 1024 * 1024,  // 10MB
        
        // 安全的文件路径模式
        safePathPattern: /^[a-zA-Z0-9_\-\/\\\.\s]+$/,
        
        // 禁止的路径片段
        forbiddenPathFragments: [
            '..',
            '~',
            '$',
            '%',
            '&',
            '*',
            '|',
            '<',
            '>',
            '?',
            '\0'
        ]
    },

    // ========== 执行安全配置 ==========
    execution: {
        // 禁止的Node.js模块
        forbiddenModules: [
            'child_process',
            'cluster',
            'dgram',
            'dns',
            'net',
            'repl',
            'tls',
            'vm',
            'worker_threads'
        ],
        
        // 禁止的全局对象访问
        forbiddenGlobals: [
            'eval',
            'Function',
            'execScript'
        ],
        
        // 最大执行时间
        maxExecutionTime: 300000,  // 5分钟
        
        // 最大内存使用
        maxMemoryUsage: 512 * 1024 * 1024  // 512MB
    },

    // ========== 审计日志配置 ==========
    audit: {
        // 需要记录的操作
        loggedOperations: [
            'fetch_start',
            'fetch_complete',
            'fetch_error',
            'file_read',
            'file_write',
            'file_delete',
            'database_backup',
            'database_update',
            'validation_error',
            'security_violation'
        ],
        
        // 日志保留天数
        logRetentionDays: 30,
        
        // 最大日志文件大小
        maxLogSize: 50 * 1024 * 1024  // 50MB
    }
};

// ========== 安全验证函数 ==========

const SecurityValidator = {
    // 验证URL是否在白名单中
    isAllowedUrl(url) {
        try {
            const parsed = new URL(url);
            
            // 检查协议
            if (SecurityConfig.network.blockedProtocols.includes(parsed.protocol)) {
                return { valid: false, reason: `禁止的协议: ${parsed.protocol}` };
            }
            
            // 检查端口
            const port = parsed.port || (parsed.protocol === 'https:' ? 443 : 80);
            if (SecurityConfig.network.blockedPorts.includes(parseInt(port))) {
                return { valid: false, reason: `禁止的端口: ${port}` };
            }
            
            // 检查域名
            const hostname = parsed.hostname.toLowerCase();
            const isAllowed = SecurityConfig.network.allowedDomains.some(domain => 
                hostname === domain || hostname.endsWith('.' + domain)
            );
            
            if (!isAllowed) {
                return { valid: false, reason: `不在白名单中的域名: ${hostname}` };
            }
            
            return { valid: true };
        } catch (error) {
            return { valid: false, reason: `无效的URL: ${error.message}` };
        }
    },

    // 验证品牌
    isValidBrand(brand) {
        return SecurityConfig.validation.allowedBrands.includes(brand.toLowerCase());
    },

    // 验证相机类型
    isValidCameraType(type) {
        return SecurityConfig.validation.allowedCameraTypes.includes(type.toLowerCase());
    },

    // 验证传感器类型
    isValidSensor(sensor) {
        return SecurityConfig.validation.allowedSensors.includes(sensor.toLowerCase());
    },

    // 验证卡口
    isValidMount(brand, mount) {
        const allowed = SecurityConfig.validation.allowedMounts[brand.toLowerCase()];
        if (!allowed) return true; // 未知品牌不限制
        return allowed.includes(mount.toUpperCase());
    },

    // 清理文本内容（防止XSS）
    sanitizeText(text) {
        if (typeof text !== 'string') return '';
        
        // 检查禁止的模式
        for (const pattern of SecurityConfig.filtering.forbiddenPatterns) {
            if (pattern.test(text)) {
                console.warn(`⚠️  检测到潜在危险内容，已清理: ${text.substring(0, 50)}...`);
                text = text.replace(pattern, '');
            }
        }
        
        // HTML实体编码
        return text.replace(/[&<>"'\/]/g, char => 
            SecurityConfig.filtering.escapeChars[char] || char
        );
    },

    // 验证字段长度
    validateLength(field, value, maxLength) {
        if (typeof value !== 'string') return { valid: false, reason: `${field} 必须是字符串` };
        if (value.length > maxLength) {
            return { valid: false, reason: `${field} 超过最大长度 ${maxLength}` };
        }
        return { valid: true };
    },

    // 验证数值范围
    validateRange(field, value, min, max) {
        const num = parseFloat(value);
        if (isNaN(num)) return { valid: false, reason: `${field} 必须是数字` };
        if (num < min || num > max) {
            return { valid: false, reason: `${field} 必须在 ${min}-${max} 之间` };
        }
        return { valid: true };
    },

    // 验证文件路径
    isSafePath(filePath) {
        // 检查禁止的片段
        for (const fragment of SecurityConfig.file.forbiddenPathFragments) {
            if (filePath.includes(fragment)) {
                return { valid: false, reason: `路径包含禁止的字符: ${fragment}` };
            }
        }
        
        // 检查文件扩展名
        const ext = require('path').extname(filePath).toLowerCase();
        if (!SecurityConfig.file.allowedExtensions.includes(ext)) {
            return { valid: false, reason: `不允许的文件扩展名: ${ext}` };
        }
        
        // 检查禁止的文件模式
        for (const pattern of SecurityConfig.file.forbiddenPatterns) {
            if (pattern.test(filePath)) {
                return { valid: false, reason: `禁止的文件类型` };
            }
        }
        
        return { valid: true };
    },

    // 验证相机数据对象
    validateCameraData(camera) {
        const errors = [];
        
        // 必填字段
        if (!camera.brand) errors.push('缺少品牌');
        if (!camera.model) errors.push('缺少型号');
        
        // 验证品牌
        if (camera.brand && !this.isValidBrand(camera.brand)) {
            errors.push(`无效的品牌: ${camera.brand}`);
        }
        
        // 验证类型
        if (camera.type && !this.isValidCameraType(camera.type)) {
            errors.push(`无效的类型: ${camera.type}`);
        }
        
        // 验证传感器
        if (camera.sensor && !this.isValidSensor(camera.sensor)) {
            errors.push(`无效的传感器: ${camera.sensor}`);
        }
        
        // 验证卡口
        if (camera.mount && camera.brand && !this.isValidMount(camera.brand, camera.mount)) {
            errors.push(`无效的卡口: ${camera.mount} for ${camera.brand}`);
        }
        
        // 验证字段长度
        const maxLens = SecurityConfig.validation.maxLengths;
        if (camera.brand) {
            const result = this.validateLength('brand', camera.brand, maxLens.brand);
            if (!result.valid) errors.push(result.reason);
        }
        if (camera.model) {
            const result = this.validateLength('model', camera.model, maxLens.model);
            if (!result.valid) errors.push(result.reason);
        }
        
        // 清理文本字段
        if (camera.model) camera.model = this.sanitizeText(camera.model);
        if (camera.source) camera.source = this.sanitizeText(camera.source);
        
        // 验证数值范围
        if (camera.mp !== undefined) {
            const range = SecurityConfig.validation.numericRanges.mp;
            const result = this.validateRange('mp', camera.mp, range.min, range.max);
            if (!result.valid) errors.push(result.reason);
        }
        
        return {
            valid: errors.length === 0,
            errors: errors,
            data: camera
        };
    },

    // 验证镜头数据对象
    validateLensData(lens) {
        const errors = [];
        
        if (!lens.brand) errors.push('缺少品牌');
        if (!lens.model) errors.push('缺少型号');
        
        if (lens.brand && !this.isValidBrand(lens.brand)) {
            errors.push(`无效的品牌: ${lens.brand}`);
        }
        
        // 清理文本
        if (lens.model) lens.model = this.sanitizeText(lens.model);
        if (lens.source) lens.source = this.sanitizeText(lens.source);
        
        return {
            valid: errors.length === 0,
            errors: errors,
            data: lens
        };
    }
};

// 审计日志
class SecurityAudit {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
    }

    log(operation, details = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            operation,
            details,
            pid: process.pid,
            memory: process.memoryUsage()
        };
        
        this.logs.push(entry);
        
        // 限制日志数量
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
        
        // 控制台输出
        if (operation === 'security_violation' || operation === 'validation_error') {
            console.warn(`[安全审计] ${operation}:`, details);
        }
    }

    getLogs(operation = null) {
        if (operation) {
            return this.logs.filter(log => log.operation === operation);
        }
        return this.logs;
    }

    saveToFile(filePath) {
        const fs = require('fs');
        fs.writeFileSync(filePath, JSON.stringify(this.logs, null, 2), 'utf-8');
    }
}

// 创建全局审计实例
const audit = new SecurityAudit();

module.exports = {
    SecurityConfig,
    SecurityValidator,
    SecurityAudit,
    audit
};

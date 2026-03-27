/**
 * 安全加固的基础抓取类
 * 集成安全验证、审计日志、内容过滤
 */

const { SecurityConfig, SecurityValidator, audit } = require('../security-config');

class SecureBaseScraper {
    constructor(name, baseUrl) {
        this.name = name;
        this.baseUrl = baseUrl;
        this.results = {
            cameras: [],
            lenses: [],
            news: []
        };
        this.requestCount = 0;
        this.startTime = Date.now();
    }

    // 安全的HTTP请求
    async fetch(url, options = {}) {
        // 验证URL安全性
        const urlCheck = SecurityValidator.isAllowedUrl(url);
        if (!urlCheck.valid) {
            audit.log('security_violation', { 
                type: 'blocked_url', 
                url, 
                reason: urlCheck.reason 
            });
            throw new Error(`安全拦截: ${urlCheck.reason}`);
        }

        // 检查请求频率
        this.requestCount++;
        if (this.requestCount > SecurityConfig.network.limits.maxRequestsPerMinute) {
            audit.log('security_violation', { 
                type: 'rate_limit_exceeded', 
                count: this.requestCount 
            });
            throw new Error('请求频率超限');
        }

        // 检查执行时间
        const elapsed = Date.now() - this.startTime;
        if (elapsed > SecurityConfig.execution.maxExecutionTime) {
            audit.log('security_violation', { 
                type: 'execution_timeout', 
                elapsed 
            });
            throw new Error('执行时间超限');
        }

        try {
            audit.log('fetch_start', { url, source: this.name });
            
            const fetch = (await import('node-fetch')).default;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), SecurityConfig.network.timeout.total);

            const response = await fetch(url, {
                signal: controller.signal,
                redirect: 'follow',
                follow: SecurityConfig.network.limits.maxRedirects,
                size: SecurityConfig.network.limits.maxResponseSize,
                timeout: SecurityConfig.network.timeout.read,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'DNT': '1',
                    'Connection': 'keep-alive',
                    ...options.headers
                },
                ...options
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type') || '';
            
            // 验证内容类型
            if (!contentType.includes('text/html') && 
                !contentType.includes('application/json') &&
                !contentType.includes('application/xml') &&
                !contentType.includes('text/plain')) {
                audit.log('security_violation', { 
                    type: 'invalid_content_type', 
                    contentType 
                });
                throw new Error(`不允许的内容类型: ${contentType}`);
            }

            const text = await response.text();
            
            // 验证内容大小
            if (text.length > SecurityConfig.network.limits.maxResponseSize) {
                audit.log('security_violation', { 
                    type: 'response_too_large', 
                    size: text.length 
                });
                throw new Error('响应内容过大');
            }

            audit.log('fetch_complete', { 
                url, 
                size: text.length,
                contentType 
            });

            return text;

        } catch (error) {
            audit.log('fetch_error', { 
                url, 
                error: error.message 
            });
            throw error;
        }
    }

    // 安全提取相机信息
    extractCameraInfo(text, brand) {
        const cameras = [];
        const patterns = this.getCameraPatterns(brand);

        for (const pattern of patterns) {
            try {
                const regex = new RegExp(pattern.regex, 'gi');
                const matches = text.match(regex);
                
                if (matches) {
                    matches.forEach(match => {
                        try {
                            const info = pattern.extract(match);
                            
                            // 验证数据
                            const validation = SecurityValidator.validateCameraData({
                                brand,
                                ...info
                            });

                            if (!validation.valid) {
                                audit.log('validation_error', {
                                    type: 'camera',
                                    brand,
                                    model: info.model,
                                    errors: validation.errors
                                });
                                return;
                            }

                            // 检查重复
                            if (!cameras.find(c => c.model === info.model)) {
                                cameras.push({
                                    brand: brand,
                                    ...validation.data,
                                    source: SecurityValidator.sanitizeText(this.name),
                                    publishDate: new Date().toISOString().split('T')[0],
                                    needsReview: true,
                                    scrapedAt: new Date().toISOString()
                                });
                            }
                        } catch (e) {
                            audit.log('validation_error', {
                                type: 'camera_extraction',
                                match,
                                error: e.message
                            });
                        }
                    });
                }
            } catch (e) {
                console.warn(`正则表达式错误: ${pattern.regex}`, e.message);
            }
        }

        return cameras;
    }

    // 安全提取镜头信息
    extractLensInfo(text, brand) {
        const lenses = [];
        const patterns = this.getLensPatterns(brand);

        for (const pattern of patterns) {
            try {
                const regex = new RegExp(pattern.regex, 'gi');
                const matches = text.match(regex);
                
                if (matches) {
                    matches.forEach(match => {
                        try {
                            const info = pattern.extract(match);
                            
                            const validation = SecurityValidator.validateLensData({
                                brand,
                                ...info
                            });

                            if (!validation.valid) {
                                audit.log('validation_error', {
                                    type: 'lens',
                                    brand,
                                    model: info.model,
                                    errors: validation.errors
                                });
                                return;
                            }

                            if (!lenses.find(l => l.model === info.model)) {
                                lenses.push({
                                    brand: brand,
                                    ...validation.data,
                                    source: SecurityValidator.sanitizeText(this.name),
                                    publishDate: new Date().toISOString().split('T')[0],
                                    needsReview: true,
                                    scrapedAt: new Date().toISOString()
                                });
                            }
                        } catch (e) {
                            audit.log('validation_error', {
                                type: 'lens_extraction',
                                match,
                                error: e.message
                            });
                        }
                    });
                }
            } catch (e) {
                console.warn(`正则表达式错误: ${pattern.regex}`, e.message);
            }
        }

        return lenses;
    }

    // 相机型号匹配模式
    getCameraPatterns(brand) {
        const patterns = {
            sony: [
                { regex: 'A7[\\s]*[CRV]?[\\s]*[IVX]+', extract: (m) => ({ model: m.replace(/\s/g, '').toUpperCase(), type: 'mirrorless', mount: 'FE' }) },
                { regex: 'A6[\\d]{3}', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', mount: 'E' }) },
                { regex: 'A1', extract: (m) => ({ model: 'A1', type: 'mirrorless', mount: 'FE' }) },
                { regex: 'FX[\\d]', extract: (m) => ({ model: m.toUpperCase(), type: 'cinema', mount: 'FE' }) }
            ],
            canon: [
                { regex: 'EOS\\s+R[\\d]?[\\s]*[IVX]*', extract: (m) => ({ model: m.replace(/\s+/g, ' ').trim(), type: 'mirrorless', mount: 'RF' }) },
                { regex: 'EOS\\s+5D[\\s]*[IVX]*', extract: (m) => ({ model: m.replace(/\s+/g, ' ').trim(), type: 'dslr', mount: 'EF' }) },
                { regex: 'EOS\\s+6D[\\s]*[IVX]*', extract: (m) => ({ model: m.replace(/\s+/g, ' ').trim(), type: 'dslr', mount: 'EF' }) },
                { regex: 'EOS\\s+90D', extract: (m) => ({ model: 'EOS 90D', type: 'dslr', mount: 'EF' }) }
            ],
            nikon: [
                { regex: 'Z[\\d][\\s]*[II]*', extract: (m) => ({ model: m.replace(/\s/g, '').toUpperCase(), type: 'mirrorless', mount: 'Z' }) },
                { regex: 'Z[\\d]{2}', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', mount: 'Z' }) }
            ],
            fujifilm: [
                { regex: 'X-[TSHV][\\d]+', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', mount: 'X' }) },
                { regex: 'GFX[\\d]+[S]*', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', sensor: 'medium', mount: 'GF' }) }
            ],
            leica: [
                { regex: 'M[\\d]+', extract: (m) => ({ model: m.toUpperCase(), type: 'rangefinder', mount: 'M' }) },
                { regex: 'Q[\\d]', extract: (m) => ({ model: m.toUpperCase(), type: 'compact', mount: 'fixed' }) },
                { regex: 'SL[\\d]', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', mount: 'L' }) }
            ],
            hasselblad: [
                { regex: 'X[\\d]D', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', sensor: 'medium', mount: 'XCD' }) },
                { regex: '907X', extract: (m) => ({ model: '907X', type: 'mirrorless', sensor: 'medium', mount: 'XCD' }) }
            ]
        };

        return patterns[brand] || [];
    }

    getLensPatterns(brand) {
        return [
            { 
                regex: '\\d+mm\\s+f/\\d+\\.?\\d*', 
                extract: (m) => ({ 
                    model: m,
                    type: m.includes('-') ? 'zoom' : 'prime'
                }) 
            }
        ];
    }

    // 安全清理HTML
    cleanHtml(html) {
        if (typeof html !== 'string') return '';
        
        // 移除所有HTML标签
        let cleaned = html.replace(/<[^>]+>/g, ' ');
        
        // 解码HTML实体
        cleaned = cleaned
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g, '/')
            .replace(/&nbsp;/g, ' ');
        
        // 清理多余空白
        cleaned = cleaned.replace(/\s+/g, ' ').trim();
        
        // 安全检查 - 再次清理可能的注入
        cleaned = SecurityValidator.sanitizeText(cleaned);
        
        return cleaned;
    }

    // 检查日期
    isRecent(dateStr, days = 14) {
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return false;
            
            const now = new Date();
            const diff = (now - date) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff <= days;
        } catch {
            return false;
        }
    }

    // 子类必须实现
    async scrape() {
        throw new Error('子类必须实现 scrape 方法');
    }

    // 获取审计日志
    getAuditLogs() {
        return audit.getLogs();
    }
}

module.exports = SecureBaseScraper;

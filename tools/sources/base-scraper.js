/**
 * 基础抓取类 - 所有数据源抓取器的基类
 */

class BaseScraper {
    constructor(name, baseUrl) {
        this.name = name;
        this.baseUrl = baseUrl;
        this.results = {
            cameras: [],
            lenses: [],
            news: []
        };
    }

    async fetch(url, options = {}) {
        try {
            const fetch = (await import('node-fetch')).default;
            const response = await fetch(url, {
                timeout: 30000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.text();
        } catch (error) {
            throw new Error(`Fetch failed: ${error.message}`);
        }
    }

    // 提取相机信息的通用方法
    extractCameraInfo(text, brand) {
        const cameras = [];
        
        // 常见相机型号匹配模式
        const patterns = this.getCameraPatterns(brand);
        
        for (const pattern of patterns) {
            const matches = text.match(new RegExp(pattern.regex, 'gi'));
            if (matches) {
                matches.forEach(match => {
                    const info = pattern.extract(match);
                    if (info && !cameras.find(c => c.model === info.model)) {
                        cameras.push({
                            brand: brand,
                            ...info,
                            source: this.name,
                            publishDate: new Date().toISOString().split('T')[0],
                            needsReview: true
                        });
                    }
                });
            }
        }
        
        return cameras;
    }

    // 各品牌的相机型号匹配模式 - 子类可覆盖
    getCameraPatterns(brand) {
        const patterns = {
            sony: [
                { regex: 'A7[\s]*[CRV]?[\s]*[IVX]+', extract: (m) => ({ model: m.replace(/\s/g, '').toUpperCase(), type: 'mirrorless', mount: 'FE' }) },
                { regex: 'A6[\d]{3}', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', mount: 'E' }) },
                { regex: 'A1', extract: (m) => ({ model: 'A1', type: 'mirrorless', mount: 'FE' }) },
                { regex: 'FX[\d]', extract: (m) => ({ model: m.toUpperCase(), type: 'cinema', mount: 'FE' }) }
            ],
            canon: [
                { regex: 'EOS\s+R[\d]?[\s]*[IVX]*', extract: (m) => ({ model: m.replace(/\s+/g, ' ').trim(), type: 'mirrorless', mount: 'RF' }) },
                { regex: 'EOS\s+5D[\s]*[IVX]*', extract: (m) => ({ model: m.replace(/\s+/g, ' ').trim(), type: 'dslr', mount: 'EF' }) },
                { regex: 'EOS\s+6D[\s]*[IVX]*', extract: (m) => ({ model: m.replace(/\s+/g, ' ').trim(), type: 'dslr', mount: 'EF' }) },
                { regex: 'EOS\s+90D', extract: (m) => ({ model: 'EOS 90D', type: 'dslr', mount: 'EF' }) }
            ],
            nikon: [
                { regex: 'Z[\d][\s]*[II]*', extract: (m) => ({ model: m.replace(/\s/g, '').toUpperCase(), type: 'mirrorless', mount: 'Z' }) },
                { regex: 'Z[\d]{2}', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', mount: 'Z' }) }
            ],
            fujifilm: [
                { regex: 'X-[TSHV][\d]+', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', mount: 'X' }) },
                { regex: 'GFX[\d]+[S]*', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', sensor: 'medium', mount: 'GF' }) }
            ],
            leica: [
                { regex: 'M[\d]+', extract: (m) => ({ model: m.toUpperCase(), type: 'rangefinder', mount: 'M' }) },
                { regex: 'Q[\d]', extract: (m) => ({ model: m.toUpperCase(), type: 'compact', mount: 'fixed' }) },
                { regex: 'SL[\d]', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', mount: 'L' }) }
            ],
            hasselblad: [
                { regex: 'X[\d]D', extract: (m) => ({ model: m.toUpperCase(), type: 'mirrorless', sensor: 'medium', mount: 'XCD' }) },
                { regex: '907X', extract: (m) => ({ model: '907X', type: 'mirrorless', sensor: 'medium', mount: 'XCD' }) }
            ]
        };

        return patterns[brand] || [];
    }

    // 提取镜头信息
    extractLensInfo(text, brand) {
        const lenses = [];
        const patterns = this.getLensPatterns(brand);
        
        for (const pattern of patterns) {
            const matches = text.match(new RegExp(pattern.regex, 'gi'));
            if (matches) {
                matches.forEach(match => {
                    const info = pattern.extract(match);
                    if (info && !lenses.find(l => l.model === info.model)) {
                        lenses.push({
                            brand: brand,
                            ...info,
                            source: this.name,
                            publishDate: new Date().toISOString().split('T')[0],
                            needsReview: true
                        });
                    }
                });
            }
        }
        
        return lenses;
    }

    getLensPatterns(brand) {
        // 基础镜头模式 - 各品牌子类可覆盖
        return [
            { 
                regex: '\d+mm\s+f/\d+\.?\d*', 
                extract: (m) => ({ 
                    model: m,
                    type: m.includes('-') ? 'zoom' : 'prime'
                }) 
            }
        ];
    }

    // 清理HTML标签
    cleanHtml(html) {
        return html
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/&\w+;/g, ' ')
            .trim();
    }

    // 检查日期是否在指定天数内
    isRecent(dateStr, days = 14) {
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diff = (now - date) / (1000 * 60 * 60 * 24);
            return diff <= days;
        } catch {
            return false;
        }
    }

    async scrape() {
        throw new Error('子类必须实现 scrape 方法');
    }
}

module.exports = BaseScraper;

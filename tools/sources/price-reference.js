/**
 * 价格参考数据库
 * 手动维护的参考价格，定期更新
 * 用于套装推荐和价格分析展示
 */

const PRICE_REFERENCE = {
    // 数据版本
    version: '2026.04.27',
    lastUpdated: '2026-04-27',
    
    // 价格区间定义（用于分级显示）
    priceTiers: {
        entry: { min: 0, max: 8000, label: '入门', color: '#4CAF50' },
        mid: { min: 8000, max: 15000, label: '中端', color: '#2196F3' },
        pro: { min: 15000, max: 25000, label: '专业', color: '#FF9800' },
        flagship: { min: 25000, max: 50000, label: '旗舰', color: '#F44336' },
        luxury: { min: 50000, max: Infinity, label: '奢华', color: '#9C27B0' }
    },
    
    // 相机参考价格（机身）
    cameras: {
        // Canon
        canon: {
            'EOS R5': { price: 23999, tier: 'flagship', date: '2026-03', source: '京东自营' },
            'EOS R6 Mark II': { price: 13999, tier: 'pro', date: '2026-03', source: '京东自营' },
            'EOS R8': { price: 8999, tier: 'mid', date: '2026-03', source: '京东自营' },
            'EOS R7': { price: 8999, tier: 'mid', date: '2026-03', source: '京东自营' },
            'EOS R10': { price: 5499, tier: 'entry', date: '2026-03', source: '京东自营' },
            'EOS R50': { price: 4299, tier: 'entry', date: '2026-03', source: '京东自营' },
            'EOS R3': { price: 36999, tier: 'flagship', date: '2026-03', source: '京东自营' },
            'EOS R5C': { price: 26999, tier: 'flagship', date: '2026-03', source: '京东自营' },
            // DSLR
            'EOS 5D Mark IV': { price: 14999, tier: 'pro', date: '2026-03', source: '京东自营', note: '已停产，库存价' },
            'EOS 6D Mark II': { price: 8999, tier: 'mid', date: '2026-03', source: '京东自营', note: '已停产，库存价' },
            'EOS 90D': { price: 7999, tier: 'mid', date: '2026-03', source: '京东自营' },
            // 2026新品（预期）
            'EOS R6 V': { price: 0, tier: 'pro', date: '2026-05', source: '待官宣', note: '5月13日官宣，国行价格待定' },
            'EOS R6 Mark III': { price: 16999, tier: 'pro', date: '2026-04', source: '佳能中国官方建议零售价' }
        },
        
        // Sony
        sony: {
            'A1': { price: 47999, tier: 'luxury', date: '2026-03', source: '京东自营' },
            'A9 III': { price: 44999, tier: 'luxury', date: '2026-03', source: '京东自营' },
            'A7R V': { price: 23999, tier: 'flagship', date: '2026-03', source: '京东自营' },
            'Alpha 7R VI': { price: 24999, tier: 'flagship', date: '2026-05', source: '估算参考价', note: '5月发布，高可信传闻，预估24999元' },
            'Alpha 7 V': { price: 17999, tier: 'pro', date: '2026-04', source: '索尼中国官方建议零售价' },
            'A7 IV': { price: 14999, tier: 'pro', date: '2026-03', source: '京东自营' },
            'A7C II': { price: 12999, tier: 'pro', date: '2026-03', source: '京东自营' },
            'A7C': { price: 9999, tier: 'mid', date: '2026-03', source: '京东自营' },
            'A6700': { price: 8999, tier: 'mid', date: '2026-03', source: '京东自营' },
            'A6400': { price: 5499, tier: 'entry', date: '2026-03', source: '京东自营' },
            'ZV-E1': { price: 13999, tier: 'pro', date: '2026-03', source: '京东自营', note: 'Vlog专用' },
            'ZV-E10 II': { price: 5899, tier: 'entry', date: '2026-03', source: '京东自营', note: 'Vlog专用' },
            'FX3': { price: 26999, tier: 'flagship', date: '2026-03', source: '京东自营', note: '电影机' },
            'FX30': { price: 11999, tier: 'pro', date: '2026-03', source: '京东自营', note: '电影机' }
        },
        
        // Nikon
        nikon: {
            'Z9': { price: 35999, tier: 'flagship', date: '2026-03', source: '京东自营' },
            'Z8': { price: 23999, tier: 'flagship', date: '2026-03', source: '京东自营' },
            'Z6 III': { price: 16499, tier: 'pro', date: '2026-03', source: '京东自营' },
            'Z6 II': { price: 9999, tier: 'mid', date: '2026-03', source: '京东自营' },
            'Z5 II': { price: 10999, tier: 'mid', date: '2026-03', source: '京东自营' },
            'Z5': { price: 7999, tier: 'mid', date: '2026-03', source: '京东自营' },
            'Zf': { price: 12999, tier: 'pro', date: '2026-03', source: '京东自营', note: '复古设计' },
            'Zfc': { price: 5499, tier: 'entry', date: '2026-03', source: '京东自营', note: '复古设计' },
            'Z50 II': { price: 6199, tier: 'entry', date: '2026-03', source: '京东自营' },
            'Z30': { price: 4799, tier: 'entry', date: '2026-03', source: '京东自营' }
        },
        
        // Fujifilm
        fujifilm: {
            'GFX 100 II': { price: 53999, tier: 'luxury', date: '2026-03', source: '京东自营', note: '中画幅' },
            'GFX 100S II': { price: 36500, tier: 'luxury', date: '2026-03', source: '京东自营', note: '中画幅' },
            'GFX 50S II': { price: 22900, tier: 'flagship', date: '2026-03', source: '京东自营', note: '中画幅' },
            'X-T50': { price: 9999, tier: 'mid', date: '2026-04', source: '公开市场价', note: 'APS-C 轻量机身' },
            'X-H2S': { price: 14999, tier: 'pro', date: '2026-03', source: '京东自营' },
            'X-H2': { price: 12999, tier: 'pro', date: '2026-03', source: '京东自营' },
            'X-T5': { price: 11999, tier: 'pro', date: '2026-03', source: '京东自营' },
            'X-S20': { price: 8499, tier: 'mid', date: '2026-03', source: '京东自营' },
            'X-T30 II': { price: 5999, tier: 'entry', date: '2026-03', source: '京东自营' },
            'X-E4': { price: 5499, tier: 'entry', date: '2026-03', source: '京东自营' },
            'X100VI': { price: 11390, tier: 'pro', date: '2026-03', source: '京东自营', note: '固定镜头' }
        },
        
        // Panasonic
        panasonic: {
            'Lumix S1 II': { price: 22398, tier: 'flagship', date: '2026-04', source: '松下中国官方建议零售价', note: '2025年5月发布，部分堆叠CMOS，4K120p' },
            'Lumix S1 IIE': { price: 17498, tier: 'pro', date: '2026-04', source: '松下中国官方建议零售价', note: '入门版，无内录RAW' },
            'Lumix S5 II': { price: 10998, tier: 'mid', date: '2026-03', source: '京东自营' },
            'Lumix S5 IIx': { price: 11998, tier: 'mid', date: '2026-03', source: '京东自营' },
            'Lumix S9': { price: 8399, tier: 'mid', date: '2026-03', source: '京东自营' },
            'Lumix GH6': { price: 10998, tier: 'mid', date: '2026-03', source: '京东自营', note: 'M43' },
            'Lumix G9 II': { price: 8998, tier: 'mid', date: '2026-03', source: '京东自营', note: 'M43' }
        },
        
        // OM System (原Olympus)
        olympus: {
            'OM-1 Mark II': { price: 12999, tier: 'pro', date: '2026-03', source: '京东自营', note: 'M43' },
            'OM-5': { price: 6999, tier: 'mid', date: '2026-03', source: '京东自营', note: 'M43' },
            'OM-3': { price: 8999, tier: 'mid', date: '2026-03', source: '京东自营', note: 'M43' }
        }
    },
    
    // 镜头参考价格
    lenses: {
        // Canon RF
        canon: {
            'RF 50mm f/1.2L USM': { price: 13999, tier: 'pro', date: '2026-03' },
            'RF 85mm f/1.2L USM': { price: 15999, tier: 'pro', date: '2026-03' },
            'RF 24-70mm f/2.8L IS USM': { price: 13999, tier: 'pro', date: '2026-03' },
            'RF 70-200mm f/2.8L IS USM': { price: 15999, tier: 'pro', date: '2026-03' },
            'RF 15-35mm f/2.8L IS USM': { price: 12999, tier: 'pro', date: '2026-03' },
            'RF 24-105mm f/4L IS USM': { price: 7999, tier: 'mid', date: '2026-03' },
            'RF 50mm f/1.8 STM': { price: 1299, tier: 'entry', date: '2026-03' },
            'RF 35mm f/1.8 IS STM': { price: 3499, tier: 'mid', date: '2026-03' }
        },
        
        // Sony FE
        sony: {
            'FE 50mm f/1.2 GM': { price: 13999, tier: 'pro', date: '2026-03' },
            'FE 85mm f/1.4 GM': { price: 10999, tier: 'pro', date: '2026-03' },
            'FE 24-70mm f/2.8 GM II': { price: 14999, tier: 'pro', date: '2026-03' },
            'FE 70-200mm f/2.8 GM OSS II': { price: 17999, tier: 'pro', date: '2026-03' },
            'FE 16-35mm f/2.8 GM II': { price: 15999, tier: 'pro', date: '2026-03' },
            'FE 24-105mm f/4 G OSS': { price: 6999, tier: 'mid', date: '2026-03' },
            'FE 50mm f/1.8': { price: 1699, tier: 'entry', date: '2026-03' },
            'FE 35mm f/1.8': { price: 4299, tier: 'mid', date: '2026-03' }
        },
        
        // Nikon Z
        nikon: {
            'Z 50mm f/1.2 S': { price: 13999, tier: 'pro', date: '2026-03' },
            'Z 85mm f/1.2 S': { price: 16999, tier: 'pro', date: '2026-03' },
            'Z 24-70mm f/2.8 S': { price: 13999, tier: 'pro', date: '2026-03' },
            'Z 70-200mm f/2.8 VR S': { price: 15999, tier: 'pro', date: '2026-03' },
            'Z 70-200mm f/2.8 VR S II': { price: 19999, tier: 'pro', date: '2026-04', source: '尼康中国官方 / 市场公开价' },
            'Z 14-24mm f/2.8 S': { price: 13999, tier: 'pro', date: '2026-03' },
            'Z 24-120mm f/4 S': { price: 7999, tier: 'mid', date: '2026-03' },
            'Z 24-105mm f/4-7.1': { price: 3980, tier: 'entry', date: '2026-04', source: '尼康中国官方 / 市场公开价' },
            'Z 40mm f/2': { price: 1799, tier: 'entry', date: '2026-03' },
            'Z 28mm f/2.8': { price: 1999, tier: 'entry', date: '2026-03' }
        }
    },
    
    // 价格趋势（用于分析）
    priceTrends: {
        'Sony A7 IV': [
            { date: '2026-01', price: 15999 },
            { date: '2026-02', price: 15499 },
            { date: '2026-03', price: 14999 }
        ],
        'Canon EOS R6 Mark II': [
            { date: '2026-01', price: 14999 },
            { date: '2026-02', price: 14499 },
            { date: '2026-03', price: 13999 }
        ]
    },
    
    // 套装参考价格（机身+镜头组合）
    kits: {
        'canon-r6ii-standard': {
            name: 'Canon R6 II 标准套装',
            items: ['EOS R6 Mark II', 'RF 24-105mm f/4L IS USM'],
            totalPrice: 21998,
            savings: 2000,
            description: '适合人像、旅行、日常记录'
        },
        'sony-a7iv-standard': {
            name: 'Sony A7 IV 标准套装',
            items: ['A7 IV', 'FE 24-105mm f/4 G OSS'],
            totalPrice: 21998,
            savings: 0,
            description: '均衡型全画幅套装'
        }
    }
};

// 辅助函数
const PriceUtils = {
    // 获取相机价格
    getCameraPrice(brand, model) {
        const brandData = PRICE_REFERENCE.cameras[brand.toLowerCase()];
        if (!brandData) return null;
        
        // 尝试精确匹配
        if (brandData[model]) return brandData[model];
        
        // 尝试模糊匹配
        for (const [key, data] of Object.entries(brandData)) {
            if (model.toLowerCase().includes(key.toLowerCase()) || 
                key.toLowerCase().includes(model.toLowerCase())) {
                return data;
            }
        }
        
        return null;
    },
    
    // 获取价格分级
    getPriceTier(price) {
        for (const [tier, config] of Object.entries(PRICE_REFERENCE.priceTiers)) {
            if (price >= config.min && price < config.max) {
                return { tier, ...config };
            }
        }
        return null;
    },
    
    // 格式化价格显示
    formatPrice(price, currency = 'CNY') {
        if (currency === 'CNY') {
            return `¥${price.toLocaleString('zh-CN')}`;
        }
        return `$${price.toLocaleString('en-US')}`;
    },
    
    // 计算套装价格
    calculateKitPrice(items) {
        let total = 0;
        const details = [];
        
        for (const item of items) {
            const price = this.getCameraPrice(item.brand, item.model) || 
                         this.getLensPrice(item.brand, item.model);
            if (price) {
                total += price.price;
                details.push({ ...item, price: price.price });
            }
        }
        
        return { total, details };
    },
    
    // 获取镜头价格
    getLensPrice(brand, model) {
        const brandData = PRICE_REFERENCE.lenses[brand.toLowerCase()];
        if (!brandData) return null;
        
        if (brandData[model]) return brandData[model];
        
        // 模糊匹配
        for (const [key, data] of Object.entries(brandData)) {
            if (model.toLowerCase().includes(key.toLowerCase()) || 
                key.toLowerCase().includes(model.toLowerCase())) {
                return data;
            }
        }
        
        return null;
    }
};

module.exports = { PRICE_REFERENCE, PriceUtils };

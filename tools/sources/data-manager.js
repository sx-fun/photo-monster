/**
 * 混合数据源管理器
 * 优先级：本地数据 > RSS > 模拟数据
 * 确保数据可用性和稳定性
 */

const LOCAL_DATA = require('./local-data');
const RssFeedScraper = require('./rss-feed');
const { PRICE_REFERENCE, PriceUtils } = require('./price-reference');

class DataManager {
    constructor() {
        this.sources = [];
        this.results = {
            cameras: [],
            lenses: [],
            news: [],
            meta: {
                fetchTime: new Date().toISOString(),
                sourcesUsed: [],
                fallbackUsed: false
            }
        };
    }
    
    async fetchAll() {
        console.log('📊 开始获取数据（多源聚合）...\n');
        
        // 1. 本地数据（100%可靠）
        await this.fetchLocalData();
        
        // 2. RSS 源（中等可靠）
        await this.fetchRssFeeds();
        
        // 3. 数据融合与去重
        this.mergeAndDeduplicate();
        
        // 4. 添加元数据
        this.addMetadata();
        
        console.log('\n✅ 数据获取完成');
        console.log(`   相机: ${this.results.cameras.length} 款`);
        console.log(`   镜头: ${this.results.lenses.length} 款`);
        console.log(`   新闻: ${this.results.news.length} 条`);
        console.log(`   数据源: ${this.results.meta.sourcesUsed.join(', ')}`);
        
        return this.results;
    }
    
    async fetchLocalData() {
        console.log('📁 加载本地结构化数据...');
        
        try {
            // 相机数据
            for (const camera of LOCAL_DATA.cameras || []) {
                this.results.cameras.push({
                    ...camera,
                    dataSource: 'local',
                    reliability: this.getReliabilityScore(camera)
                });
            }
            
            // 镜头数据
            for (const lens of LOCAL_DATA.lenses || []) {
                this.results.lenses.push({
                    ...lens,
                    dataSource: 'local',
                    reliability: this.getReliabilityScore(lens)
                });
            }
            
            // 新闻数据
            for (const news of LOCAL_DATA.news || []) {
                this.results.news.push({
                    ...news,
                    dataSource: 'local',
                    reliability: news.type === 'official' ? 5 : 3
                });
            }
            
            this.results.meta.sourcesUsed.push('local');
            console.log(`   ✅ 本地数据: ${LOCAL_DATA.cameras?.length || 0} 相机, ${LOCAL_DATA.lenses?.length || 0} 镜头`);
            
        } catch (error) {
            console.log(`   ❌ 本地数据加载失败: ${error.message}`);
        }
    }
    
    async fetchRssFeeds() {
        console.log('\n📡 抓取 RSS 新闻源...');
        
        try {
            const rss = new RssFeedScraper();
            const rssResults = await rss.scrape();
            
            // 合并 RSS 新闻（去重检查）
            for (const news of rssResults.news || []) {
                const exists = this.results.news.some(n => 
                    this.similarity(n.title, news.title) > 0.8
                );
                
                if (!exists) {
                    this.results.news.push({
                        ...news,
                        dataSource: 'rss',
                        reliability: news.credibility === 'high' ? 4 : 2
                    });
                }
            }
            
            this.results.meta.sourcesUsed.push('rss');
            console.log(`   ✅ RSS: ${rssResults.news?.length || 0} 条新闻`);
            
        } catch (error) {
            console.log(`   ⚠️ RSS 抓取失败: ${error.message}`);
        }
    }
    
    mergeAndDeduplicate() {
        // 按 ID 去重，优先保留本地数据
        const uniqueCameras = new Map();
        for (const camera of this.results.cameras) {
            const key = `${camera.brand}-${camera.model}`.toLowerCase();
            if (!uniqueCameras.has(key) || camera.dataSource === 'local') {
                uniqueCameras.set(key, camera);
            }
        }
        this.results.cameras = Array.from(uniqueCameras.values());
        
        // 镜头去重
        const uniqueLenses = new Map();
        for (const lens of this.results.lenses) {
            const key = `${lens.brand}-${lens.model}`.toLowerCase();
            if (!uniqueLenses.has(key) || lens.dataSource === 'local') {
                uniqueLenses.set(key, lens);
            }
        }
        this.results.lenses = Array.from(uniqueLenses.values());
        
        // 新闻去重（按标题相似度）
        const uniqueNews = [];
        for (const news of this.results.news) {
            const isDuplicate = uniqueNews.some(n => 
                this.similarity(n.title, news.title) > 0.8
            );
            if (!isDuplicate) {
                uniqueNews.push(news);
            }
        }
        this.results.news = uniqueNews;
    }
    
    addMetadata() {
        // 添加分析用的元数据
        this.results.meta = {
            ...this.results.meta,
            totalCameras: this.results.cameras.length,
            totalLenses: this.results.lenses.length,
            totalNews: this.results.news.length,
            byStatus: this.countByStatus(),
            byBrand: this.countByBrand(),
            averageReliability: this.calculateAverageReliability(),
            priceReference: this.addPriceInfo()
        };
    }
    
    addPriceInfo() {
        // 为相机添加参考价格
        for (const camera of this.results.cameras) {
            const priceInfo = PriceUtils.getCameraPrice(camera.brand, camera.model);
            if (priceInfo) {
                camera.referencePrice = priceInfo;
                camera.priceComparison = this.comparePrice(camera.expectedPrice?.cn, priceInfo.price);
            }
        }
        
        // 为镜头添加参考价格
        for (const lens of this.results.lenses) {
            const priceInfo = PriceUtils.getLensPrice(lens.brand, lens.model);
            if (priceInfo) {
                lens.referencePrice = priceInfo;
            }
        }
        
        return {
            version: PRICE_REFERENCE.version,
            lastUpdated: PRICE_REFERENCE.lastUpdated,
            camerasWithPrice: this.results.cameras.filter(c => c.referencePrice).length,
            lensesWithPrice: this.results.lenses.filter(l => l.referencePrice).length
        };
    }
    
    comparePrice(expected, actual) {
        if (!expected || !actual) return null;
        const diff = expected - actual;
        const percent = ((diff / actual) * 100).toFixed(1);
        return {
            expected,
            actual,
            difference: diff,
            percent: parseFloat(percent),
            assessment: diff > 0 ? '高于' : diff < 0 ? '低于' : '持平'
        };
    }
    
    getReliabilityScore(item) {
        // 计算数据可信度分数 (1-5)
        let score = 3; // 基础分
        
        if (item.status === 'official') score += 2;
        else if (item.status === 'announced') score += 1;
        else if (item.status === 'rumored') score -= 1;
        
        if (item.confidence === 'high') score += 1;
        else if (item.confidence === 'low') score -= 1;
        
        if (item.sources?.includes('官方')) score += 1;
        
        return Math.max(1, Math.min(5, score));
    }
    
    similarity(str1, str2) {
        // 简单的字符串相似度计算
        const s1 = str1.toLowerCase().replace(/[^\w]/g, '');
        const s2 = str2.toLowerCase().replace(/[^\w]/g, '');
        
        if (s1 === s2) return 1;
        if (s1.length === 0 || s2.length === 0) return 0;
        
        const longer = s1.length > s2.length ? s1 : s2;
        const shorter = s1.length > s2.length ? s2 : s1;
        
        let matches = 0;
        for (let i = 0; i < shorter.length; i++) {
            if (longer.includes(shorter[i])) matches++;
        }
        
        return matches / longer.length;
    }
    
    countByStatus() {
        const counts = {};
        for (const camera of this.results.cameras) {
            counts[camera.status] = (counts[camera.status] || 0) + 1;
        }
        return counts;
    }
    
    countByBrand() {
        const counts = {};
        for (const camera of this.results.cameras) {
            counts[camera.brand] = (counts[camera.brand] || 0) + 1;
        }
        return counts;
    }
    
    calculateAverageReliability() {
        const allItems = [...this.results.cameras, ...this.results.lenses];
        if (allItems.length === 0) return 0;
        
        const total = allItems.reduce((sum, item) => sum + (item.reliability || 3), 0);
        return (total / allItems.length).toFixed(2);
    }
    
    // 导出用于分析的数据格式
    exportForAnalysis() {
        return {
            summary: {
                fetchTime: this.results.meta.fetchTime,
                totalItems: this.results.cameras.length + this.results.lenses.length,
                dataQuality: this.results.meta.averageReliability,
                sources: this.results.meta.sourcesUsed
            },
            cameras: this.results.cameras.map(c => ({
                brand: c.brand,
                model: c.model,
                status: c.status,
                reliability: c.reliability,
                expectedPrice: c.expectedPrice,
                source: c.sources?.[0] || 'unknown'
            })),
            news: this.results.news.map(n => ({
                title: n.title,
                type: n.type,
                date: n.date,
                reliability: n.reliability,
                source: n.source
            }))
        };
    }
}

module.exports = DataManager;

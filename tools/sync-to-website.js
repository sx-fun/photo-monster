/**
 * 数据同步工具 - 将抓取的数据应用到网站
 * 支持：相机数据库更新、新闻展示、价格参考
 */

const fs = require('fs');
const path = require('path');

class WebsiteSync {
    constructor() {
        this.tempDir = path.join(__dirname, 'temp');
        this.jsDir = path.join(__dirname, '..', 'js');
        this.dataDir = path.join(__dirname, '..', 'data');
        this.backupDir = path.join(__dirname, 'backups');
        
        // 确保目录存在
        [this.backupDir, this.dataDir].forEach(dir => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });
    }
    
    /**
     * 主同步流程
     */
    async sync(options = {}) {
        console.log('🔄 开始同步数据到网站...\n');
        
        const results = {
            success: [],
            failed: [],
            skipped: []
        };
        
        // 1. 同步抓取的新器材数据
        if (options.syncNewGear !== false) {
            try {
                await this.syncNewGearData();
                results.success.push('新器材数据');
            } catch (error) {
                results.failed.push({ item: '新器材数据', error: error.message });
            }
        }
        
        // 2. 同步价格参考数据
        if (options.syncPrices !== false) {
            try {
                await this.syncPriceData();
                results.success.push('价格参考数据');
            } catch (error) {
                results.failed.push({ item: '价格参考数据', error: error.message });
            }
        }
        
        // 3. 同步新闻数据
        if (options.syncNews !== false) {
            try {
                await this.syncNewsData();
                results.success.push('新闻数据');
            } catch (error) {
                results.failed.push({ item: '新闻数据', error: error.message });
            }
        }
        
        // 4. 生成同步报告
        this.generateSyncReport(results);
        
        console.log('\n✅ 同步完成！');
        console.log(`   成功: ${results.success.length} 项`);
        console.log(`   失败: ${results.failed.length} 项`);
        console.log(`   跳过: ${results.skipped.length} 项`);
        
        return results;
    }
    
    /**
     * 同步新器材数据到网站
     */
    async syncNewGearData() {
        console.log('📷 同步新器材数据...');
        
        // 读取最新的抓取结果
        const scrapeFiles = fs.readdirSync(this.tempDir)
            .filter(f => f.startsWith('scrape-results-') && f.endsWith('.json'))
            .sort().reverse();
        
        if (scrapeFiles.length === 0) {
            console.log('   ⏭️  没有找到抓取结果，跳过');
            return;
        }
        
        const latestFile = path.join(this.tempDir, scrapeFiles[0]);
        const data = JSON.parse(fs.readFileSync(latestFile, 'utf-8'));
        
        // 转换为网站可用格式
        const websiteData = this.convertToWebsiteFormat(data);
        
        // 保存到 data 目录供网站加载
        const outputPath = path.join(this.dataDir, 'new-gear-data.json');
        fs.writeFileSync(outputPath, JSON.stringify(websiteData, null, 2), 'utf-8');
        
        console.log(`   ✅ 已保存: ${outputPath}`);
        console.log(`      相机: ${websiteData.cameras.length} 款`);
        console.log(`      镜头: ${websiteData.lenses.length} 款`);
        
        // 同时生成一个可直接导入的 JS 文件
        this.generateImportableJS(websiteData);
    }
    
    /**
     * 转换数据格式
     */
    convertToWebsiteFormat(data) {
        const cameras = (data.newCameras || data.cameras || []).map(c => ({
            id: c.id || `${c.brand}-${c.model}`.toLowerCase().replace(/\s+/g, '-'),
            brand: c.brand,
            model: c.model,
            type: c.type || 'mirrorless',
            sensor: c.sensor || 'fullframe',
            mp: c.mp || c.expectedSpecs?.mp || 0,
            mount: c.mount || c.expectedSpecs?.mount || '',
            status: c.status || 'unknown',
            expectedPrice: c.expectedPrice?.cn || c.expectedPrice || 0,
            referencePrice: c.referencePrice?.price || 0,
            releaseDate: c.expectedRelease || c.releaseDate || 'TBA',
            source: c.sources?.[0] || c.source || 'unknown',
            confidence: c.confidence || 'medium',
            reliability: c.reliability || 3,
            description: c.notes || c.summary || '',
            specs: c.expectedSpecs || {}
        }));
        
        const lenses = (data.newLenses || data.lenses || []).map(l => ({
            id: l.id || `${l.brand}-${l.model}`.toLowerCase().replace(/\s+/g, '-'),
            brand: l.brand,
            model: l.model,
            type: l.type || 'prime',
            mount: l.mount || '',
            focalLength: l.focalLength || '',
            aperture: l.aperture || '',
            status: l.status || 'unknown',
            expectedPrice: l.expectedPrice?.cn || l.expectedPrice || 0,
            releaseDate: l.expectedRelease || l.releaseDate || 'TBA',
            source: l.sources?.[0] || l.source || 'unknown',
            confidence: l.confidence || 'medium'
        }));
        
        return {
            generatedAt: new Date().toISOString(),
            sourceFile: data.timestamp || 'unknown',
            cameras,
            lenses,
            news: data.news || []
        };
    }
    
    /**
     * 生成可直接导入的 JS 文件
     */
    generateImportableJS(data) {
        const jsContent = `/**
 * 自动生成的器材数据
 * 生成时间: ${new Date().toLocaleString('zh-CN')}
 * 来源: 抓取系统
 */

const NewGearData = ${JSON.stringify(data, null, 2)};

// 导出供使用
if (typeof module !== 'undefined') {
    module.exports = { NewGearData };
}
`;
        
        const jsPath = path.join(this.dataDir, 'new-gear-data.js');
        fs.writeFileSync(jsPath, jsContent, 'utf-8');
        
        console.log(`   ✅ JS格式: ${jsPath}`);
    }
    
    /**
     * 同步价格数据
     */
    async syncPriceData() {
        console.log('💰 同步价格参考数据...');
        
        const { PRICE_REFERENCE } = require('./sources/price-reference');
        
        // 转换为网站可用格式
        const priceData = {
            version: PRICE_REFERENCE.version,
            lastUpdated: PRICE_REFERENCE.lastUpdated,
            tiers: PRICE_REFERENCE.priceTiers,
            cameras: PRICE_REFERENCE.cameras,
            lenses: PRICE_REFERENCE.lenses,
            trends: PRICE_REFERENCE.priceTrends
        };
        
        // 保存为 JSON
        const jsonPath = path.join(this.dataDir, 'price-data.json');
        fs.writeFileSync(jsonPath, JSON.stringify(priceData, null, 2), 'utf-8');
        
        // 保存为 JS
        const jsContent = `/**
 * 价格参考数据
 * 版本: ${PRICE_REFERENCE.version}
 * 更新: ${PRICE_REFERENCE.lastUpdated}
 */

const PriceReferenceData = ${JSON.stringify(priceData, null, 2)};

// 价格工具函数
const PriceTools = {
    getCameraPrice(brand, model) {
        const brandData = PriceReferenceData.cameras[brand.toLowerCase()];
        return brandData?.[model] || null;
    },
    
    getLensPrice(brand, model) {
        const brandData = PriceReferenceData.lenses[brand.toLowerCase()];
        return brandData?.[model] || null;
    },
    
    formatPrice(price) {
        return '¥' + price.toLocaleString('zh-CN');
    },
    
    getPriceTier(price) {
        for (const [tier, config] of Object.entries(PriceReferenceData.tiers)) {
            if (price >= config.min && price < config.max) {
                return { tier, ...config };
            }
        }
        return null;
    }
};

if (typeof module !== 'undefined') {
    module.exports = { PriceReferenceData, PriceTools };
}
`;
        
        const jsPath = path.join(this.dataDir, 'price-data.js');
        fs.writeFileSync(jsPath, jsContent, 'utf-8');
        
        console.log(`   ✅ 价格数据已同步`);
        console.log(`      相机: ${Object.values(PRICE_REFERENCE.cameras).reduce((a, b) => a + Object.keys(b).length, 0)} 款`);
        console.log(`      镜头: ${Object.values(PRICE_REFERENCE.lenses).reduce((a, b) => a + Object.keys(b).length, 0)} 款`);
    }
    
    /**
     * 同步新闻数据
     */
    async syncNewsData() {
        console.log('📰 同步新闻数据...');
        
        // 读取最新的抓取结果
        const scrapeFiles = fs.readdirSync(this.tempDir)
            .filter(f => f.startsWith('scrape-results-') && f.endsWith('.json'))
            .sort().reverse();
        
        if (scrapeFiles.length === 0) {
            console.log('   ⏭️  没有找到抓取结果，跳过');
            return;
        }
        
        const latestFile = path.join(this.tempDir, scrapeFiles[0]);
        const data = JSON.parse(fs.readFileSync(latestFile, 'utf-8'));
        
        const newsData = {
            generatedAt: new Date().toISOString(),
            items: (data.news || []).map(n => ({
                id: n.id || `news-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: n.title,
                summary: n.summary,
                url: n.url,
                date: n.date,
                source: n.source,
                type: n.type || 'news',
                credibility: n.credibility || n.reliability || 3,
                tags: n.tags || []
            }))
        };
        
        // 保存
        const jsonPath = path.join(this.dataDir, 'news-data.json');
        fs.writeFileSync(jsonPath, JSON.stringify(newsData, null, 2), 'utf-8');
        
        const jsContent = `/**
 * 新闻数据
 * 生成时间: ${new Date().toLocaleString('zh-CN')}
 */

const NewsData = ${JSON.stringify(newsData, null, 2)};

if (typeof module !== 'undefined') {
    module.exports = { NewsData };
}
`;
        
        const jsPath = path.join(this.dataDir, 'news-data.js');
        fs.writeFileSync(jsPath, jsContent, 'utf-8');
        
        console.log(`   ✅ 新闻数据已同步: ${newsData.items.length} 条`);
    }
    
    /**
     * 生成同步报告
     */
    generateSyncReport(results) {
        const report = {
            syncTime: new Date().toISOString(),
            results,
            dataFiles: {
                newGear: 'data/new-gear-data.json',
                prices: 'data/price-data.json',
                news: 'data/news-data.json'
            }
        };
        
        // 保存报告
        const reportPath = path.join(this.tempDir, `sync-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
        
        // 生成文本报告到桌面
        const desktopDir = 'D:\\HuaweiMoveData\\Users\\HUAWEI\\Desktop';
        const dateStr = new Date().toISOString().split('T')[0];
        const desktopPath = path.join(desktopDir, `PhotoMonster-数据同步报告-${dateStr}.txt`);
        
        let text = `===============================================\n`;
        text += `📸 Photo Monster 数据同步报告\n`;
        text += `===============================================\n`;
        text += `同步时间: ${new Date().toLocaleString('zh-CN')}\n`;
        text += `\n`;
        
        text += `✅ 同步成功 (${results.success.length}项)\n`;
        text += `-----------------------------------------------\n`;
        results.success.forEach(item => {
            text += `  ✓ ${item}\n`;
        });
        text += `\n`;
        
        if (results.failed.length > 0) {
            text += `❌ 同步失败 (${results.failed.length}项)\n`;
            text += `-----------------------------------------------\n`;
            results.failed.forEach(({ item, error }) => {
                text += `  ✗ ${item}: ${error}\n`;
            });
            text += `\n`;
        }
        
        text += `📁 生成的数据文件\n`;
        text += `-----------------------------------------------\n`;
        text += `  • data/new-gear-data.json - 新器材数据\n`;
        text += `  • data/price-data.json - 价格参考数据\n`;
        text += `  • data/news-data.json - 新闻数据\n`;
        text += `\n`;
        
        text += `📝 网站集成方法\n`;
        text += `-----------------------------------------------\n`;
        text += `方法1: 在HTML中直接引用JS文件\n`;
        text += `  <script src="data/new-gear-data.js"></script>\n`;
        text += `  <script src="data/price-data.js"></script>\n`;
        text += `  <script>console.log(NewGearData);</script>\n`;
        text += `\n`;
        text += `方法2: 使用fetch加载JSON\n`;
        text += `  fetch('data/new-gear-data.json')\n`;
        text += `    .then(r => r.json())\n`;
        text += `    .then(data => displayNewGear(data));\n`;
        text += `\n`;
        text += `方法3: 合并到现有app.js（需手动）\n`;
        text += `  运行: node tools/merge-to-app.js\n`;
        text += `===============================================\n`;
        
        fs.writeFileSync(desktopPath, text, 'utf-8');
        
        console.log(`\n📋 同步报告已保存到桌面: ${desktopPath}`);
    }
}

// 主执行函数
async function main() {
    const sync = new WebsiteSync();
    const results = await sync.sync({
        syncNewGear: true,
        syncPrices: true,
        syncNews: true
    });
    
    return results;
}

// 导出
module.exports = { WebsiteSync };

// 直接执行
if (require.main === module) {
    main().catch(console.error);
}

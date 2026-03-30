/**
 * Photo Monster 内容自动抓取系统 v2.0
 * 混合数据源：本地结构化数据 + RSS + 可选网络抓取
 * 确保数据稳定性和可用性
 */

const fs = require('fs');
const path = require('path');
const DataManager = require('./sources/data-manager');

class PhotoMonsterScraper {
    constructor() {
        this.dataDir = path.join(__dirname, '..', 'data');
        this.tempDir = path.join(__dirname, 'temp');
        this.sourcesDir = path.join(__dirname, 'sources');
        this.results = {
            newCameras: [],
            newLenses: [],
            news: [],
            errors: [],
            meta: {
                sourcesUsed: [],
                dataQuality: 0,
                fetchTime: new Date().toISOString()
            }
        };
    }

    async init() {
        // 确保目录存在
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
        console.log('📸 Photo Monster 抓取系统 v2.0 初始化完成');
        console.log('   模式: 本地数据 + RSS + 可选网络源');
    }

    async scrapeAll() {
        console.log('\n🔍 开始获取数据...\n');
        
        // 使用新的 DataManager 获取数据（本地 + RSS）
        try {
            const dataManager = new DataManager();
            const data = await dataManager.fetchAll();
            
            this.results.newCameras = data.cameras || [];
            this.results.newLenses = data.lenses || [];
            this.results.news = data.news || [];
            this.results.meta = data.meta || {};
            
            console.log('\n📊 数据质量报告:');
            console.log(`   平均可信度: ${this.results.meta.averageReliability}/5`);
            console.log(`   数据源: ${this.results.meta.sourcesUsed?.join(', ')}`);
            
        } catch (error) {
            console.error('❌ 数据获取失败:', error.message);
            this.results.errors.push({ source: 'data-manager', error: error.message });
            
            // 降级：使用本地数据
            console.log('\n⚠️ 降级到本地数据源...');
            await this.fallbackToLocalData();
        }
        
        return this.results;
    }
    
    async fallbackToLocalData() {
        try {
            const LOCAL_DATA = require('./sources/local-data');
            
            this.results.newCameras = LOCAL_DATA.cameras.map(c => ({
                ...c,
                dataSource: 'local-fallback',
                reliability: 4
            }));
            
            this.results.newLenses = LOCAL_DATA.lenses.map(l => ({
                ...l,
                dataSource: 'local-fallback',
                reliability: 4
            }));
            
            this.results.news = LOCAL_DATA.news.map(n => ({
                ...n,
                dataSource: 'local-fallback',
                reliability: n.type === 'official' ? 5 : 3
            }));
            
            this.results.meta.sourcesUsed = ['local-fallback'];
            this.results.meta.averageReliability = '4.00';
            
            console.log('   ✅ 已加载本地备用数据');
            
        } catch (error) {
            console.error('   ❌ 本地数据也失败了:', error.message);
        }
    }

    saveResults() {
        const outputPath = path.join(this.tempDir, `scrape-results-${Date.now()}.json`);
        fs.writeFileSync(outputPath, JSON.stringify(this.results, null, 2), 'utf-8');
        console.log(`\n💾 结果已保存: ${outputPath}`);
        return outputPath;
    }

    generateReport() {
        const report = {
            summary: {
                totalCameras: this.results.newCameras.length,
                totalLenses: this.results.newLenses.length,
                totalNews: this.results.news.length,
                errors: this.results.errors.length,
                timestamp: this.results.timestamp
            },
            cameras: this.results.newCameras,
            lenses: this.results.newLenses,
            news: this.results.news.slice(0, 10), // 只显示前10条
            errors: this.results.errors
        };

        // 保存到 temp 目录
        const reportPath = path.join(this.tempDir, `review-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
        
        // 同时生成可读文本报告
        const textReport = this.generateTextReport(report);
        const textPath = path.join(this.tempDir, `review-report-${Date.now()}.txt`);
        fs.writeFileSync(textPath, textReport, 'utf-8');
        
        // 保存到桌面供用户查看
        const desktopDir = 'D:\\HuaweiMoveData\\Users\\HUAWEI\\Desktop';
        const dateStr = new Date().toISOString().split('T')[0];
        const desktopPath = path.join(desktopDir, `PhotoMonster-抓取报告-${dateStr}.txt`);
        fs.writeFileSync(desktopPath, textReport, 'utf-8');
        
        console.log(`\n📋 审核报告已生成:`);
        console.log(`   JSON: ${reportPath}`);
        console.log(`   TXT:  ${textPath}`);
        console.log(`   桌面: ${desktopPath}`);
        
        return { json: reportPath, txt: textPath, desktop: desktopPath };
    }

    generateTextReport(report) {
        let text = `===============================================\n`;
        text += `📸 Photo Monster 内容抓取审核报告\n`;
        text += `===============================================\n`;
        text += `生成时间: ${new Date().toLocaleString('zh-CN')}\n`;
        text += `数据版本: ${this.results.meta.sourcesUsed?.join('+') || 'unknown'}\n`;
        text += `数据质量: ${this.results.meta.averageReliability || 'N/A'}/5\n`;
        text += `\n`;
        
        text += `📊 统计摘要\n`;
        text += `-----------------------------------------------\n`;
        text += `新增相机: ${report.summary.totalCameras} 款\n`;
        text += `新增镜头: ${report.summary.totalLenses} 款\n`;
        text += `相关新闻: ${report.summary.totalNews} 条\n`;
        text += `抓取错误: ${report.summary.errors} 个\n`;
        text += `\n`;

        // 按状态分组显示相机
        if (report.cameras.length > 0) {
            const byStatus = { official: [], announced: [], rumored: [] };
            report.cameras.forEach(c => {
                const status = c.status || 'unknown';
                if (!byStatus[status]) byStatus[status] = [];
                byStatus[status].push(c);
            });
            
            text += `📷 新增相机列表 (按状态分组)\n`;
            text += `-----------------------------------------------\n`;
            
            for (const [status, cameras] of Object.entries(byStatus)) {
                if (cameras.length === 0) continue;
                const statusIcon = status === 'official' ? '✅' : status === 'announced' ? '📢' : '💬';
                text += `\n${statusIcon} ${status.toUpperCase()} (${cameras.length}款)\n`;
                
                cameras.forEach((c, i) => {
                    const reliability = '⭐'.repeat(c.reliability || 3);
                    text += `  ${i + 1}. [${c.brand}] ${c.model} ${reliability}\n`;
                    text += `      状态: ${c.status} | 预计: ${c.expectedRelease || '未知'}\n`;
                    
                    // 价格信息
                    const expectedPrice = c.expectedPrice?.cn;
                    const refPrice = c.referencePrice?.price;
                    if (expectedPrice && refPrice) {
                        const diff = expectedPrice - refPrice;
                        const diffPercent = ((diff / refPrice) * 100).toFixed(0);
                        const diffSymbol = diff > 0 ? '↑' : diff < 0 ? '↓' : '=';
                        text += `      预计价格: ¥${expectedPrice.toLocaleString()}\n`;
                        text += `      参考价格: ¥${refPrice.toLocaleString()} (同品牌${c.referencePrice.tier}级)\n`;
                        text += `      价格对比: ${diffSymbol}${Math.abs(diffPercent)}% ${diff > 0 ? '高于' : diff < 0 ? '低于' : '持平'}参考价\n`;
                    } else if (expectedPrice) {
                        text += `      预计价格: ¥${expectedPrice.toLocaleString()}\n`;
                    } else if (refPrice) {
                        text += `      参考价格: ¥${refPrice.toLocaleString()} (同品牌${c.referencePrice.tier}级)\n`;
                    }
                    
                    text += `      来源: ${c.sources?.[0] || 'unknown'}\n`;
                });
            }
            text += `\n`;
        }

        if (report.lenses.length > 0) {
            text += `🔍 新增镜头列表\n`;
            text += `-----------------------------------------------\n`;
            report.lenses.forEach((l, i) => {
                const reliability = '⭐'.repeat(l.reliability || 3);
                text += `${i + 1}. [${l.brand}] ${l.model} ${reliability}\n`;
                text += `   规格: ${l.focalLength} ${l.aperture} | 卡口: ${l.mount || '未知'}\n`;
                text += `   状态: ${l.status} | 预计: ${l.expectedRelease || '未知'}\n`;
                text += `\n`;
            });
        }

        if (report.news.length > 0) {
            text += `📰 最新新闻\n`;
            text += `-----------------------------------------------\n`;
            report.news.slice(0, 5).forEach((n, i) => {
                const typeIcon = n.type === 'official' ? '✅' : n.type === 'rumor' ? '💬' : '📄';
                text += `${i + 1}. ${typeIcon} ${n.title}\n`;
                text += `   ${n.summary?.substring(0, 80)}...\n`;
                text += `   来源: ${n.source} | 可信度: ${n.reliability}/5\n`;
                text += `\n`;
            });
        }

        if (report.errors.length > 0) {
            text += `⚠️ 抓取错误\n`;
            text += `-----------------------------------------------\n`;
            report.errors.forEach(e => {
                text += `- ${e.source}: ${e.error}\n`;
            });
            text += `\n`;
        }

        text += `===============================================\n`;
        text += `📝 审核说明\n`;
        text += `-----------------------------------------------\n`;
        text += `⭐ 可信度说明: ⭐⭐⭐⭐⭐ = 官方确认, ⭐⭐⭐ = 传闻\n`;
        text += `\n`;
        text += `数据来源层级:\n`;
        text += `  1. 本地结构化数据 (100%可用, 手动维护)\n`;
        text += `  2. RSS 新闻源 (绕过Cloudflare)\n`;
        text += `  3. 网络抓取 (备用, 可能受防护限制)\n`;
        text += `\n`;
        text += `操作指南:\n`;
        text += `  1. 检查上述内容准确性和可信度\n`;
        text += `  2. 编辑 local-data.js 更新本地数据\n`;
        text += `  3. 确认无误后运行 update-db.js 更新\n`;
        text += `===============================================\n`;

        return text;
    }
}

// 主执行函数
async function main() {
    const scraper = new PhotoMonsterScraper();
    await scraper.init();
    await scraper.scrapeAll();
    scraper.saveResults();
    const reports = scraper.generateReport();
    
    console.log('\n✅ 抓取完成！');
    console.log(`📁 请在以下位置查看审核报告:`);
    console.log(`   ${reports.txt}`);
    
    return reports;
}

// 导出供自动化调用
module.exports = { PhotoMonsterScraper, main };

// 直接执行
if (require.main === module) {
    main().catch(console.error);
}

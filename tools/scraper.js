/**
 * Photo Monster 内容自动抓取系统
 * 免费数据源抓取 - 每14天执行
 */

const fs = require('fs');
const path = require('path');

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
            timestamp: new Date().toISOString()
        };
    }

    async init() {
        // 确保目录存在
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
        console.log('📸 Photo Monster 抓取系统初始化完成');
    }

    async scrapeAll() {
        console.log('\n🔍 开始抓取数据源...\n');
        
        const sources = [
            { name: 'dpreview', file: 'dpreview.js', priority: 'P0' },
            { name: 'sony', file: 'sony.js', priority: 'P0' },
            { name: 'canon', file: 'canon.js', priority: 'P0' },
            { name: 'nikon', file: 'nikon.js', priority: 'P0' },
            { name: 'fujifilm', file: 'fujifilm.js', priority: 'P0' },
            { name: 'leica', file: 'leica.js', priority: 'P1' },
            { name: 'hasselblad', file: 'hasselblad.js', priority: 'P1' }
        ];

        for (const source of sources) {
            try {
                const sourcePath = path.join(this.sourcesDir, source.file);
                if (fs.existsSync(sourcePath)) {
                    console.log(`📡 [${source.priority}] 抓取 ${source.name}...`);
                    const SourceScraper = require(sourcePath);
                    const scraper = new SourceScraper();
                    const data = await scraper.scrape();
                    
                    this.results.newCameras.push(...(data.cameras || []));
                    this.results.newLenses.push(...(data.lenses || []));
                    this.results.news.push(...(data.news || []));
                    
                    console.log(`  ✅ ${source.name}: ${data.cameras?.length || 0} 相机, ${data.lenses?.length || 0} 镜头`);
                } else {
                    console.log(`  ⏭️  ${source.name}: 源文件不存在，跳过`);
                }
            } catch (error) {
                console.error(`  ❌ ${source.name}: ${error.message}`);
                this.results.errors.push({ source: source.name, error: error.message });
            }
        }

        // 去重
        this.deduplicate();
        
        return this.results;
    }

    deduplicate() {
        // 根据型号去重
        const seenCameras = new Set();
        this.results.newCameras = this.results.newCameras.filter(c => {
            const key = `${c.brand}-${c.model}`;
            if (seenCameras.has(key)) return false;
            seenCameras.add(key);
            return true;
        });

        const seenLenses = new Set();
        this.results.newLenses = this.results.newLenses.filter(l => {
            const key = `${l.brand}-${l.model}`;
            if (seenLenses.has(key)) return false;
            seenLenses.add(key);
            return true;
        });
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

        const reportPath = path.join(this.tempDir, `review-report-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
        
        // 同时生成可读文本报告
        const textReport = this.generateTextReport(report);
        const textPath = path.join(this.tempDir, `review-report-${Date.now()}.txt`);
        fs.writeFileSync(textPath, textReport, 'utf-8');
        
        console.log(`\n📋 审核报告已生成:`);
        console.log(`   JSON: ${reportPath}`);
        console.log(`   TXT:  ${textPath}`);
        
        return { json: reportPath, txt: textPath };
    }

    generateTextReport(report) {
        let text = `===============================================\n`;
        text += `📸 Photo Monster 内容抓取审核报告\n`;
        text += `===============================================\n`;
        text += `生成时间: ${new Date().toLocaleString('zh-CN')}\n`;
        text += `\n`;
        
        text += `📊 统计摘要\n`;
        text += `-----------------------------------------------\n`;
        text += `新增相机: ${report.summary.totalCameras} 款\n`;
        text += `新增镜头: ${report.summary.totalLenses} 款\n`;
        text += `相关新闻: ${report.summary.totalNews} 条\n`;
        text += `抓取错误: ${report.summary.errors} 个\n`;
        text += `\n`;

        if (report.cameras.length > 0) {
            text += `📷 新增相机列表 (需审核)\n`;
            text += `-----------------------------------------------\n`;
            report.cameras.forEach((c, i) => {
                text += `${i + 1}. [${c.brand}] ${c.model}\n`;
                text += `   类型: ${c.type || '未知'} | 画幅: ${c.sensor || '未知'} | 像素: ${c.mp || '未知'}MP\n`;
                text += `   来源: ${c.source}\n`;
                text += `\n`;
            });
        }

        if (report.lenses.length > 0) {
            text += `🔍 新增镜头列表 (需审核)\n`;
            text += `-----------------------------------------------\n`;
            report.lenses.forEach((l, i) => {
                text += `${i + 1}. [${l.brand}] ${l.model}\n`;
                text += `   类型: ${l.type || '未知'} | 卡口: ${l.mount || '未知'}\n`;
                text += `   来源: ${l.source}\n`;
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
        text += `1. 请检查上述内容是否准确\n`;
        text += `2. 如需修改，请编辑对应的 JSON 文件\n`;
        text += `3. 确认无误后，运行 update-db.js 更新数据库\n`;
        text += `4. 或重命名文件: review-report-xxx.json → approved-report-xxx.json\n`;
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

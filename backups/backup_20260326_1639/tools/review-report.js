/**
 * Photo Monster 审核报告生成器
 * 生成供用户审核的报告并发送 WorkBuddy 通知
 */

const fs = require('fs');
const path = require('path');

class ReviewReporter {
    constructor() {
        this.tempDir = path.join(__dirname, 'temp');
        this.dataDir = path.join(__dirname, '..', 'data');
    }

    // 查找最新的抓取结果
    findLatestResults() {
        const files = fs.readdirSync(this.tempDir)
            .filter(f => f.startsWith('scrape-results-') && f.endsWith('.json'))
            .map(f => ({
                name: f,
                path: path.join(this.tempDir, f),
                time: fs.statSync(path.join(this.tempDir, f)).mtime
            }))
            .sort((a, b) => b.time - a.time);

        return files.length > 0 ? files[0] : null;
    }

    // 生成审核报告
    generateReport() {
        const latest = this.findLatestResults();
        if (!latest) {
            console.log('❌ 未找到抓取结果文件');
            return null;
        }

        const results = JSON.parse(fs.readFileSync(latest.path, 'utf-8'));
        
        const report = {
            meta: {
                generatedAt: new Date().toISOString(),
                sourceFile: latest.name,
                scrapeTimestamp: results.timestamp
            },
            summary: {
                newCameras: results.newCameras.length,
                newLenses: results.newLenses.length,
                newsCount: results.news.length,
                errors: results.errors.length
            },
            items: {
                cameras: results.newCameras,
                lenses: results.newLenses
            },
            news: results.news.slice(0, 5),
            errors: results.errors
        };

        // 保存报告
        const reportPath = path.join(this.tempDir, `pending-review-${Date.now()}.json`);
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

        // 生成文本版本供阅读
        const textReport = this.generateTextReport(report);
        const textPath = path.join(this.tempDir, `pending-review-${Date.now()}.txt`);
        fs.writeFileSync(textPath, textReport, 'utf-8');

        return {
            json: reportPath,
            txt: textPath,
            report: report
        };
    }

    generateTextReport(report) {
        let text = `===============================================\n`;
        text += `📸 Photo Monster 内容更新审核报告\n`;
        text += `===============================================\n`;
        text += `生成时间: ${new Date(report.meta.generatedAt).toLocaleString('zh-CN')}\n`;
        text += `抓取时间: ${new Date(report.meta.scrapeTimestamp).toLocaleString('zh-CN')}\n`;
        text += `\n`;

        text += `📊 统计摘要\n`;
        text += `-----------------------------------------------\n`;
        text += `📷 新增相机: ${report.summary.newCameras} 款\n`;
        text += `🔍 新增镜头: ${report.summary.newLenses} 款\n`;
        text += `📰 相关新闻: ${report.summary.newsCount} 条\n`;
        text += `⚠️  抓取错误: ${report.summary.errors} 个\n`;
        text += `\n`;

        if (report.items.cameras.length > 0) {
            text += `📷 新增相机列表\n`;
            text += `-----------------------------------------------\n`;
            report.items.cameras.forEach((c, i) => {
                text += `[${i + 1}] ${c.brand.toUpperCase()} ${c.model}\n`;
                text += `    类型: ${c.type || '待确认'} | 画幅: ${c.sensor || '待确认'}\n`;
                text += `    像素: ${c.mp || '?'}MP | 卡口: ${c.mount || '?'}\n`;
                text += `    来源: ${c.source} | 日期: ${c.publishDate}\n`;
                text += `\n`;
            });
        }

        if (report.items.lenses.length > 0) {
            text += `🔍 新增镜头列表\n`;
            text += `-----------------------------------------------\n`;
            report.items.lenses.forEach((l, i) => {
                text += `[${i + 1}] ${l.brand.toUpperCase()} ${l.model}\n`;
                text += `    类型: ${l.type || '待确认'} | 卡口: ${l.mount || '?'}\n`;
                text += `    来源: ${l.source} | 日期: ${l.publishDate}\n`;
                text += `\n`;
            });
        }

        if (report.news.length > 0) {
            text += `📰 最新新闻\n`;
            text += `-----------------------------------------------\n`;
            report.news.forEach((n, i) => {
                text += `[${i + 1}] ${n.title}\n`;
                text += `    ${n.summary.substring(0, 100)}...\n`;
                text += `    来源: ${n.source}\n`;
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
        text += `📝 审核操作说明\n`;
        text += `-----------------------------------------------\n`;
        text += `【确认更新】运行命令:\n`;
        text += `   node approve.js\n\n`;
        text += `【拒绝更新】运行命令:\n`;
        text += `   node reject.js\n\n`;
        text += `【手动编辑】如需修改内容，编辑 JSON 文件\n`;
        text += `===============================================\n`;

        return text;
    }

    // 生成 WorkBuddy 通知消息
    generateWorkBuddyNotification(report) {
        let msg = `📸 Photo Monster 内容更新待审核\n\n`;
        msg += `📊 发现新内容:\n`;
        msg += `  • 相机: ${report.summary.newCameras} 款\n`;
        msg += `  • 镜头: ${report.summary.newLenses} 款\n`;
        msg += `  • 新闻: ${report.summary.newsCount} 条\n\n`;

        if (report.items.cameras.length > 0) {
            msg += `📷 新相机:\n`;
            report.items.cameras.slice(0, 3).forEach(c => {
                msg += `  • ${c.brand.toUpperCase()} ${c.model}\n`;
            });
            if (report.items.cameras.length > 3) {
                msg += `  • ...还有 ${report.items.cameras.length - 3} 款\n`;
            }
            msg += `\n`;
        }

        msg += `📁 审核文件位置:\n`;
        msg += `  D:\\PhotoMonster\\tools\\temp\\\n\n`;
        msg += `✅ 确认更新，请运行:\n`;
        msg += `  node approve.js\n\n`;
        msg += `❌ 拒绝更新，请运行:\n`;
        msg += `  node reject.js\n\n`;
        msg += `📝 查看详细报告:\n`;
        msg += `  temp\\pending-review-xxx.txt`;

        return msg;
    }

    // 检查是否有待审核的内容
    checkPendingReviews() {
        const files = fs.readdirSync(this.tempDir)
            .filter(f => f.startsWith('pending-review-') && f.endsWith('.json'));
        
        return files.map(f => ({
            name: f,
            path: path.join(this.tempDir, f),
            time: fs.statSync(path.join(this.tempDir, f)).mtime
        }));
    }

    // 检查是否有已批准的内容
    checkApprovedReviews() {
        const files = fs.readdirSync(this.tempDir)
            .filter(f => f.startsWith('approved-') && f.endsWith('.json'));
        
        return files.map(f => ({
            name: f,
            path: path.join(this.tempDir, f),
            time: fs.statSync(path.join(this.tempDir, f)).mtime
        }));
    }
}

// 主函数
function main() {
    const reporter = new ReviewReporter();
    const result = reporter.generateReport();
    
    if (result) {
        console.log('\n✅ 审核报告已生成:\n');
        console.log(`📄 JSON: ${result.json}`);
        console.log(`📝 TXT:  ${result.txt}`);
        console.log('\n📢 WorkBuddy 通知内容:\n');
        console.log(reporter.generateWorkBuddyNotification(result.report));
        console.log('\n');
    }
    
    return result;
}

module.exports = { ReviewReporter, main };

if (require.main === module) {
    main();
}

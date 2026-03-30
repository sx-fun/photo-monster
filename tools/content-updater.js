/**
 * Photo Monster 内容自动更新系统
 * 每14天执行一次（每月1日和15日）
 * 
 * 功能：
 * 1. 抓取摄影器材新闻（新品发布、固件更新等）
 * 2. 生成待审核报告保存到桌面
 * 3. 不自动更新文件，等待人工确认
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ContentUpdater {
    constructor() {
        this.toolsDir = __dirname;
        this.projectDir = path.join(this.toolsDir, '..');
        this.desktopDir = 'D:\\HuaweiMoveData\\Users\\HUAWEI\\Desktop';
        this.logFile = path.join(this.toolsDir, 'logs', `update-${Date.now()}.log`);
        
        // 确保日志目录存在
        const logDir = path.join(this.toolsDir, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        
        this.logs = [];
    }

    log(message) {
        const timestamp = new Date().toLocaleString('zh-CN');
        const logEntry = `[${timestamp}] ${message}`;
        this.logs.push(logEntry);
        console.log(logEntry);
    }

    async run() {
        this.log('========================================');
        this.log('📸 Photo Monster 内容自动更新系统');
        this.log('========================================');
        this.log(`执行时间: ${new Date().toLocaleString('zh-CN')}`);
        this.log('');

        try {
            // 步骤1: 执行内容抓取
            this.log('步骤 1/3: 抓取最新内容...');
            const scrapeResult = await this.scrapeContent();
            
            // 步骤2: 生成审核报告
            this.log('');
            this.log('步骤 2/3: 生成审核报告...');
            const reportPath = this.generateReport(scrapeResult);
            
            // 步骤3: 保存日志
            this.log('');
            this.log('步骤 3/3: 保存执行日志...');
            this.saveLogs();
            
            this.log('');
            this.log('✅ 自动更新流程完成！');
            this.log(`📄 请查看桌面报告: ${reportPath}`);
            this.log('⚠️  注意: 内容未自动更新，请人工审核后执行更新');
            
            return {
                success: true,
                reportPath,
                logFile: this.logFile
            };
            
        } catch (error) {
            this.log(`❌ 执行失败: ${error.message}`);
            this.saveLogs();
            throw error;
        }
    }

    async scrapeContent() {
        try {
            // 运行抓取脚本
            const scraperPath = path.join(this.toolsDir, 'scraper.js');
            
            if (!fs.existsSync(scraperPath)) {
                throw new Error('抓取脚本不存在: ' + scraperPath);
            }

            this.log('  正在运行抓取脚本...');
            
            // 使用 child_process 执行抓取
            const output = execSync(`node "${scraperPath}"`, {
                encoding: 'utf-8',
                timeout: 120000, // 2分钟超时
                cwd: this.toolsDir
            });
            
            this.log('  抓取脚本输出:');
            output.split('\n').forEach(line => {
                if (line.trim()) this.log('    ' + line);
            });
            
            // 查找生成的报告文件
            const tempDir = path.join(this.toolsDir, 'temp');
            const files = fs.readdirSync(tempDir);
            const latestReport = files
                .filter(f => f.startsWith('review-report-') && f.endsWith('.json'))
                .sort()
                .pop();
            
            if (latestReport) {
                const reportPath = path.join(tempDir, latestReport);
                const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
                this.log(`  ✅ 抓取完成: ${report.summary.totalCameras} 相机, ${report.summary.totalLenses} 镜头, ${report.summary.totalNews} 新闻`);
                return report;
            } else {
                this.log('  ⚠️  未找到抓取报告');
                return null;
            }
            
        } catch (error) {
            this.log(`  ❌ 抓取失败: ${error.message}`);
            return null;
        }
    }

    generateReport(scrapeResult) {
        const dateStr = new Date().toISOString().split('T')[0];
        const reportPath = path.join(this.desktopDir, `PhotoMonster-待审核内容-${dateStr}.md`);
        
        let report = `# Photo Monster 内容更新报告\n\n`;
        report += `**生成时间:** ${new Date().toLocaleString('zh-CN')}\n\n`;
        report += `**状态:** ⏳ 待人工审核\n\n`;
        report += `---\n\n`;
        
        if (scrapeResult) {
            report += `## 📊 抓取统计\n\n`;
            report += `- **新增相机:** ${scrapeResult.summary.totalCameras} 款\n`;
            report += `- **新增镜头:** ${scrapeResult.summary.totalLenses} 款\n`;
            report += `- **相关新闻:** ${scrapeResult.summary.totalNews} 条\n`;
            report += `- **抓取错误:** ${scrapeResult.summary.errors} 个\n\n`;
            
            if (scrapeResult.cameras && scrapeResult.cameras.length > 0) {
                report += `## 📷 新增相机\n\n`;
                scrapeResult.cameras.forEach((camera, i) => {
                    report += `### ${i + 1}. ${camera.brand.toUpperCase()} ${camera.model}\n\n`;
                    report += `- **类型:** ${camera.type || '未知'}\n`;
                    report += `- **画幅:** ${camera.sensor || '未知'}\n`;
                    report += `- **像素:** ${camera.mp || '未知'} MP\n`;
                    report += `- **卡口:** ${camera.mount || '未知'}\n`;
                    report += `- **来源:** ${camera.source}\n`;
                    report += `- **状态:** ${camera.status || '未知'}\n\n`;
                });
            }
            
            if (scrapeResult.lenses && scrapeResult.lenses.length > 0) {
                report += `## 🔍 新增镜头\n\n`;
                scrapeResult.lenses.forEach((lens, i) => {
                    report += `### ${i + 1}. ${lens.brand.toUpperCase()} ${lens.model}\n\n`;
                    report += `- **类型:** ${lens.type || '未知'}\n`;
                    report += `- **焦距:** ${lens.focalLength || '未知'}\n`;
                    report += `- **光圈:** ${lens.aperture || '未知'}\n`;
                    report += `- **卡口:** ${lens.mount || '未知'}\n`;
                    report += `- **来源:** ${lens.source}\n\n`;
                });
            }
            
            if (scrapeResult.news && scrapeResult.news.length > 0) {
                report += `## 📰 相关新闻\n\n`;
                scrapeResult.news.slice(0, 10).forEach((news, i) => {
                    report += `### ${i + 1}. ${news.title}\n\n`;
                    report += `${news.summary}\n\n`;
                    report += `- **来源:** ${news.source} | **日期:** ${news.date}\n\n`;
                });
            }
        } else {
            report += `## ⚠️ 抓取结果\n\n`;
            report += `本次抓取未能获取有效数据。可能原因:\n\n`;
            report += `- 网络连接问题\n`;
            report += `- 数据源网站结构变更\n`;
            report += `- 反爬虫机制阻止\n\n`;
        }
        
        report += `---\n\n`;
        report += `## 📝 后续操作\n\n`;
        report += `1. **审核内容**: 请检查上述抓取内容是否准确\n`;
        report += `2. **确认更新**: 如需更新到网站，请运行:\n`;
        report += `   \\`\\`\\`bash\n`;
        report += `   cd D:\\PhotoMonster\\tools\n`;
        report += `   node update-db.js\n`;
        report += `   \\`\\`\\`\n`;
        report += `3. **放弃更新**: 直接删除此报告文件即可\n\n`;
        report += `---\n\n`;
        report += `*此报告由 Photo Monster 自动更新系统生成*\n`;
        
        fs.writeFileSync(reportPath, report, 'utf-8');
        this.log(`  ✅ 报告已保存: ${reportPath}`);
        
        return reportPath;
    }

    saveLogs() {
        const logContent = this.logs.join('\n');
        fs.writeFileSync(this.logFile, logContent, 'utf-8');
        this.log(`  日志已保存: ${this.logFile}`);
    }
}

// 主执行函数
async function main() {
    const updater = new ContentUpdater();
    return await updater.run();
}

// 导出供自动化调用
module.exports = { ContentUpdater, main };

// 直接执行
if (require.main === module) {
    main().catch(error => {
        console.error('执行失败:', error);
        process.exit(1);
    });
}

/**
 * Photo Monster 自动更新主控脚本
 * 整合抓取、审核、更新全流程
 * 每14天由 WorkBuddy 自动化调用
 */

const { PhotoMonsterScraper } = require('./scraper');
const { ReviewReporter } = require('./review-report');
const { DatabaseUpdater } = require('./update-db');

class AutoUpdateManager {
    constructor() {
        this.mode = process.argv[2] || 'full'; // full, scrape-only, update-only
    }

    async run() {
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║     📸 Photo Monster 自动更新系统                      ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');

        const startTime = Date.now();

        try {
            switch (this.mode) {
                case 'scrape-only':
                    await this.runScrapeOnly();
                    break;
                case 'update-only':
                    await this.runUpdateOnly();
                    break;
                case 'full':
                default:
                    await this.runFullWorkflow();
                    break;
            }

            const duration = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`\n✅ 执行完成，耗时: ${duration} 秒`);

        } catch (error) {
            console.error('\n❌ 执行失败:', error.message);
            process.exit(1);
        }
    }

    // 仅抓取模式
    async runScrapeOnly() {
        console.log('🔄 模式: 仅抓取\n');
        
        const scraper = new PhotoMonsterScraper();
        await scraper.init();
        await scraper.scrapeAll();
        scraper.saveResults();
        const reports = scraper.generateReport();

        // 生成 WorkBuddy 通知
        const reporter = new ReviewReporter();
        const report = reporter.generateReport();
        if (report) {
            const notification = reporter.generateWorkBuddyNotification(report.report);
            this.saveWorkBuddyNotification(notification);
        }

        return reports;
    }

    // 仅更新模式（处理已批准的内容）
    async runUpdateOnly() {
        console.log('🔄 模式: 仅更新\n');
        
        const updater = new DatabaseUpdater();
        await updater.run();
    }

    // 完整工作流
    async runFullWorkflow() {
        console.log('🔄 模式: 完整流程\n');
        
        // 步骤1: 抓取
        console.log('📌 步骤 1/3: 抓取数据源...\n');
        const scraper = new PhotoMonsterScraper();
        await scraper.init();
        const results = await scraper.scrapeAll();
        scraper.saveResults();
        scraper.generateReport();

        // 步骤2: 生成审核报告
        console.log('\n📌 步骤 2/3: 生成审核报告...\n');
        const reporter = new ReviewReporter();
        const report = reporter.generateReport();
        
        if (report) {
            const notification = reporter.generateWorkBuddyNotification(report.report);
            this.saveWorkBuddyNotification(notification);
            
            console.log('\n📢 WorkBuddy 通知内容:');
            console.log('─────────────────────────────────');
            console.log(notification);
            console.log('─────────────────────────────────\n');
        }

        // 步骤3: 检查是否有已批准的内容
        console.log('📌 步骤 3/3: 检查已批准内容...\n');
        const updater = new DatabaseUpdater();
        const approvedFiles = updater.findApprovedReviews();
        
        if (approvedFiles.length > 0) {
            console.log(`✅ 发现 ${approvedFiles.length} 个已批准文件，开始更新...`);
            await updater.run();
        } else {
            console.log('ℹ️  没有已批准的内容需要更新');
            console.log('   请查看审核报告，确认后将 pending-review-xxx.json');
            console.log('   重命名为 approved-xxx.json，然后重新运行');
        }
    }

    // 保存 WorkBuddy 通知到文件
    saveWorkBuddyNotification(notification) {
        const fs = require('fs');
        const path = require('path');
        const notifyPath = path.join(__dirname, 'temp', `workbuddy-notify-${Date.now()}.txt`);
        
        fs.writeFileSync(notifyPath, notification, 'utf-8');
        console.log(`\n📢 WorkBuddy 通知已保存: ${notifyPath}`);
    }
}

// 使用说明
function showHelp() {
    console.log(`
使用方法:
  node auto-update.js [mode]

模式:
  full         - 完整流程: 抓取 + 生成报告 + 更新 (默认)
  scrape-only  - 仅抓取数据并生成审核报告
  update-only  - 仅处理已批准的内容并更新数据库

示例:
  node auto-update.js              # 运行完整流程
  node auto-update.js scrape-only  # 仅抓取
  node auto-update.js update-only  # 仅更新
`);
}

// 主入口
if (require.main === module) {
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
        showHelp();
    } else {
        const manager = new AutoUpdateManager();
        manager.run();
    }
}

module.exports = { AutoUpdateManager };

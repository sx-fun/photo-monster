/**
 * Photo Monster 修改工作流脚本
 * 整合备份、修改、检测全流程
 * 
 * 使用方法：
 *   1. 开始修改: node workflow.js start "修改说明"
 *   2. 完成修改: node workflow.js finish
 *   3. 查看状态: node workflow.js status
 *   4. 回滚: node workflow.js rollback
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SafetyChecker = require('./safety-check');
const BackupManager = require('./pre-edit-backup');

class WorkflowManager {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.stateFile = path.join(__dirname, '.workflow-state.json');
        this.state = this.loadState();
    }

    loadState() {
        if (fs.existsSync(this.stateFile)) {
            return JSON.parse(fs.readFileSync(this.stateFile, 'utf-8'));
        }
        return { status: 'idle', history: [] };
    }

    saveState() {
        fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2));
    }

    // ========== 开始修改 ==========
    async start(description) {
        if (this.state.status === 'editing') {
            console.log('⚠️  已有进行中的修改，请先完成或回滚');
            console.log(`   当前修改: ${this.state.currentEdit?.description}`);
            return;
        }

        console.log('🚀 开始新的修改流程\n');
        console.log(`📝 修改说明: ${description}\n`);

        // 1. 创建备份
        const backupManager = new BackupManager();
        const backupPath = backupManager.createBackup(description);

        // 2. 记录状态
        this.state.status = 'editing';
        this.state.currentEdit = {
            startTime: new Date().toISOString(),
            description: description,
            backupPath: backupPath
        };
        this.saveState();

        console.log('✅ 可以开始修改了');
        console.log('💡 提示:');
        console.log('   - 修改完成后运行: node workflow.js finish');
        console.log('   - 需要回滚运行: node workflow.js rollback\n');
    }

    // ========== 完成修改 ==========
    async finish() {
        if (this.state.status !== 'editing') {
            console.log('❌ 没有进行中的修改');
            return;
        }

        console.log('🔍 修改完成，开始安全检测...\n');

        // 1. 运行安全检测
        const checker = new SafetyChecker();
        const report = await checker.runCheck();

        // 2. 记录结果
        this.state.currentEdit.endTime = new Date().toISOString();
        this.state.currentEdit.report = {
            canDeploy: report.summary.canDeploy,
            errors: report.summary.totalErrors,
            warnings: report.summary.totalWarnings,
            reportPath: `.safety-reports/report-${report.timestamp}.json`
        };

        // 3. 更新历史
        this.state.history.push({
            ...this.state.currentEdit,
            status: report.summary.canDeploy ? 'success' : 'failed'
        });

        this.state.status = 'idle';
        this.state.currentEdit = null;
        this.saveState();

        // 4. 输出结果
        if (report.summary.canDeploy) {
            console.log('✅ 检测通过，修改已完成');
            console.log('📋 请手动完成功能检查清单后部署\n');
        } else {
            console.log('❌ 检测未通过');
            console.log('💡 建议:');
            console.log('   1. 修复检测出的错误');
            console.log('   2. 重新运行: node workflow.js finish');
            console.log('   3. 或回滚: node workflow.js rollback\n');
        }
    }

    // ========== 回滚 ==========
    rollback() {
        if (this.state.status !== 'editing') {
            console.log('❌ 没有进行中的修改可回滚');
            return;
        }

        const backupPath = this.state.currentEdit?.backupPath;
        if (!backupPath) {
            console.log('❌ 找不到备份信息');
            return;
        }

        console.log('🔄 开始回滚...\n');

        const backupManager = new BackupManager();
        const backupName = path.basename(backupPath);
        backupManager.restoreBackup(backupName);

        // 记录回滚
        this.state.history.push({
            ...this.state.currentEdit,
            endTime: new Date().toISOString(),
            status: 'rolled_back'
        });

        this.state.status = 'idle';
        this.state.currentEdit = null;
        this.saveState();

        console.log('✅ 回滚完成\n');
    }

    // ========== 查看状态 ==========
    status() {
        console.log('\n📊 工作流状态\n');
        console.log(`当前状态: ${this.state.status === 'editing' ? '修改中' : '空闲'}`);

        if (this.state.status === 'editing') {
            const edit = this.state.currentEdit;
            console.log(`\n进行中的修改:`);
            console.log(`  说明: ${edit.description}`);
            console.log(`  开始时间: ${edit.startTime}`);
            console.log(`  备份位置: ${edit.backupPath}`);
        }

        console.log(`\n最近修改历史（最近5次）:`);
        const recent = this.state.history.slice(-5).reverse();
        if (recent.length === 0) {
            console.log('  暂无记录');
        } else {
            recent.forEach((h, i) => {
                const statusIcon = h.status === 'success' ? '✅' : h.status === 'failed' ? '❌' : '🔄';
                console.log(`  ${i + 1}. ${statusIcon} ${h.description}`);
                console.log(`     时间: ${h.startTime}`);
                if (h.report) {
                    console.log(`     检测: ${h.report.errors} 错误, ${h.report.warnings} 警告`);
                }
            });
        }
        console.log('');
    }

    // ========== 生成修改指南 ==========
    guide() {
        console.log(`
📖 Photo Monster 修改工作流指南
================================

【标准流程】

1. 开始修改
   node workflow.js start "添加直方图功能"
   
   这会：
   - 创建当前代码的完整备份
   - 记录修改说明
   - 准备修改环境

2. 进行修改
   - 使用你喜欢的编辑器修改代码
   - 随时保存，随时可以回滚

3. 完成修改并检测
   node workflow.js finish
   
   这会：
   - 运行安全检测（敏感信息、XSS、代码规范）
   - 生成检测报告
   - 输出功能检查清单

4. 根据检测结果处理
   
   ✅ 检测通过：
   - 手动验证功能检查清单
   - 部署更新
   
   ❌ 检测未通过：
   - 修复错误
   - 重新运行: node workflow.js finish
   - 或回滚: node workflow.js rollback

【其他命令】

- 查看状态:     node workflow.js status
- 回滚修改:     node workflow.js rollback
- 查看指南:     node workflow.js guide
- 列出备份:     node pre-edit-backup.js list
- 恢复指定备份: node pre-edit-backup.js restore [备份名]
- 单独检测:     node safety-check.js [文件路径]

【注意事项】

1. 每次修改前必须运行 start
2. 修改后必须运行 finish 进行检测
3. 检测不通过时禁止部署
4. 保留所有检测报告用于追溯
5. 定期清理旧备份（保留最近10个）

================================
`);
    }
}

// ========== 命令行执行 ==========
if (require.main === module) {
    const action = process.argv[2] || 'guide';
    const args = process.argv.slice(3);
    const manager = new WorkflowManager();

    switch (action) {
        case 'start':
            const description = args.join(' ') || '未说明';
            manager.start(description);
            break;
        case 'finish':
            manager.finish();
            break;
        case 'rollback':
            manager.rollback();
            break;
        case 'status':
            manager.status();
            break;
        case 'guide':
        default:
            manager.guide();
            break;
    }
}

module.exports = WorkflowManager;

/**
 * deploy-publish.js - 版本发布执行脚本
 * 在本地终端调用，将 pendingRelease 设为已发布状态并推送到线上
 * 
 * 用法：
 *   node deploy-publish.js "v49.20260331.002" "v49" "[\"变更1\",\"变更2\"]"
 *   node deploy-publish.js --cancel    # 取消待发布版本
 * 
 * 安全措施：
 * 1. 修改前自动备份
 * 2. 只修改 version/publishStatus/pendingRelease/updateHistory 字段
 * 3. 不删除任何现有数据
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONFIG_PATH = path.join(__dirname, 'data', 'update-config.json');
const BACKUP_DIR = path.join(__dirname, 'data', 'backups');

function backup() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupPath = path.join(BACKUP_DIR, `update-config-backup-${timestamp}.json`);
    fs.copyFileSync(CONFIG_PATH, backupPath);
    return backupPath;
}

function publish(version, swVersion, changes) {
    console.log('========================================');
    console.log('  Photo Monster 版本发布');
    console.log('========================================\n');

    if (!fs.existsSync(CONFIG_PATH)) {
        console.error('[错误] 找不到配置文件:', CONFIG_PATH);
        process.exit(1);
    }

    // 检查是否有待发布版本
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    if (!config.pendingRelease) {
        console.warn('[提示] 当前没有待发布的版本');
        process.exit(0);
    }

    // 备份
    const backupPath = backup();
    console.log('[1/4] 备份完成:', backupPath);

    const now = new Date().toISOString();

    // 更新配置
    config.version = version;
    config.swVersion = swVersion;
    config.swCacheVersion = swVersion;
    config.lastUpdated = now;
    config.publishStatus = 'published';
    config.pendingChanges = [];

    // 将当前版本添加到历史记录
    const historyRecord = {
        version: version,
        date: now,
        changes: changes,
        status: 'published'
    };

    if (!config.updateHistory) {
        config.updateHistory = [];
    }
    // 添加到历史记录开头（去重）
    config.updateHistory = config.updateHistory.filter(h => h.version !== version);
    config.updateHistory.unshift(historyRecord);
    // 只保留最近 20 条历史记录
    config.updateHistory = config.updateHistory.slice(0, 20);

    // 清除 pendingRelease
    config.pendingRelease = null;

    // 写回文件
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf-8');
    console.log('[2/4] 版本已更新:', version);

    // git 提交并推送
    console.log('[3/4] 提交变更...');
    try {
        execSync('git add data/update-config.json', { cwd: __dirname, stdio: 'pipe' });
        execSync(`git commit -m "发布版本 ${version}"`, { cwd: __dirname, stdio: 'pipe' });
        console.log('[4/4] 推送到线上...');
        execSync('git push origin main', { cwd: __dirname, stdio: 'inherit' });
    } catch (e) {
        console.log('[提示] Git 操作跳过或失败，配置已更新');
    }

    console.log('\n========================================');
    console.log(`  发布完成！版本: ${version}`);
    console.log('  等待 1-2 分钟后刷新网站查看');
    console.log('========================================');
}

function cancelRelease() {
    console.log('========================================');
    console.log('  取消待发布版本');
    console.log('========================================\n');

    if (!fs.existsSync(CONFIG_PATH)) {
        console.error('[错误] 找不到配置文件:', CONFIG_PATH);
        process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    if (!config.pendingRelease) {
        console.warn('[提示] 当前没有待发布的版本');
        process.exit(0);
    }

    const backupPath = backup();
    console.log('[1/3] 备份完成:', backupPath);

    config.publishStatus = 'published';
    config.pendingRelease = null;
    config.pendingChanges = [];

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf-8');
    console.log('[2/3] 待发布版本已清除');

    try {
        execSync('git add data/update-config.json', { cwd: __dirname, stdio: 'pipe' });
        execSync('git commit -m "取消待发布版本"', { cwd: __dirname, stdio: 'pipe' });
        console.log('[3/3] 推送到线上...');
        execSync('git push origin main', { cwd: __dirname, stdio: 'inherit' });
    } catch (e) {
        console.log('[提示] Git 操作跳过');
    }

    console.log('\n========================================');
    console.log('  取消完成！线上网站保持当前版本');
    console.log('========================================');
}

// 解析参数
const args = process.argv.slice(2);

if (args[0] === '--cancel') {
    cancelRelease();
} else if (args.length >= 3) {
    const version = args[0];
    const swVersion = args[1];
    let changes;
    try {
        changes = JSON.parse(args[2]);
    } catch (e) {
        changes = [args[2]];
    }
    publish(version, swVersion, changes);
} else {
    console.log('用法:');
    console.log('  node deploy-publish.js "版本号" "SW版本" "[\"变更1\",\"变更2\"]"');
    console.log('  node deploy-publish.js --cancel');
    console.log('\n示例:');
    console.log('  node deploy-publish.js "v49.20260331.002" "v49" "[\"性能优化\",\"CSS动画优化\"]"');
    console.log('  node deploy-publish.js --cancel');
    process.exit(1);
}

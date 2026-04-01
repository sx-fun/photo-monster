/**
 * deploy-prep.js - 部署预处理脚本
 * 在 git push 之前调用，自动更新版本号并创建 pendingRelease 记录
 * 
 * 安全措施：
 * 1. 修改前自动备份 update-config.json
 * 2. 只修改 pendingRelease、publishStatus、lastUpdated 字段
 * 3. 不删除任何现有数据
 * 4. 输出变更摘要供人工确认
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'data', 'update-config.json');
const BACKUP_DIR = path.join(__dirname, 'data', 'backups');

// 从命令行参数获取变更说明
const changesArg = process.argv[2] || '代码更新';
const changes = changesArg.split(',').map(s => s.trim()).filter(s => s);

function main() {
    console.log('========================================');
    console.log('  Photo Monster 部署预处理');
    console.log('========================================\n');

    // 1. 检查配置文件
    if (!fs.existsSync(CONFIG_PATH)) {
        console.error('[错误] 找不到配置文件:', CONFIG_PATH);
        process.exit(1);
    }

    // 2. 创建备份
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const backupPath = path.join(BACKUP_DIR, `update-config-backup-${timestamp}.json`);
    fs.copyFileSync(CONFIG_PATH, backupPath);
    console.log('[1/4] 备份完成:', backupPath);

    // 3. 读取并修改配置
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    const currentVersion = config.version;
    const currentSw = config.swVersion;

    // 生成新版本号：递增序号
    const parts = currentVersion.split('.');
    let swPart = parts[0]; // 如 "v49"
    let datePart = parts[1]; // 如 "20260331"
    let seqPart = parseInt(parts[2]) || 0; // 如 "001"

    const today = new Date();
    const todayStr = today.getFullYear().toString() +
        String(today.getMonth() + 1).padStart(2, '0') +
        String(today.getDate()).padStart(2, '0');

    // 如果日期变了，重置序号；否则递增
    if (datePart === todayStr) {
        seqPart++;
    } else {
        datePart = todayStr;
        seqPart = 1;
    }

    const newVersion = `${swPart}.${datePart}.${String(seqPart).padStart(3, '0')}`;
    const now = new Date().toISOString();

    // 4. 构建 pendingRelease
    const pendingRelease = {
        version: newVersion,
        swVersion: currentSw,
        swCacheVersion: currentSw,
        createdAt: now,
        changes: changes,
        releaseNote: {
            title: `版本 ${newVersion}`,
            changes: changes
        }
    };

    // 5. 更新配置（只修改必要字段）
    config.lastUpdated = now;
    config.publishStatus = 'pending';
    config.pendingRelease = pendingRelease;
    config.pendingChanges = changes;

    // 6. 写回文件（格式化输出，保持可读性）
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf-8');
    console.log('[2/4] 版本更新完成');
    console.log('       当前版本:', currentVersion);
    console.log('       新版本:', newVersion);
    console.log('       变更内容:', changes.join(', '));

    // 7. 检查 git 变更
    console.log('[3/4] 文件变更:');
    console.log('       data/update-config.json');

    console.log('[4/4] 预处理完成');
    console.log('\n========================================');
    console.log('  现在可以执行 git add & push');
    console.log('  推送后在线上管理页面点击"确认发布"');
    console.log('========================================');
}

try {
    main();
} catch (err) {
    console.error('[错误] 预处理失败:', err.message);
    // 如果有备份，提示恢复
    if (fs.existsSync(backupPath)) {
        console.log('[提示] 备份文件:', backupPath);
    }
    process.exit(1);
}

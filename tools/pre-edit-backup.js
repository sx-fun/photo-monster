/**
 * 修改前自动备份脚本
 * 每次修改前运行，创建时间戳备份
 * 
 * 使用方法：node pre-edit-backup.js [说明文字]
 * 示例：node pre-edit-backup.js "添加直方图功能"
 */

const fs = require('fs');
const path = require('path');

class BackupManager {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.backupDir = path.join(this.projectRoot, 'backups', 'auto');
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    }

    createBackup(description = '') {
        console.log('📦 创建修改前备份...\n');

        // 创建备份目录
        const backupPath = path.join(this.backupDir, `backup-${this.timestamp}`);
        if (!fs.existsSync(backupPath)) {
            fs.mkdirSync(backupPath, { recursive: true });
        }

        // 备份文件列表
        const filesToBackup = this.getFilesToBackup();
        const backupInfo = {
            timestamp: this.timestamp,
            description: description,
            files: []
        };

        let successCount = 0;
        let failCount = 0;

        for (const file of filesToBackup) {
            const relativePath = path.relative(this.projectRoot, file);
            const backupFilePath = path.join(backupPath, relativePath);
            
            try {
                // 确保目标目录存在
                const dir = path.dirname(backupFilePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // 复制文件
                fs.copyFileSync(file, backupFilePath);
                backupInfo.files.push(relativePath);
                successCount++;
                console.log(`  ✅ ${relativePath}`);
            } catch (err) {
                failCount++;
                console.log(`  ❌ ${relativePath} - ${err.message}`);
            }
        }

        // 保存备份信息
        fs.writeFileSync(
            path.join(backupPath, 'backup-info.json'),
            JSON.stringify(backupInfo, null, 2)
        );

        // 创建最新备份链接
        const latestLink = path.join(this.backupDir, 'latest');
        if (fs.existsSync(latestLink)) {
            fs.rmSync(latestLink, { recursive: true });
        }
        fs.symlinkSync(backupPath, latestLink, 'junction');

        console.log(`\n✅ 备份完成: ${successCount} 个文件`);
        if (failCount > 0) {
            console.log(`❌ 失败: ${failCount} 个文件`);
        }
        console.log(`📁 备份位置: ${backupPath}\n`);

        return backupPath;
    }

    getFilesToBackup() {
        const files = [];
        const includeDirs = ['js', 'css', 'pages', 'data', 'index.html', 'sw.js'];
        
        for (const dir of includeDirs) {
            const fullPath = path.join(this.projectRoot, dir);
            if (fs.existsSync(fullPath)) {
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    this.scanDirectory(fullPath, files);
                } else {
                    files.push(fullPath);
                }
            }
        }

        return files;
    }

    scanDirectory(dir, files) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // 跳过不需要备份的目录
                if (item !== 'node_modules' && item !== '.git') {
                    this.scanDirectory(fullPath, files);
                }
            } else {
                const ext = path.extname(item);
                if (['.js', '.html', '.css', '.json'].includes(ext)) {
                    files.push(fullPath);
                }
            }
        }
    }

    listBackups() {
        if (!fs.existsSync(this.backupDir)) {
            console.log('暂无备份');
            return [];
        }

        const items = fs.readdirSync(this.backupDir);
        const backups = items
            .filter(item => item.startsWith('backup-'))
            .map(item => {
                const infoPath = path.join(this.backupDir, item, 'backup-info.json');
                let info = { description: '无描述' };
                if (fs.existsSync(infoPath)) {
                    info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));
                }
                return {
                    name: item,
                    time: item.replace('backup-', ''),
                    description: info.description,
                    path: path.join(this.backupDir, item)
                };
            })
            .sort((a, b) => b.time.localeCompare(a.time));

        return backups;
    }

    restoreBackup(backupName) {
        const backupPath = path.join(this.backupDir, backupName);
        if (!fs.existsSync(backupPath)) {
            console.log(`❌ 备份不存在: ${backupName}`);
            return false;
        }

        console.log(`🔄 正在恢复备份: ${backupName}\n`);

        const infoPath = path.join(backupPath, 'backup-info.json');
        const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));

        for (const file of info.files) {
            const backupFile = path.join(backupPath, file);
            const targetFile = path.join(this.projectRoot, file);
            
            try {
                fs.copyFileSync(backupFile, targetFile);
                console.log(`  ✅ ${file}`);
            } catch (err) {
                console.log(`  ❌ ${file} - ${err.message}`);
            }
        }

        console.log('\n✅ 恢复完成\n');
        return true;
    }
}

// ========== 命令行执行 ==========
if (require.main === module) {
    const action = process.argv[2];
    const manager = new BackupManager();

    if (action === 'list') {
        const backups = manager.listBackups();
        console.log('\n📋 备份列表:\n');
        backups.forEach((b, i) => {
            console.log(`  ${i + 1}. ${b.time}`);
            console.log(`     描述: ${b.description}`);
            console.log(`     路径: ${b.path}\n`);
        });
    } else if (action === 'restore') {
        const backupName = process.argv[3];
        if (!backupName) {
            console.log('❌ 请指定备份名称');
            console.log('用法: node pre-edit-backup.js restore backup-2026-03-28T09-30-00');
            process.exit(1);
        }
        manager.restoreBackup(backupName);
    } else {
        // 默认创建备份
        const description = process.argv.slice(2).join(' ') || '未说明';
        manager.createBackup(description);
    }
}

module.exports = BackupManager;

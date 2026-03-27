/**
 * 备份验证工具
 * 验证备份文件的完整性和可恢复性
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BACKUP_DIR = path.join(__dirname, 'backups');
const TARGET_FILE = path.join(__dirname, '..', 'js', 'app.js');

class BackupVerifier {
    constructor() {
        this.results = [];
    }

    // 计算文件哈希
    calculateHash(filePath) {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('sha256').update(content).digest('hex');
    }

    // 验证所有备份
    verifyAllBackups() {
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║     📦 Photo Monster 备份验证工具                      ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');

        const files = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.endsWith('.hash'))
            .map(f => ({
                hashFile: f,
                backupFile: f.replace('.hash', ''),
                hashPath: path.join(BACKUP_DIR, f),
                backupPath: path.join(BACKUP_DIR, f.replace('.hash', ''))
            }));

        if (files.length === 0) {
            console.log('❌ 未找到备份文件');
            return false;
        }

        console.log(`找到 ${files.length} 个备份:\n`);

        let allValid = true;

        files.forEach((file, index) => {
            const result = this.verifyBackup(file, index + 1);
            this.results.push(result);
            if (!result.valid) allValid = false;
        });

        console.log('\n' + '═'.repeat(56));
        console.log('📊 验证总结');
        console.log('═'.repeat(56));
        console.log(`总备份数: ${files.length}`);
        console.log(`有效备份: ${this.results.filter(r => r.valid).length}`);
        console.log(`无效备份: ${this.results.filter(r => !r.valid).length}`);
        console.log(`最新备份: ${files[files.length - 1].backupFile}`);

        if (allValid) {
            console.log('\n✅ 所有备份验证通过，数据安全');
        } else {
            console.log('\n⚠️  部分备份验证失败，请检查');
        }

        return allValid;
    }

    // 验证单个备份
    verifyBackup(file, index) {
        console.log(`[${index}] 验证: ${file.backupFile}`);
        console.log(`    备份文件: ${file.backupPath}`);

        const result = {
            file: file.backupFile,
            valid: false,
            errors: []
        };

        // 检查备份文件是否存在
        if (!fs.existsSync(file.backupPath)) {
            result.errors.push('备份文件不存在');
            console.log('    ❌ 备份文件不存在');
            return result;
        }

        // 检查哈希文件是否存在
        if (!fs.existsSync(file.hashPath)) {
            result.errors.push('哈希文件不存在');
            console.log('    ❌ 哈希文件不存在');
            return result;
        }

        // 读取预期哈希
        const expectedHash = fs.readFileSync(file.hashPath, 'utf-8').trim();

        // 计算实际哈希
        const actualHash = this.calculateHash(file.backupPath);

        // 验证哈希
        if (expectedHash !== actualHash) {
            result.errors.push('哈希不匹配，文件可能已损坏');
            console.log('    ❌ 哈希验证失败');
            console.log(`       预期: ${expectedHash.substring(0, 16)}...`);
            console.log(`       实际: ${actualHash.substring(0, 16)}...`);
            return result;
        }

        // 检查文件内容可读性
        try {
            const content = fs.readFileSync(file.backupPath, 'utf-8');
            const lines = content.split('\n');
            
            // 检查是否为有效的JS文件
            if (!content.includes('cameraDatabase')) {
                result.errors.push('备份内容异常，缺少关键数据');
                console.log('    ❌ 内容验证失败');
                return result;
            }

            const stats = fs.statSync(file.backupPath);
            console.log(`    ✅ 验证通过`);
            console.log(`       大小: ${(stats.size / 1024).toFixed(2)} KB`);
            console.log(`       行数: ${lines.length}`);
            console.log(`       哈希: ${actualHash.substring(0, 16)}...`);
            console.log(`       时间: ${stats.mtime.toLocaleString('zh-CN')}`);

            result.valid = true;
        } catch (error) {
            result.errors.push(`读取失败: ${error.message}`);
            console.log(`    ❌ 读取失败: ${error.message}`);
        }

        console.log('');
        return result;
    }

    // 测试恢复功能
    testRestore() {
        console.log('\n' + '═'.repeat(56));
        console.log('🔄 恢复功能测试');
        console.log('═'.repeat(56));

        // 获取最新备份
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(f => !f.endsWith('.hash') && f.startsWith('app.js.backup'))
            .map(f => ({
                name: f,
                path: path.join(BACKUP_DIR, f),
                time: fs.statSync(path.join(BACKUP_DIR, f)).mtime
            }))
            .sort((a, b) => b.time - a.time);

        if (backups.length === 0) {
            console.log('❌ 无可用备份');
            return false;
        }

        const latest = backups[0];
        console.log(`最新备份: ${latest.name}`);
        console.log(`备份时间: ${latest.time.toLocaleString('zh-CN')}`);

        // 验证备份与当前文件的差异
        if (fs.existsSync(TARGET_FILE)) {
            const currentContent = fs.readFileSync(TARGET_FILE, 'utf-8');
            const backupContent = fs.readFileSync(latest.path, 'utf-8');
            
            const currentHash = crypto.createHash('sha256').update(currentContent).digest('hex');
            const backupHash = crypto.createHash('sha256').update(backupContent).digest('hex');

            if (currentHash === backupHash) {
                console.log('✅ 当前文件与最新备份一致');
            } else {
                console.log('ℹ️  当前文件与备份存在差异（正常，说明有更新）');
                console.log(`   当前: ${currentHash.substring(0, 16)}...`);
                console.log(`   备份: ${backupHash.substring(0, 16)}...`);
            }
        }

        console.log('\n✅ 恢复功能可用');
        console.log(`   如需恢复，将 ${latest.name} 复制到 js/app.js`);
        
        return true;
    }

    // 清理旧备份（保留最近10个）
    cleanupOldBackups() {
        console.log('\n' + '═'.repeat(56));
        console.log('🧹 备份清理');
        console.log('═'.repeat(56));

        const maxBackups = 10;
        
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(f => !f.endsWith('.hash') && f.startsWith('app.js.backup'))
            .map(f => ({
                name: f,
                path: path.join(BACKUP_DIR, f),
                time: fs.statSync(path.join(BACKUP_DIR, f)).mtime
            }))
            .sort((a, b) => b.time - a.time);

        if (backups.length <= maxBackups) {
            console.log(`✅ 备份数量正常 (${backups.length}/${maxBackups})`);
            return;
        }

        const toDelete = backups.slice(maxBackups);
        console.log(`发现 ${toDelete.length} 个旧备份需要清理`);

        toDelete.forEach(backup => {
            const hashFile = backup.name + '.hash';
            const hashPath = path.join(BACKUP_DIR, hashFile);

            try {
                fs.unlinkSync(backup.path);
                if (fs.existsSync(hashPath)) {
                    fs.unlinkSync(hashPath);
                }
                console.log(`   已删除: ${backup.name}`);
            } catch (error) {
                console.log(`   ❌ 删除失败: ${backup.name} - ${error.message}`);
            }
        });

        console.log(`✅ 清理完成，保留 ${maxBackups} 个最新备份`);
    }
}

// 主函数
function main() {
    const verifier = new BackupVerifier();
    
    // 验证所有备份
    const allValid = verifier.verifyAllBackups();
    
    // 测试恢复功能
    verifier.testRestore();
    
    // 清理旧备份
    verifier.cleanupOldBackups();

    console.log('\n' + '═'.repeat(56));
    console.log('✅ 备份验证完成');
    console.log('═'.repeat(56));

    process.exit(allValid ? 0 : 1);
}

if (require.main === module) {
    main();
}

module.exports = { BackupVerifier };

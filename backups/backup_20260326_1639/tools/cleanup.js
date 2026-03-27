/**
 * Photo Monster 空间清理工具
 * 检测并清理冗余、无效、过期文件
 */

const fs = require('fs');
const path = require('path');

class SpaceCleaner {
    constructor() {
        this.tempDir = path.join(__dirname, 'temp');
        this.backupDir = path.join(__dirname, 'backups');
        this.results = {
            scanned: 0,
            redundant: [],
            invalid: [],
            expired: [],
            freed: 0
        };
    }

    // 主清理流程
    async clean() {
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║     🧹 Photo Monster 空间清理工具                      ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');

        // 1. 分析空间占用
        await this.analyzeSpace();

        // 2. 检测冗余文件
        this.findRedundantFiles();

        // 3. 检测无效文件
        this.findInvalidFiles();

        // 4. 检测过期文件
        this.findExpiredFiles();

        // 5. 生成报告
        this.generateReport();

        // 6. 执行清理（需确认）
        await this.performCleanup();
    }

    // 分析空间占用
    async analyzeSpace() {
        console.log('📊 分析空间占用...\n');

        const tempSize = this.getDirSize(this.tempDir);
        const backupSize = this.getDirSize(this.backupDir);

        console.log(`临时目录 (temp/): ${this.formatSize(tempSize)}`);
        console.log(`备份目录 (backups/): ${this.formatSize(backupSize)}`);
        console.log(`总计: ${this.formatSize(tempSize + backupSize)}\n`);
    }

    // 获取目录大小
    getDirSize(dirPath) {
        if (!fs.existsSync(dirPath)) return 0;
        
        let size = 0;
        const files = fs.readdirSync(dirPath);
        
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            if (stats.isFile()) {
                size += stats.size;
            } else if (stats.isDirectory()) {
                size += this.getDirSize(filePath);
            }
        }
        
        return size;
    }

    // 格式化大小
    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 查找冗余文件
    findRedundantFiles() {
        console.log('🔍 检测冗余文件...');

        // 1. 查找重复的抓取结果（相同时间戳）
        const files = fs.readdirSync(this.tempDir);
        const scrapeResults = files.filter(f => f.startsWith('scrape-results-'));
        
        // 按时间戳分组
        const groups = {};
        scrapeResults.forEach(f => {
            const timestamp = f.match(/(\d+)\.json$/)?.[1];
            if (timestamp) {
                if (!groups[timestamp]) groups[timestamp] = [];
                groups[timestamp].push(f);
            }
        });

        // 找出重复组（保留最新的）
        for (const [timestamp, group] of Object.entries(groups)) {
            if (group.length > 1) {
                // 按修改时间排序，保留最新的
                const sorted = group.map(f => ({
                    name: f,
                    path: path.join(this.tempDir, f),
                    time: fs.statSync(path.join(this.tempDir, f)).mtime
                })).sort((a, b) => b.time - a.time);

                // 标记旧的为冗余
                for (let i = 1; i < sorted.length; i++) {
                    this.results.redundant.push({
                        path: sorted[i].path,
                        name: sorted[i].name,
                        reason: '重复抓取结果',
                        size: fs.statSync(sorted[i].path).size
                    });
                }
            }
        }

        // 2. 查找已处理的文件（在processed目录中的原始文件）
        const processedDir = path.join(this.tempDir, 'processed');
        if (fs.existsSync(processedDir)) {
            const processed = fs.readdirSync(processedDir);
            
            processed.forEach(f => {
                // 提取原始文件名
                const match = f.match(/processed-\d+-(approved|rejected)-(.+\.json)$/);
                if (match) {
                    const originalName = match[2];
                    const originalPath = path.join(this.tempDir, originalName);
                    
                    if (fs.existsSync(originalPath)) {
                        this.results.redundant.push({
                            path: originalPath,
                            name: originalName,
                            reason: '已处理文件的副本',
                            size: fs.statSync(originalPath).size
                        });
                    }
                }
            });
        }

        console.log(`   发现 ${this.results.redundant.length} 个冗余文件\n`);
    }

    // 查找无效文件
    findInvalidFiles() {
        console.log('🔍 检测无效文件...');

        const files = fs.readdirSync(this.tempDir);

        files.forEach(f => {
            const filePath = path.join(this.tempDir, f);
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                // 1. 空文件
                if (stats.size === 0) {
                    this.results.invalid.push({
                        path: filePath,
                        name: f,
                        reason: '空文件',
                        size: 0
                    });
                    return;
                }

                // 2. 损坏的JSON文件
                if (f.endsWith('.json')) {
                    try {
                        const content = fs.readFileSync(filePath, 'utf-8');
                        JSON.parse(content);
                    } catch (e) {
                        this.results.invalid.push({
                            path: filePath,
                            name: f,
                            reason: '损坏的JSON',
                            size: stats.size
                        });
                    }
                }

                // 3. 孤立的哈希文件（无对应备份）
                if (f.endsWith('.hash')) {
                    const backupFile = f.replace('.hash', '');
                    const backupPath = path.join(this.backupDir, backupFile);
                    if (!fs.existsSync(backupPath)) {
                        this.results.invalid.push({
                            path: filePath,
                            name: f,
                            reason: '孤立的哈希文件',
                            size: stats.size
                        });
                    }
                }
            }
        });

        console.log(`   发现 ${this.results.invalid.length} 个无效文件\n`);
    }

    // 查找过期文件
    findExpiredFiles() {
        console.log('🔍 检测过期文件...');

        const now = new Date();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7天

        const files = fs.readdirSync(this.tempDir);

        files.forEach(f => {
            // 跳过processed目录
            if (f === 'processed') return;

            const filePath = path.join(this.tempDir, f);
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                const age = now - stats.mtime;
                
                // 过期的临时文件
                if (age > maxAge && (
                    f.startsWith('scrape-results-') ||
                    f.startsWith('review-report-') ||
                    f.startsWith('workbuddy-notify-')
                )) {
                    this.results.expired.push({
                        path: filePath,
                        name: f,
                        reason: `超过7天 (${Math.floor(age / 86400000)}天)`,
                        size: stats.size
                    });
                }
            }
        });

        console.log(`   发现 ${this.results.expired.length} 个过期文件\n`);
    }

    // 生成报告
    generateReport() {
        console.log('═'.repeat(56));
        console.log('📋 清理报告');
        console.log('═'.repeat(56));

        const totalFiles = this.results.redundant.length + 
                          this.results.invalid.length + 
                          this.results.expired.length;
        
        const totalSize = [...this.results.redundant, ...this.results.invalid, ...this.results.expired]
            .reduce((sum, f) => sum + f.size, 0);

        console.log(`\n总计可清理: ${totalFiles} 个文件, ${this.formatSize(totalSize)}\n`);

        if (this.results.redundant.length > 0) {
            console.log('🗂️  冗余文件:');
            this.results.redundant.forEach(f => {
                console.log(`   ${f.name}`);
                console.log(`      原因: ${f.reason}, 大小: ${this.formatSize(f.size)}`);
            });
            console.log('');
        }

        if (this.results.invalid.length > 0) {
            console.log('⚠️  无效文件:');
            this.results.invalid.forEach(f => {
                console.log(`   ${f.name}`);
                console.log(`      原因: ${f.reason}, 大小: ${this.formatSize(f.size)}`);
            });
            console.log('');
        }

        if (this.results.expired.length > 0) {
            console.log('⏰ 过期文件:');
            this.results.expired.forEach(f => {
                console.log(`   ${f.name}`);
                console.log(`      原因: ${f.reason}, 大小: ${this.formatSize(f.size)}`);
            });
            console.log('');
        }

        this.results.freed = totalSize;
    }

    // 执行清理
    async performCleanup() {
        const allFiles = [...this.results.redundant, ...this.results.invalid, ...this.results.expired];
        
        if (allFiles.length === 0) {
            console.log('✅ 无需清理，空间已优化\n');
            return;
        }

        console.log('═'.repeat(56));
        console.log('🧹 执行清理');
        console.log('═'.repeat(56));

        // 移动文件到回收站（安全删除）
        const trashDir = path.join(this.tempDir, 'trash');
        if (!fs.existsSync(trashDir)) {
            fs.mkdirSync(trashDir, { recursive: true });
        }

        let cleaned = 0;
        let failed = 0;

        for (const file of allFiles) {
            try {
                const trashPath = path.join(trashDir, `${Date.now()}-${file.name}`);
                fs.renameSync(file.path, trashPath);
                console.log(`   ✅ 已移动: ${file.name}`);
                cleaned++;
            } catch (error) {
                console.log(`   ❌ 失败: ${file.name} - ${error.message}`);
                failed++;
            }
        }

        console.log(`\n✅ 清理完成: ${cleaned} 个文件`);
        if (failed > 0) {
            console.log(`⚠️  失败: ${failed} 个文件`);
        }
        console.log(`💾 释放空间: ${this.formatSize(this.results.freed)}`);
        console.log(`📁 已移至: temp/trash/\n`);

        // 显示清理后的空间
        const tempSize = this.getDirSize(this.tempDir);
        const backupSize = this.getDirSize(this.backupDir);
        console.log('📊 清理后空间占用:');
        console.log(`   临时目录: ${this.formatSize(tempSize)}`);
        console.log(`   备份目录: ${this.formatSize(backupSize)}`);
        console.log(`   总计: ${this.formatSize(tempSize + backupSize)}\n`);
    }
}

// 主函数
async function main() {
    const cleaner = new SpaceCleaner();
    await cleaner.clean();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { SpaceCleaner };

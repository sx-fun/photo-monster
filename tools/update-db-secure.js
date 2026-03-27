/**
 * Photo Monster 安全加固的数据库更新器
 * 集成安全验证、备份机制、审计日志
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { SecurityValidator, audit } = require('./security-config');

class SecureDatabaseUpdater {
    constructor() {
        this.tempDir = path.join(__dirname, 'temp');
        this.jsDir = path.join(__dirname, '..', 'js');
        this.backupDir = path.join(__dirname, 'backups');
        this.maxBackups = 10;  // 最多保留10个备份
    }

    init() {
        // 确保目录存在
        [this.backupDir, this.tempDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    // 计算文件哈希
    calculateHash(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return crypto.createHash('sha256').update(content).digest('hex');
    }

    // 安全备份数据库
    backupDatabase() {
        const appJsPath = path.join(this.jsDir, 'app.js');
        
        if (!fs.existsSync(appJsPath)) {
            throw new Error('数据库文件不存在');
        }

        // 验证文件路径安全
        const pathCheck = SecurityValidator.isSafePath(appJsPath);
        if (!pathCheck.valid) {
            throw new Error(`不安全的路径: ${pathCheck.reason}`);
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(this.backupDir, `app.js.backup-${timestamp}`);
        
        // 复制文件
        fs.copyFileSync(appJsPath, backupPath);
        
        // 计算并保存哈希
        const hash = this.calculateHash(appJsPath);
        const hashPath = `${backupPath}.hash`;
        fs.writeFileSync(hashPath, hash, 'utf-8');
        
        console.log(`📦 已备份数据库: ${backupPath}`);
        console.log(`   文件哈希: ${hash.substring(0, 16)}...`);

        // 清理旧备份
        this.cleanupOldBackups();

        audit.log('database_backup', {
            source: appJsPath,
            backup: backupPath,
            hash: hash.substring(0, 16)
        });

        return backupPath;
    }

    // 清理旧备份
    cleanupOldBackups() {
        const backups = fs.readdirSync(this.backupDir)
            .filter(f => f.startsWith('app.js.backup-') && f.endsWith('.js'))
            .map(f => ({
                name: f,
                path: path.join(this.backupDir, f),
                time: fs.statSync(path.join(this.backupDir, f)).mtime
            }))
            .sort((a, b) => b.time - a.time);

        // 删除超出保留数量的旧备份
        if (backups.length > this.maxBackups) {
            const toDelete = backups.slice(this.maxBackups);
            toDelete.forEach(backup => {
                try {
                    fs.unlinkSync(backup.path);
                    // 同时删除对应的hash文件
                    const hashPath = `${backup.path}.hash`;
                    if (fs.existsSync(hashPath)) {
                        fs.unlinkSync(hashPath);
                    }
                    console.log(`🗑️  清理旧备份: ${backup.name}`);
                } catch (e) {
                    console.warn(`无法删除旧备份: ${backup.name}`);
                }
            });
        }
    }

    // 安全读取现有数据库
    readExistingDatabase() {
        const appJsPath = path.join(this.jsDir, 'app.js');
        
        // 验证路径
        const pathCheck = SecurityValidator.isSafePath(appJsPath);
        if (!pathCheck.valid) {
            throw new Error(`不安全的路径: ${pathCheck.reason}`);
        }

        const content = fs.readFileSync(appJsPath, 'utf-8');
        
        // 安全检查 - 禁止包含危险代码
        const dangerousPatterns = [
            /require\s*\(\s*['"]child_process['"]\s*\)/,
            /require\s*\(\s*['"]fs['"]\s*\)\s*\.\s*unlink/,
            /eval\s*\(/,
            /Function\s*\(/,
            /exec\s*\(/,
            /spawn\s*\(/,
            /process\.exit/
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(content)) {
                audit.log('security_violation', {
                    type: 'dangerous_code_in_db',
                    pattern: pattern.toString()
                });
                throw new Error('数据库文件包含危险代码，已中止');
            }
        }

        // 提取 cameraDatabase 对象
        const match = content.match(/const cameraDatabase = ({[\s\S]*?});\s*\n/);
        if (!match) {
            throw new Error('无法找到 cameraDatabase 定义');
        }

        try {
            // 使用 JSON.parse 替代 eval（更安全）
            // 先将JS对象格式转换为JSON格式
            let jsonStr = match[1]
                .replace(/'/g, '"')  // 单引号转双引号
                .replace(/(\w+):/g, '"$1":')  // 属性名加引号
                .replace(/,\s*}/g, '}')  // 移除尾随逗号
                .replace(/,\s*]/g, ']');  // 移除数组尾随逗号

            return JSON.parse(jsonStr);
        } catch (e) {
            // 如果 JSON.parse 失败，回退到受限的 eval
            console.warn('JSON解析失败，使用受限解析模式');
            
            // 创建一个受限的执行环境
            const sandbox = {};
            const fn = new Function('sandbox', `with(sandbox) { return ${match[1]} }`);
            return fn(sandbox);
        }
    }

    // 查找已批准的审核文件
    findApprovedReviews() {
        if (!fs.existsSync(this.tempDir)) {
            return [];
        }

        return fs.readdirSync(this.tempDir)
            .filter(f => f.startsWith('approved-') && f.endsWith('.json'))
            .map(f => {
                const filePath = path.join(this.tempDir, f);
                
                // 验证路径安全
                const pathCheck = SecurityValidator.isSafePath(filePath);
                if (!pathCheck.valid) {
                    console.warn(`跳过不安全文件: ${f}`);
                    return null;
                }

                return {
                    name: f,
                    path: filePath,
                    time: fs.statSync(filePath).mtime
                };
            })
            .filter(Boolean)
            .sort((a, b) => b.time - a.time);
    }

    // 安全更新数据库
    async updateDatabase(approvedFile) {
        console.log(`\n🔄 开始更新数据库...`);
        console.log(`   使用文件: ${approvedFile.name}`);

        // 读取并验证数据
        let data;
        try {
            const content = fs.readFileSync(approvedFile.path, 'utf-8');
            data = JSON.parse(content);
        } catch (e) {
            throw new Error(`无法解析审核文件: ${e.message}`);
        }

        // 验证数据结构
        if (!data.items || typeof data.items !== 'object') {
            throw new Error('审核文件格式错误: 缺少 items 字段');
        }

        // 备份
        const backupPath = this.backupDatabase();

        // 读取现有数据库
        let db;
        try {
            db = this.readExistingDatabase();
        } catch (e) {
            throw new Error(`读取数据库失败: ${e.message}`);
        }

        let updateCount = 0;
        let errorCount = 0;
        
        // 收集成功添加的器材
        const addedItems = {
            cameras: [],
            lenses: []
        };

        // 更新相机
        if (data.items.cameras && Array.isArray(data.items.cameras)) {
            for (const camera of data.items.cameras) {
                try {
                    const result = this.addCamera(db, camera);
                    if (result.success) {
                        updateCount++;
                        addedItems.cameras.push(camera);
                        console.log(`✅ 添加相机: ${camera.brand} ${camera.model}`);
                    } else {
                        console.log(`⏭️  ${result.message}`);
                    }
                } catch (e) {
                    errorCount++;
                    console.error(`❌ 添加相机失败: ${e.message}`);
                    audit.log('validation_error', {
                        type: 'camera_update',
                        camera,
                        error: e.message
                    });
                }
            }
        }

        // 更新镜头
        if (data.items.lenses && Array.isArray(data.items.lenses)) {
            console.log(`\n🔍 发现 ${data.items.lenses.length} 个镜头，请手动更新 rule-engine.js`);
            this.generateLensUpdateSnippet(data.items.lenses);
            addedItems.lenses = data.items.lenses;
        }

        // 写入更新后的数据库
        if (updateCount > 0) {
            const success = this.writeDatabase(db);
            if (success) {
                console.log(`\n✅ 数据库更新完成！`);
                console.log(`   成功添加: ${updateCount} 款相机`);
                if (errorCount > 0) {
                    console.log(`   失败: ${errorCount} 款`);
                }

                // 移动已处理文件
                this.archiveProcessedFile(approvedFile);
                
                // 更新配置（传入具体添加的器材）
                this.updateConfig(addedItems);

                audit.log('database_update', {
                    file: approvedFile.name,
                    added: updateCount,
                    errors: errorCount,
                    backup: backupPath
                });

                return true;
            }
        } else {
            console.log('\nℹ️ 没有新内容需要更新');
        }

        return false;
    }

    // 添加相机到数据库
    addCamera(db, camera) {
        // 验证数据
        const validation = SecurityValidator.validateCameraData(camera);
        if (!validation.valid) {
            return { success: false, message: `验证失败: ${validation.errors.join(', ')}` };
        }

        const brand = camera.brand.toLowerCase();
        const model = camera.model;

        // 检查品牌是否存在
        if (!db[brand]) {
            return { success: false, message: `未知品牌: ${brand}` };
        }

        // 检查是否已存在
        if (db[brand].models[model]) {
            return { success: false, message: `相机已存在: ${brand} ${model}` };
        }

        // 添加新相机
        db[brand].models[model] = {
            type: camera.type || 'mirrorless',
            sensor: camera.sensor || 'fullframe',
            mp: parseInt(camera.mp) || 24,
            lowLight: parseInt(camera.lowLight) || 8,
            price: camera.price || 'mid',
            video: camera.video || '4K',
            mount: camera.mount || 'unknown',
            bestFor: Array.isArray(camera.bestFor) ? camera.bestFor : ['general']
        };

        return { success: true };
    }

    // 生成镜头更新代码片段
    generateLensUpdateSnippet(lenses) {
        console.log('\n📋 请在 rule-engine.js 中添加以下内容:\n');
        console.log('// 新增镜头');
        
        lenses.forEach(lens => {
            const brand = lens.brand.charAt(0).toUpperCase() + lens.brand.slice(1);
            const safeModel = SecurityValidator.sanitizeText(lens.model);
            console.log(`'${brand} ${safeModel}': { type: '${lens.type || 'prime'}', category: '${lens.category || 'versatile'}', quality: '${lens.quality || 'mid'}' },`);
        });
        
        console.log('');
    }

    // 安全写入数据库
    writeDatabase(db) {
        try {
            const appJsPath = path.join(this.jsDir, 'app.js');
            let content = fs.readFileSync(appJsPath, 'utf-8');

            // 将数据库对象转换为字符串
            const dbString = this.objectToString(db, 1);
            
            // 替换原有的 cameraDatabase
            const newContent = content.replace(
                /const cameraDatabase = {[\s\S]*?};\s*\n/,
                `const cameraDatabase = ${dbString};\n`
            );

            // 验证新内容不包含危险代码
            const dangerousPatterns = [
                /eval\s*\(/,
                /Function\s*\(/,
                /require\s*\(\s*['"]child_process['"]\s*\)/
            ];

            for (const pattern of dangerousPatterns) {
                if (pattern.test(newContent)) {
                    throw new Error('生成的内容包含危险代码');
                }
            }

            // 写入文件
            fs.writeFileSync(appJsPath, newContent, 'utf-8');
            
            console.log(`💾 数据库已写入: ${appJsPath}`);
            return true;

        } catch (error) {
            console.error('❌ 写入数据库失败:', error.message);
            audit.log('validation_error', {
                type: 'write_database',
                error: error.message
            });
            return false;
        }
    }

    // 将对象转换为格式化的字符串
    objectToString(obj, indent = 0) {
        const spaces = '    '.repeat(indent);
        const innerSpaces = '    '.repeat(indent + 1);
        
        if (Array.isArray(obj)) {
            if (obj.length === 0) return '[]';
            const items = obj.map(item => this.objectToString(item, indent + 1)).join(', ');
            return `[${items}]`;
        }
        
        if (typeof obj === 'object' && obj !== null) {
            const entries = Object.entries(obj);
            if (entries.length === 0) return '{}';
            
            const lines = entries.map(([key, value]) => {
                const valueStr = this.objectToString(value, indent + 1);
                const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
                return `${innerSpaces}${keyStr}: ${valueStr}`;
            });
            
            return `{\n${lines.join(',\n')}\n${spaces}}`;
        }
        
        if (typeof obj === 'string') return `'${obj.replace(/'/g, "\\'")}'`;
        return String(obj);
    }

    // 归档已处理文件
    archiveProcessedFile(approvedFile) {
        const processedDir = path.join(this.tempDir, 'processed');
        if (!fs.existsSync(processedDir)) {
            fs.mkdirSync(processedDir, { recursive: true });
        }
        
        const newName = `processed-${Date.now()}-${approvedFile.name}`;
        const newPath = path.join(processedDir, newName);
        
        fs.renameSync(approvedFile.path, newPath);
        console.log(`📁 已处理文件移至: ${newPath}`);
    }

    // 更新配置文件
    updateConfig(addedCount) {
        const configPath = path.join(__dirname, '..', 'data', 'update-config.json');
        
        if (!fs.existsSync(configPath)) {
            return;
        }

        try {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            
            const now = new Date();
            config.lastUpdated = now.toISOString();
            config.version = this.generateVersion();
            
            if (!config.updateHistory) {
                config.updateHistory = [];
            }

            // 构建详细的变更描述
            let changes = [];
            if (addedItems && typeof addedItems === 'object') {
                if (addedItems.cameras && addedItems.cameras.length > 0) {
                    addedItems.cameras.forEach(camera => {
                        const brandName = this.getBrandName(camera.brand);
                        changes.push(`新增相机: ${brandName} ${camera.model}`);
                    });
                }
                if (addedItems.lenses && addedItems.lenses.length > 0) {
                    addedItems.lenses.forEach(lens => {
                        const brandName = this.getBrandName(lens.brand);
                        changes.push(`新增镜头: ${brandName} ${lens.model}`);
                    });
                }
            }
            
            // 如果没有具体项目，使用默认描述
            if (changes.length === 0) {
                changes = ['自动更新: 添加新器材数据'];
            }

            config.updateHistory.unshift({
                version: config.version,
                date: now.toISOString(),
                changes: changes,
                status: 'published'
            });

            // 限制历史记录数量
            if (config.updateHistory.length > 20) {
                config.updateHistory = config.updateHistory.slice(0, 20);
            }

            fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
            console.log(`📝 已更新配置文件版本: ${config.version}`);

        } catch (e) {
            console.warn('更新配置文件失败:', e.message);
        }
    }

    generateVersion() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    }
    
    // 获取品牌中文名
    getBrandName(brandKey) {
        const brandMap = {
            'canon': '佳能',
            'sony': '索尼',
            'nikon': '尼康',
            'fujifilm': '富士',
            'panasonic': '松下',
            'olympus': '奥林巴斯',
            'leica': '徕卡',
            'hasselblad': '哈苏'
        };
        return brandMap[brandKey] || brandKey;
    }

    // 主运行流程
    async run() {
        this.init();
        
        const approvedFiles = this.findApprovedReviews();
        
        if (approvedFiles.length === 0) {
            console.log('❌ 没有找到已批准的内容更新文件');
            console.log('请先运行: node scraper.js');
            console.log('然后重命名: pending-review-xxx.json → approved-xxx.json');
            return;
        }

        const latestApproved = approvedFiles[0];
        console.log(`📄 使用已批准文件: ${latestApproved.name}`);
        
        try {
            const success = await this.updateDatabase(latestApproved);
            if (success) {
                console.log('\n🎉 更新成功完成！');
            }
        } catch (error) {
            console.error('\n❌ 更新失败:', error.message);
            audit.log('validation_error', {
                type: 'update_failed',
                error: error.message
            });
        }
    }
}

// 主函数
async function main() {
    const updater = new SecureDatabaseUpdater();
    await updater.run();
}

module.exports = { SecureDatabaseUpdater, main };

if (require.main === module) {
    main().catch(console.error);
}

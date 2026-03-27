/**
 * Photo Monster 数据库更新器
 * 将审核通过的内容更新到主数据库
 */

const fs = require('fs');
const path = require('path');

class DatabaseUpdater {
    constructor() {
        this.tempDir = path.join(__dirname, 'temp');
        this.jsDir = path.join(__dirname, '..', 'js');
        this.backupDir = path.join(__dirname, 'backups');
    }

    init() {
        if (!fs.existsSync(this.backupDir)) {
            fs.mkdirSync(this.backupDir, { recursive: true });
        }
    }

    // 查找已批准的审核文件
    findApprovedReviews() {
        const files = fs.readdirSync(this.tempDir)
            .filter(f => f.startsWith('approved-') && f.endsWith('.json'))
            .map(f => ({
                name: f,
                path: path.join(this.tempDir, f),
                time: fs.statSync(path.join(this.tempDir, f)).mtime
            }))
            .sort((a, b) => b.time - a.time);

        return files;
    }

    // 查找待审核文件（如果用户直接运行update-db）
    findPendingReviews() {
        const files = fs.readdirSync(this.tempDir)
            .filter(f => f.startsWith('pending-review-') && f.endsWith('.json'))
            .map(f => ({
                name: f,
                path: path.join(this.tempDir, f),
                time: fs.statSync(path.join(this.tempDir, f)).mtime
            }))
            .sort((a, b) => b.time - a.time);

        return files;
    }

    // 备份现有数据库（只保留最新一版）
    backupDatabase() {
        const appJsPath = path.join(this.jsDir, 'app.js');
        const backupPath = path.join(this.backupDir, 'app.js.backup-latest');
        
        if (fs.existsSync(appJsPath)) {
            // 删除旧备份（如果存在）
            if (fs.existsSync(backupPath)) {
                fs.unlinkSync(backupPath);
            }
            
            fs.copyFileSync(appJsPath, backupPath);
            console.log(`📦 已备份数据库: ${backupPath}`);
            return backupPath;
        }
        return null;
    }

    // 读取现有的 cameraDatabase
    readExistingDatabase() {
        const appJsPath = path.join(this.jsDir, 'app.js');
        const content = fs.readFileSync(appJsPath, 'utf-8');
        
        // 提取 cameraDatabase 对象
        const match = content.match(/const cameraDatabase = ({[\s\S]*?});\s*\n/);
        if (match) {
            try {
                // 使用 eval 解析（仅内部使用，数据可信）
                return eval(`(${match[1]})`);
            } catch (e) {
                console.error('解析现有数据库失败:', e.message);
                return null;
            }
        }
        return null;
    }

    // 更新数据库
    async updateDatabase(approvedFile) {
        const data = JSON.parse(fs.readFileSync(approvedFile.path, 'utf-8'));
        
        console.log('\n🔄 开始更新数据库...\n');
        
        // 备份
        this.backupDatabase();
        
        // 读取现有数据库
        let db = this.readExistingDatabase();
        if (!db) {
            console.error('❌ 无法读取现有数据库');
            return false;
        }

        let updateCount = 0;

        // 更新相机
        if (data.items && data.items.cameras) {
            for (const camera of data.items.cameras) {
                const brand = camera.brand;
                const model = camera.model;

                if (!db[brand]) {
                    console.log(`⚠️  未知品牌: ${brand}，跳过`);
                    continue;
                }

                if (db[brand].models[model]) {
                    console.log(`⏭️  相机已存在: ${brand} ${model}`);
                    continue;
                }

                // 添加新相机
                db[brand].models[model] = {
                    type: camera.type || 'mirrorless',
                    sensor: camera.sensor || 'fullframe',
                    mp: camera.mp || 24,
                    lowLight: camera.lowLight || 8,
                    price: camera.price || 'mid',
                    video: camera.video || '4K',
                    mount: camera.mount || 'unknown',
                    bestFor: camera.bestFor || ['general']
                };

                console.log(`✅ 添加相机: ${brand} ${model}`);
                updateCount++;
            }
        }

        // 收集添加的器材信息
        const addedItems = {
            cameras: [],
            lenses: []
        };
        
        if (data.items && data.items.cameras) {
            addedItems.cameras = data.items.cameras.filter(camera => {
                return db[camera.brand] && !db[camera.brand].models[camera.model];
            });
        }

        // 更新镜头（在 rule-engine.js 中）
        if (data.items && data.items.lenses && data.items.lenses.length > 0) {
            console.log(`\n🔍 发现 ${data.items.lenses.length} 个新镜头，请手动更新 rule-engine.js`);
            this.generateLensUpdateSnippet(data.items.lenses);
            addedItems.lenses = data.items.lenses;
        }

        // 写回数据库
        if (updateCount > 0) {
            const success = this.writeDatabase(db);
            if (success) {
                console.log(`\n✅ 数据库更新完成！共添加 ${updateCount} 款相机`);
                
                // 移动已处理的文件
                const processedDir = path.join(this.tempDir, 'processed');
                if (!fs.existsSync(processedDir)) {
                    fs.mkdirSync(processedDir, { recursive: true });
                }
                
                const newName = `processed-${Date.now()}-${approvedFile.name}`;
                fs.renameSync(approvedFile.path, path.join(processedDir, newName));
                console.log(`📁 已处理文件移至: ${processedDir}\\${newName}`);
                
                // 更新配置文件（传入具体添加的器材）
                this.updateConfig(addedItems);
                
                return true;
            }
        } else {
            console.log('\nℹ️ 没有新内容需要更新');
        }

        return false;
    }

    // 生成镜头更新代码片段
    generateLensUpdateSnippet(lenses) {
        console.log('\n📋 请在 rule-engine.js 的 initLensDatabase() 中添加以下内容:\n');
        console.log('// 新增镜头');
        lenses.forEach(lens => {
            const brand = lens.brand.charAt(0).toUpperCase() + lens.brand.slice(1);
            console.log(`'${brand} ${lens.model}': { type: '${lens.type || 'prime'}', category: '${lens.category || 'versatile'}', quality: '${lens.quality || 'mid'}' },`);
        });
        console.log('');
    }

    // 写入更新后的数据库
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

            fs.writeFileSync(appJsPath, newContent, 'utf-8');
            return true;
        } catch (error) {
            console.error('❌ 写入数据库失败:', error.message);
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
                // 如果key是有效的标识符，不加引号
                const keyStr = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`;
                return `${innerSpaces}${keyStr}: ${valueStr}`;
            });
            
            return `{\n${lines.join(',\n')}\n${spaces}}`;
        }
        
        if (typeof obj === 'string') return `'${obj}'`;
        return String(obj);
    }

    // 主更新流程
    async run() {
        this.init();
        
        // 先查找已批准的
        let approvedFiles = this.findApprovedReviews();
        
        // 如果没有已批准的，询问是否处理待审核的
        if (approvedFiles.length === 0) {
            const pendingFiles = this.findPendingReviews();
            if (pendingFiles.length === 0) {
                console.log('❌ 没有找到待审核或已批准的内容更新文件');
                console.log('请先运行: node scraper.js');
                return;
            }
            
            console.log(`⚠️  发现 ${pendingFiles.length} 个待审核文件，但未找到已批准文件`);
            console.log('请先将 pending-review-xxx.json 重命名为 approved-xxx.json');
            console.log('或运行: node review-report.js 查看详情');
            return;
        }

        // 处理最新的已批准文件
        const latestApproved = approvedFiles[0];
        console.log(`📄 使用已批准文件: ${latestApproved.name}`);
        
        const success = await this.updateDatabase(latestApproved);
        // updateConfig 已在 updateDatabase 成功时调用
    }

    // 更新配置文件
    updateConfig(addedItems = null) {
        const configPath = path.join(this.dataDir, 'update-config.json');
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            config.lastUpdated = new Date().toISOString();
            config.version = this.generateVersion();
            
            // 构建详细的变更描述
            let changes = [];
            if (addedItems) {
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
                date: new Date().toISOString(),
                changes: changes,
                status: 'published'
            });

            fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
            console.log(`📝 已更新配置文件版本: ${config.version}`);
        }
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

    generateVersion() {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    }
}

// 主函数
async function main() {
    const updater = new DatabaseUpdater();
    await updater.run();
}

module.exports = { DatabaseUpdater, main };

if (require.main === module) {
    main().catch(console.error);
}

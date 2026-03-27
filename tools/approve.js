/**
 * Photo Monster 审核确认脚本
 * 用户确认后执行数据库更新
 * 
 * 使用方法:
 *   node approve.js                    # 确认最新的待审核内容
 *   node approve.js pending-review-xxx.json  # 确认指定文件
 */

const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, 'temp');

function findLatestPendingReview() {
    const files = fs.readdirSync(TEMP_DIR)
        .filter(f => f.startsWith('pending-review-') && f.endsWith('.json'))
        .map(f => ({
            name: f,
            path: path.join(TEMP_DIR, f),
            time: fs.statSync(path.join(TEMP_DIR, f)).mtime
        }))
        .sort((a, b) => b.time - a.time);

    return files.length > 0 ? files[0] : null;
}

function approveReview(targetFile) {
    // 确定源文件路径
    let sourcePath;
    let fileName;
    
    if (targetFile) {
        // 用户指定了文件
        if (path.isAbsolute(targetFile)) {
            sourcePath = targetFile;
            fileName = path.basename(targetFile);
        } else {
            fileName = targetFile;
            sourcePath = path.join(TEMP_DIR, targetFile);
        }
    } else {
        // 自动查找最新的待审核文件
        const latest = findLatestPendingReview();
        if (!latest) {
            console.log('❌ 未找到待审核的内容');
            console.log('   请先运行: node auto-update.js scrape-only');
            process.exit(1);
        }
        sourcePath = latest.path;
        fileName = latest.name;
    }

    // 检查文件是否存在
    if (!fs.existsSync(sourcePath)) {
        console.log(`❌ 文件不存在: ${sourcePath}`);
        process.exit(1);
    }

    // 生成批准后的文件名
    const timestamp = Date.now();
    const approvedName = fileName.replace('pending-review-', `approved-${timestamp}-`);
    const approvedPath = path.join(TEMP_DIR, approvedName);

    // 读取并验证内容
    console.log('📋 正在读取审核内容...');
    const content = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));
    
    console.log('\n📊 审核内容摘要:');
    console.log(`   新增相机: ${content.summary.newCameras} 款`);
    console.log(`   新增镜头: ${content.summary.newLenses} 款`);
    console.log(`   相关新闻: ${content.summary.newsCount} 条`);
    
    if (content.items.cameras.length > 0) {
        console.log('\n📷 新相机:');
        content.items.cameras.forEach(c => {
            console.log(`   • ${c.brand.toUpperCase()} ${c.model}`);
        });
    }

    // 重命名为已批准
    fs.renameSync(sourcePath, approvedPath);
    console.log(`\n✅ 已批准: ${fileName}`);
    console.log(`   新文件名: ${approvedName}`);

    // 同时处理对应的txt文件
    const txtName = fileName.replace('.json', '.txt');
    const txtPath = path.join(TEMP_DIR, txtName);
    if (fs.existsSync(txtPath)) {
        const approvedTxtName = approvedName.replace('.json', '.txt');
        const approvedTxtPath = path.join(TEMP_DIR, approvedTxtName);
        fs.renameSync(txtPath, approvedTxtPath);
    }

    console.log('\n🔄 正在执行数据库更新...');
    console.log('─────────────────────────────────\n');

    // 执行更新
    const { DatabaseUpdater } = require('./update-db');
    const updater = new DatabaseUpdater();
    
    updater.run().then(() => {
        console.log('\n─────────────────────────────────');
        console.log('✅ 审核确认完成，数据库已更新');
    }).catch(err => {
        console.error('\n❌ 更新失败:', err.message);
        process.exit(1);
    });
}

// 主入口
if (require.main === module) {
    const targetFile = process.argv[2];
    
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     ✅ Photo Monster 审核确认                          ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    approveReview(targetFile);
}

module.exports = { approveReview };

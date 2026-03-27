/**
 * Photo Monster 审核拒绝脚本
 * 用户拒绝更新时执行
 * 
 * 使用方法:
 *   node reject.js                     # 拒绝最新的待审核内容
 *   node reject.js pending-review-xxx.json   # 拒绝指定文件
 *   node reject.js --all               # 拒绝所有待审核内容
 */

const fs = require('fs');
const path = require('path');

const TEMP_DIR = path.join(__dirname, 'temp');
const REJECTED_DIR = path.join(TEMP_DIR, 'rejected');

// 确保拒绝目录存在
if (!fs.existsSync(REJECTED_DIR)) {
    fs.mkdirSync(REJECTED_DIR, { recursive: true });
}

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

function findAllPendingReviews() {
    return fs.readdirSync(TEMP_DIR)
        .filter(f => f.startsWith('pending-review-') && f.endsWith('.json'))
        .map(f => ({
            name: f,
            path: path.join(TEMP_DIR, f),
            time: fs.statSync(path.join(TEMP_DIR, f)).mtime
        }))
        .sort((a, b) => b.time - a.time);
}

function rejectReview(targetFile) {
    // 确定源文件路径
    let sourcePath;
    let fileName;
    
    if (targetFile) {
        if (path.isAbsolute(targetFile)) {
            sourcePath = targetFile;
            fileName = path.basename(targetFile);
        } else {
            fileName = targetFile;
            sourcePath = path.join(TEMP_DIR, targetFile);
        }
    } else {
        const latest = findLatestPendingReview();
        if (!latest) {
            console.log('❌ 未找到待审核的内容');
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

    // 生成拒绝后的文件名
    const timestamp = Date.now();
    const rejectedName = fileName.replace('pending-review-', `rejected-${timestamp}-`);
    const rejectedPath = path.join(REJECTED_DIR, rejectedName);

    // 移动到拒绝目录
    fs.renameSync(sourcePath, rejectedPath);
    console.log(`✅ 已拒绝: ${fileName}`);
    console.log(`   移至: rejected/${rejectedName}`);

    // 同时处理对应的txt文件
    const txtName = fileName.replace('.json', '.txt');
    const txtPath = path.join(TEMP_DIR, txtName);
    if (fs.existsSync(txtPath)) {
        const rejectedTxtName = rejectedName.replace('.json', '.txt');
        const rejectedTxtPath = path.join(REJECTED_DIR, rejectedTxtName);
        fs.renameSync(txtPath, rejectedTxtPath);
    }

    console.log('\nℹ️  被拒绝的内容已存档，不会更新到数据库');
}

function rejectAll() {
    const pending = findAllPendingReviews();
    
    if (pending.length === 0) {
        console.log('❌ 未找到待审核的内容');
        return;
    }

    console.log(`找到 ${pending.length} 个待审核文件，全部拒绝...\n`);
    
    pending.forEach(file => {
        rejectReview(file.path);
        console.log('');
    });

    console.log(`✅ 已拒绝所有 ${pending.length} 个待审核内容`);
}

// 主入口
if (require.main === module) {
    const arg = process.argv[2];
    
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║     ❌ Photo Monster 审核拒绝                          ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    if (arg === '--all' || arg === '-a') {
        rejectAll();
    } else {
        rejectReview(arg);
    }
}

module.exports = { rejectReview, rejectAll };

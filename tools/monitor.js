const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const STATE_FILE = 'D:\\PhotoMonster\\.workbuddy\\photomonster\\state.json';
const LOG_DIR = 'D:\\PhotoMonster\\tools\\logs\\';
const TODAY = new Date();
const LOG_FILE = path.join(LOG_DIR, `monitor-${TODAY.toISOString().slice(0,10).replace(/-/g,'')}-${TODAY.toTimeString().slice(0,8).replace(/:/g,'')}.log`);

console.log('========================================');
console.log('Photo Monster 文件监控任务');
console.log(`执行时间: ${TODAY.toLocaleString('zh-CN')}`);
console.log('========================================');
console.log('');

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

// 加载状态文件
let state = {};
if (fs.existsSync(STATE_FILE)) {
    try {
        const stateContent = fs.readFileSync(STATE_FILE, 'utf8');
        state = JSON.parse(stateContent);
    } catch (err) {
        console.error('读取状态文件失败:', err.message);
        state = {};
    }
}

const previousHashes = state.fileHashes || {};
const changedFiles = [];
const newHashes = {};

// 计算文件的 MD5 哈希
function getFileHash(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex').toLowerCase();
    } catch (err) {
        return null;
    }
}

// 扫描文件
const patterns = [
    'D:\\PhotoMonster\\data\\*.json',
    'D:\\PhotoMonster\\js\\*.js',
    'D:\\PhotoMonster\\css\\*.css',
    'D:\\PhotoMonster\\*.html'
];

console.log('开始扫描文件...');
console.log('');

patterns.forEach(pattern => {
    const dir = path.dirname(pattern);
    const ext = path.basename(pattern).replace('*', '');

    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (file.endsWith(ext.slice(1))) {
                const fullPath = path.join(dir, file);
                const relativePath = path.relative('D:\\PhotoMonster', fullPath);
                const currentHash = getFileHash(fullPath);

                if (currentHash) {
                    newHashes[relativePath] = currentHash;

                    const previousHash = previousHashes[relativePath];

                    if (previousHash) {
                        if (currentHash !== previousHash) {
                            changedFiles.push({
                                file: relativePath,
                                previousHash,
                                currentHash,
                                status: '修改'
                            });
                        }
                    } else {
                        changedFiles.push({
                            file: relativePath,
                            previousHash: 'N/A',
                            currentHash,
                            status: '新增'
                        });
                    }
                }
            }
        });
    } catch (err) {
        console.error(`扫描目录 ${dir} 失败:`, err.message);
    }
});

console.log(`扫描完成，发现 ${changedFiles.length} 个文件变更`);
console.log('');

let report = [];

if (changedFiles.length > 0) {
    console.log('变更文件列表：');
    console.log('----------------------------------------');
    changedFiles.forEach(item => {
        console.log(`[${item.status}] ${item.file}`);
        console.log(`  旧哈希: ${item.previousHash}`);
        console.log(`  新哈希: ${item.currentHash}`);
        console.log('');

        report.push(`[${item.status}] ${item.file}`);
        report.push(`  旧哈希: ${item.previousHash}`);
        report.push(`  新哈希: ${item.currentHash}`);
        report.push('');
    });

    // 更新 Service Worker 缓存版本号
    const swFile = 'D:\\PhotoMonster\\sw.js';
    if (fs.existsSync(swFile)) {
        console.log('更新 Service Worker 缓存版本号...');
        try {
            let swContent = fs.readFileSync(swFile, 'utf8');
            const newVersion = Date.now().toString();
            swContent = swContent.replace(/const CACHE_VERSION = "[^"]+";/, `const CACHE_VERSION = "${newVersion}";`);
            fs.writeFileSync(swFile, swContent, 'utf8');
            console.log(`缓存版本号已更新为: ${newVersion}`);
            report.push(`Service Worker 缓存版本号已更新为: ${newVersion}`);
            report.push('');
        } catch (err) {
            console.error('更新 Service Worker 失败:', err.message);
        }
    }
} else {
    console.log('未检测到文件变更');
    report.push('无文件变更');
}

// 生成完整报告
const fullReport = [
    '========================================',
    'Photo Monster 文件变更报告',
    `时间: ${TODAY.toLocaleString('zh-CN')}`,
    '========================================',
    '',
    `变更文件数: ${changedFiles.length}`,
    '',
    ...report
].join('\n');

// 保存日志
fs.writeFileSync(LOG_FILE, fullReport, 'utf8');
console.log('');
console.log(`报告已保存到: ${LOG_FILE}`);

// 更新状态文件
state.lastCheck = TODAY.toISOString();
state.fileHashes = newHashes;
fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');

console.log('');
console.log('任务完成');

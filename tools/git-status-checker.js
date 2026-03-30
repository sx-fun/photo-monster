/**
 * Git 状态检测器
 * 检测本地 Git 仓库的变更状态并生成 JSON 报告
 * 供 admin-update.html 页面读取显示
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
    projectRoot: path.resolve(__dirname, '..'),
    outputFile: path.resolve(__dirname, '..', 'data', 'local-git-status.json'),
    maxFilesToList: 20  // 最多列出的文件数
};

/**
 * 执行 Git 命令
 */
function execGit(command) {
    try {
        return execSync(command, {
            cwd: CONFIG.projectRoot,
            encoding: 'utf-8',
            stdio: ['pipe', 'pipe', 'pipe']
        });
    } catch (e) {
        return '';
    }
}

/**
 * 检测 Git 状态
 */
function checkGitStatus() {
    // 检查是否在 Git 仓库中
    const gitDir = path.join(CONFIG.projectRoot, '.git');
    if (!fs.existsSync(gitDir)) {
        return {
            isGitRepo: false,
            changes: -1,
            files: [],
            message: '不是 Git 仓库',
            lastCheck: new Date().toISOString()
        };
    }

    try {
        // 获取未暂存的变更
        const unstagedOutput = execGit('git diff --name-only');
        const unstagedFiles = unstagedOutput
            .split('\n')
            .filter(f => f.trim() !== '');

        // 获取已暂存但未提交的变更
        const stagedOutput = execGit('git diff --cached --name-only');
        const stagedFiles = stagedOutput
            .split('\n')
            .filter(f => f.trim() !== '');

        // 获取未跟踪的文件
        const untrackedOutput = execGit('git ls-files --others --exclude-standard');
        const untrackedFiles = untrackedOutput
            .split('\n')
            .filter(f => f.trim() !== '');

        // 合并所有变更文件
        const allFiles = [...new Set([
            ...unstagedFiles.map(f => ({ file: f, status: 'modified' })),
            ...stagedFiles.map(f => ({ file: f, status: 'staged' })),
            ...untrackedFiles.map(f => ({ file: f, status: 'untracked' }))
        ])];

        // 获取简要状态统计
        const statusSummary = execGit('git status --short');
        const changeCount = statusSummary
            .split('\n')
            .filter(line => line.trim() !== '').length;

        // 获取当前分支
        const branch = execGit('git rev-parse --abbrev-ref HEAD').trim() || 'unknown';

        // 获取最近的提交信息
        const lastCommit = execGit('git log -1 --format="%h - %s (%ar)"').trim();

        return {
            isGitRepo: true,
            changes: changeCount,
            files: allFiles.slice(0, CONFIG.maxFilesToList).map(f => {
                const prefix = f.status === 'staged' ? '[暂存] ' : 
                               f.status === 'untracked' ? '[新增] ' : '[修改] ';
                return prefix + f.file;
            }),
            fileCount: {
                modified: unstagedFiles.length,
                staged: stagedFiles.length,
                untracked: untrackedFiles.length,
                total: changeCount
            },
            branch: branch,
            lastCommit: lastCommit,
            hasUncommittedChanges: changeCount > 0,
            lastCheck: new Date().toISOString(),
            checkTimeFormatted: new Date().toLocaleString('zh-CN')
        };

    } catch (error) {
        return {
            isGitRepo: true,
            changes: -1,
            files: [],
            error: error.message,
            lastCheck: new Date().toISOString()
        };
    }
}

/**
 * 保存状态到 JSON 文件
 */
function saveStatus(status) {
    try {
        // 确保 data 目录存在
        const dataDir = path.dirname(CONFIG.outputFile);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // 写入 JSON 文件
        fs.writeFileSync(CONFIG.outputFile, JSON.stringify(status, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('保存状态文件失败:', error.message);
        return false;
    }
}

/**
 * 主函数
 */
function main() {
    console.log('🔍 检测 Git 状态...');
    console.log(`   项目目录: ${CONFIG.projectRoot}`);
    console.log(`   输出文件: ${CONFIG.outputFile}`);
    console.log('');

    const status = checkGitStatus();

    if (!status.isGitRepo) {
        console.log('⚠️  未检测到 Git 仓库');
        saveStatus(status);
        process.exit(0);
    }

    if (status.error) {
        console.log('❌ 检测失败:', status.error);
        saveStatus(status);
        process.exit(1);
    }

    console.log(`✅ 当前分支: ${status.branch}`);
    console.log(`   最近提交: ${status.lastCommit}`);
    console.log('');

    if (status.hasUncommittedChanges) {
        console.log(`📁 发现 ${status.changes} 个未提交变更:`);
        console.log(`   - 修改: ${status.fileCount.modified}`);
        console.log(`   - 暂存: ${status.fileCount.staged}`);
        console.log(`   - 新增: ${status.fileCount.untracked}`);
        console.log('');
        
        if (status.files.length > 0) {
            console.log('   变更文件列表:');
            status.files.forEach(f => console.log(`   ${f}`));
        }
    } else {
        console.log('✨ 工作区干净，无未提交变更');
    }

    console.log('');
    console.log(`📝 状态已保存到: data/local-git-status.json`);

    saveStatus(status);
}

// 运行
main();

/**
 * Photo Monster 安全模式启动器
 * 确保所有操作在安全环境下执行
 */

const fs = require('fs');
const path = require('path');

// 安全模式配置
const SAFE_MODE = {
    enabled: true,
    version: '1.0.0',
    checks: {
        network: true,
        input: true,
        output: true,
        file: true,
        execution: true
    }
};

// 安全检查器
class SafetyChecker {
    constructor() {
        this.issues = [];
        this.warnings = [];
    }

    // 检查Node.js环境
    checkNodeEnvironment() {
        console.log('🔍 检查 Node.js 环境...');
        
        const version = process.version;
        const major = parseInt(version.slice(1).split('.')[0]);
        
        if (major < 14) {
            this.issues.push(`Node.js 版本过低: ${version}，需要 >= 14.0.0`);
        } else {
            console.log(`  ✅ Node.js 版本: ${version}`);
        }

        // 检查是否在安全目录
        const cwd = process.cwd();
        const expectedPaths = ['D:\\PhotoMonster\\tools', '/PhotoMonster/tools'];
        const isSafePath = expectedPaths.some(p => cwd.includes(p.replace(/\\/g, path.sep)));
        
        if (!isSafePath) {
            this.warnings.push(`当前目录可能不安全: ${cwd}`);
        } else {
            console.log(`  ✅ 工作目录安全: ${cwd}`);
        }
    }

    // 检查文件权限
    checkFilePermissions() {
        console.log('\n🔍 检查文件权限...');
        
        const criticalFiles = [
            path.join(__dirname, 'scraper.js'),
            path.join(__dirname, 'update-db.js'),
            path.join(__dirname, 'security-config.js')
        ];

        criticalFiles.forEach(file => {
            if (fs.existsSync(file)) {
                const stats = fs.statSync(file);
                // 检查文件大小（防止被篡改）
                if (stats.size === 0) {
                    this.issues.push(`文件为空: ${path.basename(file)}`);
                } else {
                    console.log(`  ✅ ${path.basename(file)} (${stats.size} bytes)`);
                }
            } else {
                this.issues.push(`关键文件缺失: ${path.basename(file)}`);
            }
        });
    }

    // 检查目录结构
    checkDirectoryStructure() {
        console.log('\n🔍 检查目录结构...');
        
        const requiredDirs = [
            'temp',
            'backups',
            'sources'
        ];

        requiredDirs.forEach(dir => {
            const dirPath = path.join(__dirname, dir);
            if (!fs.existsSync(dirPath)) {
                try {
                    fs.mkdirSync(dirPath, { recursive: true });
                    console.log(`  📁 创建目录: ${dir}`);
                } catch (e) {
                    this.issues.push(`无法创建目录: ${dir}`);
                }
            } else {
                console.log(`  ✅ 目录存在: ${dir}`);
            }
        });
    }

    // 检查安全配置
    checkSecurityConfig() {
        console.log('\n🔍 检查安全配置...');
        
        try {
            const { SecurityConfig, SecurityValidator } = require('./security-config');
            
            // 检查白名单是否配置
            if (SecurityConfig.network.allowedDomains.length === 0) {
                this.issues.push('域名白名单为空');
            } else {
                console.log(`  ✅ 域名白名单: ${SecurityConfig.network.allowedDomains.length} 个`);
            }

            if (SecurityConfig.validation.allowedBrands.length === 0) {
                this.issues.push('品牌白名单为空');
            } else {
                console.log(`  ✅ 品牌白名单: ${SecurityConfig.validation.allowedBrands.length} 个`);
            }

            // 检查验证器
            if (typeof SecurityValidator.sanitizeText !== 'function') {
                this.issues.push('安全验证器未正确加载');
            } else {
                console.log(`  ✅ 安全验证器已加载`);
            }

        } catch (e) {
            this.issues.push(`安全配置加载失败: ${e.message}`);
        }
    }

    // 检查备份
    checkBackups() {
        console.log('\n🔍 检查备份状态...');
        
        const backupDir = path.join(__dirname, 'backups');
        if (fs.existsSync(backupDir)) {
            const backups = fs.readdirSync(backupDir)
                .filter(f => f.startsWith('app.js.backup-'));
            
            if (backups.length === 0) {
                this.warnings.push('没有现有备份，建议先创建备份');
            } else {
                console.log(`  ✅ 现有备份: ${backups.length} 个`);
                const latest = backups.sort().reverse()[0];
                console.log(`     最新: ${latest}`);
            }
        } else {
            this.warnings.push('备份目录不存在');
        }
    }

    // 检查网络连接（不实际连接，只检查配置）
    checkNetworkConfig() {
        console.log('\n🔍 检查网络配置...');
        
        // 检查 node-fetch 是否安装
        try {
            require.resolve('node-fetch');
            console.log('  ✅ node-fetch 已安装');
        } catch (e) {
            this.issues.push('node-fetch 未安装，运行: npm install');
        }

        // 检查超时配置
        const { SecurityConfig } = require('./security-config');
        if (SecurityConfig.network.timeout.total > 60000) {
            this.warnings.push('网络超时设置过长(>60s)');
        } else {
            console.log(`  ✅ 网络超时: ${SecurityConfig.network.timeout.total}ms`);
        }
    }

    // 运行所有检查
    runAllChecks() {
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║     🔒 Photo Monster 安全模式检查                      ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');

        this.checkNodeEnvironment();
        this.checkFilePermissions();
        this.checkDirectoryStructure();
        this.checkSecurityConfig();
        this.checkBackups();
        this.checkNetworkConfig();

        this.report();
    }

    // 生成报告
    report() {
        console.log('\n' + '═'.repeat(56));
        console.log('📊 安全检查报告');
        console.log('═'.repeat(56));

        if (this.issues.length === 0 && this.warnings.length === 0) {
            console.log('\n✅ 所有检查通过！系统安全。\n');
            return true;
        }

        if (this.issues.length > 0) {
            console.log(`\n❌ 发现 ${this.issues.length} 个问题（必须修复）:`);
            this.issues.forEach((issue, i) => {
                console.log(`   ${i + 1}. ${issue}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log(`\n⚠️  发现 ${this.warnings.length} 个警告:`);
            this.warnings.forEach((warning, i) => {
                console.log(`   ${i + 1}. ${warning}`);
            });
        }

        console.log('');
        return this.issues.length === 0;
    }
}

// 安全执行包装器
function safeExecute(fn, ...args) {
    return new Promise((resolve, reject) => {
        // 设置执行超时
        const timeout = setTimeout(() => {
            reject(new Error('执行超时'));
        }, SAFE_MODE.checks.execution ? 300000 : 0);  // 5分钟

        // 监控内存使用
        const memoryCheck = setInterval(() => {
            const usage = process.memoryUsage();
            if (usage.heapUsed > 512 * 1024 * 1024) {  // 512MB
                clearInterval(memoryCheck);
                reject(new Error('内存使用超限'));
            }
        }, 5000);

        Promise.resolve(fn(...args))
            .then(result => {
                clearTimeout(timeout);
                clearInterval(memoryCheck);
                resolve(result);
            })
            .catch(error => {
                clearTimeout(timeout);
                clearInterval(memoryCheck);
                reject(error);
            });
    });
}

// 主函数
async function main() {
    const checker = new SafetyChecker();
    const isSafe = checker.runAllChecks();

    if (!isSafe) {
        console.log('❌ 安全检查未通过，请修复上述问题后再运行。\n');
        process.exit(1);
    }

    console.log('🚀 安全模式已启用，可以安全运行自动更新系统。\n');
    return true;
}

// 导出
module.exports = {
    SAFE_MODE,
    SafetyChecker,
    safeExecute,
    main
};

// 直接运行
if (require.main === module) {
    main();
}

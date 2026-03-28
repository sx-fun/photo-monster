/**
 * Photo Monster 安全检测脚本
 * 每次修改后必须运行此脚本进行验证
 * 
 * 使用方法：node safety-check.js [修改的文件路径]
 * 示例：node safety-check.js js/photo-analysis.js
 */

const fs = require('fs');
const path = require('path');

class SafetyChecker {
    constructor() {
        this.results = [];
        this.errors = [];
        this.warnings = [];
        this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    }

    // ========== 1. 敏感信息扫描 ==========
    scanSensitiveInfo(filePath, content) {
        const patterns = [
            { pattern: /sk-[a-zA-Z0-9]{48}/, name: 'OpenAI API Key' },
            { pattern: /sk-[a-zA-Z0-9]{32}/, name: '通用API Key格式' },
            { pattern: /password\s*[:=]\s*["'][^"']+["']/i, name: '硬编码密码' },
            { pattern: /api[_-]?key\s*[:=]\s*["'][^"']+["']/i, name: '硬编码API Key' },
            { pattern: /secret\s*[:=]\s*["'][^"']+["']/i, name: '硬编码Secret' },
            { pattern: /token\s*[:=]\s*["'][^"']+["']/i, name: '硬编码Token' },
            { pattern: /mongodb\+srv:\/\/[^\s"']+/, name: 'MongoDB连接字符串' },
            { pattern: /mysql:\/\/[^\s"']+/, name: 'MySQL连接字符串' }
        ];

        let found = false;
        patterns.forEach(({ pattern, name }) => {
            const matches = content.match(pattern);
            if (matches) {
                this.errors.push({
                    type: '敏感信息',
                    file: filePath,
                    issue: `发现 ${name}: ${matches[0].substring(0, 20)}...`,
                    severity: 'CRITICAL'
                });
                found = true;
            }
        });

        // 检查注释中是否包含敏感信息
        const commentPatterns = [
            /\/\/.*api.*key/i,
            /\/\*.*api.*key/i,
            /<!--.*api.*key/i
        ];
        
        commentPatterns.forEach(pattern => {
            if (pattern.test(content)) {
                this.warnings.push({
                    type: '敏感信息',
                    file: filePath,
                    issue: '注释中可能包含API Key相关信息',
                    severity: 'WARNING'
                });
            }
        });

        return !found;
    }

    // ========== 2. XSS漏洞检查 ==========
    checkXSSVulnerabilities(filePath, content) {
        const dangerousPatterns = [
            { pattern: /innerHTML\s*=\s*[^;]+/, name: 'innerHTML直接赋值', severity: 'HIGH' },
            { pattern: /outerHTML\s*=\s*[^;]+/, name: 'outerHTML直接赋值', severity: 'HIGH' },
            { pattern: /document\.write\s*\(/, name: 'document.write使用', severity: 'HIGH' },
            { pattern: /eval\s*\(/, name: 'eval使用', severity: 'CRITICAL' },
            { pattern: /new\s+Function\s*\(/, name: 'Function构造函数', severity: 'CRITICAL' },
            { pattern: /setTimeout\s*\(\s*["']/, name: 'setTimeout字符串参数', severity: 'MEDIUM' },
            { pattern: /setInterval\s*\(\s*["']/, name: 'setInterval字符串参数', severity: 'MEDIUM' }
        ];

        let found = false;
        dangerousPatterns.forEach(({ pattern, name, severity }) => {
            if (pattern.test(content)) {
                // 排除明显的误报（如 innerHTML = '' 清空操作）
                if (name === 'innerHTML直接赋值' && /innerHTML\s*=\s*['"]['"]/.test(content)) {
                    return; // 清空操作是安全的
                }
                
                this.errors.push({
                    type: 'XSS漏洞',
                    file: filePath,
                    issue: `发现 ${name}，请确保输入已转义`,
                    severity: severity
                });
                found = true;
            }
        });

        return !found;
    }

    // ========== 3. 代码规范检查 ==========
    checkCodeQuality(filePath, content) {
        const issues = [];

        // 检查console.log是否残留（生产环境应移除或降级）
        const consoleMatches = content.match(/console\.(log|debug)\s*\(/g);
        if (consoleMatches && consoleMatches.length > 5) {
            this.warnings.push({
                type: '代码规范',
                file: filePath,
                issue: `发现 ${consoleMatches.length} 处 console.log，建议清理或改为条件输出`,
                severity: 'LOW'
            });
        }

        // 检查未使用的变量（简单检测）
        const varDeclarations = content.match(/(?:const|let|var)\s+(\w+)/g);
        if (varDeclarations) {
            varDeclarations.forEach(decl => {
                const varName = decl.replace(/(?:const|let|var)\s+/, '');
                const usageCount = (content.match(new RegExp(`\\b${varName}\\b`, 'g')) || []).length;
                if (usageCount === 1) {
                    this.warnings.push({
                        type: '代码规范',
                        file: filePath,
                        issue: `变量 "${varName}" 可能未使用`,
                        severity: 'LOW'
                    });
                }
            });
        }

        // 检查过长的函数
        const functions = content.match(/function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\n\}/g);
        if (functions) {
            functions.forEach(func => {
                const lines = func.split('\n').length;
                if (lines > 50) {
                    this.warnings.push({
                        type: '代码规范',
                        file: filePath,
                        issue: `发现 ${lines} 行的长函数，建议拆分`,
                        severity: 'LOW'
                    });
                }
            });
        }

        return true;
    }

    // ========== 4. 路径和链接检查 ==========
    checkPaths(filePath, content) {
        const dir = path.dirname(filePath);
        
        // 检查相对路径
        const relativePaths = content.match(/["']\.\.?\/[^"']+["']/g) || [];
        
        relativePaths.forEach(relPath => {
            const cleanPath = relPath.replace(/["']/g, '');
            const resolvedPath = path.resolve(dir, cleanPath);
            
            // 检查路径是否超出项目根目录
            const projectRoot = path.resolve(__dirname, '..');
            if (!resolvedPath.startsWith(projectRoot)) {
                this.errors.push({
                    type: '路径安全',
                    file: filePath,
                    issue: `路径 "${cleanPath}" 可能指向项目外部`,
                    severity: 'HIGH'
                });
            }
        });

        return true;
    }

    // ========== 5. HTML特定检查 ==========
    checkHTML(filePath, content) {
        // 检查是否缺少必要的meta标签
        if (!content.includes('<meta charset=')) {
            this.warnings.push({
                type: 'HTML规范',
                file: filePath,
                issue: '缺少 charset meta 标签',
                severity: 'MEDIUM'
            });
        }

        if (!content.includes('viewport')) {
            this.warnings.push({
                type: 'HTML规范',
                file: filePath,
                issue: '缺少 viewport meta 标签（影响移动端适配）',
                severity: 'MEDIUM'
            });
        }

        // 检查外部脚本（CDN）是否使用HTTPS
        const httpScripts = content.match(/src=["']http:\/\/[^"']+/g);
        if (httpScripts) {
            this.warnings.push({
                type: '安全',
                file: filePath,
                issue: `发现 ${httpScripts.length} 个HTTP外部资源，建议改为HTTPS`,
                severity: 'MEDIUM'
            });
        }

        return true;
    }

    // ========== 6. 依赖完整性检查 ==========
    checkDependencies(filePath, content) {
        const ext = path.extname(filePath);
        
        // HTML文件检查脚本引用
        if (ext === '.html') {
            // 检查是否引用了Compressor.js（如果在app.js中使用了Compressor）
            if (content.includes('compressImage') || filePath.includes('photo-analysis')) {
                const hasCompressor = content.includes('compressor') || content.includes('Compressor');
                const hasAppJs = content.includes('app.js');
                
                if (hasAppJs && !hasCompressor && filePath.includes('photo-analysis')) {
                    this.errors.push({
                        type: '依赖缺失',
                        file: filePath,
                        issue: '页面使用了图片压缩功能但未引入 Compressor.js 库',
                        severity: 'HIGH',
                        fix: '在 <head> 中添加: <script src="https://cdn.jsdelivr.net/npm/compressorjs@1.2.1/dist/compressor.min.js"></script>'
                    });
                }
            }
            
            // 检查知识库页面是否引入了 knowledge-base.js
            if (filePath.includes('knowledge') && !content.includes('knowledge-base.js')) {
                this.errors.push({
                    type: '依赖缺失',
                    file: filePath,
                    issue: '知识库页面未引入 knowledge-base.js',
                    severity: 'HIGH',
                    fix: '在 app.js 之前添加: <script src="../js/knowledge-base.js"></script>'
                });
            }
            
            // 检查照片分析页面是否引入了 EXIF 库
            if (filePath.includes('photo-analysis')) {
                const hasExifLib = content.includes('exif-js') || content.includes('exif.min.js');
                if (!hasExifLib) {
                    this.errors.push({
                        type: '依赖缺失',
                        file: filePath,
                        issue: '照片分析页面未引入 EXIF.js 库',
                        severity: 'HIGH',
                        fix: '在 <head> 中添加: <script src="https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.min.js"></script>'
                    });
                }
            }
            
            // 检查照片分析页面是否引入了规则引擎
            if (filePath.includes('photo-analysis')) {
                const hasRuleEngine = content.includes('rule-engine.js');
                if (!hasRuleEngine) {
                    this.errors.push({
                        type: '依赖缺失',
                        file: filePath,
                        issue: '照片分析页面未引入 rule-engine.js',
                        severity: 'HIGH',
                        fix: '在 app.js 之前添加: <script src="../js/rule-engine.js"></script>'
                    });
                }
            }
        }
        
        // JS文件检查全局变量使用
        if (ext === '.js') {
            // 检查是否重复声明全局变量
            const globalVars = ['currentImageData', 'compressedImages', 'currentExifData'];
            globalVars.forEach(varName => {
                const declarationPattern = new RegExp(`(?:const|let|var)\\s+${varName}\\s*=`);
                const declarations = content.match(new RegExp(declarationPattern, 'g')) || [];
                
                if (declarations.length > 0) {
                    // 检查这个文件是否是定义该变量的主文件
                    const isMainFile = filePath.includes('app.js');
                    if (!isMainFile) {
                        this.warnings.push({
                            type: '变量作用域',
                            file: filePath,
                            issue: `文件声明了全局变量 "${varName}"，可能与 app.js 中的定义冲突`,
                            severity: 'MEDIUM',
                            fix: `改用 window.${varName} 或检查是否已存在`
                        });
                    }
                }
            });
        }
        
        return true;
    }

    // ========== 7. 路径一致性检查 ==========
    checkPathConsistency(filePath, content) {
        const dir = path.dirname(filePath);
        const isInPages = filePath.includes('/pages/') || filePath.includes('\\pages\\');
        
        // 检查动态加载脚本的路径是否正确
        const dynamicScriptPatterns = [
            /script\.src\s*=\s*["']([^"']*knowledge-base\.js)["']/g,
            /script\.src\s*=\s*["']([^"']*nav-component\.js)["']/g,
            /script\.src\s*=\s*["']([^"']*app\.js)["']/g
        ];
        
        dynamicScriptPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const scriptPath = match[1];
                
                // 检查路径是否根据当前目录正确设置
                if (isInPages && !scriptPath.startsWith('../') && !scriptPath.startsWith('http')) {
                    this.errors.push({
                        type: '路径错误',
                        file: filePath,
                        issue: `pages 目录下的文件使用了错误的相对路径 "${scriptPath}"`,
                        severity: 'HIGH',
                        fix: `改为 "../${scriptPath}" 或使用条件判断: const isInPages = window.location.pathname.includes('/pages/'); script.src = isInPages ? '../${scriptPath}' : '${scriptPath}';`
                    });
                }
            }
        });
        
        // 检查 HTML 中的脚本引用路径
        if (filePath.endsWith('.html')) {
            const scriptSrcPattern = /<script[^>]+src=["']([^"']+)["']/g;
            let match;
            while ((match = scriptSrcPattern.exec(content)) !== null) {
                const src = match[1];
                
                // 跳过外部链接
                if (src.startsWith('http') || src.startsWith('//')) continue;
                
                // 检查 pages 目录下的文件是否使用了正确的相对路径
                if (isInPages && !src.startsWith('../') && !src.startsWith('./')) {
                    // 检查是否是项目根目录下的文件
                    if (src.startsWith('js/') || src.startsWith('css/')) {
                        this.warnings.push({
                            type: '路径警告',
                            file: filePath,
                            issue: `pages 目录下的文件引用 "${src}" 可能需要使用 "../" 前缀`,
                            severity: 'MEDIUM',
                            fix: `改为 "../${src}"`
                        });
                    }
                }
            }
        }
        
        return true;
    }

    // ========== 8. 功能完整性检查清单 ==========
    generateFunctionChecklist() {
        return {
            coreFeatures: [
                { name: '照片上传功能', test: '上传图片，检查是否正常加载' },
                { name: 'EXIF读取功能', test: '上传带EXIF的照片，检查参数显示' },
                { name: 'AI分析功能', test: '点击分析按钮，检查是否返回结果' },
                { name: 'LocalStorage存储', test: '刷新页面，检查历史记录是否保留' },
                { name: '响应式布局', test: '调整浏览器窗口大小，检查适配' }
            ],
            navigation: [
                { name: '首页链接', test: '点击Logo返回首页' },
                { name: '导航菜单', test: '所有导航链接可正常跳转' },
                { name: '移动端菜单', test: '小屏幕下汉堡菜单正常展开' }
            ],
            crossPage: [
                { name: '样式一致性', test: '各页面风格统一' },
                { name: '页脚信息', test: '隐私政策、使用条款链接有效' }
            ]
        };
    }

    // ========== 7. 执行检测 ==========
    async runCheck(targetFiles) {
        console.log('🔍 Photo Monster 安全检测开始...\n');
        
        const startTime = Date.now();
        
        // 如果没有指定文件，检查所有JS和HTML
        if (!targetFiles || targetFiles.length === 0) {
            targetFiles = this.findAllSourceFiles();
        }

        console.log(`📁 待检测文件: ${targetFiles.length} 个\n`);

        for (const filePath of targetFiles) {
            if (!fs.existsSync(filePath)) {
                this.errors.push({
                    type: '文件',
                    file: filePath,
                    issue: '文件不存在',
                    severity: 'CRITICAL'
                });
                continue;
            }

            const content = fs.readFileSync(filePath, 'utf-8');
            const ext = path.extname(filePath);

            console.log(`  检查: ${path.relative(process.cwd(), filePath)}`);

            // 通用检查
            this.scanSensitiveInfo(filePath, content);
            this.checkXSSVulnerabilities(filePath, content);
            this.checkCodeQuality(filePath, content);
            this.checkPaths(filePath, content);
            this.checkDependencies(filePath, content);
            this.checkPathConsistency(filePath, content);

            // HTML特定检查
            if (ext === '.html') {
                this.checkHTML(filePath, content);
            }
        }

        const duration = Date.now() - startTime;
        
        // 生成报告
        return this.generateReport(duration);
    }

    findAllSourceFiles() {
        const projectRoot = path.resolve(__dirname, '..');
        const files = [];
        
        const scanDir = (dir) => {
            const items = fs.readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    // 跳过node_modules和.git
                    if (item !== 'node_modules' && item !== '.git' && item !== 'backups') {
                        scanDir(fullPath);
                    }
                } else {
                    const ext = path.extname(item);
                    if (ext === '.js' || ext === '.html' || ext === '.css') {
                        files.push(fullPath);
                    }
                }
            }
        };
        
        scanDir(projectRoot);
        return files;
    }

    // ========== 8. 生成报告 ==========
    generateReport(duration) {
        const report = {
            timestamp: this.timestamp,
            duration: `${duration}ms`,
            summary: {
                totalErrors: this.errors.length,
                totalWarnings: this.warnings.length,
                canDeploy: this.errors.length === 0
            },
            errors: this.errors,
            warnings: this.warnings,
            checklist: this.generateFunctionChecklist()
        };

        // 控制台输出
        console.log('\n' + '='.repeat(60));
        console.log('📊 检测报告');
        console.log('='.repeat(60));
        console.log(`⏱️  检测耗时: ${duration}ms`);
        console.log(`❌ 错误: ${this.errors.length}`);
        console.log(`⚠️  警告: ${this.warnings.length}`);
        console.log(`✅ 可部署: ${report.summary.canDeploy ? '是' : '否'}`);
        console.log('='.repeat(60));

        if (this.errors.length > 0) {
            console.log('\n❌ 错误详情:');
            this.errors.forEach((err, i) => {
                console.log(`  ${i + 1}. [${err.severity}] ${err.type}`);
                console.log(`     文件: ${path.relative(process.cwd(), err.file)}`);
                console.log(`     问题: ${err.issue}`);
            });
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️  警告详情:');
            this.warnings.forEach((warn, i) => {
                console.log(`  ${i + 1}. [${warn.severity}] ${warn.type}`);
                console.log(`     文件: ${path.relative(process.cwd(), warn.file)}`);
                console.log(`     问题: ${warn.issue}`);
            });
        }

        console.log('\n📋 功能检查清单（请手动验证）:');
        const checklist = report.checklist;
        console.log('\n  核心功能:');
        checklist.coreFeatures.forEach(f => console.log(`    ☐ ${f.name}`));
        console.log('\n  导航功能:');
        checklist.navigation.forEach(f => console.log(`    ☐ ${f.name}`));
        console.log('\n  跨页面检查:');
        checklist.crossPage.forEach(f => console.log(`    ☐ ${f.name}`));

        console.log('\n' + '='.repeat(60));
        if (report.summary.canDeploy) {
            console.log('✅ 检测通过，可以部署');
        } else {
            console.log('❌ 检测未通过，请修复错误后重新检测');
            console.log('   执行回滚: npm run restore');
        }
        console.log('='.repeat(60) + '\n');

        // 保存报告到文件
        const reportPath = path.join(__dirname, '..', '.safety-reports', `report-${this.timestamp}.json`);
        if (!fs.existsSync(path.dirname(reportPath))) {
            fs.mkdirSync(path.dirname(reportPath), { recursive: true });
        }
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`📄 报告已保存: ${reportPath}\n`);

        return report;
    }
}

// ========== 命令行执行 ==========
if (require.main === module) {
    const targetFiles = process.argv.slice(2).map(f => path.resolve(f));
    const checker = new SafetyChecker();
    checker.runCheck(targetFiles).then(report => {
        process.exit(report.summary.canDeploy ? 0 : 1);
    }).catch(err => {
        console.error('检测执行失败:', err);
        process.exit(1);
    });
}

module.exports = SafetyChecker;

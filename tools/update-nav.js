/**
 * 批量更新页面导航栏脚本
 * 将所有页面的旧导航栏替换为新的组件化导航栏
 */

const fs = require('fs');
const path = require('path');

const pagesDir = path.resolve(__dirname, '..', 'pages');

// 旧导航栏匹配模式（简化版，实际需要根据各页面调整）
const oldNavPatterns = [
    /<nav class="navbar">[\s\S]*?<\/nav>/,
    /<nav[\s\S]*?<\/nav>/
];

// 新的导航栏HTML
const newNav = '<nav class="navbar" id="main-nav"></nav>';

// CSS链接替换
const oldCssLink = '<link rel="stylesheet" href="../css/style.css">';
const newCssLink = `<link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/nav-component.css">`;

// 脚本替换
const oldScriptPattern = /<!-- 加载脚本 -->[\s\S]*?<script src="\.\.\/js\/app\.js"><\/script>/;
const newScripts = `<!-- 加载脚本 -->
    <script src="../js/nav-component.js"></script>
    <script src="../js/app.js"></script>`;

function updatePage(filePath) {
    console.log(`处理: ${path.basename(filePath)}`);
    
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    
    // 1. 替换导航栏
    const navMatch = content.match(/<nav class="navbar">[\s\S]*?<\/nav>/);
    if (navMatch) {
        content = content.replace(navMatch[0], newNav);
        modified = true;
        console.log('  ✓ 导航栏已替换');
    }
    
    // 2. 添加CSS链接
    if (content.includes(oldCssLink) && !content.includes('nav-component.css')) {
        content = content.replace(oldCssLink, newCssLink);
        modified = true;
        console.log('  ✓ CSS链接已添加');
    }
    
    // 3. 替换脚本
    if (oldScriptPattern.test(content)) {
        content = content.replace(oldScriptPattern, newScripts);
        modified = true;
        console.log('  ✓ 脚本已替换');
    }
    
    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log('  ✓ 文件已保存\n');
    } else {
        console.log('  ⚠ 未检测到需要替换的内容\n');
    }
    
    return modified;
}

// 处理所有页面
const pages = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(pagesDir, f));

console.log(`找到 ${pages.length} 个页面文件\n`);
console.log('='.repeat(50) + '\n');

let updatedCount = 0;
pages.forEach(page => {
    if (updatePage(page)) {
        updatedCount++;
    }
});

console.log('='.repeat(50));
console.log(`\n完成: ${updatedCount}/${pages.length} 个页面已更新`);

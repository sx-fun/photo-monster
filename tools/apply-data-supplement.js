/**
 * Photo Monster 数据补充工具
 * 将新机型数据合并到 app.js 的 cameraDatabase 中
 * 
 * 使用方法: node tools/apply-data-supplement.js
 */

const fs = require('fs');
const path = require('path');

// 读取补充数据
const supplement = require('./data-supplement-2025.js');

// 读取现有 app.js
const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
let appJsContent = fs.readFileSync(appJsPath, 'utf8');

console.log('🚀 Photo Monster 数据补充工具\n');
console.log('=====================================');

// 统计新增数据
let newCameraCount = 0;
let newLensCount = 0;

// 生成相机数据插入代码
let cameraInsertCode = '\n// === 2024-2025 新机型补充 (2026-03-30) ===\n';

for (const [brand, models] of Object.entries(supplement.newGearSupplement2025)) {
  for (const [modelName, specs] of Object.entries(models)) {
    cameraInsertCode += `        '${modelName}': {\n`;
    cameraInsertCode += `            type: '${specs.type}',\n`;
    cameraInsertCode += `            sensor: '${specs.sensor}',\n`;
    cameraInsertCode += `            mp: ${specs.mp},\n`;
    cameraInsertCode += `            lowLight: ${specs.lowLight},\n`;
    cameraInsertCode += `            price: '${specs.price}',\n`;
    cameraInsertCode += `            video: '${specs.video}',\n`;
    cameraInsertCode += `            mount: '${specs.mount}',\n`;
    cameraInsertCode += `            bestFor: [${specs.bestFor.map(b => `'${b}'`).join(', ')}],\n`;
    cameraInsertCode += `            releaseDate: '${specs.releaseDate}',\n`;
    cameraInsertCode += `            status: '${specs.status}'\n`;
    cameraInsertCode += `        },\n`;
    newCameraCount++;
  }
}

// 查找 cameraDatabase 中各品牌的结束位置并插入新数据
// 这里我们采用更简单的方法：生成一个补丁文件

const patchContent = `
/**
 * Photo Monster Camera Database Patch
 * 生成时间: ${new Date().toISOString()}
 * 
 * 将此代码合并到 js/app.js 的 cameraDatabase 中
 */

const cameraDatabasePatch = ${JSON.stringify(supplement.newGearSupplement2025, null, 2)};

// 合并方法:
// Object.assign(cameraDatabase.canon.models, cameraDatabasePatch.canon);
// Object.assign(cameraDatabase.sony.models, cameraDatabasePatch.sony);
// ...以此类推
`;

// 保存补丁文件
const patchPath = path.join(__dirname, 'camera-database-patch.js');
fs.writeFileSync(patchPath, patchContent);

console.log(`✅ 已生成数据补丁文件: tools/camera-database-patch.js`);
console.log(`📊 新增相机机型: ${newCameraCount} 款`);

// 生成合并代码示例
const mergeExample = `
// ============================================
// 合并代码示例 (添加到 js/app.js 底部)
// ============================================

// 2024-2025 新机型数据补充
const newGearData = ${JSON.stringify(supplement.newGearSupplement2025, null, 2)};

// 合并到 cameraDatabase
Object.keys(newGearData).forEach(brand => {
    if (cameraDatabase[brand]) {
        Object.assign(cameraDatabase[brand].models, newGearData[brand]);
    }
});

console.log('[Photo Monster] 已加载新机型数据补充');
`;

console.log('\n📋 合并说明:');
console.log('1. 查看 tools/camera-database-patch.js 获取完整补丁');
console.log('2. 手动将新机型添加到 js/app.js 的 cameraDatabase 中');
console.log('3. 或使用上述合并代码自动合并');

// 生成报告
const report = {
  generatedAt: new Date().toISOString(),
  newCameras: newCameraCount,
  brands: Object.keys(supplement.newGearSupplement2025),
  highlights: [
    'Canon EOS R6 Mark III (2025-02)',
    'Canon EOS R5 Mark II (2024-08)',
    'Sony A1 II (2024-11)',
    'Sony A7 VI (2025-09, rumored)',
    'Nikon Z6 III (2024-06)',
    'Nikon Z5 II (2025-04)',
    'Fujifilm X-M5 (2024-10)',
    'Fujifilm GFX100RF (2025-03)',
    'OM System OM-3 (2025-02)'
  ]
};

const reportPath = path.join(__dirname, '..', 'docs', 'data-supplement-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('\n📄 详细报告已保存: docs/data-supplement-report.json');
console.log('\n=====================================');
console.log('✨ 阶段2数据补充准备完成!');
console.log('下一步: 手动合并数据或继续阶段3');

// 保存合并工具
fs.writeFileSync(
  path.join(__dirname, 'merge-supplement.js'),
  mergeExample
);

console.log('\n📝 合并代码已保存: tools/merge-supplement.js');


// 检测相机数据库中缺少 mount 字段的机型
const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'js', 'app.js');
const content = fs.readFileSync(appJsPath, 'utf-8');

// 提取 cameraDatabase 对象
const match = content.match(/const cameraDatabase = \{([\s\S]*?)\};\s*\n/);
if (!match) {
    console.error('无法找到 cameraDatabase');
    process.exit(1);
}

// 解析每个品牌的型号
const dbContent = match[1];
const brandMatches = dbContent.matchAll(/(\w+): \{\s*name: '([^']+)',[\s\S]*?models: \{([\s\S]*?)\n\s*\}\s*\}/g);

const missingMount = [];
const withMount = [];

for (const brandMatch of brandMatches) {
    const brandKey = brandMatch[1];
    const brandName = brandMatch[2];
    const modelsSection = brandMatch[3];
    
    // 提取每个型号
    const modelMatches = modelsSection.matchAll(/'([^']+)': \{([\s\S]*?)\n\s*\}/g);
    
    for (const modelMatch of modelMatches) {
        const modelName = modelMatch[1];
        const modelData = modelMatch[2];
        
        // 检查是否有 mount 字段
        if (!modelData.includes('mount:')) {
            missingMount.push({
                brand: brandName,
                brandKey: brandKey,
                model: modelName
            });
        } else {
            // 提取 mount 值
            const mountMatch = modelData.match(/mount:\s*'([^']+)'/);
            if (mountMatch) {
                withMount.push({
                    brand: brandName,
                    model: modelName,
                    mount: mountMatch[1]
                });
            }
        }
    }
}

console.log('========================================');
console.log('📊 相机数据库 mount 字段检测报告');
console.log('========================================\n');

if (missingMount.length === 0) {
    console.log('✅ 所有相机型号都包含 mount 字段！\n');
} else {
    console.log(`⚠️  发现 ${missingMount.length} 款相机缺少 mount 字段:\n`);
    
    // 按品牌分组
    const byBrand = {};
    missingMount.forEach(item => {
        if (!byBrand[item.brand]) {
            byBrand[item.brand] = [];
        }
        byBrand[item.brand].push(item.model);
    });
    
    for (const [brand, models] of Object.entries(byBrand)) {
        console.log(`${brand}:`);
        models.forEach(model => {
            console.log(`  - ${model}`);
        });
        console.log('');
    }
}

console.log('========================================');
console.log(`总计: ${missingMount.length} 款缺少 mount, ${withMount.length} 款已有 mount`);
console.log('========================================');

// 导出结果供修复使用
if (missingMount.length > 0) {
    console.log('\n📋 修复建议:');
    
    const brandMountMap = {
        'canon': 'RF',
        'sony': 'FE',
        'nikon': 'Z',
        'fujifilm': 'X',
        'panasonic': 'L',
        'olympus': 'M43',
        'leica': 'M',
        'hasselblad': 'XCD'
    };
    
    missingMount.forEach(item => {
        const suggestedMount = brandMountMap[item.brandKey] || '未知';
        console.log(`  ${item.brand} ${item.model} → mount: '${suggestedMount}'`);
    });
}

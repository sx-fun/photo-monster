#!/usr/bin/env node
/**
 * Photo Monster 数据验证工具
 * 验证 new-gear-data.json 和 price-data.json 的完整性和准确性
 */

const fs = require('fs');
const path = require('path');

const NEW_GEAR_DATA = path.join(__dirname, '..', 'data', 'new-gear-data.json');
const PRICE_DATA = path.join(__dirname, '..', 'data', 'price-data.json');

// 验证结果
const validationResults = {
    newGear: { passed: 0, failed: 0, warnings: [] },
    price: { passed: 0, failed: 0, warnings: [] }
};

console.log('🔍 开始验证数据...\n');

// 验证 new-gear-data.json
function validateNewGearData(data) {
    console.log('📷 验证新器材数据...');

    if (!data.cameras || !Array.isArray(data.cameras)) {
        validationResults.newGear.warnings.push('缺少 cameras 数组');
        return false;
    }

    if (!data.lenses || !Array.isArray(data.lenses)) {
        validationResults.newGear.warnings.push('缺少 lenses 数组');
        return false;
    }

    // 验证相机数据
    data.cameras.forEach((camera, index) => {
        const requiredFields = ['id', 'brand', 'model', 'type', 'sensor', 'mount', 'status'];
        const missingFields = requiredFields.filter(field => !camera[field]);

        if (missingFields.length > 0) {
            validationResults.newGear.failed++;
            validationResults.newGear.warnings.push(`相机 ${index + 1} 缺少字段: ${missingFields.join(', ')}`);
        } else {
            validationResults.newGear.passed++;
        }

        // 验证价格合理性
        if (camera.expectedPrice && (camera.expectedPrice < 0 || camera.expectedPrice > 100000)) {
            validationResults.newGear.warnings.push(`${camera.model} 预期价格异常: ${camera.expectedPrice}`);
        }

        // 验证可靠性分数
        if (camera.reliability && (camera.reliability < 1 || camera.reliability > 5)) {
            validationResults.newGear.warnings.push(`${camera.model} 可靠性分数超出范围: ${camera.reliability}`);
        }
    });

    // 验证镜头数据
    data.lenses.forEach((lens, index) => {
        const requiredFields = ['id', 'brand', 'model', 'type', 'mount', 'focalLength', 'aperture'];
        const missingFields = requiredFields.filter(field => !lens[field]);

        if (missingFields.length > 0) {
            validationResults.newGear.failed++;
            validationResults.newGear.warnings.push(`镜头 ${index + 1} 缺少字段: ${missingFields.join(', ')}`);
        } else {
            validationResults.newGear.passed++;
        }

        // 验证价格合理性
        if (lens.expectedPrice && (lens.expectedPrice < 0 || lens.expectedPrice > 50000)) {
            validationResults.newGear.warnings.push(`${lens.model} 预期价格异常: ${lens.expectedPrice}`);
        }
    });

    console.log(`   ✅ 相机: ${data.cameras.length} 款`);
    console.log(`   ✅ 镜头: ${data.lenses.length} 款`);
    console.log(`   ✅ 新闻: ${data.news ? data.news.length : 0} 条`);
}

// 验证 price-data.json
function validatePriceData(data) {
    console.log('💰 验证价格数据...');

    if (!data.cameras || typeof data.cameras !== 'object') {
        validationResults.price.warnings.push('缺少 cameras 对象');
        return false;
    }

    if (!data.lenses || typeof data.lenses !== 'object') {
        validationResults.price.warnings.push('缺少 lenses 对象');
        return false;
    }

    const brands = ['canon', 'sony', 'nikon', 'fujifilm', 'panasonic', 'olympus'];

    brands.forEach(brand => {
        // 验证相机价格
        if (data.cameras[brand]) {
            Object.entries(data.cameras[brand]).forEach(([model, info]) => {
                if (!info.price || info.price < 0) {
                    validationResults.price.warnings.push(`${brand} ${model} 价格无效`);
                    validationResults.price.failed++;
                } else {
                    validationResults.price.passed++;
                }
            });
        }

        // 验证镜头价格
        if (data.lenses[brand]) {
            Object.entries(data.lenses[brand]).forEach(([model, info]) => {
                if (!info.price || info.price < 0) {
                    validationResults.price.warnings.push(`${brand} ${model} 价格无效`);
                    validationResults.price.failed++;
                } else {
                    validationResults.price.passed++;
                }
            });
        }
    });

    let totalCameras = 0;
    let totalLenses = 0;
    brands.forEach(brand => {
        totalCameras += data.cameras[brand] ? Object.keys(data.cameras[brand]).length : 0;
        totalLenses += data.lenses[brand] ? Object.keys(data.lenses[brand]).length : 0;
    });

    console.log(`   ✅ 相机价格: ${totalCameras} 条`);
    console.log(`   ✅ 镜头价格: ${totalLenses} 条`);
}

// 主函数
function main() {
    try {
        // 读取并验证新器材数据
        const newGearData = JSON.parse(fs.readFileSync(NEW_GEAR_DATA, 'utf8'));
        validateNewGearData(newGearData);

        // 读取并验证价格数据
        const priceData = JSON.parse(fs.readFileSync(PRICE_DATA, 'utf8'));
        validatePriceData(priceData);

        // 输出验证结果
        console.log('\n📊 验证结果');
        console.log('=========================================');
        console.log('新器材数据:');
        console.log(`  ✅ 通过: ${validationResults.newGear.passed}`);
        console.log(`  ❌ 失败: ${validationResults.newGear.failed}`);
        console.log(`  ⚠️  警告: ${validationResults.newGear.warnings.length}`);

        console.log('\n价格数据:');
        console.log(`  ✅ 通过: ${validationResults.price.passed}`);
        console.log(`  ❌ 失败: ${validationResults.price.failed}`);
        console.log(`  ⚠️  警告: ${validationResults.price.warnings.length}`);

        if (validationResults.newGear.warnings.length > 0 || validationResults.price.warnings.length > 0) {
            console.log('\n⚠️  警告详情');
            console.log('=========================================');
            validationResults.newGear.warnings.forEach(w => console.log(`  - ${w}`));
            validationResults.price.warnings.forEach(w => console.log(`  - ${w}`));
        }

        const totalFailed = validationResults.newGear.failed + validationResults.price.failed;
        const totalWarnings = validationResults.newGear.warnings.length + validationResults.price.warnings.length;

        if (totalFailed === 0 && totalWarnings === 0) {
            console.log('\n✅ 数据验证通过！所有数据完整且准确。');
        } else if (totalFailed === 0) {
            console.log('\n✅ 数据验证通过（有轻微警告，但不影响使用）。');
        } else {
            console.log('\n❌ 数据验证失败，请检查上述错误。');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ 验证过程中出错:', error.message);
        process.exit(1);
    }
}

main();

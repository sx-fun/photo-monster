/**
 * 价格更新工具
 * 用于手动更新和维护价格参考数据库
 * 生成价格更新报告
 */

const fs = require('fs');
const path = require('path');
const { PRICE_REFERENCE, PriceUtils } = require('./sources/price-reference');

class PriceUpdater {
    constructor() {
        this.priceFile = path.join(__dirname, 'sources', 'price-reference.js');
        this.reportDir = path.join(__dirname, 'temp');
        this.desktopDir = 'D:\\HuaweiMoveData\\Users\\HUAWEI\\Desktop';
        
        // 确保目录存在
        if (!fs.existsSync(this.reportDir)) {
            fs.mkdirSync(this.reportDir, { recursive: true });
        }
    }
    
    /**
     * 生成价格报告
     */
    generatePriceReport() {
        console.log('📊 生成价格参考报告...\n');
        
        const report = {
            generatedAt: new Date().toISOString(),
            version: PRICE_REFERENCE.version,
            summary: this.generateSummary(),
            cameras: this.generateCameraList(),
            lenses: this.generateLensList(),
            priceAnalysis: this.generatePriceAnalysis()
        };
        
        // 保存 JSON 报告
        const jsonPath = path.join(this.reportDir, `price-report-${Date.now()}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf-8');
        
        // 生成文本报告
        const textReport = this.generateTextReport(report);
        const txtPath = path.join(this.reportDir, `price-report-${Date.now()}.txt`);
        fs.writeFileSync(txtPath, textReport, 'utf-8');
        
        // 保存到桌面
        const dateStr = new Date().toISOString().split('T')[0];
        const desktopPath = path.join(this.desktopDir, `PhotoMonster-价格参考-${dateStr}.txt`);
        fs.writeFileSync(desktopPath, textReport, 'utf-8');
        
        console.log('✅ 价格报告已生成:');
        console.log(`   JSON: ${jsonPath}`);
        console.log(`   TXT:  ${txtPath}`);
        console.log(`   桌面: ${desktopPath}`);
        
        return { json: jsonPath, txt: txtPath, desktop: desktopPath };
    }
    
    generateSummary() {
        let cameraCount = 0;
        let lensCount = 0;
        const tierDistribution = { entry: 0, mid: 0, pro: 0, flagship: 0, luxury: 0 };
        
        for (const brand of Object.values(PRICE_REFERENCE.cameras)) {
            for (const camera of Object.values(brand)) {
                cameraCount++;
                tierDistribution[camera.tier] = (tierDistribution[camera.tier] || 0) + 1;
            }
        }
        
        for (const brand of Object.values(PRICE_REFERENCE.lenses)) {
            lensCount += Object.keys(brand).length;
        }
        
        return {
            totalCameras: cameraCount,
            totalLenses: lensCount,
            tierDistribution,
            lastUpdated: PRICE_REFERENCE.lastUpdated
        };
    }
    
    generateCameraList() {
        const cameras = [];
        
        for (const [brand, models] of Object.entries(PRICE_REFERENCE.cameras)) {
            for (const [model, data] of Object.entries(models)) {
                cameras.push({
                    brand: brand.charAt(0).toUpperCase() + brand.slice(1),
                    model,
                    ...data,
                    formattedPrice: PriceUtils.formatPrice(data.price)
                });
            }
        }
        
        // 按品牌和价格排序
        return cameras.sort((a, b) => {
            if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
            return b.price - a.price;
        });
    }
    
    generateLensList() {
        const lenses = [];
        
        for (const [brand, models] of Object.entries(PRICE_REFERENCE.lenses)) {
            for (const [model, data] of Object.entries(models)) {
                lenses.push({
                    brand: brand.charAt(0).toUpperCase() + brand.slice(1),
                    model,
                    ...data,
                    formattedPrice: PriceUtils.formatPrice(data.price)
                });
            }
        }
        
        return lenses.sort((a, b) => b.price - a.price);
    }
    
    generatePriceAnalysis() {
        const analysis = {
            byTier: {},
            byBrand: {},
            recommendations: []
        };
        
        // 按价格区间统计
        for (const [tier, config] of Object.entries(PRICE_REFERENCE.priceTiers)) {
            analysis.byTier[tier] = {
                label: config.label,
                count: 0,
                avgPrice: 0,
                priceRange: `¥${config.min.toLocaleString()}-${config.max === Infinity ? '+' : config.max.toLocaleString()}`
            };
        }
        
        // 按品牌统计
        for (const [brand, models] of Object.entries(PRICE_REFERENCE.cameras)) {
            const prices = Object.values(models).map(m => m.price);
            analysis.byBrand[brand] = {
                count: prices.length,
                avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
                minPrice: Math.min(...prices),
                maxPrice: Math.max(...prices)
            };
        }
        
        // 生成推荐
        analysis.recommendations = this.generateRecommendations();
        
        return analysis;
    }
    
    generateRecommendations() {
        const recs = [];
        
        // 入门推荐
        const entryLevel = this.findCamerasByTier('entry').slice(0, 3);
        recs.push({
            category: '入门首选',
            description: '预算8000元以下，适合初学者',
            cameras: entryLevel
        });
        
        // 中端推荐
        const midLevel = this.findCamerasByTier('mid').slice(0, 3);
        recs.push({
            category: '进阶之选',
            description: '预算8000-15000元，功能均衡',
            cameras: midLevel
        });
        
        // 专业推荐
        const proLevel = this.findCamerasByTier('pro').slice(0, 3);
        recs.push({
            category: '专业创作',
            description: '预算15000-25000元，专业性能',
            cameras: proLevel
        });
        
        return recs;
    }
    
    findCamerasByTier(tier) {
        const cameras = [];
        for (const [brand, models] of Object.entries(PRICE_REFERENCE.cameras)) {
            for (const [model, data] of Object.entries(models)) {
                if (data.tier === tier) {
                    cameras.push({
                        brand: brand.charAt(0).toUpperCase() + brand.slice(1),
                        model,
                        price: data.price,
                        formattedPrice: PriceUtils.formatPrice(data.price)
                    });
                }
            }
        }
        return cameras.sort((a, b) => a.price - b.price);
    }
    
    generateTextReport(report) {
        let text = `===============================================\n`;
        text += `📸 Photo Monster 价格参考报告\n`;
        text += `===============================================\n`;
        text += `生成时间: ${new Date().toLocaleString('zh-CN')}\n`;
        text += `数据版本: ${report.version}\n`;
        text += `最后更新: ${report.summary.lastUpdated}\n`;
        text += `\n`;
        
        // 统计摘要
        text += `📊 统计摘要\n`;
        text += `-----------------------------------------------\n`;
        text += `相机总数: ${report.summary.totalCameras} 款\n`;
        text += `镜头总数: ${report.summary.totalLenses} 款\n`;
        text += `\n价格分布:\n`;
        for (const [tier, count] of Object.entries(report.summary.tierDistribution)) {
            if (count > 0) {
                const tierConfig = PRICE_REFERENCE.priceTiers[tier];
                text += `  ${tierConfig.label}: ${count} 款 (${tierConfig.min/1000}-${tierConfig.max === Infinity ? '+' : tierConfig.max/1000}k)\n`;
            }
        }
        text += `\n`;
        
        // 分品牌价格表
        text += `📷 相机价格参考表\n`;
        text += `-----------------------------------------------\n`;
        
        let currentBrand = '';
        for (const camera of report.cameras) {
            if (camera.brand !== currentBrand) {
                currentBrand = camera.brand;
                text += `\n【${currentBrand}】\n`;
            }
            const tierLabel = PRICE_REFERENCE.priceTiers[camera.tier]?.label || camera.tier;
            const note = camera.note ? ` (${camera.note})` : '';
            text += `  ${camera.model.padEnd(25)} ${camera.formattedPrice.padStart(10)} [${tierLabel}]${note}\n`;
        }
        
        text += `\n`;
        
        // 推荐列表
        text += `💡 选购推荐\n`;
        text += `-----------------------------------------------\n`;
        for (const rec of report.priceAnalysis.recommendations) {
            text += `\n${rec.category} - ${rec.description}\n`;
            for (const camera of rec.cameras) {
                text += `  • ${camera.brand} ${camera.model} - ${camera.formattedPrice}\n`;
            }
        }
        
        text += `\n`;
        
        // 价格趋势
        if (Object.keys(PRICE_REFERENCE.priceTrends).length > 0) {
            text += `📈 近期价格趋势\n`;
            text += `-----------------------------------------------\n`;
            for (const [model, trends] of Object.entries(PRICE_REFERENCE.priceTrends)) {
                if (trends.length >= 2) {
                    const latest = trends[trends.length - 1];
                    const previous = trends[trends.length - 2];
                    const change = ((latest.price - previous.price) / previous.price * 100).toFixed(1);
                    const changeSymbol = change > 0 ? '↑' : change < 0 ? '↓' : '-';
                    text += `  ${model}: ¥${latest.price.toLocaleString()} (${changeSymbol}${change}%)\n`;
                }
            }
            text += `\n`;
        }
        
        text += `===============================================\n`;
        text += `📝 使用说明\n`;
        text += `-----------------------------------------------\n`;
        text += `1. 本价格表为参考价，实际价格以电商平台为准\n`;
        text += `2. 价格采集自京东自营、天猫旗舰店等官方渠道\n`;
        text += `3. 建议每月更新一次价格数据\n`;
        text += `4. 大促期间（618、双11）价格波动较大\n`;
        text += `\n`;
        text += `更新方法:\n`;
        text += `  1. 编辑 tools/sources/price-reference.js\n`;
        text += `  2. 修改对应型号的价格字段\n`;
        text += `  3. 更新 version 和 lastUpdated\n`;
        text += `  4. 运行 node tools/price-updater.js 生成新报告\n`;
        text += `===============================================\n`;
        
        return text;
    }
    
    /**
     * 更新单个产品价格
     */
    updatePrice(category, brand, model, newPrice, source = '') {
        console.log(`📝 更新价格: ${brand} ${model} = ¥${newPrice}`);
        
        // 这里应该实际修改 price-reference.js 文件
        // 为简化，先记录到更新日志
        const updateLog = {
            timestamp: new Date().toISOString(),
            category,
            brand,
            model,
            newPrice,
            source
        };
        
        const logPath = path.join(this.reportDir, 'price-updates.json');
        let logs = [];
        if (fs.existsSync(logPath)) {
            logs = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
        }
        logs.push(updateLog);
        fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), 'utf-8');
        
        console.log('   ✅ 已记录到更新日志');
        return updateLog;
    }
    
    /**
     * 批量导入价格（从CSV或JSON）
     */
    async batchUpdate(dataFile) {
        console.log(`📥 批量导入价格: ${dataFile}`);
        
        if (!fs.existsSync(dataFile)) {
            console.error('   ❌ 文件不存在');
            return;
        }
        
        const ext = path.extname(dataFile).toLowerCase();
        let updates = [];
        
        if (ext === '.json') {
            updates = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
        } else if (ext === '.csv') {
            // 简单CSV解析
            const content = fs.readFileSync(dataFile, 'utf-8');
            const lines = content.split('\n').slice(1); // 跳过标题
            for (const line of lines) {
                const [brand, model, price, source] = line.split(',');
                if (brand && model && price) {
                    updates.push({ brand: brand.trim(), model: model.trim(), price: parseInt(price), source: source?.trim() });
                }
            }
        }
        
        console.log(`   发现 ${updates.length} 条价格更新`);
        
        for (const update of updates) {
            this.updatePrice('camera', update.brand, update.model, update.price, update.source);
        }
        
        console.log('   ✅ 批量导入完成');
    }
}

// 主执行函数
async function main() {
    const updater = new PriceUpdater();
    
    // 默认生成价格报告
    const reports = updater.generatePriceReport();
    
    console.log('\n✅ 价格参考系统就绪！');
    console.log('💡 提示: 定期运行此脚本可生成最新价格报告');
    
    return reports;
}

// 导出供其他模块使用
module.exports = { PriceUpdater };

// 直接执行
if (require.main === module) {
    main().catch(console.error);
}

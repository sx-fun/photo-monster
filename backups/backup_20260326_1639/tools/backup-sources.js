/**
 * Photo Monster 备用数据源模块
 * 当网络抓取失败时的备用方案
 */

const fs = require('fs');
const path = require('path');

class BackupSources {
    constructor() {
        this.dataDir = path.join(__dirname, 'data');
        this.manualDir = path.join(__dirname, 'manual-input');
        
        if (!fs.existsSync(this.manualDir)) {
            fs.mkdirSync(this.manualDir, { recursive: true });
        }
    }

    // 备用方案1: RSS订阅
    getRSSFeeds() {
        return {
            dpreview: 'https://www.dpreview.com/feeds/news.xml',
            sonyAlphaRumors: 'https://www.sonyalpharumors.com/feed/',
            canonRumors: 'https://www.canonrumors.com/feed/',
            nikonRumors: 'https://nikonrumors.com/feed/',
            fujiRumors: 'https://fujirumors.com/feed/',
            '43rumors': 'https://www.43rumors.com/feed/'
        };
    }

    // 备用方案2: 生成本地缓存
    saveLocalCache(data) {
        const cacheFile = path.join(this.dataDir, 'cached-news.json');
        const cache = {
            timestamp: new Date().toISOString(),
            items: data.news || [],
            cameras: data.cameras || [],
            lenses: data.lenses || []
        };
        fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2), 'utf-8');
        console.log('  💾 已保存本地缓存');
    }

    // 备用方案3: 手动输入模板
    generateManualInputTemplate() {
        const template = {
            _comment: "手动输入新器材信息",
            inputDate: new Date().toISOString().split('T')[0],
            cameras: [{
                brand: "sony",
                model: "A7V",
                type: "mirrorless",
                sensor: "fullframe",
                mp: 42,
                mount: "FE",
                source: "manual",
                notes: "手动添加"
            }],
            lenses: []
        };

        const templatePath = path.join(this.manualDir, `manual-input-${Date.now()}.json`);
        fs.writeFileSync(templatePath, JSON.stringify(template, null, 2), 'utf-8');
        console.log(`  📝 已生成手动输入模板: ${templatePath}`);
        return templatePath;
    }

    // 加载手动输入
    loadManualInput() {
        const files = fs.readdirSync(this.manualDir)
            .filter(f => f.startsWith('manual-input-') && f.endsWith('.json'))
            .sort().reverse();
        
        if (files.length === 0) return null;
        
        const latest = files[0];
        const data = JSON.parse(fs.readFileSync(path.join(this.manualDir, latest), 'utf-8'));
        console.log(`  📄 加载手动输入: ${latest}`);
        return data;
    }
}

module.exports = BackupSources;

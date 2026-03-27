/**
 * 索尼官方新闻抓取器
 */

const BaseScraper = require('./base-scraper');

class SonyScraper extends BaseScraper {
    constructor() {
        super('Sony Alpha', 'https://www.sony.com');
    }

    async scrape() {
        console.log('  🔍 抓取 Sony Alpha 新闻...');
        
        try {
            // 索尼新闻页面
            const html = await this.fetch('https://www.sony.com/en_us/SCA/company-news/press-releases.html');
            
            // 提取新闻
            const newsItems = this.extractNewsItems(html);
            
            for (const item of newsItems.slice(0, 5)) {
                if (this.isCameraRelated(item)) {
                    const cameras = this.extractCameraInfo(item.title + ' ' + item.content, 'sony');
                    this.results.cameras.push(...cameras);
                    
                    this.results.news.push({
                        title: item.title,
                        summary: item.content.substring(0, 150),
                        url: item.url,
                        date: item.date,
                        source: 'Sony'
                    });
                }
            }
        } catch (error) {
            console.log(`     ⚠️  网络抓取失败: ${error.message}`);
        }

        return this.results;
    }

    extractNewsItems(html) {
        const items = [];
        // 简化的提取逻辑
        const pressReleaseRegex = /<div[^>]*class="[^"]*press-release[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
        const releases = html.match(pressReleaseRegex) || [];

        for (const release of releases.slice(0, 10)) {
            const titleMatch = release.match(/<h[\d][^>]*>([\s\S]*?)<\/h[\d]>/i);
            if (titleMatch) {
                items.push({
                    title: this.cleanHtml(titleMatch[1]),
                    content: this.cleanHtml(release).substring(0, 300),
                    url: this.baseUrl,
                    date: new Date().toISOString().split('T')[0]
                });
            }
        }

        return items;
    }

    isCameraRelated(item) {
        const keywords = ['alpha', 'camera', 'a7', 'a6', 'mirrorless', 'lens', 'fe mount', 'e mount'];
        const text = (item.title + ' ' + item.content).toLowerCase();
        return keywords.some(k => text.includes(k));
    }
}

module.exports = SonyScraper;

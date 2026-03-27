/**
 * 徕卡官方新闻抓取器
 */

const BaseScraper = require('./base-scraper');

class LeicaScraper extends BaseScraper {
    constructor() {
        super('Leica', 'https://www.leica-camera.com');
    }

    async scrape() {
        console.log('  🔍 抓取 Leica 新闻...');
        
        try {
            const html = await this.fetch('https://www.leica-camera.com/news');
            
            const newsItems = this.extractNewsItems(html);
            
            for (const item of newsItems.slice(0, 5)) {
                if (this.isCameraRelated(item)) {
                    const cameras = this.extractCameraInfo(item.title + ' ' + item.content, 'leica');
                    this.results.cameras.push(...cameras);
                    
                    this.results.news.push({
                        title: item.title,
                        summary: item.content.substring(0, 150),
                        url: item.url,
                        date: item.date,
                        source: 'Leica'
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
        const newsRegex = /<article[^>]*>[\s\S]*?<\/article>/gi;
        const articles = html.match(newsRegex) || [];

        for (const article of articles.slice(0, 10)) {
            const titleMatch = article.match(/<h[\d][^>]*>([\s\S]*?)<\/h[\d]>/i);
            if (titleMatch) {
                items.push({
                    title: this.cleanHtml(titleMatch[1]),
                    content: this.cleanHtml(article).substring(0, 300),
                    url: this.baseUrl,
                    date: new Date().toISOString().split('T')[0]
                });
            }
        }

        return items;
    }

    isCameraRelated(item) {
        const keywords = ['leica', 'm ', 'q ', 'sl ', 'cl ', 'tl ', 'camera'];
        const text = (item.title + ' ' + item.content).toLowerCase();
        return keywords.some(k => text.includes(k));
    }
}

module.exports = LeicaScraper;

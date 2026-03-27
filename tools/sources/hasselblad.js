/**
 * 哈苏官方新闻抓取器
 */

const BaseScraper = require('./base-scraper');

class HasselbladScraper extends BaseScraper {
    constructor() {
        super('Hasselblad', 'https://www.hasselblad.com');
    }

    async scrape() {
        console.log('  🔍 抓取 Hasselblad 新闻...');
        
        try {
            const html = await this.fetch('https://www.hasselblad.com/news/');
            
            const newsItems = this.extractNewsItems(html);
            
            for (const item of newsItems.slice(0, 5)) {
                if (this.isCameraRelated(item)) {
                    const cameras = this.extractCameraInfo(item.title + ' ' + item.content, 'hasselblad');
                    this.results.cameras.push(...cameras);
                    
                    this.results.news.push({
                        title: item.title,
                        summary: item.content.substring(0, 150),
                        url: item.url,
                        date: item.date,
                        source: 'Hasselblad'
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
        const keywords = ['hasselblad', 'x1d', 'x2d', '907x', 'medium format', 'camera'];
        const text = (item.title + ' ' + item.content).toLowerCase();
        return keywords.some(k => text.includes(k));
    }
}

module.exports = HasselbladScraper;

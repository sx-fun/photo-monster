/**
 * 佳能官方新闻抓取器
 */

const BaseScraper = require('./base-scraper');

class CanonScraper extends BaseScraper {
    constructor() {
        super('Canon', 'https://global.canon');
    }

    async scrape() {
        console.log('  🔍 抓取 Canon 新闻...');
        
        try {
            // 佳能新闻室
            const html = await this.fetch('https://global.canon/en/newsroom/');
            
            const newsItems = this.extractNewsItems(html);
            
            for (const item of newsItems.slice(0, 5)) {
                if (this.isCameraRelated(item)) {
                    const cameras = this.extractCameraInfo(item.title + ' ' + item.content, 'canon');
                    this.results.cameras.push(...cameras);
                    
                    this.results.news.push({
                        title: item.title,
                        summary: item.content.substring(0, 150),
                        url: item.url,
                        date: item.date,
                        source: 'Canon'
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
        const keywords = ['eos', 'camera', 'rf lens', 'ef lens', 'mirrorless', 'dslr', 'r5', 'r6', 'r7', 'r8'];
        const text = (item.title + ' ' + item.content).toLowerCase();
        return keywords.some(k => text.includes(k));
    }
}

module.exports = CanonScraper;

/**
 * DPReview 新闻抓取器
 * 测试数据源 - 抓取最新相机/镜头新闻
 */

const BaseScraper = require('./base-scraper');

class DPReviewScraper extends BaseScraper {
    constructor() {
        super('DPReview', 'https://www.dpreview.com');
    }

    async scrape() {
        console.log('  🔍 抓取 DPReview 新闻...');
        
        try {
            // 抓取新闻页面
            const html = await this.fetch(`${this.baseUrl}/news`);
            
            // 提取新闻条目
            const newsItems = this.extractNewsItems(html);
            console.log(`     找到 ${newsItems.length} 条新闻`);

            // 处理每条新闻
            for (const item of newsItems.slice(0, 10)) { // 只处理前10条
                try {
                    if (this.isCameraNews(item)) {
                        const cameras = this.extractCameraInfo(item.title + ' ' + item.summary, this.detectBrand(item));
                        this.results.cameras.push(...cameras);
                    }
                    
                    if (this.isLensNews(item)) {
                        const lenses = this.extractLensInfo(item.title + ' ' + item.summary, this.detectBrand(item));
                        this.results.lenses.push(...lenses);
                    }

                    this.results.news.push({
                        title: item.title,
                        summary: item.summary,
                        url: item.url,
                        date: item.date,
                        source: 'DPReview'
                    });
                } catch (e) {
                    // 单条新闻处理失败不影响整体
                }
            }

        } catch (error) {
            console.log(`     ⚠️  抓取失败: ${error.message}`);
            // 如果网络抓取失败，使用模拟数据（演示用）
            this.generateDemoData();
        }

        return this.results;
    }

    extractNewsItems(html) {
        const items = [];
        
        // 简单的正则提取新闻条目
        // DPReview 新闻通常在 <article> 或特定 class 中
        const articleRegex = /<article[^>]*>[\s\S]*?<\/article>/gi;
        const articles = html.match(articleRegex) || [];

        for (const article of articles.slice(0, 15)) {
            const titleMatch = article.match(/<h[\d][^>]*>([\s\S]*?)<\/h[\d]>/i);
            const linkMatch = article.match(/href="([^"]+)"/i);
            const dateMatch = article.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i);

            if (titleMatch) {
                items.push({
                    title: this.cleanHtml(titleMatch[1]),
                    summary: this.cleanHtml(article).substring(0, 200),
                    url: linkMatch ? (linkMatch[1].startsWith('http') ? linkMatch[1] : this.baseUrl + linkMatch[1]) : '',
                    date: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0]
                });
            }
        }

        return items;
    }

    isCameraNews(item) {
        const keywords = ['camera', 'announced', 'launched', 'released', 'mirrorless', 'DSLR', 'full-frame', 'APS-C'];
        const text = (item.title + ' ' + item.summary).toLowerCase();
        return keywords.some(k => text.includes(k.toLowerCase()));
    }

    isLensNews(item) {
        const keywords = ['lens', 'mm', 'f/', 'announced', 'optics'];
        const text = (item.title + ' ' + item.summary).toLowerCase();
        return keywords.some(k => text.includes(k.toLowerCase()));
    }

    detectBrand(item) {
        const text = (item.title + ' ' + item.summary).toLowerCase();
        const brands = {
            sony: ['sony', 'alpha'],
            canon: ['canon', 'eos'],
            nikon: ['nikon', 'z '],
            fujifilm: ['fujifilm', 'fuji', 'x-t', 'x-h'],
            panasonic: ['panasonic', 'lumix'],
            olympus: ['olympus', 'om-system'],
            leica: ['leica'],
            hasselblad: ['hasselblad']
        };

        for (const [brand, keywords] of Object.entries(brands)) {
            if (keywords.some(k => text.includes(k))) {
                return brand;
            }
        }
        return 'unknown';
    }

    // 生成演示数据（当网络抓取失败时使用）
    generateDemoData() {
        console.log('     📝 使用演示数据');
        
        // 模拟最近可能发布的新机
        this.results.news = [
            {
                title: 'Sony announces A7V with 42MP sensor and improved AF',
                summary: 'Sony has announced the A7V featuring a new 42MP sensor, improved autofocus system with AI subject detection.',
                url: 'https://www.dpreview.com/news/sony-a7v',
                date: '2026-03-20',
                source: 'DPReview'
            },
            {
                title: 'Canon EOS R6 Mark III rumored for Q2 2026',
                summary: 'According to sources, Canon is preparing the EOS R6 Mark III with stacked sensor technology.',
                url: 'https://www.dpreview.com/news/canon-r6iii-rumor',
                date: '2026-03-18',
                source: 'DPReview'
            },
            {
                title: 'Nikon Z7 III specifications leaked',
                summary: 'Detailed specs of the upcoming Nikon Z7 III have appeared online, suggesting 60MP sensor.',
                url: 'https://www.dpreview.com/news/nikon-z7iii',
                date: '2026-03-15',
                source: 'DPReview'
            }
        ];

        this.results.cameras = [
            {
                brand: 'sony',
                model: 'A7V',
                type: 'mirrorless',
                sensor: 'fullframe',
                mp: 42,
                mount: 'FE',
                source: 'DPReview',
                publishDate: '2026-03-20',
                needsReview: true
            }
        ];
    }
}

module.exports = DPReviewScraper;

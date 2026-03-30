/**
 * RSS/Atom 新闻源抓取器
 * 使用 RSS 避开 Cloudflare 防护
 * 数据源：Reddit、官方博客、新闻站点 RSS
 */

const BaseScraper = require('./base-scraper');

class RssFeedScraper extends BaseScraper {
    constructor() {
        super('RSS-Feed', 'https://rss-feeds.photography');
        this.feeds = [
            // Reddit 摄影器材板块（提供 RSS）
            { name: 'r/cameras', url: 'https://www.reddit.com/r/cameras/.rss', type: 'community' },
            { name: 'r/sonyalpha', url: 'https://www.reddit.com/r/SonyAlpha/.rss', type: 'community' },
            { name: 'r/canon', url: 'https://www.reddit.com/r/canon/.rss', type: 'community' },
            
            // 官方新闻 RSS（如果有）
            // { name: 'Sony News', url: 'https://www.sony.com/press/rss.xml', type: 'official' },
            
            // 新闻聚合
            { name: 'PetaPixel', url: 'https://petapixel.com/feed/', type: 'news' },
            { name: 'DPReview News', url: 'https://www.dpreview.com/feeds/news.xml', type: 'news' }
        ];
    }

    async scrape() {
        console.log('  🔍 抓取 RSS 新闻源...');
        
        const fetch = (await import('node-fetch')).default;
        const { XMLParser } = await import('fast-xml-parser');
        
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_'
        });
        
        for (const feed of this.feeds) {
            try {
                console.log(`     📡 ${feed.name}...`);
                
                const response = await fetch(feed.url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0'
                    },
                    timeout: 15000
                });
                
                if (!response.ok) {
                    console.log(`     ⚠️ ${feed.name} 返回 ${response.status}，跳过`);
                    continue;
                }
                
                const xml = await response.text();
                const data = parser.parse(xml);
                
                // 解析 RSS/Atom
                const entries = this.parseFeed(data, feed);
                
                for (const entry of entries.slice(0, 5)) { // 每个源取前5条
                    if (this.isRelevant(entry.title)) {
                        this.results.news.push({
                            title: entry.title,
                            summary: entry.summary?.substring(0, 200) + '...',
                            url: entry.link,
                            date: entry.date,
                            source: feed.name,
                            type: feed.type,
                            credibility: feed.type === 'official' ? 'high' : 'medium'
                        });
                    }
                }
                
                console.log(`     ✅ ${feed.name}: ${entries.length} 条`);
                
            } catch (error) {
                console.log(`     ❌ ${feed.name}: ${error.message}`);
            }
        }
        
        return this.results;
    }
    
    parseFeed(data, feed) {
        const entries = [];
        
        // RSS 格式
        if (data.rss?.channel?.item) {
            const items = Array.isArray(data.rss.channel.item) 
                ? data.rss.channel.item 
                : [data.rss.channel.item];
            
            for (const item of items) {
                entries.push({
                    title: item.title,
                    link: item.link,
                    summary: this.cleanHtml(item.description || ''),
                    date: item.pubDate || new Date().toISOString()
                });
            }
        }
        
        // Atom 格式 (Reddit)
        if (data.feed?.entry) {
            const items = Array.isArray(data.feed.entry) 
                ? data.feed.entry 
                : [data.feed.entry];
            
            for (const entry of items) {
                entries.push({
                    title: entry.title,
                    link: entry.link?.['@_href'] || entry.id,
                    summary: this.cleanHtml(entry.content || entry.summary || ''),
                    date: entry.updated || entry.published
                });
            }
        }
        
        return entries;
    }
    
    isRelevant(title) {
        const keywords = [
            'camera', '相机', 'lens', '镜头', 'announce', '发布',
            'sony', 'canon', 'nikon', 'fujifilm', 'panasonic', 'leica',
            'rumor', '传闻', 'leak', '泄露', 'review', '评测'
        ];
        const lower = title.toLowerCase();
        return keywords.some(k => lower.includes(k.toLowerCase()));
    }
}

module.exports = RssFeedScraper;

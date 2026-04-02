/**
 * 本地结构化数据源
 * 手动维护，保证数据质量和可用性
 * 更新方式：直接编辑此文件或从可信来源复制
 */

const LOCAL_DATA = {
    // 数据版本（用于追踪变更）
    version: '2026.04.02.001',
    lastUpdated: '2026-04-02',
    
    // 数据来源说明
    sources: [
        { name: 'SonyAlphaRumors', url: 'https://sonyalpharumors.com', reliability: 'high' },
        { name: 'CanonRumors', url: 'https://canonrumors.com', reliability: 'high' },
        { name: 'NikonRumors', url: 'https://nikonrumors.com', reliability: 'high' },
        { name: 'FujiRumors', url: 'https://fujirumors.com', reliability: 'high' },
        { name: '各大厂商官方', url: 'various', reliability: 'official' }
    ],
    
    // 相机数据（带完整元数据）
    cameras: [
        {
            id: 'sony-a7v-2026',
            brand: 'sony',
            model: 'Alpha 7 V',
            status: 'official',
            rumorDate: '2025-12-02',
            expectedSpecs: {
                mp: 33,
                sensor: 'fullframe',
                sensorType: 'Exmor R CMOS',
                mount: 'FE',
                ibis: '5轴防抖',
                video: '7K超采样4K60p / Super 35 4K120p',
                af: 'AI实时识别对焦',
                burst: '最高30fps'
            },
            expectedPrice: { cn: 17999, us: 0, eu: 0 },
            expectedRelease: '2025-12-02',
            sources: ['Sony China Official'],
            confidence: 'high',
            notes: '已由索尼中国官方发布，核心升级为3300万像素、AI对焦与7K超采样视频能力'
        },
        {
            id: 'canon-r6m3-2026',
            brand: 'canon',
            model: 'EOS R6 Mark III',
            status: 'official',
            rumorDate: '2025-11-06',
            expectedSpecs: {
                mp: 32.5,
                sensor: 'fullframe',
                sensorType: 'CMOS',
                mount: 'RF',
                ibis: '机身防抖',
                video: '7K RAW / 4K120p',
                af: '双像素智能对焦',
                burst: '12fps机械 / 40fps电子'
            },
            expectedPrice: { cn: 16999, us: 0, eu: 0 },
            expectedRelease: '2025-11-06',
            sources: ['Canon China Official'],
            confidence: 'high',
            notes: '佳能中国官网已上线产品页，现阶段可确认3250万像素、40fps电子连拍与7K RAW视频规格'
        },
        {
            id: 'fuji-xt50-2026',
            brand: 'fujifilm',
            model: 'X-T50',
            status: 'official',
            rumorDate: '2024-05-16',
            expectedSpecs: {
                mp: 40.2,
                sensor: 'APS-C',
                sensorType: 'X-Trans CMOS 5 HR',
                mount: 'X',
                ibis: '7-stop',
                video: '6.2K30p',
                af: '深度学习AF',
                burst: '20fps'
            },
            expectedPrice: { cn: 9999, us: 0, eu: 0 },
            expectedRelease: '2024-05-16',
            sources: ['Fujifilm China Official'],
            confidence: 'high',
            notes: '富士中国官方已确认X-T50为4020万像素轻量化APS-C机型，当前应视为已发布机型而非2026年传闻'
        },
        {
            id: 'nikon-z7iii-2026',
            brand: 'nikon',
            model: 'Z7 III',
            status: 'rumored',
            rumorDate: '2026-02-28',
            expectedSpecs: {
                mp: 60,
                sensor: 'fullframe',
                sensorType: 'BSI CMOS',
                mount: 'Z',
                ibis: '6-stop',
                video: '8K30p',
                af: '3D追焦V2',
                burst: '12fps'
            },
            expectedPrice: { cn: 22999, us: 2999, eu: 3299 },
            expectedRelease: '2026-Q3',
            sources: ['NikonRumors'],
            confidence: 'low',
            notes: '传闻较少，可能推迟到下半年'
        },
        {
            id: 'panasonic-s1ii-2026',
            brand: 'panasonic',
            model: 'Lumix S1 II',
            status: 'rumored',
            rumorDate: '2026-03-05',
            expectedSpecs: {
                mp: 36,
                sensor: 'fullframe',
                sensorType: 'BSI CMOS',
                mount: 'L',
                ibis: '7.5-stop',
                video: '6K60p ProRes',
                af: '相位对焦V2',
                burst: '15fps'
            },
            expectedPrice: { cn: 18999, us: 2499, eu: 2799 },
            expectedRelease: '2026-Q3',
            sources: ['43Rumors'],
            confidence: 'medium',
            notes: 'S1系列时隔多年更新，视频功能仍是强项'
        }
    ],
    
    // 镜头数据
    lenses: [
        {
            id: 'sony-85gm2-2026',
            brand: 'sony',
            model: 'FE 85mm f/1.2 GM II',
            status: 'rumored',
            type: 'prime',
            focalLength: '85mm',
            aperture: 'f/1.2',
            mount: 'FE',
            expectedPrice: { cn: 15999, us: 1999, eu: 2199 },
            expectedRelease: '2026-Q2',
            sources: ['SonyAlphaRumors'],
            confidence: 'medium',
            features: ['XD线性马达', '轻量化设计', '防尘防滴']
        },
        {
            id: 'canon-rf35-12-2026',
            brand: 'canon',
            model: 'RF 35mm f/1.2L USM',
            status: 'rumored',
            type: 'prime',
            focalLength: '35mm',
            aperture: 'f/1.2',
            mount: 'RF',
            expectedPrice: { cn: 13999, us: 1799, eu: 1999 },
            expectedRelease: '2026-Q2',
            sources: ['CanonRumors'],
            confidence: 'medium',
            features: ['BR镜片', 'Nano USM', '防尘防滴']
        },
        {
            id: 'nikon-z28-400-2026',
            brand: 'nikon',
            model: 'Z 28-400mm f/4-8 VR',
            status: 'official',
            type: 'zoom',
            focalLength: '28-400mm',
            aperture: 'f/4-8',
            mount: 'Z',
            expectedPrice: { cn: 9999, us: 1299.95, eu: 0 },
            expectedRelease: '2024-04-04',
            sources: ['Nikon Official'],
            confidence: 'high',
            features: ['14.3倍变焦', 'VR防抖', '轻量化']
        },
        {
            id: 'nikon-z70-200-s2-2026',
            brand: 'nikon',
            model: 'Z 70-200mm f/2.8 VR S II',
            status: 'official',
            type: 'zoom',
            focalLength: '70-200mm',
            aperture: 'f/2.8',
            mount: 'Z',
            expectedPrice: { cn: 19999, us: 0, eu: 0 },
            expectedRelease: '2026-02-24',
            sources: ['Nikon China Official'],
            confidence: 'high',
            features: ['内变焦', 'SSVCM马达', '轻量化设计']
        },
        {
            id: 'nikon-z24-105-2026',
            brand: 'nikon',
            model: 'Z 24-105mm f/4-7.1',
            status: 'official',
            type: 'zoom',
            focalLength: '24-105mm',
            aperture: 'f/4-7.1',
            mount: 'Z',
            expectedPrice: { cn: 3980, us: 0, eu: 0 },
            expectedRelease: '2026-02-03',
            sources: ['Nikon China Official'],
            confidence: 'high',
            features: ['轻量化挂机镜头', '全画幅', '旅行覆盖焦段']
        },
        {
            id: 'fuji-xf400-2026',
            brand: 'fujifilm',
            model: 'XF 400mm f/5.6 R LM OIS WR',
            status: 'rumored',
            type: 'prime',
            focalLength: '400mm',
            aperture: 'f/5.6',
            mount: 'X',
            expectedPrice: { cn: 8999, us: 1099, eu: 1299 },
            expectedRelease: '2026-Q3',
            sources: ['FujiRumors'],
            confidence: 'low',
            features: ['轻量化长焦', 'OIS防抖', 'WR防护']
        }
    ],
    
    // 新闻条目
    news: [
        {
            id: 'news-001',
            title: '【官方】索尼 Alpha 7 V 已正式发布并上市',
            type: 'official',
            date: '2025-12-02',
            summary: '索尼中国官方已发布 Alpha 7 V，确认约3300万有效像素、AI实时识别对焦，以及全画幅7K超采样4K60p视频规格，中国区建议零售价为17999元。',
            source: 'Sony China Official',
            url: 'https://www.sony.com.cn/content/sonyportal/zh-cn/cms/newscenter/product/2025/20251202.html.html',
            tags: ['sony', 'a7v', 'fullframe', 'official'],
            relatedGear: ['sony-a7v-2026']
        },
        {
            id: 'news-002',
            title: '【官方】佳能 EOS R6 Mark III 产品页确认核心规格',
            type: 'official',
            date: '2025-11-06',
            summary: '佳能中国官网已上线 EOS R6 Mark III 产品页，可确认其采用约3250万像素全画幅传感器，支持40fps电子连拍、7K RAW 与 4K120p 视频。',
            source: 'Canon China Official',
            url: 'https://www.canon.com.cn/product/r6iii/',
            tags: ['canon', 'r6', 'fullframe', 'official'],
            relatedGear: ['canon-r6m3-2026']
        },
        {
            id: 'news-003',
            title: '【官方】尼康发布 Z 70-200mm f/2.8 VR S II',
            type: 'official',
            date: '2026-02-24',
            summary: '尼康中国于2月下旬发布新一代 Z 70-200mm f/2.8 VR S II，主打更轻量机身、内变焦设计和更快自动对焦，国行定价约19999元。',
            source: 'Nikon China Official',
            url: 'https://www.nikon.com.cn/sc_CN/product/nikkor-lenses/z-mount/zoom/telephoto-zoom/z-70-200mm-f-2-8-vr-s-ii',
            tags: ['nikon', 'z-mount', 'lens', 'official'],
            relatedGear: ['nikon-z70-200-s2-2026']
        },
        {
            id: 'news-004',
            title: '【官方】尼康发布轻量化 Z 24-105mm f/4-7.1',
            type: 'official',
            date: '2026-02-03',
            summary: '尼康中国发布 Z 24-105mm f/4-7.1 全画幅变焦镜头，定位日常挂机和旅行拍摄，国行定价约3980元。',
            source: 'Nikon China Official',
            url: 'https://www.nikon.com.cn/sc_CN/product/nikkor-lenses/z-mount/zoom/telephoto-zoom/z-24-105mm-f-4-7-1',
            tags: ['nikon', 'z-mount', 'lens', 'official'],
            relatedGear: ['nikon-z24-105-2026']
        },
        {
            id: 'news-005',
            title: '【传闻】佳能 RE-1 复古全画幅机型持续发酵',
            type: 'rumor',
            date: '2026-03-01',
            summary: '多家摄影媒体在3月继续跟进 Canon RE-1 传闻，普遍认为其将围绕 AE-1 五十周年节点推出，但目前仍缺少官方确认与完整规格。',
            source: 'CanonRumors / 媒体汇总',
            url: 'https://www.canonrumors.com',
            tags: ['canon', 're-1', 'fullframe', 'rumor']
        },
        {
            id: 'news-006',
            title: '【行业】2026年Q1相机市场报告：无反增长15%',
            type: 'industry',
            date: '2026-03-18',
            summary: 'CIPA发布最新数据：无反相机出货量同比增长15%，中国市场表现强劲，高端机型需求持续上升。',
            source: 'CIPA',
            url: 'https://www.cipa.jp',
            tags: ['industry', 'market', 'cipa']
        }
    ],
    
    // 价格监控数据（可手动更新）
    priceUpdates: [
        {
            brand: 'sony',
            model: 'A7M4',
            platform: '京东自营',
            currentPrice: 14999,
            previousPrice: 15999,
            currency: 'CNY',
            change: -6.3,
            date: '2026-03-28'
        },
        {
            brand: 'canon',
            model: 'EOS R6 Mark II',
            platform: '天猫旗舰店',
            currentPrice: 13999,
            previousPrice: 14999,
            currency: 'CNY',
            change: -6.7,
            date: '2026-03-28'
        },
        {
            brand: 'nikon',
            model: 'Z6 III',
            platform: '京东自营',
            currentPrice: 16499,
            previousPrice: 16999,
            currency: 'CNY',
            change: -2.9,
            date: '2026-03-28'
        }
    ]
};

module.exports = LOCAL_DATA;

/**
 * 本地结构化数据源
 * 手动维护，保证数据质量和可用性
 * 更新方式：直接编辑此文件或从可信来源复制
 */

const LOCAL_DATA = {
    // 数据版本（用于追踪变更）
    version: '2026.03.28.001',
    lastUpdated: '2026-03-28',
    
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
            model: 'A7V',
            status: 'rumored',
            rumorDate: '2026-03-15',
            expectedSpecs: {
                mp: 44,
                sensor: 'fullframe',
                sensorType: 'BSI CMOS',
                mount: 'FE',
                ibis: '8-stop',
                video: '8K30p / 4K120p',
                af: 'AI主体识别',
                burst: '15fps机械 / 30fps电子'
            },
            expectedPrice: { cn: 18999, us: 2499, eu: 2799 },
            expectedRelease: '2026-Q2',
            sources: ['SonyAlphaRumors'],
            confidence: 'medium',
            notes: '基于A7IV升级，AI对焦是主要卖点，可能搭载新处理器'
        },
        {
            id: 'canon-r6m3-2026',
            brand: 'canon',
            model: 'EOS R6 Mark III',
            status: 'rumored',
            rumorDate: '2026-03-10',
            expectedSpecs: {
                mp: 24,
                sensor: 'fullframe',
                sensorType: '堆栈式CMOS',
                mount: 'RF',
                ibis: '8-stop',
                video: '8K60p RAW',
                af: '双核对焦V2',
                burst: '40fps电子'
            },
            expectedPrice: { cn: 16999, us: 2299, eu: 2599 },
            expectedRelease: '2026-Q2',
            sources: ['CanonRumors'],
            confidence: 'medium',
            notes: '对标索尼A7V，强调视频性能'
        },
        {
            id: 'fuji-xt50-2026',
            brand: 'fujifilm',
            model: 'X-T50',
            status: 'rumored',
            rumorDate: '2026-03-20',
            expectedSpecs: {
                mp: 40,
                sensor: 'APS-C',
                sensorType: 'X-Trans V',
                mount: 'X',
                ibis: '7-stop',
                video: '6.2K30p',
                af: '深度学习AF',
                burst: '20fps'
            },
            expectedPrice: { cn: 11999, us: 1499, eu: 1699 },
            expectedRelease: '2026-04',
            sources: ['FujiRumors'],
            confidence: 'high',
            notes: 'X-T系列40MP首机，4月发布可能性大'
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
            status: 'announced',
            type: 'zoom',
            focalLength: '28-400mm',
            aperture: 'f/4-8',
            mount: 'Z',
            expectedPrice: { cn: 9999, us: 1299, eu: 1499 },
            expectedRelease: '2026-04',
            sources: ['Nikon Official'],
            confidence: 'high',
            features: ['14.3倍变焦', 'VR防抖', '轻量化']
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
            title: '【传闻】Sony A7V 详细规格曝光：44MP + AI对焦',
            type: 'rumor',
            date: '2026-03-26',
            summary: '据 SonyAlphaRumors 消息，A7V 将搭载4400万像素BSI传感器，配备全新AI主体识别对焦系统，支持8K30p视频录制，预计2026年Q2发布，售价约$2499。',
            source: 'SonyAlphaRumors',
            url: 'https://www.sonyalpharumors.com',
            tags: ['sony', 'a7v', 'fullframe', 'rumor'],
            relatedGear: ['sony-a7v-2026']
        },
        {
            id: 'news-002',
            title: '【传闻】Canon EOS R6 Mark III 规格泄露',
            type: 'rumor',
            date: '2026-03-24',
            summary: 'CanonRumors 泄露了 R6 III 的详细规格：2400万像素堆栈式传感器，40fps连拍，支持8K60p视频录制，预计售价$2299。',
            source: 'CanonRumors',
            url: 'https://www.canonrumors.com',
            tags: ['canon', 'r6', 'fullframe', 'rumor'],
            relatedGear: ['canon-r6m3-2026']
        },
        {
            id: 'news-003',
            title: '【官方】尼康发布 Z6 III 固件更新 v2.0',
            type: 'official',
            date: '2026-03-23',
            summary: '尼康官方发布 Z6 III 固件2.0版本，新增鸟类检测AF、改进低光对焦性能，同时优化了视频录制时的散热表现。',
            source: 'Nikon Official',
            url: 'https://www.nikon.com',
            tags: ['nikon', 'z6iii', 'firmware', 'official']
        },
        {
            id: 'news-004',
            title: '【传闻】Fujifilm X-T50 将于4月发布',
            type: 'rumor',
            date: '2026-03-21',
            summary: 'FujiRumors 称 X-T50 将在4月发布，搭载4000万像素X-Trans V传感器，7档IBIS防抖，预计售价$1499。',
            source: 'FujiRumors',
            url: 'https://www.fujirumors.com',
            tags: ['fujifilm', 'xt50', 'aps-c', 'rumor'],
            relatedGear: ['fuji-xt50-2026']
        },
        {
            id: 'news-005',
            title: '【官方】松下 Lumix S9 正式发布',
            type: 'official',
            date: '2026-03-20',
            summary: '松下正式发布全画幅紧凑型相机 Lumix S9，2420万像素，仅重486g，支持实时LUT，售价$1499。',
            source: 'Panasonic Official',
            url: 'https://www.panasonic.com',
            tags: ['panasonic', 's9', 'fullframe', 'official']
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

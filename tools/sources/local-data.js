/**
 * 本地结构化数据源
 * 手动维护，保证数据质量和可用性
 * 更新方式：直接编辑此文件或从可信来源复制
 */

const LOCAL_DATA = {
    // 数据版本（用于追踪变更）
    version: '2026.05.27.001',
    lastUpdated: '2026-04-27',
    
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
            id: 'canon-r6v-2026',
            brand: 'canon',
            model: 'EOS R6 V',
            status: 'announced',
            rumorDate: '2026-04-21',
            expectedSpecs: {
                mp: 32.5,
                sensor: 'fullframe',
                sensorType: 'CMOS',
                mount: 'RF',
                ibis: '机身防抖',
                video: '4K RAW Internal / 4K120p / 7K Open Gate',
                af: '双像素CMOS AF II',
                burst: '40fps电子'
            },
            expectedPrice: { cn: 0, us: 0, eu: 0 },
            expectedRelease: '2026-05-13',
            sources: ['CanonRumors', 'notebookcheck', 'thenewcamera'],
            confidence: 'high',
            notes: 'Notebookcheck 披露确认：EOS R6 V 将于本周发布（非 R8 V），采用 EOS R50 V 相近外观、无 EVF 设计（紧凑型），32.5MP 全画幅传感器支持 7K Open Gate 内录 RAW，定位紧凑全画幅视频旗舰，与 RF 20-50mm f/4L IS USM PZ 同步发布，国行价格待定'
        },
        {
            id: 'sony-a7rv-2026',
            brand: 'sony',
            model: 'Alpha 7R VI',
            status: 'rumored',
            rumorDate: '2026-04-06',
            expectedSpecs: {
                mp: 67,
                sensor: 'fullframe',
                sensorType: 'Exmor RS 堆栈式 CMOS',
                mount: 'FE',
                ibis: '8轴8.5档',
                video: '8K30p / 4K120p',
                af: 'AI实时识别对焦V3',
                burst: '30fps 14-bit RAW'
            },
            expectedPrice: { cn: 24999, us: 3499, eu: 3799 },
            expectedRelease: '2026-05',
            sources: ['SonyAlphaRumors', 'IT之家', '知乎', '蜂鸟网', 'photoworkout'],
            confidence: 'high',
            notes: '三位可靠消息源确认约6700万像素，SonyAlphaRumors 独家披露5月发货、全新机身设计，同步推出 FE 16-28mm f/2 GM 及 FE 100-400mm f/4 GM II 镜头。泄露规格：8轴8.5档IBIS、30fps 14-bit RAW、BIONZ XR2、10K超采8K30p全画幅、944万点OLED EVF（未经官方确认）。国行价格24999元为参考估算。'
        },
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
                mp: 0,
                sensor: 'fullframe',
                sensorType: 'TBD',
                mount: 'Z',
                ibis: 'TBD',
                video: 'TBD',
                af: 'TBD',
                burst: 'TBD'
            },
            expectedPrice: { cn: 0, us: 0, eu: 0 },
            expectedRelease: '2026-Q4',
            sources: ['NikonRumors', 'dailycameranews'],
            confidence: 'very-low',
            notes: '⚠️ NikonRumors官方已确认：目前网上流传的Z7 III规格均为伪造/编造，请勿轻信。dailycameranews报道推测可能在2026年中后期发布（$3499），但同样无可靠规格。NAB 2026上尼康无相关新品。真实发布计划尚不明朗，预计最早2026年底。'
        },
        {
            id: 'nikon-z9ii-2026',
            brand: 'nikon',
            model: 'Z9 II',
            status: 'rumored',
            rumorDate: '2026-01-07',
            expectedSpecs: {
                mp: 46,
                sensor: 'fullframe',
                sensorType: '堆叠式 CMOS (部分 Global Shutter)',
                mount: 'Z',
                ibis: '8轴8.5档防抖',
                video: '8K60p RAW / RED Integration',
                af: '3D追焦 XP8',
                burst: '60fps 14-bit RAW'
            },
            expectedPrice: { cn: 49999, us: 6499, eu: 6999 },
            expectedRelease: '2026-Q4',
            sources: ['NikonRumors', 'dailycameranews', 'digitalcameraworld'],
            confidence: 'medium',
            notes: '发布时间已从2025年底推迟至2026年Q4，整合RED视频技术。DigitalCameraWorld泄露规格：ISO32原生感光度（"中画幅级"纯净度），60fps 14-bit RAW（比Z9快3.5倍），8轴8.5档IBIS。目标2026 FIFA世界杯和冬奥会专业用户。'
        },
        {
            id: 'panasonic-s1ii-2026',
            brand: 'panasonic',
            model: 'Lumix S1 II',
            status: 'official',
            rumorDate: '2025-05-13',
            expectedSpecs: {
                mp: 24,
                sensor: 'fullframe',
                sensorType: '部分堆叠 CMOS',
                mount: 'L',
                ibis: '高规格防抖',
                video: '4K120p',
                af: '相位对焦V2',
                burst: '70fps'
            },
            expectedPrice: { cn: 22398, us: 3500, eu: 0 },
            expectedRelease: '2025-05-13',
            sources: ['Panasonic China Official', '色影无忌', '什么值得买'],
            confidence: 'high',
            notes: '松下中国于2025年5月14日公布国行价格：S1 II单机身22398元，S1 IIE入门版17498元，搭配R24105镜头套装28598元。首款采用部分堆叠传感器的松下相机，支持4K120p高速视频。'
        }
    ],
    
    // 镜头数据
    lenses: [
        {
            id: 'sony-100400gmii-2026',
            brand: 'sony',
            model: 'FE 100-400mm f/4 GM II',
            status: 'rumored',
            type: 'zoom',
            focalLength: '100-400mm',
            aperture: 'f/4',
            mount: 'FE',
            expectedPrice: { cn: 22999, us: 2999, eu: 3299 },
            expectedRelease: '2026-05',
            sources: ['SonyAlphaRumors', 'dailycameranews', 'photorumors'],
            confidence: 'high',
            features: ['恒定f/4光圈（较初代大半档）', 'XD线性马达升级', '防尘防滴', '与A7R VI同期发布']
        },
        {
            id: 'sony-1628gmii-2026',
            brand: 'sony',
            model: 'FE 16-28mm f/2.0 GM',
            status: 'rumored',
            type: 'zoom',
            focalLength: '16-28mm',
            aperture: 'f/2.0',
            mount: 'FE',
            expectedPrice: { cn: 13999, us: 1899, eu: 2099 },
            expectedRelease: '2026-05',
            sources: ['SonyAlphaRumors', 'dailycameranews'],
            confidence: 'high',
            features: ['同级别最大恒定光圈f/2.0', '超广角 GM 品质', '与A7R VI同期发布']
        },
        {
            id: 'canon-rf20-50pz-2026',
            brand: 'canon',
            model: 'RF 20-50mm f/4L IS USM PZ',
            status: 'announced',
            type: 'zoom',
            focalLength: '20-50mm',
            aperture: 'f/4',
            mount: 'RF',
            expectedPrice: { cn: 0, us: 0, eu: 0 },
            expectedRelease: '2026-05-13',
            sources: ['CanonRumors'],
            confidence: 'high',
            features: ['电动变焦（Power Zoom）', 'L级防尘防滴', '轻量化', '与EOS R6 V同期发布']
        },
        {
            id: 'sony-100400gm-2026',
            brand: 'sony',
            model: 'FE 100-400mm f/4.5 GM II',
            status: 'rumored',
            type: 'zoom',
            focalLength: '100-400mm',
            aperture: 'f/4.5',
            mount: 'FE',
            expectedPrice: { cn: 18999, us: 2499, eu: 2699 },
            expectedRelease: '2026-05',
            sources: ['SonyAlphaRumors', 'IT之家'],
            confidence: 'high',
            features: ['轻量化长焦', 'XD线性马达', '防尘防滴', '约5倍变焦']
        },
        {
            id: 'sony-1628gm-2026',
            brand: 'sony',
            model: 'FE 16-28mm f/2.0 GM',
            status: 'rumored',
            type: 'zoom',
            focalLength: '16-28mm',
            aperture: 'f/2.0',
            mount: 'FE',
            expectedPrice: { cn: 13999, us: 1899, eu: 2099 },
            expectedRelease: '2026-05',
            sources: ['SonyAlphaRumors'],
            confidence: 'medium',
            features: ['超广角恒定光圈', 'GM画质', '轻量化']
        },
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
            id: 'news-010',
            title: '【确认】佳能 EOS R6 V 本周发布：无EVF紧凑设计，7K Open Gate',
            type: 'announced',
            date: '2026-04-27',
            summary: 'Notebookcheck 独家披露 EOS R6 V 关键信息：确认本周内官宣（非 R8 V），外观继承 EOS R50 V 相近设计（无 EVF），32.5MP 全画幅传感器，7K Open Gate 内录 RAW，搭配 RF 20-50mm f/4L IS USM PZ 套机镜头。CanonRumors 确认 5月13日 为发布会日期。国行价格尚未公布。',
            source: 'notebookcheck / CanonRumors / thenewcamera',
            url: 'https://www.notebookcheck.net/Leak-Canon-EOS-R6-V-to-launch-this-week-with-full-frame-sensor-and-RAW-video.1278929.0.html',
            tags: ['canon', 'r6v', 'fullframe', 'announced'],
            relatedGear: ['canon-r6v-2026', 'canon-rf20-50pz-2026']
        },
        {
            id: 'news-011',
            title: '【高可信传闻】索尼 A7R VI 5月发货：67MP，新机身，同步两款GM镜',
            type: 'rumor',
            date: '2026-04-27',
            summary: 'SonyAlphaRumors 独家披露（已核实三位可靠消息源）：Sony A7R VI 将于 2026年5月 上市发货，约6700万像素，全新机身设计，同步推出 FE 16-28mm f/2 GM 超广角变焦和 FE 100-400mm f/4 GM II 长焦镜头。未经确认规格：8轴8.5档IBIS、30fps 14bit RAW、BIONZ XR2处理器、10K超采8K30p视频。',
            source: 'SonyAlphaRumors / photoworkout / 知乎',
            url: 'https://www.sonyalpharumors.com/exclusive-new-67-megapixel-sony-a7rvi-is-coming-in-may/',
            tags: ['sony', 'a7rv', 'a7r6', 'fullframe', 'rumor'],
            relatedGear: ['sony-a7rv-2026', 'sony-1628gmii-2026', 'sony-100400gmii-2026']
        },
        {
            id: 'news-012',
            title: '【传闻】尼康 Z9 II 泄露：ISO32/60fps RAW/RED整合，Q4发布',
            type: 'rumor',
            date: '2026-04-27',
            summary: 'DigitalCameraWorld 披露尼康 Z9 II 泄露规格：ISO32原生感光度（"中画幅级"纯净度），60fps 14-bit RAW 连拍（比 Z9 快3.5倍），传感器读出速度大幅提升，整合 RED 视频技术。NikonRumors 此前已报道发布推迟至 Q4，目标 2026 FIFA 世界杯和冬奥会专业用户。',
            source: 'digitalcameraworld / NikonRumors / dailycameranews',
            url: 'https://www.digitalcameraworld.com/cameras/mirrorless-cameras/nikon-z9-ii-leak-iso32-60fps-raw-bursts-and-more-red-flags-than-you-can-shake-a-monopod-at',
            tags: ['nikon', 'z9ii', 'flagship', 'rumor'],
            relatedGear: ['nikon-z9ii-2026']
        },
        {
            id: 'news-008',
            title: '【独家传闻】索尼 Alpha 7R VI 5月发布，67MP新传感器',
            type: 'rumor',
            date: '2026-04-06',
            summary: 'SonyAlphaRumors独家披露：Sony Alpha 7R VI 将于2026年5月发布上市，搭载约6700万像素新传感器，同步推出 FE 16-28mm f/2 GM 超广角变焦及 FE 100-400mm f/4 GM II 长焦变焦镜头。这将是索尼高像素系列的里程碑升级。',
            source: 'SonyAlphaRumors / 蜂鸟网',
            url: 'https://www.sonyalpharumors.com/exclusive-new-67-megapixel-sony-a7rvi-is-coming-in-may/',
            tags: ['sony', 'a7rv', 'a7r6', 'fullframe', 'rumor'],
            relatedGear: ['sony-a7rv-2026']
        },
        {
            id: 'news-009',
            title: '【官方】松下 Lumix S1 II 国行价格公布：22398元起',
            type: 'official',
            date: '2025-05-14',
            summary: '松下中国正式公布 Lumix S1 II 和 S1 IIE 国行售价。S1 II单机身22398元，S1 IIE 17498元，均于2025年6月18日前后开启预售。这是松下首款采用部分堆叠CMOS传感器的全画幅相机，支持4K120p及70fps高速连拍。',
            source: 'Panasonic China Official / 色影无忌',
            url: 'https://info.xitek.com/allpage/news/202505/15-369521.html',
            tags: ['panasonic', 's1ii', 'fullframe', 'official'],
            relatedGear: ['panasonic-s1ii-2026']
        },
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
            title: '【更新】佳能 RE-1：CP+2026展出概念机（1英寸传感器），全画幅版仍待定',
            type: 'rumor',
            date: '2026-04-27',
            summary: 'CP+ 2026 展会上，佳能出乎意料地展出了一款概念相机——搭载1英寸传感器、腰平取景窗设计、灵感来自 Hasselblad 500 和海鸥4号，完全手动对焦，大概率不会量产。这与传闻中的全画幅 RE-1（致敬 AE-1 50周年，3250万像素，Q4 2026-Q1 2027）是不同产品。全画幅 RE-1 传闻持续发酵，Canon 高层 Kato 曾在 CP+ 2025 主动提及复古设计需求，被认为暗示产品属实。',
            source: 'DUMBCAM BLOG / CanonRumors / 知乎',
            url: 'https://www.dumbcamblog.com/blog/canon-re1-ae1-50th-anniversary-2026',
            tags: ['canon', 're-1', 'fullframe', 'rumor', 'cpplus2026']
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

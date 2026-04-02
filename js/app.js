// Photo Monster Web App - Main JavaScript
// 集成规则引擎和完整知识库

// 全局变量
let uploadedImages = [];
let compressedImages = [];
let currentExifData = null;
let ruleEngine = null;
let aiAnalyzer = null;

// DOM 元素（延迟初始化）
let dropZone, fileInput, previewSection, previewGrid, analyzeBtn, clearBtn;
let exifContainer, analysisSection, analysisContent, knowledgeModal, modalTitle, modalBody;

// ==================== 设备分析器数据库 ====================

// 相机数据库
const cameraDatabase = {
        canon: {
            name: '佳能',
            models: {
                'EOS R5': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 45,
                    lowLight: 9,
                    price: 'pro',
                    video: '8K',
                    mount: 'RF',
                    bestFor: ['portrait', 'landscape', 'video']
                },
                'EOS R6': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 20,
                    lowLight: 10,
                    price: 'pro',
                    video: '4K',
                    mount: 'RF',
                    bestFor: ['portrait', 'lowlight', 'video']
                },
                'EOS R6 II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 10,
                    price: 'pro',
                    video: '4K',
                    mount: 'RF',
                    bestFor: ['portrait', 'sports', 'video']
                },
                'EOS R8': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'mid',
                    video: '4K',
                    mount: 'RF',
                    bestFor: ['general', 'travel']
                },
                'EOS R7': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 32,
                    lowLight: 7,
                    price: 'mid',
                    video: '4K',
                    mount: 'RF',
                    bestFor: ['sports', 'wildlife']
                },
                'EOS R10': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'RF',
                    bestFor: ['general', 'travel']
                },
                'EOS R50': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 6,
                    price: 'entry',
                    video: '4K',
                    mount: 'RF',
                    bestFor: ['general', 'vlog']
                },
                'EOS R5 II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 45,
                    lowLight: 9,
                    price: 'pro',
                    video: '8K',
                    mount: 'RF',
                    bestFor: ['portrait', 'landscape', 'video', 'sports']
                },
                'EOS R6 Mark III': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 10,
                    price: 'pro',
                    video: '4K120',
                    mount: 'RF',
                    bestFor: ['portrait', 'sports', 'video', 'lowlight']
                },
                'EOS R7 Mark II': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 32,
                    lowLight: 8,
                    price: 'mid',
                    video: '4K60',
                    mount: 'RF',
                    bestFor: ['sports', 'wildlife', 'video']
                },
                'EOS R1': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 10,
                    price: 'flagship',
                    video: '6K',
                    mount: 'RF',
                    bestFor: ['sports', 'wildlife', 'photojournalism']
                },
                'EOS R100': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 6,
                    price: 'entry',
                    video: '4K',
                    mount: 'RF',
                    bestFor: ['general', 'travel', 'vlog']
                },
                'EOS 5D IV': {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 30,
                    lowLight: 8,
                    price: 'pro',
                    video: '4K',
                    mount: 'EF',
                    bestFor: ['portrait', 'landscape']
                },
                'EOS 5D III': {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 22,
                    lowLight: 8,
                    price: 'mid',
                    video: '1080p',
                    mount: 'EF',
                    bestFor: ['portrait', 'landscape', 'wedding']
                },
                'EOS 5D II': {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 21,
                    lowLight: 7,
                    price: 'entry',
                    video: '1080p',
                    mount: 'EF',
                    bestFor: ['portrait', 'landscape']
                },
                'EOS 5DS': {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 50,
                    lowLight: 7,
                    price: 'pro',
                    video: '1080p',
                    mount: 'EF',
                    bestFor: ['landscape', 'studio']
                },
                'EOS 6D II': {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 26,
                    lowLight: 8,
                    price: 'mid',
                    video: '1080p',
                    mount: 'EF',
                    bestFor: ['general', 'portrait', 'travel']
                },
                'EOS 6D': {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 20,
                    lowLight: 8,
                    price: 'entry',
                    video: '1080p',
                    mount: 'EF',
                    bestFor: ['general', 'landscape']
                },
                'EOS 90D': {
                    type: 'dslr',
                    sensor: 'apsc',
                    mp: 32,
                    lowLight: 7,
                    price: 'mid',
                    video: '4K',
                    mount: 'EF',
                    bestFor: ['sports', 'wildlife', 'general']
                },
                'EOS 80D': {
                    type: 'dslr',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 7,
                    price: 'entry',
                    video: '1080p',
                    mount: 'EF',
                    bestFor: ['general', 'video']
                },
                'EOS M50 II': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 6,
                    price: 'entry',
                    video: '4K',
                    mount: 'EF-M',
                    bestFor: ['vlog', 'travel', 'general']
                }
            }
        },
        sony: {
            name: '索尼',
            models: {
                A1: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 50,
                    lowLight: 9,
                    price: 'flagship',
                    video: '8K',
                    mount: 'FE',
                    bestFor: ['sports', 'wildlife', 'video']
                },
                'A7R V': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 61,
                    lowLight: 8,
                    price: 'pro',
                    video: '8K',
                    mount: 'FE',
                    bestFor: ['landscape', 'studio']
                },
                'A7 IV': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 33,
                    lowLight: 9,
                    price: 'pro',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['general', 'video']
                },
                'A7C II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 33,
                    lowLight: 9,
                    price: 'mid',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['travel', 'street']
                },
                'A7C R': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 61,
                    lowLight: 8,
                    price: 'pro',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['landscape', 'travel']
                },
                'A1 II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 50,
                    lowLight: 9,
                    price: 'flagship',
                    video: '8K30',
                    mount: 'FE',
                    bestFor: ['sports', 'wildlife', 'video', 'portrait']
                },
                'A7 VI': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 33,
                    lowLight: 9,
                    price: 'pro',
                    video: '4K60',
                    mount: 'FE',
                    bestFor: ['general', 'portrait', 'travel', 'video']
                },
                'A7S IV': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 10,
                    price: 'pro',
                    video: '4K120',
                    mount: 'FE',
                    bestFor: ['video', 'lowlight']
                },
                A6700: {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'mid',
                    video: '4K',
                    mount: 'E',
                    bestFor: ['general', 'video']
                },
                'A7S III': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 12,
                    lowLight: 10,
                    price: 'pro',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['video', 'lowlight', 'astro']
                },
                FX3: {
                    type: 'cinema',
                    sensor: 'fullframe',
                    mp: 12,
                    lowLight: 10,
                    price: 'pro',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['video', 'cinema']
                },
                'A7 III': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'mid',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['general', 'portrait', 'video']
                },
                'A7R III': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 42,
                    lowLight: 8,
                    price: 'pro',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['landscape', 'studio']
                },
                'A7R II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 42,
                    lowLight: 8,
                    price: 'mid',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['landscape', 'portrait']
                },
                'A7 II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 8,
                    price: 'entry',
                    video: '1080p',
                    mount: 'FE',
                    bestFor: ['general', 'portrait']
                },
                A6400: {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'E',
                    bestFor: ['general', 'vlog', 'video']
                },
                A6000: {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 6,
                    price: 'entry',
                    video: '1080p',
                    mount: 'E',
                    bestFor: ['general', 'travel']
                },
                'A7 V': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 42,
                    lowLight: 8,
                    price: 'mid',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['general']
                },
                'ZV-E1': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 12,
                    lowLight: 10,
                    price: 'mid',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['video', 'vlog']
                },
                'ZV-E10 II': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'E',
                    bestFor: ['vlog', 'video', 'general']
                },
                A7V: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 42,
                    lowLight: 8,
                    price: 'mid',
                    video: '4K',
                    mount: 'FE',
                    bestFor: ['general']
                }
            }
        },
        nikon: {
            name: '尼康',
            models: {
                Z9: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 45,
                    lowLight: 9,
                    price: 'flagship',
                    video: '8K',
                    mount: 'Z',
                    bestFor: ['sports', 'wildlife', 'video']
                },
                Z8: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 45,
                    lowLight: 9,
                    price: 'pro',
                    video: '8K',
                    mount: 'Z',
                    bestFor: ['general', 'video']
                },
                'Z7 II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 45,
                    lowLight: 8,
                    price: 'pro',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['landscape', 'studio']
                },
                'Z6 II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'mid',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['general', 'video']
                },
                Z5: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 8,
                    price: 'mid',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['general', 'portrait']
                },
                Z50: {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 20,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['general', 'travel']
                },
                Z30: {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 20,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['vlog', 'travel']
                },
                'Z6 III': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'pro',
                    video: '6K',
                    mount: 'Z',
                    bestFor: ['general', 'video', 'portrait']
                },
                'Z5 II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 8,
                    price: 'mid',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['general', 'travel', 'portrait']
                },
                'Z6 IV': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 33,
                    lowLight: 9,
                    price: 'pro',
                    video: '6K',
                    mount: 'Z',
                    bestFor: ['general', 'video', 'sports']
                },
                Z7: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 45,
                    lowLight: 8,
                    price: 'pro',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['landscape', 'studio']
                },
                Z6: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'mid',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['general', 'video']
                },
                Zf: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'mid',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['street', 'travel', 'general']
                },
                Zfc: {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 20,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['vlog', 'travel', 'street']
                },
                'Z6 III': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'mid',
                    video: '6K',
                    mount: 'Z',
                    bestFor: ['general', 'video', 'sports']
                },
                Z50II: {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 20,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'Z',
                    bestFor: ['general', 'travel', 'vlog']
                },
                D850: {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 45,
                    lowLight: 9,
                    price: 'pro',
                    video: '4K',
                    mount: 'F',
                    bestFor: ['landscape', 'portrait', 'studio']
                },
                D810: {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 36,
                    lowLight: 8,
                    price: 'mid',
                    video: '1080p',
                    mount: 'F',
                    bestFor: ['landscape', 'studio']
                },
                D780: {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'mid',
                    video: '4K',
                    mount: 'F',
                    bestFor: ['general', 'video']
                },
                D750: {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'mid',
                    video: '1080p',
                    mount: 'F',
                    bestFor: ['general', 'portrait', 'wedding']
                },
                D610: {
                    type: 'dslr',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 8,
                    price: 'entry',
                    video: '1080p',
                    mount: 'F',
                    bestFor: ['general', 'landscape']
                },
                D7500: {
                    type: 'dslr',
                    sensor: 'apsc',
                    mp: 20,
                    lowLight: 7,
                    price: 'mid',
                    video: '4K',
                    mount: 'F',
                    bestFor: ['sports', 'wildlife', 'general']
                },
                D7200: {
                    type: 'dslr',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 7,
                    price: 'entry',
                    video: '1080p',
                    mount: 'F',
                    bestFor: ['general', 'travel']
                },
                D5600: {
                    type: 'dslr',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 6,
                    price: 'entry',
                    video: '1080p',
                    mount: 'F',
                    bestFor: ['general', 'travel']
                }
            }
        },
        fujifilm: {
            name: '富士',
            models: {
                'X-T5': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 40,
                    lowLight: 7,
                    price: 'mid',
                    video: '6K',
                    mount: 'X',
                    bestFor: ['general', 'street']
                },
                'X-H2': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 40,
                    lowLight: 7,
                    price: 'pro',
                    video: '8K',
                    mount: 'X',
                    bestFor: ['general', 'video']
                },
                'X-H2S': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 8,
                    price: 'pro',
                    video: '6K',
                    mount: 'X',
                    bestFor: ['sports', 'video']
                },
                'X-S20': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'mid',
                    video: '6K',
                    mount: 'X',
                    bestFor: ['general', 'video']
                },
                'X-T30 II': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['general', 'travel']
                },
                'X-E4': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['street', 'travel']
                },
                X100VI: {
                    type: 'compact',
                    sensor: 'apsc',
                    mp: 40,
                    lowLight: 7,
                    price: 'mid',
                    video: '6K',
                    mount: 'Fixed',
                    bestFor: ['street', 'travel']
                },
                'X-M5': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['general', 'vlog', 'travel']
                },
                'X-T6': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 40,
                    lowLight: 8,
                    price: 'pro',
                    video: '4K60',
                    mount: 'X',
                    bestFor: ['general', 'street', 'travel']
                },
                'X-Pro4': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 40,
                    lowLight: 8,
                    price: 'pro',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['street', 'documentary']
                },
                'GFX100RF': {
                    type: 'mirrorless',
                    sensor: 'medium',
                    mp: 102,
                    lowLight: 7,
                    price: 'flagship',
                    video: '4K',
                    mount: 'GF',
                    bestFor: ['portrait', 'landscape', 'commercial']
                },
                'GFX 100S': {
                    type: 'mirrorless',
                    sensor: 'medium',
                    mp: 102,
                    lowLight: 7,
                    price: 'flagship',
                    video: '4K',
                    mount: 'G',
                    bestFor: ['studio', 'landscape']
                },
                'X-T4': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'mid',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['general', 'video', 'street']
                },
                'X-T3': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'mid',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['general', 'video']
                },
                'X-T2': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['general', 'street']
                },
                'X-T30': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['general', 'travel']
                },
                'X-T20': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 6,
                    price: 'entry',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['general', 'travel']
                },
                'X-T200': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 6,
                    price: 'entry',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['general', 'vlog']
                },
                'X-S10': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'mid',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['general', 'video']
                },
                'X-Pro3': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'pro',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['street', 'documentary']
                },
                'X-Pro2': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 7,
                    price: 'mid',
                    video: '1080p',
                    mount: 'X',
                    bestFor: ['street', 'documentary']
                },
                X100V: {
                    type: 'compact',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'mid',
                    video: '4K',
                    mount: 'Fixed',
                    bestFor: ['street', 'travel']
                },
                X100F: {
                    type: 'compact',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 6,
                    price: 'entry',
                    video: '1080p',
                    mount: 'Fixed',
                    bestFor: ['street', 'travel']
                },
                'GFX 50S II': {
                    type: 'mirrorless',
                    sensor: 'medium',
                    mp: 51,
                    lowLight: 7,
                    price: 'flagship',
                    video: '1080p',
                    mount: 'G',
                    bestFor: ['studio', 'landscape']
                },
                'GFX 50R': {
                    type: 'mirrorless',
                    sensor: 'medium',
                    mp: 51,
                    lowLight: 7,
                    price: 'pro',
                    video: '1080p',
                    mount: 'G',
                    bestFor: ['landscape', 'street']
                },
                'GFX 50S': {
                    type: 'mirrorless',
                    sensor: 'medium',
                    mp: 51,
                    lowLight: 7,
                    price: 'pro',
                    video: '1080p',
                    mount: 'G',
                    bestFor: ['studio', 'landscape']
                },
                'GFX 100 II': {
                    type: 'mirrorless',
                    sensor: 'medium',
                    mp: 102,
                    lowLight: 8,
                    price: 'flagship',
                    video: '8K',
                    mount: 'G',
                    bestFor: ['studio', 'landscape', 'commercial']
                },
                'X-M5': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 26,
                    lowLight: 7,
                    price: 'entry',
                    video: '4K',
                    mount: 'X',
                    bestFor: ['vlog', 'travel', 'general']
                },
                'X-T50': {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 40,
                    lowLight: 7,
                    price: 'mid',
                    video: '6K',
                    mount: 'X',
                    bestFor: ['general', 'street', 'travel']
                }
            }
        },
        panasonic: {
            name: '松下',
            models: {
                'S5 II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'mid',
                    video: '6K',
                    mount: 'L',
                    bestFor: ['video', 'general']
                },
                'S5 IIx': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'pro',
                    video: '6K',
                    mount: 'L',
                    bestFor: ['video', 'cinema']
                },
                GH6: {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 25,
                    lowLight: 7,
                    price: 'pro',
                    video: '5.7K',
                    mount: 'M43',
                    bestFor: ['video', 'cinema']
                },
                'G9 II': {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 25,
                    lowLight: 7,
                    price: 'mid',
                    video: '5.7K',
                    mount: 'M43',
                    bestFor: ['sports', 'video']
                },
                'Lumix S1 II': {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 9,
                    price: 'pro',
                    video: '6K',
                    mount: 'L',
                    bestFor: ['video', 'general']
                },
                'Lumix GH7': {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 25,
                    lowLight: 7,
                    price: 'pro',
                    video: '4K120',
                    mount: 'M43',
                    bestFor: ['video']
                }
            }
        },
        olympus: {
            name: '奥林巴斯',
            models: {
                'OM-1': {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 20,
                    lowLight: 7,
                    price: 'pro',
                    video: '4K',
                    mount: 'M43',
                    bestFor: ['sports', 'wildlife']
                },
                'OM-5': {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 20,
                    lowLight: 6,
                    price: 'mid',
                    video: '4K',
                    mount: 'M43',
                    bestFor: ['travel', 'general']
                },
                'OM-3': {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 20,
                    lowLight: 7,
                    price: 'pro',
                    video: '4K',
                    mount: 'M43',
                    bestFor: ['travel', 'wildlife', 'general']
                },
                'E-M10 IV': {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 20,
                    lowLight: 6,
                    price: 'entry',
                    video: '4K',
                    mount: 'M43',
                    bestFor: ['general', 'travel']
                },
                'E-M1 III': {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 20,
                    lowLight: 7,
                    price: 'pro',
                    video: '4K',
                    mount: 'M43',
                    bestFor: ['sports', 'wildlife']
                },
                'E-M5 III': {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 20,
                    lowLight: 6,
                    price: 'mid',
                    video: '4K',
                    mount: 'M43',
                    bestFor: ['travel', 'general']
                },
                'E-M10 III': {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 16,
                    lowLight: 6,
                    price: 'entry',
                    video: '4K',
                    mount: 'M43',
                    bestFor: ['general', 'travel']
                },
                'PEN-F': {
                    type: 'mirrorless',
                    sensor: 'm43',
                    mp: 20,
                    lowLight: 6,
                    price: 'mid',
                    video: '1080p',
                    mount: 'M43',
                    bestFor: ['street', 'travel']
                }
            }
        },
        leica: {
            name: '徕卡',
            models: {
                M11: {
                    type: 'rangefinder',
                    sensor: 'fullframe',
                    mp: 60,
                    lowLight: 8,
                    price: 'flagship',
                    video: 'none',
                    mount: 'M',
                    bestFor: ['street', 'documentary']
                },
                'M11-P': {
                    type: 'rangefinder',
                    sensor: 'fullframe',
                    mp: 60,
                    lowLight: 8,
                    price: 'flagship',
                    video: 'none',
                    mount: 'M',
                    bestFor: ['street', 'documentary']
                },
                'M10-R': {
                    type: 'rangefinder',
                    sensor: 'fullframe',
                    mp: 40,
                    lowLight: 8,
                    price: 'flagship',
                    video: 'none',
                    mount: 'M',
                    bestFor: ['street', 'landscape']
                },
                M10: {
                    type: 'rangefinder',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 8,
                    price: 'flagship',
                    video: 'none',
                    mount: 'M',
                    bestFor: ['street', 'documentary']
                },
                M240: {
                    type: 'rangefinder',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 7,
                    price: 'pro',
                    video: '1080p',
                    mount: 'M',
                    bestFor: ['street', 'documentary']
                },
                Q3: {
                    type: 'compact',
                    sensor: 'fullframe',
                    mp: 60,
                    lowLight: 8,
                    price: 'flagship',
                    video: '8K',
                    mount: 'Fixed',
                    bestFor: ['street', 'travel', 'documentary']
                },
                Q2: {
                    type: 'compact',
                    sensor: 'fullframe',
                    mp: 47,
                    lowLight: 8,
                    price: 'flagship',
                    video: '4K',
                    mount: 'Fixed',
                    bestFor: ['street', 'travel']
                },
                Q: {
                    type: 'compact',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 7,
                    price: 'pro',
                    video: '1080p',
                    mount: 'Fixed',
                    bestFor: ['street', 'travel']
                },
                SL3: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 60,
                    lowLight: 8,
                    price: 'flagship',
                    video: '8K',
                    mount: 'L',
                    bestFor: ['general', 'studio']
                },
                SL2: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 47,
                    lowLight: 8,
                    price: 'flagship',
                    video: '4K',
                    mount: 'L',
                    bestFor: ['general', 'studio']
                },
                SL: {
                    type: 'mirrorless',
                    sensor: 'fullframe',
                    mp: 24,
                    lowLight: 7,
                    price: 'pro',
                    video: '4K',
                    mount: 'L',
                    bestFor: ['general', 'video']
                },
                CL: {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 6,
                    price: 'pro',
                    video: '4K',
                    mount: 'L',
                    bestFor: ['street', 'travel']
                },
                TL2: {
                    type: 'mirrorless',
                    sensor: 'apsc',
                    mp: 24,
                    lowLight: 6,
                    price: 'mid',
                    video: '4K',
                    mount: 'L',
                    bestFor: ['travel', 'general']
                },
                'D-Lux 8': {
                    type: 'compact',
                    sensor: 'm43',
                    mp: 17,
                    lowLight: 6,
                    price: 'mid',
                    video: '4K',
                    mount: 'Fixed',
                    bestFor: ['travel', 'street']
                }
            }
        },
        hasselblad: {
            name: '哈苏',
            models: {
                'X2D 100C': {
                    type: 'mirrorless',
                    sensor: 'medium',
                    mp: 100,
                    lowLight: 7,
                    price: 'flagship',
                    video: 'none',
                    mount: 'XCD',
                    bestFor: ['studio', 'landscape', 'commercial']
                },
                'X1D II 50C': {
                    type: 'mirrorless',
                    sensor: 'medium',
                    mp: 50,
                    lowLight: 7,
                    price: 'flagship',
                    video: 'none',
                    mount: 'XCD',
                    bestFor: ['landscape', 'portrait', 'travel']
                },
                X1D: {
                    type: 'mirrorless',
                    sensor: 'medium',
                    mp: 50,
                    lowLight: 7,
                    price: 'pro',
                    video: 'none',
                    mount: 'XCD',
                    bestFor: ['landscape', 'portrait']
                },
                '907X 100C': {
                    type: 'modular',
                    sensor: 'medium',
                    mp: 100,
                    lowLight: 7,
                    price: 'flagship',
                    video: 'none',
                    mount: 'XCD',
                    bestFor: ['studio', 'landscape']
                },
                '907X 50C': {
                    type: 'modular',
                    sensor: 'medium',
                    mp: 50,
                    lowLight: 7,
                    price: 'flagship',
                    video: 'none',
                    mount: 'XCD',
                    bestFor: ['studio', 'landscape']
                },
                'CFV 100C': {
                    type: 'digitalback',
                    sensor: 'medium',
                    mp: 100,
                    lowLight: 7,
                    price: 'flagship',
                    video: 'none',
                    mount: 'XCD',
                    bestFor: ['studio', 'landscape']
                }
            }
        }
    };
// 镜头数据库
const lensDatabase = {
    prime: {
        name: '定焦镜头',
        description: '固定焦距，画质优秀，光圈大',
        pros: ['画质锐利', '大光圈虚化好', '体积小重量轻', '通常更便宜'],
        cons: ['需要走动构图', '多带几个镜头', '换镜头麻烦'],
        recommendations: {
            portrait: ['85mm f/1.8', '50mm f/1.8', '135mm f/2'],
            street: ['35mm f/1.4', '28mm f/2'],
            landscape: ['24mm f/1.4', '20mm f/1.8'],
            general: ['50mm f/1.8', '35mm f/1.8']
        }
    },
    zoom: {
        name: '变焦镜头',
        description: '可变焦距，使用方便灵活',
        pros: ['一镜走天下', '快速变焦构图', '少换镜头', '适应性强'],
        cons: ['通常光圈较小', '画质略逊于定焦', '体积重量大', '价格较高'],
        recommendations: {
            general: ['24-70mm f/2.8', '24-105mm f/4'],
            portrait: ['70-200mm f/2.8', '24-70mm f/2.8'],
            landscape: ['16-35mm f/2.8', '14-24mm f/2.8'],
            travel: ['24-200mm', '28-200mm']
        }
    },
    macro: {
        name: '微距镜头',
        description: '专门用于近距离拍摄',
        pros: ['1:1放大倍率', '细节清晰', '也可拍人像'],
        cons: ['对焦慢', '用途单一', '价格较高'],
        recommendations: {
            macro: ['90mm f/2.8 Macro', '100mm f/2.8 Macro', '105mm f/2.8 Macro']
        }
    },
    telephoto: {
        name: '长焦镜头',
        description: '长焦望远，适合远距离拍摄',
        pros: ['压缩空间感', '背景虚化强烈', '适合远距离主体', '体育野生动物必备'],
        cons: ['体积大重量重', '需要稳定支撑', '价格昂贵', '手持易抖动'],
        recommendations: {
            sports: ['70-200mm f/2.8', '100-400mm f/4.5-5.6', '300mm f/2.8'],
            wildlife: ['100-400mm', '200-600mm', '600mm f/4'],
            portrait: ['135mm f/1.8', '200mm f/2.8']
        }
    },
    wide: {
        name: '广角镜头',
        description: '视角宽广，适合大场景',
        pros: ['视野开阔', '增强透视感', '适合风光建筑', '星空摄影必备'],
        cons: ['边缘畸变', '难以控制构图', '滤镜成本高', '不适合人像特写'],
        recommendations: {
            landscape: ['16-35mm f/2.8', '14-24mm f/2.8', '12-24mm f/4'],
            astro: ['14mm f/1.8', '20mm f/1.4', '24mm f/1.4'],
            architecture: ['16-35mm f/4', '14mm f/2.8', 'TS-E移轴镜头']
        }
    }
};

// ==================== 品牌镜头群数据库 ====================
// 增强版镜头数据库，支持交叉验证筛选
const lensGroupDatabase = {
    canon: {
        name: '佳能',
        mount: 'RF/EF',
        description: '佳能RF卡口是新一代无反卡口，EF卡口可通过转接环兼容',
        popularLenses: [
            { name: 'RF 50mm f/1.2L', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/1.2', apertureNum: 1.2, price: '¥15,999', priceNum: 15999, desc: '顶级标准定焦，画质卓越', brand: 'original' },
            { name: 'RF 85mm f/1.2L', type: 'prime', focal: '85mm', focalMin: 85, focalMax: 85, aperture: 'f/1.2', apertureNum: 1.2, price: '¥18,999', priceNum: 18999, desc: '人像镜皇，虚化绝美', brand: 'original' },
            { name: 'RF 24-70mm f/2.8L', type: 'zoom', focal: '24-70mm', focalMin: 24, focalMax: 70, aperture: 'f/2.8', apertureNum: 2.8, price: '¥15,999', priceNum: 15999, desc: '标准变焦大三元', brand: 'original' },
            { name: 'RF 70-200mm f/2.8L', type: 'zoom', focal: '70-200mm', focalMin: 70, focalMax: 200, aperture: 'f/2.8', apertureNum: 2.8, price: '¥18,999', priceNum: 18999, desc: '长焦大三元，画质顶级', brand: 'original' },
            { name: 'RF 15-35mm f/2.8L', type: 'zoom', focal: '15-35mm', focalMin: 15, focalMax: 35, aperture: 'f/2.8', apertureNum: 2.8, price: '¥15,999', priceNum: 15999, desc: '超广角大三元', brand: 'original' },
            { name: 'RF 100-500mm f/4.5-7.1L', type: 'zoom', focal: '100-500mm', focalMin: 100, focalMax: 500, aperture: 'f/4.5-7.1', apertureNum: 4.5, price: '¥18,999', priceNum: 18999, desc: '远摄变焦，拍鸟利器', brand: 'original' },
            { name: 'RF 35mm f/1.8 Macro', type: 'macro', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.8', apertureNum: 1.8, price: '¥3,999', priceNum: 3999, desc: '带微距的广角定焦', brand: 'original' },
            { name: 'EF 50mm f/1.8 STM', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/1.8', apertureNum: 1.8, price: '¥899', priceNum: 899, desc: '性价比最高的小痰盂', brand: 'original' },
            { name: 'RF 85mm f/2 Macro', type: 'macro', focal: '85mm', focalMin: 85, focalMax: 85, aperture: 'f/2', apertureNum: 2.0, price: '¥4,999', priceNum: 4999, desc: '带防抖的微距人像头', brand: 'original' },
            { name: 'RF 100mm f/2.8L Macro', type: 'macro', focal: '100mm', focalMin: 100, focalMax: 100, aperture: 'f/2.8', apertureNum: 2.8, price: '¥7,999', priceNum: 7999, desc: '专业微距镜头', brand: 'original' },
            { name: 'Sigma Art 35mm f/1.4', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.4', apertureNum: 1.4, price: '¥5,999', priceNum: 5999, desc: '适马Art系列人文头', brand: 'sigma' },
            { name: 'Sigma Art 85mm f/1.4', type: 'prime', focal: '85mm', focalMin: 85, focalMax: 85, aperture: 'f/1.4', apertureNum: 1.4, price: '¥6,999', priceNum: 6999, desc: '适马Art系列人像头', brand: 'sigma' },
            { name: 'Tamron 28-75mm f/2.8', type: 'zoom', focal: '28-75mm', focalMin: 28, focalMax: 75, aperture: 'f/2.8', apertureNum: 2.8, price: '¥5,999', priceNum: 5999, desc: '腾龙轻便标准变焦', brand: 'tamron' },
            { name: 'Tamron 70-180mm f/2.8', type: 'zoom', focal: '70-180mm', focalMin: 70, focalMax: 180, aperture: 'f/2.8', apertureNum: 2.8, price: '¥7,999', priceNum: 7999, desc: '腾龙轻便长焦', brand: 'tamron' }
        ],
        thirdParty: ['Sigma Art系列', 'Tamron SP系列', 'Tokina atx-i系列']
    },
    sony: {
        name: '索尼',
        mount: 'E',
        description: '索尼E卡口是主流无反卡口，副厂镜头群最丰富',
        popularLenses: [
            { name: 'FE 50mm f/1.2 GM', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/1.2', apertureNum: 1.2, price: '¥15,999', priceNum: 15999, desc: 'G大师标准定焦', brand: 'original' },
            { name: 'FE 85mm f/1.4 GM', type: 'prime', focal: '85mm', focalMin: 85, focalMax: 85, aperture: 'f/1.4', apertureNum: 1.4, price: '¥11,999', priceNum: 11999, desc: 'G大师人像镜头', brand: 'original' },
            { name: 'FE 24-70mm f/2.8 GM II', type: 'zoom', focal: '24-70mm', focalMin: 24, focalMax: 70, aperture: 'f/2.8', apertureNum: 2.8, price: '¥17,999', priceNum: 17999, desc: '二代标准变焦，轻量化', brand: 'original' },
            { name: 'FE 70-200mm f/2.8 GM II', type: 'zoom', focal: '70-200mm', focalMin: 70, focalMax: 200, aperture: 'f/2.8', apertureNum: 2.8, price: '¥18,999', priceNum: 18999, desc: '二代长焦，画质顶级', brand: 'original' },
            { name: 'FE 16-35mm f/2.8 GM', type: 'zoom', focal: '16-35mm', focalMin: 16, focalMax: 35, aperture: 'f/2.8', apertureNum: 2.8, price: '¥16,999', priceNum: 16999, desc: '超广角大三元', brand: 'original' },
            { name: 'FE 200-600mm f/5.6-6.3 G', type: 'zoom', focal: '200-600mm', focalMin: 200, focalMax: 600, aperture: 'f/5.6-6.3', apertureNum: 5.6, price: '¥12,999', priceNum: 12999, desc: '远摄变焦，性价比高', brand: 'original' },
            { name: 'FE 35mm f/1.4 GM', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.4', apertureNum: 1.4, price: '¥11,999', priceNum: 11999, desc: 'G大师广角定焦', brand: 'original' },
            { name: 'FE 50mm f/1.8', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/1.8', apertureNum: 1.8, price: '¥1,999', priceNum: 1999, desc: '入门定焦，轻便', brand: 'original' },
            { name: 'FE 90mm f/2.8 Macro G', type: 'macro', focal: '90mm', focalMin: 90, focalMax: 90, aperture: 'f/2.8', apertureNum: 2.8, price: '¥7,999', priceNum: 7999, desc: 'G系列微距镜头', brand: 'original' },
            { name: 'FE 24mm f/1.4 GM', type: 'prime', focal: '24mm', focalMin: 24, focalMax: 24, aperture: 'f/1.4', apertureNum: 1.4, price: '¥10,999', priceNum: 10999, desc: 'G大师广角', brand: 'original' },
            { name: 'FE 135mm f/1.8 GM', type: 'prime', focal: '135mm', focalMin: 135, focalMax: 135, aperture: 'f/1.8', apertureNum: 1.8, price: '¥12,999', priceNum: 12999, desc: 'G大师长焦人像', brand: 'original' },
            { name: 'Sigma Art 24-70mm f/2.8', type: 'zoom', focal: '24-70mm', focalMin: 24, focalMax: 70, aperture: 'f/2.8', apertureNum: 2.8, price: '¥7,999', priceNum: 7999, desc: '适马Art标准变焦', brand: 'sigma' },
            { name: 'Sigma Art 14-24mm f/2.8', type: 'zoom', focal: '14-24mm', focalMin: 14, focalMax: 24, aperture: 'f/2.8', apertureNum: 2.8, price: '¥8,999', priceNum: 8999, desc: '适马Art超广角', brand: 'sigma' },
            { name: 'Tamron 28-200mm f/2.8-5.6', type: 'zoom', focal: '28-200mm', focalMin: 28, focalMax: 200, aperture: 'f/2.8-5.6', apertureNum: 2.8, price: '¥5,499', priceNum: 5499, desc: '腾龙大变焦', brand: 'tamron' },
            { name: 'Tamron 17-28mm f/2.8', type: 'zoom', focal: '17-28mm', focalMin: 17, focalMax: 28, aperture: 'f/2.8', apertureNum: 2.8, price: '¥6,499', priceNum: 6499, desc: '腾龙轻便超广角', brand: 'tamron' }
        ],
        thirdParty: ['Sigma Art系列', 'Tamron Di III系列', 'Tokina atx-m系列', 'Zeiss Batis系列']
    },
    nikon: {
        name: '尼康',
        mount: 'Z/F',
        description: '尼康Z卡口是新一代无反卡口，F卡口可通过转接环兼容',
        popularLenses: [
            { name: 'Z 50mm f/1.2 S', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/1.2', apertureNum: 1.2, price: '¥14,999', priceNum: 14999, desc: '顶级标准定焦', brand: 'original' },
            { name: 'Z 85mm f/1.2 S', type: 'prime', focal: '85mm', focalMin: 85, focalMax: 85, aperture: 'f/1.2', apertureNum: 1.2, price: '¥19,999', priceNum: 19999, desc: '人像镜皇', brand: 'original' },
            { name: 'Z 24-70mm f/2.8 S', type: 'zoom', focal: '24-70mm', focalMin: 24, focalMax: 70, aperture: 'f/2.8', apertureNum: 2.8, price: '¥15,999', priceNum: 15999, desc: '标准变焦大三元', brand: 'original' },
            { name: 'Z 70-200mm f/2.8 VR S', type: 'zoom', focal: '70-200mm', focalMin: 70, focalMax: 200, aperture: 'f/2.8', apertureNum: 2.8, price: '¥18,999', priceNum: 18999, desc: '长焦大三元带防抖', brand: 'original' },
            { name: 'Z 14-24mm f/2.8 S', type: 'zoom', focal: '14-24mm', focalMin: 14, focalMax: 24, aperture: 'f/2.8', apertureNum: 2.8, price: '¥15,999', priceNum: 15999, desc: '超广角大三元', brand: 'original' },
            { name: 'Z 100-400mm f/4.5-5.6 VR S', type: 'zoom', focal: '100-400mm', focalMin: 100, focalMax: 400, aperture: 'f/4.5-5.6', apertureNum: 4.5, price: '¥16,999', priceNum: 16999, desc: '远摄变焦带防抖', brand: 'original' },
            { name: 'Z 40mm f/2', type: 'prime', focal: '40mm', focalMin: 40, focalMax: 40, aperture: 'f/2', apertureNum: 2.0, price: '¥1,999', priceNum: 1999, desc: '饼干头，轻便挂机', brand: 'original' },
            { name: 'Z 50mm f/1.8 S', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/1.8', apertureNum: 1.8, price: '¥3,999', priceNum: 3999, desc: '性价比标准定焦', brand: 'original' },
            { name: 'Z 105mm f/2.8 VR S Macro', type: 'macro', focal: '105mm', focalMin: 105, focalMax: 105, aperture: 'f/2.8', apertureNum: 2.8, price: '¥6,999', priceNum: 6999, desc: '专业微距镜头', brand: 'original' },
            { name: 'Z 35mm f/1.8 S', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.8', apertureNum: 1.8, price: '¥5,999', priceNum: 5999, desc: 'S系列广角定焦', brand: 'original' },
            { name: 'Z 20mm f/1.8 S', type: 'prime', focal: '20mm', focalMin: 20, focalMax: 20, aperture: 'f/1.8', apertureNum: 1.8, price: '¥7,999', priceNum: 7999, desc: '星空摄影利器', brand: 'original' },
            { name: 'Sigma Art 35mm f/1.4', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.4', apertureNum: 1.4, price: '¥5,499', priceNum: 5499, desc: '适马Art人文头', brand: 'sigma' },
            { name: 'Sigma Art 85mm f/1.4', type: 'prime', focal: '85mm', focalMin: 85, focalMax: 85, aperture: 'f/1.4', apertureNum: 1.4, price: '¥6,499', priceNum: 6499, desc: '适马Art人像头', brand: 'sigma' },
            { name: 'Tamron 70-300mm f/4.5-6.3', type: 'zoom', focal: '70-300mm', focalMin: 70, focalMax: 300, aperture: 'f/4.5-6.3', apertureNum: 4.5, price: '¥4,299', priceNum: 4299, desc: '腾龙轻便长焦', brand: 'tamron' }
        ],
        thirdParty: ['Sigma Art系列', 'Tamron Di III系列', 'Tokina atx-m系列']
    },
    fujifilm: {
        name: '富士',
        mount: 'X/G',
        description: '富士X卡口是APS-C画幅，G卡口是中画幅',
        popularLenses: [
            { name: 'XF 56mm f/1.2 R', type: 'prime', focal: '56mm', focalMin: 56, focalMax: 56, aperture: 'f/1.2', apertureNum: 1.2, price: '¥8,999', priceNum: 8999, desc: '等效85mm人像镜', brand: 'original' },
            { name: 'XF 33mm f/1.4 R LM WR', type: 'prime', focal: '33mm', focalMin: 33, focalMax: 33, aperture: 'f/1.4', apertureNum: 1.4, price: '¥5,999', priceNum: 5999, desc: '等效50mm标准定焦', brand: 'original' },
            { name: 'XF 16-55mm f/2.8 R', type: 'zoom', focal: '16-55mm', focalMin: 16, focalMax: 55, aperture: 'f/2.8', apertureNum: 2.8, price: '¥8,999', priceNum: 8999, desc: '标准变焦大三元', brand: 'original' },
            { name: 'XF 50-140mm f/2.8 R', type: 'zoom', focal: '50-140mm', focalMin: 50, focalMax: 140, aperture: 'f/2.8', apertureNum: 2.8, price: '¥9,999', priceNum: 9999, desc: '等效70-200mm长焦', brand: 'original' },
            { name: 'XF 10-24mm f/4 R', type: 'zoom', focal: '10-24mm', focalMin: 10, focalMax: 24, aperture: 'f/4', apertureNum: 4.0, price: '¥7,999', priceNum: 7999, desc: '超广角变焦', brand: 'original' },
            { name: 'XF 55-200mm f/3.5-4.8 R', type: 'zoom', focal: '55-200mm', focalMin: 55, focalMax: 200, aperture: 'f/3.5-4.8', apertureNum: 3.5, price: '¥4,999', priceNum: 4999, desc: '轻便长焦变焦', brand: 'original' },
            { name: 'XF 35mm f/1.4 R', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.4', apertureNum: 1.4, price: '¥4,999', priceNum: 4999, desc: '经典人文镜头', brand: 'original' },
            { name: 'XF 18-55mm f/2.8-4 R', type: 'zoom', focal: '18-55mm', focalMin: 18, focalMax: 55, aperture: 'f/2.8-4', apertureNum: 2.8, price: '¥2,999', priceNum: 2999, desc: '套机镜头，画质不错', brand: 'original' },
            { name: 'XF 80mm f/2.8 R LM OIS WR Macro', type: 'macro', focal: '80mm', focalMin: 80, focalMax: 80, aperture: 'f/2.8', apertureNum: 2.8, price: '¥7,999', priceNum: 7999, desc: '专业微距镜头', brand: 'original' },
            { name: 'XF 23mm f/1.4 R', type: 'prime', focal: '23mm', focalMin: 23, focalMax: 23, aperture: 'f/1.4', apertureNum: 1.4, price: '¥5,999', priceNum: 5999, desc: '等效35mm人文头', brand: 'original' },
            { name: 'XF 90mm f/2 R LM WR', type: 'prime', focal: '90mm', focalMin: 90, focalMax: 90, aperture: 'f/2', apertureNum: 2.0, price: '¥6,999', priceNum: 6999, desc: '等效135mm人像头', brand: 'original' },
            { name: 'Sigma 18-50mm f/2.8 DC DN', type: 'zoom', focal: '18-50mm', focalMin: 18, focalMax: 50, aperture: 'f/2.8', apertureNum: 2.8, price: '¥3,999', priceNum: 3999, desc: '适马轻便标准变焦', brand: 'sigma' },
            { name: 'Sigma 56mm f/1.4 DC DN', type: 'prime', focal: '56mm', focalMin: 56, focalMax: 56, aperture: 'f/1.4', apertureNum: 1.4, price: '¥2,999', priceNum: 2999, desc: '适马轻便人像头', brand: 'sigma' },
            { name: 'Tamron 17-70mm f/2.8', type: 'zoom', focal: '17-70mm', focalMin: 17, focalMax: 70, aperture: 'f/2.8', apertureNum: 2.8, price: '¥4,999', priceNum: 4999, desc: '腾龙带防抖标准变焦', brand: 'tamron' }
        ],
        thirdParty: ['Sigma C/Art系列', 'Tamron Di III-A系列', 'Tokina atx-m系列', 'Zeiss Touit系列']
    },
    panasonic: {
        name: '松下',
        mount: 'L',
        description: '松下使用徕卡L卡口，与徕卡、适马共享镜头群',
        popularLenses: [
            { name: 'LUMIX S 50mm f/1.4', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/1.4', apertureNum: 1.4, price: '¥13,999', priceNum: 13999, desc: '徕卡认证标准定焦', brand: 'original' },
            { name: 'LUMIX S 85mm f/1.8', type: 'prime', focal: '85mm', focalMin: 85, focalMax: 85, aperture: 'f/1.8', apertureNum: 1.8, price: '¥4,999', priceNum: 4999, desc: '轻便人像镜头', brand: 'original' },
            { name: 'LUMIX S 24-70mm f/2.8', type: 'zoom', focal: '24-70mm', focalMin: 24, focalMax: 70, aperture: 'f/2.8', apertureNum: 2.8, price: '¥13,999', priceNum: 13999, desc: '标准变焦大三元', brand: 'original' },
            { name: 'LUMIX S 70-200mm f/2.8', type: 'zoom', focal: '70-200mm', focalMin: 70, focalMax: 200, aperture: 'f/2.8', apertureNum: 2.8, price: '¥16,999', priceNum: 16999, desc: '长焦大三元带防抖', brand: 'original' },
            { name: 'LUMIX S 16-35mm f/4', type: 'zoom', focal: '16-35mm', focalMin: 16, focalMax: 35, aperture: 'f/4', apertureNum: 4.0, price: '¥9,999', priceNum: 9999, desc: '超广角变焦', brand: 'original' },
            { name: 'LUMIX S 70-300mm f/4.5-5.6', type: 'zoom', focal: '70-300mm', focalMin: 70, focalMax: 300, aperture: 'f/4.5-5.6', apertureNum: 4.5, price: '¥7,999', priceNum: 7999, desc: '远摄变焦带防抖', brand: 'original' },
            { name: 'LUMIX S 35mm f/1.8', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.8', apertureNum: 1.8, price: '¥4,999', priceNum: 4999, desc: '轻便广角定焦', brand: 'original' },
            { name: 'LUMIX S 20-60mm f/3.5-5.6', type: 'zoom', focal: '20-60mm', focalMin: 20, focalMax: 60, aperture: 'f/3.5-5.6', apertureNum: 3.5, price: '¥3,999', priceNum: 3999, desc: '轻便套机镜头', brand: 'original' },
            { name: 'LUMIX S 100mm f/2.8 Macro', type: 'macro', focal: '100mm', focalMin: 100, focalMax: 100, aperture: 'f/2.8', apertureNum: 2.8, price: '¥6,999', priceNum: 6999, desc: '轻便微距镜头', brand: 'original' },
            { name: 'Sigma Art 24-70mm f/2.8', type: 'zoom', focal: '24-70mm', focalMin: 24, focalMax: 70, aperture: 'f/2.8', apertureNum: 2.8, price: '¥7,999', priceNum: 7999, desc: '适马Art标准变焦', brand: 'sigma' },
            { name: 'Sigma Art 35mm f/1.4', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.4', apertureNum: 1.4, price: '¥5,999', priceNum: 5999, desc: '适马Art人文头', brand: 'sigma' },
            { name: 'Leica SL 50mm f/1.4 Summilux', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/1.4', apertureNum: 1.4, price: '¥32,000', priceNum: 32000, desc: '徕卡SL标准定焦', brand: 'original' }
        ],
        thirdParty: ['Sigma Art系列', 'Leica SL系列', 'Tamron Di III系列']
    },
    olympus: {
        name: '奥林巴斯',
        mount: 'M43',
        description: '奥林巴斯使用M4/3卡口，与松下共享镜头群',
        popularLenses: [
            { name: 'M.Zuiko 45mm f/1.2 PRO', type: 'prime', focal: '45mm', focalMin: 45, focalMax: 45, aperture: 'f/1.2', apertureNum: 1.2, price: '¥8,999', priceNum: 8999, desc: '等效90mm人像镜', brand: 'original' },
            { name: 'M.Zuiko 25mm f/1.2 PRO', type: 'prime', focal: '25mm', focalMin: 25, focalMax: 25, aperture: 'f/1.2', apertureNum: 1.2, price: '¥8,999', priceNum: 8999, desc: '等效50mm标准定焦', brand: 'original' },
            { name: 'M.Zuiko 12-40mm f/2.8 PRO', type: 'zoom', focal: '12-40mm', focalMin: 12, focalMax: 40, aperture: 'f/2.8', apertureNum: 2.8, price: '¥6,999', priceNum: 6999, desc: '等效24-80mm标准变焦', brand: 'original' },
            { name: 'M.Zuiko 40-150mm f/2.8 PRO', type: 'zoom', focal: '40-150mm', focalMin: 40, focalMax: 150, aperture: 'f/2.8', apertureNum: 2.8, price: '¥9,999', priceNum: 9999, desc: '等效80-300mm长焦', brand: 'original' },
            { name: 'M.Zuiko 7-14mm f/2.8 PRO', type: 'zoom', focal: '7-14mm', focalMin: 7, focalMax: 14, aperture: 'f/2.8', apertureNum: 2.8, price: '¥8,999', priceNum: 8999, desc: '等效14-28mm超广角', brand: 'original' },
            { name: 'M.Zuiko 100-400mm f/5-6.3', type: 'zoom', focal: '100-400mm', focalMin: 100, focalMax: 400, aperture: 'f/5-6.3', apertureNum: 5.0, price: '¥9,999', priceNum: 9999, desc: '等效200-800mm远摄', brand: 'original' },
            { name: 'M.Zuiko 17mm f/1.8', type: 'prime', focal: '17mm', focalMin: 17, focalMax: 17, aperture: 'f/1.8', apertureNum: 1.8, price: '¥2,999', priceNum: 2999, desc: '等效34mm人文镜头', brand: 'original' },
            { name: 'M.Zuiko 45mm f/1.8', type: 'prime', focal: '45mm', focalMin: 45, focalMax: 45, aperture: 'f/1.8', apertureNum: 1.8, price: '¥1,999', priceNum: 1999, desc: '等效90mm人像入门', brand: 'original' },
            { name: 'M.Zuiko 60mm f/2.8 Macro', type: 'macro', focal: '60mm', focalMin: 60, focalMax: 60, aperture: 'f/2.8', apertureNum: 2.8, price: '¥3,999', priceNum: 3999, desc: '等效120mm微距', brand: 'original' },
            { name: 'M.Zuiko 12-100mm f/4 PRO', type: 'zoom', focal: '12-100mm', focalMin: 12, focalMax: 100, aperture: 'f/4', apertureNum: 4.0, price: '¥7,999', priceNum: 7999, desc: '等效24-200mm旅游头', brand: 'original' },
            { name: 'Panasonic Leica 25mm f/1.4', type: 'prime', focal: '25mm', focalMin: 25, focalMax: 25, aperture: 'f/1.4', apertureNum: 1.4, price: '¥3,999', priceNum: 3999, desc: '松下徕卡标准定焦', brand: 'original' },
            { name: 'Panasonic 12-35mm f/2.8 II', type: 'zoom', focal: '12-35mm', focalMin: 12, focalMax: 35, aperture: 'f/2.8', apertureNum: 2.8, price: '¥5,999', priceNum: 5999, desc: '松下标准变焦', brand: 'original' }
        ],
        thirdParty: ['Panasonic Lumix G系列', 'Sigma DN系列', 'Tamron Di III系列', 'Voigtlander Nokton系列']
    },
    leica: {
        name: '徕卡',
        mount: 'M/L',
        description: '徕卡M卡口是经典旁轴卡口，L卡口用于SL/CL系列，可通过转接使用M镜头',
        popularLenses: [
            { name: 'Noctilux-M 50mm f/0.95', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/0.95', apertureNum: 0.95, price: '¥98,000', priceNum: 98000, desc: '夜神，极致虚化', brand: 'original' },
            { name: 'Summilux-M 35mm f/1.4', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.4', apertureNum: 1.4, price: '¥48,000', priceNum: 48000, desc: '经典人文镜头，徕卡灵魂', brand: 'original' },
            { name: 'Summilux-M 50mm f/1.4', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/1.4', apertureNum: 1.4, price: '¥38,000', priceNum: 38000, desc: '标准定焦，画质卓越', brand: 'original' },
            { name: 'Summicron-M 35mm f/2', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/2', apertureNum: 2.0, price: '¥25,000', priceNum: 25000, desc: '性价比之选，锐度极高', brand: 'original' },
            { name: 'Summicron-M 50mm f/2', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/2', apertureNum: 2.0, price: '¥20,000', priceNum: 20000, desc: '经典双高斯结构', brand: 'original' },
            { name: 'Summilux-SL 50mm f/1.4', type: 'prime', focal: '50mm', focalMin: 50, focalMax: 50, aperture: 'f/1.4', apertureNum: 1.4, price: '¥32,000', priceNum: 32000, desc: 'SL系统标准定焦', brand: 'original' },
            { name: 'Vario-Elmarit-SL 24-90mm f/2.8-4', type: 'zoom', focal: '24-90mm', focalMin: 24, focalMax: 90, aperture: 'f/2.8-4', apertureNum: 2.8, price: '¥35,000', priceNum: 35000, desc: 'SL系统标准变焦', brand: 'original' },
            { name: 'APO-Summicron-SL 35mm f/2', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/2', apertureNum: 2.0, price: '¥38,000', priceNum: 38000, desc: 'SL系统人文镜头', brand: 'original' },
            { name: 'Summilux-M 28mm f/1.4', type: 'prime', focal: '28mm', focalMin: 28, focalMax: 28, aperture: 'f/1.4', apertureNum: 1.4, price: '¥52,000', priceNum: 52000, desc: '广角大光圈', brand: 'original' },
            { name: 'APO-Summicron-M 90mm f/2', type: 'prime', focal: '90mm', focalMin: 90, focalMax: 90, aperture: 'f/2', apertureNum: 2.0, price: '¥28,000', priceNum: 28000, desc: '人像镜头', brand: 'original' },
            { name: 'Zeiss ZM 35mm f/1.4', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.4', apertureNum: 1.4, price: '¥12,000', priceNum: 12000, desc: '蔡司M口人文头', brand: 'zeiss' },
            { name: 'Voigtlander 35mm f/1.2', type: 'prime', focal: '35mm', focalMin: 35, focalMax: 35, aperture: 'f/1.2', apertureNum: 1.2, price: '¥6,000', priceNum: 6000, desc: '福伦达超大光圈', brand: 'voigtlander' }
        ],
        thirdParty: ['Zeiss ZM系列', 'Voigtlander VM系列', 'Konica M系列', 'Minolta M-Rokkor系列']
    },
    hasselblad: {
        name: '哈苏',
        mount: 'X',
        description: '哈苏X卡口用于X系统无反中画幅相机，支持XCD镜头群',
        popularLenses: [
            { name: 'XCD 45mm f/4 P', type: 'prime', focal: '45mm', focalMin: 45, focalMax: 45, aperture: 'f/4', apertureNum: 4.0, price: '¥18,000', priceNum: 18000, desc: '等效35mm轻便挂机头', brand: 'original' },
            { name: 'XCD 45mm f/3.5', type: 'prime', focal: '45mm', focalMin: 45, focalMax: 45, aperture: 'f/3.5', apertureNum: 3.5, price: '¥28,000', priceNum: 28000, desc: '等效35mm标准镜头', brand: 'original' },
            { name: 'XCD 65mm f/2.8', type: 'prime', focal: '65mm', focalMin: 65, focalMax: 65, aperture: 'f/2.8', apertureNum: 2.8, price: '¥32,000', priceNum: 32000, desc: '等效50mm标准镜头', brand: 'original' },
            { name: 'XCD 90mm f/3.2', type: 'prime', focal: '90mm', focalMin: 90, focalMax: 90, aperture: 'f/3.2', apertureNum: 3.2, price: '¥38,000', priceNum: 38000, desc: '等效70mm人像镜头', brand: 'original' },
            { name: 'XCD 135mm f/2.8', type: 'prime', focal: '135mm', focalMin: 135, focalMax: 135, aperture: 'f/2.8', apertureNum: 2.8, price: '¥48,000', priceNum: 48000, desc: '等效105mm长焦人像', brand: 'original' },
            { name: 'XCD 21mm f/4', type: 'prime', focal: '21mm', focalMin: 21, focalMax: 21, aperture: 'f/4', apertureNum: 4.0, price: '¥28,000', priceNum: 28000, desc: '等效17mm超广角', brand: 'original' },
            { name: 'XCD 30mm f/3.5', type: 'prime', focal: '30mm', focalMin: 30, focalMax: 30, aperture: 'f/3.5', apertureNum: 3.5, price: '¥35,000', priceNum: 35000, desc: '等效24mm广角', brand: 'original' },
            { name: 'XCD 120mm f/3.5 Macro', type: 'macro', focal: '120mm', focalMin: 120, focalMax: 120, aperture: 'f/3.5', apertureNum: 3.5, price: '¥42,000', priceNum: 42000, desc: '等效95mm微距镜头', brand: 'original' },
            { name: 'XCD 38mm f/2.5', type: 'prime', focal: '38mm', focalMin: 38, focalMax: 38, aperture: 'f/2.5', apertureNum: 2.5, price: '¥25,000', priceNum: 25000, desc: '等效30mm广角', brand: 'original' },
            { name: 'XCD 55mm f/2.5', type: 'prime', focal: '55mm', focalMin: 55, focalMax: 55, aperture: 'f/2.5', apertureNum: 2.5, price: '¥32,000', priceNum: 32000, desc: '等效43mm标准', brand: 'original' }
        ],
        thirdParty: ['Hasselblad HC/HCD系列(转接)', 'XPan镜头(转接)', '部分V系统镜头(转接)']
    }
};

// 初始化 DOM 元素引用
function initDomElements() {
    dropZone = document.getElementById('dropZone');
    fileInput = document.getElementById('fileInput');
    previewSection = document.getElementById('previewSection');
    previewGrid = document.getElementById('previewGrid');
    analyzeBtn = document.getElementById('analyzeBtn');
    clearBtn = document.getElementById('clearBtn');
    exifContainer = document.getElementById('exifContainer');
    analysisSection = document.getElementById('analysisSection');
    analysisContent = document.getElementById('analysisContent');
    knowledgeModal = document.getElementById('knowledgeModal');
    modalTitle = document.getElementById('modalTitle');
    modalBody = document.getElementById('modalBody');
    
    console.log('DOM 元素初始化:', { 
        dropZone: !!dropZone, 
        fileInput: !!fileInput, 
        analysisContent: !!analysisContent,
        analysisSection: !!analysisSection
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initDomElements();
    initRuleEngine();
    initEventListeners();
    initHamburgerMenu();
    initKnowledgeBase();
    
    // 初始化全局更新检测（如果不在admin-update页面）
    if (!window.location.pathname.includes('admin-update')) {
        initGlobalUpdateChecker();
    }
    
    // 监听跨标签页 AI 配置变更（配置页保存时触发）
    window.addEventListener('storage', (e) => {
        if (e.key === 'photoMonster_ai_config_updated' && window.aiManager) {
            console.log('[主页面] 检测到 AI 配置变更，自动刷新');
            window.aiManager.config = AIConfig.getConfig();
            window.aiManager.qwenAnalyzer = null;
            window.aiManager.workbuddyAnalyzer = null;
        }
    });
    initPlanner();
    
    // 检查 KnowledgeBase 是否加载成功
    setTimeout(() => {
        console.log('延迟检查 KnowledgeBase:', typeof KnowledgeBase !== 'undefined');
        if (typeof KnowledgeBase !== 'undefined') {
            console.log('KnowledgeBase 主题列表:', Object.keys(KnowledgeBase));
        } else {
            console.error('KnowledgeBase 未加载，请检查 knowledge-base.js 文件');
            // 尝试手动加载（根据当前路径调整）
            const script = document.createElement('script');
            const isInPages = window.location.pathname.includes('/pages/');
            script.src = isInPages ? '../js/knowledge-base.js' : 'js/knowledge-base.js';
            script.onload = () => console.log('手动加载 knowledge-base.js 成功');
            script.onerror = () => console.error('手动加载 knowledge-base.js 失败');
            document.head.appendChild(script);
        }
    }, 100);
});

// 初始化规则引擎
function initRuleEngine() {
    if (typeof PhotoRuleEngine !== 'undefined') {
        ruleEngine = new PhotoRuleEngine();
        console.log('规则引擎初始化成功');
    } else {
        console.warn('规则引擎未加载，将使用基础分析');
    }

    if (typeof AIAnalyzer !== 'undefined') {
        aiAnalyzer = new AIAnalyzer({ enabled: false });
    }
}

// 事件监听
function initEventListeners() {
    // 文件上传相关事件（仅在照片分析页面）
    if (fileInput && dropZone) {
        // 初始化拖拽反馈
        initDragFeedback(dropZone);

        // 文件上传
        fileInput.addEventListener('change', handleFileSelect);

        // 拖拽上传
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files).filter(file => {
                // 检查 MIME 类型或文件扩展名
                const isImage = file.type.startsWith('image/');
                const isRaw = file.name.match(/\.(raw|cr2|cr3|nef|arw|dng|orf|rw2|raf)$/i);
                return isImage || isRaw;
            });
            if (files.length === 0) {
                showWarningToast('请上传图片文件', '不支持的文件类型');
            } else {
                handleFiles(files);
            }
        });

        // 按钮事件
        if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeImages);
        if (clearBtn) clearBtn.addEventListener('click', clearImages);

        // 批量分析按钮
        const batchAnalyzeBtn = document.getElementById('batchAnalyzeBtn');
        if (batchAnalyzeBtn) {
            batchAnalyzeBtn.addEventListener('click', batchAnalyzeImages);
        }

        // EXIF信息按钮
        const equipmentAnalysisBtn = document.getElementById('equipmentAnalysisBtn');
        if (equipmentAnalysisBtn) {
            equipmentAnalysisBtn.addEventListener('click', () => {
                // 跳转到EXIF信息区域
                document.getElementById('exif')?.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // 质量滑块
        const qualitySlider = document.getElementById('quality');
        const qualityValue = document.getElementById('qualityValue');
        if (qualitySlider && qualityValue) {
            qualitySlider.addEventListener('input', (e) => {
                qualityValue.textContent = Math.round(e.target.value * 100) + '%';
            });
        }
    } else {
        console.log('文件上传元素不存在，跳过文件上传事件绑定');
    }
}

// 初始化知识库
function initKnowledgeBase() {
    console.log('初始化知识库...');
    
    // 知识库链接事件
    document.querySelectorAll('.card-list a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const topic = link.getAttribute('data-topic');
            showKnowledge(topic);
        });
    });
    
    // 初始化搜索功能
    initKnowledgeSearch();
    console.log('知识库初始化完成');
}

// 初始化知识库搜索
function initKnowledgeSearch() {
    const searchInput = document.getElementById('knowledgeSearchInput');
    const searchBtn = document.getElementById('knowledgeSearchBtn');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    if (!searchInput) return;
    
    // 搜索按钮事件
    searchBtn?.addEventListener('click', () => {
        performKnowledgeSearch(searchInput.value.trim());
    });
    
    // 回车键搜索
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performKnowledgeSearch(searchInput.value.trim());
        }
    });
    
    // 实时搜索（输入时延迟搜索）
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const keyword = e.target.value.trim();
        if (keyword.length >= 2) {
            searchTimeout = setTimeout(() => {
                performKnowledgeSearch(keyword);
            }, 300);
        } else if (keyword.length === 0) {
            clearKnowledgeSearch();
        }
    });
    
    // 清除搜索
    clearBtn?.addEventListener('click', clearKnowledgeSearch);
    
    // 热门标签点击
    document.querySelectorAll('.search-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const keyword = tag.getAttribute('data-keyword');
            searchInput.value = keyword;
            performKnowledgeSearch(keyword);
        });
    });
}

// 执行知识库搜索
function performKnowledgeSearch(keyword) {
    if (!keyword) {
        clearKnowledgeSearch();
        return;
    }
    
    const resultsContainer = document.getElementById('searchResults');
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const knowledgeGrid = document.getElementById('knowledgeGrid');
    
    if (!resultsContainer || !resultsGrid) return;
    
    // 搜索知识库
    const results = searchKnowledgeBase(keyword);
    
    // 显示结果区域，隐藏原知识网格
    resultsContainer.style.display = 'block';
    if (knowledgeGrid) knowledgeGrid.style.display = 'none';
    
    // 更新结果数量
    resultsCount.textContent = `(${results.length} 个结果)`;
    
    // 渲染结果
    if (results.length === 0) {
        resultsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <p>未找到与 "${escapeHtml(keyword)}" 相关的知识</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">试试其他关键词，如：构图、曝光、人像、风光...</p>
            </div>
        `;
    } else {
        resultsGrid.innerHTML = results.map(item => `
            <div class="result-item" data-topic="${item.key}">
                <span class="result-category">${item.category}</span>
                <h4><i class="fas ${item.icon}"></i> ${item.title}</h4>
                ${item.subtitle ? `<p class="result-source" style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;"><i class="fas fa-folder-open"></i> ${item.subtitle}</p>` : ''}
                <div class="result-preview">${item.matchedSection || item.preview}</div>
            </div>
        `).join('');
        
        // 绑定点击事件
        resultsGrid.querySelectorAll('.result-item').forEach(item => {
            item.addEventListener('click', () => {
                const topic = item.getAttribute('data-topic');
                showKnowledge(topic);
            });
        });
    }
    
    // 滚动到结果区域
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 清除搜索
function clearKnowledgeSearch() {
    const searchInput = document.getElementById('knowledgeSearchInput');
    const resultsContainer = document.getElementById('searchResults');
    const knowledgeGrid = document.getElementById('knowledgeGrid');
    
    if (searchInput) searchInput.value = '';
    if (resultsContainer) resultsContainer.style.display = 'none';
    if (knowledgeGrid) knowledgeGrid.style.display = 'grid';
}

// 搜索知识库
function searchKnowledgeBase(keyword) {
    if (!keyword || typeof KnowledgeBase === 'undefined') return [];
    
    const lowerKeyword = keyword.toLowerCase();
    const results = [];
    const addedKeys = new Set(); // 防止重复
    
    Object.entries(KnowledgeBase).forEach(([key, item]) => {
        // 在标题、分类、内容中搜索
        const titleMatch = item.title?.toLowerCase().includes(lowerKeyword);
        const categoryMatch = item.category?.toLowerCase().includes(lowerKeyword);
        const contentMatch = item.content?.toLowerCase().includes(lowerKeyword);
        const tipsMatch = item.tips?.some(tip => tip.toLowerCase().includes(lowerKeyword));
        
        // 尝试提取匹配的具体知识点
        let matchedSection = null;
        if (contentMatch && item.content) {
            matchedSection = extractMatchedSection(item.content, keyword);
        }
        
        if (titleMatch || categoryMatch || contentMatch || tipsMatch) {
            // 如果匹配到具体知识点，优先显示知识点片段
            let previewText = matchedSection || item.content
                ?.replace(/<[^>]+>/g, ' ')
                ?.replace(/\s+/g, ' ')
                ?.trim()
                ?.substring(0, 120) + '...' || '';
            
            // 如果匹配到具体知识点标题，显示知识点名称
            let displayTitle = item.title;
            if (matchedSection && matchedSection.toLowerCase().includes(lowerKeyword)) {
                // 尝试从匹配片段中提取知识点名称
                const sectionName = extractSectionName(item.content, keyword);
                if (sectionName) {
                    displayTitle = `${sectionName}`;
                }
            }
            
            const resultKey = matchedSection ? `${key}-${lowerKeyword}` : key;
            if (!addedKeys.has(resultKey)) {
                addedKeys.add(resultKey);
                results.push({
                    key,
                    title: displayTitle,
                    subtitle: matchedSection ? `来自：${item.title}` : '',
                    category: item.category,
                    icon: item.icon || 'fa-book',
                    preview: previewText,
                    matchedSection: matchedSection,
                    relevance: (titleMatch ? 3 : 0) + (categoryMatch ? 2 : 0) + (contentMatch ? 1 : 0) + (matchedSection ? 2 : 0)
                });
            }
        }
    });
    
    // 按相关度排序
    return results.sort((a, b) => b.relevance - a.relevance);
}

// 从内容中提取匹配的知识点片段
function extractMatchedSection(content, keyword) {
    if (!content || !keyword) return null;
    
    const lowerKeyword = keyword.toLowerCase();
    const lowerContent = content.toLowerCase();
    const index = lowerContent.indexOf(lowerKeyword);
    
    if (index === -1) return null;
    
    // 找到包含关键词的段落
    // 向前找<h3>或<h4>标签作为起点
    let startIndex = index;
    const beforeText = content.substring(0, index);
    const h3Match = beforeText.lastIndexOf('<h3>');
    const h4Match = beforeText.lastIndexOf('<h4>');
    const h2Match = beforeText.lastIndexOf('<h2>');
    
    // 取最近的一个标题
    const lastHeading = Math.max(h3Match, h4Match, h2Match);
    if (lastHeading !== -1 && lastHeading > index - 500) {
        startIndex = lastHeading;
    } else {
        // 向前扩展一些上下文
        startIndex = Math.max(0, index - 100);
    }
    
    // 向后找结束位置（下一个标题或段落结束）
    let endIndex = index + 300;
    const afterText = content.substring(index);
    const nextH3 = afterText.indexOf('<h3>');
    const nextH4 = afterText.indexOf('<h4>');
    const nextUl = afterText.indexOf('</ul>');
    const nextP = afterText.indexOf('</p>');
    
    // 如果找到合适的结束点
    const possibleEnds = [nextH3, nextH4, nextUl, nextP].filter(i => i !== -1);
    if (possibleEnds.length > 0) {
        const nearestEnd = Math.min(...possibleEnds);
        if (nearestEnd < 400) {
            endIndex = index + nearestEnd + 5; // +5 是为了包含结束标签
        }
    }
    
    // 提取片段并清理
    let snippet = content.substring(startIndex, endIndex);
    
    // 高亮关键词
    const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
    snippet = snippet.replace(regex, '<mark>$1</mark>');
    
    return snippet;
}

// 提取知识点名称
function extractSectionName(content, keyword) {
    if (!content || !keyword) return null;
    
    const lowerKeyword = keyword.toLowerCase();
    const lowerContent = content.toLowerCase();
    const index = lowerContent.indexOf(lowerKeyword);
    
    if (index === -1) return null;
    
    // 向前找最近的<h3>或<h4>标签
    const beforeText = content.substring(0, index);
    const h3Match = beforeText.match(/<h3>([^<]+)<\/h3>[^]*$/);
    const h4Match = beforeText.match(/<h4>([^<]+)<\/h4>[^]*$/);
    
    if (h4Match) return h4Match[1];
    if (h3Match) return h3Match[1];
    
    return null;
}

// 转义正则特殊字符
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 初始化拍摄方案规划
function initPlanner() {
    console.log('初始化拍摄方案规划...');
    
    const plannerInput = document.getElementById('plannerInput');
    const generatePlanBtn = document.getElementById('generatePlanBtn');
    const plannerResult = document.getElementById('plannerResult');
    
    console.log('方案规划元素:', { plannerInput: !!plannerInput, generatePlanBtn: !!generatePlanBtn });
    
    if (!plannerInput || !generatePlanBtn) {
        console.log('方案规划元素不存在，跳过初始化');
        return;
    }
    
    // 生成按钮事件
    generatePlanBtn.addEventListener('click', () => {
        console.log('生成方案按钮被点击');
        const keyword = plannerInput.value.trim();
        if (keyword) {
            generatePlannerResult(keyword);
        } else {
            alert('请输入拍摄主题');
        }
    });
    
    // 回车键触发
    plannerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generatePlanBtn.click();
        }
    });
    
    // 快速标签点击
    document.querySelectorAll('.quick-tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const scenario = tag.getAttribute('data-scenario');
            plannerInput.value = tag.textContent;
            generatePlannerResult(scenario, tag.textContent);
        });
    });
}

// 生成拍摄方案
function generatePlannerResult(keyword, displayName = null) {
    const plannerResult = document.getElementById('plannerResult');
    if (!plannerResult) return;
    
    // 显示加载状态
    plannerResult.style.display = 'block';
    plannerResult.innerHTML = '<div class="loading-text"><i class="fas fa-spinner fa-spin"></i> 正在生成专业拍摄方案...</div>';
    plannerResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 模拟生成延迟
    setTimeout(() => {
        const plan = createPlannerContent(keyword, displayName);
        plannerResult.innerHTML = plan;
    }, 800);
}

// 创建方案内容
function createPlannerContent(keyword, displayName) {
    // 匹配场景类型
    let scenarioType = 'general';
    const keywordLower = keyword.toLowerCase();
    
    if (keywordLower.includes('人像') || keywordLower.includes('portrait') || keywordLower.includes('girl') || keywordLower.includes('boy')) {
        scenarioType = 'portrait';
    } else if (keywordLower.includes('风光') || keywordLower.includes('风景') || keywordLower.includes('landscape') || keywordLower.includes('山') || keywordLower.includes('海')) {
        scenarioType = 'landscape';
    } else if (keywordLower.includes('汉服') || keywordLower.includes('古风') || keywordLower.includes('传统')) {
        scenarioType = 'hanfu';
    } else if (keywordLower.includes('星空') || keywordLower.includes('银河') || keywordLower.includes('star') || keywordLower.includes('astro')) {
        scenarioType = 'astro';
    } else if (keywordLower.includes('街头') || keywordLower.includes('街拍') || keywordLower.includes('street') || keywordLower.includes('纪实')) {
        scenarioType = 'street';
    } else if (keywordLower.includes('婚礼') || keywordLower.includes('wedding') || keywordLower.includes('结婚')) {
        scenarioType = 'wedding';
    } else if (keywordLower.includes('微距') || keywordLower.includes('macro') || keywordLower.includes('昆虫') || keywordLower.includes('花') && (keywordLower.includes('特写') || keywordLower.includes('细节'))) {
        scenarioType = 'macro';
    } else if (keywordLower.includes('产品') || keywordLower.includes('静物') || keywordLower.includes('product') || keywordLower.includes('food') || keywordLower.includes('美食') || keywordLower.includes('电商')) {
        scenarioType = 'product';
    } else if (keywordLower.includes('运动') || keywordLower.includes('体育') || keywordLower.includes('sports') || keywordLower.includes('比赛') || keywordLower.includes('赛事')) {
        scenarioType = 'sports';
    } else if (keywordLower.includes('野生动物') || keywordLower.includes('鸟类') || keywordLower.includes('wildlife') || keywordLower.includes('bird') || keywordLower.includes('打鸟')) {
        scenarioType = 'wildlife';
    }
    
    // 获取方案数据
    let planData = null;
    if (ruleEngine && ruleEngine.shootingPlans[scenarioType]) {
        planData = ruleEngine.shootingPlans[scenarioType];
    }
    
    const title = displayName || keyword;
    
    let html = `
        <div class="planner-header">
            <h3><i class="fas fa-camera"></i> ${title} - 专业拍摄方案</h3>
            <span class="planner-date">生成时间：${new Date().toLocaleString('zh-CN')}</span>
        </div>
    `;
    
    if (planData) {
        // 使用预设方案
        html += generatePlanHtml(planData);
        
        // 添加自定义准备清单
        html += generatePreparationChecklist(scenarioType);
        
        // 添加天气和时机建议
        html += generateTimingAdvice(scenarioType);
        
        // 添加后期处理建议
        html += generatePostProcessingAdvice(scenarioType);
    } else {
        // 通用方案
        html += generateGenericPlan(keyword);
    }
    
    // 添加打印/导出按钮
    html += `
        <div class="planner-actions">
            <button class="btn btn-secondary" onclick="window.print()">
                <i class="fas fa-print"></i> 打印方案
            </button>
            <button class="btn btn-primary" onclick="copyPlanToClipboard()">
                <i class="fas fa-copy"></i> 复制文本
            </button>
        </div>
    `;
    
    return html;
}

// 生成准备清单
function generatePreparationChecklist(type) {
    const checklists = {
        portrait: {
            equipment: ['相机 + 备用电池', '人像镜头（85mm/50mm）', '反光板', '补光灯/闪光灯', '存储卡'],
            preparation: ['与模特沟通拍摄风格', '确认服装和妆容', '准备道具（花、书等）', '查看天气预报', '提前踩点'],
            shooting: ['测试光线角度', '检查相机设置', '拍摄试光照', '与模特热身交流']
        },
        landscape: {
            equipment: ['相机 + 备用电池', '广角镜头', '稳固三脚架', 'ND滤镜', '快门线', '头灯'],
            preparation: ['查询日出日落时间', '查看天气预报和云量', '使用APP规划机位', '提前到达踩点', '准备保暖衣物'],
            shooting: ['架设三脚架', '检查水平', '测试不同构图', '等待最佳光线']
        },
        hanfu: {
            equipment: ['相机', '85mm或35mm镜头', '反光板', '道具（扇子、伞、书卷）', '补光灯（室内）'],
            preparation: ['确认汉服形制', '预约妆造师', '准备发饰和配饰', '收集道具', '与模特沟通动作'],
            shooting: ['检查服装细节', '测试光线', '示范动作给模特', '注意衣摆和发型']
        },
        astro: {
            equipment: ['高感相机', '广角大光圈镜头', '稳固三脚架', '头灯（红光）', '快门线', '备用电池x3', '除雾带'],
            preparation: ['查询月相', '使用APP找银河位置', '查看光污染地图', '提前到达适应黑暗', '告知他人行程'],
            shooting: ['对焦无穷远', '测试曝光', '检查构图', '拍摄多张']
        },
        wedding: {
            equipment: ['双机', '24-70mm + 70-200mm', '闪光灯', '备用电池x3', '双卡存储', '镜头布'],
            preparation: ['与新人确认流程', '准备shot list', '提前踩点', '检查所有设备', '充足睡眠'],
            shooting: ['提前到场', '拍摄细节', '抓拍关键瞬间', '注意双方父母']
        },
        macro: {
            equipment: ['相机', '微距镜头（90mm/100mm）', '稳固三脚架', '环形闪光灯', '反光板（小型）', '喷水壶'],
            preparation: ['选择拍摄主体（昆虫/花卉）', '查看天气预报（防风）', '准备背景板', '检查电池电量'],
            shooting: ['使用实时取景放大对焦', '注意景深控制', '保持相机稳定', '耐心等待时机']
        },
        product: {
            equipment: ['相机', '标准或微距镜头', '三脚架', '柔光箱/LED灯', '反光板', '背景纸'],
            preparation: ['清洁产品表面', '准备拍摄台', '测试灯光布置', '准备道具搭配'],
            shooting: ['检查产品摆放角度', '测试曝光', '检查反光和阴影', '拍摄多角度']
        },
        sports: {
            equipment: ['高速连拍相机', '长焦镜头（70-200mm/100-400mm）', '独脚架', '备用电池', '高速存储卡'],
            preparation: ['了解比赛规则', '选择拍摄位置', '测试对焦速度', '检查连拍设置'],
            shooting: ['预判动作位置', '保持连拍', '检查曝光', '捕捉关键瞬间']
        },
        wildlife: {
            equipment: ['长焦相机/镜头（400mm+）', '稳固三脚架', '伪装装备', '备用电池', '防雨罩'],
            preparation: ['了解动物习性', '选择观察点', '准备伪装', '检查设备'],
            shooting: ['保持安静', '使用连拍', '对焦眼睛', '耐心等待']
        }
    };
    
    const list = checklists[type] || checklists.portrait;
    
    return `
        <div class="plan-section checklist-section">
            <h4><i class="fas fa-tasks"></i> 拍摄前准备清单</h4>
            <div class="checklist-grid">
                <div class="checklist-category">
                    <h5><i class="fas fa-camera"></i> 器材准备</h5>
                    <ul class="check-list">
                        ${list.equipment.map(item => `<li><label><input type="checkbox"> ${item}</label></li>`).join('')}
                    </ul>
                </div>
                <div class="checklist-category">
                    <h5><i class="fas fa-clipboard-check"></i> 前期准备</h5>
                    <ul class="check-list">
                        ${list.preparation.map(item => `<li><label><input type="checkbox"> ${item}</label></li>`).join('')}
                    </ul>
                </div>
                <div class="checklist-category">
                    <h5><i class="fas fa-play-circle"></i> 拍摄当日</h5>
                    <ul class="check-list">
                        ${list.shooting.map(item => `<li><label><input type="checkbox"> ${item}</label></li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// 生成时机建议
function generateTimingAdvice(type) {
    const advice = {
        portrait: {
            best: '黄金时刻（日出后/日落前1小时）',
            good: '阴天全天',
            avoid: '正午顶光（11:00-14:00）',
            tips: ['黄金时刻光线柔和温暖，最适合人像', '阴天光线均匀，适合清新风格', '避免正午拍摄，光线过硬阴影重']
        },
        landscape: {
            best: '黄金时刻 + 蓝调时刻',
            good: '云层丰富的白天',
            avoid: '无云大晴天（光线平淡）',
            tips: ['提前1小时到达准备', '蓝调时刻只有20-40分钟', '云层增加画面层次']
        },
        hanfu: {
            best: '早晨或傍晚',
            good: '阴天',
            avoid: '正午',
            tips: ['柔和光线更适合古风意境', '避免强烈阴影破坏妆容']
        },
        astro: {
            best: '无月夜 + 银河升起时',
            good: '新月前后',
            avoid: '满月前后（月光干扰）',
            tips: ['查询月相避开满月', '使用APP找银河位置', '提前到达适应黑暗']
        },
        macro: {
            best: '清晨（昆虫活动慢）',
            good: '阴天（光线柔和）',
            avoid: '大风天（微距对稳定要求极高）',
            tips: ['清晨昆虫活动较慢，易于拍摄', '阴天光线均匀，减少阴影', '避免大风天气，轻微晃动都会模糊']
        },
        product: {
            best: '室内可控光线',
            good: '阴天自然光',
            avoid: '强烈直射阳光',
            tips: ['室内拍摄可完全控制光线', '使用柔光箱获得均匀光线', '避免硬阴影影响产品质感']
        },
        sports: {
            best: '白天光线充足',
            good: '多云天气',
            avoid: '光线不足（需要极高ISO）',
            tips: ['光线充足可使用高速快门', '室内比赛注意色温变化', '夜间比赛需要大光圈']
        },
        wildlife: {
            best: '清晨和黄昏（动物活跃）',
            good: '阴天全天',
            avoid: '正午（多数动物休息）',
            tips: ['晨昏是动物最活跃的时段', '保持耐心，等待最佳瞬间', '注意风向，避免气味惊扰']
        }
    };
    
    const a = advice[type] || advice.portrait;
    
    return `
        <div class="plan-section timing-section">
            <h4><i class="fas fa-clock"></i> 拍摄时机建议</h4>
            <div class="timing-grid">
                <div class="timing-item best">
                    <span class="timing-label">最佳</span>
                    <p>${a.best}</p>
                </div>
                <div class="timing-item good">
                    <span class="timing-label">良好</span>
                    <p>${a.good}</p>
                </div>
                <div class="timing-item avoid">
                    <span class="timing-label">避免</span>
                    <p>${a.avoid}</p>
                </div>
            </div>
            <ul class="timing-tips">
                ${a.tips.map(tip => `<li><i class="fas fa-lightbulb"></i> ${tip}</li>`).join('')}
            </ul>
        </div>
    `;
}

// 生成后期建议
function generatePostProcessingAdvice(type) {
    const processing = {
        portrait: {
            software: 'Lightroom + Photoshop',
            steps: ['RAW基础调整（曝光、白平衡）', '肤色调整（HSL橙色）', '磨皮液化', '锐化输出'],
            tips: ['保留皮肤质感，避免过度磨皮', '注意眼神光增强', '适当液化调整形体']
        },
        landscape: {
            software: 'Lightroom + Photoshop',
            steps: ['RAW调整', '天空和地面分开调整', '色彩分离（高光暖、阴影冷）', '锐化降噪'],
            tips: ['使用蒙版局部调整', '适当去朦胧', '避免过度饱和']
        },
        hanfu: {
            software: 'Lightroom + Photoshop',
            steps: ['色调调整（淡雅或浓郁）', '肤色处理', '柔光效果', '可选：添加古风纹理'],
            tips: ['色调要统一', '肤色自然', '可添加轻微柔光']
        },
        astro: {
            software: 'Lightroom + Sequator/PS',
            steps: ['RAW基础调整', '堆栈降噪（多张）', '银河细节增强', '地景合成'],
            tips: ['必须RAW格式', '堆栈显著降低噪点', '分离调整天空和地景']
        }
    };
    
    const p = processing[type] || processing.portrait;
    
    return `
        <div class="plan-section postprocess-section">
            <h4><i class="fas fa-magic"></i> 后期处理建议</h4>
            <div class="postprocess-content">
                <p><strong>推荐软件：</strong>${p.software}</p>
                <h5>处理流程：</h5>
                <ol class="process-list">
                    ${p.steps.map(step => `<li>${step}</li>`).join('')}
                </ol>
                <div class="postprocess-tips">
                    <h5>关键要点：</h5>
                    <ul>
                        ${p.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

// 生成通用方案
function generateGenericPlan(keyword) {
    return `
        <div class="plan-section">
            <h4><i class="fas fa-camera"></i> 基础拍摄建议</h4>
            <p>针对"${keyword}"主题，建议：</p>
            <ul class="plan-list">
                <li><strong>器材：</strong>根据拍摄距离选择合适焦段，标准变焦（24-70mm）是安全选择</li>
                <li><strong>设置：</strong>光圈优先模式，根据景深需求调整光圈</li>
                <li><strong>光线：</strong>优先选择黄金时刻或柔和的自然光</li>
                <li><strong>构图：</strong>尝试三分法，注意背景简洁</li>
            </ul>
        </div>
        <div class="plan-section">
            <h4><i class="fas fa-lightbulb"></i> 创意建议</h4>
            <ul class="plan-list">
                <li>多角度尝试：平视、俯视、仰视</li>
                <li>不同光线方向：顺光、侧光、逆光</li>
                <li>注意细节：前景运用、背景虚化</li>
                <li>多拍选优：同一角度拍摄多张</li>
            </ul>
        </div>
    `;
}

// 复制方案到剪贴板
function copyPlanToClipboard() {
    const plannerResult = document.getElementById('plannerResult');
    if (!plannerResult) return;
    
    // 提取文本内容
    const text = plannerResult.innerText;
    
    navigator.clipboard.writeText(text).then(() => {
        alert('方案已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    });
}

// 汉堡菜单
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!hamburger || !navMenu) {
        console.log('汉堡菜单元素不存在，跳过汉堡菜单初始化');
        return;
    }
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// 处理文件选择
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    handleFiles(files);
}

// 处理文件
async function handleFiles(files) {
    if (files.length === 0) return;

    // 显示加载状态
    showLoading('正在处理图片...', 10);
    updateLoadingProgress(10, '准备处理图片...');

    const maxSize = parseInt(document.getElementById('maxSize').value);
    const maxDimension = document.getElementById('maxDimension').value;
    const quality = parseFloat(document.getElementById('quality').value);

    const totalFiles = files.length;
    let processedCount = 0;

    for (const file of files) {
        try {
            // 更新进度
            const progress = 10 + Math.round((processedCount / totalFiles) * 70);
            updateLoadingProgress(progress, `正在处理 ${processedCount + 1}/${totalFiles} 张图片...`);

            // 检查是否是 HEIC 格式
            let processedFile = file;
            const fileName = file.name.toLowerCase();

            if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
                console.log('检测到 HEIC/HEIF 格式，开始转换...');
                try {
                    const blob = await withTimeout(heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: quality
                    }), 20000, `HEIC转换 ${file.name} 超时，跳过`);
                    // 创建新的 File 对象
                    processedFile = new File([blob], file.name.replace(/\.heic|\.heif/i, '.jpg'), {
                        type: 'image/jpeg',
                        lastModified: file.lastModified
                    });
                    console.log('HEIC 转换成功');
                } catch (heicError) {
                    console.error('HEIC 转换失败:', heicError);
                    showWarningToast(`HEIC 格式转换失败: ${heicError.message}，将尝试直接处理`, '格式转换');
                }
            }

            // 检查是否是 RAW 格式
            const isRaw = fileName.match(/\.(raw|cr2|cr3|nef|arw|dng|orf|rw2|raf)$/i);
            if (isRaw) {
                console.log('检测到 RAW 格式:', fileName);
                showWarningToast('RAW格式仅支持EXIF读取，无法生成预览', 'RAW格式提醒');
                
                try {
                    // RAW格式特殊处理：跳过压缩和预览生成
                    const exifData = await readExif(file); // 使用原始文件读取EXIF
                    currentExifData = exifData;
                    
                    // 创建RAW格式的占位预览
                    const preview = createRawPreview(file.name, exifData);
                    previewGrid.appendChild(preview);
                    
                    // RAW格式不加入压缩图片列表（无法分析）
                    processedCount++;
                } catch (rawError) {
                    console.error('RAW格式处理失败:', rawError);
                    showErrorToast(`处理 ${file.name} 失败: ${rawError.message}`, 'RAW处理失败');
                }
                
                // 跳过常规处理流程，继续处理下一张
                continue;
            }

            // 统一读取文件一次，共用 Image 对象（关键优化：避免重复 readAsDataURL）
            let loadedImg;
            try {
                loadedImg = await withTimeout(loadImageElement(processedFile), 10000, `读取 ${file.name} 超时`);
            } catch (loadErr) {
                console.error('图片加载失败:', loadErr);
                showErrorToast(`无法加载 ${file.name}，跳过此文件`, '加载失败');
                continue;
            }

            // 并行执行：压缩预览图 + 生成AI视觉base64（共用同一个 loadedImg，不再重复读文件）
            let compressedFile, visionBase64;
            try {
                [compressedFile, visionBase64] = await Promise.all([
                    withTimeout(compressImage(loadedImg, {
                        maxWidth: maxDimension === 'original' ? undefined : parseInt(maxDimension),
                        maxHeight: maxDimension === 'original' ? undefined : parseInt(maxDimension),
                        quality: quality,
                        convertSize: maxSize * 1024 * 1024
                    }), 15000, `压缩 ${file.name} 超时，跳过压缩`),
                    withTimeout(generateVisionBase64(loadedImg), 15000, null)
                ]);
            } catch (compressError) {
                console.warn('图片处理失败，降级使用原文件:', compressError.message);
                showWarningToast(`${file.name} 处理超时，使用原文件继续`, '处理降级');
                compressedFile = processedFile;
                try { visionBase64 = await withTimeout(generateVisionBase64(processedFile), 10000, null); } catch { visionBase64 = null; }
            }

            // 存储图片对象，包含文件和base64
            compressedImages.push({
                file: compressedFile,
                base64: visionBase64,
                originalName: file.name
            });

            // 读取 EXIF（对 RAW 格式可能只能读取部分信息）
            const exifData = await readExif(processedFile);
            currentExifData = exifData;

            // 创建预览
            const preview = await createPreview(compressedFile, exifData);
            previewGrid.appendChild(preview);

            processedCount++;

        } catch (error) {
            console.error('处理图片失败:', error);
            showErrorToast(`处理 ${file.name} 失败: ${error.message}`, '处理失败');
        }
    }

    // 隐藏加载状态
    updateLoadingProgress(90, '正在显示预览...');
    hideLoading();

    // 显示预览区域
    if (compressedImages.length > 0) {
        const section = previewSection || document.getElementById('previewSection');
        if (section) {
            section.style.display = 'block';
        }

        // 显示图像分析工具栏
        const analysisTools = document.getElementById('analysis-tools');
        if (analysisTools) {
            analysisTools.style.display = 'block';
        }

        // 显示批量分析按钮（如果有超过1张图片）
        const batchBtn = document.getElementById('batchAnalyzeBtn');
        if (batchBtn) {
            batchBtn.style.display = compressedImages.length > 1 ? 'inline-block' : 'none';
        }

        // 跳转到预览区域
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 成功提示
        if (processedCount > 0) {
            showSuccessToast(`成功处理 ${processedCount} 张图片`, '处理完成');
        }
    }
}

// 统一文件读取函数：File → Image（只读一次，所有操作共用）
function loadImageElement(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() { resolve(img); };
            img.onerror = () => reject(new Error('图片解码失败'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsDataURL(file);
    });
}

// 超时包装器：防止图片处理卡死
function withTimeout(promise, ms, errMsg) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error(errMsg)), ms)
        )
    ]);
}

// 压缩图片
// 压缩图片（支持File或已加载的Image元素，避免重复读取）
function compressImage(source, options) {
    return new Promise((resolve, reject) => {
        // 模式A：直接传入已加载的Image元素（原生路径复用，避免重复读文件）
        if (source instanceof HTMLImageElement) {
            const img = source;
            const maxWidth = options.maxWidth || 1920;
            const maxHeight = options.maxHeight || 1920;
            const quality = options.quality || 0.8;

            let width = img.naturalWidth || img.width;
            let height = img.naturalHeight || img.height;

            if (width > maxWidth || height > maxHeight) {
                if (width / height > maxWidth / maxHeight) {
                    height = Math.round(height * (maxWidth / width));
                    width = maxWidth;
                } else {
                    width = Math.round(width * (maxHeight / height));
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(resolve, 'image/jpeg', quality);
            return;
        }

        const file = source;
        // 模式B：传入File对象，检查 Compressor 是否可用
        if (typeof Compressor === 'undefined' || Compressor === null) {
            console.warn('Compressor 未加载，使用原生图片压缩');
            // 原生路径：读文件 → 加载Image → 画Canvas → 输出Blob
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // 复用模式A逻辑，传入已加载的Image
                    compressImage(img, options).then(resolve).catch(reject);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
            return;
        }
        
        new Compressor(file, {
            ...options,
            success(result) {
                resolve(result);
            },
            error(err) {
                reject(err);
            }
        });
    });
}

// 生成用于AI视觉分析的base64（支持从Image对象复用，或直接读文件）
function generateVisionBase64(source, quality = 0.85, maxSize = 1024) {
    return new Promise((resolve, reject) => {
        // 模式A：直接传入已加载的Image元素（推荐，避免重复读取）
        if (source instanceof HTMLImageElement) {
            try {
                const img = source;
                let width = img.width;
                let height = img.height;

                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round(height * (maxSize / width));
                        width = maxSize;
                    } else {
                        width = Math.round(width * (maxSize / height));
                        height = maxSize;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
                resolve(base64);
            } catch (e) {
                reject(new Error('从Image生成base64失败: ' + e.message));
            }
            return;
        }

        // 模式B：传入File对象（首次读取）
        const file = source;
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // 复用模式A的逻辑，传入已加载的Image
                generateVisionBase64(img, quality, maxSize).then(resolve).catch(reject);
            };
            img.onerror = () => reject(new Error('图片加载失败'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsDataURL(file);
    });
}

// 读取 EXIF
function readExif(file) {
    return new Promise((resolve) => {
        // 检查 EXIF 库是否可用
        if (typeof EXIF === 'undefined') {
            console.warn('EXIF 库未加载');
            resolve({});
            return;
        }
        
        // 设置超时，防止 RAW 格式解析卡住
        const timeout = setTimeout(() => {
            console.warn('EXIF 读取超时，可能是不支持的格式:', file.name);
            resolve({});
        }, 3000);
        
        try {
            EXIF.getData(file, function() {
                clearTimeout(timeout);
                try {
                    const exifData = EXIF.getAllTags(this);
                    // 检查是否成功读取到数据
                    if (!exifData || Object.keys(exifData).length === 0) {
                        console.log('未读取到 EXIF 信息:', file.name);
                    } else {
                        console.log('成功读取 EXIF:', file.name, '字段数:', Object.keys(exifData).length);
                    }
                    resolve(exifData || {});
                } catch (err) {
                    clearTimeout(timeout);
                    console.error('EXIF 解析错误:', err);
                    resolve({});
                }
            });
        } catch (err) {
            clearTimeout(timeout);
            console.error('EXIF.getData 调用失败:', err);
            resolve({});
        }
    });
}

// 创建RAW格式占位预览
function createRawPreview(fileName, exifData) {
    const div = document.createElement('div');
    div.className = 'preview-item raw-preview';
    
    // 获取EXIF中的相机信息
    const cameraMake = exifData?.Make || '';
    const cameraModel = exifData?.Model || '';
    const dateTime = exifData?.DateTimeOriginal || '';
    
    div.innerHTML = `
        <div class="raw-placeholder" style="
            width: 100%;
            height: 200px;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #fff;
            padding: 20px;
            text-align: center;
        ">
            <i class="fas fa-file-image" style="font-size: 48px; margin-bottom: 15px; color: #4a9eff;"></i>
            <div style="font-weight: 600; margin-bottom: 8px;">RAW 格式</div>
            <div style="font-size: 0.85rem; opacity: 0.8; margin-bottom: 5px;">${fileName}</div>
            ${cameraModel ? `<div style="font-size: 0.75rem; opacity: 0.6;">${cameraMake} ${cameraModel}</div>` : ''}
            ${dateTime ? `<div style="font-size: 0.7rem; opacity: 0.5; margin-top: 5px;">${dateTime}</div>` : ''}
        </div>
        <div class="preview-info" style="margin-top: 10px; text-align: center;">
            <span class="file-name" style="font-size: 0.85rem; color: var(--text-secondary);">${fileName}</span>
            <span class="file-type" style="display: inline-block; margin-left: 8px; padding: 2px 8px; background: #4a9eff; color: white; border-radius: 4px; font-size: 0.75rem;">RAW</span>
        </div>
    `;
    
    // 点击显示EXIF信息
    div.addEventListener('click', () => {
        displayExif(exifData);
    });
    
    return div;
}

// 创建预览
// imageObj: { file: 压缩后的文件, base64: 视觉分析用的base64, originalName: 原始文件名 }
async function createPreview(imageObj, exifData) {
    const div = document.createElement('div');
    div.className = 'preview-item';
    
    const img = document.createElement('img');
    const file = imageObj.file || imageObj; // 兼容旧格式
    img.src = URL.createObjectURL(file);
    
    const info = document.createElement('div');
    info.className = 'preview-item-info';
    
    const fileSize = (file.size / 1024 / 1024).toFixed(2);
    const displayName = imageObj.originalName || file.name;
    
    info.innerHTML = `
        <p><strong>${displayName}</strong></p>
        <p>压缩后: ${fileSize} MB</p>
        <p>尺寸: ${Math.round(file.width || 0)} x ${Math.round(file.height || 0)}</p>
    `;
    
    div.appendChild(img);
    div.appendChild(info);
    
    // 图片加载完成后设置当前分析图片
    img.onload = function() {
        setCurrentAnalysisImage(img);
    };
    
    // 点击切换当前分析图片
    div.addEventListener('click', function() {
        setCurrentAnalysisImage(img);
        // 清除之前的辅助线
        clearCompositionOverlay();
        hideHistogram();
    });
    
    // 显示 EXIF 信息
    displayExif(exifData);
    
    return div;
}

// 显示 EXIF
function displayExif(exifData) {
    if (!exifData || Object.keys(exifData).length === 0) {
        exifContainer.innerHTML = `
            <div class="exif-placeholder">
                <i class="fas fa-image"></i>
                <p>此图片没有 EXIF 信息</p>
            </div>
        `;
        return;
    }
    
    const formatExposureTime = (time) => {
        if (!time) return '-';
        if (typeof time === 'number') return time < 1 ? `1/${Math.round(1/time)}` : `${time}s`;
        return time;
    };
    
    const formatFNumber = (f) => f ? `f/${f}` : '-';
    const formatFocalLength = (f) => f ? `${Math.round(f)}mm` : '-';
    
    // 检测拍摄类型
    let shootingTypeHint = '';
    if (ruleEngine) {
        const types = ruleEngine.detectShootingType(exifData);
        if (types.length > 0) {
            shootingTypeHint = `
                <div class="shooting-type-hint">
                    <i class="fas fa-camera"></i>
                    检测到可能的拍摄类型：<strong>${types.map(t => t.name).join('、')}</strong>
                </div>
            `;
        }
    }
    
    exifContainer.innerHTML = `
        ${shootingTypeHint}
        <div class="exif-grid">
            <div class="exif-card">
                <h4><i class="fas fa-camera"></i> 相机信息</h4>
                <div class="exif-item">
                    <span class="exif-label">品牌</span>
                    <span class="exif-value">${exifData.Make || '-'}</span>
                </div>
                <div class="exif-item">
                    <span class="exif-label">型号</span>
                    <span class="exif-value">${exifData.Model || '-'}</span>
                </div>
                <div class="exif-item">
                    <span class="exif-label">拍摄时间</span>
                    <span class="exif-value">${exifData.DateTimeOriginal || '-'}</span>
                </div>
                <div class="exif-item">
                    <span class="exif-label">镜头</span>
                    <span class="exif-value">${getLensModel(exifData)}</span>
                </div>
            </div>
            
            <div class="exif-card">
                <h4><i class="fas fa-sliders-h"></i> 拍摄参数</h4>
                <div class="exif-item">
                    <span class="exif-label">光圈</span>
                    <span class="exif-value">${formatFNumber(exifData.FNumber)}</span>
                </div>
                <div class="exif-item">
                    <span class="exif-label">快门</span>
                    <span class="exif-value">${formatExposureTime(exifData.ExposureTime)}</span>
                </div>
                <div class="exif-item">
                    <span class="exif-label">ISO</span>
                    <span class="exif-value">${exifData.ISOSpeedRatings || '-'}</span>
                </div>
                <div class="exif-item">
                    <span class="exif-label">焦距</span>
                    <span class="exif-value">${formatFocalLength(exifData.FocalLength)}</span>
                </div>
                <div class="exif-item">
                    <span class="exif-label">曝光补偿</span>
                    <span class="exif-value">${exifData.ExposureBiasValue !== undefined ? exifData.ExposureBiasValue + ' EV' : '-'}</span>
                </div>
            </div>
            
            <div class="exif-card">
                <h4><i class="fas fa-image"></i> 图像信息</h4>
                <div class="exif-item">
                    <span class="exif-label">宽度</span>
                    <span class="exif-value">${exifData.PixelXDimension || exifData.ImageWidth || '-'} px</span>
                </div>
                <div class="exif-item">
                    <span class="exif-label">高度</span>
                    <span class="exif-value">${exifData.PixelYDimension || exifData.ImageHeight || '-'} px</span>
                </div>
                <div class="exif-item">
                    <span class="exif-label">白平衡</span>
                    <span class="exif-value">${exifData.WhiteBalance === 0 ? '自动' : exifData.WhiteBalance || '-'}</span>
                </div>
                <div class="exif-item">
                    <span class="exif-label">测光模式</span>
                    <span class="exif-value">${getMeteringModeName(exifData.MeteringMode) || '-'}</span>
                </div>
            </div>
        </div>
    `;
}

// 获取测光模式名称
function getMeteringModeName(mode) {
    const modes = {
        0: '未知',
        1: '平均测光',
        2: '中央重点',
        3: '点测光',
        4: '多区测光',
        5: '图案测光',
        6: '部分测光'
    };
    return modes[mode] || mode;
}

// 获取镜头型号（兼容不同厂商）
function getLensModel(exifData) {
    // 尝试不同的字段名
    const possibleFields = [
        'LensModel',
        'LensInfo', 
        'Lens',
        'LensID',
        'LensSerialNumber'
    ];
    
    for (const field of possibleFields) {
        if (exifData[field] && exifData[field] !== 'Unknown') {
            return exifData[field];
        }
    }
    
    // 尝试从其他字段提取
    if (exifData.LensSpecification) {
        return exifData.LensSpecification;
    }
    
    // 如果都没有，尝试组合焦距信息
    const focalLength = exifData.FocalLength;
    const maxAperture = exifData.MaxApertureValue || exifData.FNumber;
    if (focalLength) {
        let lensDesc = `${Math.round(focalLength)}mm`;
        if (maxAperture) {
            lensDesc += ` f/${maxAperture}`;
        }
        return lensDesc + ' (焦距信息)';
    }
    
    return '-';
}

// AI 分析图片
async function analyzeImages() {
    if (compressedImages.length === 0 || !currentExifData) {
        alert('请先上传照片');
        return;
    }
    
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="loading"></span> 分析中...';
    
    try {
        let analysisResult;
        let analysisType = 'ruleengine';
        
        console.log('开始分析，EXIF数据:', currentExifData);
        
        // 检查用户AI配置
        const aiConfig = typeof AIConfig !== 'undefined' ? AIConfig.getConfig() : null;
        const useAI = aiConfig && aiConfig.provider !== 'ruleengine' && window.aiManager;
        
        if (useAI) {
            // 使用AI管理器（规则引擎 + AI 融合）
            try {
                const imageObj = compressedImages[0];
                const imageInfo = {
                    fileName: imageObj.originalName || uploadedImages[0]?.name || '未知文件',
                    fileSize: imageObj.file?.size || uploadedImages[0]?.size || 0
                };
                
                // 获取用于视觉分析的base64
                const imageBase64 = imageObj.base64 || null;
                
                console.log('[分析] 调用 AI 管理器...', imageBase64 ? '（带视觉分析）' : '（纯文本分析）');
                const aiResult = await window.aiManager.analyze(imageInfo, currentExifData, imageBase64);
                
                // AI管理器在融合模式下返回 { success, type, content, ruleEngineData }
                // 在规则引擎兜底时返回 { summary, ... } 结构化数据
                if (aiResult && aiResult.success && aiResult.content) {
                    // AI 融合成功：content 是 Markdown 文本
                    console.log('[分析] AI 融合分析成功，类型:', aiResult.type);
                    analysisType = aiResult.type || 'qwen_fused';
                    generateAIReport(aiResult);
                } else if (aiResult && aiResult.summary) {
                    // 规则引擎兜底：结构化数据
                    console.log('[分析] 使用规则引擎结果（AI 不可用）');
                    analysisResult = aiResult;
                    analysisType = 'ruleengine';
                    generateAnalysisReport(analysisResult, analysisType);
                } else {
                    throw new Error('AI 分析返回无效结果');
                }
            } catch (aiError) {
                console.warn('[分析] AI 分析失败，回退到规则引擎:', aiError.message);
                // 回退到规则引擎
                if (ruleEngine && typeof ruleEngine.fullAnalysis === 'function') {
                    analysisResult = ruleEngine.fullAnalysis(currentExifData);
                    if (!analysisResult || !analysisResult.summary) throw new Error('规则引擎分析失败');
                    generateAnalysisReport(analysisResult, 'ruleengine');
                } else {
                    throw new Error('规则引擎不可用');
                }
            }
        } else {
            // 纯规则引擎模式
            console.log('[分析] 使用规则引擎分析');
            if (ruleEngine && typeof ruleEngine.fullAnalysis === 'function') {
                try {
                    analysisResult = ruleEngine.fullAnalysis(currentExifData);
                    console.log('[分析] 规则引擎结果:', analysisResult);
                    if (!analysisResult || !analysisResult.summary) throw new Error('规则引擎返回无效结果');
                    generateAnalysisReport(analysisResult, 'ruleengine');
                } catch (engineError) {
                    console.error('[分析] 规则引擎执行失败:', engineError);
                    throw new Error('规则引擎分析失败: ' + engineError.message);
                }
            } else {
                throw new Error('规则引擎不可用');
            }
        }
        
        // 确保 analysisSection 存在
        if (analysisSection) {
            analysisSection.style.display = 'block';
            analysisSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('analysisSection 元素不存在，尝试直接获取');
            const section = document.getElementById('analysis');
            if (section) {
                section.style.display = 'block';
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
    } catch (error) {
        console.error('分析失败:', error);
        alert('分析过程中出现错误: ' + error.message);
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-magic"></i> AI 分析';
    }
}

// 批量分析图片
async function batchAnalyzeImages() {
    if (compressedImages.length <= 1) {
        showWarningToast('批量分析需要上传2张或以上照片', '照片不足');
        return;
    }

    // 设置按钮加载状态
    const batchBtn = document.getElementById('batchAnalyzeBtn');
    setButtonLoading(batchBtn, true);

    // 显示加载遮罩
    showLoading('正在批量分析...', 0);

    try {
        // 收集所有图片的分析结果
        const batchResults = [];
        let totalScore = 0;

        // 遍历所有已上传的图片
        for (let i = 0; i < compressedImages.length; i++) {
            // 更新进度
            const progress = Math.round((i / compressedImages.length) * 80);
            updateLoadingProgress(progress, `正在分析第 ${i + 1}/${compressedImages.length} 张...`);

            const imageObj = compressedImages[i];
            const file = imageObj.file || imageObj; // 兼容旧格式

            // 尝试读取每张图片的 EXIF
            const exifData = await readExif(file);

            // 使用规则引擎分析
            let analysisResult;
            if (ruleEngine && typeof ruleEngine.fullAnalysis === 'function') {
                try {
                    analysisResult = ruleEngine.fullAnalysis(exifData);
                } catch (e) {
                    analysisResult = generateBasicAnalysis();
                }
            } else {
                analysisResult = generateBasicAnalysis();
            }

            batchResults.push({
                index: i + 1,
                fileName: imageObj.originalName || file.name,
                exifData: exifData,
                result: analysisResult
            });

            totalScore += analysisResult?.summary?.score || 70;
        }

        // 计算平均分
        const avgScore = Math.round(totalScore / batchResults.length);

        // 更新进度
        updateLoadingProgress(90, '正在生成报告...');

        // 生成批量分析报告
        generateBatchAnalysisReport(batchResults, avgScore);

        // 滚动到结果区域
        const section = analysisSection || document.getElementById('analysis');
        if (section) {
            section.style.display = 'block';
            section.scrollIntoView({ behavior: 'smooth' });
        }

        // 成功提示
        showSuccessToast(`批量分析完成，共分析 ${batchResults.length} 张照片`, '分析完成');

    } catch (error) {
        console.error('批量分析失败:', error);
        showErrorToast('批量分析过程中出现错误: ' + error.message, '分析失败');
    } finally {
        // 隐藏加载状态
        hideLoading();
        setButtonLoading(batchBtn, false);
    }
}

// 生成批量分析报告
function generateBatchAnalysisReport(results, avgScore) {
    if (!analysisContent) {
        console.error('analysisContent 元素不存在');
        return;
    }
    
    let html = `
        <div class="batch-analysis-header">
            <h3><i class="fas fa-images"></i> 批量分析报告</h3>
            <p>共分析 ${results.length} 张照片</p>
        </div>
        
        <div class="batch-summary">
            <div class="summary-card overall">
                <div class="summary-icon"><i class="fas fa-chart-line"></i></div>
                <div class="summary-info">
                    <h4>综合评分</h4>
                    <div class="score-display">${avgScore}</div>
                    <p>${getScoreLevel(avgScore)}</p>
                </div>
            </div>
        </div>
        
        <div class="batch-results-grid">
    `;
    
    // 每张照片的分析结果
    results.forEach(item => {
        const score = item.result?.summary?.score || 70;
        const level = getScoreLevel(score);
        
        html += `
            <div class="batch-result-item">
                <div class="batch-item-header">
                    <span class="batch-item-number">#${item.index}</span>
                    <span class="batch-item-score ${getScoreClass(score)}">${score}分</span>
                </div>
                <div class="batch-item-name">${item.fileName}</div>
                <div class="batch-item-type">${item.result?.summary?.detectedType || '通用摄影'}</div>
                <div class="batch-item-suggestions">
                    <strong>改进建议：</strong>
                    <ul>
                        ${(item.result?.suggestions || []).slice(0, 3).map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    // 添加总体建议
    html += `
        <div class="batch-advice">
            <h4><i class="fas fa-lightbulb"></i> 总体改进建议</h4>
            <ul>
                ${getBatchAdvice(results, avgScore)}
            </ul>
        </div>
    `;
    
    analysisContent.innerHTML = html;
}

// 获取分数等级
function getScoreLevel(score) {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 70) return '中等';
    if (score >= 60) return '及格';
    return '需改进';
}

// 获取分数样式类
function getScoreClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-mid';
    return 'score-low';
}

// 获取批量分析总体建议
function getBatchAdvice(results, avgScore) {
    const advice = [];
    
    if (avgScore < 70) {
        advice.push('整体评分偏低，建议多关注光线和构图');
    }
    
    // 检查是否有共同问题
    const isoIssues = results.filter(r => (r.exifData?.ISOSpeedRatings || 0) > 3200).length;
    if (isoIssues > results.length / 2) {
        advice.push('多张照片ISO过高，建议注意光线条件或使用三脚架');
    }
    
    // 检查焦段分布
    const focalLengths = results.map(r => parseFloat(r.exifData?.FocalLength) || 50);
    const hasWide = focalLengths.some(f => f < 35);
    const hasTele = focalLengths.some(f => f > 100);
    
    if (!hasWide && !hasTele) {
        advice.push('可以尝试更多样的焦段，丰富拍摄视角');
    }
    
    if (advice.length === 0) {
        advice.push('拍摄水平稳定，继续保持！');
    }
    
    return advice.map(a => `<li>${a}</li>`).join('');
}

// 生成 AI 融合报告（Markdown 文本展示）
function generateAIReport(aiResult) {
    if (!analysisContent) {
        console.error('analysisContent 元素不存在');
        return;
    }

    // 判断是否是视觉分析
    const isVisionAnalysis = aiResult.type === 'qwen-vision';
    const typeLabel = isVisionAnalysis 
        ? '👁️ AI 视觉分析' 
        : (window.aiManager ? window.aiManager.getAnalysisTypeDescription(aiResult.type) : '🤖 AI 分析');

    // 将 Markdown 转成简单 HTML
    function md2html(text) {
        if (!text) return '';
        return text
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
            .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>')
            .replace(/<\/ul>\s*<ul>/g, '')
            .replace(/\n{2,}/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }

    // 如果有规则引擎数据，把规则引擎的分数信息也显示出来
    const ruleData = aiResult.ruleEngineData;
    let scoreHtml = '';
    if (ruleData && ruleData.summary) {
        const score = ruleData.summary.score || 70;
        scoreHtml = `
            <div class="overall-score">
                <span class="score-number" style="color: ${getScoreColor(score / 10)}">${score}</span>
                <span class="score-label">分</span>
            </div>`;
    }

    analysisContent.innerHTML = `
        <div class="analysis-card summary-card">
            <div class="summary-header">
                <div class="header-left">
                    <h3><i class="fas fa-robot"></i> ${isVisionAnalysis ? 'AI 视觉分析报告' : 'AI 融合分析报告'}</h3>
                    <span class="analysis-type-badge">${typeLabel}</span>
                    ${isVisionAnalysis ? `<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 6px 12px; border-radius: 15px; font-size: 0.8rem; margin-top: 8px; display: inline-block;"><i class="fas fa-eye"></i> AI 已直接观察照片</div>` : ''}
                </div>
                ${scoreHtml}
            </div>
        </div>

        <div class="analysis-card ai-report-card">
            <div class="ai-report-content">
                <p>${md2html(aiResult.content)}</p>
            </div>
        </div>

        ${ruleData && ruleData.exifAnalysis ? `
        <div class="analysis-card">
            <h3><i class="fas fa-search"></i> 规则引擎技术诊断</h3>
            <ul class="issue-list">
                ${(ruleData.exifAnalysis.allIssues || []).length > 0
                    ? (ruleData.exifAnalysis.allIssues || []).map(issue =>
                        `<li><i class="fas fa-exclamation-triangle"></i> ${issue}</li>`).join('')
                    : '<li><i class="fas fa-check-circle" style="color: var(--success-color)"></i> 技术参数设置合理，未发现明显问题</li>'
                }
            </ul>
        </div>` : ''}

        <div class="analysis-card">
            <h3><i class="fas fa-palette"></i> 后期调色与修图建议</h3>
            <div class="postprocess-analysis-content">
                ${generatePostProcessingForAnalysis(currentExifData, ruleData?.summary || {}, ruleData?.shootingPlan || {})}
            </div>
        </div>

        <div class="analysis-card">
            <h3><i class="fas fa-tasks"></i> 进阶练习</h3>
            <ul class="task-list">
                <li><i class="fas fa-check-square"></i> <strong>本周挑战：</strong>用 f/2.8、f/5.6、f/11 三个光圈拍摄同一主体，对比景深效果</li>
                <li><i class="fas fa-check-square"></i> <strong>光线练习：</strong>在黄金时刻（日落前1小时）拍摄，观察侧光对主体轮廓的塑造</li>
                <li><i class="fas fa-check-square"></i> <strong>技术强化：</strong>复习曝光三角相关知识，理解原理而非死记参数</li>
            </ul>
        </div>
    `;

    // 保存到历史记录
    saveAnalysisHistory({
        fileName: currentExifData?.FileName || '未知文件',
        exifData: currentExifData,
        result: ruleData || { summary: { score: 70, level: 'AI分析', message: aiResult.content?.substring(0, 100) } },
        score: ruleData?.summary?.score || 70,
        type: isVisionAnalysis ? 'AI视觉分析' : 'AI融合分析',
        timestamp: new Date().toISOString()
    });

    loadAnalysisHistory();
}

// 生成分析报告（基于规则引擎）
function generateAnalysisReport(result, analysisType = 'ruleengine') {
    // 确保 DOM 元素存在
    if (!analysisContent) {
        console.error('analysisContent 元素不存在');
        return;
    }
    
    // 确保结果结构完整
    const summary = result?.summary || { score: 70, level: '良好', message: '分析完成', detectedType: '通用摄影', confidence: 50 };
    const exifAnalysis = result?.exifAnalysis || { categories: {}, allIssues: [], allSuggestions: [], technicalDetails: {} };
    const shootingPlan = result?.shootingPlan || {};
    const improvements = result?.improvements || ['多练习构图', '注意光线运用'];
    const technicalDetails = exifAnalysis.technicalDetails || {};
    
    // 生成评分卡片（带图标）
    let categoryCards = '';
    if (exifAnalysis.categories && Object.keys(exifAnalysis.categories).length > 0) {
        categoryCards = Object.entries(exifAnalysis.categories).map(([key, cat]) => `
            <div class="score-item">
                <span class="score-name"><i class="fas ${cat?.icon || 'fa-circle'}"></i> ${cat?.name || key}</span>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${(cat?.score || 5) * 10}%; background: ${getScoreColor(cat?.score || 5)}"></div>
                </div>
                <span class="score-value">${cat?.score || 5}/10</span>
            </div>
        `).join('');
    } else {
        categoryCards = `
            <div class="score-item">
                <span class="score-name"><i class="fas fa-cogs"></i> 技术执行</span>
                <div class="score-bar">
                    <div class="score-fill" style="width: 70%; background: ${getScoreColor(7)}"></div>
                </div>
                <span class="score-value">7/10</span>
            </div>
        `;
    }
    
    // 生成技术详情
    let technicalDetailsHtml = '';
    if (technicalDetails.exposure) {
        const exp = technicalDetails.exposure;
        technicalDetailsHtml += `
            <div class="tech-detail-section">
                <h5><i class="fas fa-sun"></i> 曝光参数</h5>
                <div class="tech-params">
                    <span class="tech-param">ISO ${exp.iso}</span>
                    <span class="tech-param">f/${exp.aperture}</span>
                    <span class="tech-param">${exp.shutter}</span>
                </div>
                <p class="tech-note">${exp.exposureTriangle}</p>
            </div>
        `;
    }
    if (technicalDetails.depthOfField) {
        const dof = technicalDetails.depthOfField;
        technicalDetailsHtml += `
            <div class="tech-detail-section">
                <h5><i class="fas fa-bullseye"></i> 景深信息</h5>
                <p class="tech-note">超焦距: ${dof.hyperfocal} | 当前焦段: ${dof.focalLength}mm</p>
            </div>
        `;
    }
    if (technicalDetails.focalLength) {
        const fl = technicalDetails.focalLength;
        technicalDetailsHtml += `
            <div class="tech-detail-section">
                <h5><i class="fas fa-ruler-horizontal"></i> 焦段分析</h5>
                <span class="tech-param">${fl.focalLength}mm</span>
                <span class="tech-param">${fl.category}</span>
            </div>
        `;
    }
    
    // 生成问题列表
    const allIssues = exifAnalysis?.allIssues || [];
    const issuesList = allIssues.length > 0 
        ? allIssues.map(issue => `<li><i class="fas fa-exclamation-triangle"></i> ${issue}</li>`).join('')
        : '<li><i class="fas fa-check-circle" style="color: var(--success-color)"></i> 技术参数设置合理，未发现明显问题</li>';
    
    // 生成改进建议
    const suggestionsList = improvements && improvements.length > 0
        ? improvements.map(s => `<li><i class="fas fa-lightbulb"></i> ${s}</li>`).join('')
        : '<li><i class="fas fa-lightbulb"></i> 继续练习，多拍多思考</li>';
    
    // 生成拍摄方案
    const planHtml = generatePlanHtml(shootingPlan);
    
    const detectedType = summary?.detectedType || '通用摄影';
    const firstCategory = exifAnalysis?.categories && Object.values(exifAnalysis.categories).length > 0 
        ? Object.values(exifAnalysis.categories)[0]?.name 
        : '构图';
    
    // 获取分析类型标签文本
    const typeLabel = window.aiManager ? window.aiManager.getAnalysisTypeDescription(analysisType) : '📊 分析完成';
    
    analysisContent.innerHTML = `
        <div class="analysis-card summary-card">
            <div class="summary-header">
                <div class="header-left">
                    <h3><i class="fas fa-chart-pie"></i> 专业分析报告</h3>
                    <span class="analysis-type-badge">${typeLabel}</span>
                </div>
                <div class="overall-score">
                    <span class="score-number" style="color: ${getScoreColor((summary?.score || 70) / 10)}">${summary?.score || 70}</span>
                    <span class="score-label">分</span>
                </div>
            </div>
            <p class="summary-text">
                <strong>${summary?.level || '良好'}</strong> - ${summary?.message || '分析完成'}
                <br>检测拍摄类型：<span class="type-tag"><i class="fas ${result?.primaryType?.icon || 'fa-camera'}"></i> ${detectedType}</span>（置信度 ${summary?.confidence || 50}%）
            </p>
            <div class="score-breakdown">
                ${categoryCards}
            </div>
        </div>
        
        ${technicalDetailsHtml ? `
        <div class="analysis-card tech-details-card">
            <h3><i class="fas fa-microscope"></i> 技术参数详情</h3>
            ${technicalDetailsHtml}
        </div>
        ` : ''}
        
        <div class="analysis-card">
            <h3><i class="fas fa-search"></i> 技术诊断</h3>
            <ul class="issue-list">
                ${issuesList}
            </ul>
        </div>
        
        <div class="analysis-card">
            <h3><i class="fas fa-graduation-cap"></i> 专业建议</h3>
            <ul class="suggestion-list">
                ${suggestionsList}
            </ul>
        </div>
        
        <div class="analysis-card plan-card">
            <h3><i class="fas ${shootingPlan?.icon || 'fa-clipboard-list'}"></i> ${shootingPlan?.title || '拍摄方案'} 
                ${shootingPlan?.difficulty ? `<span class="difficulty-badge">${shootingPlan.difficulty}</span>` : ''}
            </h3>
            ${planHtml}
        </div>
        
        <div class="analysis-card">
            <h3><i class="fas fa-palette"></i> 后期调色与修图建议</h3>
            <div class="postprocess-analysis-content">
                ${generatePostProcessingForAnalysis(currentExifData, summary, shootingPlan)}
            </div>
        </div>
        
        <div class="analysis-card">
            <h3><i class="fas fa-tasks"></i> 进阶练习</h3>
            <ul class="task-list">
                <li><i class="fas fa-check-square"></i> <strong>本周挑战：</strong>用 f/2.8、f/5.6、f/11 三个光圈拍摄同一主体，对比景深效果</li>
                <li><i class="fas fa-check-square"></i> <strong>光线练习：</strong>${detectedType.includes('人像') ? '在黄金时刻（日落前1小时）拍摄人像，观察侧光对面部轮廓的塑造' : '在蓝调时刻（日落后20分钟）拍摄风光，捕捉冷暖色调对比'}</li>
                <li><i class="fas fa-check-square"></i> <strong>技术强化：</strong>复习${firstCategory}相关知识，理解原理而非死记参数</li>
            </ul>
        </div>
    `;
    
    // 保存到历史记录
    saveAnalysisHistory({
        fileName: currentExifData?.FileName || '未知文件',
        exifData: currentExifData,
        result: result,
        score: summary?.score || 70,
        type: detectedType,
        timestamp: new Date().toISOString()
    });
    
    // 刷新历史记录显示
    loadAnalysisHistory();
}

// 基于分析结果生成后期调色与修图建议
function generatePostProcessingForAnalysis(exifData, summary, shootingPlan) {
    const iso = exifData.iso ? parseInt(exifData.iso) : null;
    const aperture = exifData.aperture ? parseFloat(exifData.aperture) : null;
    const shutter = exifData.shutterSpeed || '';
    const wb = exifData.whiteBalance || '';
    const format = exifData.fileFormat || 'JPEG';
    const detectedType = summary?.detectedType || '通用摄影';
    const ev = exifData.exposureValue;

    // 1. 基础调整建议（基于曝光参数）
    let basicSteps = [];
    
    if (ev !== undefined && ev !== null) {
        if (ev < -1) {
            basicSteps.push('<i class="fas fa-arrow-up" style="color:#f59e0b"></i> <strong>曝光补偿：</strong>照片偏暗，适当提亮 +0.3~0.7EV，注意保留暗部细节');
        } else if (ev > 1) {
            basicSteps.push('<i class="fas fa-arrow-down" style="color:#3b82f6"></i> <strong>曝光补偿：</strong>照片偏亮，适当压暗 -0.3~0.5EV，恢复高光层次');
        } else {
            basicSteps.push('<i class="fas fa-check" style="color:#10b981"></i> <strong>曝光基础：</strong>曝光基本准确，做微调即可');
        }
    }

    if (format === 'JPEG') {
        basicSteps.push('<i class="fas fa-exclamation-circle" style="color:#ef4444"></i> <strong>格式提醒：</strong>JPEG 格式后期空间有限，建议后续使用 RAW 拍摄');
    } else if (format === 'RAW') {
        basicSteps.push('<i class="fas fa-check-circle" style="color:#10b981"></i> <strong>RAW 格式：</strong>拥有完整后期空间，白平衡和曝光可无损调整');
    }

    // 2. 调色建议（基于拍摄类型）
    let colorGrading = [];
    
    if (detectedType.includes('人像')) {
        colorGrading.push('<strong>肤色优化：</strong>HSL 面板中调整橙色色相（+5~10）和饱和度（-5~10），让肤色更自然通透');
        colorGrading.push('<strong>色调分离：</strong>高光偏暖（黄/橙 +5），阴影偏冷（蓝 +3），营造层次感');
        colorGrading.push('<strong>氛围感：</strong>降低整体清晰度（-5~10）+ 适当添加暗角，突出人物主体');
    } else if (detectedType.includes('风光') || detectedType.includes('街拍')) {
        colorGrading.push('<strong>色彩增强：</strong>适当提升清晰度（+10~20）和去朦胧（+10~15），增加画面通透感');
        colorGrading.push('<strong>色调分离：</strong>高光偏暖色调，阴影偏冷色调（经典胶片感）');
        colorGrading.push('<strong>渐变滤镜：</strong>天空区域用渐变滤镜压暗 0.5~1 档，增强戏剧性');
    } else if (detectedType.includes('汉服') || detectedType.includes('古风')) {
        colorGrading.push('<strong>整体色调：</strong>推荐两种方向 — 淡雅清新（低饱和、高明度）或浓墨重彩（高对比、暖色调）');
        colorGrading.push('<strong>色彩统一：</strong>HSL 中统一主色调，避免色彩杂乱');
        colorGrading.push('<strong>柔光效果：</strong>适当降低清晰度 + 高光提亮，营造柔和氛围');
    } else if (detectedType.includes('星空') || detectedType.includes('银河')) {
        colorGrading.push('<strong>银河色彩：</strong>色温偏冷（蓝调 4000~4500K），增强星空的蓝紫色调');
        colorGrading.push('<strong>对比度：</strong>适当提升对比度（+15~25），让星星更突出');
        colorGrading.push('<strong>降噪优先：</strong>先降噪再锐化，避免噪点被放大');
    } else {
        colorGrading.push('<strong>基础调色：</strong>先校正白平衡，再微调色温/色调');
        colorGrading.push('<strong>色彩分离：</strong>尝试高光偏暖、阴影偏冷的经典搭配');
        colorGrading.push('<strong>适当去朦胧：</strong>提升画面通透感（+10左右）');
    }

    // 3. 修图建议（基于ISO和参数）
    let retouchTips = [];
    
    if (iso !== null && iso > 1600) {
        retouchTips.push('<i class="fas fa-volume-down" style="color:#ef4444"></i> <strong>降噪处理：</strong>ISO ' + iso + ' 较高，建议使用 AI 降噪（Lightroom AI 降噪 / Topaz DeNoise）， luminance 降噪 20~40');
    } else if (iso !== null && iso > 800) {
        retouchTips.push('<i class="fas fa-info-circle" style="color:#f59e0b"></i> <strong>轻度降噪：</strong>ISO ' + iso + ' 轻微噪点，Luminance 降噪 10~20 即可');
    }

    if (aperture !== null && aperture <= 2) {
        retouchTips.push('<i class="fas fa-bullseye" style="color:#3b82f6"></i> <strong>景深优化：</strong>大光圈 f/' + aperture + ' 可能边缘画质下降，适当收缩 1 档或使用镜头校正');
    }

    if (detectedType.includes('人像')) {
        retouchTips.push('<i class="fas fa-user" style="color:#8b5cf6"></i> <strong>人像精修：</strong>适度磨皮（保留皮肤纹理）+ 眼睛提亮 + 液体矫正形体');
    }

    retouchTips.push('<i class="fas fa-expand" style="color:#10b981"></i> <strong>锐化输出：</strong>导出时适当锐化（量 40~60，半径 1.0），针对屏幕/打印选择对应分辨率');

    // 4. 如果规则引擎有 postProcessing 数据，也整合进来
    let engineTips = '';
    if (shootingPlan && shootingPlan.postProcessing && shootingPlan.postProcessing.length > 0) {
        engineTips = `
            <div class="pp-section">
                <h5><i class="fas fa-cogs"></i> 场景化后期要点</h5>
                <ul class="pp-tip-list">
                    ${shootingPlan.postProcessing.map(t => `<li>${t}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    return `
        <div class="pp-section">
            <h5><i class="fas fa-sliders-h"></i> 基础调整</h5>
            <ul class="pp-step-list">
                ${basicSteps.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>

        <div class="pp-section">
            <h5><i class="fas fa-palette"></i> 调色建议</h5>
            <ul class="pp-step-list">
                ${colorGrading.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>

        <div class="pp-section">
            <h5><i class="fas fa-magic"></i> 修图技巧</h5>
            <ul class="pp-step-list">
                ${retouchTips.map(s => `<li>${s}</li>`).join('')}
            </ul>
        </div>

        ${engineTips}
    `;
}

// 生成拍摄方案 HTML
function generatePlanHtml(plan) {
    if (!plan || (!plan.equipment && !plan.settings)) {
        return '<p>暂无特定拍摄方案，建议参考知识库相关内容。</p>';
    }
    
    let html = '';
    
    // 适用场景
    if (plan.scenarios) {
        html += `
            <div class="plan-section">
                <h4><i class="fas fa-list"></i> 适用场景</h4>
                <div class="scenario-tags">
                    ${plan.scenarios.map(s => `<span class="scenario-tag">${s}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    // 器材
    if (plan.equipment) {
        html += `
            <div class="plan-section">
                <h4><i class="fas fa-camera"></i> 推荐器材</h4>
                <ul class="plan-list">
                    <li><strong>相机：</strong>${plan.equipment.camera}</li>
                    <li><strong>镜头：</strong>${plan.equipment.lens}</li>
                    ${plan.equipment.accessories ? `<li><strong>配件：</strong>${Array.isArray(plan.equipment.accessories) ? plan.equipment.accessories.join('、') : plan.equipment.accessories}</li>` : ''}
                </ul>
            </div>
        `;
    }
    
    // 设置
    if (plan.settings) {
        html += `
            <div class="plan-section">
                <h4><i class="fas fa-cog"></i> 相机设置</h4>
                <ul class="plan-list settings-list">
                    ${plan.settings.mode ? `<li><span class="setting-label">模式</span><span class="setting-value">${plan.settings.mode}</span></li>` : ''}
                    ${plan.settings.aperture ? `<li><span class="setting-label">光圈</span><span class="setting-value">${plan.settings.aperture}</span></li>` : ''}
                    ${plan.settings.iso ? `<li><span class="setting-label">ISO</span><span class="setting-value">${plan.settings.iso}</span></li>` : ''}
                    ${plan.settings.shutter ? `<li><span class="setting-label">快门</span><span class="setting-value">${plan.settings.shutter}</span></li>` : ''}
                    ${plan.settings.focus ? `<li><span class="setting-label">对焦</span><span class="setting-value">${plan.settings.focus}</span></li>` : ''}
                    ${plan.settings.metering ? `<li><span class="setting-label">测光</span><span class="setting-value">${plan.settings.metering}</span></li>` : ''}
                    ${plan.settings.wb ? `<li><span class="setting-label">白平衡</span><span class="setting-value">${plan.settings.wb}</span></li>` : ''}
                    ${plan.settings.format ? `<li><span class="setting-label">格式</span><span class="setting-value">${plan.settings.format}</span></li>` : ''}
                </ul>
            </div>
        `;
    }
    
    // 光线/时机
    if (plan.lighting || plan.timing) {
        const items = plan.lighting || plan.timing;
        html += `
            <div class="plan-section">
                <h4><i class="fas fa-sun"></i> 光线与时机</h4>
                <div class="lighting-grid">
                    ${items.map(item => `
                        <div class="lighting-item">
                            <strong>${item.type || item.time}</strong>
                            <p>${item.description}</p>
                            ${item.tips ? `<ul class="lighting-tips">${item.tips.map(t => `<li>${t}</li>`).join('')}</ul>` : ''}
                            ${item.settings ? `<code>${item.settings}</code>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // 姿势/构图
    if (plan.poses) {
        html += `
            <div class="plan-section">
                <h4><i class="fas fa-female"></i> 摆姿指导</h4>
                <div class="poses-grid">
                    ${plan.poses.map((pose, idx) => `
                        <div class="pose-item">
                            <span class="pose-number">${idx + 1}</span>
                            <strong>${pose.name || pose}</strong>
                            ${pose.desc ? `<p>${pose.desc}</p>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    if (plan.composition) {
        html += `
            <div class="plan-section">
                <h4><i class="fas fa-th-large"></i> 构图要点</h4>
                <ul class="plan-list">
                    ${plan.composition.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // 技巧
    if (plan.tips) {
        html += `
            <div class="plan-section">
                <h4><i class="fas fa-lightbulb"></i> 专业技巧</h4>
                <ul class="tip-list">
                    ${plan.tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // 常见错误
    if (plan.commonMistakes) {
        html += `
            <div class="plan-section mistakes-section">
                <h4><i class="fas fa-exclamation-circle"></i> 常见错误避免</h4>
                <ul class="mistake-list">
                    ${plan.commonMistakes.map(m => `<li>${m}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    return html;
}

// 获取分数颜色
function getScoreColor(score) {
    if (score >= 8) return '#22c55e'; // 绿色
    if (score >= 6) return '#eab308'; // 黄色
    if (score >= 4) return '#f97316'; // 橙色
    return '#ef4444'; // 红色
}

// 基础分析（无规则引擎时的回退）
function generateBasicAnalysis() {
    const scores = {
        composition: Math.floor(Math.random() * 3) + 7,
        lighting: Math.floor(Math.random() * 3) + 7,
        color: Math.floor(Math.random() * 3) + 7,
        technical: Math.floor(Math.random() * 3) + 7,
        emotion: Math.floor(Math.random() * 3) + 7
    };
    
    const average = Math.round((scores.composition + scores.lighting + scores.color + scores.technical + scores.emotion) / 5);
    
    return {
        summary: {
            score: average * 10,
            level: average >= 8 ? '优秀' : '良好',
            message: '基础分析完成',
            detectedType: '通用摄影',
            confidence: 50
        },
        exifAnalysis: {
            categories: {
                composition: { name: '构图', score: scores.composition, issues: [], suggestions: [] },
                lighting: { name: '光影', score: scores.lighting, issues: [], suggestions: [] },
                technical: { name: '技术', score: scores.technical, issues: [], suggestions: [] }
            },
            allIssues: [],
            allSuggestions: ['建议参考知识库学习相关技巧']
        },
        shootingPlan: { title: '通用拍摄方案' },
        improvements: ['多练习构图', '注意光线运用', '掌握曝光三要素']
    };
}

// 清除图片
function clearImages() {
    compressedImages = [];
    currentExifData = null;
    window.currentImageData = null;
    window.currentImageElement = null;
    currentImageData = null;
    currentImageElement = null;
    if (previewGrid) previewGrid.innerHTML = '';
    const pSection = previewSection || document.getElementById('previewSection');
    const aSection = analysisSection || document.getElementById('analysis');
    const toolsSection = document.getElementById('analysis-tools');
    if (pSection) pSection.style.display = 'none';
    if (aSection) aSection.style.display = 'none';
    if (toolsSection) toolsSection.style.display = 'none';
    exifContainer.innerHTML = `
        <div class="exif-placeholder">
            <i class="fas fa-image"></i>
            <p>上传照片后查看 EXIF 信息</p>
        </div>
    `;
    fileInput.value = '';
    
    // 清除辅助线和直方图
    clearCompositionOverlay();
    hideHistogram();
}

// 显示知识
function showKnowledge(topic) {
    console.log('showKnowledge 被调用:', topic);
    console.log('KnowledgeBase 是否存在:', typeof KnowledgeBase !== 'undefined');
    console.log('KnowledgeBase[topic] 是否存在:', typeof KnowledgeBase !== 'undefined' && !!KnowledgeBase[topic]);
    
    if (typeof KnowledgeBase !== 'undefined' && KnowledgeBase[topic]) {
        const knowledge = KnowledgeBase[topic];
        console.log('找到知识库内容:', knowledge.title);
        modalTitle.innerHTML = `<i class="fas ${knowledge.icon || 'fa-book'}"></i> ${knowledge.title}`;
        modalBody.innerHTML = knowledge.content;
        
        // 添加额外信息
        if (knowledge.tips) {
            modalBody.innerHTML += `
                <div class="knowledge-tips">
                    <h4><i class="fas fa-lightbulb"></i> 实用技巧</h4>
                    <ul>
                        ${knowledge.tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    } else {
        console.log('未找到知识库内容:', topic);
        if (typeof KnowledgeBase === 'undefined') {
            console.error('KnowledgeBase 未定义，请检查 knowledge-base.js 是否正确加载');
        } else {
            console.log('KnowledgeBase 中定义的主题:', Object.keys(KnowledgeBase));
        }
        modalTitle.textContent = '开发中';
        modalBody.innerHTML = `
            <div class="knowledge-placeholder">
                <i class="fas fa-tools"></i>
                <p>该专题内容正在整理中，敬请期待...</p>
                <p class="hint">当前可用专题：构图法则、光线运用、人像基础、风光摄影等</p>
            </div>
        `;
    }
    
    const modal = knowledgeModal || document.getElementById('knowledgeModal');
    if (modal) {
        modal.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal() {
    const modal = knowledgeModal || document.getElementById('knowledgeModal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = '';
}

// 点击模态框外部关闭
document.addEventListener('DOMContentLoaded', () => {
    if (knowledgeModal) {
        knowledgeModal.addEventListener('click', (e) => {
            if (e.target === knowledgeModal) {
                closeModal();
            }
        });
    }
});

// ESC 键关闭模态框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && knowledgeModal && knowledgeModal.classList.contains('active')) {
        closeModal();
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 导航栏滚动效果 - 已由 nav-component.js 处理，使用 requestAnimationFrame 优化
// 如需添加额外的滚动效果，请在 nav-component.js 的 updateNavbar 函数中添加

// ==================== AI 配置管理 ====================

// AI 配置存储键
const AI_CONFIG_KEY = 'photo_monster_ai_config';

// 默认 AI 配置
const DEFAULT_AI_CONFIG = {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-4-vision-preview',
    enabled: false,
    local: {
        baseUrl: 'http://localhost:11434',
        lmStudioUrl: 'http://localhost:1234',
        customUrl: 'http://localhost:8000'
    },
    options: {
        temperature: 0.7,
        maxTokens: 2048
    }
};

// 初始化 AI 配置
function initAIConfig() {
    loadAIConfig();
    initAIConfigListeners();
}

// 加载 AI 配置
function loadAIConfig() {
    try {
        const saved = localStorage.getItem(AI_CONFIG_KEY);
        const config = saved ? JSON.parse(saved) : DEFAULT_AI_CONFIG;
        
        // 检查是否在AI配置页面（元素是否存在）
        const aiProvider = document.getElementById('aiProvider');
        if (!aiProvider) {
            console.log('不在AI配置页面，跳过配置加载');
            return;
        }
        
        // 应用配置到表单
        aiProvider.value = config.provider;
        
        const openaiKey = document.getElementById('openaiKey');
        if (openaiKey) openaiKey.value = config.apiKey || '';
        
        const openaiModel = document.getElementById('openaiModel');
        if (openaiModel) openaiModel.value = config.model || 'gpt-4-vision-preview';
        
        const ollamaUrl = document.getElementById('ollamaUrl');
        if (ollamaUrl) ollamaUrl.value = config.local?.baseUrl || 'http://localhost:11434';
        
        const ollamaModel = document.getElementById('ollamaModel');
        if (ollamaModel) ollamaModel.value = config.model || 'llava';
        
        const lmstudioUrl = document.getElementById('lmstudioUrl');
        if (lmstudioUrl) lmstudioUrl.value = config.local?.lmStudioUrl || 'http://localhost:1234';
        
        const lmstudioModel = document.getElementById('lmstudioModel');
        if (lmstudioModel) lmstudioModel.value = config.model || 'local-model';
        
        const customUrl = document.getElementById('customUrl');
        if (customUrl) customUrl.value = config.local?.customUrl || 'http://localhost:8000';
        
        const customKey = document.getElementById('customKey');
        if (customKey) customKey.value = config.apiKey || '';
        
        const customModel = document.getElementById('customModel');
        if (customModel) customModel.value = config.model || '';
        
        const aiTemperature = document.getElementById('aiTemperature');
        if (aiTemperature) aiTemperature.value = config.options?.temperature || 0.7;
        
        const temperatureValue = document.getElementById('temperatureValue');
        if (temperatureValue) temperatureValue.textContent = config.options?.temperature || 0.7;
        
        // 显示对应的配置面板
        showProviderConfig(config.provider);
        
        // 初始化 AI 分析器
        if (typeof AIAnalyzer !== 'undefined') {
            aiAnalyzer = new AIAnalyzer(config);
        }
        
        console.log('AI 配置已加载:', config.provider);
    } catch (error) {
        console.error('加载 AI 配置失败:', error);
    }
}

// 保存 AI 配置
function saveAIConfig() {
    const provider = document.getElementById('aiProvider').value;
    let config = {
        provider: provider,
        enabled: true,
        options: {
            temperature: parseFloat(document.getElementById('aiTemperature').value),
            maxTokens: 2048
        },
        local: {
            baseUrl: document.getElementById('ollamaUrl').value || 'http://localhost:11434',
            lmStudioUrl: document.getElementById('lmstudioUrl').value || 'http://localhost:1234',
            customUrl: document.getElementById('customUrl').value || 'http://localhost:8000'
        }
    };
    
    // 根据提供商设置特定配置
    switch (provider) {
        case 'openai':
            config.apiKey = document.getElementById('openaiKey').value;
            config.model = document.getElementById('openaiModel').value;
            break;
        case 'ollama':
            config.model = document.getElementById('ollamaModel').value || 'llava';
            break;
        case 'lmstudio':
            config.model = document.getElementById('lmstudioModel').value || 'local-model';
            break;
        case 'custom':
            config.apiKey = document.getElementById('customKey').value;
            config.model = document.getElementById('customModel').value;
            break;
    }
    
    // 保存到本地存储
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
    
    // 更新 AI 分析器
    if (typeof AIAnalyzer !== 'undefined' && aiAnalyzer) {
        aiAnalyzer.updateConfig(config);
    } else if (typeof AIAnalyzer !== 'undefined') {
        aiAnalyzer = new AIAnalyzer(config);
    }
    
    showConfigStatus('配置已保存', 'success');
    console.log('AI 配置已保存:', config);
}

// 显示提供商配置面板
function showProviderConfig(provider) {
    // 隐藏所有配置面板
    document.querySelectorAll('.provider-config').forEach(el => {
        el.style.display = 'none';
    });
    
    // 显示对应的配置面板
    const configMap = {
        'openai': 'openaiConfig',
        'ollama': 'ollamaConfig',
        'lmstudio': 'lmstudioConfig',
        'custom': 'customConfig'
    };
    
    const configEl = document.getElementById(configMap[provider]);
    if (configEl) {
        configEl.style.display = 'block';
    }
}

// 初始化 AI 配置事件监听
function initAIConfigListeners() {
    // 提供商切换
    const providerSelect = document.getElementById('aiProvider');
    if (providerSelect) {
        providerSelect.addEventListener('change', (e) => {
            showProviderConfig(e.target.value);
        });
    }
    
    // 温度滑块
    const tempSlider = document.getElementById('aiTemperature');
    if (tempSlider) {
        tempSlider.addEventListener('input', (e) => {
            document.getElementById('temperatureValue').textContent = e.target.value;
        });
    }
    
    // 保存配置按钮
    const saveBtn = document.getElementById('saveAIConfigBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveAIConfig);
    }
    
    // 重置配置按钮
    const resetBtn = document.getElementById('resetAIConfigBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('确定要重置为默认配置吗？')) {
                localStorage.removeItem(AI_CONFIG_KEY);
                loadAIConfig();
                showConfigStatus('配置已重置', 'success');
            }
        });
    }
    
    // 测试 Ollama 连接
    const testOllamaBtn = document.getElementById('testOllamaBtn');
    if (testOllamaBtn) {
        testOllamaBtn.addEventListener('click', async () => {
            const statusEl = document.getElementById('ollamaStatus');
            statusEl.textContent = '测试中...';
            statusEl.className = 'status-text';
            
            try {
                const baseUrl = document.getElementById('ollamaUrl').value || 'http://localhost:11434';
                const response = await fetch(`${baseUrl}/api/tags`);
                
                if (response.ok) {
                    const data = await response.json();
                    const models = data.models?.map(m => m.name).join(', ') || '无模型';
                    statusEl.textContent = `连接成功！可用模型: ${models}`;
                    statusEl.className = 'status-text success';
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                statusEl.textContent = `连接失败: ${error.message}`;
                statusEl.className = 'status-text error';
            }
        });
    }
    
    // 测试 LM Studio 连接
    const testLMStudioBtn = document.getElementById('testLMStudioBtn');
    if (testLMStudioBtn) {
        testLMStudioBtn.addEventListener('click', async () => {
            const statusEl = document.getElementById('lmstudioStatus');
            statusEl.textContent = '测试中...';
            statusEl.className = 'status-text';
            
            try {
                const baseUrl = document.getElementById('lmstudioUrl').value || 'http://localhost:1234';
                const response = await fetch(`${baseUrl}/v1/models`);
                
                if (response.ok) {
                    const data = await response.json();
                    const models = data.data?.map(m => m.id).join(', ') || '无模型';
                    statusEl.textContent = `连接成功！可用模型: ${models}`;
                    statusEl.className = 'status-text success';
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                statusEl.textContent = `连接失败: ${error.message}`;
                statusEl.className = 'status-text error';
            }
        });
    }
}

// 显示配置状态
function showConfigStatus(message, type) {
    const statusEl = document.getElementById('aiConfigStatus');
    if (statusEl) {
        statusEl.textContent = message;
        statusEl.className = `config-status ${type}`;
        
        setTimeout(() => {
            statusEl.className = 'config-status';
        }, 3000);
    }
}

// 获取当前 AI 配置
function getAIConfig() {
    try {
        const saved = localStorage.getItem(AI_CONFIG_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_AI_CONFIG;
    } catch (error) {
        console.error('获取 AI 配置失败:', error);
        return DEFAULT_AI_CONFIG;
    }
}

// 检查 AI 是否可用
function isAIEnabled() {
    const config = getAIConfig();
    return config.enabled && (
        (config.provider === 'openai' && config.apiKey) ||
        config.provider === 'ollama' ||
        config.provider === 'lmstudio' ||
        config.provider === 'custom'
    );
}

// 页面加载完成后初始化 AI 配置
document.addEventListener('DOMContentLoaded', () => {
    initAIConfig();
    initEquipmentAnalyzer();
});

// ==================== 设备分析器 ====================

// 初始化设备分析器
function initEquipmentAnalyzer() {
    console.log('初始化设备分析器...');
    console.log('cameraDatabase 是否存在:', typeof cameraDatabase !== 'undefined');
    console.log('lensDatabase 是否存在:', typeof lensDatabase !== 'undefined');
    
    // 检查关键DOM元素是否存在（支持两种页面）
    const cameraBrand = document.getElementById('cameraBrand');
    const cameraModel = document.getElementById('cameraModel');
    const lensType = document.getElementById('lensType');
    const comboSubject = document.getElementById('comboSubject');
    const equipmentResult = document.getElementById('equipmentResult');
    
    // 套装推荐页面专用元素
    const comboCameraBrand = document.getElementById('comboCameraBrand');
    const comboCameraModel = document.getElementById('comboCameraModel');
    
    console.log('DOM元素检查:', {
        cameraBrand: !!cameraBrand,
        cameraModel: !!cameraModel,
        lensType: !!lensType,
        comboSubject: !!comboSubject,
        equipmentResult: !!equipmentResult,
        comboCameraBrand: !!comboCameraBrand,
        comboCameraModel: !!comboCameraModel
    });
    
    // 如果关键元素不存在，说明不在套装推荐页面，跳过初始化
    if (!cameraBrand && !lensType && !comboSubject && !comboCameraBrand) {
        console.log('不在套装推荐页面，跳过设备分析器初始化');
        return;
    }
    
    initComboRecommendation();
    
    console.log('设备分析器初始化完成');
}

// 初始化套装推荐核心功能
function initComboRecommendation() {
    initLensGroupAssociation();
    initProgressiveComboRecommendation();
}

// 递进式套装推荐状态
let comboSelection = {
    step: 1,
    cameraBrand: '',
    cameraModel: '',
    cameraData: null,
    lens: null
};

// 初始化递进式套装推荐
function initProgressiveComboRecommendation() {
    console.log('初始化递进式套装推荐...');
    
    // 步骤1：相机品牌选择联动型号
    const comboCameraBrand = document.getElementById('comboCameraBrand');
    const comboCameraModel = document.getElementById('comboCameraModel');
    const comboBudget = document.getElementById('comboBudget');
    
    function updateCameraModelsByBudget() {
        const brand = comboCameraBrand?.value;
        const budget = comboBudget?.value || 'mid';
        
        console.log('updateCameraModelsByBudget 被调用:', { brand, budget, comboCameraBrandExists: !!comboCameraBrand, comboCameraModelExists: !!comboCameraModel });
        
        if (!comboCameraModel) {
            console.log('错误: comboCameraModel 元素不存在');
            return;
        }
        
        // 清空型号选择框
        comboCameraModel.innerHTML = '<option value="">选择型号</option>';
        
        if (!brand) {
            console.log('错误: 品牌为空');
            return;
        }
        
        if (!cameraDatabase[brand]) {
            console.log('错误: 数据库中找不到品牌:', brand, '可用品牌:', Object.keys(cameraDatabase));
            return;
        }
        
        console.log('找到品牌数据:', brand, '型号数量:', Object.keys(cameraDatabase[brand].models).length);
        
        // 根据预算筛选相机
        const models = cameraDatabase[brand].models;
        const budgetPriceMap = {
            'budget': ['entry'],           // 经济型：入门级
            'mid': ['entry', 'mid'],       // 中端：入门级+中端
            'high': ['mid', 'pro'],        // 高端：中端+专业级
            'pro': ['pro', 'flagship']     // 专业级：专业级+旗舰级
        };
        const allowedPrices = budgetPriceMap[budget] || ['mid'];
        
        Object.keys(models).forEach(model => {
            const modelData = models[model];
            // 如果相机价格级别符合预算范围，则显示
            if (allowedPrices.includes(modelData.price)) {
                const option = document.createElement('option');
                option.value = model;
                // 显示型号和价格级别
                const priceLabel = {
                    'entry': '【入门】',
                    'mid': '【中端】',
                    'pro': '【专业】',
                    'flagship': '【旗舰】'
                }[modelData.price] || '';
                option.textContent = priceLabel + ' ' + model;
                comboCameraModel.appendChild(option);
            }
        });
        
        // 如果没有匹配的型号，显示提示
        if (comboCameraModel.options.length === 1) {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "该预算下无可用型号";
            option.disabled = true;
            comboCameraModel.appendChild(option);
        }
    }
    
    if (comboCameraBrand && comboCameraModel) {
        comboCameraBrand.addEventListener('change', function() {
            console.log('套装推荐选择品牌:', this.value);
            updateCameraModelsByBudget();
        });
    }
    
    // 预算选择变化时更新型号列表
    if (comboBudget && comboCameraBrand) {
        comboBudget.addEventListener('change', function() {
            console.log('预算选择变化:', this.value);
            // 如果已选择品牌，则更新型号列表
            if (comboCameraBrand.value) {
                updateCameraModelsByBudget();
            }
        });
    }
    
    // 步骤1下一步按钮
    const comboStep1Next = document.getElementById('comboStep1Next');
    if (comboStep1Next) {
        comboStep1Next.addEventListener('click', function() {
            const brand = document.getElementById('comboCameraBrand')?.value;
            const model = document.getElementById('comboCameraModel')?.value;
            
            if (!brand || !model) {
                alert('请选择相机品牌和型号');
                return;
            }
            
            // 保存选择
            comboSelection.cameraBrand = brand;
            comboSelection.cameraModel = model;
            comboSelection.cameraData = cameraDatabase[brand]?.models[model];
            
            // 检查是否为固定镜头相机
            const cameraData = comboSelection.cameraData;
            if (cameraData?.mount === 'Fixed' || cameraData?.type === 'compact') {
                // 固定镜头相机，跳过镜头选择
                comboSelection.lens = null; // 标记为固定镜头
                
                // 显示套装汇总
                displayComboSummary();
                
                // 直接切换到步骤3
                goToComboStep(3);
                return;
            }
            
            // 显示已选相机信息
            displaySelectedCameraInfo();
            
            // 加载推荐镜头
            loadRecommendedLenses();
            
            // 切换到步骤2
            goToComboStep(2);
        });
    }
    
    // 步骤2返回按钮
    const comboStep2Back = document.getElementById('comboStep2Back');
    if (comboStep2Back) {
        comboStep2Back.addEventListener('click', function() {
            goToComboStep(1);
        });
    }
    
    // 步骤2下一步按钮
    const comboStep2Next = document.getElementById('comboStep2Next');
    if (comboStep2Next) {
        comboStep2Next.addEventListener('click', function() {
            if (!comboSelection.lens) {
                alert('请选择一款镜头');
                return;
            }
            
            // 显示套装汇总
            displayComboSummary();
            
            // 切换到步骤3
            goToComboStep(3);
        });
    }
    
    // 步骤3返回按钮
    const comboStep3Back = document.getElementById('comboStep3Back');
    if (comboStep3Back) {
        comboStep3Back.addEventListener('click', function() {
            // 检查是否为固定镜头相机
            const cameraData = comboSelection.cameraData;
            const isFixedLens = cameraData?.mount === 'Fixed' || cameraData?.type === 'compact';
            
            if (isFixedLens) {
                // 固定镜头相机返回步骤1
                goToComboStep(1);
            } else {
                // 可换镜头相机返回步骤2
                goToComboStep(2);
            }
        });
    }
    
    // 查看详细推荐按钮
    const recommendComboBtn = document.getElementById('recommendComboBtn');
    if (recommendComboBtn) {
        recommendComboBtn.addEventListener('click', function() {
            showDetailedRecommendation();
        });
    }
    
    // AI分析按钮
    const aiComboBtn = document.getElementById('aiComboBtn');
    if (aiComboBtn) {
        aiComboBtn.addEventListener('click', function() {
            showAIAnalysis();
        });
    }
    
    console.log('递进式套装推荐初始化完成');
}

// 切换到指定步骤
function goToComboStep(step) {
    console.log('切换到步骤:', step);
    comboSelection.step = step;
    
    // 检查是否为固定镜头相机
    const cameraData = comboSelection.cameraData;
    const isFixedLens = cameraData?.mount === 'Fixed' || cameraData?.type === 'compact';
    
    // 隐藏所有步骤
    document.getElementById('comboStep1').style.display = 'none';
    document.getElementById('comboStep2').style.display = 'none';
    document.getElementById('comboStep3').style.display = 'none';
    
    // 显示当前步骤
    document.getElementById('comboStep' + step).style.display = 'block';
    
    // 更新步骤指示器
    if (isFixedLens) {
        // 固定镜头相机：跳过步骤2，直接从1到3
        updateFixedLensStepIndicator(step);
    } else {
        // 可换镜头相机：恢复步骤指示器的默认状态
        resetStepIndicator();
        updateStepIndicator(step);
    }
}

// 重置步骤指示器到默认状态（用于可换镜头相机）
function resetStepIndicator() {
    const steps = document.querySelectorAll('.step-indicator .step');
    const lines = document.querySelectorAll('.step-indicator .step-line');
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.style.display = 'block'; // 恢复所有步骤显示
        
        // 恢复步骤标签
        const labelEl = step.querySelector('.step-label');
        if (labelEl) {
            if (stepNum === 1) {
                labelEl.textContent = '选择机身';
            } else if (stepNum === 2) {
                labelEl.textContent = '选择镜头';
            } else if (stepNum === 3) {
                labelEl.textContent = '生成套装';
            }
        }
    });
    
    // 恢复所有连接线显示
    lines.forEach(line => {
        line.style.display = 'block';
        line.classList.remove('completed');
    });
}

// 固定镜头相机步骤指示器（2步流程）
function updateFixedLensStepIndicator(currentStep) {
    const steps = document.querySelectorAll('.step-indicator .step');
    const lines = document.querySelectorAll('.step-indicator .step-line');
    
    // 固定镜头相机只有2步：选择机身 -> 生成套装
    // 步骤2（镜头选择）被跳过
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum === 1) {
            // 步骤1：选择机身
            if (currentStep === 1) {
                step.classList.add('active');
            } else {
                step.classList.add('completed');
            }
        } else if (stepNum === 2) {
            // 步骤2（原镜头选择）：固定镜头相机跳过此步骤
            step.style.display = 'none';
        } else if (stepNum === 3) {
            // 步骤3：生成套装
            step.querySelector('.step-label').textContent = '生成套装';
            if (currentStep === 3) {
                step.classList.add('active');
            } else if (currentStep > 3) {
                step.classList.add('completed');
            }
        }
    });
    
    // 隐藏第一条连接线（步骤1和2之间）
    if (lines.length > 0) {
        lines[0].style.display = 'none';
    }
    // 第二条连接线（步骤2和3之间）用于步骤1和3之间
    if (lines.length > 1) {
        lines[1].classList.remove('completed');
        if (currentStep === 3) {
            lines[1].classList.add('completed');
        }
    }
}

// 更新步骤指示器
function updateStepIndicator(currentStep) {
    const steps = document.querySelectorAll('.step-indicator .step');
    const lines = document.querySelectorAll('.step-indicator .step-line');
    
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum === currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
        }
    });
    
    lines.forEach((line, index) => {
        line.classList.remove('completed');
        if (index < currentStep - 1) {
            line.classList.add('completed');
        }
    });
}

// 显示已选相机信息
function displaySelectedCameraInfo() {
    const container = document.getElementById('selectedCameraInfo');
    if (!container) return;
    
    const brandName = cameraDatabase[comboSelection.cameraBrand]?.name || comboSelection.cameraBrand;
    const model = comboSelection.cameraModel;
    const cameraData = comboSelection.cameraData;
    
    // 获取卡口信息
    const mount = cameraData?.mount || '未知';
    const sensor = cameraData?.sensor === 'fullframe' ? '全画幅' : 
                   cameraData?.sensor === 'apsc' ? 'APS-C' :
                   cameraData?.sensor === 'medium' ? '中画幅' :
                   cameraData?.sensor === 'm43' ? 'M43' : cameraData?.sensor || '未知';
    
    // 获取该卡口支持的镜头类型
    const compatibility = mountCompatibility[mount];
    let mountInfo = '';
    if (compatibility) {
        const nativeMounts = compatibility.native.join('、');
        const adapterMounts = compatibility.adapter.length > 0 ? compatibility.adapter.join('、') : null;
        mountInfo = `<span class="mount-badge native">原生支持: ${nativeMounts}</span>`;
        if (adapterMounts) {
            mountInfo += ` <span class="mount-badge adapter">可转接: ${adapterMounts}</span>`;
        }
    }
    
    container.innerHTML = `
        <div class="selected-camera-card">
            <div class="camera-icon"><i class="fas fa-camera"></i></div>
            <div class="camera-details">
                <h5>${brandName} ${model}</h5>
                <div class="camera-specs">
                    <span class="spec-tag">${sensor}</span>
                    <span class="spec-tag mount-tag">${mount}卡口</span>
                    <span class="spec-tag">${cameraData?.mp || ''}MP</span>
                </div>
                <div class="mount-compatibility">
                    ${mountInfo}
                </div>
                <p class="hint-text">以下镜头已按卡口兼容性筛选，绿色标签为原生兼容，橙色为需转接</p>
            </div>
        </div>
    `;
}

// 加载推荐镜头（带卡口兼容性筛选和预算筛选）
function loadRecommendedLenses() {
    const container = document.getElementById('recommendedLensesGrid');
    if (!container) return;
    
    const brand = comboSelection.cameraBrand;
    const cameraData = comboSelection.cameraData;
    const cameraMount = cameraData?.mount;
    
    if (!cameraMount) {
        container.innerHTML = '<p>无法获取相机卡口信息</p>';
        return;
    }
    
    // 获取用户选择的预算范围
    const budgetSelect = document.getElementById('comboBudget');
    const selectedBudget = budgetSelect?.value || 'mid';
    
    // 获取该相机的卡口兼容性
    const compatibility = mountCompatibility[cameraMount];
    if (!compatibility) {
        container.innerHTML = '<p>暂不支持该卡口的镜头推荐</p>';
        return;
    }
    
    // 根据预算设置镜头价格范围
    const budgetRanges = {
        'budget': { min: 0, max: 5000, label: '经济型' },
        'mid': { min: 0, max: 10000, label: '中端' },
        'high': { min: 3000, max: 20000, label: '高端' },
        'pro': { min: 8000, max: 100000, label: '专业级' }
    };
    const budgetRange = budgetRanges[selectedBudget] || budgetRanges['mid'];
    
    // 收集所有兼容的镜头
    let compatibleLenses = [];
    
    // 遍历所有品牌的镜头数据库
    Object.keys(lensGroupDatabase).forEach(lensBrand => {
        const brandData = lensGroupDatabase[lensBrand];
        if (!brandData || !brandData.popularLenses) return;
        
        brandData.popularLenses.forEach(lens => {
            // 检查镜头是否兼容当前相机
            const lensCompatibility = checkLensCompatibilityForCombo(lens, cameraMount, compatibility);
            if (lensCompatibility.compatible) {
                compatibleLenses.push({
                    ...lens,
                    compatibility: lensCompatibility,
                    sourceBrand: lensBrand
                });
            }
        });
    });
    
    // 根据预算筛选镜头
    compatibleLenses = compatibleLenses.filter(lens => {
        const price = lens.priceNum || 0;
        return price >= budgetRange.min && price <= budgetRange.max;
    });
    
    // 按兼容性和价格排序：原生兼容优先，然后按价格排序
    compatibleLenses.sort((a, b) => {
        if (a.compatibility.method !== b.compatibility.method) {
            return a.compatibility.method === 'native' ? -1 : 1;
        }
        return (a.priceNum || 0) - (b.priceNum || 0);
    });
    
    // 限制显示数量
    const displayLenses = compatibleLenses.slice(0, 12);
    
    if (displayLenses.length === 0) {
        container.innerHTML = '<p>未找到兼容的镜头，请检查相机型号</p>';
        return;
    }
    
    let html = '';
    displayLenses.forEach((lens, index) => {
        const compatClass = lens.compatibility.method === 'native' ? 'native' : 'adapter';
        const compatIcon = lens.compatibility.method === 'native' ? 'fa-check-circle' : 'fa-plug';
        const compatText = lens.compatibility.method === 'native' ? '原生兼容' : '需转接';
        const brandName = lensGroupDatabase[lens.sourceBrand]?.name || lens.sourceBrand;
        
        html += `
            <div class="recommended-lens-item ${compatClass}" data-lens-index="${index}" data-lens-name="${lens.name}">
                <div class="lens-header">
                    <h6>${lens.name}</h6>
                    <span class="compatibility-badge ${compatClass}">
                        <i class="fas ${compatIcon}"></i> ${compatText}
                    </span>
                </div>
                <div class="lens-brand">${brandName} · ${lens.type === 'prime' ? '定焦' : lens.type === 'zoom' ? '变焦' : lens.type === 'macro' ? '微距' : '其他'}</div>
                <div class="lens-specs">
                    <span class="lens-spec"><i class="fas fa-expand"></i> ${lens.focal}</span>
                    <span class="lens-spec"><i class="fas fa-circle"></i> ${lens.aperture}</span>
                </div>
                <div class="lens-desc">${lens.desc}</div>
                <div class="lens-price">${lens.price}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // 添加点击事件
    container.querySelectorAll('.recommended-lens-item').forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他选中状态
            container.querySelectorAll('.recommended-lens-item').forEach(i => i.classList.remove('selected'));
            // 添加当前选中状态
            this.classList.add('selected');
            
            const index = parseInt(this.getAttribute('data-lens-index'));
            comboSelection.lens = displayLenses[index];
            console.log('选中镜头:', comboSelection.lens.name, '兼容性:', comboSelection.lens.compatibility);
        });
    });
}

// 检查镜头与相机的兼容性（套装专用）
function checkLensCompatibilityForCombo(lens, cameraMount, compatibility) {
    // 从镜头名称推断卡口
    let lensMount = null;
    const lensName = lens.name;
    
    // 根据镜头名称前缀判断卡口
    if (lensName.startsWith('RF ')) lensMount = 'RF';
    else if (lensName.startsWith('EF ')) lensMount = 'EF';
    else if (lensName.startsWith('FE ')) lensMount = 'FE';
    else if (lensName.startsWith('E ')) lensMount = 'E';
    else if (lensName.startsWith('Z ')) lensMount = 'Z';
    else if (lensName.startsWith('XF ')) lensMount = 'X';
    else if (lensName.startsWith('GFX ')) lensMount = 'G';
    else if (lensName.startsWith('LUMIX S') || lensName.includes('L卡口')) lensMount = 'L';
    else if (lensName.startsWith('M.Zuiko')) lensMount = 'M43';
    else if (lensName.startsWith('Summilux-M') || lensName.startsWith('Summicron-M') || lensName.startsWith('Noctilux-M')) lensMount = 'M';
    else if (lensName.startsWith('Summilux-SL') || lensName.startsWith('Vario-Elmarit-SL')) lensMount = 'L';
    else if (lensName.startsWith('XCD ')) lensMount = 'XCD';
    
    // 根据品牌推断（如果名称前缀无法识别）
    if (!lensMount && lens.brand === 'original') {
        // 根据镜头所属品牌推断
        const brandMountMap = {
            'canon': ['RF', 'EF'],
            'sony': ['FE', 'E'],
            'nikon': ['Z'],
            'fujifilm': ['X', 'G'],
            'panasonic': ['L'],
            'olympus': ['M43'],
            'leica': ['M', 'L'],
            'hasselblad': ['XCD']
        };
        
        // 查找镜头所属品牌
        for (const [brandKey, brandData] of Object.entries(lensGroupDatabase)) {
            if (brandData.popularLenses.includes(lens)) {
                const mounts = brandMountMap[brandKey];
                if (mounts) {
                    // 检查是否有兼容的卡口
                    for (const mount of mounts) {
                        if (compatibility.native.includes(mount) || compatibility.adapter.includes(mount)) {
                            lensMount = mount;
                            break;
                        }
                    }
                }
                break;
            }
        }
    }
    
    if (!lensMount) {
        return { compatible: false, reason: '无法识别镜头卡口' };
    }
    
    // 检查原生兼容
    if (compatibility.native.includes(lensMount)) {
        return { compatible: true, method: 'native', lensMount: lensMount };
    }
    
    // 检查转接兼容
    if (compatibility.adapter.includes(lensMount)) {
        return { compatible: true, method: 'adapter', lensMount: lensMount };
    }
    
    return { compatible: false, reason: `卡口不匹配: ${lensMount} → ${cameraMount}` };
}

// 显示套装汇总
function displayComboSummary() {
    const container = document.getElementById('comboSummary');
    if (!container) return;
    
    const brandName = cameraDatabase[comboSelection.cameraBrand]?.name || comboSelection.cameraBrand;
    const camera = comboSelection.cameraModel;
    const cameraData = comboSelection.cameraData;
    const lens = comboSelection.lens;
    
    // 获取相机实际价格（从数据库）
    const cameraPriceNum = getCameraPrice(comboSelection.cameraBrand, camera);
    
    // 获取传感器类型
    const sensorType = cameraData?.sensor === 'fullframe' ? '全画幅' : 
                       cameraData?.sensor === 'apsc' ? 'APS-C' :
                       cameraData?.sensor === 'medium' ? '中画幅' :
                       cameraData?.sensor === 'm43' ? 'M43' : cameraData?.sensor || '未知';
    
    // 检查是否为固定镜头相机
    const isFixedLens = cameraData?.mount === 'Fixed' || cameraData?.type === 'compact';
    
    let lensHtml = '';
    let totalPriceStr = '';
    
    if (isFixedLens) {
        // 固定镜头相机，不显示镜头选择
        const fixedLensInfo = getFixedLensInfo(cameraData, brandName, camera);
        totalPriceStr = '¥' + cameraPriceNum.toLocaleString();
        lensHtml = `
            <div class="combo-connector"><i class="fas fa-check"></i></div>
            <div class="combo-summary-item lens-item fixed-lens">
                <div class="item-icon"><i class="fas fa-dot-circle"></i></div>
                <div class="item-details">
                    <h6>固定镜头</h6>
                    <div class="item-specs">
                        <span class="spec">${fixedLensInfo.focal}</span>
                        <span class="spec">${fixedLensInfo.aperture}</span>
                        <span class="compatibility-tag native">不可更换</span>
                    </div>
                    <p class="fixed-lens-desc">${fixedLensInfo.desc}</p>
                </div>
            </div>
        `;
    } else {
        // 可换镜头相机
        const lensPriceNum = lens?.priceNum || 3000;
        const totalPrice = cameraPriceNum + lensPriceNum;
        const lensPriceStr = lens?.price || '¥' + lensPriceNum.toLocaleString();
        totalPriceStr = '¥' + totalPrice.toLocaleString();
        
        // 获取兼容性信息
        const compatMethod = lens?.compatibility?.method || 'native';
        const compatText = compatMethod === 'native' ? '原生兼容' : '需转接环';
        const compatClass = compatMethod === 'native' ? 'native' : 'adapter';
        
        lensHtml = `
            <div class="combo-connector"><i class="fas fa-plus"></i></div>
            <div class="combo-summary-item lens-item">
                <div class="item-icon"><i class="fas fa-circle"></i></div>
                <div class="item-details">
                    <h6>${lens?.name || '未选择镜头'}</h6>
                    <div class="item-specs">
                        <span class="spec">${lens?.focal || ''}</span>
                        <span class="spec">${lens?.aperture || ''}</span>
                        <span class="compatibility-tag ${compatClass}">${compatText}</span>
                    </div>
                </div>
                <div class="item-price">${lensPriceStr}</div>
            </div>
        `;
    }
    
    const cameraPriceStr = '¥' + cameraPriceNum.toLocaleString();
    
    // 检查是否为新器材
    const isNewGear = cameraData?.isNew === true;
    const newGearBadge = isNewGear ? `
        <span class="new-gear-badge" style="
            background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
            color: white;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            margin-left: 8px;
            font-weight: 500;
        ">
            ${cameraData?.status === 'official' ? '✅ 新发布' : cameraData?.status === 'announced' ? '📢 已宣布' : '💬 传闻'}
        </span>
    ` : '';
    const newGearInfo = isNewGear ? `
        <div class="new-gear-info" style="
            background: #fff3cd;
            border: 1px solid #ffc107;
            border-radius: 6px;
            padding: 10px 12px;
            margin-top: 10px;
            font-size: 13px;
            color: #856404;
        ">
            <i class="fas fa-info-circle"></i> 
            <strong>新器材提示：</strong>
            ${cameraData?.status === 'official' ? '该机型的官方信息已发布，预计售价 ¥' + (cameraData?.expectedPrice || '待定').toLocaleString() : 
              cameraData?.status === 'announced' ? '该机型已正式宣布，预计 ' + (cameraData?.releaseDate || '近期') + ' 上市' : 
              '该机型目前处于传闻阶段，规格和价格可能存在变动'}
        </div>
    ` : '';
    
    // 生成套装ID用于对比功能
    const comboId = `combo_${comboSelection.cameraBrand}_${camera.replace(/\s+/g, '_')}_${lens?.id || 'fixed'}_${Date.now()}`;
    
    // 获取二手价格信息
    const usedPriceInfo = getUsedPriceInfo(comboSelection.cameraBrand, camera);
    const usedPriceHtml = usedPriceInfo ? `
        <div class="used-price-info">
            <div class="used-price-header">
                <i class="fas fa-recycle"></i> 二手市场参考
            </div>
            <div class="used-price-content">
                <div class="used-price-item">
                    <span class="used-label">二手价格</span>
                    <span class="used-price">¥${usedPriceInfo.usedPrice.toLocaleString()}</span>
                    <span class="used-condition">${usedPriceInfo.condition}</span>
                </div>
                <div class="used-depreciation">
                    比全新省 <strong>${usedPriceInfo.depreciation}%</strong>
                </div>
            </div>
        </div>
    ` : '';
    
    container.innerHTML = `
        <div class="combo-summary-header">
            <h5><i class="fas fa-layer-group"></i> 套装配置汇总</h5>
        </div>
        <div class="combo-summary-item camera-item">
            <div class="item-icon"><i class="fas fa-camera"></i></div>
            <div class="item-details">
                <h6>${brandName} ${camera}${newGearBadge}</h6>
                <div class="item-specs">
                    <span class="spec">${sensorType}</span>
                    <span class="spec">${cameraData?.mp || ''}MP</span>
                    <span class="spec">${isFixedLens ? '固定镜头' : (cameraData?.mount || '') + '卡口'}</span>
                </div>
                ${newGearInfo}
            </div>
            <div class="item-price">${cameraPriceStr}</div>
        </div>
        ${lensHtml}
        <div class="combo-total">
            <div class="total-label">
                <span>${isFixedLens ? '参考价格' : '套装总价（参考）'}</span>
                <small>实际价格以市场为准</small>
            </div>
            <div class="total-price">${totalPriceStr}</div>
        </div>
        ${usedPriceHtml}
        <div class="combo-actions-bar">
            <button class="btn btn-compare" onclick="addComboToCompare('${comboId}')" id="compareBtn_${comboId}">
                <i class="fas fa-balance-scale"></i> 加入对比
            </button>
            <button class="btn btn-favorite" onclick="favoriteCurrentCombo()">
                <i class="far fa-star"></i> 收藏套装
            </button>
        </div>
        <div class="combo-hint">
            <i class="fas fa-info-circle"></i>
            点击"查看详细推荐"获取完整的套装评价和使用指导
        </div>
    `;
    
    // 保存当前套装数据到全局变量，供对比功能使用
    window.currentComboData = {
        id: comboId,
        camera: { brand: comboSelection.cameraBrand, model: camera, data: cameraData, price: cameraPriceNum },
        lens: lens,
        totalPrice: isFixedLens ? cameraPriceNum : (cameraPriceNum + (lens?.priceNum || 3000)),
        isFixedLens: isFixedLens,
        createdAt: new Date().toISOString()
    };
}

// ==================== 套装对比联动功能 ====================

// 添加当前套装到对比
function addComboToCompare(comboId) {
    if (!window.currentComboData) {
        alert('请先生成套装方案');
        return;
    }
    
    // 获取已有的对比列表
    let compareList = JSON.parse(localStorage.getItem('gearCompareList') || '[]');
    
    // 检查是否已存在
    const exists = compareList.some(item => 
        item.type === 'combo' && 
        item.camera?.model === window.currentComboData.camera.model &&
        item.lens?.id === window.currentComboData.lens?.id
    );
    
    if (exists) {
        alert('该套装已在对比列表中');
        return;
    }
    
    // 检查对比数量限制
    if (compareList.length >= 4) {
        alert('对比列表最多支持4个物品，请先移除一些');
        return;
    }
    
    // 构建套装对比数据
    const comboData = {
        type: 'combo',
        id: comboId,
        name: `${window.currentComboData.camera.data?.brand || window.currentComboData.camera.brand} ${window.currentComboData.camera.model} 套装`,
        camera: window.currentComboData.camera,
        lens: window.currentComboData.lens,
        totalPrice: window.currentComboData.totalPrice,
        isFixedLens: window.currentComboData.isFixedLens,
        addedAt: new Date().toISOString()
    };
    
    // 添加到对比列表
    compareList.push(comboData);
    localStorage.setItem('gearCompareList', JSON.stringify(compareList));
    
    // 更新按钮状态
    const btn = document.getElementById(`compareBtn_${comboId}`);
    if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> 已加入对比';
        btn.disabled = true;
        btn.classList.add('btn-disabled');
    }
    
    // 显示提示
    showComboNotification('套装已加入对比列表，前往"器材对比"页面查看');
}

// 收藏当前套装
function favoriteCurrentCombo() {
    if (!window.currentComboData) {
        alert('请先生成套装方案');
        return;
    }
    
    const data = window.currentComboData;
    const comboName = `${data.camera.data?.brand || data.camera.brand} ${data.camera.model}${data.isFixedLens ? '' : ' + ' + (data.lens?.name || '镜头')}套装`;
    
    const favoriteItem = {
        id: 'combo_' + Date.now(),
        type: 'combo',
        name: comboName,
        camera: data.camera,
        lens: data.lens,
        totalPrice: data.totalPrice,
        isFixedLens: data.isFixedLens,
        createdAt: new Date().toISOString()
    };
    
    // 保存到收藏
    let favorites = JSON.parse(localStorage.getItem('photoMonster_favorites') || '[]');
    
    // 检查是否已收藏
    const exists = favorites.some(f => 
        f.type === 'combo' && 
        f.camera?.model === data.camera.model &&
        f.lens?.id === data.lens?.id
    );
    
    if (exists) {
        alert('该套装已在收藏列表中');
        return;
    }
    
    favorites.unshift(favoriteItem);
    
    // 最多保留50条
    if (favorites.length > 50) {
        favorites = favorites.slice(0, 50);
    }
    
    localStorage.setItem('photoMonster_favorites', JSON.stringify(favorites));
    
    showComboNotification('套装已收藏，前往"我的收藏"页面查看');
}

// 显示套装操作提示
function showComboNotification(message) {
    // 移除已存在的提示
    const existing = document.getElementById('comboNotification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.id = 'comboNotification';
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动消失
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 获取固定镜头相机信息
function getFixedLensInfo(cameraData, brandName, model) {
    const fixedLensDatabase = {
        'X100VI': { focal: '23mm', aperture: 'f/2.0', desc: '等效35mm经典人文焦段' },
        'X100V': { focal: '23mm', aperture: 'f/2.0', desc: '等效35mm经典人文焦段' },
        'X100F': { focal: '23mm', aperture: 'f/2.0', desc: '等效35mm经典人文焦段' },
        'Q3': { focal: '28mm', aperture: 'f/1.7', desc: 'Summilux镜头，徕卡色彩' },
        'Q2': { focal: '28mm', aperture: 'f/1.7', desc: 'Summilux镜头，徕卡色彩' },
        'Q': { focal: '28mm', aperture: 'f/1.7', desc: 'Summilux镜头，徕卡色彩' },
        'D-Lux 8': { focal: '24-75mm', aperture: 'f/1.7-2.8', desc: '徕卡变焦镜头' }
    };
    
    return fixedLensDatabase[model] || { 
        focal: '固定镜头', 
        aperture: '', 
        desc: '该相机配备固定镜头，不可更换' 
    };
}

// 二手市场价格数据（约为全新价格的60-85%，根据成色和热门程度）
const usedPriceDatabase = {
    // 佳能
    'canon': {
        'EOS R5': { usedPrice: 18000, condition: '95新', depreciation: 25 },
        'EOS R6 II': { usedPrice: 12000, condition: '95新', depreciation: 25 },
        'EOS R6': { usedPrice: 10000, condition: '95新', depreciation: 29 },
        'EOS R8': { usedPrice: 7500, condition: '95新', depreciation: 21 },
        'EOS RP': { usedPrice: 4500, condition: '95新', depreciation: 36 },
        'EOS 5D IV': { usedPrice: 12000, condition: '90新', depreciation: 33 },
        'EOS 5D III': { usedPrice: 4000, condition: '90新', depreciation: 33 },
        'EOS 5D II': { usedPrice: 2500, condition: '85新', depreciation: 29 },
        'EOS 6D II': { usedPrice: 5500, condition: '95新', depreciation: 35 },
        'EOS 6D': { usedPrice: 3200, condition: '90新', depreciation: 36 },
        'EOS 90D': { usedPrice: 6000, condition: '95新', depreciation: 33 },
        'EOS 850D': { usedPrice: 3800, condition: '95新', depreciation: 37 },
        'EOS M50 II': { usedPrice: 3200, condition: '95新', depreciation: 36 },
        'EOS M6 II': { usedPrice: 4500, condition: '95新', depreciation: 40 }
    },
    // 索尼
    'sony': {
        'A1': { usedPrice: 38000, condition: '95新', depreciation: 21 },
        'A9 III': { usedPrice: 38000, condition: '95新', depreciation: 17 },
        'A9 II': { usedPrice: 22000, condition: '95新', depreciation: 27 },
        'A7R V': { usedPrice: 20000, condition: '95新', depreciation: 23 },
        'A7R IV': { usedPrice: 16000, condition: '95新', depreciation: 30 },
        'A7R III': { usedPrice: 11000, condition: '95新', depreciation: 35 },
        'A7 IV': { usedPrice: 13000, condition: '95新', depreciation: 24 },
        'A7 III': { usedPrice: 9000, condition: '95新', depreciation: 36 },
        'A7C': { usedPrice: 9000, condition: '95新', depreciation: 25 },
        'A7C II': { usedPrice: 12000, condition: '95新', depreciation: 20 },
        'A6700': { usedPrice: 8000, condition: '95新', depreciation: 27 },
        'A6600': { usedPrice: 6500, condition: '95新', depreciation: 35 },
        'A6400': { usedPrice: 4800, condition: '95新', depreciation: 37 },
        'ZV-E10': { usedPrice: 3500, condition: '95新', depreciation: 36 },
        'ZV-E1': { usedPrice: 12000, condition: '95新', depreciation: 20 },
        'FX3': { usedPrice: 22000, condition: '95新', depreciation: 15 },
        'FX30': { usedPrice: 11000, condition: '95新', depreciation: 21 }
    },
    // 尼康
    'nikon': {
        'Z9': { usedPrice: 32000, condition: '95新', depreciation: 20 },
        'Z8': { usedPrice: 22000, condition: '95新', depreciation: 21 },
        'Z7 II': { usedPrice: 14000, condition: '95新', depreciation: 30 },
        'Z7': { usedPrice: 10000, condition: '95新', depreciation: 41 },
        'Z6 III': { usedPrice: 15000, condition: '95新', depreciation: 17 },
        'Z6 II': { usedPrice: 9500, condition: '95新', depreciation: 32 },
        'Z6': { usedPrice: 7000, condition: '95新', depreciation: 36 },
        'Z5': { usedPrice: 5500, condition: '95新', depreciation: 31 },
        'Zf': { usedPrice: 11000, condition: '95新', depreciation: 21 },
        'Zfc': { usedPrice: 5000, condition: '95新', depreciation: 29 },
        'Z50': { usedPrice: 4500, condition: '95新', depreciation: 36 },
        'Z30': { usedPrice: 3800, condition: '95新', depreciation: 37 },
        'D850': { usedPrice: 15000, condition: '90新', depreciation: 40 },
        'D780': { usedPrice: 11000, condition: '95新', depreciation: 27 },
        'D750': { usedPrice: 5500, condition: '90新', depreciation: 39 }
    },
    // 富士
    'fujifilm': {
        'X100VI': { usedPrice: 11000, condition: '99新', depreciation: 8 },
        'X100V': { usedPrice: 9500, condition: '95新', depreciation: 17 },
        'X100F': { usedPrice: 5500, condition: '90新', depreciation: 35 },
        'X-T5': { usedPrice: 10000, condition: '95新', depreciation: 23 },
        'X-T4': { usedPrice: 7500, condition: '95新', depreciation: 37 },
        'X-T3': { usedPrice: 5500, condition: '90新', depreciation: 45 },
        'X-T30 II': { usedPrice: 5500, condition: '95新', depreciation: 31 },
        'X-T30': { usedPrice: 4000, condition: '90新', depreciation: 43 },
        'X-S20': { usedPrice: 7500, condition: '95新', depreciation: 25 },
        'X-S10': { usedPrice: 5500, condition: '95新', depreciation: 35 },
        'X-H2S': { usedPrice: 14000, condition: '95新', depreciation: 22 },
        'X-H2': { usedPrice: 12000, condition: '95新', depreciation: 20 },
        'X-E4': { usedPrice: 5500, condition: '95新', depreciation: 31 },
        'GFX 100S': { usedPrice: 28000, condition: '95新', depreciation: 30 },
        'GFX 50S II': { usedPrice: 20000, condition: '95新', depreciation: 33 },
        'GFX 50R': { usedPrice: 18000, condition: '90新', depreciation: 40 }
    },
    // 松下
    'panasonic': {
        'S5 II': { usedPrice: 10000, condition: '95新', depreciation: 23 },
        'S5': { usedPrice: 7500, condition: '95新', depreciation: 32 },
        'S1R': { usedPrice: 15000, condition: '95新', depreciation: 35 },
        'S1H': { usedPrice: 16000, condition: '95新', depreciation: 30 },
        'GH6': { usedPrice: 9500, condition: '95新', depreciation: 27 },
        'GH5 II': { usedPrice: 7000, condition: '95新', depreciation: 36 },
        'GH5': { usedPrice: 4500, condition: '90新', depreciation: 50 },
        'G9 II': { usedPrice: 9500, condition: '95新', depreciation: 21 },
        'G9': { usedPrice: 5000, condition: '95新', depreciation: 44 },
        'G95': { usedPrice: 3800, condition: '95新', depreciation: 37 },
        'GX9': { usedPrice: 3200, condition: '95新', depreciation: 43 }
    },
    // 奥林巴斯
    'olympus': {
        'OM-1': { usedPrice: 8500, condition: '95新', depreciation: 29 },
        'OM-5': { usedPrice: 5500, condition: '95新', depreciation: 31 },
        'E-M1 III': { usedPrice: 7500, condition: '95新', depreciation: 38 },
        'E-M1 II': { usedPrice: 4500, condition: '90新', depreciation: 50 },
        'E-M5 III': { usedPrice: 4500, condition: '95新', depreciation: 40 },
        'E-M10 IV': { usedPrice: 3500, condition: '95新', depreciation: 36 },
        'PEN-E-P7': { usedPrice: 3800, condition: '95新', depreciation: 37 }
    },
    // 徕卡
    'leica': {
        'M11': { usedPrice: 55000, condition: '95新', depreciation: 15 },
        'M10-R': { usedPrice: 48000, condition: '95新', depreciation: 20 },
        'M10': { usedPrice: 38000, condition: '90新', depreciation: 30 },
        'Q3': { usedPrice: 42000, condition: '95新', depreciation: 16 },
        'Q2': { usedPrice: 32000, condition: '95新', depreciation: 27 },
        'SL2-S': { usedPrice: 28000, condition: '95新', depreciation: 30 },
        'SL2': { usedPrice: 38000, condition: '95新', depreciation: 30 },
        'D-Lux 8': { usedPrice: 9500, condition: '95新', depreciation: 17 }
    },
    // 哈苏
    'hasselblad': {
        'X2D 100C': { usedPrice: 48000, condition: '95新', depreciation: 20 },
        'X1D II 50C': { usedPrice: 28000, condition: '95新', depreciation: 36 },
        '907X 100C': { usedPrice: 52000, condition: '95新', depreciation: 14 }
    }
};

// 获取二手价格信息
function getUsedPriceInfo(brand, model) {
    const brandData = usedPriceDatabase[brand];
    if (!brandData) return null;
    
    return brandData[model] || null;
}

// 获取相机参考价格
function getCameraPrice(brand, model) {
    const priceMap = {
        'flagship': 45000,
        'pro': 22000,
        'mid': 10000,
        'entry': 5000
    };
    
    const cameraData = cameraDatabase[brand]?.models[model];
    if (!cameraData) return 8000;
    
    // 根据具体型号调整价格
    const basePrice = priceMap[cameraData.price] || 8000;
    
    // 特殊型号价格调整
    const specialPrices = {
        'EOS R5': 24000,
        'EOS R6 II': 16000,
        'EOS R6': 14000,
        'EOS R8': 9500,
        'EOS 5D IV': 18000,
        'EOS 5D III': 6000,
        'EOS 5D II': 3500,
        'A1': 48000,
        'A7R V': 26000,
        'A7 IV': 17000,
        'A7C II': 14000,
        'A7 III': 11000,
        'A7R III': 16000,
        'A7R II': 10000,
        'A7 II': 7000,
        'A6400': 6000,
        'A6000': 3500,
        'Z9': 42000,
        'Z8': 28000,
        'Z7 II': 20000,
        'Z6 II': 13000,
        'Z5': 8500,
        'Z7': 16000,
        'Z6': 10000,
        'Zf': 12000,
        'D850': 18000,
        'D810': 10000,
        'D780': 11000,
        'D750': 8000,
        'D610': 5500,
        'X-T5': 12000,
        'X-H2': 14000,
        'X-H2S': 16000,
        'X-S20': 9500,
        'X-T30 II': 6500,
        'X100VI': 11000,
        'GFX 100S': 45000,
        'GFX 50S II': 28000,
        'S5 II': 11000,
        'S5 IIx': 14000,
        'GH6': 13000,
        'OM-1': 15000,
        'OM-5': 8000,
        'M11': 65000,
        'Q3': 48000,
        'SL3': 52000,
        'X2D 100C': 55000,
        'X1D II 50C': 38000
    };
    
    return specialPrices[model] || basePrice;
}

// 卡口兼容性数据库
const mountCompatibility = {
    // 佳能
    'RF': { native: ['RF'], adapter: ['EF', 'EF-S'] },
    'EF': { native: ['EF'], adapter: [] },
    'EF-M': { native: ['EF-M'], adapter: ['EF', 'EF-S'] },
    // 索尼
    'FE': { native: ['FE', 'E'], adapter: ['A'] },
    'E': { native: ['E'], adapter: ['FE', 'A'] },
    // 尼康
    'Z': { native: ['Z'], adapter: ['F'] },
    'F': { native: ['F'], adapter: [] },
    // 富士
    'X': { native: ['X'], adapter: [] },
    'G': { native: ['G'], adapter: [] },
    // 松下/徕卡
    'L': { native: ['L'], adapter: ['M', 'R'] },
    // 奥林巴斯
    'M43': { native: ['M43'], adapter: [] },
    // 徕卡
    'M': { native: ['M'], adapter: [] },
    // 哈苏
    'XCD': { native: ['XCD'], adapter: ['HC', 'HCD'] }
};

// 获取相机卡口信息
function getCameraMountInfo(brand, model) {
    const camera = cameraDatabase[brand]?.models[model];
    if (!camera) return null;
    return {
        mount: camera.mount,
        type: camera.type,
        sensor: camera.sensor
    };
}

// 检查镜头是否兼容相机
function checkLensCompatibility(cameraBrand, cameraModel, lensBrand, lensName) {
    const cameraInfo = getCameraMountInfo(cameraBrand, cameraModel);
    if (!cameraInfo) return { compatible: false, reason: '找不到相机信息' };
    
    const cameraMount = cameraInfo.mount;
    const compatibility = mountCompatibility[cameraMount];
    
    if (!compatibility) {
        return { compatible: false, reason: `未知卡口: ${cameraMount}` };
    }
    
    // 获取镜头卡口信息
    const lensData = lensGroupDatabase[lensBrand]?.popularLenses.find(l => l.name === lensName);
    if (!lensData) return { compatible: false, reason: '找不到镜头信息' };
    
    // 检查镜头数据库中的mount字段或使用品牌推断
    let lensMount = lensData.mount;
    if (!lensMount) {
        // 根据品牌推断卡口
        const mountMap = {
            canon: { RF: 'RF', EF: 'EF', 'EF 50mm': 'EF' },
            sony: { FE: 'FE', E: 'E' },
            nikon: { Z: 'Z', 'Z 50mm': 'Z', 'Z 40mm': 'Z' },
            fujifilm: { XF: 'X', GFX: 'G' },
            panasonic: { LUMIX: 'L', 'LUMIX S': 'L' },
            olympus: { 'M.Zuiko': 'M43' },
            leica: { Summilux: 'M', Summicron: 'M', Noctilux: 'M', 'Summilux-SL': 'L' },
            hasselblad: { XCD: 'XCD' }
        };
        
        // 根据镜头名称推断卡口
        if (lensName.includes('RF ')) lensMount = 'RF';
        else if (lensName.includes('EF ')) lensMount = 'EF';
        else if (lensName.includes('FE ')) lensMount = 'FE';
        else if (lensName.includes('Z ')) lensMount = 'Z';
        else if (lensName.includes('XF ')) lensMount = 'X';
        else if (lensName.includes('LUMIX S')) lensMount = 'L';
        else if (lensName.includes('M.Zuiko')) lensMount = 'M43';
        else if (lensName.includes('Summilux-M') || lensName.includes('Summicron-M') || lensName.includes('Noctilux-M')) lensMount = 'M';
        else if (lensName.includes('Summilux-SL') || lensName.includes('Vario-Elmarit-SL')) lensMount = 'L';
        else if (lensName.includes('XCD ')) lensMount = 'XCD';
        else lensMount = 'unknown';
    }
    
    // 检查原生兼容
    if (compatibility.native.includes(lensMount)) {
        return { compatible: true, method: 'native', message: '原生兼容' };
    }
    
    // 检查转接兼容
    if (compatibility.adapter.includes(lensMount)) {
        return { compatible: true, method: 'adapter', message: `可通过转接环使用 (${lensMount} → ${cameraMount})` };
    }
    
    // 不兼容
    return { 
        compatible: false, 
        reason: `卡口不匹配: 相机是${cameraMount}卡口，镜头是${lensMount}卡口`,
        cameraMount: cameraMount,
        lensMount: lensMount
    };
}

// 初始化镜头群关联和筛选
function initLensGroupAssociation() {
    console.log('初始化镜头群关联...');
    
    const lensCameraBrand = document.getElementById('lensCameraBrand');
    const lensType = document.getElementById('lensType');
    const lensFocal = document.getElementById('lensFocal');
    const lensAperture = document.getElementById('lensAperture');
    const lensBrand = document.getElementById('lensBrand');
    const lensScenario = document.getElementById('lensScenario');
    
    if (!lensCameraBrand) {
        console.log('镜头品牌选择框不存在，跳过镜头群关联初始化');
        return;
    }
    
    // 监听所有筛选条件的变化
    const filterElements = [lensCameraBrand, lensType, lensFocal, lensAperture, lensBrand, lensScenario];
    filterElements.forEach(element => {
        if (element) {
            element.addEventListener('change', function() {
                console.log('筛选条件变化:', this.id, this.value);
                filterAndDisplayLenses();
            });
        }
    });
    
    console.log('镜头群关联事件已绑定');
}

// 获取当前筛选条件
function getLensFilters() {
    return {
        cameraBrand: document.getElementById('lensCameraBrand')?.value || '',
        lensType: document.getElementById('lensType')?.value || '',
        focalRange: document.getElementById('lensFocal')?.value || '',
        aperture: document.getElementById('lensAperture')?.value || '',
        lensBrand: document.getElementById('lensBrand')?.value || '',
        scenario: document.getElementById('lensScenario')?.value || ''
    };
}

// 筛选并显示镜头
function filterAndDisplayLenses() {
    const filters = getLensFilters();
    console.log('当前筛选条件:', filters);
    
    // 如果没有选择相机品牌，不显示镜头群
    if (!filters.cameraBrand) {
        const lensGroupSection = document.getElementById('lensGroupSection');
        if (lensGroupSection) {
            lensGroupSection.style.display = 'none';
        }
        return;
    }
    
    const brandData = lensGroupDatabase[filters.cameraBrand];
    if (!brandData) {
        console.error('找不到品牌数据:', filters.cameraBrand);
        return;
    }
    
    // 筛选镜头
    let filteredLenses = brandData.popularLenses.filter(lens => {
        // 类型筛选
        if (filters.lensType && lens.type !== filters.lensType) {
            return false;
        }
        
        // 焦段筛选
        if (filters.focalRange) {
            const focalMatch = checkFocalRange(lens, filters.focalRange);
            if (!focalMatch) return false;
        }
        
        // 光圈筛选
        if (filters.aperture) {
            const apertureMatch = checkAperture(lens, filters.aperture);
            if (!apertureMatch) return false;
        }
        
        // 品牌筛选
        if (filters.lensBrand && lens.brand !== filters.lensBrand) {
            return false;
        }
        
        return true;
    });
    
    // 按场景推荐排序
    if (filters.scenario) {
        filteredLenses = sortByScenario(filteredLenses, filters.scenario);
    }
    
    // 显示筛选结果
    displayFilteredLensGroup(filters.cameraBrand, filteredLenses, brandData.name);
}

// 检查焦段范围
function checkFocalRange(lens, focalRange) {
    const focalMin = lens.focalMin || 0;
    const focalMax = lens.focalMax || focalMin;
    
    switch (focalRange) {
        case 'wide': // 广角 (<35mm)
            return focalMax < 35;
        case 'standard': // 标准 (35-70mm)
            return (focalMin >= 35 && focalMin <= 70) || (focalMax >= 35 && focalMax <= 70);
        case 'portrait': // 人像 (85-135mm)
            return (focalMin >= 85 && focalMin <= 135) || (focalMax >= 85 && focalMax <= 135);
        case 'telephoto': // 长焦 (>135mm)
            return focalMin > 135;
        default:
            return true;
    }
}

// 检查光圈
function checkAperture(lens, apertureFilter) {
    const lensAperture = lens.apertureNum || 2.8;
    
    switch (apertureFilter) {
        case 'f095':
            return lensAperture <= 0.95;
        case 'f11':
            return lensAperture <= 1.1;
        case 'f12':
            return lensAperture <= 1.2;
        case 'f14':
            return lensAperture <= 1.4;
        case 'f18':
            return lensAperture <= 1.8;
        case 'f2':
            return lensAperture <= 2.0;
        case 'f28':
            return lensAperture <= 2.8;
        case 'f4':
            return lensAperture <= 4.0;
        case 'f56':
            return lensAperture > 4.0;
        default:
            return true;
    }
}

// 按场景排序
function sortByScenario(lenses, scenario) {
    const scenarioScores = {
        portrait: { prime: 3, '85mm': 5, '50mm': 4, macro: 1 },
        landscape: { wide: 5, zoom: 3, prime: 2 },
        street: { prime: 4, '35mm': 5, wide: 3 },
        sports: { telephoto: 5, zoom: 4 },
        macro: { macro: 5 }
    };
    
    const scores = scenarioScores[scenario] || {};
    
    return [...lenses].sort((a, b) => {
        let scoreA = 0, scoreB = 0;
        
        // 类型匹配
        if (scores[a.type]) scoreA += scores[a.type];
        if (scores[b.type]) scoreB += scores[b.type];
        
        // 焦段匹配
        Object.keys(scores).forEach(key => {
            if (a.focal && a.focal.includes(key)) scoreA += scores[key];
            if (b.focal && b.focal.includes(key)) scoreB += scores[key];
        });
        
        return scoreB - scoreA;
    });
}

// 显示筛选后的镜头群
function displayFilteredLensGroup(brand, lenses, brandName) {
    console.log('显示筛选后的镜头群:', brand, '数量:', lenses.length);
    
    const lensGroupSection = document.getElementById('lensGroupSection');
    const lensGroupBrandName = document.getElementById('lensGroupBrandName');
    const lensGroupGrid = document.getElementById('lensGroupGrid');
    
    if (!lensGroupSection || !lensGroupBrandName || !lensGroupGrid) {
        console.error('镜头群展示元素不存在');
        return;
    }
    
    // 获取当前选择的相机信息
    const selectedCamera = window.selectedCameraInfo;
    let compatibilityHint = '';
    
    if (selectedCamera && selectedCamera.brand === brand) {
        const mountInfo = selectedCamera.mount;
        const compatibility = selectedCamera.compatibility;
        
        if (compatibility) {
            const nativeMounts = compatibility.native.join(', ');
            const adapterMounts = compatibility.adapter.length > 0 ? compatibility.adapter.join(', ') : null;
            
            compatibilityHint = `<span style="color: var(--primary-color); font-size: 0.85em;">[${mountInfo}卡口]`;
            if (adapterMounts) {
                compatibilityHint += ` 原生:${nativeMounts} | 可转接:${adapterMounts}</span>`;
            } else {
                compatibilityHint += ` 原生:${nativeMounts}</span>`;
            }
        }
    }
    
    // 设置品牌名称和数量
    lensGroupBrandName.innerHTML = `${brandName} ${compatibilityHint} <span style="font-size: 0.7em; color: var(--text-secondary);">(${lenses.length}款匹配)</span>`;
    
    // 生成镜头群HTML
    let html = '';
    if (lenses.length === 0) {
        html = `
            <div class="lens-group-empty" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 15px; display: block;"></i>
                <p>没有找到匹配的镜头</p>
                <p style="font-size: 0.9em; color: var(--text-secondary);">请尝试放宽筛选条件</p>
            </div>
        `;
    } else {
        lenses.forEach((lens, index) => {
            const typeLabel = lens.type === 'prime' ? '定焦' : 
                             lens.type === 'zoom' ? '变焦' : 
                             lens.type === 'macro' ? '微距' : lens.type;
            const brandLabel = lens.brand === 'original' ? '原厂' : 
                              lens.brand === 'sigma' ? '适马' : 
                              lens.brand === 'tamron' ? '腾龙' : 
                              lens.brand === 'zeiss' ? '蔡司' : 
                              lens.brand === 'voigtlander' ? '福伦达' : '副厂';
            
            // 检查与已选相机的兼容性
            let compatibilityBadge = '';
            if (selectedCamera && selectedCamera.brand === brand) {
                const result = checkLensCompatibility(selectedCamera.brand, selectedCamera.model, brand, lens.name);
                if (result.compatible) {
                    if (result.method === 'native') {
                        compatibilityBadge = '<span class="lens-spec" style="background: #27ae60; color: white;">原生兼容</span>';
                    } else if (result.method === 'adapter') {
                        compatibilityBadge = '<span class="lens-spec" style="background: #f39c12; color: white;">需转接</span>';
                    }
                } else {
                    compatibilityBadge = '<span class="lens-spec" style="background: #e74c3c; color: white;">不兼容</span>';
                }
            }
            
            html += `
                <div class="lens-group-item" data-lens-index="${index}" data-lens-name="${lens.name}">
                    <h5><i class="fas fa-circle"></i> ${lens.name}</h5>
                    <div class="lens-specs">
                        <span class="lens-spec">${lens.focal}</span>
                        <span class="lens-spec">${lens.aperture}</span>
                        <span class="lens-spec">${typeLabel}</span>
                        <span class="lens-spec" style="background: var(--primary-color); color: white;">${brandLabel}</span>
                        ${compatibilityBadge}
                    </div>
                    <div class="lens-price">${lens.price}</div>
                    <div class="lens-desc">${lens.desc}</div>
                </div>
            `;
        });
    }
    
    lensGroupGrid.innerHTML = html;
    
    // 添加镜头点击事件
    lensGroupGrid.querySelectorAll('.lens-group-item').forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他选中状态
            lensGroupGrid.querySelectorAll('.lens-group-item').forEach(i => i.classList.remove('active'));
            // 添加当前选中状态
            this.classList.add('active');
            
            const lensName = this.getAttribute('data-lens-name');
            console.log('选中镜头:', lensName);
            
            // 检查兼容性并显示提示
            if (selectedCamera && selectedCamera.brand) {
                const result = checkLensCompatibility(selectedCamera.brand, selectedCamera.model, selectedCamera.brand, lensName);
                if (!result.compatible) {
                    alert(`兼容性警告：${result.reason}`);
                } else if (result.method === 'adapter') {
                    alert(`提示：${result.message}`);
                }
            }
        });
    });
    
    // 显示镜头群区域
    lensGroupSection.style.display = 'block';
    
    // 滚动到镜头群区域
    lensGroupSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 显示镜头群
function displayLensGroup(brand) {
    console.log('显示镜头群:', brand);
    
    const lensGroupSection = document.getElementById('lensGroupSection');
    const lensGroupBrandName = document.getElementById('lensGroupBrandName');
    const lensGroupGrid = document.getElementById('lensGroupGrid');
    
    if (!lensGroupSection || !lensGroupBrandName || !lensGroupGrid) {
        console.error('镜头群展示元素不存在');
        return;
    }
    
    const brandData = lensGroupDatabase[brand];
    if (!brandData) {
        console.error('找不到品牌数据:', brand);
        return;
    }
    
    // 设置品牌名称
    lensGroupBrandName.textContent = brandData.name;
    
    // 生成镜头群HTML
    let html = '';
    brandData.popularLenses.forEach((lens, index) => {
        html += `
            <div class="lens-group-item" data-lens-index="${index}">
                <h5><i class="fas fa-circle"></i> ${lens.name}</h5>
                <div class="lens-specs">
                    <span class="lens-spec">${lens.focal}</span>
                    <span class="lens-spec">${lens.aperture}</span>
                    <span class="lens-spec">${lens.type === 'prime' ? '定焦' : '变焦'}</span>
                </div>
                <div class="lens-price">${lens.price}</div>
                <div class="lens-desc">${lens.desc}</div>
            </div>
        `;
    });
    
    lensGroupGrid.innerHTML = html;
    
    // 添加镜头点击事件
    lensGroupGrid.querySelectorAll('.lens-group-item').forEach(item => {
        item.addEventListener('click', function() {
            // 移除其他选中状态
            lensGroupGrid.querySelectorAll('.lens-group-item').forEach(i => i.classList.remove('active'));
            // 添加当前选中状态
            this.classList.add('active');
            
            const index = this.getAttribute('data-lens-index');
            const lens = brandData.popularLenses[index];
            console.log('选中镜头:', lens.name);
            
            // 可以在这里添加更多交互，比如自动填充镜头类型等
        });
    });
    
    // 显示镜头群区域
    lensGroupSection.style.display = 'block';
    
    // 滚动到镜头群区域
    lensGroupSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 分析相机
function analyzeCamera() {
    console.log('analyzeCamera 被调用');
    const brand = document.getElementById('cameraBrand').value;
    const model = document.getElementById('cameraModel').value;
    const usage = document.getElementById('cameraUsage').value;
    const budget = document.getElementById('cameraBudget').value;
    
    console.log('品牌:', brand, '型号:', model, '用途:', usage, '预算:', budget);
    
    if (!brand || !model) {
        alert('请选择相机品牌和型号');
        return;
    }
    
    if (!cameraDatabase[brand]) {
        console.error('找不到品牌:', brand);
        alert('系统错误：找不到该品牌数据');
        return;
    }
    
    if (!cameraDatabase[brand].models[model]) {
        console.error('找不到型号:', model);
        alert('系统错误：找不到该型号数据');
        return;
    }
    
    const camera = cameraDatabase[brand].models[model];
    console.log('相机数据:', camera);
    
    // 验证预算级别是否匹配
    const cameraPriceLevel = camera.price;
    const budgetMismatch = checkBudgetMismatch(budget, cameraPriceLevel);
    
    if (budgetMismatch) {
        const priceNames = {
            entry: '入门级',
            mid: '中端',
            pro: '专业级',
            flagship: '旗舰级'
        };
        const confirmMessage = `您选择的 ${model} 属于「${priceNames[cameraPriceLevel] || cameraPriceLevel}」相机，\n与您设定的「${priceNames[budget] || budget}」预算不匹配。\n\n是否仍要查看该机型介绍？`;
        
        if (!confirm(confirmMessage)) {
            return; // 用户取消，不显示结果
        }
    }
    
    const result = generateCameraAnalysis(camera, model, usage, brand);
    console.log('分析结果:', result);
    
    displayEquipmentResult(result);
}

// 检查预算是否匹配
function checkBudgetMismatch(selectedBudget, cameraPriceLevel) {
    // 预算等级排序（从低到高）
    const priceOrder = ['entry', 'mid', 'pro', 'flagship'];
    const selectedIndex = priceOrder.indexOf(selectedBudget);
    const cameraIndex = priceOrder.indexOf(cameraPriceLevel);
    
    // 如果找不到对应等级，默认不匹配
    if (selectedIndex === -1 || cameraIndex === -1) {
        return true;
    }
    
    // 如果相机等级高于用户选择的预算等级，视为不匹配
    // 例如：用户选 entry(3000-6000)，但相机是 pro(12000-25000)
    if (cameraIndex > selectedIndex) {
        return true;
    }
    
    // 相机等级等于或低于预算等级，视为匹配
    return false;
}

// 获取相机价格区间（二手参考价）
function getCameraPriceRange(brand, model) {
    const camera = cameraDatabase[brand]?.models[model];
    if (!camera) return null;
    
    // 价格区间映射（二手市场参考价，人民币）
    const priceRanges = {
        entry: { min: 2000, max: 6000, label: '¥2000-6000' },
        mid: { min: 5000, max: 12000, label: '¥5000-12000' },
        pro: { min: 10000, max: 25000, label: '¥10000-25000' },
        flagship: { min: 20000, max: 80000, label: '¥20000-80000+' }
    };
    
    return priceRanges[camera.price] || null;
}

// 获取相机详细价格信息
function getCameraPriceInfo(brand, model) {
    const camera = cameraDatabase[brand]?.models[model];
    if (!camera) return null;
    
    const priceLevelNames = {
        entry: '入门级',
        mid: '中端',
        pro: '专业级',
        flagship: '旗舰级'
    };
    
    const priceRanges = {
        entry: { min: 2000, max: 6000, label: '¥2000-6000', desc: '适合初学者和预算有限的用户' },
        mid: { min: 5000, max: 12000, label: '¥5000-12000', desc: '性价比较高，功能全面' },
        pro: { min: 10000, max: 25000, label: '¥10000-25000', desc: '专业级性能，适合进阶用户' },
        flagship: { min: 20000, max: 80000, label: '¥20000-80000+', desc: '顶级性能，专业摄影师首选' }
    };
    
    const range = priceRanges[camera.price];
    
    return {
        level: camera.price,
        levelName: priceLevelNames[camera.price] || camera.price,
        range: range,
        isMediumFormat: camera.sensor === 'medium',
        isLeica: brand === 'leica',
        isHasselblad: brand === 'hasselblad'
    };
}

// 生成相机分析报告
function generateCameraAnalysis(camera, modelName, usage, brand) {
    const scores = {
        general: calculateCameraScore(camera, 'general'),
        portrait: calculateCameraScore(camera, 'portrait'),
        landscape: calculateCameraScore(camera, 'landscape'),
        sports: calculateCameraScore(camera, 'sports'),
        video: calculateCameraScore(camera, 'video'),
        lowlight: camera.lowLight
    };
    
    const bestUsage = camera.bestFor[0];
    const score = scores[usage] || scores.general;
    
    let rating = 'average';
    if (score >= 9) rating = 'excellent';
    else if (score >= 7) rating = 'good';
    
    const pros = [];
    const cons = [];
    
    if (camera.mp >= 40) pros.push('高像素，细节丰富');
    if (camera.lowLight >= 9) pros.push('优秀的高感表现');
    if (camera.video === '8K') pros.push('8K视频录制能力');
    if (camera.type === 'mirrorless') pros.push('轻便的无反设计');
    if (camera.sensor === 'fullframe') pros.push('全画幅传感器');
    if (camera.sensor === 'medium') pros.push('中画幅传感器，极致画质');
    
    if (camera.mp < 24) cons.push('像素较低，裁切空间有限');
    if (camera.lowLight < 7) cons.push('高感表现一般');
    if (camera.price === 'flagship') cons.push('价格较高');
    if (camera.sensor === 'apsc') cons.push('APS-C画幅，景深控制受限');
    if (camera.sensor === 'm43') cons.push('M43画幅，高感和虚化受限');
    if (camera.video === 'none') cons.push('无视频功能');
    if (camera.video === '1080p') cons.push('视频规格较旧');
    
    // 获取价格信息
    const priceInfo = getCameraPriceInfo(brand, modelName);
    const priceLevelNames = {
        entry: '入门级',
        mid: '中端',
        pro: '专业级',
        flagship: '旗舰级'
    };
    
    // 特殊品牌提示
    let specialNote = '';
    if (brand === 'leica') {
        specialNote = '<p style="color: #c9a227;"><i class="fas fa-crown"></i> <strong>徕卡品牌：</strong>德国精工，保值率高，镜头群独特</p>';
    } else if (brand === 'hasselblad') {
        specialNote = '<p style="color: #0066cc;"><i class="fas fa-gem"></i> <strong>哈苏中画幅：</strong>商业摄影首选，自然色彩科学</p>';
    }
    
    return {
        type: 'camera',
        title: modelName,
        subtitle: `${cameraDatabase[brand]?.name || ''} ${camera.type === 'mirrorless' ? '无反相机' : camera.type === 'dslr' ? '单反相机' : camera.type === 'compact' ? '便携相机' : camera.type === 'rangefinder' ? '旁轴相机' : camera.type === 'modular' ? '模块化相机' : camera.type === 'digitalback' ? '数码后背' : '相机'}`,
        score: score,
        rating: rating,
        icon: 'fa-camera',
        sections: [
            {
                title: '核心参数',
                icon: 'fa-microchip',
                content: `
                    <p><strong>传感器：</strong>${camera.sensor === 'fullframe' ? '全画幅' : camera.sensor === 'apsc' ? 'APS-C' : camera.sensor === 'm43' ? 'M43' : '中画幅'} (${camera.mp}MP)</p>
                    <p><strong>机身类型：</strong>${camera.type === 'mirrorless' ? '无反' : camera.type === 'dslr' ? '单反' : camera.type === 'compact' ? '便携' : camera.type === 'rangefinder' ? '旁轴' : camera.type === 'modular' ? '模块化' : camera.type === 'digitalback' ? '数码后背' : '专业'}</p>
                    <p><strong>视频能力：</strong>${camera.video === 'none' ? '无视频功能' : camera.video}</p>
                    <p><strong>高感评分：</strong>${camera.lowLight}/10</p>
                    ${specialNote}
                `
            },
            {
                title: '价格参考（二手市场）',
                icon: 'fa-tag',
                content: `
                    <p><strong>定位级别：</strong>${priceLevelNames[camera.price] || camera.price}</p>
                    <p><strong>参考价格：</strong>${priceInfo?.range?.label || '价格面议'}</p>
                    <p style="color: var(--text-secondary); font-size: 0.9em;">${priceInfo?.range?.desc || ''}</p>
                    <p style="color: #e74c3c; font-size: 0.85em; margin-top: 8px;"><i class="fas fa-info-circle"></i> 二手价格仅供参考，实际价格因成色、快门次数、配件等因素而异</p>
                `
            },
            {
                title: '适用场景评分',
                icon: 'fa-chart-bar',
                content: `
                    <ul>
                        <li>人像摄影：${'★'.repeat(Math.floor(scores.portrait / 2))}${'☆'.repeat(5 - Math.floor(scores.portrait / 2))} ${scores.portrait}/10</li>
                        <li>风光摄影：${'★'.repeat(Math.floor(scores.landscape / 2))}${'☆'.repeat(5 - Math.floor(scores.landscape / 2))} ${scores.landscape}/10</li>
                        <li>运动摄影：${'★'.repeat(Math.floor(scores.sports / 2))}${'☆'.repeat(5 - Math.floor(scores.sports / 2))} ${scores.sports}/10</li>
                        <li>视频拍摄：${'★'.repeat(Math.floor(scores.video / 2))}${'☆'.repeat(5 - Math.floor(scores.video / 2))} ${scores.video}/10</li>
                        <li>弱光环境：${'★'.repeat(Math.floor(scores.lowlight / 2))}${'☆'.repeat(5 - Math.floor(scores.lowlight / 2))} ${scores.lowlight}/10</li>
                    </ul>
                `
            }
        ],
        pros: pros,
        cons: cons,
        recommendation: `这款相机最适合${getUsageName(bestUsage)}。${camera.bestFor.includes(usage) ? '对于你的需求来说是很好的选择。' : '建议考虑其他更适合你需求的机型。'}`
    };
}

// 计算相机评分
function calculateCameraScore(camera, usage) {
    let score = 7;
    
    if (camera.bestFor.includes(usage)) score += 2;
    if (camera.sensor === 'fullframe') score += 0.5;
    if (camera.mp >= 40 && usage === 'landscape') score += 1;
    if (camera.lowLight >= 9 && (usage === 'lowlight' || usage === 'astro')) score += 1.5;
    if (camera.video === '8K' && usage === 'video') score += 1;
    
    return Math.min(10, Math.round(score));
}

// 分析镜头
function analyzeLens() {
    console.log('analyzeLens 被调用');
    const type = document.getElementById('lensType').value;
    const focal = document.getElementById('lensFocal').value;
    const aperture = document.getElementById('lensAperture').value;
    const scenario = document.getElementById('lensScenario').value;
    
    console.log('类型:', type, '场景:', scenario);
    
    if (!type) {
        alert('请选择镜头类型');
        return;
    }
    
    if (!lensDatabase[type]) {
        console.error('找不到镜头类型:', type);
        alert('系统错误：找不到该镜头类型数据');
        return;
    }
    
    const lens = lensDatabase[type];
    console.log('镜头数据:', lens);
    
    const result = generateLensAnalysis(lens, type, focal, aperture, scenario);
    console.log('分析结果:', result);
    
    displayEquipmentResult(result);
}

// 生成镜头分析报告
function generateLensAnalysis(lens, type, focal, aperture, scenario) {
    let score = 7;
    if (lens.recommendations[scenario]) score += 2;
    if (aperture === 'f14' || aperture === 'f18') score += 1;
    
    let rating = 'average';
    if (score >= 9) rating = 'excellent';
    else if (score >= 7) rating = 'good';
    
    const recommendations = lens.recommendations[scenario] || lens.recommendations.general || [];
    
    return {
        type: 'lens',
        title: lens.name,
        subtitle: lens.description,
        score: score,
        rating: rating,
        icon: 'fa-circle',
        sections: [
            {
                title: '镜头特性',
                icon: 'fa-info-circle',
                content: `<p>${lens.description}</p>`
            },
            {
                title: '适用场景推荐',
                icon: 'fa-lightbulb',
                content: recommendations.length > 0 
                    ? `<p>针对${getUsageName(scenario)}拍摄，推荐以下镜头：</p><ul>${recommendations.map(r => `<li>${r}</li>`).join('')}</ul>`
                    : '<p>该类型镜头适用于多种场景，建议根据具体需求选择焦段。</p>'
            }
        ],
        pros: lens.pros,
        cons: lens.cons,
        recommendation: type === 'prime' 
            ? '定焦镜头适合追求画质和虚化效果的摄影师，建议从50mm f/1.8入门。'
            : '变焦镜头适合需要灵活构图的场合，是旅行和活动的理想选择。'
    };
}

// 推荐设备组合（基于用户实际选择的相机和镜头）
function recommendCombo() {
    console.log('recommendCombo 被调用');
    
    // 检查是否有通过递进式选择的套装
    if (comboSelection.cameraBrand && comboSelection.cameraModel && comboSelection.lens) {
        // 使用用户实际选择的相机和镜头生成详细报告
        const result = generateDetailedComboReport();
        console.log('详细套装报告:', result);
        displayEquipmentResult(result);
        return;
    }
    
    // 如果没有递进式选择的数据，使用旧的通用推荐逻辑
    const subject = document.getElementById('comboSubject')?.value;
    const budget = document.getElementById('comboBudget')?.value;
    
    if (!subject) {
        alert('请先完成套装选择流程，或选择拍摄主题');
        return;
    }
    
    const result = generateComboRecommendation(subject, budget, '', '');
    console.log('推荐结果:', result);
    displayEquipmentResult(result);
}

// 生成详细的套装评估报告
function generateDetailedComboReport() {
    const brand = comboSelection.cameraBrand;
    const model = comboSelection.cameraModel;
    const cameraData = comboSelection.cameraData;
    const lens = comboSelection.lens;
    
    const brandName = cameraDatabase[brand]?.name || brand;
    const cameraPrice = getCameraPrice(brand, model);
    const lensPrice = lens?.priceNum || 3000;
    const totalPrice = cameraPrice + lensPrice;
    
    // 获取传感器类型
    const sensorType = cameraData?.sensor === 'fullframe' ? '全画幅' : 
                       cameraData?.sensor === 'apsc' ? 'APS-C' :
                       cameraData?.sensor === 'medium' ? '中画幅' :
                       cameraData?.sensor === 'm43' ? 'M43' : cameraData?.sensor || '未知';
    
    // 获取兼容性信息
    const compatMethod = lens?.compatibility?.method || 'native';
    const isNative = compatMethod === 'native';
    
    // 分析套装匹配度
    const analysis = analyzeComboMatch(cameraData, lens);
    
    // 生成优缺点
    const pros = [];
    const cons = [];
    
    // 相机优点
    if (cameraData.mp >= 40) pros.push(`${cameraData.mp}MP高像素，细节丰富`);
    if (cameraData.lowLight >= 9) pros.push('优秀的高感表现，夜景能力强');
    if (cameraData.video === '8K') pros.push('8K视频录制，未来-proof');
    if (cameraData.video === '4K') pros.push('4K视频录制能力');
    if (cameraData.sensor === 'fullframe') pros.push('全画幅传感器，景深控制好');
    if (cameraData.sensor === 'medium') pros.push('中画幅传感器，极致画质');
    if (cameraData.type === 'mirrorless') pros.push('无反设计，轻便便携');
    
    // 镜头优点
    if (lens.apertureNum <= 1.4) pros.push(`f/${lens.apertureNum}大光圈，虚化效果出色`);
    if (lens.apertureNum <= 1.8) pros.push('大光圈设计，弱光性能好');
    if (lens.type === 'zoom') pros.push(`变焦设计，焦段覆盖${lens.focal}，使用方便`);
    if (lens.type === 'prime') pros.push('定焦设计，画质更锐利');
    if (lens.type === 'macro') pros.push('微距功能，可拍摄细节特写');
    
    // 兼容性优点/缺点
    if (isNative) {
        pros.push(`${cameraData.mount}卡口原生兼容，性能发挥完整`);
    } else {
        pros.push(`可通过转接环使用${lens.compatibility?.lensMount}镜头，扩展镜头群`);
        cons.push('转接使用，可能影响对焦速度和防抖性能');
    }
    
    // 相机缺点
    if (cameraData.mp < 24) cons.push('像素较低，后期裁切空间有限');
    if (cameraData.lowLight < 7) cons.push('高感表现一般，夜景拍摄受限');
    if (cameraData.price === 'flagship') cons.push('旗舰定位，价格较高');
    if (cameraData.sensor === 'apsc') cons.push('APS-C画幅，虚化效果受限');
    if (cameraData.sensor === 'm43') cons.push('M43画幅，高感和虚化能力有限');
    if (cameraData.video === 'none') cons.push('无视频功能');
    if (cameraData.video === '1080p') cons.push('视频规格较旧，不支持4K');
    
    // 套装缺点
    if (lens.apertureNum >= 4) cons.push('光圈较小，虚化效果有限');
    if (lens.focalMin > 50) cons.push('缺少广角端，室内拍摄受限');
    
    // 适用场景评分
    const usageScores = calculateComboUsageScores(cameraData, lens);
    
    // 性价比评估
    const valueRating = calculateValueRating(totalPrice, cameraData, lens);
    
    return {
        type: 'combo',
        title: `${brandName} ${model} + ${lens.name}`,
        subtitle: `套装总价参考：¥${totalPrice.toLocaleString()}`,
        score: analysis.matchScore,
        rating: analysis.matchScore >= 9 ? 'excellent' : analysis.matchScore >= 7 ? 'good' : 'average',
        icon: 'fa-layer-group',
        sections: [
            {
                title: '套装配置',
                icon: 'fa-camera',
                content: `
                    <div class="combo-detail-grid">
                        <div class="combo-detail-item">
                            <h6><i class="fas fa-camera"></i> 机身</h6>
                            <p><strong>${brandName} ${model}</strong></p>
                            <p>${sensorType} · ${cameraData.mp}MP · ${cameraData.mount}卡口</p>
                            <p>参考价格：¥${cameraPrice.toLocaleString()}</p>
                        </div>
                        <div class="combo-detail-item">
                            <h6><i class="fas fa-circle"></i> 镜头</h6>
                            <p><strong>${lens.name}</strong></p>
                            <p>${lens.focal} · ${lens.aperture} · ${lens.type === 'prime' ? '定焦' : lens.type === 'zoom' ? '变焦' : '微距'}</p>
                            <p>参考价格：${lens.price}</p>
                        </div>
                    </div>
                    <div class="compatibility-status ${isNative ? 'native' : 'adapter'}">
                        <i class="fas ${isNative ? 'fa-check-circle' : 'fa-plug'}"></i>
                        <span>${isNative ? '原生兼容 - 性能发挥完整' : `需转接环 - ${lens.compatibility?.lensMount}转${cameraData.mount}`}</span>
                    </div>
                `
            },
            {
                title: '适用场景评分',
                icon: 'fa-chart-bar',
                content: `
                    <div class="usage-scores">
                        <div class="score-item">
                            <span>人像摄影</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${usageScores.portrait * 10}%"></div>
                            </div>
                            <span class="score-value">${usageScores.portrait}/10</span>
                        </div>
                        <div class="score-item">
                            <span>风光摄影</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${usageScores.landscape * 10}%"></div>
                            </div>
                            <span class="score-value">${usageScores.landscape}/10</span>
                        </div>
                        <div class="score-item">
                            <span>街拍纪实</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${usageScores.street * 10}%"></div>
                            </div>
                            <span class="score-value">${usageScores.street}/10</span>
                        </div>
                        <div class="score-item">
                            <span>旅行摄影</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${usageScores.travel * 10}%"></div>
                            </div>
                            <span class="score-value">${usageScores.travel}/10</span>
                        </div>
                        <div class="score-item">
                            <span>弱光环境</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${usageScores.lowlight * 10}%"></div>
                            </div>
                            <span class="score-value">${usageScores.lowlight}/10</span>
                        </div>
                    </div>
                `
            },
            {
                title: '性价比分析',
                icon: 'fa-balance-scale',
                content: `
                    <div class="value-analysis">
                        <div class="value-rating ${valueRating.level}">
                            <span class="rating-label">性价比评级</span>
                            <span class="rating-stars">${'★'.repeat(valueRating.stars)}${'☆'.repeat(5 - valueRating.stars)}</span>
                            <span class="rating-text">${valueRating.text}</span>
                        </div>
                        <p class="value-desc">${valueRating.description}</p>
                        <div class="price-breakdown">
                            <p><strong>价格构成：</strong></p>
                            <p>机身：¥${cameraPrice.toLocaleString()} (${Math.round(cameraPrice/totalPrice*100)}%)</p>
                            <p>镜头：¥${lensPrice.toLocaleString()} (${Math.round(lensPrice/totalPrice*100)}%)</p>
                            <p class="total">总计：¥${totalPrice.toLocaleString()}</p>
                        </div>
                    </div>
                `
            }
        ],
        pros: pros,
        cons: cons,
        recommendation: generateComboRecommendationText(cameraData, lens, analysis, usageScores)
    };
}

// 显示详细推荐报告
function showDetailedRecommendation() {
    // 检查是否有选择数据
    if (!comboSelection.cameraBrand || !comboSelection.cameraModel || !comboSelection.lens) {
        alert('请先完成相机和镜头的选择');
        return;
    }
    
    // 生成详细报告
    const report = generateDetailedComboReport();
    
    // 显示结果
    displayEquipmentResult(report);
    
    // 滚动到结果区域
    const resultSection = document.getElementById('equipmentResult');
    if (resultSection) {
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 显示AI分析
function showAIAnalysis() {
    // 检查是否有选择数据
    if (!comboSelection.cameraBrand || !comboSelection.cameraModel || !comboSelection.lens) {
        alert('请先完成相机和镜头的选择');
        return;
    }
    
    const brandName = cameraDatabase[comboSelection.cameraBrand]?.name || comboSelection.cameraBrand;
    const camera = comboSelection.cameraModel;
    const lens = comboSelection.lens;
    
    // 构建AI分析提示
    const prompt = `请分析以下相机套装组合：

机身：${brandName} ${camera}
镜头：${lens.name} (${lens.focal} ${lens.aperture})

请从以下角度分析：
1. 这套组合的优势和特点
2. 最适合的拍摄场景
3. 可能的局限性
4. 使用建议

请用中文回答，语言简洁专业。`;

    // 显示AI分析模态框
    showKnowledgeModal('🤖 AI 套装分析', `
        <div class="ai-analysis-loading">
            <i class="fas fa-robot fa-3x fa-spin"></i>
            <p>AI正在分析您的套装组合...</p>
            <p class="ai-note">分析基于器材参数和摄影知识库</p>
        </div>
        <div class="ai-analysis-result" style="display: none;">
            <div class="ai-header">
                <i class="fas fa-robot"></i>
                <span>AI 分析结果</span>
            </div>
            <div class="ai-content" id="aiAnalysisContent"></div>
        </div>
    `);
    
    // 模拟AI分析（实际项目中可以接入真实的AI API）
    setTimeout(() => {
        const analysis = generateSimulatedAIAnalysis(comboSelection);
        document.querySelector('.ai-analysis-loading').style.display = 'none';
        document.querySelector('.ai-analysis-result').style.display = 'block';
        document.getElementById('aiAnalysisContent').innerHTML = analysis;
    }, 1500);
}

// 生成模拟AI分析（实际项目中替换为真实AI调用）
function generateSimulatedAIAnalysis(selection) {
    const brandName = cameraDatabase[selection.cameraBrand]?.name || selection.cameraBrand;
    const camera = selection.cameraModel;
    const lens = selection.lens;
    const cameraData = selection.cameraData;
    
    let analysis = `<div class="ai-section">`;
    
    // 套装概述
    analysis += `<h4><i class="fas fa-star"></i> 套装概述</h4>`;
    analysis += `<p><strong>${brandName} ${camera}</strong> 搭配 <strong>${lens.name}</strong> 是一套`;
    
    if (cameraData.sensor === 'fullframe') {
        analysis += `全画幅`;
    } else if (cameraData.sensor === 'apsc') {
        analysis += `APS-C画幅`;
    } else if (cameraData.sensor === 'm43') {
        analysis += `M43画幅`;
    }
    
    if (lens.type === 'prime') {
        analysis += `定焦组合，画质锐利，适合追求极致画质的用户。`;
    } else {
        analysis += `变焦组合，焦段灵活，适合多种拍摄场景。`;
    }
    analysis += `</p>`;
    
    // 优势分析
    analysis += `<h4><i class="fas fa-thumbs-up"></i> 核心优势</h4><ul>`;
    
    if (cameraData.mp >= 40) {
        analysis += `<li><strong>高像素优势：</strong>${cameraData.mp}MP传感器可捕捉丰富细节，适合大幅面输出和后期裁切。</li>`;
    }
    
    if (lens.apertureNum <= 1.8) {
        analysis += `<li><strong>大光圈虚化：</strong>f/${lens.apertureNum}大光圈可营造柔美虚化效果，人像和弱光拍摄表现出色。</li>`;
    }
    
    if (cameraData.lowLight >= 8) {
        analysis += `<li><strong>弱光能力：</strong>机身高感表现优秀，配合大光圈镜头，夜景拍摄无压力。</li>`;
    }
    
    if (cameraData.video === '4K' || cameraData.video === '8K') {
        analysis += `<li><strong>视频能力：</strong>支持${cameraData.video}录制，满足专业视频创作需求。</li>`;
    }
    
    analysis += `</ul>`;
    
    // 适用场景
    analysis += `<h4><i class="fas fa-camera"></i> 推荐场景</h4><ul>`;
    
    if (lens.focalMin <= 35 && lens.focalMax >= 50) {
        analysis += `<li><strong>人文街拍：</strong>焦段覆盖经典人文视角，适合记录生活瞬间。</li>`;
    }
    
    if (lens.focalMin <= 24) {
        analysis += `<li><strong>风光建筑：</strong>广角端可拍摄壮阔风光和建筑空间。</li>`;
    }
    
    if (lens.focalMax >= 85 || lens.focalMin >= 50) {
        analysis += `<li><strong>人像摄影：</strong>中长焦段配合大光圈，人像虚化效果出色。</li>`;
    }
    
    if (lens.type === 'macro') {
        analysis += `<li><strong>微距特写：</strong>微距功能可拍摄花卉、昆虫等细节题材。</li>`;
    }
    
    analysis += `</ul>`;
    
    // 使用建议
    analysis += `<h4><i class="fas fa-lightbulb"></i> 使用建议</h4><ul>`;
    
    if (lens.type === 'prime') {
        analysis += `<li>定焦镜头需要"用脚变焦"，多走动寻找最佳构图角度。</li>`;
    }
    
    if (lens.apertureNum <= 1.4) {
        analysis += `<li>超大光圈景深极浅，拍摄时注意对焦精度，建议使用单点对焦。</li>`;
    }
    
    if (cameraData.mp >= 40) {
        analysis += `<li>高像素文件较大，建议使用高速SD卡并注意存储空间管理。</li>`;
    }
    
    analysis += `<li>建议多尝试不同光圈值，找到镜头的最佳画质光圈（通常为f/5.6-f/8）。</li>`;
    analysis += `</ul>`;
    
    // 局限性
    analysis += `<h4><i class="fas fa-exclamation-triangle"></i> 注意事项</h4><ul>`;
    
    if (cameraData.sensor === 'apsc' || cameraData.sensor === 'm43') {
        const cropFactor = cameraData.sensor === 'apsc' ? '1.5x' : '2x';
        analysis += `<li>APS-C/M43画幅有${cropFactor}等效系数，实际视角比标称焦段更窄。</li>`;
    }
    
    if (lens.focalMin > 24 && lens.focalMax < 85) {
        analysis += `<li>当前焦段缺少广角和长焦，风光和远摄题材受限，可考虑后续添置其他镜头。</li>`;
    }
    
    analysis += `</ul>`;
    
    analysis += `</div>`;
    
    return analysis;
}

// 分析套装匹配度
function analyzeComboMatch(camera, lens) {
    let score = 7; // 基础分
    let reasons = [];
    
    // 传感器与镜头匹配
    if (camera.sensor === 'fullframe' && lens.focalMin >= 24) {
        score += 1;
        reasons.push('全画幅配标准/长焦镜头，焦段合理');
    }
    
    // 光圈与机身高感配合
    if (lens.apertureNum <= 2.8 && camera.lowLight >= 8) {
        score += 1;
        reasons.push('大光圈配合高感机身，弱光能力强');
    }
    
    // 定焦配高像素
    if (lens.type === 'prime' && camera.mp >= 40) {
        score += 0.5;
        reasons.push('定焦镜头可发挥高像素优势');
    }
    
    // 变焦便利性
    if (lens.type === 'zoom' && lens.focalMax / lens.focalMin >= 3) {
        score += 0.5;
        reasons.push('大变焦比，使用灵活');
    }
    
    // 微距配高像素
    if (lens.type === 'macro' && camera.mp >= 30) {
        score += 1;
        reasons.push('微距镜头配高像素机身，细节丰富');
    }
    
    return {
        matchScore: Math.min(10, Math.round(score)),
        reasons: reasons
    };
}

// 计算套装在各场景的得分
function calculateComboUsageScores(camera, lens) {
    const scores = {
        portrait: 5,
        landscape: 5,
        street: 5,
        travel: 5,
        lowlight: 5
    };
    
    // 人像评分
    if (lens.focalMin <= 85 && lens.focalMax >= 85) scores.portrait += 3;
    else if (lens.focalMin >= 50 && lens.focalMax <= 135) scores.portrait += 2;
    if (lens.apertureNum <= 1.8) scores.portrait += 2;
    else if (lens.apertureNum <= 2.8) scores.portrait += 1;
    if (camera.sensor === 'fullframe') scores.portrait += 1;
    
    // 风光评分
    if (lens.focalMin <= 35) scores.landscape += 3;
    else if (lens.focalMin <= 50) scores.landscape += 1;
    if (camera.mp >= 40) scores.landscape += 2;
    else if (camera.mp >= 30) scores.landscape += 1;
    if (lens.apertureNum <= 4) scores.landscape += 1;
    
    // 街拍评分
    if (lens.focalMin <= 35 && lens.focalMax >= 35) scores.street += 3;
    else if (lens.focalMin <= 50) scores.street += 2;
    if (lens.apertureNum <= 2) scores.street += 2;
    if (camera.type === 'mirrorless') scores.street += 1;
    
    // 旅行评分
    if (lens.type === 'zoom' && lens.focalMax / lens.focalMin >= 3) scores.travel += 3;
    if (lens.focalMin <= 24 && lens.focalMax >= 70) scores.travel += 2;
    if (camera.type === 'mirrorless') scores.travel += 1;
    
    // 弱光评分
    if (lens.apertureNum <= 1.4) scores.lowlight += 3;
    else if (lens.apertureNum <= 1.8) scores.lowlight += 2;
    else if (lens.apertureNum <= 2.8) scores.lowlight += 1;
    if (camera.lowLight >= 9) scores.lowlight += 2;
    else if (camera.lowLight >= 8) scores.lowlight += 1;
    
    // 限制最高分
    for (let key in scores) {
        scores[key] = Math.min(10, Math.round(scores[key]));
    }
    
    return scores;
}

// 计算性价比评级
function calculateValueRating(totalPrice, camera, lens) {
    const priceLevel = totalPrice < 10000 ? 'budget' : 
                       totalPrice < 20000 ? 'mid' : 
                       totalPrice < 40000 ? 'high' : 'pro';
    
    let stars = 3;
    let text = '中等';
    let description = '';
    
    // 根据配置评估性价比
    if (camera.sensor === 'fullframe' && totalPrice < 15000) {
        stars = 5;
        text = '极高';
        description = '全画幅配置价格亲民，性价比出色';
    } else if (camera.mp >= 40 && lens.apertureNum <= 2.8 && totalPrice < 30000) {
        stars = 4;
        text = '高';
        description = '高像素+大光圈组合，价格合理';
    } else if (camera.price === 'flagship' && lens.apertureNum <= 1.4) {
        stars = 3;
        text = '中等';
        description = '旗舰配置，性能卓越但价格较高';
    } else if (totalPrice > 50000) {
        stars = 2;
        text = '一般';
        description = '顶级配置，适合专业用户';
    } else {
        description = '配置均衡，符合该价位预期';
    }
    
    return {
        level: priceLevel,
        stars: stars,
        text: text,
        description: description
    };
}

// 生成套装推荐文字
function generateComboRecommendationText(camera, lens, analysis, usageScores) {
    const bestUsage = Object.entries(usageScores).sort((a, b) => b[1] - a[1])[0];
    const usageNames = {
        portrait: '人像摄影',
        landscape: '风光摄影',
        street: '街拍纪实',
        travel: '旅行摄影',
        lowlight: '弱光拍摄'
    };
    
    let text = `这套组合最适合${usageNames[bestUsage[0]]}，在该场景下可获得最佳效果。`;
    
    // 添加具体建议
    if (lens.type === 'prime') {
        text += '定焦镜头画质出色，建议通过移动构图来获得理想画面。';
    } else if (lens.type === 'zoom') {
        text += '变焦镜头使用方便，建议多尝试不同焦段来找到最佳视角。';
    }
    
    if (lens.compatibility?.method === 'adapter') {
        text += '注意：转接使用可能影响部分自动功能，建议购买品牌官方转接环。';
    }
    
    if (camera.mp >= 40) {
        text += '高像素机身可捕捉丰富细节，建议搭配高速存储卡。';
    }
    
    return text;
}

// 生成组合推荐
function generateComboRecommendation(subject, budget) {
    const combos = {
        portrait: {
            budget: { body: '佳能 EOS R8', lens: 'RF 50mm f/1.8 + RF 85mm f/2', price: '约 ¥12,000', desc: '全画幅入门，大光圈定焦组合' },
            mid: { body: '索尼 A7 IV', lens: 'FE 85mm f/1.8 + FE 50mm f/1.8', price: '约 ¥18,000', desc: '均衡性能，专业人像组合' },
            high: { body: '佳能 EOS R6 II', lens: 'RF 85mm f/1.2 + RF 50mm f/1.2', price: '约 ¥35,000', desc: '顶级画质，极致虚化' },
            pro: { body: '索尼 A7R V', lens: 'FE 85mm f/1.4 GM + FE 50mm f/1.2 GM', price: '约 ¥50,000', desc: '旗舰画质，专业工作室配置' }
        },
        landscape: {
            budget: { body: '尼康 Z5', lens: 'Z 24-70mm f/4 + Z 14-30mm f/4', price: '约 ¥12,000', desc: '全画幅入门，广角变焦组合' },
            mid: { body: '索尼 A7C II', lens: 'FE 16-35mm f/4 + FE 24-105mm f/4', price: '约 ¥18,000', desc: '轻便高画质，旅行风光首选' },
            high: { body: '尼康 Z7 II', lens: 'Z 14-24mm f/2.8 + Z 24-70mm f/2.8', price: '约 ¥35,000', desc: '高像素+顶级广角，风光利器' },
            pro: { body: '索尼 A7R V', lens: 'FE 12-24mm f/2.8 GM + FE 24-70mm f/2.8 GM', price: '约 ¥55,000', desc: '6100万像素，顶级风光配置' }
        },
        street: {
            budget: { body: '富士 X-T30 II', lens: 'XF 23mm f/2 + XF 35mm f/2', price: '约 ¥8,000', desc: '复古造型，街拍经典焦段' },
            mid: { body: '富士 X-T5', lens: 'XF 23mm f/1.4 + XF 35mm f/1.4', price: '约 ¥18,000', desc: '4000万像素，街拍旗舰' },
            high: { body: '索尼 A7C II', lens: 'FE 35mm f/1.4 GM', price: '约 ¥22,000', desc: '全画幅便携，顶级35mm' },
            pro: { body: '徕卡 Q3', lens: '固定 28mm f/1.7', price: '约 ¥45,000', desc: '纯粹街拍，顶级画质' }
        },
        video: {
            budget: { body: '松下 GH6', lens: '12-35mm f/2.8 II', price: '约 ¥12,000', desc: 'M43视频旗舰，专业 codec' },
            mid: { body: '索尼 FX30', lens: 'E 16-55mm f/2.8 G', price: '约 ¥15,000', desc: '电影机画质，APS-C 视频首选' },
            high: { body: '松下 S5 IIx', lens: '24-70mm f/2.8', price: '约 ¥22,000', desc: '全画幅视频，专业录制' },
            pro: { body: '索尼 FX3', lens: 'FE 24-70mm f/2.8 GM II', price: '约 ¥35,000', desc: '电影机标准，专业视频配置' }
        },
        wedding: {
            budget: { body: '佳能 EOS R8', lens: 'RF 24-105mm f/4', price: '约 ¥12,000', desc: '全画幅入门，标准变焦覆盖' },
            mid: { body: '索尼 A7 IV', lens: 'FE 24-70mm f/2.8 + FE 85mm f/1.8', price: '约 ¥22,000', desc: '变焦+定焦组合，灵活应对' },
            high: { body: '佳能 EOS R6 II', lens: 'RF 24-70mm f/2.8 + RF 85mm f/1.2', price: '约 ¥35,000', desc: '双机配置，专业婚礼摄影' },
            pro: { body: '索尼 A1', lens: 'FE 24-70mm f/2.8 GM + FE 70-200mm f/2.8 GM', price: '约 ¥65,000', desc: '双旗舰配置，顶级婚礼团队' }
        },
        sports: {
            budget: { body: '佳能 EOS R7', lens: 'RF 100-400mm f/5.6-8', price: '约 ¥10,000', desc: 'APS-C旗舰，长焦入门' },
            mid: { body: '索尼 A6700', lens: 'E 70-350mm f/4.5-6.3', price: '约 ¥13,000', desc: '轻便长焦组合，运动入门' },
            high: { body: '佳能 EOS R6 II', lens: 'RF 100-500mm f/4.5-7.1', price: '约 ¥28,000', desc: '全画幅+长焦，专业体育' },
            pro: { body: '索尼 A1', lens: 'FE 400mm f/2.8 GM', price: '约 ¥80,000', desc: '旗舰机身+顶级长焦' }
        },
        macro: {
            budget: { body: '索尼 A6400', lens: 'E 30mm f/3.5 Macro', price: '约 ¥6,000', desc: 'APS-C微距入门' },
            mid: { body: '佳能 EOS R8', lens: 'RF 100mm f/2.8 Macro', price: '约 ¥15,000', desc: '全画幅+百微经典组合' },
            high: { body: '索尼 A7 IV', lens: 'FE 90mm f/2.8 Macro G', price: '约 ¥22,000', desc: '专业微距配置' },
            pro: { body: '佳能 EOS R5', lens: 'RF 100mm f/2.8 Macro + 闪光灯', price: '约 ¥35,000', desc: '高像素微距，商业摄影' }
        },
        astro: {
            budget: { body: '尼康 Z5', lens: 'Z 20mm f/1.8', price: '约 ¥12,000', desc: '全画幅入门+大光圈广角' },
            mid: { body: '索尼 A7C II', lens: 'FE 20mm f/1.8 G', price: '约 ¥18,000', desc: '轻便高感，星空利器' },
            high: { body: '索尼 A7S III', lens: 'FE 14mm f/1.8 GM', price: '约 ¥35,000', desc: '顶级高感+超广角' },
            pro: { body: '尼康 Z8', lens: 'Z 14-24mm f/2.8 + 赤道仪', price: '约 ¥45,000', desc: '专业深空摄影配置' }
        },
        travel: {
            budget: { body: '索尼 A6400', lens: '18-135mm f/3.5-5.6', price: '约 ¥7,000', desc: '一镜走天下，轻便旅行' },
            mid: { body: '佳能 EOS R8', lens: 'RF 24-240mm f/4-6.3', price: '约 ¥13,000', desc: '全画幅大变焦，旅行首选' },
            high: { body: '索尼 A7C II', lens: 'FE 24-200mm f/2.8-5.6', price: '约 ¥22,000', desc: '轻便高画质，旅行旗舰' },
            pro: { body: '徕卡 Q3', lens: '固定 28mm f/1.7', price: '约 ¥45,000', desc: '顶级便携，旅行摄影' }
        }
    };
    
    const defaultCombo = {
        budget: { body: '索尼 A6400', lens: '18-135mm', price: '约 ¥7,000', desc: '入门全能组合' },
        mid: { body: '佳能 EOS R8', lens: '24-50mm + 50mm f/1.8', price: '约 ¥13,000', desc: '全画幅入门组合' },
        high: { body: '索尼 A7 IV', lens: '24-70mm f/2.8', price: '约 ¥28,000', desc: '专业全能组合' },
        pro: { body: '佳能 EOS R5', lens: 'RF 24-70mm f/2.8', price: '约 ¥40,000', desc: '旗舰全能组合' }
    };
    
    const combo = (combos[subject] || defaultCombo)[budget];
    
    console.log('选择的组合:', combo);
    
    if (!combo) {
        console.error('找不到对应的组合配置:', subject, budget);
        return {
            type: 'combo',
            title: getUsageName(subject) + '推荐配置',
            subtitle: `预算级别：${getBudgetName(budget)}`,
            score: 8,
            rating: 'good',
            icon: 'fa-layer-group',
            sections: [
                {
                    title: '推荐组合',
                    icon: 'fa-camera',
                    content: '<p>暂无该预算级别的具体推荐，建议咨询专业摄影师。</p>'
                }
            ],
            pros: ['可根据需求定制'],
            cons: ['需要进一步咨询'],
            recommendation: '建议根据实际预算和需求，咨询专业摄影师获取个性化推荐。'
        };
    }
    
    return {
        type: 'combo',
        title: getUsageName(subject) + '推荐配置',
        subtitle: `预算级别：${getBudgetName(budget)}`,
        score: 9,
        rating: 'excellent',
        icon: 'fa-layer-group',
        sections: [
            {
                title: '推荐组合',
                icon: 'fa-camera',
                content: `
                    <div class="recommendation-cards">
                        <div class="rec-card best">
                            <h5><i class="fas fa-camera"></i> 机身</h5>
                            <p class="price">${combo.body}</p>
                            <p>${combo.desc}</p>
                        </div>
                        <div class="rec-card best">
                            <h5><i class="fas fa-circle"></i> 镜头</h5>
                            <p class="price">${combo.lens}</p>
                            <p>针对${getUsageName(subject)}优化的焦段组合</p>
                        </div>
                    </div>
                    <p style="margin-top: 15px; text-align: center; font-weight: 600; color: var(--primary-color);">
                        <i class="fas fa-tag"></i> 参考总价：${combo.price}
                    </p>
                `
            }
        ],
        pros: ['针对特定场景优化', '性价比高', '扩展性强'],
        cons: budget === 'budget' ? ['性能有限', '升级空间小'] : budget === 'pro' ? ['价格较高', '重量较大'] : ['需要一定学习成本'],
        recommendation: `这是${getUsageName(subject)}的理想入门/进阶配置，可根据实际需求调整。`
    };
}

// 辅助函数
function getBrandByModel(modelName) {
    for (const [brand, data] of Object.entries(cameraDatabase)) {
        if (data.models[modelName]) return brand;
    }
    return null;
}

function getUsageName(usage) {
    const names = {
        general: '通用拍摄',
        portrait: '人像摄影',
        landscape: '风光摄影',
        sports: '运动摄影',
        wildlife: '野生动物',
        video: '视频拍摄',
        astro: '星空摄影',
        lowlight: '弱光环境',
        street: '街头摄影',
        wedding: '婚礼摄影',
        macro: '微距摄影',
        travel: '旅行摄影'
    };
    const result = names[usage] || usage;
    console.log('getUsageName:', usage, '=>', result);
    return result;
}

function getBudgetName(budget) {
    const names = {
        budget: '经济型',
        mid: '中端',
        high: '高端',
        pro: '专业级'
    };
    return names[budget] || budget;
}

// 从EXIF自动填充设备信息
function autoFillEquipmentFromExif(exifData) {
    const make = exifData.Make || exifData.make;
    const model = exifData.Model || exifData.model;
    const lensModel = exifData.LensModel || exifData.lensModel;
    
    if (make) {
        // 转换品牌名称为小写key
        const brandMap = {
            'Canon': 'canon',
            'Canon ': 'canon',
            'NIKON': 'nikon',
            'Nikon': 'nikon',
            'SONY': 'sony',
            'Sony': 'sony',
            'FUJIFILM': 'fujifilm',
            'Fujifilm': 'fujifilm',
            'Panasonic': 'panasonic',
            'OLYMPUS': 'olympus',
            'Olympus': 'olympus'
        };
        
        const brandKey = brandMap[make] || make.toLowerCase().replace(/\s+/g, '');
        const brandSelect = document.getElementById('cameraBrand');
        
        if (brandSelect && cameraDatabase[brandKey]) {
            brandSelect.value = brandKey;
            
            // 触发change事件更新型号列表
            brandSelect.dispatchEvent(new Event('change'));
            
            // 尝试匹配型号
            if (model) {
                setTimeout(() => {
                    const modelSelect = document.getElementById('cameraModel');
                    if (modelSelect) {
                        // 清理型号字符串
                        const cleanModel = model.replace(make, '').trim();
                        
                        // 尝试找到匹配的选项
                        for (const option of modelSelect.options) {
                            if (option.value && (cleanModel.includes(option.value) || option.value.includes(cleanModel))) {
                                modelSelect.value = option.value;
                                break;
                            }
                        }
                    }
                }, 100);
            }
        }
    }
    
    // 显示提示
    const resultContainer = document.getElementById('equipmentResult');
    if (resultContainer) {
        resultContainer.innerHTML = `
            <div class="analysis-section">
                <h4><i class="fas fa-info-circle"></i> 已自动识别设备信息</h4>
                <p>相机: ${make || '未知'} ${model || ''}</p>
                ${lensModel ? `<p>镜头: ${lensModel}</p>` : ''}
                <p style="margin-top: 10px; color: var(--text-secondary);">
                    请检查上方选择框中的设备信息是否正确，然后点击"分析相机"按钮获取详细分析。
                </p>
            </div>
        `;
        resultContainer.style.display = 'block';
    }
}

// 显示设备分析结果
function displayEquipmentResult(result) {
    console.log('displayEquipmentResult 被调用', result);
    const resultContainer = document.getElementById('equipmentResult');
    
    if (!resultContainer) {
        console.error('找不到 equipmentResult 容器');
        alert('系统错误：找不到结果显示区域');
        return;
    }
    
    if (!result) {
        console.error('结果为空');
        alert('系统错误：分析结果为空');
        return;
    }
    
    console.log('准备显示结果:', result.title, result.type);
    
    const ratingClass = result.rating || 'average';
    const ratingText = result.rating === 'excellent' ? '优秀' : result.rating === 'good' ? '良好' : '一般';
    
    let sectionsHtml = result.sections.map(section => `
        <div class="analysis-section">
            <h4><i class="fas ${section.icon}"></i> ${section.title}</h4>
            ${section.content}
        </div>
    `).join('');
    
    let prosConsHtml = '';
    if (result.pros && result.cons) {
        prosConsHtml = `
            <div class="pros-cons">
                <div class="pros">
                    <h5><i class="fas fa-check-circle"></i> 优势</h5>
                    <ul>${result.pros.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>
                <div class="cons">
                    <h5><i class="fas fa-times-circle"></i> 不足</h5>
                    <ul>${result.cons.map(c => `<li>${c}</li>`).join('')}</ul>
                </div>
            </div>
        `;
    }
    
    resultContainer.innerHTML = `
        <div class="result-header">
            <div class="result-icon">
                <i class="fas ${result.icon}"></i>
            </div>
            <div class="result-title">
                <h3>${result.title}</h3>
                <p>${result.subtitle}</p>
            </div>
            <div class="score-badge ${ratingClass}">
                ${ratingText} ${result.score}/10
            </div>
        </div>
        ${sectionsHtml}
        ${prosConsHtml}
        <div class="analysis-section" style="margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border-color);">
            <h4><i class="fas fa-star"></i> 综合评价</h4>
            <p>${result.recommendation}</p>
        </div>
        <div class="result-actions" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color); display: flex; gap: 12px; justify-content: center;">
            <button class="btn btn-secondary" onclick="favoriteComboFromResult()">
                <i class="far fa-star"></i> 收藏套装
            </button>
            <button class="btn btn-secondary" onclick="shareComboResult()">
                <i class="fas fa-share-alt"></i> 分享
            </button>
        </div>
    `;
    
    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// 收藏当前套装
function favoriteComboFromResult() {
    // 检查是否有选择数据
    if (!comboSelection.cameraBrand || !comboSelection.cameraModel) {
        alert('请先完成套装选择');
        return;
    }
    
    const brandName = cameraDatabase[comboSelection.cameraBrand]?.name || comboSelection.cameraBrand;
    const camera = comboSelection.cameraModel;
    const lens = comboSelection.lens;
    
    // 计算总价
    const cameraPrice = getCameraPrice(comboSelection.cameraBrand, camera);
    const lensPrice = lens?.priceNum || 3000;
    const totalPrice = cameraPrice + lensPrice;
    
    // 构建收藏数据
    const comboData = {
        type: 'combo',
        id: 'combo_' + Date.now(),
        title: `${brandName} ${camera} 套装`,
        camera: `${brandName} ${camera}`,
        lens: lens?.name || '固定镜头',
        totalPrice: totalPrice,
        createdAt: new Date().toISOString()
    };
    
    // 调用收藏API
    const result = addComboToFavorites(comboData);
    if (result.success) {
        alert('套装收藏成功！');
    } else {
        alert(result.message || '收藏失败');
    }
}

// 添加到收藏（套装）
function addComboToFavorites(item) {
    try {
        // 从 localStorage 读取现有收藏
        let favorites = JSON.parse(localStorage.getItem('photoMonster_favorites') || '[]');
        
        // 检查是否已存在
        const exists = favorites.some(f => 
            f.type === 'combo' && f.camera === item.camera && f.lens === item.lens
        );
        
        if (exists) {
            return { success: false, message: '该套装已在收藏中' };
        }
        
        // 添加新收藏
        favorites.push(item);
        localStorage.setItem('photoMonster_favorites', JSON.stringify(favorites));
        
        return { success: true, message: '收藏成功' };
    } catch (e) {
        console.error('收藏失败:', e);
        return { success: false, message: '收藏失败：' + e.message };
    }
}

// 分享套装结果
function shareComboResult() {
    // 检查是否有选择数据
    if (!comboSelection.cameraBrand || !comboSelection.cameraModel) {
        alert('请先完成套装选择');
        return;
    }
    
    const brandName = cameraDatabase[comboSelection.cameraBrand]?.name || comboSelection.cameraBrand;
    const camera = comboSelection.cameraModel;
    const lens = comboSelection.lens;
    
    const shareText = `我在 Photo Monster 发现了一套不错的摄影装备：${brandName} ${camera} + ${lens?.name || '固定镜头'}，快来看看吧！`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Photo Monster 套装推荐',
            text: shareText,
            url: window.location.href
        }).catch(err => console.log('分享失败:', err));
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareText).then(() => {
            alert('分享内容已复制到剪贴板');
        }).catch(() => {
            alert('分享内容：' + shareText);
        });
    }
}

// ==================== 分析历史记录 ====================

const HISTORY_KEY = 'photoMonster_analysis_history';
const MAX_HISTORY = 20; // 最多保存20条记录

// 保存分析历史
function saveAnalysisHistory(record) {
    try {
        const history = getAnalysisHistory();
        history.unshift(record); // 添加到开头
        // 限制保存数量
        if (history.length > MAX_HISTORY) {
            history.pop();
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
        console.error('保存历史记录失败:', e);
    }
}

// 获取分析历史
function getAnalysisHistory() {
    try {
        const data = localStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('读取历史记录失败:', e);
        return [];
    }
}

// 加载并显示历史记录
function loadAnalysisHistory() {
    const history = getAnalysisHistory();
    const grid = document.getElementById('historyGrid');
    const empty = document.getElementById('historyEmpty');
    
    if (!grid) return;
    
    if (history.length === 0) {
        grid.style.display = 'none';
        if (empty) empty.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    if (empty) empty.style.display = 'none';
    
    grid.innerHTML = history.map((item, index) => {
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString('zh-CN');
        const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        const scoreClass = item.score >= 80 ? 'score-high' : item.score >= 60 ? 'score-mid' : 'score-low';
        
        return `
            <div class="history-item" data-index="${index}">
                <div class="history-item-header">
                    <span class="history-score ${scoreClass}">${item.score}分</span>
                    <span class="history-type">${item.type || '通用摄影'}</span>
                </div>
                <div class="history-item-name">${item.fileName || '未知文件'}</div>
                <div class="history-item-date">${dateStr} ${timeStr}</div>
                <div class="history-item-actions">
                    <button class="btn btn-sm" onclick="viewHistoryDetail(${index})">查看详情</button>
                </div>
            </div>
        `;
    }).join('');
}

// 查看历史记录详情
function viewHistoryDetail(index) {
    const history = getAnalysisHistory();
    const item = history[index];
    
    if (!item || !item.result) {
        alert('无法查看该记录详情');
        return;
    }
    
    // 显示分析结果
    if (analysisContent) {
        generateAnalysisReport(item.result);
    }
    
    // 滚动到分析结果区域
    const section = analysisSection || document.getElementById('analysis');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 清空历史记录
function clearAnalysisHistory() {
    if (!confirm('确定要清空所有分析历史记录吗？此操作不可恢复。')) {
        return;
    }
    
    try {
        localStorage.removeItem(HISTORY_KEY);
        loadAnalysisHistory();
    } catch (e) {
        console.error('清空历史记录失败:', e);
    }
}

// 页面加载时初始化历史记录
document.addEventListener('DOMContentLoaded', () => {
    // 初始化历史记录显示
    loadAnalysisHistory();

    // 清空历史按钮事件
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearAnalysisHistory);
    }
});

// ==================== 用户体验增强函数 ====================

// 显示加载状态
function showLoading(text = '正在处理...', progress = null) {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    const progressBar = document.getElementById('loadingProgressBar');

    if (loadingText) loadingText.textContent = text;
    if (progressBar && progress !== null) {
        progressBar.style.width = progress + '%';
    }
    if (overlay) {
        overlay.classList.add('active');
    }
}

// 隐藏加载状态
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    const progressBar = document.getElementById('loadingProgressBar');
    if (overlay) overlay.classList.remove('active');
    if (progressBar) progressBar.style.width = '0%';
}

// 更新加载进度
function updateLoadingProgress(progress, text) {
    const progressBar = document.getElementById('loadingProgressBar');
    const loadingText = document.getElementById('loadingText');
    if (progressBar) progressBar.style.width = progress + '%';
    if (loadingText && text) loadingText.textContent = text;
}

// Toast 通知系统
function showToast(type, title, message, duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };

    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.info} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    // 自动关闭
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'toast-slide-out 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);

    return toast;
}

// 便捷的 Toast 方法
function showSuccessToast(message, title = '成功') {
    return showToast('success', title, message);
}

function showErrorToast(message, title = '出错啦') {
    return showToast('error', title, message);
}

function showWarningToast(message, title = '提醒') {
    return showToast('warning', title, message);
}

function showInfoToast(message, title = '提示') {
    return showToast('info', title, message);
}

// 错误提示框显示
function showErrorAlert(title, message) {
    const container = document.querySelector('.upload-section .container');
    if (!container) return;

    // 移除已有的错误提示
    const existing = container.querySelector('.error-alert');
    if (existing) existing.remove();

    const alert = document.createElement('div');
    alert.className = 'error-alert';
    alert.innerHTML = `
        <i class="fas fa-exclamation-circle error-alert-icon"></i>
        <div class="error-alert-content">
            <div class="error-alert-title">${title}</div>
            <div class="error-alert-message">${message}</div>
        </div>
        <button class="error-alert-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.insertBefore(alert, container.firstChild);
    return alert;
}

// 成功提示框显示
function showSuccessAlert(title, message) {
    const container = document.querySelector('.upload-section .container');
    if (!container) return;

    // 移除已有的提示
    const existing = container.querySelector('.success-alert');
    if (existing) existing.remove();

    const alert = document.createElement('div');
    alert.className = 'success-alert';
    alert.innerHTML = `
        <i class="fas fa-check-circle success-alert-icon"></i>
        <div class="success-alert-content">
            <div class="success-alert-title">${title}</div>
            <div class="success-alert-message">${message}</div>
        </div>
    `;

    container.insertBefore(alert, container.firstChild);
    return alert;
}

// 设置按钮加载状态
function setButtonLoading(button, loading = true) {
    if (!button) return;

    if (loading) {
        button.disabled = true;
        button.classList.add('btn-loading');
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 处理中...';
    } else {
        button.disabled = false;
        button.classList.remove('btn-loading');
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    }
}

// 拖拽反馈 - 增强版
function initDragFeedback(dropZone) {
    if (!dropZone) return;

    let dragCounter = 0; // 用于处理子元素触发dragleave的问题

    // 阻止默认行为
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    // 拖拽进入
    dropZone.addEventListener('dragenter', (e) => {
        dragCounter++;
        if (dragCounter === 1) {
            dropZone.classList.add('drag-active');
            showDragOverlay(dropZone, '释放以上传文件');
        }
    });

    // 拖拽悬停
    dropZone.addEventListener('dragover', (e) => {
        e.dataTransfer.dropEffect = 'copy';
        if (!dropZone.classList.contains('drag-active')) {
            dropZone.classList.add('drag-active');
        }
    });

    // 拖拽离开
    dropZone.addEventListener('dragleave', (e) => {
        dragCounter--;
        if (dragCounter === 0) {
            dropZone.classList.remove('drag-active');
            hideDragOverlay(dropZone);
        }
    });

    // 释放文件
    dropZone.addEventListener('drop', (e) => {
        dragCounter = 0;
        dropZone.classList.remove('drag-active');
        hideDragOverlay(dropZone);
        
        const files = Array.from(e.dataTransfer.files).filter(file => {
            return file.type.startsWith('image/') || 
                   /\.(jpg|jpeg|png|gif|webp|heic|heif|raw|cr2|nef|arw|dng|orf|rw2)$/i.test(file.name);
        });

        if (files.length === 0) {
            showErrorToast('请拖拽图片文件');
            return;
        }

        // 显示文件计数
        showSuccessToast(`已选择 ${files.length} 个文件`);
        
        // 处理文件
        handleFiles(files);
    });
}

// 显示拖拽覆盖层
function showDragOverlay(dropZone, text) {
    let overlay = dropZone.querySelector('.drag-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'drag-overlay';
        overlay.innerHTML = `
            <div class="drag-overlay-content">
                <i class="fas fa-cloud-upload-alt"></i>
                <span>${text}</span>
            </div>
        `;
        dropZone.appendChild(overlay);
    }
    overlay.classList.add('show');
}

// 隐藏拖拽覆盖层
function hideDragOverlay(dropZone) {
    const overlay = dropZone.querySelector('.drag-overlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}


function showBatchAnalysisButton() {
    const batchBtn = document.getElementById('batchAnalyzeBtn');
    const singleBtn = document.getElementById('analyzeBtn');
    if (batchBtn && uploadedImages.length > 1) {
        batchBtn.style.display = 'inline-flex';
        if (singleBtn) singleBtn.style.display = 'none';
    }
}

// 更新加载文本
function updateLoadingText(text) {
    const loadingText = document.getElementById('loadingText');
    if (loadingText) {
        loadingText.textContent = text;
    }
}

// 添加骨架屏
function showSkeleton(count = 3) {
    return Array(count).fill(0).map(() => `
        <div class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text medium"></div>
            <div class="skeleton skeleton-text short"></div>
        </div>
    `).join('');
}

// 错误处理包装函数
function withErrorHandling(fn, errorMessage = '操作失败') {
    return function(...args) {
        try {
            return fn.apply(this, args);
        } catch (error) {
            console.error(errorMessage + ':', error);
            showErrorToast(errorMessage + '，请重试');
            hideLoading();
            return null;
        }
    };
}

// 异步函数错误处理包装
async function withAsyncErrorHandling(promise, errorMessage = '操作失败') {
    try {
        return await promise;
    } catch (error) {
        console.error(errorMessage + ':', error);
        showErrorToast(errorMessage + '，请重试');
        hideLoading();
        throw error;
    }
}

// ==================== 图像分析工具：直方图与构图辅助线 ====================

// 当前显示的图像数据 (全局变量，供其他模块访问)
window.currentImageData = null;
window.currentImageElement = null;

// 本地引用（保持向后兼容）
let currentImageData = window.currentImageData;
let currentImageElement = window.currentImageElement;

// 初始化图像分析工具
function initImageAnalysisTools() {
    console.log('初始化图像分析工具...');
    
    // 注意：直方图按钮由 photo-analysis-integration.js 处理（增强版功能）
    // 这里不再绑定，避免重复绑定导致冲突
    
    // 构图辅助线按钮
    const ruleOfThirdsBtn = document.getElementById('ruleOfThirdsBtn');
    const goldenRatioBtn = document.getElementById('goldenRatioBtn');
    const centerBtn = document.getElementById('centerBtn');
    const clearOverlayBtn = document.getElementById('clearOverlayBtn');
    
    if (ruleOfThirdsBtn) {
        ruleOfThirdsBtn.addEventListener('click', () => drawCompositionOverlay('ruleOfThirds'));
    }
    if (goldenRatioBtn) {
        goldenRatioBtn.addEventListener('click', () => drawCompositionOverlay('goldenRatio'));
    }
    if (centerBtn) {
        centerBtn.addEventListener('click', () => drawCompositionOverlay('center'));
    }
    if (clearOverlayBtn) {
        clearOverlayBtn.addEventListener('click', clearCompositionOverlay);
    }
}

// 设置当前分析的图片
function setCurrentAnalysisImage(imgElement) {
    window.currentImageElement = imgElement;
    currentImageElement = imgElement; // 同步本地引用
    if (imgElement && imgElement.complete) {
        extractImageData(imgElement);
    }
}

// 提取图像数据用于直方图计算
function extractImageData(imgElement) {
    if (!imgElement) return;
    
    // 性能优化：使用 requestIdleCallback 或 setTimeout 延迟执行，避免阻塞主线程
    const doExtract = () => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            // 限制采样大小以提高性能
            const maxSize = 400;
            let width = imgElement.naturalWidth || imgElement.width;
            let height = imgElement.naturalHeight || imgElement.height;
            
            if (width > maxSize || height > maxSize) {
                const ratio = Math.min(maxSize / width, maxSize / height);
                width = Math.floor(width * ratio);
                height = Math.floor(height * ratio);
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(imgElement, 0, 0, width, height);
            
            window.currentImageData = ctx.getImageData(0, 0, width, height);
            currentImageData = window.currentImageData; // 同步本地引用
            console.log('图像数据提取完成:', width, 'x', height);
        } catch (error) {
            console.error('提取图像数据失败:', error);
            window.currentImageData = null;
            currentImageData = null;
        }
    };
    
    // 使用 requestIdleCallback 如果可用，否则用 setTimeout 延迟执行
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(doExtract, { timeout: 100 });
    } else {
        setTimeout(doExtract, 0);
    }
}

// 切换直方图显示 (app.js 版本 - 简单亮度直方图)
function toggleHistogramSimple() {
    const container = document.getElementById('histogramContainer');
    if (!container) return;
    
    if (container.style.display === 'none') {
        showHistogramSimple();
    } else {
        hideHistogramSimple();
    }
}

// 显示直方图 (app.js 版本)
function showHistogramSimple() {
    const container = document.getElementById('histogramContainer');
    const canvas = document.getElementById('histogramCanvas');
    
    if (!container || !canvas || !currentImageData) {
        showWarningToast('请先上传图片');
        return;
    }
    
    container.style.display = 'block';
    drawHistogramSimple(canvas, currentImageData);
    
    // 更新按钮状态
    const btn = document.getElementById('histogramBtn');
    if (btn) btn.classList.add('active');
}

// 隐藏直方图
function hideHistogramSimple() {
    const container = document.getElementById('histogramContainer');
    if (container) container.style.display = 'none';
    
    const btn = document.getElementById('histogramBtn');
    if (btn) btn.classList.remove('active');
}

// 绘制增强版RGB直方图
function drawHistogramSimple(canvas, imageData) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const padding = 30;
    const graphHeight = height - padding * 2;
    const graphWidth = width - padding * 2;
    
    // 清空画布 - 深色背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // 初始化RGB和亮度直方图
    const histR = new Array(256).fill(0);
    const histG = new Array(256).fill(0);
    const histB = new Array(256).fill(0);
    const histL = new Array(256).fill(0);
    const data = imageData.data;
    
    // 性能优化：根据数据量动态调整采样步长
    // 对于大图片，采样计算可以显著减少CPU占用而不影响直方图视觉效果
    const pixelCount = data.length / 4;
    let step = 4; // 默认步长：每4个像素取1个
    
    if (pixelCount > 10000000) {
        step = 16; // 1000万像素以上：每16个像素取1个（减少93.75%计算量）
    } else if (pixelCount > 5000000) {
        step = 8;  // 500万像素以上：每8个像素取1个（减少87.5%计算量）
    } else if (pixelCount > 2000000) {
        step = 4;  // 200万像素以上：每4个像素取1个（减少75%计算量）
    } else {
        step = 2;  // 小图片：每2个像素取1个（减少50%计算量）
    }
    
    // 计算直方图数据（使用采样优化）
    for (let i = 0; i < data.length; i += step) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luminance = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        
        histR[r]++;
        histG[g]++;
        histB[b]++;
        histL[luminance]++;
    }
    
    // 找到最大值用于归一化
    const maxCount = Math.max(
        Math.max(...histR),
        Math.max(...histG),
        Math.max(...histB),
        Math.max(...histL)
    );
    
    if (maxCount === 0) {
        console.warn('直方图数据为空');
        return;
    }
    
    // 绘制网格线
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding + (graphHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // 绘制RGB通道
    const barWidth = graphWidth / 256;
    
    // 绘制红色通道
    ctx.fillStyle = 'rgba(255, 71, 87, 0.6)';
    for (let i = 0; i < 256; i++) {
        const barHeight = (histR[i] / maxCount) * graphHeight;
        ctx.fillRect(padding + i * barWidth, height - padding - barHeight, barWidth + 0.5, barHeight);
    }
    
    // 绘制绿色通道
    ctx.fillStyle = 'rgba(46, 213, 115, 0.6)';
    for (let i = 0; i < 256; i++) {
        const barHeight = (histG[i] / maxCount) * graphHeight;
        ctx.fillRect(padding + i * barWidth, height - padding - barHeight, barWidth + 0.5, barHeight);
    }
    
    // 绘制蓝色通道
    ctx.fillStyle = 'rgba(54, 162, 235, 0.6)';
    for (let i = 0; i < 256; i++) {
        const barHeight = (histB[i] / maxCount) * graphHeight;
        ctx.fillRect(padding + i * barWidth, height - padding - barHeight, barWidth + 0.5, barHeight);
    }
    
    // 绘制亮度直方图（白色半透明）
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 256; i++) {
        const barHeight = (histL[i] / maxCount) * graphHeight;
        ctx.fillRect(padding + i * barWidth, height - padding - barHeight, barWidth + 0.5, barHeight);
    }
    
    // 绘制区域分隔线（阴影/中间调/高光）
    const shadowEnd = padding + (64 / 256) * graphWidth;
    const highlightStart = padding + (192 / 256) * graphWidth;
    
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    
    // 阴影区结束线
    ctx.beginPath();
    ctx.moveTo(shadowEnd, padding);
    ctx.lineTo(shadowEnd, height - padding);
    ctx.stroke();
    
    // 高光区开始线
    ctx.beginPath();
    ctx.moveTo(highlightStart, padding);
    ctx.lineTo(highlightStart, height - padding);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // 绘制底部刻度
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('0', padding, height - 10);
    ctx.fillText('64', shadowEnd, height - 10);
    ctx.fillText('128', padding + graphWidth / 2, height - 10);
    ctx.fillText('192', highlightStart, height - 10);
    ctx.fillText('255', width - padding, height - 10);
    
    // 绘制区域标签
    ctx.font = '11px sans-serif';
    ctx.fillStyle = 'rgba(52, 152, 219, 0.8)';
    ctx.fillText('阴影', padding + (shadowEnd - padding) / 2, padding + 15);
    ctx.fillStyle = 'rgba(46, 204, 113, 0.8)';
    ctx.fillText('中间调', (shadowEnd + highlightStart) / 2, padding + 15);
    ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
    ctx.fillText('高光', highlightStart + (width - padding - highlightStart) / 2, padding + 15);
}

// 绘制构图辅助线
function drawCompositionOverlay(type) {
    if (!currentImageElement) {
        showWarningToast('请先上传图片');
        return;
    }
    
    // 找到预览项容器
    const previewItem = currentImageElement.closest('.preview-item');
    if (!previewItem) return;
    
    // 清除现有覆盖层
    clearCompositionOverlay();
    
    // 创建或获取覆盖canvas
    let overlay = previewItem.querySelector('.composition-overlay');
    if (!overlay) {
        overlay = document.createElement('canvas');
        overlay.className = 'composition-overlay';
        previewItem.appendChild(overlay);
    }
    
    // 设置canvas尺寸匹配图片
    overlay.width = currentImageElement.width;
    overlay.height = currentImageElement.height;
    overlay.style.width = currentImageElement.width + 'px';
    overlay.style.height = currentImageElement.height + 'px';
    
    const ctx = overlay.getContext('2d');
    const w = overlay.width;
    const h = overlay.height;
    
    // 设置线条样式
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 4]);
    
    ctx.beginPath();
    
    switch (type) {
        case 'ruleOfThirds':
            // 三分法：画两条横线和两条竖线
            ctx.moveTo(w / 3, 0);
            ctx.lineTo(w / 3, h);
            ctx.moveTo(2 * w / 3, 0);
            ctx.lineTo(2 * w / 3, h);
            ctx.moveTo(0, h / 3);
            ctx.lineTo(w, h / 3);
            ctx.moveTo(0, 2 * h / 3);
            ctx.lineTo(w, 2 * h / 3);
            break;
            
        case 'goldenRatio':
            // 黄金分割：简化为0.618位置
            const phi = 0.618;
            ctx.moveTo(w * (1 - phi), 0);
            ctx.lineTo(w * (1 - phi), h);
            ctx.moveTo(w * phi, 0);
            ctx.lineTo(w * phi, h);
            ctx.moveTo(0, h * (1 - phi));
            ctx.lineTo(w, h * (1 - phi));
            ctx.moveTo(0, h * phi);
            ctx.lineTo(w, h * phi);
            break;
            
        case 'center':
            // 中心构图：十字线
            ctx.moveTo(w / 2, 0);
            ctx.lineTo(w / 2, h);
            ctx.moveTo(0, h / 2);
            ctx.lineTo(w, h / 2);
            // 中心圆
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.arc(w / 2, h / 2, Math.min(w, h) / 8, 0, Math.PI * 2);
            break;
    }
    
    ctx.stroke();
    
    // 更新按钮状态
    document.querySelectorAll('#ruleOfThirdsBtn, #goldenRatioBtn, #centerBtn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(type === 'ruleOfThirds' ? 'ruleOfThirdsBtn' : 
                                                  type === 'goldenRatio' ? 'goldenRatioBtn' : 'centerBtn');
    if (activeBtn) activeBtn.classList.add('active');
}

// 清除构图辅助线
function clearCompositionOverlay() {
    const overlays = document.querySelectorAll('.composition-overlay');
    overlays.forEach(overlay => overlay.remove());
    
    document.querySelectorAll('#ruleOfThirdsBtn, #goldenRatioBtn, #centerBtn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// 页面加载完成后初始化图像分析工具
document.addEventListener('DOMContentLoaded', () => {
    initImageAnalysisTools();
    initCompareView();
});

// ==================== 对比视图功能 ====================

// 初始化对比视图
function initCompareView() {
    const viewNormalBtn = document.getElementById('viewNormalBtn');
    const viewCompareBtn = document.getElementById('viewCompareBtn');
    const viewSplitBtn = document.getElementById('viewSplitBtn');
    
    if (viewNormalBtn) {
        viewNormalBtn.addEventListener('click', () => switchCompareView('normal'));
    }
    if (viewCompareBtn) {
        viewCompareBtn.addEventListener('click', () => switchCompareView('compare'));
    }
    if (viewSplitBtn) {
        viewSplitBtn.addEventListener('click', () => switchCompareView('split'));
    }
}

// 切换对比视图模式
function switchCompareView(mode) {
    const toolbar = document.getElementById('compareToolbar');
    const compareContainer = document.getElementById('compareViewContainer');
    const splitContainer = document.getElementById('splitCompareContainer');
    
    // 更新按钮状态
    document.querySelectorAll('.compare-toolbar .tool-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (mode === 'normal') {
        document.getElementById('viewNormalBtn').classList.add('active');
        compareContainer.style.display = 'none';
        splitContainer.style.display = 'none';
    } else if (mode === 'compare') {
        document.getElementById('viewCompareBtn').classList.add('active');
        if (currentImageElement) {
            showCompareView();
        }
    } else if (mode === 'split') {
        document.getElementById('viewSplitBtn').classList.add('active');
        if (currentImageElement) {
            showSplitView();
        }
    }
}

// 显示并排对比视图
function showCompareView() {
    const container = document.getElementById('compareViewContainer');
    const originalImg = document.getElementById('compareOriginalImg');
    const analyzedCanvas = document.getElementById('compareAnalyzedCanvas');
    
    if (!container || !originalImg || !analyzedCanvas || !currentImageElement) {
        return;
    }
    
    // 设置原图
    originalImg.src = currentImageElement.src;
    
    // 等待原图加载后获取尺寸
    originalImg.onload = () => {
        const width = originalImg.width;
        const height = originalImg.height;
        
        // 设置Canvas尺寸
        analyzedCanvas.width = width;
        analyzedCanvas.height = height;
        analyzedCanvas.style.width = width + 'px';
        analyzedCanvas.style.height = height + 'px';
        
        // 绘制分析标注（颜色分布、区域标记等）
        drawAnalysisOverlay(analyzedCanvas, currentImageData);
    };
    
    container.style.display = 'grid';
}

// 显示分割对比视图
function showSplitView() {
    const container = document.getElementById('splitCompareContainer');
    const splitOriginal = document.getElementById('splitOriginalImg');
    const splitCanvas = document.getElementById('splitAnalyzedCanvas');
    
    if (!container || !splitOriginal || !splitCanvas || !currentImageElement) {
        return;
    }
    
    // 设置原图
    splitOriginal.src = currentImageElement.src;
    
    splitOriginal.onload = () => {
        const width = splitOriginal.width;
        const height = splitOriginal.height;
        
        // 设置Canvas尺寸为原图的两倍宽度（方便覆盖）
        splitCanvas.width = width * 2;
        splitCanvas.height = height;
        splitCanvas.style.width = width + 'px';
        splitCanvas.style.height = height + 'px';
        
        // 绘制分析标注
        const ctx = splitCanvas.getContext('2d');
        ctx.drawImage(currentImageElement, 0, 0);
        drawAnalysisOverlay(splitCanvas, currentImageData);
        
        // 初始化分割滑块
        initSplitSlider(container);
    };
    
    container.style.display = 'block';
}

// 绘制分析标注（可视化分析结果）
function drawAnalysisOverlay(canvas, imageData) {
    const ctx = canvas.getContext('2d');
    
    // 绘制曝光问题区域（暗红色标记过暗区域）
    if (imageData) {
        const data = imageData.data;
        const imgData = ctx.createImageData(imageData.width, imageData.height);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            
            // 如果太暗（<30）用红色标记
            if (luminance < 30) {
                imgData.data[i] = 255;
                imgData.data[i + 1] = 50;
                imgData.data[i + 2] = 50;
                imgData.data[i + 3] = 30;
            } 
            // 如果太亮（>240）用蓝色标记
            else if (luminance > 240) {
                imgData.data[i] = 50;
                imgData.data[i + 1] = 50;
                imgData.data[i + 2] = 255;
                imgData.data[i + 3] = 30;
            } else {
                imgData.data[i] = r;
                imgData.data[i + 1] = g;
                imgData.data[i + 2] = b;
                imgData.data[i + 3] = a;
            }
        }
        
        ctx.putImageData(imgData, 0, 0);
    }
}

// 初始化分割滑块
function initSplitSlider(container) {
    const slider = container.querySelector('.split-slider');
    const overlay = container.querySelector('.split-overlay');
    const wrapper = container.querySelector('.split-wrapper');
    
    if (!slider || !overlay || !wrapper) return;
    
    let isMoving = false;
    
    const updateSlider = (e) => {
        if (!isMoving) return;
        
        const rect = wrapper.getBoundingClientRect();
        let x = e.clientX - rect.left;
        
        // 处理触摸事件
        if (e.touches) {
            x = e.touches[0].clientX - rect.left;
        }
        
        // 限制在边界内
        x = Math.max(0, Math.min(x, rect.width));
        
        // 更新覆盖层宽度
        overlay.style.width = x + 'px';
        slider.style.left = x + 'px';
    };
    
    // 鼠标事件
    slider.addEventListener('mousedown', () => {
        isMoving = true;
    });
    
    document.addEventListener('mouseup', () => {
        isMoving = false;
    });
    
    document.addEventListener('mousemove', updateSlider);
    
    // 触摸事件
    slider.addEventListener('touchstart', () => {
        isMoving = true;
    });
    
    document.addEventListener('touchend', () => {
        isMoving = false;
    });
    
    document.addEventListener('touchmove', updateSlider);
    
    // 初始位置：50%
    const rect = wrapper.getBoundingClientRect();
    overlay.style.width = (rect.width / 2) + 'px';
    slider.style.left = (rect.width / 2) + 'px';
}

// ==================== 全局更新检测 ====================

// 初始化全局更新检测
function initGlobalUpdateChecker() {
    // 只在有 updateManager 的页面启用
    if (typeof UpdateManager === 'undefined') return;
    
    // 延迟5秒后检查更新（避免页面加载时干扰）
    setTimeout(async () => {
        try {
            // 创建轻量级的更新管理器实例用于检测
            const checker = {
                async checkForUpdates() {
                    const basePath = window.location.pathname.includes('/pages/') ? '../' : './';
                    const response = await fetch(basePath + 'data/update-config.json?v=' + Date.now());
                    const config = await response.json();
                    
                    // 检查本地存储的版本与配置版本
                    const lastKnownVersion = localStorage.getItem('pm_last_known_version');
                    if (lastKnownVersion && lastKnownVersion !== config.version) {
                        // 发现新版本
                        showGlobalUpdateNotification(config.version);
                    }
                    localStorage.setItem('pm_last_known_version', config.version);
                }
            };
            
            await checker.checkForUpdates();
        } catch (error) {
            console.log('[GlobalUpdateChecker] 检查失败:', error);
        }
    }, 5000);
    
    // 每30分钟检查一次
    setInterval(() => {
        if (typeof UpdateManager !== 'undefined') {
            initGlobalUpdateChecker();
        }
    }, 30 * 60 * 1000);
}

// 显示全局更新通知
function showGlobalUpdateNotification(version) {
    // 检查是否已经显示过
    if (document.getElementById('global-update-notification')) return;
    
    const notification = document.createElement('div');
    notification.id = 'global-update-notification';
    notification.innerHTML = `
        <div class="global-update-content">
            <i class="fas fa-sync-alt"></i>
            <span>Photo Monster 有新版本 (${version}) 可用</span>
            <button onclick="window.location.href='${window.location.pathname.includes('/pages/') ? './admin-update.html' : './pages/admin-update.html'}'">查看更新</button>
            <button onclick="document.getElementById('global-update-notification').remove()">稍后</button>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideUp 0.3s ease;
        max-width: 400px;
    `;
    
    // 添加动画样式
    if (!document.getElementById('global-update-styles')) {
        const style = document.createElement('style');
        style.id = 'global-update-styles';
        style.textContent = `
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .global-update-content {
                display: flex;
                align-items: center;
                gap: 12px;
                flex-wrap: wrap;
            }
            .global-update-content button {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 0.85rem;
                transition: background 0.2s;
            }
            .global-update-content button:hover {
                background: rgba(255,255,255,0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
}

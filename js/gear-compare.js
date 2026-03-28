/**
 * Photo Monster 器材对比功能
 * Gear Compare Module
 * 
 * 阶段一：器材对比核心功能
 */

class GearCompare {
    constructor() {
        this.compareType = 'camera'; // camera | lens | combo
        this.selectedItems = [];
        this.maxItems = 4;
        this.cameraDatabase = null;
        this.lensDatabase = null;
        
        this.init();
    }

    async init() {
        await this.loadDatabases();
        this.loadFromStorage();
        this.bindEvents();
        this.updateUI();
    }

    // 从 localStorage 加载对比列表
    loadFromStorage() {
        try {
            const savedList = localStorage.getItem('gearCompareList');
            if (savedList) {
                const parsedList = JSON.parse(savedList);
                // 过滤出套装类型的对比项
                const comboItems = parsedList.filter(item => item.type === 'combo');
                
                // 将套装数据转换为对比页面可用的格式
                comboItems.forEach(comboData => {
                    // 检查是否已存在
                    const exists = this.selectedItems.some(item => 
                        item.compareType === 'combo' && 
                        item.name === comboData.name
                    );
                    
                    if (!exists && this.selectedItems.length < this.maxItems) {
                        this.selectedItems.push({
                            compareType: 'combo',
                            name: comboData.name,
                            camera: comboData.camera,
                            lens: comboData.lens,
                            totalPrice: comboData.totalPrice,
                            isFixedLens: comboData.isFixedLens,
                            addedAt: comboData.addedAt
                        });
                    }
                });
                
                // 清空已加载的套装数据，避免重复加载
                if (comboItems.length > 0) {
                    const remainingItems = parsedList.filter(item => item.type !== 'combo');
                    localStorage.setItem('gearCompareList', JSON.stringify(remainingItems));
                }
            }
        } catch (e) {
            console.error('加载对比列表失败:', e);
        }
    }

    // 加载数据库
    async loadDatabases() {
        // 加载相机数据库
        this.cameraDatabase = {
            canon: {
                name: '佳能',
                models: {
                    'EOS R5': { name: 'EOS R5', type: 'fullframe', pixel: '4500万', price: 23999, mount: 'RF', pros: ['高像素', '8K视频', '优秀防抖'], cons: ['价格较高', '文件体积大'] },
                    'EOS R6': { name: 'EOS R6', type: 'fullframe', pixel: '2010万', price: 15999, mount: 'RF', pros: ['优秀高感', '快速对焦', '性价比高'], cons: ['像素偏低', '视频发热'] },
                    'EOS R8': { name: 'EOS R8', type: 'fullframe', pixel: '2420万', price: 10499, mount: 'RF', pros: ['轻便', '全画幅', '价格适中'], cons: ['单卡槽', '小电池'] },
                    'EOS R50': { name: 'EOS R50', type: 'apsc', pixel: '2420万', price: 4599, mount: 'RF-S', pros: ['轻便', 'Vlog友好', '便宜'], cons: ['APS-C画幅', '镜头少'] }
                }
            },
            sony: {
                name: '索尼',
                models: {
                    'A7R V': { name: 'A7R V', type: 'fullframe', pixel: '6100万', price: 25999, mount: 'E', pros: ['极高像素', 'AI对焦', '8级防抖'], cons: ['价格贵', '文件巨大'] },
                    'A7 IV': { name: 'A7 IV', type: 'fullframe', pixel: '3300万', price: 16999, mount: 'E', pros: ['均衡', '视频强', '对焦快'], cons: ['价格涨', '屏幕一般'] },
                    'A7C II': { name: 'A7C II', type: 'fullframe', pixel: '3300万', price: 13999, mount: 'E', pros: ['小巧', '全画幅', '防抖'], cons: ['EVF小', '单卡槽'] },
                    'ZV-E10 II': { name: 'ZV-E10 II', type: 'apsc', pixel: '2600万', price: 6899, mount: 'E', pros: ['Vlog专用', '轻便', '便宜'], cons: ['无防抖', 'APS-C'] }
                }
            },
            nikon: {
                name: '尼康',
                models: {
                    'Z9': { name: 'Z9', type: 'fullframe', pixel: '4571万', price: 35999, mount: 'Z', pros: ['旗舰性能', '8K视频', '无机械快门'], cons: ['体积大', '价格贵'] },
                    'Z8': { name: 'Z8', type: 'fullframe', pixel: '4571万', price: 27999, mount: 'Z', pros: ['小Z9', '8K视频', '轻便些'], cons: ['价格仍高', '电池小'] },
                    'Z6 III': { name: 'Z6 III', type: 'fullframe', pixel: '2450万', price: 18999, mount: 'Z', pros: ['部分堆栈', '视频强', '对焦好'], cons: ['价格偏高', '像素一般'] },
                    'Zf': { name: 'Zf', type: 'fullframe', pixel: '2450万', price: 13799, mount: 'Z', pros: ['复古外观', '全画幅', '防抖'], cons: ['握持差', '单卡槽'] }
                }
            },
            fujifilm: {
                name: '富士',
                models: {
                    'X-T5': { name: 'X-T5', type: 'apsc', pixel: '4020万', price: 11990, mount: 'X', pros: ['高像素APSC', '复古操控', '胶片模拟'], cons: ['价格贵', '镜头贵'] },
                    'X-H2': { name: 'X-H2', type: 'apsc', pixel: '4020万', price: 13390, mount: 'X', pros: ['8K视频', '高像素', '防抖'], cons: ['价格高', '体积大'] },
                    'X-S20': { name: 'X-S20', type: 'apsc', pixel: '2610万', price: 8799, mount: 'X', pros: ['Vlog友好', '防抖', '胶片模拟'], cons: ['塑料感', '续航一般'] },
                    'X100VI': { name: 'X100VI', type: 'apsc', pixel: '4020万', price: 11390, mount: 'fixed', pros: ['便携', '定焦', '胶片模拟'], cons: ['固定镜头', '难买'] }
                }
            },
            panasonic: {
                name: '松下',
                models: {
                    'S5 II': { name: 'S5 II', type: 'fullframe', pixel: '2420万', price: 13998, mount: 'L', pros: ['相位对焦', '视频强', '防抖好'], cons: ['镜头少', '追焦一般'] },
                    'GH6': { name: 'GH6', type: 'm43', pixel: '2520万', price: 12998, mount: 'M43', pros: ['视频神器', '无限录制', '防抖'], cons: ['M43画幅', '对焦一般'] },
                    'G9 II': { name: 'G9 II', type: 'm43', pixel: '2520万', price: 10998, mount: 'M43', pros: ['相位对焦', '连拍快', '防抖'], cons: ['M43画幅', '镜头群萎缩'] }
                }
            },
            olympus: {
                name: '奥林巴斯',
                models: {
                    'OM-1': { name: 'OM-1', type: 'm43', pixel: '2040万', price: 15999, mount: 'M43', pros: ['计算摄影', '连拍快', '防抖'], cons: ['M43画幅', '价格贵'] },
                    'OM-5': { name: 'OM-5', type: 'm43', pixel: '2040万', price: 7999, mount: 'M43', pros: ['轻便', '防抖', '计算摄影'], cons: ['M43画幅', '老传感器'] }
                }
            },
            leica: {
                name: '徕卡',
                models: {
                    'M11': { name: 'M11', type: 'fullframe', pixel: '6030万', price: 68000, mount: 'M', pros: ['德味', '做工', '手动乐趣'], cons: ['极贵', '手动对焦'] },
                    'Q3': { name: 'Q3', type: 'fullframe', pixel: '6030万', price: 50800, mount: 'fixed', pros: ['自动对焦', '定焦', '德味'], cons: ['贵', '固定镜头'] },
                    'SL3': { name: 'SL3', type: 'fullframe', pixel: '6030万', price: 51800, mount: 'L', pros: ['现代徕卡', '视频', '自动'], cons: ['贵', '重'] }
                }
            },
            hasselblad: {
                name: '哈苏',
                models: {
                    'X2D 100C': { name: 'X2D 100C', type: 'medium', pixel: '10000万', price: 54900, mount: 'XCD', pros: ['一亿像素', '中画幅', '色彩'], cons: ['极贵', '镜头贵'] },
                    '907X 100C': { name: '907X 100C', type: 'medium', pixel: '10000万', price: 54900, mount: 'XCD', pros: ['复古', '模块化', '一亿像素'], cons: ['贵', '操控慢'] }
                }
            }
        };

        // 加载镜头数据库
        this.lensDatabase = {
            canon: {
                name: '佳能',
                lenses: [
                    { name: 'RF 50mm f/1.2L', type: 'prime', focal: '50mm', aperture: 'f/1.2', price: 15999, mount: 'RF', pros: ['顶级画质', '超大光圈'], cons: ['价格昂贵', '重量大'] },
                    { name: 'RF 85mm f/1.2L', type: 'prime', focal: '85mm', aperture: 'f/1.2', price: 18999, mount: 'RF', pros: ['人像镜皇', '虚化绝美'], cons: ['价格昂贵', '重量大'] },
                    { name: 'RF 24-70mm f/2.8L', type: 'zoom', focal: '24-70mm', aperture: 'f/2.8', price: 15999, mount: 'RF', pros: ['标准变焦大三元', '画质优秀'], cons: ['价格较高'] },
                    { name: 'RF 70-200mm f/2.8L', type: 'zoom', focal: '70-200mm', aperture: 'f/2.8', price: 18999, mount: 'RF', pros: ['长焦大三元', '画质顶级'], cons: ['价格昂贵', '重量大'] },
                    { name: 'RF 15-35mm f/2.8L', type: 'zoom', focal: '15-35mm', aperture: 'f/2.8', price: 15999, mount: 'RF', pros: ['超广角大三元'], cons: ['价格较高'] },
                    { name: 'RF 100-500mm f/4.5-7.1L', type: 'zoom', focal: '100-500mm', aperture: 'f/4.5-7.1', price: 18999, mount: 'RF', pros: ['远摄变焦', '拍鸟利器'], cons: ['光圈较小'] },
                    { name: 'RF 50mm f/1.8', type: 'prime', focal: '50mm', aperture: 'f/1.8', price: 1299, mount: 'RF', pros: ['轻便', '便宜', '标准视角'], cons: ['画质一般'] },
                    { name: 'RF 35mm f/1.8 Macro', type: 'macro', focal: '35mm', aperture: 'f/1.8', price: 3999, mount: 'RF', pros: ['带微距', '人文视角'], cons: ['对焦速度一般'] }
                ]
            },
            sony: {
                name: '索尼',
                lenses: [
                    { name: 'FE 50mm f/1.2 GM', type: 'prime', focal: '50mm', aperture: 'f/1.2', price: 15999, mount: 'E', pros: ['顶级标准定焦', '轻便'], cons: ['价格昂贵'] },
                    { name: 'FE 85mm f/1.4 GM', type: 'prime', focal: '85mm', aperture: 'f/1.4', price: 11999, mount: 'E', pros: ['人像经典', '虚化优美'], cons: ['重量较大'] },
                    { name: 'FE 24-70mm f/2.8 GM II', type: 'zoom', focal: '24-70mm', aperture: 'f/2.8', price: 14999, mount: 'E', pros: ['轻便大三元', '画质顶级'], cons: ['价格较高'] },
                    { name: 'FE 70-200mm f/2.8 GM II', type: 'zoom', focal: '70-200mm', aperture: 'f/2.8', price: 18999, mount: 'E', pros: ['最轻大三元长焦', '画质顶级'], cons: ['价格昂贵'] },
                    { name: 'FE 16-35mm f/2.8 GM II', type: 'zoom', focal: '16-35mm', aperture: 'f/2.8', price: 15999, mount: 'E', pros: ['轻便超广角'], cons: ['价格较高'] },
                    { name: 'FE 200-600mm f/5.6-6.3 G', type: 'zoom', focal: '200-600mm', aperture: 'f/5.6-6.3', price: 12999, mount: 'E', pros: ['远摄变焦', '性价比高'], cons: ['光圈较小', '重量大'] },
                    { name: 'FE 50mm f/1.8', type: 'prime', focal: '50mm', aperture: 'f/1.8', price: 1699, mount: 'E', pros: ['便宜', '轻便'], cons: ['对焦慢', '画质一般'] },
                    { name: 'FE 35mm f/1.8', type: 'prime', focal: '35mm', aperture: 'f/1.8', price: 4599, mount: 'E', pros: ['轻便', '人文视角'], cons: ['色散控制一般'] }
                ]
            },
            nikon: {
                name: '尼康',
                lenses: [
                    { name: 'Z 50mm f/1.2 S', type: 'prime', focal: '50mm', aperture: 'f/1.2', price: 14999, mount: 'Z', pros: ['顶级标准定焦'], cons: ['价格昂贵', '重量大'] },
                    { name: 'Z 85mm f/1.2 S', type: 'prime', focal: '85mm', aperture: 'f/1.2', price: 19999, mount: 'Z', pros: ['顶级人像镜'], cons: ['价格昂贵'] },
                    { name: 'Z 24-70mm f/2.8 S', type: 'zoom', focal: '24-70mm', aperture: 'f/2.8', price: 14999, mount: 'Z', pros: ['标准大三元'], cons: ['价格较高'] },
                    { name: 'Z 70-200mm f/2.8 VR S', type: 'zoom', focal: '70-200mm', aperture: 'f/2.8', price: 16999, mount: 'Z', pros: ['长焦大三元', '防抖'], cons: ['价格昂贵'] },
                    { name: 'Z 14-24mm f/2.8 S', type: 'zoom', focal: '14-24mm', aperture: 'f/2.8', price: 14999, mount: 'Z', pros: ['超广角大三元'], cons: ['价格较高', '灯泡头'] },
                    { name: 'Z 100-400mm f/4.5-5.6 VR S', type: 'zoom', focal: '100-400mm', aperture: 'f/4.5-5.6', price: 16999, mount: 'Z', pros: ['远摄变焦', '防抖'], cons: ['价格较高'] },
                    { name: 'Z 50mm f/1.8 S', type: 'prime', focal: '50mm', aperture: 'f/1.8', price: 3599, mount: 'Z', pros: ['画质优秀', '性价比高'], cons: ['体积较大'] },
                    { name: 'Z 40mm f/2', type: 'prime', focal: '40mm', aperture: 'f/2', price: 1799, mount: 'Z', pros: ['轻便', '便宜'], cons: ['塑料感'] }
                ]
            },
            fujifilm: {
                name: '富士',
                lenses: [
                    { name: 'XF 56mm f/1.2 R', type: 'prime', focal: '56mm', aperture: 'f/1.2', price: 7990, mount: 'X', pros: ['人像镜皇', '胶片模拟绝配'], cons: ['对焦较慢'] },
                    { name: 'XF 35mm f/1.4 R', type: 'prime', focal: '35mm', aperture: 'f/1.4', price: 5990, mount: 'X', pros: ['经典人文头', '色彩好'], cons: ['对焦慢', '老镜头'] },
                    { name: 'XF 16-55mm f/2.8 R', type: 'zoom', focal: '16-55mm', aperture: 'f/2.8', price: 8490, mount: 'X', pros: ['标准变焦', '画质好'], cons: ['较重', '无防抖'] },
                    { name: 'XF 50-140mm f/2.8 R', type: 'zoom', focal: '50-140mm', aperture: 'f/2.8', price: 9990, mount: 'X', pros: ['长焦变焦', '防抖'], cons: ['较重'] },
                    { name: 'XF 10-24mm f/4 R', type: 'zoom', focal: '10-24mm', aperture: 'f/4', price: 6990, mount: 'X', pros: ['超广角', '轻便'], cons: ['光圈较小'] },
                    { name: 'XF 55-200mm f/3.5-4.8 R', type: 'zoom', focal: '55-200mm', aperture: 'f/3.5-4.8', price: 4990, mount: 'X', pros: ['轻便长焦', '性价比高'], cons: ['光圈较小'] }
                ]
            },
            sigma: {
                name: '适马',
                lenses: [
                    { name: 'Art 35mm f/1.4 DG DN', type: 'prime', focal: '35mm', aperture: 'f/1.4', price: 5999, mount: 'E/L/RF', pros: ['Art系列画质', '性价比高'], cons: ['重量较大'] },
                    { name: 'Art 85mm f/1.4 DG DN', type: 'prime', focal: '85mm', aperture: 'f/1.4', price: 6999, mount: 'E/L', pros: ['Art系列人像', '性价比高'], cons: ['重量较大'] },
                    { name: 'Art 24-70mm f/2.8 DG DN', type: 'zoom', focal: '24-70mm', aperture: 'f/2.8', price: 7999, mount: 'E/L', pros: ['Art系列变焦', '性价比高'], cons: ['重量较大'] }
                ]
            },
            tamron: {
                name: '腾龙',
                lenses: [
                    { name: '28-75mm f/2.8 Di III VXD G2', type: 'zoom', focal: '28-75mm', aperture: 'f/2.8', price: 5999, mount: 'E', pros: ['轻便', '性价比高'], cons: ['广角端28mm'] },
                    { name: '70-180mm f/2.8 Di III VXD', type: 'zoom', focal: '70-180mm', aperture: 'f/2.8', price: 7999, mount: 'E', pros: ['轻便长焦', '性价比高'], cons: ['180mm略短'] },
                    { name: '17-28mm f/2.8 Di III RXD', type: 'zoom', focal: '17-28mm', aperture: 'f/2.8', price: 5999, mount: 'E', pros: ['轻便超广角', '性价比高'], cons: ['28mm长焦端'] },
                    { name: '35-150mm f/2-2.8 Di III VXD', type: 'zoom', focal: '35-150mm', aperture: 'f/2-2.8', price: 12999, mount: 'E', pros: ['大光圈变焦', '人像专用'], cons: ['价格较高', '重量大'] }
                ]
            }
        };

        // 加载套装数据库（相机+镜头组合）
        this.comboDatabase = [
            { name: '入门人像套装', camera: '佳能 EOS R50', lens: 'RF 50mm f/1.8', totalPrice: 5898, type: 'portrait', pros: ['轻便', '便宜', '虚化好'], cons: ['APS-C画幅', '镜头群少'] },
            { name: '入门旅行套装', camera: '索尼 ZV-E10 II', lens: 'E 18-135mm', totalPrice: 8899, type: 'travel', pros: ['轻便', '变焦方便', 'Vlog友好'], cons: ['无防抖', 'APS-C'] },
            { name: '均衡全幅套装', camera: '索尼 A7C II', lens: 'FE 28-60mm', totalPrice: 16999, type: 'general', pros: ['全画幅', '轻便', '均衡'], cons: ['套头光圈小'] },
            { name: '专业人像套装', camera: '佳能 EOS R6', lens: 'RF 85mm f/1.2L', totalPrice: 34998, type: 'portrait', pros: ['顶级人像', '全画幅', '防抖'], cons: ['价格贵', '重量大'] },
            { name: '风光摄影套装', camera: '尼康 Z7 II', lens: 'Z 14-24mm f/2.8', totalPrice: 31998, type: 'landscape', pros: ['高像素', '超广角', '画质顶级'], cons: ['价格贵', '重量大'] },
            { name: '视频创作套装', camera: '松下 S5 II', lens: 'L 20-60mm', totalPrice: 16998, type: 'video', pros: ['视频强', '防抖好', '轻便'], cons: ['镜头群少'] },
            { name: ' wildlife 套装', camera: '索尼 A7 IV', lens: 'FE 200-600mm', totalPrice: 29998, type: 'wildlife', pros: ['远摄', '对焦快', '全画幅'], cons: ['重量大', '光圈小'] },
            { name: '街拍纪实套装', camera: '富士 X100VI', lens: '固定 23mm f/2', totalPrice: 11390, type: 'street', pros: ['便携', '定焦', '胶片模拟'], cons: ['固定镜头', '不可换'] }
        ];
    }

    // 绑定事件
    bindEvents() {
        // 对比类型切换
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.disabled) return;
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.compareType = btn.dataset.type;
                this.clearSelection();
            });
        });

        // 添加器材按钮
        document.getElementById('addItemBtn').addEventListener('click', () => {
            this.openSelector();
        });

        // 开始对比按钮
        document.getElementById('compareBtn').addEventListener('click', () => {
            this.startCompare();
        });

        // 清空按钮
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearSelection();
        });

        // 弹窗关闭
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeSelector();
        });
        document.getElementById('selectorModal').querySelector('.modal-overlay').addEventListener('click', () => {
            this.closeSelector();
        });

        // 筛选器
        document.getElementById('brandFilter').addEventListener('change', () => {
            this.renderSelectorList();
        });
        document.getElementById('typeFilter').addEventListener('change', () => {
            this.renderSelectorList();
        });
    }

    // 打开选择器
    openSelector() {
        this.renderSelectorList();
        document.getElementById('selectorModal').classList.add('active');
    }

    // 关闭选择器
    closeSelector() {
        document.getElementById('selectorModal').classList.remove('active');
    }

    // 渲染选择器列表
    renderSelectorList() {
        const brandFilter = document.getElementById('brandFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;
        const list = document.getElementById('selectorList');
        
        list.innerHTML = '';
        
        if (this.compareType === 'camera') {
            this.renderCameraList(list, brandFilter, typeFilter);
        } else if (this.compareType === 'lens') {
            this.renderLensList(list, brandFilter, typeFilter);
        } else if (this.compareType === 'combo') {
            this.renderComboList(list, typeFilter);
        }
    }

    // 渲染相机列表
    renderCameraList(list, brandFilter, typeFilter) {
        Object.entries(this.cameraDatabase).forEach(([brandKey, brand]) => {
            if (brandFilter && brandKey !== brandFilter) return;
            
            Object.entries(brand.models).forEach(([modelKey, model]) => {
                if (typeFilter && model.type !== typeFilter) return;
                
                const isSelected = this.selectedItems.some(item => 
                    item.brand === brandKey && item.model === modelKey && item.compareType === 'camera'
                );
                
                const item = document.createElement('div');
                item.className = 'selector-item';
                if (isSelected) {
                    item.style.opacity = '0.5';
                    item.style.cursor = 'not-allowed';
                }
                item.innerHTML = `
                    <div class="item-icon">
                        <i class="fas fa-camera"></i>
                    </div>
                    <div class="item-info">
                        <div class="item-name">${brand.name} ${model.name}</div>
                        <div class="item-specs">${this.getTypeLabel(model.type)} · ${model.pixel} · ${model.mount}卡口</div>
                    </div>
                    <div class="item-price">¥${model.price.toLocaleString()}</div>
                `;
                
                if (!isSelected) {
                    item.addEventListener('click', () => {
                        this.addCameraItem(brandKey, brand.name, modelKey, model);
                        this.closeSelector();
                    });
                }
                
                list.appendChild(item);
            });
        });
    }

    // 渲染镜头列表
    renderLensList(list, brandFilter, typeFilter) {
        Object.entries(this.lensDatabase).forEach(([brandKey, brand]) => {
            if (brandFilter && brandKey !== brandFilter) return;
            
            brand.lenses.forEach((lens, index) => {
                if (typeFilter && lens.type !== typeFilter) return;
                
                const isSelected = this.selectedItems.some(item => 
                    item.brand === brandKey && item.index === index && item.compareType === 'lens'
                );
                
                const item = document.createElement('div');
                item.className = 'selector-item';
                if (isSelected) {
                    item.style.opacity = '0.5';
                    item.style.cursor = 'not-allowed';
                }
                item.innerHTML = `
                    <div class="item-icon">
                        <i class="fas fa-circle-dot"></i>
                    </div>
                    <div class="item-info">
                        <div class="item-name">${brand.name} ${lens.name}</div>
                        <div class="item-specs">${this.getLensTypeLabel(lens.type)} · ${lens.focal} · ${lens.aperture} · ${lens.mount}</div>
                    </div>
                    <div class="item-price">¥${lens.price.toLocaleString()}</div>
                `;
                
                if (!isSelected) {
                    item.addEventListener('click', () => {
                        this.addLensItem(brandKey, brand.name, index, lens);
                        this.closeSelector();
                    });
                }
                
                list.appendChild(item);
            });
        });
    }

    // 渲染套装列表
    renderComboList(list, typeFilter) {
        this.comboDatabase.forEach((combo, index) => {
            if (typeFilter && combo.type !== typeFilter) return;
            
            const isSelected = this.selectedItems.some(item => 
                item.index === index && item.compareType === 'combo'
            );
            
            const item = document.createElement('div');
            item.className = 'selector-item';
            if (isSelected) {
                item.style.opacity = '0.5';
                item.style.cursor = 'not-allowed';
            }
            item.innerHTML = `
                <div class="item-icon">
                    <i class="fas fa-box-open"></i>
                </div>
                <div class="item-info">
                    <div class="item-name">${combo.name}</div>
                    <div class="item-specs">${combo.camera} + ${combo.lens}</div>
                </div>
                <div class="item-price">¥${combo.totalPrice.toLocaleString()}</div>
            `;
            
            if (!isSelected) {
                item.addEventListener('click', () => {
                    this.addComboItem(index, combo);
                    this.closeSelector();
                });
            }
            
            list.appendChild(item);
        });
    }

    // 获取镜头类型标签
    getLensTypeLabel(type) {
        const labels = {
            'prime': '定焦',
            'zoom': '变焦',
            'macro': '微距'
        };
        return labels[type] || type;
    }

    // 获取类型标签
    getTypeLabel(type) {
        const labels = {
            'fullframe': '全画幅',
            'apsc': 'APS-C',
            'm43': 'M43',
            'medium': '中画幅'
        };
        return labels[type] || type;
    }

    // 添加相机
    addCameraItem(brandKey, brandName, modelKey, model) {
        if (this.selectedItems.length >= this.maxItems) {
            alert(`最多只能选择${this.maxItems}款器材进行对比`);
            return;
        }
        
        this.selectedItems.push({
            compareType: 'camera',
            brand: brandKey,
            brandName: brandName,
            model: modelKey,
            name: model.name,
            type: model.type,
            pixel: model.pixel,
            price: model.price,
            mount: model.mount,
            pros: model.pros,
            cons: model.cons
        });
        
        this.updateUI();
    }

    // 添加镜头
    addLensItem(brandKey, brandName, index, lens) {
        if (this.selectedItems.length >= this.maxItems) {
            alert(`最多只能选择${this.maxItems}款器材进行对比`);
            return;
        }
        
        this.selectedItems.push({
            compareType: 'lens',
            brand: brandKey,
            brandName: brandName,
            index: index,
            name: lens.name,
            type: lens.type,
            focal: lens.focal,
            aperture: lens.aperture,
            price: lens.price,
            mount: lens.mount,
            pros: lens.pros,
            cons: lens.cons
        });
        
        this.updateUI();
    }

    // 添加套装
    addComboItem(index, combo) {
        if (this.selectedItems.length >= this.maxItems) {
            alert(`最多只能选择${this.maxItems}款器材进行对比`);
            return;
        }
        
        this.selectedItems.push({
            compareType: 'combo',
            index: index,
            name: combo.name,
            camera: combo.camera,
            lens: combo.lens,
            totalPrice: combo.totalPrice,
            type: combo.type,
            pros: combo.pros,
            cons: combo.cons
        });
        
        this.updateUI();
    }

    // 移除器材
    removeItem(index) {
        this.selectedItems.splice(index, 1);
        this.updateUI();
    }

    // 清空选择
    clearSelection() {
        this.selectedItems = [];
        this.updateUI();
        document.getElementById('compareResults').classList.remove('active');
        document.getElementById('emptyState').style.display = 'block';
    }

    // 更新UI
    updateUI() {
        const container = document.getElementById('selectedItems');
        const addBtn = document.getElementById('addItemBtn');
        const compareBtn = document.getElementById('compareBtn');
        const clearBtn = document.getElementById('clearBtn');
        
        // 清空现有内容（保留添加按钮）
        container.innerHTML = '';
        
        // 渲染已选项目
        this.selectedItems.forEach((item, index) => {
            const el = document.createElement('div');
            el.className = 'selected-item';
            
            let icon, name, subtitle;
            if (item.compareType === 'camera') {
                icon = 'fa-camera';
                name = `${item.brandName} ${item.name}`;
                subtitle = `${this.getTypeLabel(item.type)} · ¥${item.price.toLocaleString()}`;
            } else if (item.compareType === 'lens') {
                icon = 'fa-circle-dot';
                name = `${item.brandName} ${item.name}`;
                subtitle = `${this.getLensTypeLabel(item.type)} · ${item.focal} · ¥${item.price.toLocaleString()}`;
            } else if (item.compareType === 'combo') {
                icon = 'fa-box-open';
                name = item.name;
                subtitle = `套装 · ¥${item.totalPrice.toLocaleString()}`;
            }
            
            el.innerHTML = `
                <div class="item-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="item-info">
                    <div class="item-name">${name}</div>
                    <div class="item-brand">${subtitle}</div>
                </div>
                <button class="remove-btn" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            container.appendChild(el);
        });
        
        // 添加按钮
        container.appendChild(addBtn);
        addBtn.disabled = this.selectedItems.length >= this.maxItems;
        
        // 更新按钮状态
        compareBtn.disabled = this.selectedItems.length < 2;
        clearBtn.style.display = this.selectedItems.length > 0 ? 'flex' : 'none';
        
        // 更新容器样式
        if (this.selectedItems.length > 0) {
            container.classList.add('has-items');
        } else {
            container.classList.remove('has-items');
        }
        
        // 绑定移除事件
        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.removeItem(index);
            });
        });
    }

    // 开始对比
    startCompare() {
        if (this.selectedItems.length < 2) return;
        
        document.getElementById('emptyState').style.display = 'none';
        document.getElementById('compareResults').classList.add('active');
        
        this.renderCompareTable();
        this.renderRadarCharts();
        this.renderProsCons();
        this.renderRecommendation();
        
        // 滚动到结果区
        document.getElementById('compareResults').scrollIntoView({ behavior: 'smooth' });
    }

    // 渲染对比表
    renderCompareTable() {
        const table = document.getElementById('compareTable');
        const firstItem = this.selectedItems[0];
        
        let html = '';
        
        if (firstItem.compareType === 'camera') {
            html = this.renderCameraCompareTable();
        } else if (firstItem.compareType === 'lens') {
            html = this.renderLensCompareTable();
        } else if (firstItem.compareType === 'combo') {
            html = this.renderComboCompareTable();
        }
        
        table.innerHTML = html;
    }

    // 渲染相机对比表
    renderCameraCompareTable() {
        const getPrice = item => item.price;
        const minPrice = Math.min(...this.selectedItems.map(getPrice));
        
        return `
            <thead>
                <tr>
                    <th>参数</th>
                    ${this.selectedItems.map(item => `<th>${item.brandName} ${item.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="param-name">品牌</td>
                    ${this.selectedItems.map(item => `<td>${item.brandName}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">型号</td>
                    ${this.selectedItems.map(item => `<td>${item.name}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">画幅</td>
                    ${this.selectedItems.map(item => `<td>${this.getTypeLabel(item.type)}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">像素</td>
                    ${this.selectedItems.map(item => `<td>${item.pixel}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">卡口</td>
                    ${this.selectedItems.map(item => `<td>${item.mount}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">参考价格</td>
                    ${this.selectedItems.map(item => {
                        const isMin = item.price === minPrice;
                        return `<td class="${isMin ? 'best-value' : ''}">¥${item.price.toLocaleString()}${isMin ? ' (最低)' : ''}</td>`;
                    }).join('')}
                </tr>
            </tbody>
        `;
    }

    // 渲染镜头对比表
    renderLensCompareTable() {
        const getPrice = item => item.price;
        const minPrice = Math.min(...this.selectedItems.map(getPrice));
        
        return `
            <thead>
                <tr>
                    <th>参数</th>
                    ${this.selectedItems.map(item => `<th>${item.brandName} ${item.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="param-name">品牌</td>
                    ${this.selectedItems.map(item => `<td>${item.brandName}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">型号</td>
                    ${this.selectedItems.map(item => `<td>${item.name}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">类型</td>
                    ${this.selectedItems.map(item => `<td>${this.getLensTypeLabel(item.type)}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">焦距</td>
                    ${this.selectedItems.map(item => `<td>${item.focal}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">最大光圈</td>
                    ${this.selectedItems.map(item => `<td>${item.aperture}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">卡口</td>
                    ${this.selectedItems.map(item => `<td>${item.mount}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">参考价格</td>
                    ${this.selectedItems.map(item => {
                        const isMin = item.price === minPrice;
                        return `<td class="${isMin ? 'best-value' : ''}">¥${item.price.toLocaleString()}${isMin ? ' (最低)' : ''}</td>`;
                    }).join('')}
                </tr>
            </tbody>
        `;
    }

    // 渲染套装对比表
    renderComboCompareTable() {
        const getPrice = item => item.totalPrice;
        const minPrice = Math.min(...this.selectedItems.map(getPrice));
        
        return `
            <thead>
                <tr>
                    <th>参数</th>
                    ${this.selectedItems.map(item => `<th>${item.name}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="param-name">套装名称</td>
                    ${this.selectedItems.map(item => `<td>${item.name}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">相机</td>
                    ${this.selectedItems.map(item => `<td>${item.camera}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">镜头</td>
                    ${this.selectedItems.map(item => `<td>${item.lens}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">适用场景</td>
                    ${this.selectedItems.map(item => `<td>${this.getSceneLabel(item.type)}</td>`).join('')}
                </tr>
                <tr>
                    <td class="param-name">套装总价</td>
                    ${this.selectedItems.map(item => {
                        const isMin = item.totalPrice === minPrice;
                        return `<td class="${isMin ? 'best-value' : ''}">¥${item.totalPrice.toLocaleString()}${isMin ? ' (最低)' : ''}</td>`;
                    }).join('')}
                </tr>
            </tbody>
        `;
    }

    // 获取场景标签
    getSceneLabel(type) {
        const labels = {
            'portrait': '人像摄影',
            'landscape': '风光摄影',
            'street': '街拍纪实',
            'travel': '旅行摄影',
            'video': '视频创作',
            'wildlife': '野生动物',
            'general': '综合用途'
        };
        return labels[type] || type;
    }

    // 渲染雷达图
    renderRadarCharts() {
        const container = document.getElementById('radarCharts');
        container.innerHTML = '';
        
        // 为每个项目生成雷达图
        this.selectedItems.forEach((item, index) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'radar-chart-wrapper';
            
            let title;
            if (item.compareType === 'camera') {
                title = `${item.brandName} ${item.name}`;
            } else if (item.compareType === 'lens') {
                title = `${item.brandName} ${item.name}`;
            } else if (item.compareType === 'combo') {
                title = item.name;
            }
            
            wrapper.innerHTML = `
                <h4>${title}</h4>
                <canvas class="radar-chart" id="radarChart${index}" width="280" height="280"></canvas>
            `;
            container.appendChild(wrapper);
            
            // 绘制雷达图
            this.drawRadarChart(`radarChart${index}`, item);
        });
    }

    // 绘制雷达图
    drawRadarChart(canvasId, item) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 100;
        
        // 场景评分（模拟数据，实际应从数据库获取）
        const scores = this.calculateSceneScores(item);
        const labels = ['人像', '风光', '街拍', '旅行', '弱光', '视频'];
        const maxScore = 10;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制网格
        for (let i = 1; i <= 5; i++) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 1;
            for (let j = 0; j < 6; j++) {
                const angle = (Math.PI * 2 / 6) * j - Math.PI / 2;
                const x = centerX + Math.cos(angle) * (radius * i / 5);
                const y = centerY + Math.sin(angle) * (radius * i / 5);
                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }
        
        // 绘制轴线
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // 绘制标签
            const labelX = centerX + Math.cos(angle) * (radius + 20);
            const labelY = centerY + Math.sin(angle) * (radius + 20);
            ctx.fillStyle = '#333';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(labels[i], labelX, labelY);
        }
        
        // 绘制数据
        ctx.beginPath();
        ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 2;
        
        scores.forEach((score, i) => {
            const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
            const r = (score / maxScore) * radius;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // 绘制数据点
        scores.forEach((score, i) => {
            const angle = (Math.PI * 2 / 6) * i - Math.PI / 2;
            const r = (score / maxScore) * radius;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            ctx.beginPath();
            ctx.fillStyle = '#3498db';
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // 计算场景评分（模拟算法）
    calculateSceneScores(item) {
        // 根据对比类型计算评分
        if (item.compareType === 'lens') {
            return this.calculateLensSceneScores(item);
        } else if (item.compareType === 'combo') {
            return this.calculateComboSceneScores(item);
        }
        
        // 基于相机参数计算各场景评分（0-10）
        const scores = {
            portrait: 5,
            landscape: 5,
            street: 5,
            travel: 5,
            lowlight: 5,
            video: 5
        };
        
        // 根据画幅调整
        if (item.type === 'fullframe') {
            scores.portrait += 2;
            scores.landscape += 2;
            scores.lowlight += 3;
        } else if (item.type === 'apsc') {
            scores.street += 1;
            scores.travel += 1;
        } else if (item.type === 'm43') {
            scores.travel += 2;
            scores.video += 1;
        } else if (item.type === 'medium') {
            scores.landscape += 3;
            scores.portrait += 2;
        }
        
        // 根据像素调整
        const pixelNum = parseInt(item.pixel);
        if (pixelNum >= 4000) {
            scores.landscape += 1;
            scores.portrait += 1;
        }
        
        // 根据价格调整（高端机通常视频性能更好）
        if (item.price > 20000) {
            scores.video += 2;
        }
        
        return [
            Math.min(10, scores.portrait),
            Math.min(10, scores.landscape),
            Math.min(10, scores.street),
            Math.min(10, scores.travel),
            Math.min(10, scores.lowlight),
            Math.min(10, scores.video)
        ];
    }

    // 计算镜头场景评分
    calculateLensSceneScores(item) {
        const scores = {
            portrait: 5,
            landscape: 5,
            street: 5,
            travel: 5,
            lowlight: 5,
            video: 5
        };
        
        const focal = item.focal;
        const aperture = item.aperture;
        
        // 根据焦距调整
        if (focal.includes('85') || focal.includes('135') || focal.includes('200')) {
            scores.portrait += 3;
        } else if (focal.includes('50') || focal.includes('56')) {
            scores.portrait += 2;
            scores.street += 1;
        } else if (focal.includes('35')) {
            scores.street += 3;
            scores.portrait += 1;
        } else if (focal.includes('24') || focal.includes('16') || focal.includes('14')) {
            scores.landscape += 3;
        } else if (focal.includes('28-200') || focal.includes('24-240') || focal.includes('18-200')) {
            scores.travel += 3;
        }
        
        // 根据光圈调整
        if (aperture.includes('1.2') || aperture.includes('1.4')) {
            scores.portrait += 2;
            scores.lowlight += 3;
        } else if (aperture.includes('1.8') || aperture.includes('2')) {
            scores.portrait += 1;
            scores.lowlight += 2;
        } else if (aperture.includes('2.8')) {
            scores.lowlight += 1;
        }
        
        // 变焦镜头更适合旅行和视频
        if (item.type === 'zoom') {
            scores.travel += 2;
            scores.video += 1;
        }
        
        return [
            Math.min(10, scores.portrait),
            Math.min(10, scores.landscape),
            Math.min(10, scores.street),
            Math.min(10, scores.travel),
            Math.min(10, scores.lowlight),
            Math.min(10, scores.video)
        ];
    }

    // 计算套装场景评分
    calculateComboSceneScores(item) {
        // 根据套装类型直接返回预设评分
        const sceneScores = {
            'portrait': [9, 5, 6, 5, 7, 6],
            'landscape': [5, 9, 6, 7, 6, 7],
            'street': [6, 5, 9, 7, 6, 5],
            'travel': [6, 7, 7, 9, 5, 6],
            'video': [5, 6, 6, 6, 7, 9],
            'wildlife': [4, 6, 5, 5, 6, 6],
            'general': [7, 7, 7, 7, 6, 6]
        };
        
        return sceneScores[item.type] || sceneScores['general'];
    }

    // 渲染优缺点
    renderProsCons() {
        const grid = document.getElementById('prosConsGrid');
        grid.innerHTML = '';
        
        this.selectedItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'pros-cons-card';
            
            let title;
            if (item.compareType === 'camera') {
                title = `${item.brandName} ${item.name}`;
            } else if (item.compareType === 'lens') {
                title = `${item.brandName} ${item.name}`;
            } else if (item.compareType === 'combo') {
                title = item.name;
            }
            
            card.innerHTML = `
                <h4>${title}</h4>
                <div class="pros">
                    <h5><i class="fas fa-plus-circle"></i> 优点</h5>
                    <ul>
                        ${item.pros.map(pro => `<li>${pro}</li>`).join('')}
                    </ul>
                </div>
                <div class="cons">
                    <h5><i class="fas fa-minus-circle"></i> 缺点</h5>
                    <ul>
                        ${item.cons.map(con => `<li>${con}</li>`).join('')}
                    </ul>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // 渲染推荐结论
    renderRecommendation() {
        const container = document.getElementById('recommendation');
        const firstItem = this.selectedItems[0];
        
        if (firstItem.compareType === 'camera') {
            this.renderCameraRecommendation(container);
        } else if (firstItem.compareType === 'lens') {
            this.renderLensRecommendation(container);
        } else if (firstItem.compareType === 'combo') {
            this.renderComboRecommendation(container);
        }
    }

    // 渲染相机推荐结论
    renderCameraRecommendation(container) {
        // 找出性价比最高的
        const bestValue = this.selectedItems.reduce((best, item) => {
            const score = this.calculateSceneScores(item).reduce((a, b) => a + b, 0);
            const value = score / (item.price / 10000);
            return value > best.value ? { item, value } : best;
        }, { value: 0 });
        
        // 找出价格最低的
        const cheapest = this.selectedItems.reduce((min, item) => 
            item.price < min.price ? item : min
        );
        
        // 找出画幅最大的
        const formatOrder = { 'medium': 4, 'fullframe': 3, 'apsc': 2, 'm43': 1 };
        const bestFormat = this.selectedItems.reduce((best, item) => 
            (formatOrder[item.type] || 0) > (formatOrder[best.type] || 0) ? item : best
        );
        
        container.innerHTML = `
            <h4><i class="fas fa-lightbulb"></i> 选购建议</h4>
            <p>
                <strong>追求性价比：</strong>推荐 ${bestValue.item.brandName} ${bestValue.item.name}，
                综合评分与价格比最优。<br><br>
                
                <strong>预算有限：</strong>推荐 ${cheapest.brandName} ${cheapest.name}，
                价格最低（¥${cheapest.price.toLocaleString()}），适合入门。<br><br>
                
                <strong>追求画质：</strong>推荐 ${bestFormat.brandName} ${bestFormat.name}，
                ${this.getTypeLabel(bestFormat.type)}画幅带来更好的画质表现。
            </p>
        `;
    }

    // 渲染镜头推荐结论
    renderLensRecommendation(container) {
        // 找出性价比最高的
        const bestValue = this.selectedItems.reduce((best, item) => {
            const score = this.calculateSceneScores(item).reduce((a, b) => a + b, 0);
            const value = score / (item.price / 10000);
            return value > best.value ? { item, value } : best;
        }, { value: 0 });
        
        // 找出价格最低的
        const cheapest = this.selectedItems.reduce((min, item) => 
            item.price < min.price ? item : min
        );
        
        // 找出光圈最大的
        const getApertureNum = (aperture) => {
            const match = aperture.match(/[\d.]+/);
            return match ? parseFloat(match[0]) : 999;
        };
        const bestAperture = this.selectedItems.reduce((best, item) => 
            getApertureNum(item.aperture) < getApertureNum(best.aperture) ? item : best
        );
        
        container.innerHTML = `
            <h4><i class="fas fa-lightbulb"></i> 选购建议</h4>
            <p>
                <strong>追求性价比：</strong>推荐 ${bestValue.item.brandName} ${bestValue.item.name}，
                综合评分与价格比最优。<br><br>
                
                <strong>预算有限：</strong>推荐 ${cheapest.brandName} ${cheapest.name}，
                价格最低（¥${cheapest.price.toLocaleString()}），适合入门。<br><br>
                
                <strong>追求虚化：</strong>推荐 ${bestAperture.brandName} ${bestAperture.name}，
                ${bestAperture.aperture}大光圈带来更好的虚化效果。
            </p>
        `;
    }

    // 渲染套装推荐结论
    renderComboRecommendation(container) {
        // 找出性价比最高的
        const bestValue = this.selectedItems.reduce((best, item) => {
            const score = this.calculateSceneScores(item).reduce((a, b) => a + b, 0);
            const value = score / (item.totalPrice / 10000);
            return value > best.value ? { item, value } : best;
        }, { value: 0 });
        
        // 找出价格最低的
        const cheapest = this.selectedItems.reduce((min, item) => 
            item.totalPrice < min.totalPrice ? item : min
        );
        
        container.innerHTML = `
            <h4><i class="fas fa-lightbulb"></i> 选购建议</h4>
            <p>
                <strong>追求性价比：</strong>推荐 ${bestValue.item.name}，
                综合评分与价格比最优。<br><br>
                
                <strong>预算有限：</strong>推荐 ${cheapest.name}，
                价格最低（¥${cheapest.totalPrice.toLocaleString()}），适合入门。<br><br>
                
                <strong>套装包含：</strong>${cheapest.camera} + ${cheapest.lens}
            </p>
        `;
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new GearCompare();
});

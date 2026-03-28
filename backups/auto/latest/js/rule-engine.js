// Photo Monster - 专业规则引擎系统
// 基于 EXIF 数据和摄影规则提供深度智能分析

class PhotoRuleEngine {
    constructor() {
        this.analysisRules = this.initAnalysisRules();
        this.shootingPlans = this.initShootingPlans();
        this.lensDatabase = this.initLensDatabase();
        this.cameraDatabase = this.initCameraDatabase();
    }

    // 初始化镜头数据库
    initLensDatabase() {
        return {
            // 佳能镜头
            'Canon EF 50mm f/1.8': { type: 'prime', category: 'portrait', quality: 'entry' },
            'Canon EF 50mm f/1.4': { type: 'prime', category: 'portrait', quality: 'mid' },
            'Canon EF 85mm f/1.8': { type: 'prime', category: 'portrait', quality: 'mid' },
            'Canon EF 85mm f/1.2L': { type: 'prime', category: 'portrait', quality: 'pro' },
            'Canon EF 24-70mm': { type: 'zoom', category: 'versatile', quality: 'pro' },
            'Canon EF 16-35mm': { type: 'zoom', category: 'landscape', quality: 'pro' },
            'Canon EF 70-200mm': { type: 'zoom', category: 'telephoto', quality: 'pro' },
            
            // 索尼镜头
            'Sony FE 85mm': { type: 'prime', category: 'portrait', quality: 'pro' },
            'Sony FE 50mm': { type: 'prime', category: 'portrait', quality: 'mid' },
            'Sony FE 24-70mm': { type: 'zoom', category: 'versatile', quality: 'pro' },
            'Sony FE 16-35mm': { type: 'zoom', category: 'landscape', quality: 'pro' },
            
            // 尼康镜头
            'Nikon 50mm': { type: 'prime', category: 'portrait', quality: 'mid' },
            'Nikon 85mm': { type: 'prime', category: 'portrait', quality: 'mid' },
            'Nikon 24-70mm': { type: 'zoom', category: 'versatile', quality: 'pro' },
            
            // 适马镜头
            'Sigma 35mm f/1.4': { type: 'prime', category: 'versatile', quality: 'pro' },
            'Sigma 85mm f/1.4': { type: 'prime', category: 'portrait', quality: 'pro' },
            'Sigma 24-70mm': { type: 'zoom', category: 'versatile', quality: 'pro' }
        };
    }

    // 初始化相机数据库
    initCameraDatabase() {
        return {
            // 全画幅
            'Canon EOS R5': { sensor: 'fullframe', mp: 45, lowLight: 9 },
            'Canon EOS R6': { sensor: 'fullframe', mp: 20, lowLight: 10 },
            'Sony A7R IV': { sensor: 'fullframe', mp: 61, lowLight: 8 },
            'Sony A7S III': { sensor: 'fullframe', mp: 12, lowLight: 10 },
            'Nikon Z7 II': { sensor: 'fullframe', mp: 45, lowLight: 8 },
            
            // APS-C
            'Canon EOS R7': { sensor: 'apsc', mp: 32, lowLight: 7 },
            'Sony A6700': { sensor: 'apsc', mp: 26, lowLight: 7 },
            'Fujifilm X-T5': { sensor: 'apsc', mp: 40, lowLight: 7 },
            
            // M43
            'Olympus OM-1': { sensor: 'm43', mp: 20, lowLight: 6 },
            'Panasonic GH6': { sensor: 'm43', mp: 25, lowLight: 6 }
        };
    }

    // 初始化分析规则
    initAnalysisRules() {
        return {
            // 曝光评估规则
            exposure: {
                name: '曝光控制',
                icon: 'fa-sun',
                evaluate: (exif) => {
                    const issues = [];
                    const suggestions = [];
                    let score = 10;

                    const iso = parseInt(exif.ISOSpeedRatings) || 100;
                    const aperture = parseFloat(exif.FNumber) || 5.6;
                    const shutter = this.parseShutterSpeed(exif.ExposureTime);
                    const focalLength = parseFloat(exif.FocalLength) || 50;
                    
                    // ISO 评估（考虑相机性能）
                    const cameraModel = exif.Model || '';
                    let isoLimit = 6400; // 默认
                    if (cameraModel.includes('A7S') || cameraModel.includes('R6')) {
                        isoLimit = 25600;
                    }
                    
                    if (iso > isoLimit) {
                        score -= 3;
                        issues.push(`ISO ${iso} 过高，${cameraModel ? '即使对于这台相机' : ''}也会产生明显噪点，影响画质`);
                        suggestions.push('使用三脚架或寻找支撑点，将ISO降至' + Math.floor(isoLimit/2) + '以下');
                        suggestions.push('考虑使用更大光圈镜头或补光设备');
                    } else if (iso > isoLimit / 2) {
                        score -= 1;
                        issues.push(`ISO ${iso} 偏高，注意后期降噪处理`);
                        suggestions.push('RAW格式拍摄保留更多后期空间');
                    } else if (iso <= 400) {
                        score += 0.5;
                    }

                    // 快门速度评估
                    const safeShutter = 1 / (focalLength * (exif.Make?.includes('Sony') ? 1 : 1.5));
                    
                    if (shutter < 1/30 && !exif.isTripod) {
                        if (shutter < safeShutter) {
                            score -= 3;
                            issues.push(`快门 1/${Math.round(1/shutter)}s 远低于安全快门 1/${Math.round(1/safeShutter)}s，手持拍摄极易模糊`);
                            suggestions.push(`手持拍摄建议快门不低于 1/${Math.round(1/safeShutter)}s`);
                            suggestions.push('开启镜头/机身防抖（如有）');
                            suggestions.push('寻找支撑点或使用三脚架');
                        }
                    } else if (shutter > 1/1000) {
                        score += 0.5;
                        suggestions.push('高速快门可冻结动作，适合运动题材');
                    }

                    // 曝光补偿检查
                    if (exif.ExposureBiasValue !== undefined) {
                        const bias = parseFloat(exif.ExposureBiasValue);
                        if (Math.abs(bias) > 1.5) {
                            score -= 2;
                            issues.push(`曝光补偿 ${bias > 0 ? '+' : ''}${bias}EV 偏离较大，画面可能${bias > 0 ? '过曝丢失高光细节' : '欠曝暗部死黑'}`);
                            suggestions.push(bias > 0 ? '使用渐变滤镜压暗天空，或包围曝光后期合成' : '适当提亮曝光，保留暗部细节');
                        }
                    }

                    // 曝光三角平衡评估
                    if (iso > 3200 && aperture > 5.6 && shutter < 1/60) {
                        suggestions.push('当前参数组合不够优化，建议优先使用大光圈而非高ISO');
                    }

                    return { 
                        score: Math.max(1, Math.min(10, score)), 
                        issues, 
                        suggestions,
                        details: {
                            iso,
                            aperture,
                            shutter: `1/${Math.round(1/shutter)}s`,
                            safeShutter: `1/${Math.round(1/safeShutter)}s`,
                            exposureTriangle: this.evaluateExposureTriangle(iso, aperture, shutter)
                        }
                    };
                }
            },

            // 景深控制规则
            depthOfField: {
                name: '景深控制',
                icon: 'fa-bullseye',
                evaluate: (exif) => {
                    const issues = [];
                    const suggestions = [];
                    let score = 10;

                    const aperture = parseFloat(exif.FNumber) || 5.6;
                    const focalLength = parseFloat(exif.FocalLength) || 50;
                    const focusDistance = parseFloat(exif.FocusDistance) || 0;
                    
                    // 计算景深（简化公式）
                    const dof = this.calculateDOF(aperture, focalLength, focusDistance);

                    // 人像拍摄评估
                    if (focalLength >= 50 && focalLength <= 135) {
                        if (aperture >= 5.6) {
                            score -= 2;
                            issues.push(`人像拍摄使用 f/${aperture} 光圈过小，背景虚化不足，主体不够突出`);
                            suggestions.push(`建议使用 f/1.4-f/2.8 大光圈，创造柔和背景虚化`);
                            suggestions.push(`当前设置更适合环境人像，如需特写请开大光圈`);
                        } else if (aperture >= 2.8 && aperture < 5.6) {
                            score -= 0.5;
                            suggestions.push(`f/${aperture} 可获得适度虚化，如需更强虚化可开至 f/2 或更大`);
                        } else if (aperture < 2.0) {
                            score += 1;
                            suggestions.push(`f/${aperture} 大光圈创造美丽虚化，注意对焦精度，建议对焦眼睛`);
                            if (focalLength >= 85) {
                                suggestions.push(`${focalLength}mm + f/${aperture} 是专业人像组合`);
                            }
                        }
                        
                        // 检查景深是否过浅
                        if (aperture < 1.4 && focalLength > 100) {
                            issues.push(`景深极浅（约 ${dof.near}-${dof.far}），对焦要求极高`);
                            suggestions.push('建议使用单点对焦，精确对焦眼睛');
                            suggestions.push('连拍多张确保至少一张清晰');
                        }
                    }

                    // 风光拍摄评估
                    if (focalLength < 35) {
                        if (aperture < 8) {
                            score -= 2;
                            issues.push(`风光拍摄 f/${aperture} 光圈过大，边缘画质下降且景深不足`);
                            suggestions.push(`风光摄影建议使用 f/8-f/11 获得最佳画质和全景深`);
                            suggestions.push(`当前设置可能导致前景或背景虚化，非风光常用选择`);
                        } else if (aperture >= 8 && aperture <= 11) {
                            score += 2;
                            suggestions.push(`f/${aperture} 是风光摄影最佳光圈，平衡画质与景深`);
                        } else if (aperture > 11) {
                            score -= 1;
                            issues.push(`f/${aperture} 光圈过小，可能产生衍射效应影响锐度`);
                            suggestions.push('风光摄影不建议小于 f/16，如需更长曝光请使用ND滤镜');
                        }
                    }

                    // 街拍/纪实评估
                    if (focalLength >= 28 && focalLength <= 50) {
                        if (aperture >= 8) {
                            score += 0.5;
                            suggestions.push(`f/${aperture} 适合街拍，提供足够景深确保主体清晰`);
                        }
                    }

                    // 微距评估
                    if (exif.LensModel?.toLowerCase().includes('macro') || focalLength > 80 && focusDistance < 1) {
                        if (aperture < 11) {
                            score -= 1;
                            issues.push('微距摄影景深极浅，当前光圈可能导致主体部分模糊');
                            suggestions.push('微距建议使用 f/11-f/16，或焦点堆栈技术');
                        }
                    }

                    return { 
                        score: Math.max(1, Math.min(10, score)), 
                        issues, 
                        suggestions,
                        details: {
                            aperture,
                            focalLength,
                            dof,
                            hyperfocal: this.calculateHyperfocal(focalLength, aperture)
                        }
                    };
                }
            },

            // 焦段运用规则
            focalLength: {
                name: '焦段运用',
                icon: 'fa-ruler-horizontal',
                evaluate: (exif) => {
                    const suggestions = [];
                    const issues = [];
                    let score = 10;

                    const focalLength = parseFloat(exif.FocalLength) || 50;
                    const aperture = parseFloat(exif.FNumber) || 5.6;
                    
                    // 镜头识别（兼容多字段）
                    const lensModel = exif.LensModel || exif.LensInfo || exif.Lens || exif.LensID || '';
                    let lensInfo = null;
                    
                    if (lensModel) {
                        for (const [name, info] of Object.entries(this.lensDatabase)) {
                            const nameParts = name.split(' ');
                            const brand = nameParts[0];
                            const focal = nameParts[1];
                            
                            // 匹配品牌
                            if (lensModel.includes(brand)) {
                                // 匹配焦段
                                if (lensModel.includes(focal) || lensModel.includes(focal.replace('mm', ''))) {
                                    lensInfo = { name, ...info };
                                    break;
                                }
                            }
                        }
                    }
                    
                    // 如果没有精确匹配，根据焦段推测
                    if (!lensInfo && focalLength) {
                        if (focalLength >= 85 && focalLength <= 135) {
                            lensInfo = { category: 'portrait', type: 'prime' };
                        } else if (focalLength >= 24 && focalLength <= 70) {
                            lensInfo = { category: 'versatile', type: 'zoom' };
                        } else if (focalLength < 35) {
                            lensInfo = { category: 'landscape', type: 'zoom' };
                        }
                    }

                    // 超广角评估
                    if (focalLength < 24) {
                        score += 0.5;
                        suggestions.push(`${focalLength}mm 超广角适合风光、建筑，注意控制边缘变形`);
                        suggestions.push('尝试低角度拍摄增强透视冲击力');
                        suggestions.push('注意画面边缘避免放置重要元素，防止拉伸变形');
                    }
                    
                    // 广角评估
                    else if (focalLength >= 24 && focalLength < 35) {
                        suggestions.push(`${focalLength}mm 广角适合环境人像和街拍`);
                        if (aperture <= 2.8) {
                            suggestions.push('广角+大光圈组合可创造独特视觉效果');
                        }
                    }
                    
                    // 标准焦段
                    else if (focalLength >= 35 && focalLength < 50) {
                        suggestions.push(`${focalLength}mm 接近人眼视角，画面自然真实`);
                        suggestions.push('适合人文纪实、日常记录');
                    }
                    
                    // 50mm 标准
                    else if (focalLength >= 50 && focalLength < 70) {
                        suggestions.push(`${focalLength}mm 标准焦段，入门首选，性价比高`);
                        if (aperture <= 1.8) {
                            score += 0.5;
                            suggestions.push(`f/${aperture} 大光圈可获得美丽虚化`);
                        }
                    }
                    
                    // 人像焦段
                    else if (focalLength >= 70 && focalLength <= 135) {
                        score += 1;
                        suggestions.push(`${focalLength}mm 是人像摄影黄金焦段`);
                        suggestions.push('空间压缩感适中，面部透视自然');
                        if (focalLength === 85) {
                            suggestions.push('85mm 被称为"人像镜皇"焦段');
                        }
                        if (aperture <= 2.8) {
                            suggestions.push(`配合 f/${aperture} 可获得专业级背景虚化`);
                        }
                    }
                    
                    // 长焦
                    else if (focalLength > 135 && focalLength <= 300) {
                        suggestions.push(`${focalLength}mm 长焦适合体育、野生动物、远距离抓拍`);
                        suggestions.push('注意防抖，建议使用三脚架或提高快门速度');
                        if (focalLength > 200) {
                            issues.push('长焦对稳定性要求高，注意快门速度');
                        }
                    }
                    
                    // 超长焦
                    else if (focalLength > 300) {
                        score -= 0.5;
                        suggestions.push(`${focalLength}mm 超长焦适合鸟类、运动特写`);
                        suggestions.push('必须使用三脚架或独脚架');
                        suggestions.push('建议使用快门线或2秒延时拍摄');
                    }

                    // 变焦镜头使用建议
                    if (lensInfo?.type === 'zoom') {
                        suggestions.push(`当前使用变焦镜头，尝试固定焦段拍摄培养镜头感`);
                    }

                    return { 
                        score: Math.max(1, Math.min(10, score)), 
                        issues, 
                        suggestions,
                        details: {
                            focalLength,
                            lensInfo,
                            category: this.getFocalLengthCategory(focalLength)
                        }
                    };
                }
            },

            // 技术执行规则
            technical: {
                name: '技术执行',
                icon: 'fa-cogs',
                evaluate: (exif) => {
                    const issues = [];
                    const suggestions = [];
                    let score = 10;

                    // 白平衡检查
                    const whiteBalance = parseInt(exif.WhiteBalance);
                    if (whiteBalance === 0) {
                        suggestions.push('使用自动白平衡，如色彩不准可后期调整');
                        suggestions.push('复杂光源环境建议手动设置白平衡或拍摄灰卡');
                    } else {
                        score += 0.5;
                        suggestions.push('手动白平衡设置有助于色彩一致性');
                    }

                    // 测光模式评估
                    const metering = parseInt(exif.MeteringMode);
                    const meteringModes = {
                        1: '平均测光',
                        2: '中央重点',
                        3: '点测光',
                        4: '多区评价测光',
                        5: '图案测光'
                    };
                    
                    if (metering === 3) {
                        suggestions.push('使用点测光，适合精确控制曝光');
                        suggestions.push('注意测光点选择，通常对准18%灰区域');
                    } else if (metering === 4) {
                        score += 0.5;
                        suggestions.push('多区评价测光适合大多数场景');
                    }

                    // 对焦模式检查
                    const focusMode = exif.FocusMode || '';
                    if (focusMode.includes('AF')) {
                        if (focusMode.includes('Single') || focusMode.includes('S')) {
                            suggestions.push('单次对焦适合静态主体');
                        } else if (focusMode.includes('Continuous') || focusMode.includes('C')) {
                            score += 0.5;
                            suggestions.push('连续对焦适合运动主体');
                        }
                    }

                    // 文件格式检查
                    const fileFormat = exif.FileFormat || exif.Compression || '';
                    if (fileFormat.includes('JPEG') || fileFormat.includes('6')) {
                        issues.push('使用JPEG格式，后期调整空间有限');
                        suggestions.push('建议改用RAW格式拍摄，保留更多细节');
                        suggestions.push('RAW格式提供更大曝光和色彩调整空间');
                    } else if (fileFormat.includes('RAW')) {
                        score += 1;
                        suggestions.push('使用RAW格式，专业选择');
                    }

                    // 图像稳定检查
                    if (exif.ISOSpeedRatings > 1600 && exif.ExposureTime < 1/60) {
                        suggestions.push('高ISO+慢快门组合，建议开启防抖或寻找支撑');
                    }

                    // 直方图建议
                    suggestions.push('拍摄后检查直方图，确保曝光分布合理');
                    suggestions.push('避免直方图两端溢出，保留细节');

                    return { 
                        score: Math.max(1, Math.min(10, score)), 
                        issues, 
                        suggestions,
                        details: {
                            whiteBalance,
                            metering: meteringModes[metering] || '未知',
                            focusMode
                        }
                    };
                }
            },

            // 构图分析规则（基于EXIF中的焦距和拍摄参数推测）
            composition: {
                name: '构图评估',
                icon: 'fa-th-large',
                evaluate: (exif) => {
                    const suggestions = [];
                    const issues = [];
                    let score = 10;

                    const focalLength = parseFloat(exif.FocalLength) || 50;
                    const aspectRatio = this.getAspectRatio(exif);

                    // 根据焦距推测构图特点
                    if (focalLength < 35) {
                        suggestions.push('广角镜头适合强调前景，尝试低角度增强透视');
                        suggestions.push('注意画面边缘，避免重要元素被拉伸');
                        suggestions.push('利用广角的空间感创造纵深感');
                    } else if (focalLength >= 35 && focalLength < 70) {
                        suggestions.push('标准焦段构图自然，注意主体位置');
                        suggestions.push('尝试三分法构图，将主体放在黄金分割点');
                    } else if (focalLength >= 70) {
                        suggestions.push('长焦压缩空间，注意背景简洁');
                        suggestions.push('利用长焦的虚化效果分离主体');
                        suggestions.push('注意画面层次，避免过于平面');
                    }

                    // 画幅比例建议
                    if (aspectRatio === '3:2') {
                        suggestions.push('3:2画幅是标准比例，适合大多数场景');
                    } else if (aspectRatio === '4:3') {
                        suggestions.push('4:3画幅适合人像和静物');
                    } else if (aspectRatio === '16:9') {
                        suggestions.push('16:9宽画幅适合风光和电影感画面');
                    } else if (aspectRatio === '1:1') {
                        score += 0.5;
                        suggestions.push('1:1方画幅构图集中，适合社交媒体');
                    }

                    // 通用构图建议
                    suggestions.push('尝试不同角度和视角，打破常规');
                    suggestions.push('注意画面中的线条引导视线');
                    suggestions.push('寻找框架元素增加画面层次');
                    suggestions.push('给主体留出"呼吸空间"，避免过于拥挤');

                    return { 
                        score: Math.max(1, Math.min(10, score)), 
                        issues, 
                        suggestions,
                        details: {
                            focalLength,
                            aspectRatio,
                            tips: ['三分法', '引导线', '框架构图', '对称平衡']
                        }
                    };
                }
            }
        };
    }

    // 计算景深（简化公式）
    calculateDOF(aperture, focalLength, focusDistance) {
        const circleOfConfusion = 0.03; // mm
        const hyperfocal = (focalLength * focalLength) / (aperture * circleOfConfusion) + focalLength;
        
        if (focusDistance <= 0) {
            return { near: 0, far: Infinity, total: '无限' };
        }
        
        const near = (hyperfocal * focusDistance) / (hyperfocal + focusDistance - focalLength);
        const far = (hyperfocal * focusDistance) / (hyperfocal - focusDistance + focalLength);
        
        return {
            near: near.toFixed(2),
            far: far > 10000 ? '无限' : far.toFixed(2),
            total: far > 10000 ? '无限' : (far - near).toFixed(2) + 'm'
        };
    }

    // 计算超焦距
    calculateHyperfocal(focalLength, aperture) {
        const circleOfConfusion = 0.03;
        return ((focalLength * focalLength) / (aperture * circleOfConfusion) / 1000).toFixed(2) + 'm';
    }

    // 评估曝光三角平衡
    evaluateExposureTriangle(iso, aperture, shutter) {
        const ev = Math.log2((aperture * aperture) / shutter) - Math.log2(iso / 100);
        if (ev < -5) return '极暗环境，需要补光或长时间曝光';
        if (ev < -2) return '较暗环境，注意防抖';
        if (ev > 5) return '极亮环境，可能需要ND滤镜';
        if (ev > 2) return '较亮环境，注意高光';
        return '曝光条件适中';
    }

    // 获取画幅比例
    getAspectRatio(exif) {
        const width = exif.PixelXDimension || exif.ImageWidth;
        const height = exif.PixelYDimension || exif.ImageHeight;
        if (!width || !height) return '3:2';
        
        const ratio = width / height;
        if (Math.abs(ratio - 1) < 0.1) return '1:1';
        if (Math.abs(ratio - 1.5) < 0.1) return '3:2';
        if (Math.abs(ratio - 1.33) < 0.1) return '4:3';
        if (Math.abs(ratio - 1.78) < 0.1) return '16:9';
        return '其他';
    }

    // 获取焦段分类
    getFocalLengthCategory(fl) {
        if (fl < 24) return '超广角';
        if (fl < 35) return '广角';
        if (fl < 50) return '准广角';
        if (fl < 70) return '标准';
        if (fl <= 135) return '人像/中焦';
        if (fl <= 300) return '长焦';
        return '超长焦';
    }

    // 解析快门速度
    parseShutterSpeed(value) {
        if (!value) return 1/125;
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            if (value.includes('/')) {
                const [num, den] = value.split('/').map(Number);
                return num / den;
            }
            return parseFloat(value);
        }
        return 1/125;
    }

    // 初始化拍摄方案库
    initShootingPlans() {
        return {
            portrait: {
                title: '人像写真拍摄方案',
                icon: 'fa-user',
                difficulty: '中级',
                scenarios: ['户外人像', '室内人像', '环境人像', '特写肖像'],
                equipment: {
                    camera: '全画幅/APS-C相机',
                    lens: '85mm f/1.8 或 50mm f/1.8（入门）；85mm f/1.4 或 135mm f/2（进阶）',
                    accessories: ['反光板（金银双面）', 'LED补光灯', '柔光罩', '引闪器+离机闪光灯']
                },
                settings: {
                    mode: '光圈优先 (A/Av) 或 手动 (M)',
                    aperture: 'f/1.4 - f/2.8（特写）；f/2.8 - f/4（半身）；f/4 - f/5.6（全身）',
                    iso: '100-400（户外）；400-1600（室内）',
                    shutter: '不低于 1/125s（静态）；1/250s 以上（动态）',
                    focus: '单点AF，精确对焦眼睛',
                    metering: '评价测光/矩阵测光',
                    wb: '自动或根据环境手动设置'
                },
                lighting: [
                    { 
                        type: '黄金时刻（日出后/日落前1小时）', 
                        description: '最柔美的自然光，色温温暖，阴影柔和。侧光或逆光拍摄创造轮廓光。',
                        tips: ['使用反光板给阴影补光', '尝试逆光拍摄创造光晕效果', '注意曝光补偿+0.3~+0.7EV']
                    },
                    { 
                        type: '阴天/阴影', 
                        description: '天然柔光箱，光线均匀柔和，适合清新风格人像。',
                        tips: ['ISO可适当提高至400-800', '注意背景选择，避免过于杂乱', '适合拍摄明亮清新的色调']
                    },
                    { 
                        type: '室内自然光', 
                        description: '靠近窗户的柔和侧光，营造温馨氛围。',
                        tips: ['让人物面向窗户', '使用白色窗帘柔化光线', '避免顶光造成面部阴影']
                    },
                    { 
                        type: '夜景/暗光', 
                        description: '城市灯光或弱光环境，需要补光设备。',
                        tips: ['使用大光圈镜头', 'ISO可提升至1600-6400', '使用LED灯或闪光灯补光', '注意色温平衡']
                    }
                ],
                poses: [
                    { name: '侧身45度', desc: '身体侧向镜头45度，重心在后腿，显瘦且优雅' },
                    { name: '回眸', desc: '身体背对镜头，头部回转看向镜头，自然生动' },
                    { name: '手托腮', desc: '手轻托脸颊，修饰脸型，注意力度要轻' },
                    { name: '撩发', desc: '手轻抚头发，增加动态感，注意手指姿态' },
                    { name: '倚靠', desc: '倚靠墙壁或栏杆，放松自然，创造线条' },
                    { name: '坐姿延伸', desc: '坐姿时腿部向镜头方向延伸，显腿长' }
                ],
                composition: [
                    '使用三分法，眼睛放在上三分线',
                    '特写时头顶适当留白',
                    '注意背景简洁，避免杂乱元素',
                    '利用前景虚化增加层次感',
                    '尝试不同拍摄高度：平视、俯视、仰视'
                ],
                tips: [
                    '与模特充分沟通，建立信任关系',
                    '多夸奖鼓励，让模特放松自然',
                    '使用连拍模式捕捉自然表情',
                    '注意眼神光，确保眼睛有神',
                    '拍摄前检查服装、发型、妆容',
                    '准备道具增加画面丰富度（花、书、咖啡杯等）'
                ],
                commonMistakes: [
                    '对焦不在眼睛上',
                    '头顶留白过多或过少',
                    '背景杂乱分散注意力',
                    '手部姿态僵硬不自然',
                    '曝光过度导致肤色过白'
                ]
            },

            landscape: {
                title: '风光摄影拍摄方案',
                icon: 'fa-mountain',
                difficulty: '中级到高级',
                scenarios: ['日出日落', '城市夜景', '自然风光', '星空银河'],
                equipment: {
                    camera: '全画幅相机（高感好、动态范围大）',
                    lens: '16-35mm f/2.8 或 14-24mm f/2.8（广角）；24-70mm（标准变焦）',
                    accessories: [
                        '稳固三脚架（承重5kg以上）',
                        'ND减光镜（ND8、ND64、ND1000）',
                        'GND渐变镜（软渐变、硬渐变、反向渐变）',
                        'CPL偏振镜（消除反光、增强色彩）',
                        '快门线/定时器',
                        '头灯（红光模式保护夜视）'
                    ]
                },
                settings: {
                    mode: '手动模式 (M) - 精确控制曝光',
                    aperture: 'f/8 - f/11（最佳画质）；f/16（需要更大景深时）',
                    iso: '100-400（白天）；3200-6400（星空）',
                    shutter: '1/15s - 30s（一般场景）；B门（长曝光）',
                    focus: '手动对焦，对焦无穷远或超焦距',
                    metering: '评价测光，配合直方图调整',
                    wb: '自动或手动设置（RAW格式可后期调整）'
                },
                timing: [
                    { 
                        time: '黄金时刻', 
                        desc: '日出后/日落前1小时，暖色调光线，最柔美的拍摄时机',
                        settings: 'ISO 100, f/8-f/11, 根据光线调整快门'
                    },
                    { 
                        time: '蓝调时刻', 
                        desc: '日落后20-40分钟，天空呈现深蓝色，冷暖对比强烈',
                        settings: 'ISO 400-800, f/8, 2-10秒曝光'
                    },
                    { 
                        time: '夜间', 
                        desc: '星空、银河、光轨拍摄时机',
                        settings: 'ISO 3200-6400, 最大光圈, 15-25秒曝光（500法则）'
                    }
                ],
                composition: [
                    '寻找有趣的前景增加层次感',
                    '使用引导线引导观众视线',
                    '三分法构图，地平线放在下或上三分线',
                    '注意地平线水平',
                    '利用对称构图拍摄倒影',
                    '尝试不同视角：低角度、高角度'
                ],
                techniques: [
                    {
                        name: '包围曝光',
                        desc: '拍摄3-5张不同曝光的照片，后期合成HDR',
                        when: '大光比场景，如日出日落'
                    },
                    {
                        name: '长曝光',
                        desc: '使用ND滤镜实现几秒到几分钟曝光',
                        when: '拍摄流水、云彩、光轨'
                    },
                    {
                        name: '焦点堆栈',
                        desc: '多张不同焦点位置的照片后期合成',
                        when: '需要全景深时'
                    },
                    {
                        name: '全景接片',
                        desc: '多张拼接获得超广角视野',
                        when: '单张无法容纳的场景'
                    }
                ],
                tips: [
                    '提前踩点，规划机位和构图',
                    '使用APP查询日出日落时间和方位',
                    '关注天气预报，云层增加画面层次',
                    '耐心等待最佳光线',
                    '使用实时取景精确对焦',
                    '拍摄多张确保至少一张完美'
                ],
                postProcessing: [
                    'RAW格式保留更多调整空间',
                    '天空和地面分开调整',
                    '适当提升清晰度和去朦胧',
                    '色彩分离：高光暖、阴影冷',
                    '注意避免过度处理'
                ]
            },

            hanfu: {
                title: '汉服古风拍摄方案',
                icon: 'fa-fan',
                difficulty: '中级',
                scenarios: ['园林古风', '古建筑', '自然花海', '室内古风'],
                equipment: {
                    camera: '任意相机',
                    lens: '85mm f/1.8（特写）；35mm f/1.4（环境人像）',
                    accessories: ['反光板', '道具（扇子、油纸伞、书卷、灯笼）', '补光灯（夜景）']
                },
                preparation: [
                    '确认汉服形制（唐/宋/明/魏晋），不同朝代风格不同',
                    '准备配套发型和发饰，建议请专业妆造',
                    '收集合适的道具，增加画面丰富度',
                    '了解基本礼仪动作，如万福、作揖',
                    '提前踩点，确认拍摄地点允许拍摄'
                ],
                settings: {
                    mode: '光圈优先',
                    aperture: 'f/1.8 - f/2.8（虚化背景）；f/4 - f/5.6（保留环境）',
                    iso: '100-800',
                    shutter: '1/125s 以上',
                    focus: '单点对焦，精确对焦眼睛',
                    wb: '自动或阴天模式（约6000K）'
                },
                poses: [
                    { name: '持扇半遮面', desc: '团扇半遮面容，含蓄优雅，适合特写' },
                    { name: '倚栏远眺', desc: '倚靠栏杆，目光远望，思绪万千' },
                    { name: '提裙漫步', desc: '轻提裙摆缓步行走，衣袂飘飘' },
                    { name: '抚琴静坐', desc: '古琴前静坐，文人气质，注意手型' },
                    { name: '万福行礼', desc: '传统礼仪动作，端庄大方' },
                    { name: '回眸一笑', desc: '侧身回眸，自然生动' }
                ],
                locations: [
                    { 
                        place: '古典园林', 
                        elements: '亭台楼阁、假山流水、花窗月洞门',
                        bestTime: '早晨或傍晚，光线柔和'
                    },
                    { 
                        place: '古建筑', 
                        elements: '寺庙、宫殿、古镇街道、红墙',
                        bestTime: '避开游客高峰'
                    },
                    { 
                        place: '自然风光', 
                        elements: '竹林、花海、雪景、枫叶',
                        bestTime: '季节限定，提前规划'
                    }
                ],
                postProcessing: [
                    '色调：淡雅清新（低饱和高明度）或浓墨重彩',
                    '可适当添加柔光效果',
                    '注意肤色自然，避免过度磨皮',
                    '可添加古风纹理或边框',
                    '字体选择书法体增加古风感'
                ],
                tips: [
                    '了解汉服文化背景，尊重传统',
                    '注意发型和配饰搭配，细节决定成败',
                    '动作要优雅缓慢，避免现代感',
                    '与模特沟通拍摄主题和情绪',
                    '多拍花絮，记录自然瞬间'
                ]
            },

            astro: {
                title: '星空摄影拍摄方案',
                icon: 'fa-star',
                difficulty: '高级',
                scenarios: ['银河拍摄', '星轨', '光绘', '极光'],
                equipment: {
                    camera: '高感好的全画幅（如Sony A7S系列、Canon R6）',
                    lens: '广角大光圈（14-24mm f/2.8 或 14mm f/1.8）',
                    accessories: [
                        '稳固三脚架（防风）',
                        '头灯（红光模式保护夜视）',
                        '快门线/定时器',
                        '备用电池（低温耗电快）',
                        '除雾带（防止镜头结露）'
                    ]
                },
                preparation: [
                    '查询月相，避开满月前后（月光干扰）',
                    '使用Star Walk、Planit等APP找银河位置',
                    '提前到达拍摄地点，适应黑暗环境',
                    '检查天气和光污染地图',
                    '告知他人行程，注意安全'
                ],
                settings: {
                    mode: '手动模式 (M)',
                    aperture: '最大光圈',
                    iso: '3200-6400（根据相机高感性能调整）',
                    shutter: '15-25秒（使用500法则计算）',
                    focus: '手动对焦无穷远，或对焦亮星',
                    wb: '手动4000K左右，或自动（RAW调整）',
                    format: '必须RAW格式'
                },
                techniques: [
                    {
                        name: '500法则',
                        desc: '最长曝光时间 = 500 / 焦距（全画幅）',
                        example: '20mm镜头：500/20 = 25秒'
                    },
                    {
                        name: '前景补光',
                        desc: '用LED灯或头灯短时间照亮前景',
                        tip: '曝光中途补光，避免过曝'
                    },
                    {
                        name: '堆栈降噪',
                        desc: '拍摄多张同参数照片，后期堆栈',
                        benefit: '显著降低噪点，提升画质'
                    },
                    {
                        name: '星轨拍摄',
                        desc: '单张30分钟-数小时，或多张叠加',
                        note: '找北极星可获得同心圆效果'
                    }
                ],
                tips: [
                    '使用 500/焦距 计算最长曝光时间',
                    '前景可使用补光或单独拍摄合成',
                    '拍摄多张照片后期堆栈降噪',
                    '注意保暖和安全，携带应急物品',
                    '拍摄地景时降低ISO延长曝光',
                    '检查直方图，确保星空不过曝'
                ],
                postProcessing: [
                    'RAW格式后期降噪',
                    '提升银河细节和色彩',
                    '地景和天空分开调整',
                    '适当提升对比度和饱和度',
                    '注意避免过度处理，保持自然'
                ]
            },

            street: {
                title: '街头摄影拍摄方案',
                icon: 'fa-walking',
                difficulty: '入门到中级',
                scenarios: ['城市纪实', '光影捕捉', '人文故事', '决定性瞬间'],
                equipment: {
                    camera: '便携相机或微单',
                    lens: '35mm f/1.4 或 35mm f/2（经典街拍焦段）；50mm（标准视角）',
                    accessories: ['备用电池', '腕带（快速反应）', '存储卡']
                },
                settings: {
                    mode: '光圈优先 (A/Av) 或 程序自动 (P)',
                    aperture: 'f/5.6 - f/8（保证景深）',
                    iso: '自动（上限3200-6400）',
                    shutter: '不低于 1/250s（冻结动作）',
                    focus: '区域对焦或陷阱对焦',
                    metering: '评价测光',
                    format: 'RAW+JPEG'
                },
                approach: [
                    {
                        method: '预判',
                        desc: '观察环境，预测可能发生有趣画面的位置，提前构图等待'
                    },
                    {
                        method: '盲拍',
                        desc: '不举相机到眼前，从腰部或胸前拍摄，减少侵入感'
                    },
                    {
                        method: '连拍',
                        desc: '开启高速连拍，捕捉决定性瞬间'
                    },
                    {
                        method: '融入',
                        desc: '成为环境的一部分，等待被摄者习惯你的存在'
                    }
                ],
                themes: [
                    {
                        theme: '光影',
                        desc: '利用光线创造戏剧性画面',
                        tips: ['寻找明暗对比强烈的场景', '注意投影的形状', '黄金时刻的斜射光']
                    },
                    {
                        theme: '对比',
                        desc: '新旧、贫富、快慢的对比',
                        tips: ['观察街头有趣并置', '等待决定性瞬间']
                    },
                    {
                        theme: '巧合',
                        desc: '有趣的视觉巧合',
                        tips: ['多观察少按快门', '培养摄影眼']
                    },
                    {
                        theme: '情绪',
                        desc: '人物表情和状态',
                        tips: ['等待自然表情', '注意眼神']
                    }
                ],
                ethics: [
                    '尊重被摄者，避免拍摄尴尬场景',
                    '不干扰正常秩序',
                    '了解当地法律，某些地区需注意',
                    '保持低调，避免冲突',
                    '如果被要求删除照片，尊重对方意愿'
                ],
                tips: [
                    '随身携带相机，不错过瞬间',
                    '多观察少按快门，培养摄影眼',
                    '寻找光影对比',
                    '关注有趣并置',
                    '保持耐心，好照片需要等待',
                    '熟悉相机操作，快速反应'
                ]
            },

            wedding: {
                title: '婚礼摄影拍摄方案',
                icon: 'fa-heart',
                difficulty: '高级',
                scenarios: ['婚礼全程记录', '订婚仪式', '婚纱照', '婚礼派对'],
                equipment: {
                    camera: '双机（主力+备用），避免换镜头错过瞬间',
                    lens: '24-70mm f/2.8（挂机）+ 70-200mm f/2.8（特写）',
                    accessories: [
                        '闪光灯（跳闪补光）',
                        '备用电池x3',
                        '双卡存储（数据安全）',
                        '镜头布',
                        '快拆肩带'
                    ]
                },
                checklist: [
                    '化妆细节：戒指、婚纱、鞋子、手捧花',
                    '新娘化妆过程',
                    '新郎准备过程',
                    '接亲游戏环节',
                    '敬茶仪式',
                    '外景合影',
                    '仪式过程：入场、交换戒指、亲吻',
                    '宴会敬酒',
                    '互动环节',
                    '宾客合影'
                ],
                settings: {
                    mode: '光圈优先/手动',
                    aperture: 'f/2.8 - f/5.6',
                    iso: '400-3200（根据光线调整）',
                    shutter: '1/125s 以上',
                    focus: '连续自动对焦（AF-C）',
                    format: 'RAW+JPEG（快速出片）',
                    metering: '评价测光'
                },
                keyMoments: [
                    { moment: '新娘入场', tip: '提前站位，低角度拍摄' },
                    { moment: '交换戒指', tip: '特写镜头，对焦戒指' },
                    { moment: '亲吻', tip: '抓拍瞬间，注意角度' },
                    { moment: '父母表情', tip: '不要只拍新人，父母情感珍贵' },
                    { moment: '宾客反应', tip: '捕捉真情流露的瞬间' }
                ],
                tips: [
                    '提前与新人沟通需求和禁忌',
                    '准备 shot list，确保重要镜头不遗漏',
                    '注意双方父母镜头',
                    '备份所有照片（双卡、双硬盘）',
                    '快速反应抓瞬间',
                    '保持低调不干扰仪式',
                    '多拍选优，婚礼不可重来'
                ],
                business: {
                    contract: '签订详细合同，明确交付内容和时间',
                    backup: '双卡双机，现场备份',
                    delivery: '明确交付时间：预告片24小时，精修1-2周',
                    pricing: '根据经验和服务内容定价'
                }
            },

            macro: {
                title: '微距摄影拍摄方案',
                icon: 'fa-bug',
                difficulty: '高级',
                scenarios: ['昆虫', '花卉', '水滴', '纹理细节'],
                equipment: {
                    camera: '任意',
                    lens: '微距镜头（90mm、100mm、105mm）或近摄接圈',
                    accessories: [
                        '稳固三脚架',
                        '环形闪光灯或双头闪光灯',
                        '反光板（小型）',
                        '喷水壶（制造水滴）',
                        '防风罩（户外）'
                    ]
                },
                settings: {
                    mode: '手动 (M)',
                    aperture: 'f/8 - f/16（景深极浅，需要小光圈）',
                    iso: '100-800',
                    shutter: '1/125s - 1/250s（配合闪光灯）',
                    focus: '手动对焦',
                    format: 'RAW'
                },
                techniques: [
                    '使用实时取景放大对焦',
                    '焦点堆栈增加景深',
                    '注意背景简洁',
                    '寻找有趣的角度',
                    '耐心等待昆虫静止'
                ],
                tips: [
                    '清晨昆虫活动较慢，易于拍摄',
                    '注意景深极浅，对焦要精确',
                    '使用闪光灯补光，注意光线柔和',
                    '保持耐心，微距需要等待',
                    '注意防风，轻微晃动都会模糊'
                ]
            },

            product: {
                title: '产品静物拍摄方案',
                icon: 'fa-box',
                difficulty: '中级',
                scenarios: ['电商产品', '美食摄影', '静物艺术', '白底图'],
                equipment: {
                    camera: '任意，高像素更佳',
                    lens: '50mm微距、90mm微距或标准变焦',
                    accessories: [
                        '稳固三脚架',
                        '柔光箱或柔光伞',
                        'LED持续灯或闪光灯',
                        '反光板（银/白/黑）',
                        '硫酸纸/柔光布',
                        '背景纸（白/黑/灰/彩色）',
                        '静物台'
                    ]
                },
                settings: {
                    mode: '手动 (M)',
                    aperture: 'f/8 - f/11（保证产品整体清晰）',
                    iso: '100-400',
                    shutter: '1/125s 或更慢（配合三脚架）',
                    focus: '单点自动对焦或手动对焦',
                    wb: '手动设置或灰卡校准',
                    format: 'RAW'
                },
                lighting: [
                    {
                        type: '柔光箱主光',
                        desc: '大面积柔光，减少反光，适合大多数产品',
                        position: '45度侧上方'
                    },
                    {
                        type: '逆光/轮廓光',
                        desc: '突出产品轮廓，增加立体感',
                        position: '产品后方'
                    },
                    {
                        type: '顶光',
                        desc: '均匀照亮顶部，适合扁平产品',
                        position: '正上方'
                    }
                ],
                composition: [
                    '使用三分法或中心构图',
                    '注意产品摆放角度，展示最佳面',
                    '留白适当，方便后期裁剪',
                    '注意倒影控制（使用黑色卡纸）'
                ],
                tips: [
                    '白底图注意纯白背景（RGB 255,255,255）',
                    '金属反光产品注意控制环境反射',
                    '透明产品使用逆光或黑底',
                    '食品摄影注意新鲜度和造型',
                    '拍摄多角度，方便客户选择'
                ],
                postProcessing: [
                    '校正白平衡和曝光',
                    '产品抠图（白底图）',
                    '去除瑕疵和灰尘',
                    '锐化产品细节',
                    '统一色调和风格'
                ]
            },

            sports: {
                title: '运动摄影拍摄方案',
                icon: 'fa-running',
                difficulty: '高级',
                scenarios: ['田径比赛', '球类运动', '极限运动', '水上运动'],
                equipment: {
                    camera: '高速连拍机型（10fps以上）',
                    lens: '70-200mm f/2.8（通用）；400mm f/2.8（大型场地）',
                    accessories: [
                        '独脚架（长焦支撑）',
                        '备用电池x2',
                        '高速存储卡（V90）',
                        '防雨罩（户外）',
                        '镜头清洁布'
                    ]
                },
                settings: {
                    mode: '快门优先 (S/Tv) 或 手动 (M)',
                    aperture: 'f/2.8 - f/4（虚化背景）',
                    iso: '自动（上限6400-12800）',
                    shutter: '1/1000s 以上（冻结动作）',
                    focus: '连续自动对焦（AF-C/AI Servo）',
                    drive: '高速连拍',
                    metering: '评价测光'
                },
                techniques: [
                    {
                        name: '预判位置',
                        desc: '提前判断运动员运动轨迹，在关键位置等待'
                    },
                    {
                        name: '追焦拍摄',
                        desc: '跟随运动主体移动相机，背景产生动感模糊',
                        settings: '1/60s - 1/250s'
                    },
                    {
                        name: '关键瞬间',
                        desc: '捕捉冲刺、跳跃、进球等决定性瞬间'
                    }
                ],
                positions: [
                    '提前了解比赛规则和精彩瞬间',
                    '选择有利位置，避开遮挡',
                    '注意背景简洁',
                    '预留安全距离'
                ],
                tips: [
                    '熟悉项目规律，预判动作',
                    '保持相机随时待命',
                    '注意光线变化，及时调整曝光',
                    '捕捉运动员表情',
                    '不要只拍动作，也要拍氛围'
                ]
            },

            wildlife: {
                title: '野生动物拍摄方案',
                icon: 'fa-paw',
                difficulty: '高级',
                scenarios: ['鸟类摄影', '哺乳动物', '昆虫生态', '水下生物'],
                equipment: {
                    camera: '高速对焦机型',
                    lens: '100-400mm、150-600mm 或 600mm定焦',
                    accessories: [
                        '稳固三脚架或独脚架',
                        '云台（液压或悬臂）',
                        '迷彩伪装',
                        '防雨罩',
                        '备用电池（低温耗电快）'
                    ]
                },
                settings: {
                    mode: '快门优先 (S/Tv)',
                    aperture: 'f/5.6 - f/8（保证景深）',
                    iso: '自动（上限6400-12800）',
                    shutter: '1/1000s 以上（鸟类）',
                    focus: '连续自动对焦 + 动物眼部对焦',
                    drive: '高速连拍'
                },
                fieldcraft: [
                    '了解动物习性，预判行为',
                    '保持安全距离，不干扰动物',
                    '使用掩体或伪装接近',
                    '清晨和黄昏是最佳时机',
                    '保持耐心，等待最佳瞬间'
                ],
                ethics: [
                    '动物福利优先，不干扰自然行为',
                    '不使用诱饵（除非合法且无害）',
                    '不破坏栖息地',
                    '遵守保护区规定'
                ],
                tips: [
                    '对焦眼睛，确保眼神清晰',
                    '注意背景虚化，突出主体',
                    '捕捉互动行为更有故事性',
                    '准备长时间等待',
                    '携带足够的水和食物'
                ]
            }
        };
    }

    // 分析 EXIF 数据
    analyzeExif(exifData) {
        const results = {
            overall: { score: 0, maxScore: 0 },
            categories: {},
            allIssues: [],
            allSuggestions: [],
            technicalDetails: {}
        };

        // 运行所有规则
        Object.entries(this.analysisRules).forEach(([key, rule]) => {
            try {
                const result = rule.evaluate(exifData);
                results.categories[key] = {
                    name: rule.name,
                    icon: rule.icon,
                    score: result?.score || 5,
                    issues: result?.issues || [],
                    suggestions: result?.suggestions || [],
                    details: result?.details || {}
                };
                results.overall.score += result?.score || 5;
                results.overall.maxScore += 10;
                
                if (result?.issues && Array.isArray(result.issues)) {
                    results.allIssues.push(...result.issues);
                }
                if (result?.suggestions && Array.isArray(result.suggestions)) {
                    results.allSuggestions.push(...result.suggestions);
                }
                if (result?.details) {
                    results.technicalDetails[key] = result.details;
                }
            } catch (error) {
                console.warn(`规则 ${key} 执行失败:`, error);
                results.categories[key] = {
                    name: rule.name,
                    icon: rule.icon,
                    score: 5,
                    issues: [],
                    suggestions: ['该维度分析出现问题'],
                    details: {}
                };
                results.overall.score += 5;
                results.overall.maxScore += 10;
            }
        });

        // 计算总分
        results.overall.percentage = Math.round(
            (results.overall.score / results.overall.maxScore) * 100
        );

        // 去重
        results.allIssues = [...new Set(results.allIssues)];
        results.allSuggestions = [...new Set(results.allSuggestions)];

        return results;
    }

    // 检测拍摄类型
    detectShootingType(exifData) {
        const focalLength = parseFloat(exifData.FocalLength) || 50;
        const aperture = parseFloat(exifData.FNumber) || 5.6;
        const lensModel = exifData.LensModel || '';
        const types = [];

        // 人像判断
        if (focalLength >= 50 && focalLength <= 135 && aperture <= 2.8) {
            types.push({ type: 'portrait', confidence: 0.85, name: '人像摄影', icon: 'fa-user' });
        } else if (focalLength >= 50 && focalLength <= 135) {
            types.push({ type: 'portrait', confidence: 0.7, name: '人像摄影', icon: 'fa-user' });
        }

        // 风光判断
        if (focalLength < 35 && aperture >= 8) {
            types.push({ type: 'landscape', confidence: 0.8, name: '风光摄影', icon: 'fa-mountain' });
        } else if (focalLength < 35) {
            types.push({ type: 'landscape', confidence: 0.6, name: '风光摄影', icon: 'fa-mountain' });
        }

        // 街拍判断
        if (focalLength >= 28 && focalLength <= 50 && aperture >= 4) {
            types.push({ type: 'street', confidence: 0.7, name: '街头摄影', icon: 'fa-walking' });
        }

        // 长焦判断
        if (focalLength > 200) {
            types.push({ type: 'wildlife', confidence: 0.75, name: '野生动物/体育', icon: 'fa-paw' });
        }

        // 微距判断
        if (lensModel.toLowerCase().includes('macro') || 
            (focalLength > 80 && focalLength < 150 && exifData.FocusDistance < 1)) {
            types.push({ type: 'macro', confidence: 0.9, name: '微距摄影', icon: 'fa-bug' });
        }

        // 婚礼/活动判断（基于连拍模式和闪光灯）
        if (exifData.Flash && exifData.Flash !== 0 && exifData.FocalLength >= 24 && exifData.FocalLength <= 70) {
            types.push({ type: 'wedding', confidence: 0.5, name: '婚礼/活动', icon: 'fa-heart' });
        }

        // 按置信度排序
        types.sort((a, b) => b.confidence - a.confidence);

        return types.length > 0 ? types : [{ type: 'general', confidence: 1, name: '通用摄影', icon: 'fa-camera' }];
    }

    // 生成拍摄方案
    generateShootingPlan(type, preferences = {}) {
        const plan = this.shootingPlans[type];
        if (!plan) {
            return {
                title: '通用拍摄方案',
                content: '根据您的EXIF数据，建议使用光圈优先模式，注意构图和光线。',
                icon: 'fa-camera',
                difficulty: '入门'
            };
        }

        return {
            ...plan,
            generatedAt: new Date().toISOString(),
            customizations: preferences
        };
    }

    // 生成改进建议
    generateImprovements(analysisResult, shootingTypes) {
        const improvements = [];
        
        // 基于分析结果的建议
        if (analysisResult.allSuggestions && analysisResult.allSuggestions.length > 0) {
            improvements.push(...analysisResult.allSuggestions.slice(0, 5));
        }

        // 基于拍摄类型的建议
        shootingTypes.forEach(({ type }) => {
            const typeTips = this.getTypeSpecificTips(type);
            improvements.push(...typeTips.slice(0, 3));
        });

        // 去重并限制数量
        return [...new Set(improvements)].slice(0, 8);
    }

    // 获取特定类型的技巧
    getTypeSpecificTips(type) {
        const tips = {
            portrait: [
                '人像拍摄眼神光至关重要，确保眼睛明亮有神',
                '85mm焦段配合大光圈可获得专业级虚化',
                '与模特保持沟通，引导自然表情',
                '注意手部姿态，避免僵硬',
                '尝试不同角度，平视、俯视、仰视效果不同'
            ],
            landscape: [
                '风光摄影 patience 是关键，等待最佳光线',
                '使用三脚架确保画面清晰',
                '前景运用增加画面层次',
                '包围曝光应对大光比',
                '黄金时刻和蓝调时刻是最佳拍摄时机'
            ],
            street: [
                '预判场景提前构图',
                '学会盲拍技巧减少侵入感',
                '保持低调不打扰',
                '多拍选优，街头摄影需要大量拍摄',
                '关注光影和有趣并置'
            ],
            wildlife: [
                '使用高速快门冻结动作',
                '连续自动对焦跟踪移动主体',
                '提前了解动物习性',
                '保持安全距离，不干扰动物',
                '耐心等待决定性瞬间'
            ],
            macro: [
                '微距景深极浅，对焦要精确',
                '使用实时取景放大对焦',
                '考虑焦点堆栈增加景深',
                '注意光线柔和，避免硬阴影',
                '防风防抖，轻微晃动都会模糊'
            ],
            astro: [
                '使用500法则计算最长曝光时间',
                '高ISO配合大光圈',
                '手动对焦无穷远或亮星',
                '前景可使用补光',
                '多张堆栈降噪'
            ],
            wedding: [
                '提前了解流程，不错过关键瞬间',
                '双机双卡确保数据安全',
                '注意双方父母和宾客',
                '快速反应抓瞬间',
                '备份所有照片'
            ]
        };

        return tips[type] || ['继续练习，多拍多思考', '学习摄影理论知识', '分析优秀作品'];
    }

    // 完整分析流程
    fullAnalysis(exifData, preferences = {}) {
        try {
            // 确保 exifData 有效
            if (!exifData || typeof exifData !== 'object') {
                console.warn('EXIF数据无效，使用默认值');
                exifData = {};
            }
            
            // 1. EXIF 数据分析
            const exifAnalysis = this.analyzeExif(exifData);
            
            // 2. 检测拍摄类型
            const shootingTypes = this.detectShootingType(exifData);
            const primaryType = shootingTypes[0] || { type: 'general', name: '通用摄影', confidence: 1, icon: 'fa-camera' };
            
            // 3. 生成拍摄方案
            const shootingPlan = this.generateShootingPlan(primaryType.type, preferences);
            
            // 4. 生成改进建议
            const improvements = this.generateImprovements(exifAnalysis, shootingTypes);

            return {
                timestamp: new Date().toISOString(),
                exifAnalysis,
                shootingTypes,
                primaryType,
                shootingPlan,
                improvements,
                summary: this.generateSummary(exifAnalysis, primaryType)
            };
        } catch (error) {
            console.error('fullAnalysis 执行失败:', error);
            // 返回默认结果
            return {
                timestamp: new Date().toISOString(),
                exifAnalysis: {
                    overall: { score: 50, maxScore: 100, percentage: 50 },
                    categories: {},
                    allIssues: [],
                    allSuggestions: ['分析过程出现问题，请检查控制台日志'],
                    technicalDetails: {}
                },
                shootingTypes: [{ type: 'general', name: '通用摄影', confidence: 1, icon: 'fa-camera' }],
                primaryType: { type: 'general', name: '通用摄影', confidence: 1, icon: 'fa-camera' },
                shootingPlan: { title: '通用拍摄方案', icon: 'fa-camera', difficulty: '入门' },
                improvements: ['继续练习摄影基础', '多拍多思考'],
                summary: {
                    score: 50,
                    level: '良好',
                    message: '分析完成（使用默认设置）',
                    detectedType: '通用摄影',
                    confidence: 100
                }
            };
        }
    }

    // 生成分析摘要
    generateSummary(analysis, primaryType) {
        // 确保参数有效
        const safeAnalysis = analysis || { overall: { percentage: 50 } };
        const safePrimaryType = primaryType || { name: '通用摄影', confidence: 1 };
        
        const score = safeAnalysis.overall?.percentage || 50;
        let level, message;

        if (score >= 90) {
            level = '优秀';
            message = '技术执行到位，参数设置合理，具有专业水准！';
        } else if (score >= 75) {
            level = '良好';
            message = '整体表现不错，注意细节可以更上一层楼。';
        } else if (score >= 60) {
            level = '及格';
            message = '基本达到要求，有提升空间，建议针对性练习。';
        } else {
            level = '需改进';
            message = '建议复习基础技术，从曝光三角开始系统学习。';
        }

        return {
            score,
            level,
            message,
            detectedType: safePrimaryType.name || '通用摄影',
            confidence: Math.round((safePrimaryType.confidence || 1) * 100)
        };
    }
}

// AI 分析接口 - 支持云端和本地大模型
class AIAnalyzer {
    constructor(config = {}) {
        this.config = {
            // 提供商: 'openai' | 'ollama' | 'lmstudio' | 'custom'
            provider: config.provider || 'openai',
            // API 密钥（云端服务需要）
            apiKey: config.apiKey || null,
            // 模型名称
            model: config.model || 'gpt-4-vision-preview',
            // 是否启用
            enabled: config.enabled || false,
            // 本地服务配置
            local: {
                // Ollama 默认地址
                baseUrl: config.local?.baseUrl || 'http://localhost:11434',
                // LM Studio 默认地址
                lmStudioUrl: config.local?.lmStudioUrl || 'http://localhost:1234',
                // 自定义 API 地址
                customUrl: config.local?.customUrl || 'http://localhost:8000'
            },
            // 请求参数
            options: {
                temperature: config.options?.temperature ?? 0.7,
                maxTokens: config.options?.maxTokens || 2048,
                timeout: config.options?.timeout || 60000
            }
        };
    }

    // 检查 AI 是否可用
    isAvailable() {
        if (!this.config.enabled) return false;
        
        // 云端服务需要 API Key
        if (this.config.provider === 'openai') {
            return !!this.config.apiKey;
        }
        
        // 本地服务只需要启用即可（会在请求时检查连通性）
        return true;
    }

    // 获取当前使用的 API 地址
    getBaseUrl() {
        switch (this.config.provider) {
            case 'ollama':
                return this.config.local.baseUrl;
            case 'lmstudio':
                return this.config.local.lmStudioUrl;
            case 'custom':
                return this.config.local.customUrl;
            case 'openai':
            default:
                return 'https://api.openai.com';
        }
    }

    // 分析图片
    async analyzeImage(imageData, exifData) {
        if (!this.isAvailable()) {
            throw new Error('AI 分析未启用或配置不完整');
        }

        const prompt = this.buildPrompt(exifData);
        
        try {
            // 根据提供商调用不同的 API
            switch (this.config.provider) {
                case 'ollama':
                    return await this.callOllama(prompt, imageData);
                case 'lmstudio':
                    return await this.callLMStudio(prompt, imageData);
                case 'custom':
                    return await this.callCustomAPI(prompt, imageData);
                case 'openai':
                default:
                    return await this.callOpenAI(prompt, imageData);
            }
        } catch (error) {
            console.error('AI 分析失败:', error);
            throw new Error(`AI 分析失败: ${error.message}`);
        }
    }

    // 调用 Ollama 本地 API
    async callOllama(prompt, imageData) {
        const baseUrl = this.config.local.baseUrl;
        
        // 构建请求体
        const requestBody = {
            model: this.config.model || 'llava',  // 默认使用 llava 多模态模型
            prompt: prompt,
            stream: false,
            options: {
                temperature: this.config.options.temperature,
                num_predict: this.config.options.maxTokens
            }
        };

        // 如果有图片数据，添加图片
        if (imageData) {
            // Ollama 支持 base64 图片
            const base64Image = typeof imageData === 'string' 
                ? imageData.replace(/^data:image\/\w+;base64,/, '')
                : await this.imageToBase64(imageData);
            requestBody.images = [base64Image];
        }

        const response = await fetch(`${baseUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`Ollama API 错误: ${response.status}`);
        }

        const data = await response.json();
        return this.parseAIResponse(data.response, 'ollama');
    }

    // 调用 LM Studio 本地 API
    async callLMStudio(prompt, imageData) {
        const baseUrl = this.config.local.lmStudioUrl;
        
        // LM Studio 使用 OpenAI 兼容格式
        const messages = [
            {
                role: 'system',
                content: '你是一位专业摄影导师，擅长分析照片并提供建设性建议。'
            },
            {
                role: 'user',
                content: []
            }
        ];

        // 添加图片（如果支持多模态）
        if (imageData) {
            const base64Image = typeof imageData === 'string' 
                ? imageData 
                : await this.imageToBase64(imageData);
            messages[1].content.push({
                type: 'image_url',
                image_url: { url: base64Image }
            });
        }

        // 添加文本提示
        messages[1].content.push({
            type: 'text',
            text: prompt
        });

        const response = await fetch(`${baseUrl}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.config.model || 'local-model',
                messages: messages,
                temperature: this.config.options.temperature,
                max_tokens: this.config.options.maxTokens
            })
        });

        if (!response.ok) {
            throw new Error(`LM Studio API 错误: ${response.status}`);
        }

        const data = await response.json();
        return this.parseAIResponse(data.choices[0].message.content, 'lmstudio');
    }

    // 调用 OpenAI API
    async callOpenAI(prompt, imageData) {
        const messages = [
            {
                role: 'system',
                content: '你是一位专业摄影导师，擅长分析照片并提供建设性建议。'
            },
            {
                role: 'user',
                content: []
            }
        ];

        // 添加图片
        if (imageData) {
            const base64Image = typeof imageData === 'string' 
                ? imageData 
                : await this.imageToBase64(imageData);
            messages[1].content.push({
                type: 'image_url',
                image_url: { url: base64Image }
            });
        }

        // 添加文本
        messages[1].content.push({
            type: 'text',
            text: prompt
        });

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: messages,
                temperature: this.config.options.temperature,
                max_tokens: this.config.options.maxTokens
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API 错误: ${error.error?.message || response.status}`);
        }

        const data = await response.json();
        return this.parseAIResponse(data.choices[0].message.content, 'openai');
    }

    // 调用自定义 API
    async callCustomAPI(prompt, imageData) {
        const baseUrl = this.config.local.customUrl;
        
        const requestBody = {
            prompt: prompt,
            model: this.config.model,
            temperature: this.config.options.temperature,
            max_tokens: this.config.options.maxTokens
        };

        if (imageData) {
            requestBody.image = typeof imageData === 'string' 
                ? imageData 
                : await this.imageToBase64(imageData);
        }

        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`自定义 API 错误: ${response.status}`);
        }

        const data = await response.json();
        return this.parseAIResponse(
            data.choices?.[0]?.message?.content || data.response || data.text,
            'custom'
        );
    }

    // 将图片转换为 base64
    async imageToBase64(imageData) {
        if (typeof imageData === 'string' && imageData.startsWith('data:')) {
            return imageData;
        }
        
        // 如果是 File 对象或 Blob
        if (imageData instanceof File || imageData instanceof Blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(imageData);
            });
        }
        
        return imageData;
    }

    // 解析 AI 响应
    parseAIResponse(content, provider) {
        // 尝试从文本中提取结构化数据
        // 如果 AI 返回的是 JSON 格式，直接解析
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    provider: provider,
                    analysis: {
                        composition: { score: parsed.composition?.score || 8, comment: parsed.composition?.comment || parsed.composition || '构图良好' },
                        lighting: { score: parsed.lighting?.score || 8, comment: parsed.lighting?.comment || parsed.lighting || '光影处理得当' },
                        color: { score: parsed.color?.score || 8, comment: parsed.color?.comment || parsed.color || '色彩协调' },
                        technical: { score: parsed.technical?.score || 8, comment: parsed.technical?.comment || parsed.technical || '技术执行到位' },
                        emotion: { score: parsed.emotion?.score || 8, comment: parsed.emotion?.comment || parsed.emotion || '情感表达自然' }
                    },
                    suggestions: parsed.suggestions || ['继续保持', '尝试不同角度'],
                    rawResponse: content,
                    generatedAt: new Date().toISOString()
                };
            }
        } catch (e) {
            // 不是 JSON 格式，使用文本解析
        }

        // 默认返回结构
        return {
            provider: provider,
            analysis: {
                composition: { score: 8, comment: this.extractSection(content, '构图') || 'AI 分析：构图方面表现良好' },
                lighting: { score: 8, comment: this.extractSection(content, '光影') || this.extractSection(content, '光线') || 'AI 分析：光影处理得当' },
                color: { score: 8, comment: this.extractSection(content, '色彩') || this.extractSection(content, '颜色') || 'AI 分析：色彩协调' },
                technical: { score: 8, comment: this.extractSection(content, '技术') || 'AI 分析：技术执行到位' },
                emotion: { score: 8, comment: this.extractSection(content, '情感') || this.extractSection(content, '情绪') || 'AI 分析：情感表达自然' }
            },
            suggestions: this.extractSuggestions(content),
            rawResponse: content,
            generatedAt: new Date().toISOString()
        };
    }

    // 从文本中提取特定部分
    extractSection(text, keyword) {
        const regex = new RegExp(`${keyword}[：:]([^\n]+)`, 'i');
        const match = text.match(regex);
        return match ? match[1].trim() : null;
    }

    // 提取建议列表
    extractSuggestions(text) {
        const suggestions = [];
        const lines = text.split('\n');
        
        for (const line of lines) {
            // 匹配数字开头的建议
            if (/^[\d一二三四五六七八九十]+[.、\s]/.test(line.trim())) {
                suggestions.push(line.trim().replace(/^[\d一二三四五六七八九十]+[.、\s]+/, ''));
            }
            // 匹配 "建议" 关键词
            else if (line.includes('建议') && line.length > 10) {
                suggestions.push(line.trim());
            }
        }
        
        return suggestions.length > 0 ? suggestions : ['参考 AI 详细分析', '继续练习提升'];
    }

    // 构建提示词
    buildPrompt(exifData) {
        return `你是一位专业摄影导师。请根据以下 EXIF 数据对照片进行分析：

相机：${exifData.Make || '未知'} ${exifData.Model || ''}
镜头：${exifData.LensModel || '未知'}
光圈：f/${exifData.FNumber || '未知'}
快门：${exifData.ExposureTime || '未知'}
ISO：${exifData.ISOSpeedRatings || '未知'}
焦距：${exifData.FocalLength || '未知'}mm

请从构图、光影、色彩、技术、情感五个维度进行点评（每个维度给出1-10分评分和简短评语），并给出3-5条具体改进建议。

回复格式示例：
构图：8分，主体位置得当，画面平衡
光影：7分，光线柔和但略显平淡
色彩：8分，色调和谐统一
技术：9分，曝光准确，对焦清晰
情感：7分，氛围营造尚可

建议：
1. 尝试使用三分法构图增强视觉引导
2. 利用侧光增加立体感
3. 适当降低饱和度让画面更自然`;
    }

    // 测试连接（用于本地模型）
    async testConnection() {
        try {
            switch (this.config.provider) {
                case 'ollama':
                    const ollamaResponse = await fetch(`${this.config.local.baseUrl}/api/tags`);
                    if (!ollamaResponse.ok) throw new Error('无法连接到 Ollama');
                    const ollamaData = await ollamaResponse.json();
                    return {
                        success: true,
                        provider: 'ollama',
                        models: ollamaData.models?.map(m => m.name) || [],
                        message: 'Ollama 连接成功'
                    };
                    
                case 'lmstudio':
                    const lmResponse = await fetch(`${this.config.local.lmStudioUrl}/v1/models`);
                    if (!lmResponse.ok) throw new Error('无法连接到 LM Studio');
                    const lmData = await lmResponse.json();
                    return {
                        success: true,
                        provider: 'lmstudio',
                        models: lmData.data?.map(m => m.id) || [],
                        message: 'LM Studio 连接成功'
                    };
                    
                case 'openai':
                    if (!this.config.apiKey) {
                        throw new Error('未配置 OpenAI API Key');
                    }
                    return {
                        success: true,
                        provider: 'openai',
                        message: 'OpenAI 配置正确'
                    };
                    
                default:
                    return { success: false, message: '未知的提供商' };
            }
        } catch (error) {
            return {
                success: false,
                provider: this.config.provider,
                message: error.message
            };
        }
    }

    // 更新配置
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        if (newConfig.local) {
            this.config.local = { ...this.config.local, ...newConfig.local };
        }
        if (newConfig.options) {
            this.config.options = { ...this.config.options, ...newConfig.options };
        }
    }

    // 获取当前配置
    getConfig() {
        return { ...this.config };
    }
}

// 确保全局可用
if (typeof window !== 'undefined') {
    window.PhotoRuleEngine = PhotoRuleEngine;
    window.AIAnalyzer = AIAnalyzer;
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PhotoRuleEngine, AIAnalyzer };
}

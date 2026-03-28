// Photo Monster - 本地照片分析器
// 无需 API 即可提供基础照片点评

class LocalPhotoAnalyzer {
    constructor() {
        this.initRules();
    }

    initRules() {
        // 构图规则
        this.compositionRules = {
            evaluate: (exif, imageData) => {
                const suggestions = [];
                const issues = [];
                let score = 8;

                const focalLength = parseFloat(exif.FocalLength) || 50;
                const aspectRatio = imageData ? (imageData.width / imageData.height) : 1.5;

                // 根据焦段给出构图建议
                if (focalLength >= 85) {
                    suggestions.push('长焦镜头适合简化背景，注意寻找简洁背景突出主体');
                    suggestions.push('尝试竖构图增强纵深感');
                } else if (focalLength <= 35) {
                    suggestions.push('广角镜头适合强调前景，可寻找有趣的前景元素');
                    suggestions.push('注意画面边缘的畸变，避免将人脸放在边缘');
                }

                // 画幅比例建议
                if (aspectRatio > 2) {
                    suggestions.push('宽幅比例适合风光摄影，注意水平线保持水平');
                }

                return { score, issues, suggestions };
            }
        };

        // 色彩规则
        this.colorRules = {
            evaluate: (exif) => {
                const suggestions = [];
                let score = 8;

                const whiteBalance = exif.WhiteBalance;
                
                if (whiteBalance === 'Auto') {
                    suggestions.push('自动白平衡适合大多数场景，但在特殊光线（如夕阳、烛光）下可尝试手动白平衡');
                }

                // 根据拍摄时间给建议
                const dateTime = exif.DateTimeOriginal;
                if (dateTime) {
                    const hour = parseInt(dateTime.split(' ')[1]?.split(':')[0]);
                    if (hour >= 17 && hour <= 19) {
                        suggestions.push('黄金时刻拍摄，光线温暖柔和，适合人像和风光');
                        score += 1;
                    } else if (hour >= 11 && hour <= 14) {
                        suggestions.push('正午光线较硬，可考虑寻找阴影或使用反光板');
                    }
                }

                return { score, issues: [], suggestions };
            }
        };

        // 技术质量规则
        this.technicalRules = {
            evaluate: (exif) => {
                const issues = [];
                const suggestions = [];
                let score = 10;

                const iso = parseInt(exif.ISOSpeedRatings) || 100;
                const fileSize = exif.FileSize || 0;
                
                // 检查是否过度压缩
                const megapixels = (exif.PixelXDimension * exif.PixelYDimension) / 1000000;
                if (megapixels > 0 && fileSize > 0) {
                    const bytesPerPixel = fileSize / (megapixels * 1000000);
                    if (bytesPerPixel < 0.5) {
                        issues.push('图片压缩率较高，可能存在画质损失');
                        suggestions.push('如需后期调整，建议使用更高质量设置拍摄');
                        score -= 2;
                    }
                }

                // ISO 建议
                if (iso > 6400) {
                    issues.push(`ISO ${iso} 较高，画面可能出现明显噪点`);
                    suggestions.push('尝试使用三脚架降低ISO');
                    suggestions.push('后期可使用降噪软件处理');
                    score -= 2;
                } else if (iso <= 400) {
                    suggestions.push('低ISO设置保证了良好的画质');
                    score += 0.5;
                }

                return { score: Math.max(1, Math.min(10, score)), issues, suggestions };
            }
        };

        // 曝光规则
        this.exposureRules = {
            evaluate: (exif) => {
                const issues = [];
                const suggestions = [];
                let score = 10;

                const aperture = parseFloat(exif.FNumber) || 5.6;
                const shutterSpeed = this.parseShutterSpeed(exif.ExposureTime);
                const iso = parseInt(exif.ISOSpeedRatings) || 100;
                const ev = parseFloat(exif.ExposureBiasValue) || 0;

                // 检查曝光补偿
                if (Math.abs(ev) > 1) {
                    suggestions.push(`曝光补偿 ${ev > 0 ? '+' : ''}${ev}EV，注意检查高光或阴影细节`);
                    if (Math.abs(ev) > 2) {
                        issues.push('曝光补偿较大，可能导致部分细节丢失');
                        score -= 1;
                    }
                }

                // 快门速度检查
                const focalLength = parseFloat(exif.FocalLength) || 50;
                const minShutter = 1 / (focalLength * 1.5); // 安全快门
                if (shutterSpeed < minShutter && !exif.ImageStabilization) {
                    suggestions.push(`快门速度 ${this.formatShutter(shutterSpeed)} 较慢，建议使用三脚架或提高ISO`);
                    score -= 0.5;
                }

                // 光圈建议
                if (aperture < 2.0) {
                    suggestions.push(`大光圈 f/${aperture} 可获得美丽的虚化效果，但对焦需要更精确`);
                } else if (aperture > 11) {
                    suggestions.push(`小光圈 f/${aperture} 可能产生衍射，影响画质锐度`);
                }

                return { score: Math.max(1, Math.min(10, score)), issues, suggestions };
            }
        };

        // 对焦规则
        this.focusRules = {
            evaluate: (exif) => {
                const issues = [];
                const suggestions = [];
                let score = 10;

                const focusMode = exif.FocusMode || '';
                const afPoint = exif.AFPoint || '';

                // 对焦模式建议
                if (focusMode.includes('Manual') || focusMode.includes('MF')) {
                    suggestions.push('使用手动对焦，建议开启峰值对焦辅助确认焦点');
                } else if (focusMode.includes('Single') || focusMode.includes('AF-S')) {
                    suggestions.push('单次对焦适合静态主体，拍摄运动物体建议切换到连续对焦');
                }

                // 景深建议
                const aperture = parseFloat(exif.FNumber) || 5.6;
                const focalLength = parseFloat(exif.FocalLength) || 50;
                if (focalLength >= 85 && aperture <= 2.8) {
                    suggestions.push('长焦大光圈组合景深很浅，注意精确对焦在眼睛上');
                }

                return { score, issues, suggestions };
            }
        };

        // 稳定性规则
        this.stabilityRules = {
            evaluate: (exif) => {
                const issues = [];
                const suggestions = [];
                let score = 10;

                const shutterSpeed = this.parseShutterSpeed(exif.ExposureTime);
                const focalLength = parseFloat(exif.FocalLength) || 50;
                const hasStabilization = exif.ImageStabilization || false;

                // 计算安全快门
                const safeShutter = hasStabilization ? 1 / (focalLength * 0.5) : 1 / focalLength;

                if (shutterSpeed < safeShutter) {
                    if (hasStabilization) {
                        suggestions.push(`快门速度较慢，防抖功能已开启，但仍需保持相机稳定`);
                    } else {
                        issues.push(`快门速度 ${this.formatShutter(shutterSpeed)} 低于安全快门，容易手抖模糊`);
                        suggestions.push(`建议使用三脚架或开启防抖功能`);
                        suggestions.push(`提高ISO到 ${Math.ceil(100 * safeShutter / shutterSpeed)} 以上可获得安全快门`);
                        score -= 2;
                    }
                }

                return { score: Math.max(1, Math.min(10, score)), issues, suggestions };
            }
        };
    }

    // 解析快门速度
    parseShutterSpeed(exposureTime) {
        if (!exposureTime) return 1/125;
        if (typeof exposureTime === 'number') return exposureTime;
        // 处理分数格式如 "1/125"
        if (typeof exposureTime === 'string' && exposureTime.includes('/')) {
            const [num, den] = exposureTime.split('/').map(Number);
            return num / den;
        }
        return parseFloat(exposureTime) || 1/125;
    }

    // 格式化快门速度显示
    formatShutter(speed) {
        if (speed >= 1) return `${Math.round(speed)}s`;
        return `1/${Math.round(1/speed)}s`;
    }

    // 主分析函数
    async analyze(exifData, imageElement) {
        const results = {
            composition: this.compositionRules.evaluate(exifData, imageElement),
            color: this.colorRules.evaluate(exifData),
            technical: this.technicalRules.evaluate(exifData),
            exposure: this.exposureRules.evaluate(exifData),
            focus: this.focusRules.evaluate(exifData),
            stability: this.stabilityRules.evaluate(exifData),
            overall: 0
        };

        // 计算总分（加权平均）
        results.overall = Math.round(
            (results.composition.score * 0.2 +
             results.color.score * 0.15 +
             results.technical.score * 0.25 +
             results.exposure.score * 0.2 +
             results.focus.score * 0.1 +
             results.stability.score * 0.1)
        );

        return results;
    }

    // 生成点评报告 HTML
    generateReport(results) {
        const allSuggestions = [
            ...results.composition.suggestions,
            ...results.color.suggestions,
            ...results.technical.suggestions,
            ...results.exposure.suggestions,
            ...results.focus.suggestions,
            ...results.stability.suggestions
        ];

        const allIssues = [
            ...results.composition.issues,
            ...results.color.issues,
            ...results.technical.issues,
            ...results.exposure.issues,
            ...results.focus.issues,
            ...results.stability.issues
        ];

        // 去重
        const uniqueSuggestions = [...new Set(allSuggestions)];
        const uniqueIssues = [...new Set(allIssues)];

        return {
            score: results.overall,
            summary: this.getSummaryText(results.overall),
            suggestions: uniqueSuggestions,
            issues: uniqueIssues,
            details: {
                composition: results.composition.score,
                color: results.color.score,
                technical: results.technical.score,
                exposure: results.exposure.score,
                focus: results.focus.score,
                stability: results.stability.score
            }
        };
    }

    getSummaryText(score) {
        if (score >= 9) return '技术扎实，参数设置合理，继续保持！';
        if (score >= 7) return '整体不错，有小幅优化空间。';
        if (score >= 5) return '基本合格，建议关注以下改进点。';
        return '需要调整拍摄参数，参考建议进行优化。';
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalPhotoAnalyzer;
}

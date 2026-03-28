/**
 * Photo Monster - 增强版照片分析器
 * 包含直方图、构图辅助线、深度分析等功能
 */

class PhotoAnalyzerEnhanced {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.currentImage = null;
        this.overlayCanvas = null;
        this.overlayCtx = null;
        this.magnifierCanvas = null;
        this.isAnalyzing = false;
        this.analysisResults = null;
    }

    // 初始化画布
    initCanvas(width, height) {
        // 主画布
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        // 叠加层画布（用于辅助线）
        this.overlayCanvas = document.createElement('canvas');
        this.overlayCanvas.width = width;
        this.overlayCanvas.height = height;
        this.overlayCtx = this.overlayCanvas.getContext('2d');

        return this.canvas;
    }

    // 加载图片
    loadImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    // ========== 直方图功能 ==========
    
    calculateHistogram(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        // 初始化直方图数组 (256个级别)
        const histogram = {
            r: new Array(256).fill(0),
            g: new Array(256).fill(0),
            b: new Array(256).fill(0),
            luminance: new Array(256).fill(0)
        };

        // 统计像素值
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // 计算亮度 (Rec. 709)
            const luminance = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
            
            histogram.r[r]++;
            histogram.g[g]++;
            histogram.b[b]++;
            histogram.luminance[luminance]++;
        }

        // 归一化
        const totalPixels = width * height;
        const maxCount = Math.max(
            ...histogram.luminance,
            ...histogram.r,
            ...histogram.g,
            ...histogram.b
        );

        return {
            r: histogram.r.map(v => v / maxCount),
            g: histogram.g.map(v => v / maxCount),
            b: histogram.b.map(v => v / maxCount),
            luminance: histogram.luminance.map(v => v / maxCount),
            stats: this.calculateHistogramStats(histogram, totalPixels)
        };
    }

    calculateHistogramStats(histogram, totalPixels) {
        let sumLuminance = 0;
        let sumSquares = 0;
        
        for (let i = 0; i < 256; i++) {
            const count = histogram.luminance[i];
            sumLuminance += i * count;
            sumSquares += i * i * count;
        }
        
        const mean = sumLuminance / totalPixels;
        const variance = (sumSquares / totalPixels) - (mean * mean);
        const stdDev = Math.sqrt(variance);
        
        // 计算阴影/中间调/高光占比
        let shadows = 0, midtones = 0, highlights = 0;
        for (let i = 0; i < 64; i++) shadows += histogram.luminance[i];
        for (let i = 64; i < 192; i++) midtones += histogram.luminance[i];
        for (let i = 192; i < 256; i++) highlights += histogram.luminance[i];
        
        return {
            mean: Math.round(mean),
            stdDev: Math.round(stdDev),
            shadows: Math.round((shadows / totalPixels) * 100),
            midtones: Math.round((midtones / totalPixels) * 100),
            highlights: Math.round((highlights / totalPixels) * 100)
        };
    }

    drawHistogram(canvas, histogram, type = 'rgb') {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const padding = 20;
        const graphHeight = height - padding * 2;
        const graphWidth = width - padding * 2;
        
        // 清空画布
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, width, height);
        
        // 绘制网格
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = padding + (graphHeight / 4) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // 绘制直方图
        const barWidth = graphWidth / 256;
        
        if (type === 'rgb' || type === 'luminance') {
            // 绘制RGB通道
            const channels = [
                { data: histogram.r, color: 'rgba(255, 99, 132, 0.6)' },
                { data: histogram.g, color: 'rgba(75, 192, 192, 0.6)' },
                { data: histogram.b, color: 'rgba(54, 162, 235, 0.6)' }
            ];
            
            channels.forEach(channel => {
                ctx.fillStyle = channel.color;
                for (let i = 0; i < 256; i++) {
                    const barHeight = channel.data[i] * graphHeight;
                    ctx.fillRect(
                        padding + i * barWidth,
                        height - padding - barHeight,
                        barWidth + 0.5,
                        barHeight
                    );
                }
            });
        }
        
        // 绘制亮度通道（白色）
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 256; i++) {
            const barHeight = histogram.luminance[i] * graphHeight;
            ctx.fillRect(
                padding + i * barWidth,
                height - padding - barHeight,
                barWidth + 0.5,
                barHeight
            );
        }
        
        // 绘制统计信息
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.fillText(`平均亮度: ${histogram.stats.mean}`, padding, 15);
        ctx.fillText(`阴影: ${histogram.stats.shadows}%`, padding + 100, 15);
        ctx.fillText(`中间调: ${histogram.stats.midtones}%`, padding + 180, 15);
        ctx.fillText(`高光: ${histogram.stats.highlights}%`, padding + 270, 15);
    }

    // ========== 构图辅助线 ==========
    
    drawRuleOfThirds(width, height) {
        this.clearOverlay();
        const ctx = this.overlayCtx;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        // 垂直线
        const x1 = width / 3;
        const x2 = (width / 3) * 2;
        ctx.beginPath();
        ctx.moveTo(x1, 0);
        ctx.lineTo(x1, height);
        ctx.moveTo(x2, 0);
        ctx.lineTo(x2, height);
        
        // 水平线
        const y1 = height / 3;
        const y2 = (height / 3) * 2;
        ctx.moveTo(0, y1);
        ctx.lineTo(width, y1);
        ctx.moveTo(0, y2);
        ctx.lineTo(width, y2);
        ctx.stroke();
        
        // 绘制交点
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        const points = [
            [x1, y1], [x1, y2], [x2, y1], [x2, y2]
        ];
        points.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
        
        return this.overlayCanvas;
    }

    drawGoldenRatio(width, height) {
        this.clearOverlay();
        const ctx = this.overlayCtx;
        const phi = 1.618;
        
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        // 黄金分割点
        const x1 = width / phi;
        const x2 = width - width / phi;
        const y1 = height / phi;
        const y2 = height - height / phi;
        
        ctx.beginPath();
        ctx.moveTo(x1, 0);
        ctx.lineTo(x1, height);
        ctx.moveTo(x2, 0);
        ctx.lineTo(x2, height);
        ctx.moveTo(0, y1);
        ctx.lineTo(width, y1);
        ctx.moveTo(0, y2);
        ctx.lineTo(width, y2);
        ctx.stroke();
        
        return this.overlayCanvas;
    }

    drawCenterLines(width, height) {
        this.clearOverlay();
        const ctx = this.overlayCtx;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        
        // 中心点
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        
        return this.overlayCanvas;
    }

    drawDiagonalLines(width, height) {
        this.clearOverlay();
        const ctx = this.overlayCtx;
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(width, height);
        ctx.moveTo(width, 0);
        ctx.lineTo(0, height);
        ctx.stroke();
        
        return this.overlayCanvas;
    }

    clearOverlay() {
        if (this.overlayCtx) {
            this.overlayCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
        }
    }

    // ========== 放大镜功能 ==========
    
    createMagnifier(sourceCanvas, x, y, zoomLevel = 2) {
        const size = 150;
        const magnifier = document.createElement('canvas');
        magnifier.width = size;
        magnifier.height = size;
        const ctx = magnifier.getContext('2d');
        
        // 绘制圆形裁剪区域
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
        ctx.clip();
        
        // 绘制放大后的图像
        const sourceX = x - size / (zoomLevel * 2);
        const sourceY = y - size / (zoomLevel * 2);
        const sourceSize = size / zoomLevel;
        
        ctx.drawImage(
            sourceCanvas,
            sourceX, sourceY, sourceSize, sourceSize,
            0, 0, size, size
        );
        
        // 绘制十字准星
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(size / 2, 0);
        ctx.lineTo(size / 2, size);
        ctx.moveTo(0, size / 2);
        ctx.lineTo(size, size / 2);
        ctx.stroke();
        
        // 绘制边框
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
        ctx.stroke();
        
        return magnifier;
    }

    // ========== 深度分析功能 ==========
    
    async analyzeImageDepth(imageData) {
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;
        
        const analysis = {
            exposure: this.analyzeExposure(data),
            color: this.analyzeColor(data),
            sharpness: this.analyzeSharpness(data, width, height),
            noise: this.analyzeNoise(data, width, height),
            contrast: this.analyzeContrast(data),
            dynamicRange: this.analyzeDynamicRange(data)
        };
        
        return analysis;
    }

    analyzeExposure(data) {
        let totalLuminance = 0;
        let pixelCount = data.length / 4;
        
        for (let i = 0; i < data.length; i += 4) {
            const luminance = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
            totalLuminance += luminance;
        }
        
        const avgLuminance = totalLuminance / pixelCount;
        let score = 100 - Math.abs(avgLuminance - 128) / 1.28;
        score = Math.max(0, Math.min(100, score));
        
        return {
            average: Math.round(avgLuminance),
            score: Math.round(score),
            assessment: avgLuminance < 64 ? '欠曝' : avgLuminance > 192 ? '过曝' : '正常'
        };
    }

    analyzeColor(data) {
        let rSum = 0, gSum = 0, bSum = 0;
        let pixelCount = data.length / 4;
        
        for (let i = 0; i < data.length; i += 4) {
            rSum += data[i];
            gSum += data[i + 1];
            bSum += data[i + 2];
        }
        
        const rAvg = rSum / pixelCount;
        const gAvg = gSum / pixelCount;
        const bAvg = bSum / pixelCount;
        
        // 计算色彩饱和度（简化版）
        const saturation = Math.sqrt(
            Math.pow(rAvg - gAvg, 2) + 
            Math.pow(gAvg - bAvg, 2) + 
            Math.pow(bAvg - rAvg, 2)
        ) / 255 * 100;
        
        // 判断色温倾向
        let colorTemp = '中性';
        if (rAvg > bAvg + 20) colorTemp = '偏暖';
        else if (bAvg > rAvg + 20) colorTemp = '偏冷';
        
        return {
            dominant: this.getDominantColor(rAvg, gAvg, bAvg),
            saturation: Math.round(saturation),
            temperature: colorTemp,
            score: Math.round(Math.min(100, saturation * 2))
        };
    }

    getDominantColor(r, g, b) {
        if (r > g && r > b) return '红色系';
        if (g > r && g > b) return '绿色系';
        if (b > r && b > g) return '蓝色系';
        if (r > 200 && g > 200 && b > 200) return '高调/白色';
        if (r < 50 && g < 50 && b < 50) return '低调/黑色';
        return '混合色';
    }

    analyzeSharpness(data, width, height) {
        // 使用简单的边缘检测算法
        let edgeCount = 0;
        const threshold = 30;
        
        for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
                const idx = (y * width + x) * 4;
                const rightIdx = (y * width + x + 1) * 4;
                const bottomIdx = ((y + 1) * width + x) * 4;
                
                const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
                const rightGray = (data[rightIdx] + data[rightIdx + 1] + data[rightIdx + 2]) / 3;
                const bottomGray = (data[bottomIdx] + data[bottomIdx + 1] + data[bottomIdx + 2]) / 3;
                
                const diff = Math.abs(gray - rightGray) + Math.abs(gray - bottomGray);
                if (diff > threshold) edgeCount++;
            }
        }
        
        const edgeRatio = edgeCount / (width * height);
        const score = Math.min(100, edgeRatio * 5000);
        
        return {
            edgeRatio: Math.round(edgeRatio * 10000) / 100,
            score: Math.round(score),
            assessment: score > 70 ? '清晰' : score > 40 ? '一般' : '偏软'
        };
    }

    analyzeNoise(data, width, height) {
        // 计算局部方差来估计噪点水平
        let totalVariance = 0;
        const sampleSize = 1000;
        const step = Math.floor((width * height) / sampleSize);
        
        for (let i = 0; i < data.length; i += 4 * step) {
            const neighbors = [];
            const x = (i / 4) % width;
            const y = Math.floor((i / 4) / width);
            
            // 采样周围像素
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const nIdx = (ny * width + nx) * 4;
                        const gray = (data[nIdx] + data[nIdx + 1] + data[nIdx + 2]) / 3;
                        neighbors.push(gray);
                    }
                }
            }
            
            // 计算局部方差
            const mean = neighbors.reduce((a, b) => a + b, 0) / neighbors.length;
            const variance = neighbors.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / neighbors.length;
            totalVariance += variance;
        }
        
        const avgVariance = totalVariance / sampleSize;
        const noiseLevel = Math.min(100, avgVariance / 10);
        
        return {
            level: Math.round(noiseLevel),
            score: Math.round(100 - noiseLevel),
            assessment: noiseLevel < 20 ? '干净' : noiseLevel < 50 ? '轻微噪点' : '明显噪点'
        };
    }

    analyzeContrast(data) {
        let minLum = 255, maxLum = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
            minLum = Math.min(minLum, lum);
            maxLum = Math.max(maxLum, lum);
        }
        
        const contrast = maxLum - minLum;
        const score = (contrast / 255) * 100;
        
        return {
            range: Math.round(contrast),
            min: Math.round(minLum),
            max: Math.round(maxLum),
            score: Math.round(score),
            assessment: score > 70 ? '高对比' : score > 40 ? '正常' : '低对比'
        };
    }

    analyzeDynamicRange(data) {
        const histogram = new Array(256).fill(0);
        
        for (let i = 0; i < data.length; i += 4) {
            const lum = Math.round(0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]);
            histogram[lum]++;
        }
        
        // 找到有效范围（排除极值）
        let minVal = 0, maxVal = 255;
        const totalPixels = data.length / 4;
        const threshold = totalPixels * 0.001; // 0.1%
        
        for (let i = 0; i < 256; i++) {
            if (histogram[i] > threshold) {
                minVal = i;
                break;
            }
        }
        
        for (let i = 255; i >= 0; i--) {
            if (histogram[i] > threshold) {
                maxVal = i;
                break;
            }
        }
        
        const range = maxVal - minVal;
        const stops = Math.log2(range + 1);
        
        return {
            range: range,
            stops: Math.round(stops * 10) / 10,
            min: minVal,
            max: maxVal,
            score: Math.round((range / 255) * 100),
            assessment: stops > 7 ? '优秀' : stops > 5 ? '良好' : '有限'
        };
    }

    // ========== 生成分析报告 ==========
    
    generateReport(analysis) {
        const scores = [
            analysis.exposure.score,
            analysis.color.score,
            analysis.sharpness.score,
            analysis.noise.score,
            analysis.contrast.score,
            analysis.dynamicRange.score
        ];
        
        const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        
        return {
            overall: overallScore,
            details: analysis,
            suggestions: this.generateSuggestions(analysis),
            radarData: {
                labels: ['曝光', '色彩', '清晰度', '噪点控制', '对比度', '动态范围'],
                data: scores
            }
        };
    }

    generateSuggestions(analysis) {
        const suggestions = [];
        
        if (analysis.exposure.score < 60) {
            suggestions.push(`曝光${analysis.exposure.assessment}，建议调整曝光补偿`);
        }
        if (analysis.sharpness.score < 60) {
            suggestions.push('画面偏软，检查对焦或考虑使用三脚架');
        }
        if (analysis.noise.level > 50) {
            suggestions.push('噪点明显，建议使用降噪处理或降低ISO');
        }
        if (analysis.contrast.score < 50) {
            suggestions.push('对比度偏低，可适当增加对比度提升画面层次');
        }
        if (analysis.dynamicRange.stops < 5) {
            suggestions.push('动态范围有限，注意保留高光和阴影细节');
        }
        
        return suggestions.length > 0 ? suggestions : ['整体表现良好，继续保持！'];
    }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoAnalyzerEnhanced;
}

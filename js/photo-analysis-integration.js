/**
 * Photo Monster - 照片分析增强功能集成脚本
 * 将增强版分析器与现有页面集成
 */

// 全局增强分析器实例
let enhancedAnalyzer = null;
// 注意：currentImageData 在 app.js 中已定义，这里不再重复声明

// 初始化增强功能
document.addEventListener('DOMContentLoaded', function() {
    // 等待页面加载完成
    setTimeout(initEnhancedAnalysis, 500);
});

function initEnhancedAnalysis() {
    // 创建增强分析器实例
    enhancedAnalyzer = new PhotoAnalyzerEnhanced();
    
    // 绑定工具按钮事件
    bindToolButtons();
    
    // 绑定直方图按钮
    bindHistogramButton();
    
    // 修改原有的 analyzeImages 函数以集成深度分析
    integrateDepthAnalysis();
    
    console.log('照片分析增强功能已初始化');
}

// 绑定工具按钮
function bindToolButtons() {
    const buttons = {
        'ruleOfThirdsBtn': () => drawOverlay('ruleOfThirds'),
        'goldenRatioBtn': () => drawOverlay('goldenRatio'),
        'centerBtn': () => drawOverlay('center'),
        'clearOverlayBtn': clearOverlay
    };
    
    Object.entries(buttons).forEach(([id, handler]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', function() {
                // 切换激活状态
                if (id !== 'clearOverlayBtn') {
                    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                } else {
                    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                }
                handler();
            });
        }
    });
}

// 绑定直方图按钮
function bindHistogramButton() {
    const histogramBtn = document.getElementById('histogramBtn');
    const histogramContainer = document.getElementById('histogramContainer');
    const closeHistogramBtn = document.getElementById('closeHistogram');
    
    if (histogramBtn && histogramContainer) {
        histogramBtn.addEventListener('click', async function() {
            if (histogramContainer.style.display === 'none') {
                histogramContainer.style.display = 'block';
                await updateHistogram();
            } else {
                histogramContainer.style.display = 'none';
            }
        });
    }
    
    if (closeHistogramBtn && histogramContainer) {
        closeHistogramBtn.addEventListener('click', function() {
            histogramContainer.style.display = 'none';
        });
    }
}

// 更新直方图
async function updateHistogram() {
    const canvas = document.getElementById('histogramCanvas');
    if (!canvas || !window.currentImageData) return;
    
    // 调整画布大小
    canvas.width = 600;
    canvas.height = 200;
    
    // 计算并绘制直方图
    const histogram = enhancedAnalyzer.calculateHistogram(window.currentImageData);
    enhancedAnalyzer.drawHistogram(canvas, histogram, 'rgb');
}

// 绘制辅助线叠加层
function drawOverlay(type) {
    const previewImg = document.querySelector('.preview-image-container img');
    if (!previewImg) return;
    
    const container = previewImg.parentElement;
    let overlay = container.querySelector('.overlay-canvas');
    
    if (!overlay) {
        overlay = document.createElement('canvas');
        overlay.className = 'overlay-canvas';
        overlay.width = previewImg.naturalWidth || previewImg.width;
        overlay.height = previewImg.naturalHeight || previewImg.height;
        container.appendChild(overlay);
    }
    
    // 初始化叠加层
    enhancedAnalyzer.overlayCanvas = overlay;
    enhancedAnalyzer.overlayCtx = overlay.getContext('2d');
    
    // 根据类型绘制
    switch(type) {
        case 'ruleOfThirds':
            enhancedAnalyzer.drawRuleOfThirds(overlay.width, overlay.height);
            break;
        case 'goldenRatio':
            enhancedAnalyzer.drawGoldenRatio(overlay.width, overlay.height);
            break;
        case 'center':
            enhancedAnalyzer.drawCenterLines(overlay.width, overlay.height);
            break;
    }
}

// 清除叠加层
function clearOverlay() {
    const previewImg = document.querySelector('.preview-image-container img');
    if (!previewImg) return;
    
    const container = previewImg.parentElement;
    const overlay = container.querySelector('.overlay-canvas');
    if (overlay) {
        overlay.remove();
    }
    
    enhancedAnalyzer.clearOverlay();
}

// 集成深度分析到原有分析流程
function integrateDepthAnalysis() {
    // 保存原始函数引用
    const originalAnalyzeImages = window.analyzeImages;
    
    // 重写分析函数
    window.analyzeImages = async function() {
        if (typeof compressedImages === 'undefined' || compressedImages.length === 0) {
            alert('请先上传照片');
            return;
        }
        
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = true;
            analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 分析中...';
        }
        
        try {
            // 显示进度区域
            showAnalysisProgress();
            
            // 获取第一张图片进行分析
            const imageFile = compressedImages[0].file;
            
            // 加载图片
            updateProgressStep('histogram', 'active');
            const img = await enhancedAnalyzer.loadImage(imageFile);
            
            // 创建画布并获取图像数据
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            window.currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 执行深度分析
            updateProgressStep('exposure', 'active');
            await delay(300);
            
            updateProgressStep('color', 'active');
            await delay(300);
            
            updateProgressStep('sharpness', 'active');
            await delay(300);
            
            updateProgressStep('noise', 'active');
            await delay(300);
            
            updateProgressStep('contrast', 'active');
            await delay(300);
            
            // 执行完整分析
            const analysis = await enhancedAnalyzer.analyzeImageDepth(window.currentImageData);
            const report = enhancedAnalyzer.generateReport(analysis);
            
            // 隐藏进度，显示结果
            hideAnalysisProgress();
            displayDepthAnalysisResults(report);
            
            // 同时调用原有的AI分析（如果可用）
            if (originalAnalyzeImages && typeof originalAnalyzeImages === 'function') {
                try {
                    await originalAnalyzeImages();
                } catch (e) {
                    console.log('原有AI分析未执行或出错:', e);
                }
            }
            
        } catch (error) {
            console.error('深度分析失败:', error);
            hideAnalysisProgress();
            alert('分析过程中出现错误: ' + error.message);
        } finally {
            if (analyzeBtn) {
                analyzeBtn.disabled = false;
                analyzeBtn.innerHTML = '<i class="fas fa-magic"></i> AI 分析';
            }
        }
    };
}

// 显示分析进度
function showAnalysisProgress() {
    const progressSection = document.getElementById('analysis-progress');
    if (progressSection) {
        progressSection.style.display = 'block';
        progressSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 重置进度
    updateProgressPercent(0);
    document.querySelectorAll('.progress-step').forEach(step => {
        step.classList.remove('active', 'completed');
    });
}

// 隐藏分析进度
function hideAnalysisProgress() {
    const progressSection = document.getElementById('analysis-progress');
    if (progressSection) {
        progressSection.style.display = 'none';
    }
}

// 更新进度百分比
function updateProgressPercent(percent) {
    const percentEl = document.getElementById('analysisProgressPercent');
    const fillEl = document.getElementById('analysisProgressFill');
    
    if (percentEl) percentEl.textContent = percent + '%';
    if (fillEl) fillEl.style.width = percent + '%';
}

// 更新进度步骤
function updateProgressStep(stepName, status) {
    const step = document.querySelector(`.progress-step[data-step="${stepName}"]`);
    if (step) {
        step.classList.remove('active', 'completed');
        step.classList.add(status);
        
        // 将之前的步骤标记为完成
        if (status === 'active') {
            const steps = document.querySelectorAll('.progress-step');
            let found = false;
            steps.forEach(s => {
                if (s === step) {
                    found = true;
                } else if (!found) {
                    s.classList.add('completed');
                }
            });
        }
    }
    
    // 更新进度条
    const steps = document.querySelectorAll('.progress-step');
    const completed = document.querySelectorAll('.progress-step.completed').length;
    const active = document.querySelectorAll('.progress-step.active').length;
    const percent = Math.round(((completed + active * 0.5) / steps.length) * 100);
    updateProgressPercent(percent);
}

// 显示深度分析结果
function displayDepthAnalysisResults(report) {
    const section = document.getElementById('depth-analysis');
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 更新综合评分
    const scoreEl = document.getElementById('overallScore');
    const badgeEl = document.getElementById('overallScoreBadge');
    
    if (scoreEl) {
        // 动画显示分数
        animateNumber(scoreEl, 0, report.overall, 1000);
    }
    
    if (badgeEl) {
        const assessment = report.overall >= 80 ? '优秀' : 
                          report.overall >= 60 ? '良好' : '需改进';
        badgeEl.textContent = assessment;
    }
    
    // 绘制雷达图
    drawRadarChart(report.radarData);
    
    // 显示详细指标
    displayMetrics(report.details);
    
    // 显示建议
    displaySuggestions(report.suggestions);
}

// 数字动画
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        
        const current = Math.round(start + (end - start) * easeProgress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// 绘制雷达图
function drawRadarChart(radarData) {
    const canvas = document.getElementById('radarChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const labels = radarData.labels;
    const data = radarData.data;
    const numSides = labels.length;
    const angleStep = (Math.PI * 2) / numSides;
    
    // 绘制网格
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        for (let j = 0; j < numSides; j++) {
            const angle = j * angleStep - Math.PI / 2;
            const r = (radius / 5) * i;
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            
            if (j === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    // 绘制轴线
    for (let i = 0; i < numSides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        // 绘制标签
        const labelX = centerX + Math.cos(angle) * (radius + 25);
        const labelY = centerY + Math.sin(angle) * (radius + 25);
        
        ctx.fillStyle = '#333';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(labels[i], labelX, labelY);
    }
    
    // 绘制数据区域
    ctx.beginPath();
    for (let i = 0; i < numSides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = data[i] / 100;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();
    
    ctx.fillStyle = 'rgba(78, 205, 196, 0.3)';
    ctx.fill();
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制数据点
    for (let i = 0; i < numSides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const value = data[i] / 100;
        const x = centerX + Math.cos(angle) * radius * value;
        const y = centerY + Math.sin(angle) * radius * value;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4ecdc4';
        ctx.fill();
    }
}

// 显示详细指标
function displayMetrics(details) {
    const grid = document.getElementById('analysisMetricsGrid');
    if (!grid) return;
    
    const metrics = [
        { key: 'exposure', title: '曝光', icon: 'fa-sun', class: 'exposure' },
        { key: 'color', title: '色彩', icon: 'fa-palette', class: 'color' },
        { key: 'sharpness', title: '清晰度', icon: 'fa-eye', class: 'sharpness' },
        { key: 'noise', title: '噪点控制', icon: 'fa-grain', class: 'noise' },
        { key: 'contrast', title: '对比度', icon: 'fa-adjust', class: 'contrast' },
        { key: 'dynamicRange', title: '动态范围', icon: 'fa-expand', class: 'dynamic' }
    ];
    
    // 使用 DOM 方法安全地创建指标卡片
    grid.innerHTML = '';
    metrics.forEach(m => {
        const data = details[m.key];
        const scoreClass = data.score >= 80 ? 'high' : data.score >= 60 ? 'medium' : 'low';
        const barClass = data.score >= 80 ? 'high' : data.score >= 60 ? 'medium' : 'low';
        
        let valueText = '';
        if (m.key === 'exposure') valueText = `平均亮度: ${data.average}`;
        else if (m.key === 'color') valueText = `饱和度: ${data.saturation}%`;
        else if (m.key === 'sharpness') valueText = `边缘锐度: ${data.assessment}`;
        else if (m.key === 'noise') valueText = `噪点水平: ${data.assessment}`;
        else if (m.key === 'contrast') valueText = `对比度范围: ${data.range}`;
        else if (m.key === 'dynamicRange') valueText = `动态范围: ${data.stops}档`;
        
        const card = document.createElement('div');
        card.className = `metric-card ${m.class}`;
        card.innerHTML = `
            <div class="metric-header">
                <span class="metric-title"><i class="fas ${m.icon}"></i> ${m.title}</span>
                <span class="metric-score ${scoreClass}">${data.score}</span>
            </div>
            <div class="metric-value">${valueText}</div>
            <div class="metric-bar">
                <div class="metric-bar-fill ${barClass}" style="width: ${data.score}%"></div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 显示建议
function displaySuggestions(suggestions) {
    const list = document.getElementById('suggestionsList');
    if (!list) return;
    
    list.innerHTML = '';
    suggestions.forEach(s => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check-circle"></i> ${s}`;
        list.appendChild(li);
    });
}

// 辅助函数：延迟
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 监听图片加载事件，保存图像数据
document.addEventListener('imageLoaded', function(e) {
    if (e.detail && e.detail.imageData) {
        window.currentImageData = e.detail.imageData;
    }
});

console.log('照片分析增强集成脚本已加载');

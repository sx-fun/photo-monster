/**
 * 批量照片分析模块
 * 支持同时上传和分析最多6张照片
 */

class BatchAnalyzer {
    constructor() {
        this.maxFiles = 6;
        this.selectedFiles = [];
        this.analysisResults = [];
        this.isAnalyzing = false;
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initRuleEngine();
    }
    
    initRuleEngine() {
        if (typeof PhotoRuleEngine !== 'undefined') {
            this.ruleEngine = new PhotoRuleEngine();
            console.log('批量分析器：规则引擎初始化成功');
        } else {
            console.warn('批量分析器：规则引擎未加载');
        }
    }
    
    bindEvents() {
        const dropZone = document.getElementById('batchDropZone');
        const fileInput = document.getElementById('batchFileInput');
        const clearAllBtn = document.getElementById('clearAllBtn');
        const startAnalysisBtn = document.getElementById('startAnalysisBtn');
        const newBatchBtn = document.getElementById('newBatchBtn');
        const exportResultsBtn = document.getElementById('exportResultsBtn');
        
        // 点击上传
        dropZone?.addEventListener('click', () => fileInput?.click());
        
        // 文件选择
        fileInput?.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // 拖拽事件
        dropZone?.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });
        
        dropZone?.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone?.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            this.handleFiles(e.dataTransfer.files);
        });
        
        // 按钮事件
        clearAllBtn?.addEventListener('click', () => this.clearAll());
        startAnalysisBtn?.addEventListener('click', () => this.startAnalysis());
        newBatchBtn?.addEventListener('click', () => this.reset());
        exportResultsBtn?.addEventListener('click', () => this.exportResults());
    }
    
    handleFileSelect(e) {
        this.handleFiles(e.target.files);
    }
    
    handleFiles(files) {
        const validFiles = Array.from(files).filter(file => {
            return file.type.startsWith('image/') || 
                   /\.(jpg|jpeg|png|heic|heif|raw|cr2|nef|arw|dng)$/i.test(file.name);
        });
        
        if (validFiles.length === 0) {
            this.showNotification('请选择有效的图片文件', 'error');
            return;
        }
        
        // 检查总数限制
        const remainingSlots = this.maxFiles - this.selectedFiles.length;
        if (remainingSlots <= 0) {
            this.showNotification(`最多只能选择 ${this.maxFiles} 张照片`, 'warning');
            return;
        }
        
        const filesToAdd = validFiles.slice(0, remainingSlots);
        
        filesToAdd.forEach(file => {
            this.selectedFiles.push({
                file: file,
                id: Date.now() + Math.random(),
                preview: null,
                status: 'pending', // pending, analyzing, completed, error
                result: null
            });
        });
        
        if (validFiles.length > remainingSlots) {
            this.showNotification(`已添加 ${filesToAdd.length} 张，超出限制的 ${validFiles.length - remainingSlots} 张被忽略`, 'warning');
        }
        
        this.generatePreviews();
        this.updateUI();
    }
    
    async generatePreviews() {
        for (const item of this.selectedFiles) {
            if (item.preview) continue;
            
            try {
                item.preview = await this.createPreview(item.file);
            } catch (err) {
                console.error('生成预览失败:', err);
            }
        }
        this.renderPreviewGrid();
    }
    
    createPreview(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    updateUI() {
        const previewSection = document.getElementById('previewSection');
        const selectedCount = document.getElementById('selectedCount');
        
        if (this.selectedFiles.length > 0) {
            previewSection?.classList.add('active');
        } else {
            previewSection?.classList.remove('active');
        }
        
        if (selectedCount) {
            selectedCount.textContent = this.selectedFiles.length;
        }
    }
    
    renderPreviewGrid() {
        const grid = document.getElementById('previewGrid');
        if (!grid) return;
        
        grid.innerHTML = this.selectedFiles.map((item, index) => `
            <div class="batch-preview-item" data-id="${item.id}">
                <button class="batch-preview-remove" onclick="batchAnalyzer.removeFile(${index})" title="移除">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${item.preview || '../images/placeholder.jpg'}" alt="${item.file.name}" class="batch-preview-image">
                <div class="batch-preview-info">
                    <div class="batch-preview-name" title="${item.file.name}">${item.file.name}</div>
                    <div class="batch-preview-status ${item.status}">
                        <i class="fas ${this.getStatusIcon(item.status)}"></i>
                        <span>${this.getStatusText(item.status)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    getStatusIcon(status) {
        const icons = {
            pending: 'fa-clock',
            analyzing: 'fa-spinner fa-spin',
            completed: 'fa-check-circle',
            error: 'fa-exclamation-circle'
        };
        return icons[status] || 'fa-clock';
    }
    
    getStatusText(status) {
        const texts = {
            pending: '等待分析',
            analyzing: '分析中...',
            completed: '已完成',
            error: '分析失败'
        };
        return texts[status] || '等待';
    }
    
    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateUI();
        this.renderPreviewGrid();
    }
    
    clearAll() {
        this.selectedFiles = [];
        this.updateUI();
        this.renderPreviewGrid();
        document.getElementById('batchFileInput').value = '';
    }
    
    async startAnalysis() {
        if (this.selectedFiles.length === 0) {
            this.showNotification('请先选择照片', 'warning');
            return;
        }
        
        if (this.isAnalyzing) return;
        
        this.isAnalyzing = true;
        this.analysisResults = [];
        this.currentIndex = 0;
        
        // 显示进度区域
        document.getElementById('previewSection')?.classList.remove('active');
        document.getElementById('progressSection')?.classList.add('active');
        
        // 初始化分析状态
        this.selectedFiles.forEach(item => {
            item.status = 'pending';
            item.result = null;
        });
        
        this.renderAnalysisGrid();
        this.updateProgress();
        
        // 开始批量分析
        for (let i = 0; i < this.selectedFiles.length; i++) {
            this.currentIndex = i;
            await this.analyzeSingleFile(i);
            this.updateProgress();
        }
        
        // 分析完成
        this.isAnalyzing = false;
        this.showResults();
    }
    
    async analyzeSingleFile(index) {
        const item = this.selectedFiles[index];
        item.status = 'analyzing';
        this.renderAnalysisGrid();
        
        try {
            // 读取 EXIF 数据
            const exifData = await this.readExif(item.file);
            
            // 使用规则引擎分析
            let analysisResult;
            if (this.ruleEngine) {
                analysisResult = this.ruleEngine.fullAnalysis(exifData);
            } else {
                // 基础分析（无规则引擎时）
                analysisResult = this.basicAnalysis(exifData);
            }
            
            // 生成评分
            const score = this.calculateScore(analysisResult);
            
            item.result = {
                exif: exifData,
                analysis: analysisResult,
                score: score,
                highlights: this.extractHighlights(analysisResult),
                timestamp: new Date().toISOString()
            };
            
            item.status = 'completed';
            this.analysisResults.push(item.result);
            
            // 保存到本地存储
            this.saveToHistory(item);
            
        } catch (err) {
            console.error('分析失败:', err);
            item.status = 'error';
            item.error = err.message;
        }
        
        this.renderAnalysisGrid();
    }
    
    readExif(file) {
        return new Promise((resolve) => {
            if (typeof EXIF === 'undefined') {
                resolve({});
                return;
            }
            
            EXIF.getData(file, function() {
                const exif = EXIF.getAllTags(this);
                resolve({
                    camera: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : '未知',
                    lens: exif.LensModel || '未知',
                    focalLength: exif.FocalLength ? `${Math.round(exif.FocalLength)}mm` : '未知',
                    aperture: exif.FNumber ? `f/${exif.FNumber}` : '未知',
                    shutter: exif.ExposureTime ? 
                        (exif.ExposureTime < 1 ? `1/${Math.round(1/exif.ExposureTime)}s` : `${exif.ExposureTime}s`) : '未知',
                    iso: exif.ISOSpeedRatings || '未知',
                    dateTaken: exif.DateTimeOriginal || '未知'
                });
            });
        });
    }
    
    basicAnalysis(exif) {
        // 基础分析（当规则引擎不可用时）
        const suggestions = [];
        
        if (exif.iso && parseInt(exif.iso) > 3200) {
            suggestions.push({ type: 'warning', message: 'ISO 较高，可能存在噪点' });
        }
        if (exif.shutter && exif.shutter.includes('/')) {
            const speed = parseInt(exif.shutter.split('/')[1]);
            if (speed < 60) {
                suggestions.push({ type: 'warning', message: '快门速度较慢，注意防抖' });
            }
        }
        
        return { suggestions };
    }
    
    calculateScore(result) {
        // 从 fullAnalysis 结果中获取评分
        if (result.exifAnalysis?.overall?.percentage !== undefined) {
            return Math.round(result.exifAnalysis.overall.percentage);
        }
        if (result.summary?.score !== undefined) {
            return result.summary.score;
        }
        // 备用评分逻辑
        return 70;
    }
    
    extractHighlights(result) {
        const highlights = [];
        const exif = result.exif || {};
        
        // 添加相机信息
        if (exif.camera && exif.camera !== '未知') {
            highlights.push({ type: 'info', text: exif.camera });
        }
        if (exif.focalLength && exif.focalLength !== '未知') {
            highlights.push({ type: 'info', text: exif.focalLength });
        }
        
        // 从 fullAnalysis 结果中添加拍摄类型
        if (result.primaryType?.name) {
            highlights.push({ type: 'info', text: result.primaryType.name });
        }
        
        // 添加改进建议（最多2条）
        if (result.improvements && result.improvements.length > 0) {
            result.improvements.slice(0, 2).forEach(imp => {
                highlights.push({ type: 'warning', text: imp });
            });
        }
        
        return highlights;
    }
    
    renderAnalysisGrid() {
        const grid = document.getElementById('analysisGrid');
        if (!grid) return;
        
        grid.innerHTML = this.selectedFiles.map((item, index) => `
            <div class="batch-preview-item ${item.status}" data-id="${item.id}">
                <img src="${item.preview}" alt="${item.file.name}" class="batch-preview-image">
                <div class="batch-preview-info">
                    <div class="batch-preview-name">${item.file.name}</div>
                    <div class="batch-preview-status ${item.status}">
                        <i class="fas ${this.getStatusIcon(item.status)}"></i>
                        <span>${this.getStatusText(item.status)}</span>
                    </div>
                    ${item.result ? `
                        <div style="margin-top: 0.5rem; font-size: 1.25rem; font-weight: 700; color: var(--primary-color);">
                            ${item.result.score} 分
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    updateProgress() {
        const completed = this.selectedFiles.filter(i => i.status === 'completed').length;
        const total = this.selectedFiles.length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('remainingCount').textContent = total - completed;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }
    
    showResults() {
        document.getElementById('progressSection')?.classList.remove('active');
        document.getElementById('resultsSection')?.classList.add('active');
        
        // 计算统计
        const completed = this.analysisResults.length;
        const avgScore = completed > 0 
            ? Math.round(this.analysisResults.reduce((sum, r) => sum + r.score, 0) / completed)
            : 0;
        
        document.getElementById('totalAnalyzed').textContent = completed;
        document.getElementById('averageScore').textContent = avgScore;
        
        // 渲染结果卡片
        this.renderResultsGrid();
    }
    
    renderResultsGrid() {
        const grid = document.getElementById('resultsGrid');
        if (!grid) return;
        
        const completedItems = this.selectedFiles.filter(i => i.status === 'completed');
        
        if (completedItems.length === 0) {
            grid.innerHTML = `
                <div class="batch-empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>没有成功分析的照片</p>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = completedItems.map((item, index) => `
            <div class="batch-result-card">
                <img src="${item.preview}" alt="${item.file.name}" class="batch-result-image">
                <div class="batch-result-content">
                    <h4 class="batch-result-title">${item.file.name}</h4>
                    <div class="batch-result-score">
                        <span class="batch-result-score-value">${item.result.score}</span>
                        <span class="batch-result-score-label">分</span>
                    </div>
                    <div class="batch-result-highlights">
                        ${item.result.highlights.slice(0, 3).map(h => `
                            <span class="batch-result-highlight ${h.type}">${h.text}</span>
                        `).join('')}
                    </div>
                    <div class="batch-result-actions">
                        <button class="btn btn-outline" onclick="batchAnalyzer.viewDetail(${index})">
                            <i class="fas fa-eye"></i> 详情
                        </button>
                        <button class="btn btn-primary" onclick="batchAnalyzer.saveSingle(${index})">
                            <i class="fas fa-save"></i> 保存
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    saveToHistory(item) {
        if (!item.result) return;
        
        try {
            // 使用与 app.js 相同的键名
            const history = JSON.parse(localStorage.getItem('photoMonster_analysis_history') || '[]');
            history.unshift({
                id: Date.now() + Math.random(),
                filename: item.file.name,
                preview: item.preview,
                score: item.result.score,
                exif: item.result.exif,
                highlights: item.result.highlights,
                timestamp: item.result.timestamp,
                type: 'batch'
            });
            
            // 只保留最近20条（与 app.js 保持一致）
            if (history.length > 20) {
                history.pop();
            }
            
            localStorage.setItem('photoMonster_analysis_history', JSON.stringify(history));
        } catch (err) {
            console.error('保存历史记录失败:', err);
        }
    }
    
    viewDetail(index) {
        const item = this.selectedFiles.filter(i => i.status === 'completed')[index];
        if (!item) return;
        
        // 构建详情 URL 并跳转
        const params = new URLSearchParams({
            batch: '1',
            filename: item.file.name,
            score: item.result.score,
            exif: JSON.stringify(item.result.exif)
        });
        
        window.open(`photo-analysis.html?${params.toString()}`, '_blank');
    }
    
    saveSingle(index) {
        const item = this.selectedFiles.filter(i => i.status === 'completed')[index];
        if (!item) return;
        
        // 创建下载
        const data = {
            filename: item.file.name,
            score: item.result.score,
            exif: item.result.exif,
            analysis: item.result.analysis,
            timestamp: item.result.timestamp
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analysis_${item.file.name.replace(/\.[^/.]+$/, '')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('分析报告已下载', 'success');
    }
    
    exportResults() {
        if (this.analysisResults.length === 0) {
            this.showNotification('没有可导出的结果', 'warning');
            return;
        }
        
        const exportData = {
            exportDate: new Date().toISOString(),
            totalPhotos: this.selectedFiles.length,
            successful: this.analysisResults.length,
            averageScore: Math.round(this.analysisResults.reduce((sum, r) => sum + r.score, 0) / this.analysisResults.length),
            results: this.selectedFiles.filter(i => i.status === 'completed').map(item => ({
                filename: item.file.name,
                score: item.result.score,
                exif: item.result.exif,
                highlights: item.result.highlights
            }))
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `batch_analysis_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('批量分析报告已导出', 'success');
    }
    
    reset() {
        this.selectedFiles = [];
        this.analysisResults = [];
        this.isAnalyzing = false;
        this.currentIndex = 0;
        
        document.getElementById('resultsSection')?.classList.remove('active');
        document.getElementById('progressSection')?.classList.remove('active');
        document.getElementById('previewSection')?.classList.remove('active');
        document.getElementById('batchFileInput').value = '';
        
        this.updateUI();
        this.renderPreviewGrid();
    }
    
    showNotification(message, type = 'info') {
        // 使用 app.js 中的通知函数（如果可用）
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }
}

// 初始化
let batchAnalyzer;
document.addEventListener('DOMContentLoaded', () => {
    batchAnalyzer = new BatchAnalyzer();
});

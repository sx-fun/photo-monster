/**
 * 分析历史页面模块
 * 展示和管理所有照片分析记录
 */

class HistoryManager {
    constructor() {
        this.history = [];
        this.filteredHistory = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        
        this.init();
    }
    
    init() {
        this.loadHistory();
        this.bindEvents();
        this.updateStats();
        this.render();
    }
    
    loadHistory() {
        try {
            // 使用与 app.js 相同的键名
            const key = 'photoMonster_analysis_history';
            this.history = JSON.parse(localStorage.getItem(key) || '[]');
            
            // 清理旧键名的数据（如果存在）
            if (localStorage.getItem('photoAnalysisHistory')) {
                localStorage.removeItem('photoAnalysisHistory');
            }
            
            this.filteredHistory = [...this.history];
        } catch (err) {
            console.error('加载历史记录失败:', err);
            this.history = [];
            this.filteredHistory = [];
        }
    }
    
    bindEvents() {
        // 搜索
        document.getElementById('searchInput')?.addEventListener('input', (e) => {
            this.filterHistory();
        });
        
        // 类型筛选
        document.getElementById('typeFilter')?.addEventListener('change', () => {
            this.filterHistory();
        });
        
        // 排序
        document.getElementById('sortFilter')?.addEventListener('change', () => {
            this.sortHistory();
        });
        
        // 清空历史
        document.getElementById('clearAllHistory')?.addEventListener('click', () => {
            this.clearAllHistory();
        });
        
        // 分页
        document.getElementById('prevPage')?.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.render();
            }
        });
        
        document.getElementById('nextPage')?.addEventListener('click', () => {
            const totalPages = Math.ceil(this.filteredHistory.length / this.itemsPerPage);
            if (this.currentPage < totalPages) {
                this.currentPage++;
                this.render();
            }
        });
    }
    
    filterHistory() {
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('typeFilter')?.value || 'all';
        
        this.filteredHistory = this.history.filter(item => {
            // 搜索过滤
            const matchesSearch = !searchTerm || 
                item.filename?.toLowerCase().includes(searchTerm) ||
                item.exif?.camera?.toLowerCase().includes(searchTerm);
            
            // 类型过滤
            const matchesType = typeFilter === 'all' || item.type === typeFilter;
            
            return matchesSearch && matchesType;
        });
        
        this.sortHistory();
    }
    
    sortHistory() {
        const sortType = document.getElementById('sortFilter')?.value || 'newest';
        
        switch (sortType) {
            case 'newest':
                this.filteredHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                break;
            case 'oldest':
                this.filteredHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                break;
            case 'score-high':
                this.filteredHistory.sort((a, b) => (b.score || 0) - (a.score || 0));
                break;
            case 'score-low':
                this.filteredHistory.sort((a, b) => (a.score || 0) - (b.score || 0));
                break;
        }
        
        this.currentPage = 1;
        this.render();
    }
    
    updateStats() {
        const totalCount = this.history.length;
        const avgScore = totalCount > 0 
            ? Math.round(this.history.reduce((sum, item) => sum + (item.score || 0), 0) / totalCount)
            : 0;
        
        // 计算本月分析数
        const now = new Date();
        const thisMonth = this.history.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate.getMonth() === now.getMonth() && 
                   itemDate.getFullYear() === now.getFullYear();
        }).length;
        
        document.getElementById('totalCount').textContent = totalCount;
        document.getElementById('avgScore').textContent = avgScore;
        document.getElementById('thisMonth').textContent = thisMonth;
    }
    
    render() {
        const grid = document.getElementById('historyGrid');
        const emptyState = document.getElementById('emptyState');
        const pagination = document.getElementById('pagination');
        
        if (!grid) return;
        
        if (this.filteredHistory.length === 0) {
            grid.innerHTML = '';
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            pagination.style.display = 'none';
            return;
        }
        
        grid.style.display = 'grid';
        emptyState.style.display = 'none';
        
        // 分页
        const totalPages = Math.ceil(this.filteredHistory.length / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageItems = this.filteredHistory.slice(start, end);
        
        // 渲染卡片
        grid.innerHTML = pageItems.map(item => this.createHistoryCard(item)).join('');
        
        // 更新分页
        if (totalPages > 1) {
            pagination.style.display = 'flex';
            document.getElementById('currentPage').textContent = this.currentPage;
            document.getElementById('totalPages').textContent = totalPages;
            document.getElementById('prevPage').disabled = this.currentPage === 1;
            document.getElementById('nextPage').disabled = this.currentPage === totalPages;
        } else {
            pagination.style.display = 'none';
        }
    }
    
    createHistoryCard(item) {
        const date = new Date(item.timestamp);
        const dateStr = date.toLocaleDateString('zh-CN');
        const timeStr = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        
        const typeLabel = item.type === 'batch' ? '批量' : '单张';
        const typeClass = item.type === 'batch' ? 'batch' : '';
        
        return `
            <div class="history-card" data-id="${item.id}">
                <button class="history-card-delete" onclick="historyManager.deleteItem('${item.id}')" title="删除">
                    <i class="fas fa-times"></i>
                </button>
                <img src="${item.preview || '../images/placeholder.jpg'}" 
                     alt="${item.filename}" 
                     class="history-card-image"
                     onerror="this.src='../images/placeholder.jpg'">
                <div class="history-card-content">
                    <div class="history-card-header">
                        <h4 class="history-card-title" title="${item.filename}">${item.filename}</h4>
                        <span class="history-card-type ${typeClass}">${typeLabel}</span>
                    </div>
                    <div class="history-card-score">
                        <span class="history-card-score-value">${item.score || 0}</span>
                        <span class="history-card-score-label">分</span>
                    </div>
                    <div class="history-card-meta">
                        <span class="history-card-meta-item">
                            <i class="fas fa-calendar"></i> ${dateStr}
                        </span>
                        <span class="history-card-meta-item">
                            <i class="fas fa-clock"></i> ${timeStr}
                        </span>
                        ${item.exif?.camera ? `
                            <span class="history-card-meta-item" title="${item.exif.camera}">
                                <i class="fas fa-camera"></i> ${this.truncate(item.exif.camera, 15)}
                            </span>
                        ` : ''}
                    </div>
                    ${item.highlights?.length ? `
                        <div class="history-card-highlights">
                            ${item.highlights.slice(0, 3).map(h => `
                                <span class="history-card-highlight ${h.type}">${this.truncate(h.text, 20)}</span>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="history-card-actions">
                        <button class="btn btn-outline" onclick="historyManager.viewDetail('${item.id}')">
                            <i class="fas fa-eye"></i> 查看
                        </button>
                        <button class="btn btn-primary" onclick="historyManager.downloadReport('${item.id}')">
                            <i class="fas fa-download"></i> 报告
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    truncate(str, maxLength) {
        if (!str) return '';
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    }
    
    deleteItem(id) {
        if (!confirm('确定要删除这条分析记录吗？')) return;
        
        this.history = this.history.filter(item => item.id != id);
        this.saveHistory();
        this.filterHistory();
        this.updateStats();
        
        this.showNotification('记录已删除', 'success');
    }
    
    clearAllHistory() {
        if (!confirm('确定要清空所有分析记录吗？此操作不可恢复。')) return;
        
        this.history = [];
        this.filteredHistory = [];
        this.saveHistory();
        this.updateStats();
        this.render();
        
        this.showNotification('历史记录已清空', 'success');
    }
    
    saveHistory() {
        try {
            localStorage.setItem('photoMonster_analysis_history', JSON.stringify(this.history));
        } catch (err) {
            console.error('保存历史记录失败:', err);
        }
    }
    
    viewDetail(id) {
        const item = this.history.find(h => h.id == id);
        if (!item) return;
        
        // 跳转到照片分析页面查看详情
        const params = new URLSearchParams({
            history: '1',
            id: id
        });
        
        window.location.href = `photo-analysis.html?${params.toString()}`;
    }
    
    downloadReport(id) {
        const item = this.history.find(h => h.id == id);
        if (!item) return;
        
        const reportData = {
            filename: item.filename,
            score: item.score,
            exif: item.exif,
            highlights: item.highlights,
            analysisDate: item.timestamp,
            type: item.type
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report_${item.filename.replace(/\.[^/.]+$/, '')}_${new Date(item.timestamp).toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('报告已下载', 'success');
    }
    
    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }
}

// 初始化
let historyManager;
document.addEventListener('DOMContentLoaded', () => {
    historyManager = new HistoryManager();
});

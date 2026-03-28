/**
 * Photo Monster 收藏管理功能
 * Favorites Manager Module
 * 
 * 阶段二：收藏系统
 */

class FavoritesManager {
    constructor() {
        this.currentCategory = 'all';
        this.selectedItems = new Set();
        this.favorites = this.loadFavorites();
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
    }

    // 从 localStorage 加载收藏
    loadFavorites() {
        try {
            const data = localStorage.getItem('photoMonster_favorites');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('加载收藏失败:', e);
            return [];
        }
    }

    // 保存收藏到 localStorage
    saveFavorites() {
        try {
            localStorage.setItem('photoMonster_favorites', JSON.stringify(this.favorites));
        } catch (e) {
            console.error('保存收藏失败:', e);
        }
    }

    // 添加收藏（供其他页面调用）
    addFavorite(item) {
        // 检查是否已存在
        const exists = this.favorites.some(f => 
            f.type === item.type && f.id === item.id
        );
        
        if (exists) {
            return { success: false, message: '该内容已在收藏中' };
        }
        
        // 添加时间戳
        item.createdAt = new Date().toISOString();
        
        this.favorites.push(item);
        this.saveFavorites();
        
        return { success: true, message: '收藏成功' };
    }

    // 移除收藏
    removeFavorite(type, id) {
        const index = this.favorites.findIndex(f => f.type === type && f.id === id);
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.saveFavorites();
            this.render();
            return true;
        }
        return false;
    }

    // 检查是否已收藏
    isFavorited(type, id) {
        return this.favorites.some(f => f.type === type && f.id === id);
    }

    // 绑定事件
    bindEvents() {
        // 分类标签切换
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.currentCategory = e.currentTarget.dataset.category;
                this.selectedItems.clear();
                this.updateBatchActions();
                this.render();
            });
        });
    }

    // 获取过滤后的收藏列表
    getFilteredFavorites() {
        if (this.currentCategory === 'all') {
            return this.favorites;
        }
        return this.favorites.filter(f => f.type === this.currentCategory);
    }

    // 渲染收藏列表
    render() {
        const grid = document.getElementById('favoritesGrid');
        const emptyState = document.getElementById('emptyState');
        const filtered = this.getFilteredFavorites();

        // 更新计数
        this.updateCounts();

        // 显示/隐藏空状态
        if (filtered.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';

        // 渲染卡片
        grid.innerHTML = filtered.map(item => this.renderCard(item)).join('');

        // 绑定卡片事件
        this.bindCardEvents();
    }

    // 渲染单个收藏卡片
    renderCard(item) {
        const typeConfig = {
            plan: { icon: 'fa-lightbulb', label: '拍摄方案', class: 'plan' },
            combo: { icon: 'fa-box-open', label: '器材套装', class: 'combo' },
            knowledge: { icon: 'fa-book', label: '知识内容', class: 'knowledge' }
        };

        const config = typeConfig[item.type] || typeConfig.plan;
        const date = new Date(item.createdAt).toLocaleDateString('zh-CN');
        const isSelected = this.selectedItems.has(`${item.type}-${item.id}`);

        let desc = item.description || '';
        let price = '';

        if (item.type === 'plan') {
            desc = item.scenario || '自定义拍摄方案';
        } else if (item.type === 'combo') {
            desc = `${item.camera} + ${item.lens}`;
            price = `¥${item.totalPrice?.toLocaleString() || '未知'}`;
        }

        return `
            <div class="favorite-card ${isSelected ? 'selected' : ''}" data-type="${item.type}" data-id="${item.id}">
                <div class="card-header">
                    <span class="card-type ${config.class}">
                        <i class="fas ${config.icon}"></i>
                        ${config.label}
                    </span>
                    <div class="card-actions">
                        <button class="action-btn" onclick="favoritesManager.toggleSelect('${item.type}', '${item.id}')" title="选择">
                            <i class="fas ${isSelected ? 'fa-check-square' : 'fa-square'}"></i>
                        </button>
                        <button class="action-btn" onclick="favoritesManager.viewDetail('${item.type}', '${item.id}')" title="查看">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete" onclick="favoritesManager.deleteItem('${item.type}', '${item.id}')" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <h4 class="card-title">${item.title}</h4>
                <p class="card-desc">${desc}</p>
                <div class="card-meta">
                    <span class="card-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${date}
                    </span>
                    ${price ? `<span class="card-price">${price}</span>` : ''}
                </div>
            </div>
        `;
    }

    // 绑定卡片事件
    bindCardEvents() {
        // 卡片点击事件已在 renderCard 中使用 onclick 绑定
    }

    // 更新各类别计数
    updateCounts() {
        const counts = {
            all: this.favorites.length,
            plan: this.favorites.filter(f => f.type === 'plan').length,
            combo: this.favorites.filter(f => f.type === 'combo').length,
            knowledge: this.favorites.filter(f => f.type === 'knowledge').length
        };

        Object.entries(counts).forEach(([key, count]) => {
            const el = document.getElementById(`count-${key}`);
            if (el) el.textContent = count;
        });
    }

    // 切换选择状态
    toggleSelect(type, id) {
        const key = `${type}-${id}`;
        if (this.selectedItems.has(key)) {
            this.selectedItems.delete(key);
        } else {
            this.selectedItems.add(key);
        }
        this.render();
        this.updateBatchActions();
    }

    // 更新批量操作栏
    updateBatchActions() {
        const batchActions = document.getElementById('batchActions');
        const selectedCount = document.getElementById('selectedCount');
        
        if (this.selectedItems.size > 0) {
            batchActions.classList.add('active');
            selectedCount.textContent = this.selectedItems.size;
        } else {
            batchActions.classList.remove('active');
        }
    }

    // 查看详情
    viewDetail(type, id) {
        const item = this.favorites.find(f => f.type === type && f.id === id);
        if (!item) return;

        if (type === 'plan') {
            // 存储当前方案到 sessionStorage，跳转到方案规划页面
            sessionStorage.setItem('photoMonster_viewPlan', JSON.stringify(item));
            window.location.href = 'planner.html?view=' + id;
        } else if (type === 'combo') {
            // 存储套装信息，跳转到套装推荐页面
            sessionStorage.setItem('photoMonster_viewCombo', JSON.stringify(item));
            window.location.href = 'gear-guide.html?view=' + id;
        }
    }

    // 删除单个项目
    deleteItem(type, id) {
        if (!confirm('确定要删除这个收藏吗？')) return;
        
        this.removeFavorite(type, id);
        this.selectedItems.delete(`${type}-${id}`);
        this.updateBatchActions();
    }

    // 删除选中的项目
    deleteSelected() {
        if (!confirm(`确定要删除选中的 ${this.selectedItems.size} 个项目吗？`)) return;

        this.selectedItems.forEach(key => {
            const [type, id] = key.split('-');
            this.removeFavorite(type, id);
        });

        this.selectedItems.clear();
        this.updateBatchActions();
    }

    // 导出选中的项目
    exportSelected() {
        const selected = this.favorites.filter(f => 
            this.selectedItems.has(`${f.type}-${f.id}`)
        );

        if (selected.length === 0) {
            alert('请先选择要导出的项目');
            return;
        }

        const data = {
            exportDate: new Date().toISOString(),
            items: selected
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `photo-monster-favorites-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// 初始化
let favoritesManager;
document.addEventListener('DOMContentLoaded', () => {
    favoritesManager = new FavoritesManager();
});

// 全局函数供其他页面调用
window.PhotoMonsterFavorites = {
    // 添加收藏
    add: (item) => {
        if (!favoritesManager) {
            console.error('收藏管理器未初始化');
            return { success: false, message: '系统错误' };
        }
        return favoritesManager.addFavorite(item);
    },
    
    // 检查是否已收藏
    isFavorited: (type, id) => {
        if (!favoritesManager) return false;
        return favoritesManager.isFavorited(type, id);
    },
    
    // 移除收藏
    remove: (type, id) => {
        if (!favoritesManager) return false;
        return favoritesManager.removeFavorite(type, id);
    }
};
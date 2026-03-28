// Photo Monster - 阅读进度追踪器
// 记录用户在知识库的阅读进度

class ProgressTracker {
    constructor() {
        this.storageKey = 'photo-monster-progress';
        this.progress = this.loadProgress();
    }

    // 加载保存的进度
    loadProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    // 保存进度
    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    }

    // 标记文章为已读
    markAsRead(articleId) {
        if (!this.progress[articleId]) {
            this.progress[articleId] = {
                read: true,
                readAt: new Date().toISOString(),
                readCount: 1
            };
        } else {
            this.progress[articleId].read = true;
            this.progress[articleId].readAt = new Date().toISOString();
            this.progress[articleId].readCount++;
        }
        this.saveProgress();
    }

    // 检查是否已读
    isRead(articleId) {
        return this.progress[articleId]?.read || false;
    }

    // 获取阅读统计
    getStats() {
        const articles = Object.keys(this.progress);
        return {
            totalRead: articles.length,
            recentlyRead: articles
                .filter(id => this.progress[id].readAt)
                .sort((a, b) => new Date(this.progress[b].readAt) - new Date(this.progress[a].readAt))
                .slice(0, 5)
        };
    }

    // 获取阅读进度百分比
    getProgressPercentage(totalArticles) {
        const readCount = Object.keys(this.progress).length;
        return Math.round((readCount / totalArticles) * 100);
    }

    // 清除所有进度
    clearProgress() {
        this.progress = {};
        localStorage.removeItem(this.storageKey);
    }

    // 在知识卡片上显示已读标记
    updateKnowledgeCards() {
        document.querySelectorAll('.knowledge-card').forEach(card => {
            const links = card.querySelectorAll('a[data-topic]');
            links.forEach(link => {
                const topic = link.getAttribute('data-topic');
                if (this.isRead(topic)) {
                    link.classList.add('read');
                    if (!link.querySelector('.read-indicator')) {
                        const indicator = document.createElement('i');
                        indicator.className = 'fas fa-check read-indicator';
                        indicator.style.marginLeft = '8px';
                        indicator.style.color = 'var(--success-color)';
                        link.appendChild(indicator);
                    }
                }
            });
        });
    }

    // 创建进度显示组件
    createProgressWidget(container) {
        const widget = document.createElement('div');
        widget.className = 'progress-widget';
        widget.innerHTML = `
            <div class="progress-header">
                <i class="fas fa-chart-pie"></i>
                <span>学习进度</span>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
            <div class="progress-text">已读 0 / 24 个专题</div>
        `;

        if (container) {
            container.appendChild(widget);
        }

        this.updateProgressWidget(widget);
        return widget;
    }

    updateProgressWidget(widget) {
        const totalArticles = 24; // 知识库总数
        const readCount = Object.keys(this.progress).length;
        const percentage = this.getProgressPercentage(totalArticles);

        const bar = widget.querySelector('.progress-bar');
        const text = widget.querySelector('.progress-text');

        if (bar) bar.style.width = `${percentage}%`;
        if (text) text.textContent = `已读 ${readCount} / ${totalArticles} 个专题`;
    }
}

// 初始化
const progressTracker = new ProgressTracker();

// 导出
if (typeof window !== 'undefined') {
    window.progressTracker = progressTracker;
}

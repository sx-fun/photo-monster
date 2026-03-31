/**
 * Photo Monster 移动端底部 Tab 导航栏
 * 固定在底部，提供常用功能的快速入口
 */

class MobileTabBar {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.init();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    // Tab 配置
    getTabs() {
        const isInPages = window.location.pathname.includes('/pages/');
        const prefix = isInPages ? '' : 'pages/';
        const homePrefix = isInPages ? '../' : '';

        return [
            {
                id: 'home',
                title: '首页',
                icon: 'fa-home',
                href: homePrefix + 'index.html',
                activePages: ['index', '']
            },
            {
                id: 'analysis',
                title: '分析',
                icon: 'fa-camera',
                href: prefix + 'photo-analysis.html',
                activePages: ['photo-analysis', 'batch-analysis']
            },
            {
                id: 'gear',
                title: '器材',
                icon: 'fa-sliders-h',
                href: prefix + 'gear-guide.html',
                activePages: ['gear-guide', 'gear-compare']
            },
            {
                id: 'learn',
                title: '学习',
                icon: 'fa-graduation-cap',
                href: prefix + 'learning-path.html',
                activePages: ['learning-path', 'daily-practice', 'knowledge']
            },
            {
                id: 'profile',
                title: '我的',
                icon: 'fa-user',
                href: prefix + 'history.html',
                activePages: ['history', 'favorites', 'profile']
            }
        ];
    }

    isActive(tab) {
        return tab.activePages.includes(this.currentPage);
    }

    init() {
        // 只在移动端显示（屏幕宽度小于768px）
        if (window.innerWidth >= 768) return;
        
        this.render();
        this.bindEvents();
    }

    render() {
        // 避免重复渲染
        if (document.getElementById('mobile-tab-bar')) return;

        const tabs = this.getTabs();
        const tabBar = document.createElement('div');
        tabBar.id = 'mobile-tab-bar';
        tabBar.className = 'mobile-tab-bar';
        
        tabBar.innerHTML = `
            <div class="mobile-tab-container">
                ${tabs.map(tab => `
                    <a href="${tab.href}" class="mobile-tab-item ${this.isActive(tab) ? 'active' : ''}" data-tab="${tab.id}">
                        <div class="tab-icon">
                            <i class="fas ${tab.icon}"></i>
                        </div>
                        <span class="tab-title">${tab.title}</span>
                    </a>
                `).join('')}
            </div>
            <!-- 安全区域占位（适配iPhone刘海屏） -->
            <div class="safe-area-bottom"></div>
        `;

        document.body.appendChild(tabBar);
        
        // 为 body 添加底部 padding，避免内容被 tab 栏遮挡
        document.body.classList.add('has-mobile-tab');
    }

    bindEvents() {
        // 处理窗口大小变化
        window.addEventListener('resize', () => {
            const tabBar = document.getElementById('mobile-tab-bar');
            if (window.innerWidth >= 768) {
                if (tabBar) {
                    tabBar.remove();
                    document.body.classList.remove('has-mobile-tab');
                }
            } else {
                if (!tabBar) {
                    this.render();
                }
            }
        });

        // 点击动画效果
        const tabBar = document.getElementById('mobile-tab-bar');
        if (tabBar) {
            tabBar.addEventListener('click', (e) => {
                const item = e.target.closest('.mobile-tab-item');
                if (item) {
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.transform = '';
                    }, 150);
                }
            });
        }
    }
}

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    new MobileTabBar();
});

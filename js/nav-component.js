/**
 * Photo Monster 统一导航栏组件
 * 支持桌面端下拉菜单和移动端抽屉菜单
 */

class NavComponent {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.init();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    init() {
        this.renderNav();
        this.bindEvents();
    }

    // 导航数据结构
    getNavStructure() {
        return {
            main: [
                {
                    id: 'tools',
                    title: '工具',
                    icon: 'fa-tools',
                    items: [
                        { id: 'photo-analysis', title: '照片分析', icon: 'fa-camera', href: 'pages/photo-analysis.html' },
                        { id: 'batch-analysis', title: '批量处理', icon: 'fa-images', href: 'pages/batch-analysis.html' },
                        { id: 'history', title: '分析历史', icon: 'fa-history', href: 'pages/history.html' }
                    ]
                },
                {
                    id: 'learn',
                    title: '学习',
                    icon: 'fa-graduation-cap',
                    items: [
                        { id: 'knowledge', title: '知识库', icon: 'fa-book', href: 'pages/knowledge.html' },
                        { id: 'learning-path', title: '学习路径', icon: 'fa-route', href: 'pages/learning-path.html' },
                        { id: 'daily-practice', title: '每日一练', icon: 'fa-calendar-day', href: 'pages/daily-practice.html' }
                    ]
                },
                {
                    id: 'plan',
                    title: '规划',
                    icon: 'fa-compass',
                    items: [
                        { id: 'planner', title: '方案规划', icon: 'fa-clipboard-list', href: 'pages/planner.html' },
                        { id: 'gear-guide', title: '套装推荐', icon: 'fa-sliders-h', href: 'pages/gear-guide.html' },
                        { id: 'gear-compare', title: '器材对比', icon: 'fa-balance-scale', href: 'pages/gear-compare.html' }
                    ]
                }
            ],
            secondary: [
                {
                    id: 'settings',
                    title: '',
                    icon: 'fa-cog',
                    items: [
                        { id: 'ai-config', title: 'AI配置', icon: 'fa-robot', href: 'pages/ai-config.html' },
                        { id: 'about', title: '关于我们', icon: 'fa-info-circle', href: 'pages/about.html' },
                        { id: 'privacy', title: '隐私政策', icon: 'fa-shield-alt', href: 'pages/privacy.html' }
                    ]
                },
                {
                    id: 'profile',
                    title: '',
                    icon: 'fa-user',
                    items: [
                        { id: 'profile-page', title: '个人主页', icon: 'fa-id-card', href: 'pages/profile.html', disabled: true },
                        { id: 'favorites', title: '我的收藏', icon: 'fa-star', href: 'pages/favorites.html' },
                        { id: 'my-history', title: '分析历史', icon: 'fa-history', href: 'pages/history.html' }
                    ]
                }
            ]
        };
    }

    // 判断是否为当前页面
    isActive(item) {
        const itemPage = item.href.replace('pages/', '').replace('.html', '');
        return this.currentPage === itemPage || 
               (this.currentPage === 'index' && itemPage === 'photo-analysis');
    }

    // 判断是否为当前分类
    isActiveCategory(category) {
        return category.items.some(item => this.isActive(item));
    }

    // 获取正确的链接路径
    getHref(href) {
        const isInPages = window.location.pathname.includes('/pages/');
        if (isInPages) {
            // 在pages目录下，相对路径
            return href.replace('pages/', '');
        }
        // 在根目录下
        return href;
    }

    // 渲染导航栏
    renderNav() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;

        const structure = this.getNavStructure();
        const isInPages = window.location.pathname.includes('/pages/');
        const homeHref = isInPages ? '../index.html' : 'index.html';

        nav.innerHTML = `
            <div class="nav-container">
                <!-- Logo -->
                <a href="${homeHref}" class="nav-logo">
                    <i class="fas fa-camera-retro"></i>
                    <span>Photo Monster</span>
                </a>
                
                <!-- 桌面端导航 -->
                <ul class="nav-menu desktop-nav">
                    ${structure.main.map(cat => this.renderCategory(cat)).join('')}
                    <li class="nav-separator"></li>
                    ${structure.secondary.map(cat => this.renderIconCategory(cat)).join('')}
                </ul>
                
                <!-- 移动端汉堡按钮 -->
                <button class="hamburger" aria-label="菜单">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            
            <!-- 移动端抽屉菜单 -->
            <div class="mobile-drawer" id="mobileDrawer">
                <div class="drawer-header">
                    <span class="drawer-title">菜单</span>
                    <button class="drawer-close" aria-label="关闭">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="drawer-content">
                    ${this.renderMobileMenu(structure)}
                </div>
            </div>
            
            <!-- 遮罩层 -->
            <div class="drawer-overlay" id="drawerOverlay"></div>
        `;
    }

    // 渲染主导航分类
    renderCategory(category) {
        const isActive = this.isActiveCategory(category);
        return `
            <li class="nav-item has-dropdown ${isActive ? 'active' : ''}">
                <a href="#" class="nav-link" data-category="${category.id}">
                    <i class="fas ${category.icon}"></i>
                    <span>${category.title}</span>
                    <i class="fas fa-chevron-down dropdown-arrow"></i>
                </a>
                <ul class="dropdown-menu">
                    ${category.items.map(item => this.renderDropdownItem(item)).join('')}
                </ul>
            </li>
        `;
    }

    // 渲染图标分类（设置、我的）
    renderIconCategory(category) {
        const isActive = this.isActiveCategory(category);
        return `
            <li class="nav-item has-dropdown icon-only ${isActive ? 'active' : ''}">
                <a href="#" class="nav-link" data-category="${category.id}">
                    <i class="fas ${category.icon}"></i>
                </a>
                <ul class="dropdown-menu">
                    ${category.items.map(item => this.renderDropdownItem(item)).join('')}
                </ul>
            </li>
        `;
    }

    // 渲染下拉菜单项
    renderDropdownItem(item) {
        if (item.disabled) {
            return `
                <li class="dropdown-item disabled" onclick="NavComponent.showNicknameModal()">
                    <span class="item-link" style="cursor: pointer;">
                        <i class="fas ${item.icon}"></i>
                        <span>${item.title}</span>
                        <span class="coming-soon">即将上线</span>
                    </span>
                </li>
            `;
        }
        const isActive = this.isActive(item);
        const href = this.getHref(item.href);
        return `
            <li class="dropdown-item ${isActive ? 'active' : ''}">
                <a href="${href}" class="item-link">
                    <i class="fas ${item.icon}"></i>
                    <span>${item.title}</span>
                </a>
            </li>
        `;
    }

    // 渲染移动端菜单
    renderMobileMenu(structure) {
        const allCategories = [...structure.main, ...structure.secondary];
        return allCategories.map(cat => `
            <div class="mobile-category">
                <div class="mobile-category-header">
                    <i class="fas ${cat.icon}"></i>
                    <span>${cat.title || (cat.id === 'settings' ? '设置' : '我的')}</span>
                    <i class="fas fa-chevron-right"></i>
                </div>
                <ul class="mobile-category-items">
                    ${cat.items.map(item => this.renderMobileItem(item)).join('')}
                </ul>
            </div>
        `).join('');
    }

    // 渲染移动端菜单项
    renderMobileItem(item) {
        if (item.disabled) {
            return `
                <li class="mobile-item disabled" onclick="NavComponent.showNicknameModal()">
                    <span style="cursor: pointer;">
                        <i class="fas ${item.icon}"></i>
                        ${item.title}
                    </span>
                    <span class="badge">即将上线</span>
                </li>
            `;
        }
        const isActive = this.isActive(item);
        const href = this.getHref(item.href);
        return `
            <li class="mobile-item ${isActive ? 'active' : ''}">
                <a href="${href}">
                    <i class="fas ${item.icon}"></i>
                    ${item.title}
                </a>
            </li>
        `;
    }

    // 更新导航栏用户显示
    updateProfileDisplay() {
        const nickname = localStorage.getItem('pm_nickname');
        const profileIcon = document.querySelector('.nav-item.has-dropdown.icon-only .fa-user');
        if (profileIcon && nickname) {
            // 如果有昵称，在图标旁显示
            const parent = profileIcon.closest('.nav-link');
            let nicknameSpan = parent.querySelector('.nav-nickname');
            if (!nicknameSpan) {
                nicknameSpan = document.createElement('span');
                nicknameSpan.className = 'nav-nickname';
                parent.appendChild(nicknameSpan);
            }
            nicknameSpan.textContent = nickname;
        }
    }

    // 绑定事件
    bindEvents() {
        // 桌面端下拉菜单
        const dropdowns = document.querySelectorAll('.nav-item.has-dropdown');
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('.nav-link');
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // 关闭其他下拉
                dropdowns.forEach(d => {
                    if (d !== dropdown) d.classList.remove('open');
                });
                // 切换当前下拉
                dropdown.classList.toggle('open');
            });
        });

        // 点击外部关闭下拉
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item.has-dropdown')) {
                dropdowns.forEach(d => d.classList.remove('open'));
            }
        });

        // 移动端菜单
        const hamburger = document.querySelector('.hamburger');
        const drawer = document.getElementById('mobileDrawer');
        const overlay = document.getElementById('drawerOverlay');
        const closeBtn = document.querySelector('.drawer-close');

        if (hamburger && drawer && overlay) {
            hamburger.addEventListener('click', () => {
                drawer.classList.add('open');
                overlay.classList.add('show');
                document.body.style.overflow = 'hidden';
            });

            const closeDrawer = () => {
                drawer.classList.remove('open');
                overlay.classList.remove('show');
                document.body.style.overflow = '';
            };

            closeBtn?.addEventListener('click', closeDrawer);
            overlay.addEventListener('click', closeDrawer);

            // 移动端分类展开
            const mobileHeaders = drawer.querySelectorAll('.mobile-category-header');
            mobileHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const category = header.parentElement;
                    category.classList.toggle('expanded');
                });
            });
        }
        
        // 初始化昵称显示
        this.updateProfileDisplay();
    }
}

// 静态方法：显示昵称设置弹窗
NavComponent.showNicknameModal = function() {
    const currentNickname = localStorage.getItem('pm_nickname') || '';
    
    // 创建弹窗
    const modal = document.createElement('div');
    modal.className = 'nickname-modal';
    modal.innerHTML = `
        <div class="nickname-modal-overlay" onclick="NavComponent.closeNicknameModal()"></div>
        <div class="nickname-modal-content">
            <h3>设置昵称</h3>
            <p>设置一个昵称，用于在 Photo Monster 中展示</p>
            <input type="text" id="nicknameInput" placeholder="输入昵称（2-20字）" value="${currentNickname}" maxlength="20">
            <div class="nickname-modal-buttons">
                <button class="btn-secondary" onclick="NavComponent.closeNicknameModal()">取消</button>
                <button class="btn-primary" onclick="NavComponent.saveNickname()">保存</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('nicknameInput').focus();
};

// 静态方法：关闭弹窗
NavComponent.closeNicknameModal = function() {
    const modal = document.querySelector('.nickname-modal');
    if (modal) modal.remove();
};

// 静态方法：保存昵称
NavComponent.saveNickname = function() {
    const input = document.getElementById('nicknameInput');
    const nickname = input.value.trim();
    
    if (nickname.length < 2) {
        alert('昵称至少需要2个字符');
        return;
    }
    
    localStorage.setItem('pm_nickname', nickname);
    NavComponent.closeNicknameModal();
    
    // 刷新导航栏显示
    const nav = new NavComponent();
    nav.updateProfileDisplay();
    
    alert('昵称设置成功！');
};

// 自动初始化
document.addEventListener('DOMContentLoaded', () => {
    new NavComponent();
    initStickyNavbar();
});

// 粘性导航栏滚动效果
function initStickyNavbar() {
    const navbar = document.getElementById('main-nav');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;
        
        // 滚动超过50px时添加scrolled类
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 向下滚动超过100px且滚动距离大于上次时隐藏导航栏
        if (scrollY > 100 && scrollY > lastScrollY) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

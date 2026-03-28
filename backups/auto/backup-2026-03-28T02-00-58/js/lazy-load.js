/**
 * Lazy Loading Module
 * 使用 IntersectionObserver 实现图片懒加载
 */

(function() {
    'use strict';

    /**
     * 懒加载管理器
     */
    class LazyLoadManager {
        constructor() {
            this.observer = null;
            this.options = {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            };
            this._init();
        }

        /**
         * 初始化 IntersectionObserver
         */
        _init() {
            if (!('IntersectionObserver' in window)) {
                // 降级处理：直接加载所有图片
                this._fallbackLoad();
                return;
            }

            this.observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this._loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, this.options);
        }

        /**
         * 降级方案：直接加载所有图片
         */
        _fallbackLoad() {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                this._loadImage(img);
            });
        }

        /**
         * 加载图片
         * @param {HTMLElement} img - 图片元素
         */
        _loadImage(img) {
            const src = img.dataset.src;
            if (!src) return;

            // 添加加载中状态
            img.classList.add('lazy-loading');

            // 创建临时图片来预加载
            const tempImg = new Image();
            
            tempImg.onload = () => {
                img.src = src;
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-loaded');
                // 移除 data-src 属性
                img.removeAttribute('data-src');
            };

            tempImg.onerror = () => {
                img.classList.remove('lazy-loading');
                img.classList.add('lazy-error');
                console.warn('图片加载失败:', src);
            };

            tempImg.src = src;
        }

        /**
         * 观察元素
         * @param {string|HTMLElement|NodeList} selector - 选择器或元素
         */
        observe(selector) {
            let elements;
            
            if (typeof selector === 'string') {
                elements = document.querySelectorAll(selector);
            } else if (selector instanceof NodeList) {
                elements = selector;
            } else if (selector instanceof HTMLElement) {
                elements = [selector];
            } else {
                console.warn('LazyLoadManager: 无效的selector参数');
                return;
            }

            elements.forEach(el => {
                // 只观察 img 元素
                if (el.tagName === 'IMG') {
                    this.observer?.observe(el);
                } else {
                    // 观察容器内的所有图片
                    const images = el.querySelectorAll('img');
                    images.forEach(img => this.observer?.observe(img));
                }
            });
        }

        /**
         * 停止观察元素
         * @param {string|HTMLElement|NodeList} selector
         */
        unobserve(selector) {
            let elements;
            
            if (typeof selector === 'string') {
                elements = document.querySelectorAll(selector);
            } else if (selector instanceof NodeList) {
                elements = selector;
            } else if (selector instanceof HTMLElement) {
                elements = [selector];
            }

            elements?.forEach(el => {
                this.observer?.unobserve(el);
            });
        }

        /**
         * 销毁观察器
         */
        destroy() {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        }
    }

    /**
     * 初始化懒加载
     * @param {Object} options - 配置选项
     * @param {string} options.selector - 要观察的容器选择器，默认 '.lazy-container'
     * @param {string} options.rootMargin - 边界距离，默认 '50px'
     * @param {number} options.threshold - 阈值，默认 0.1
     */
    function initLazyLoad(options = {}) {
        const manager = new LazyLoadManager();
        
        if (options.rootMargin) {
            manager.options.rootMargin = options.rootMargin;
        }
        if (options.threshold) {
            manager.options.threshold = options.threshold;
        }

        // 观察指定容器内的图片
        const selector = options.selector || '.lazy-container';
        
        // 等待 DOM 准备就绪后开始观察
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                manager.observe(selector);
            });
        } else {
            manager.observe(selector);
        }

        return manager;
    }

    // 导出到全局
    window.LazyLoadManager = LazyLoadManager;
    window.initLazyLoad = initLazyLoad;

})();
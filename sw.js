// Photo Monster - Service Worker
// 实现离线缓存功能 - Network First 策略
// 版本从 update-config.json 读取，确保与内容版本同步

const CACHE_VERSION = 'v48';
const CACHE_NAME = `photo-monster-${CACHE_VERSION}`;

// 静态资源列表
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/data-demo.html',
    // CSS
    '/css/style.css',
    '/css/pages.css',
    '/css/photo-analysis-enhanced.css',
    '/css/nav-component.css',
    // JS - 核心
    '/js/app.js',
    '/js/nav-component.js',
    '/js/knowledge-base.js',
    '/js/knowledge-base-meta.js',
    '/js/rule-engine.js',
    // JS - 分析器
    '/js/local-analyzer.js',
    '/js/photo-analyzer-enhanced.js',
    '/js/photo-analysis-integration.js',
    // JS - 功能模块
    '/js/learning-path.js',
    '/js/daily-practice.js',
    '/js/history.js',
    '/js/favorites.js',
    '/js/batch-analysis.js',
    '/js/gear-compare.js',
    // JS - AI 相关
    '/js/ai-manager.js',
    '/js/ai-config.js',
    '/js/ai-helper.js',
    '/js/mcp-client.js',
    // JS - 工具
    '/js/lazy-load.js',
    '/js/robust.js',
    '/js/progress-tracker.js',
    '/js/theme-manager.js',
    '/js/update-manager.js',
    '/js/photo-wall-disclaimer.js',
    // Pages - 核心
    '/pages/photo-analysis.html',
    '/pages/gear-guide.html',
    '/pages/gear-compare.html',
    '/pages/planner.html',
    '/pages/knowledge.html',
    '/pages/learning-path.html',
    '/pages/daily-practice.html',
    '/pages/batch-analysis.html',
    // Pages - 用户中心
    '/pages/history.html',
    '/pages/favorites.html',
    // Pages - AI
    '/pages/ai-config.html',
    // Pages - 关于/法律
    '/pages/about.html',
    '/pages/privacy.html',
    '/pages/terms.html',
    '/pages/content-complaint.html',
    // Pages - 管理
    '/pages/admin-update.html'
];

// 安装时缓存静态资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log(`[SW] 安装新版本: ${CACHE_VERSION}`);
                return cache.addAll(STATIC_ASSETS);
            })
            .catch((err) => {
                console.log('[SW] 缓存失败:', err);
            })
    );
    self.skipWaiting();
});

// 激活时清理旧缓存并通知客户端刷新
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] 删除旧缓存:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => {
            // 通知所有客户端刷新页面
            console.log('[SW] 已激活，通知客户端刷新');
            return self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage('reload');
                });
            });
        })
    );
    self.clients.claim();
});

// 监听消息
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        console.log('[SW] 收到跳过等待消息，立即激活');
        self.skipWaiting();
    }
    
    // 处理内容更新消息
    if (event.data && event.data.type === 'UPDATE_CONTENT') {
        console.log('[SW] 收到内容更新消息，版本:', event.data.version);
        // 可以在这里执行特定的缓存清理逻辑
    }
});

// Network First 策略：优先网络，失败回退缓存
self.addEventListener('fetch', (event) => {
    // 跳过非 GET 请求和跨域请求
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;

    // JS/CSS/HTML 文件使用 Network First
    const isStaticAsset = event.request.url.match(/\.(js|css|html)$/);
    
    if (isStaticAsset) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    // 网络成功，更新缓存
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return networkResponse;
                })
                .catch(() => {
                    // 网络失败，回退缓存
                    console.log('[SW] 网络失败，尝试使用缓存:', event.request.url);
                    return caches.match(event.request).then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // 缓存也不存在，返回一个简单的错误响应
                        console.log('[SW] 缓存不存在:', event.request.url);
                        return new Response('网络错误，请检查连接', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
                })
        );
    } else {
        // 其他资源使用 Cache First
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) return response;
                    return fetch(event.request);
                })
        );
    }
});

// Photo Monster - Service Worker
// 实现离线缓存功能 - Network First 策略

const CACHE_VERSION = 'v43';  // 修改版本号可强制更新缓存 - 修复管理页面状态显示
const CACHE_NAME = `photo-monster-${CACHE_VERSION}`;

// 静态资源列表
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/pages.css',
    '/js/app.js',
    '/js/knowledge-base.js',
    '/js/rule-engine.js',
    '/js/local-analyzer.js',
    '/js/lazy-load.js',
    '/js/robust.js',
    '/js/progress-tracker.js',
    '/js/mcp-client.js',
    '/js/ai-manager.js',
    '/js/ai-config.js',
    '/pages/photo-analysis.html',
    '/pages/gear-guide.html',
    '/pages/planner.html',
    '/pages/knowledge.html',
    '/pages/ai-config.html',
    '/pages/about.html',
    '/pages/privacy.html',
    '/pages/terms.html'
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

// 激活时清理旧缓存
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
                    console.log('[SW] 网络失败，使用缓存:', event.request.url);
                    return caches.match(event.request);
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

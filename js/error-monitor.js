// Photo Monster 错误监控模块
// 捕获并上报运行时错误

(function() {
    'use strict';
    
    // 错误日志存储键
    const ERROR_LOG_KEY = 'photoMonster_error_logs';
    const MAX_ERRORS = 50; // 最多保留50条错误
    
    // 错误日志数组
    let errorLogs = [];
    
    // 初始化：从localStorage加载历史错误
    function init() {
        try {
            const stored = localStorage.getItem(ERROR_LOG_KEY);
            if (stored) {
                errorLogs = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('[ErrorMonitor] 加载历史错误失败:', e);
        }
    }
    
    // 保存错误到localStorage
    function saveErrors() {
        try {
            // 只保留最近的错误
            const recentErrors = errorLogs.slice(-MAX_ERRORS);
            localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(recentErrors));
        } catch (e) {
            console.warn('[ErrorMonitor] 保存错误失败:', e);
        }
    }
    
    // 记录错误
    function logError(errorInfo) {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent.substring(0, 100),
            ...errorInfo
        };
        
        errorLogs.push(errorEntry);
        saveErrors();
        
        // 控制台输出
        console.error('[ErrorMonitor] 捕获到错误:', errorEntry);
        
        return errorEntry;
    }
    
    // 全局错误捕获
    window.addEventListener('error', function(event) {
        logError({
            type: 'javascript',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack?.substring(0, 500)
        });
    });
    
    // Promise 错误捕获
    window.addEventListener('unhandledrejection', function(event) {
        logError({
            type: 'promise',
            message: event.reason?.message || String(event.reason),
            stack: event.reason?.stack?.substring(0, 500)
        });
    });
    
    // 资源加载错误捕获
    window.addEventListener('error', function(event) {
        // 资源加载错误
        if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
            logError({
                type: 'resource',
                resourceType: event.target.tagName.toLowerCase(),
                src: event.target.src || event.target.href
            });
        }
    }, true);
    
    // 公共API
    window.ErrorMonitor = {
        // 手动记录错误
        log: function(message, context = {}) {
            return logError({
                type: 'manual',
                message: message,
                context: context
            });
        },
        
        // 获取所有错误日志
        getLogs: function() {
            return [...errorLogs];
        },
        
        // 清除错误日志
        clear: function() {
            errorLogs = [];
            localStorage.removeItem(ERROR_LOG_KEY);
        },
        
        // 获取错误统计
        getStats: function() {
            const stats = {
                total: errorLogs.length,
                byType: {},
                recent: errorLogs.slice(-10)
            };
            
            errorLogs.forEach(err => {
                const type = err.type || 'unknown';
                stats.byType[type] = (stats.byType[type] || 0) + 1;
            });
            
            return stats;
        },
        
        // 导出错误报告
        exportReport: function() {
            const stats = this.getStats();
            const report = {
                generatedAt: new Date().toISOString(),
                stats: stats,
                logs: errorLogs
            };
            
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `photo-monster-error-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };
    
    // 初始化
    init();
    
    console.log('[ErrorMonitor] 错误监控模块已启动');
})();

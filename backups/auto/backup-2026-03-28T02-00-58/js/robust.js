/**
 * 代码健壮性增强模块
 * 提供参数校验、异常捕获、边界处理等功能
 */

(function() {
    'use strict';

    /**
     * 参数校验工具
     */
    const Validator = {
        /**
         * 检查值是否为空
         * @param {*} value - 要检查的值
         * @returns {boolean}
         */
        isEmpty(value) {
            return value === null || value === undefined || 
                   (typeof value === 'string' && value.trim() === '') ||
                   (Array.isArray(value) && value.length === 0);
        },

        /**
         * 检查是否为有效数字
         * @param {*} value
         * @param {number} min - 最小值
         * @param {number} max - 最大值
         * @returns {boolean}
         */
        isNumber(value, min = -Infinity, max = Infinity) {
            const num = Number(value);
            return !isNaN(num) && isFinite(num) && num >= min && num <= max;
        },

        /**
         * 检查是否为有效数组
         * @param {*} value
         * @param {number} minLength - 最小长度
         * @param {number} maxLength - 最大长度
         * @returns {boolean}
         */
        isArray(value, minLength = 0, maxLength = Infinity) {
            return Array.isArray(value) && 
                   value.length >= minLength && 
                   value.length <= maxLength;
        },

        /**
         * 检查字符串长度
         * @param {string} value
         * @param {number} min
         * @param {number} max
         * @returns {boolean}
         */
        isStringLength(value, min = 0, max = Infinity) {
            return typeof value === 'string' && 
                   value.length >= min && 
                   value.length <= max;
        },

        /**
         * 检查是否为有效邮箱
         * @param {string} email
         * @returns {boolean}
         */
        isEmail(email) {
            if (typeof email !== 'string') return false;
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        /**
         * 检查是否为有效URL
         * @param {string} url
         * @returns {boolean}
         */
        isUrl(url) {
            if (typeof url !== 'string') return false;
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },

        /**
         * 检查是否为有效文件类型
         * @param {string} filename
         * @param {string[]} allowedTypes
         * @returns {boolean}
         */
        isFileType(filename, allowedTypes) {
            if (typeof filename !== 'string' || !Array.isArray(allowedTypes)) return false;
            const ext = filename.split('.').pop()?.toLowerCase();
            return ext ? allowedTypes.includes(ext) : false;
        }
    };

    /**
     * 安全执行函数包装器
     * @param {Function} fn - 要执行的函数
     * @param {Object} options - 配置选项
     * @returns {*}
     */
    function safeExecute(fn, options = {}) {
        const {
            defaultValue = null,
            showError = false,
            errorMessage = '执行失败',
            logError = true
        } = options;

        try {
            return fn();
        } catch (error) {
            if (logError) {
                console.error('[SafeExecute] Error:', error.message);
            }
            if (showError) {
                console.warn(errorMessage);
            }
            return defaultValue;
        }
    }

    /**
     * 带超时的异步函数执行
     * @param {Promise} promise - 要执行的Promise
     * @param {number} timeout - 超时时间(毫秒)
     * @param {*} timeoutValue - 超时时的返回值
     * @returns {Promise}
     */
    function promiseWithTimeout(promise, timeout = 30000, timeoutValue = null) {
        return Promise.race([
            promise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Operation timeout')), timeout)
            )
        ]).catch(error => {
            if (error.message === 'Operation timeout') {
                return timeoutValue;
            }
            throw error;
        });
    }

    /**
     * 重试机制
     * @param {Function} fn - 要重试的函数
     * @param {number} maxRetries - 最大重试次数
     * @param {number} delay - 重试延迟(毫秒)
     * @returns {Promise}
     */
    async function retry(fn, maxRetries = 3, delay = 1000) {
        let lastError;
        
        for (let i = 0; i <= maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                if (i < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
                }
            }
        }
        
        throw lastError;
    }

    /**
     * 数组安全访问
     * @param {Array} array - 数组
     * @param {number} index - 索引
     * @param {*} defaultValue - 默认值
     * @returns {*}
     */
    function safeArrayGet(array, index, defaultValue = null) {
        if (!Array.isArray(array)) return defaultValue;
        const idx = Math.floor(index);
        return idx >= 0 && idx < array.length ? array[idx] : defaultValue;
    }

    /**
     * 对象安全获取嵌套属性
     * @param {Object} obj - 对象
     * @param {string} path - 属性路径，如 'a.b.c'
     * @param {*} defaultValue - 默认值
     * @returns {*}
     */
    function safeGet(obj, path, defaultValue = null) {
        if (typeof obj !== 'object' || obj === null) return defaultValue;
        
        const keys = path.split('.');
        let result = obj;
        
        for (const key of keys) {
            if (result === null || result === undefined) return defaultValue;
            result = result[key];
        }
        
        return result !== undefined ? result : defaultValue;
    }

    /**
     * 防抖函数
     * @param {Function} fn - 要防抖的函数
     * @param {number} delay - 延迟时间
     * @returns {Function}
     */
    function debounce(fn, delay = 300) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * 节流函数
     * @param {Function} fn - 要节流的函数
     * @param {number} limit - 时间限制
     * @returns {Function}
     */
    function throttle(fn, limit = 300) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 输入安全处理
     * @param {string} input - 用户输入
     * @returns {string}
     */
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        return input
            .replace(/[<>]/g, '') // 移除潜在HTML标签
            .replace(/javascript:/gi, '') // 移除javascript协议
            .replace(/on\w+=/gi, '') // 移除事件处理器
            .trim();
    }

    /**
     * 文件名安全处理
     * @param {string} filename
     * @returns {string}
     */
    function sanitizeFilename(filename) {
        if (typeof filename !== 'string') return 'unnamed';
        
        return filename
            .replace(/[<>:"/\\|?*]/g, '_') // 替换非法字符
            .replace(/\.+/g, '.') // 移除连续的点
            .substring(0, 255); // 限制长度
    }

    /**
     * 边界检查 - 确保数值在指定范围内
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    function clamp(value, min, max) {
        const num = Number(value) || 0;
        return Math.min(Math.max(num, min), max);
    }

    /**
     * 安全解析 JSON
     * @param {string} jsonString
     * @param {*} defaultValue
     * @returns {*}
     */
    function safeParseJSON(jsonString, defaultValue = null) {
        if (typeof jsonString !== 'string') return defaultValue;
        
        try {
            return JSON.parse(jsonString);
        } catch {
            return defaultValue;
        }
    }

    // 导出到全局
    window.RobustUtils = {
        Validator,
        safeExecute,
        promiseWithTimeout,
        retry,
        safeArrayGet,
        safeGet,
        debounce,
        throttle,
        sanitizeInput,
        sanitizeFilename,
        clamp,
        safeParseJSON
    };

    // 自动为表单输入添加安全处理
    document.addEventListener('DOMContentLoaded', function() {
        const inputs = document.querySelectorAll('input[type="text"], textarea');
        inputs.forEach(input => {
            // 失焦时清理输入
            input.addEventListener('blur', function() {
                this.value = sanitizeInput(this.value);
            });
        });
    });

})();
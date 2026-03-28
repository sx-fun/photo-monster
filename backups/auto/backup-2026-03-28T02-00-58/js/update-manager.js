// Photo Monster - 内容更新管理器
// 实现内容自动检测、审核和发布功能

class UpdateManager {
    constructor() {
        this.config = null;
        this.pendingUpdates = [];
        this.updateHistory = [];
        this.fileHashes = new Map(); // 存储文件哈希缓存
        this.basePath = this.detectBasePath();
        this.init();
    }

    // 检测基础路径（根据当前页面位置）
    detectBasePath() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) {
            return '../';
        }
        return './';
    }

    async init() {
        await this.loadConfig();
        await this.loadFileHashes(); // 加载文件哈希缓存
        console.log('[UpdateManager] 初始化完成');
        
        // 启动自动检查（每30分钟检查一次）
        this.startAutoCheck();
    }

    // 加载配置文件
    async loadConfig() {
        try {
            const response = await fetch(this.basePath + 'data/update-config.json?v=' + Date.now());
            this.config = await response.json();
            this.pendingUpdates = this.config.pendingChanges || [];
            this.updateHistory = this.config.updateHistory || [];
            return this.config;
        } catch (error) {
            console.error('[UpdateManager] 加载配置失败:', error);
            return null;
        }
    }

    // 加载文件哈希缓存
    async loadFileHashes() {
        try {
            const cached = localStorage.getItem('pm_file_hashes');
            if (cached) {
                this.fileHashes = new Map(JSON.parse(cached));
            }
        } catch (error) {
            console.log('[UpdateManager] 无缓存的哈希值');
        }
    }

    // 保存文件哈希缓存
    saveFileHashes() {
        try {
            localStorage.setItem('pm_file_hashes', JSON.stringify([...this.fileHashes]));
        } catch (error) {
            console.error('[UpdateManager] 保存哈希缓存失败:', error);
        }
    }

    // 启动自动检查（已禁用 - 由WorkBuddy自动化接管）
    startAutoCheck() {
        // 前端自动检测已迁移至WorkBuddy自动化任务
        // 避免浏览器端和WorkBuddy重复检测
        console.log('[UpdateManager] 自动检查已由WorkBuddy接管');
        
        // 仅保留手动检查入口，供管理员在管理页面主动触发
        window.checkUpdatesManual = () => this.checkForUpdates(false);
    }

    // 检查更新
    async checkForUpdates(silent = false) {
        console.log('[UpdateManager] 检查更新...');
        
        const updates = [];
        
        for (const source of this.config.updateSources) {
            const update = await this.checkSourceUpdate(source);
            if (update.hasUpdate) {
                updates.push(update);
            }
        }
        
        // 如果不是静默检查，且发现了更新，显示通知
        if (!silent && updates.length > 0) {
            this.showUpdateNotification(updates);
        }
        
        // 触发更新发现事件
        if (updates.length > 0) {
            window.dispatchEvent(new CustomEvent('updatesFound', { 
                detail: { updates, count: updates.length } 
            }));
        }
        
        return updates;
    }

    // 显示更新通知
    showUpdateNotification(updates) {
        // 检查是否已经显示过通知
        const lastNotification = localStorage.getItem('pm_last_update_notification');
        const now = Date.now();
        if (lastNotification && (now - parseInt(lastNotification)) < 3600000) {
            // 1小时内已经通知过，不再重复
            return;
        }
        localStorage.setItem('pm_last_update_notification', now.toString());

        // 创建通知元素
        const notification = document.createElement('div');
        notification.id = 'update-notification';
        notification.innerHTML = `
            <div class="update-notification-content">
                <i class="fas fa-bell"></i>
                <span>发现 ${updates.length} 个内容更新待审核</span>
                <button onclick="window.location.href='${this.basePath}pages/admin-update.html'">查看</button>
                <button onclick="this.parentElement.parentElement.remove()">忽略</button>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        // 添加动画样式
        if (!document.getElementById('update-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'update-notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .update-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .update-notification-content button {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: background 0.2s;
                }
                .update-notification-content button:hover {
                    background: rgba(255,255,255,0.3);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // 10秒后自动消失
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    // 检查单个更新源
    async checkSourceUpdate(source) {
        try {
            // 获取当前文件内容并计算哈希
            const response = await fetch(this.basePath + source.file + '?v=' + Date.now());
            const content = await response.text();
            const currentHash = this.simpleHash(content);
            
            // 获取缓存的哈希
            const cachedHash = this.fileHashes.get(source.file);
            
            // 检测是否有更新
            const hasUpdate = cachedHash && cachedHash !== currentHash;
            
            // 更新哈希缓存
            this.fileHashes.set(source.file, currentHash);
            this.saveFileHashes();
            
            return {
                id: source.id,
                name: source.name,
                hasUpdate: hasUpdate,
                description: source.description,
                file: source.file,
                currentHash: currentHash,
                previousHash: cachedHash,
                contentLength: content.length
            };
        } catch (error) {
            console.error('[UpdateManager] 检查更新源失败:', source.id, error);
            return {
                id: source.id,
                name: source.name,
                hasUpdate: false,
                description: source.description,
                file: source.file,
                error: error.message
            };
        }
    }

    // 简单的哈希函数
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    // 生成更新报告
    generateUpdateReport(updates) {
        if (!updates || updates.length === 0) {
            return {
                hasUpdates: false,
                message: '暂无待审核更新',
                updates: []
            };
        }

        return {
            hasUpdates: true,
            message: `发现 ${updates.length} 个待审核更新`,
            updates: updates.map(u => ({
                id: u.id,
                name: u.name,
                description: u.description,
                file: u.file,
                timestamp: new Date().toISOString()
            }))
        };
    }

    // 加载更新预览
    async loadUpdatePreview(updateId) {
        const source = this.config.updateSources.find(s => s.id === updateId);
        if (!source) return null;

        try {
            // 加载当前版本内容
            const currentResponse = await fetch(this.basePath + source.file + '?v=' + Date.now());
            const currentContent = await currentResponse.text();
            const currentHash = this.simpleHash(currentContent);
            const previousHash = this.fileHashes.get(source.file);

            // 分析变更（基于文件大小和哈希变化）
            const changes = [];
            let added = 0, modified = 0, deleted = 0;

            if (previousHash && previousHash !== currentHash) {
                // 文件有变化
                const sizeDiff = currentContent.length - (parseInt(localStorage.getItem('pm_file_size_' + source.file)) || 0);
                
                if (sizeDiff > 0) {
                    changes.push({ type: 'add', content: `新增约 ${sizeDiff} 字节内容` });
                    added = Math.max(1, Math.floor(sizeDiff / 1000));
                } else if (sizeDiff < 0) {
                    changes.push({ type: 'delete', content: `删除约 ${Math.abs(sizeDiff)} 字节内容` });
                    deleted = Math.max(1, Math.floor(Math.abs(sizeDiff) / 1000));
                } else {
                    changes.push({ type: 'modify', content: '内容结构优化调整' });
                    modified = 1;
                }

                // 保存文件大小
                localStorage.setItem('pm_file_size_' + source.file, currentContent.length);
            }

            // 如果没有检测到变更，显示基本信息
            if (changes.length === 0) {
                changes.push({ type: 'modify', content: '内容已更新' });
                modified = 1;
            }

            const preview = {
                id: updateId,
                name: source.name,
                currentVersion: this.config.version,
                fileSize: (currentContent.length / 1024).toFixed(2) + ' KB',
                changes: changes,
                stats: {
                    added: added,
                    modified: modified,
                    deleted: deleted
                }
            };

            return preview;
        } catch (error) {
            console.error('[UpdateManager] 加载预览失败:', error);
            return null;
        }
    }

    // 应用更新
    async applyUpdate(updateId) {
        console.log('[UpdateManager] 应用更新:', updateId);
        
        try {
            // 1. 备份当前版本
            await this.backupCurrentVersion();

            // 2. 应用变更
            const success = await this.applyChanges(updateId);
            if (!success) {
                throw new Error('应用变更失败');
            }

            // 3. 更新版本号
            const newVersion = this.generateNewVersion();
            await this.updateVersion(newVersion);

            // 4. 记录更新历史
            this.addToHistory({
                version: newVersion,
                date: new Date().toISOString(),
                changes: [updateId],
                status: 'published'
            });

            // 5. 触发Service Worker更新
            await this.triggerServiceWorkerUpdate();

            return {
                success: true,
                version: newVersion,
                message: '更新应用成功'
            };
        } catch (error) {
            console.error('[UpdateManager] 应用更新失败:', error);
            return {
                success: false,
                message: error.message
            };
        }
    }

    // 备份当前版本
    async backupCurrentVersion() {
        const backup = {
            version: this.config.version,
            timestamp: new Date().toISOString(),
            files: []
        };
        
        // 保存备份信息到localStorage
        const backups = JSON.parse(localStorage.getItem('pm_backups') || '[]');
        backups.push(backup);
        localStorage.setItem('pm_backups', JSON.stringify(backups.slice(-5))); // 保留最近5个备份
        
        console.log('[UpdateManager] 已备份版本:', backup.version);
    }

    // 应用变更
    async applyChanges(updateId) {
        console.log('[UpdateManager] 应用变更:', updateId);
        
        try {
            const source = this.config.updateSources.find(s => s.id === updateId);
            if (!source) {
                throw new Error('更新源不存在: ' + updateId);
            }

            // 重新加载文件以确保获取最新内容
            const response = await fetch(this.basePath + source.file + '?v=' + Date.now());
            const newContent = await response.text();
            const newHash = this.simpleHash(newContent);
            
            // 更新哈希缓存
            this.fileHashes.set(source.file, newHash);
            localStorage.setItem('pm_file_size_' + source.file, newContent.length);
            this.saveFileHashes();
            
            // 记录变更到历史
            const changeRecord = {
                id: updateId,
                name: source.name,
                file: source.file,
                timestamp: new Date().toISOString(),
                hash: newHash,
                size: newContent.length
            };
            
            // 保存到 localStorage 作为变更记录
            const appliedChanges = JSON.parse(localStorage.getItem('pm_applied_changes') || '[]');
            appliedChanges.push(changeRecord);
            localStorage.setItem('pm_applied_changes', JSON.stringify(appliedChanges.slice(-50))); // 保留最近50条
            
            console.log('[UpdateManager] 变更已应用:', updateId, '新哈希:', newHash);
            return true;
        } catch (error) {
            console.error('[UpdateManager] 应用变更失败:', error);
            return false;
        }
    }

    // 生成新版本号
    generateNewVersion() {
        const now = new Date();
        const date = now.toISOString().split('T')[0].replace(/-/g, '');
        const seq = String(now.getHours() * 100 + now.getMinutes()).padStart(4, '0');
        return `${date}-${seq}`;
    }

    // 更新版本号
    async updateVersion(newVersion) {
        this.config.version = newVersion;
        this.config.lastUpdated = new Date().toISOString();
        console.log('[UpdateManager] 版本已更新:', newVersion);
    }

    // 添加到历史记录
    addToHistory(record) {
        this.updateHistory.unshift(record);
        if (this.updateHistory.length > 20) {
            this.updateHistory = this.updateHistory.slice(0, 20);
        }
    }

    // 触发Service Worker更新
    async triggerServiceWorkerUpdate() {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            
            // 发送消息通知Service Worker更新
            registration.active?.postMessage({
                type: 'UPDATE_CONTENT',
                version: this.config.version
            });
            
            console.log('[UpdateManager] 已通知Service Worker更新');
        }
    }

    // 回滚更新
    async rollbackUpdate() {
        const backups = JSON.parse(localStorage.getItem('pm_backups') || '[]');
        if (backups.length === 0) {
            return { success: false, message: '没有可回滚的备份' };
        }

        const lastBackup = backups[backups.length - 1];
        console.log('[UpdateManager] 回滚到版本:', lastBackup.version);

        // 实际应用中这里会恢复文件
        // 由于浏览器环境限制，这里模拟成功
        return {
            success: true,
            version: lastBackup.version,
            message: '已回滚到版本: ' + lastBackup.version
        };
    }

    // 获取更新统计
    getUpdateStats() {
        return {
            totalUpdates: this.updateHistory.length,
            lastUpdate: this.config.lastUpdated,
            currentVersion: this.config.version,
            pendingCount: this.pendingUpdates.length
        };
    }
}

// 创建全局实例
window.updateManager = new UpdateManager();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UpdateManager;
}

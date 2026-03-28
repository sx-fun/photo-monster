/**
 * Photo Monster - 学习路径模块
 * 管理学习路径展示、进度追踪、专题学习
 */

class LearningPathManager {
    constructor() {
        this.storageKey = 'photoMonster_learning_progress';
        this.currentPath = null;
        this.completedTopics = this.loadProgress();
        this.init();
    }
    
    init() {
        this.renderPathSelection();
        this.bindEvents();
        console.log('LearningPathManager 初始化完成，已完成专题:', this.completedTopics);
    }
    
    // 从 localStorage 加载学习进度
    loadProgress() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('加载学习进度失败:', e);
            return [];
        }
    }
    
    // 保存学习进度
    saveProgress() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.completedTopics));
        } catch (e) {
            console.error('保存学习进度失败:', e);
        }
    }
    
    // 标记专题完成
    completeTopic(topicId) {
        if (!this.completedTopics.includes(topicId)) {
            this.completedTopics.push(topicId);
            this.saveProgress();
            
            // 显示完成提示
            this.showCompletionToast(topicId);
            
            // 检查里程碑
            this.checkMilestones();
            
            // 刷新显示
            if (this.currentPath) {
                this.renderPathDetail(this.currentPath);
            }
        }
    }
    
    // 显示完成提示
    showCompletionToast(topicId) {
        const meta = KnowledgeBaseMeta.getTopicMeta(topicId);
        if (!meta) return;
        
        // 创建提示元素
        const toast = document.createElement('div');
        toast.className = 'completion-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>完成学习！</strong>
                    <p>《${meta.title}》学习完成，获得 ${meta.xpReward} XP</p>
                </div>
            </div>
        `;
        
        // 添加样式
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // 3秒后移除
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // 检查里程碑达成
    checkMilestones() {
        if (!this.currentPath) return;
        
        const path = KnowledgeBaseMeta.getLearningPath(this.currentPath);
        if (!path || !path.milestones) return;
        
        path.milestones.forEach(milestone => {
            if (this.completedTopics.includes(milestone.afterTopic)) {
                // 检查是否已显示过此里程碑
                const shownKey = `milestone_${this.currentPath}_${milestone.afterTopic}`;
                if (!localStorage.getItem(shownKey)) {
                    this.showMilestoneToast(milestone);
                    localStorage.setItem(shownKey, 'true');
                }
            }
        });
    }
    
    // 显示里程碑达成提示
    showMilestoneToast(milestone) {
        const toast = document.createElement('div');
        toast.className = 'milestone-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-trophy" style="color: #FFD700;"></i>
                <div>
                    <strong>里程碑达成！</strong>
                    <p>${milestone.title} - ${milestone.description}</p>
                </div>
            </div>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
    
    // 渲染路径选择
    renderPathSelection() {
        const container = document.getElementById('pathCards');
        if (!container) return;
        
        const paths = KnowledgeBaseMeta.getAllLearningPaths();
        
        container.innerHTML = paths.map(path => {
            const progress = KnowledgeBaseMeta.calculatePathProgress(path.id, this.completedTopics);
            const isActive = this.currentPath === path.id;
            
            return `
                <div class="path-card ${isActive ? 'active' : ''}" 
                     data-path-id="${path.id}"
                     style="color: ${path.color}">
                    <div class="path-icon" style="background: ${path.color}">
                        <i class="fas ${path.icon}"></i>
                    </div>
                    <h3 class="path-title">${path.title}</h3>
                    <p class="path-description">${path.description}</p>
                    <div class="path-meta">
                        <span><i class="fas fa-clock"></i> ${path.estimatedTotalTime}</span>
                        <span><i class="fas fa-book"></i> ${path.topics.length} 个专题</span>
                    </div>
                    <div class="path-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%; background: ${path.color}"></div>
                        </div>
                        <div class="progress-text">已完成 ${progress}%</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // 渲染路径详情
    renderPathDetail(pathId) {
        const path = KnowledgeBaseMeta.getLearningPath(pathId);
        if (!path) return;
        
        this.currentPath = pathId;
        
        // 更新标题
        const titleEl = document.getElementById('detailTitle');
        if (titleEl) {
            titleEl.innerHTML = `
                <i class="fas ${path.icon}" style="color: ${path.color}"></i>
                <span>${path.title}</span>
            `;
        }
        
        // 渲染时间线
        this.renderTimeline(path);
        
        // 渲染里程碑
        this.renderMilestones(path);
        
        // 切换视图
        document.getElementById('pathSelection').style.display = 'none';
        document.getElementById('pathDetail').classList.add('active');
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    }
    
    // 渲染时间线
    renderTimeline(path) {
        const container = document.getElementById('pathTimeline');
        if (!container) return;
        
        container.innerHTML = path.topics.map((item, index) => {
            const meta = KnowledgeBaseMeta.getTopicMeta(item.topicId);
            if (!meta) return '';
            
            const isCompleted = this.completedTopics.includes(item.topicId);
            const isCurrent = !isCompleted && 
                (index === 0 || this.completedTopics.includes(path.topics[index - 1]?.topicId));
            const isLocked = !isCompleted && !isCurrent;
            
            const statusClass = isCompleted ? 'completed' : (isCurrent ? 'current' : '');
            const difficultyClass = `difficulty-${meta.difficulty}`;
            
            return `
                <div class="timeline-item ${statusClass} ${isLocked ? 'locked' : ''}" data-topic-id="${item.topicId}">
                    <div class="timeline-dot" style="${isCompleted ? 'background: #4CAF50; border-color: #4CAF50;' : ''}"></div>
                    <div class="topic-card">
                        <div class="topic-header">
                            <div style="display: flex; gap: 12px; align-items: center;">
                                <div class="topic-order" style="background: ${path.color}">${item.order}</div>
                                <div class="topic-info">
                                    <h3>${meta.title}</h3>
                                    <div class="topic-meta">
                                        <span class="difficulty-badge ${difficultyClass}">${meta.difficultyLabel}</span>
                                        <span><i class="fas fa-clock"></i> ${meta.estimatedTime}</span>
                                        <span><i class="fas fa-star"></i> ${meta.xpReward} XP</span>
                                    </div>
                                </div>
                            </div>
                            ${isCompleted ? '<i class="fas fa-check-circle" style="color: #4CAF50; font-size: 24px;"></i>' : ''}
                        </div>
                        
                        <p class="topic-description">${meta.description}</p>
                        
                        <div class="topic-skills">
                            ${meta.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                        
                        ${item.note ? `<p style="font-size: 13px; color: #888; margin-bottom: 12px;"><i class="fas fa-lightbulb"></i> ${item.note}</p>` : ''}
                        
                        <div class="topic-actions">
                            ${isCompleted ? `
                                <button class="btn-study secondary" onclick="learningPathManager.reviewTopic('${item.topicId}')">
                                    <i class="fas fa-redo"></i> 复习
                                </button>
                            ` : isCurrent ? `
                                <button class="btn-study primary" onclick="learningPathManager.startTopic('${item.topicId}')">
                                    <i class="fas fa-play"></i> 开始学习
                                </button>
                            ` : `
                                <button class="btn-study secondary" disabled>
                                    <i class="fas fa-lock"></i> 先完成前置专题
                                </button>
                            `}
                            <button class="btn-study secondary" onclick="learningPathManager.previewTopic('${item.topicId}')">
                                <i class="fas fa-eye"></i> 预览
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // 渲染里程碑
    renderMilestones(path) {
        const container = document.getElementById('milestoneList');
        if (!container || !path.milestones) return;
        
        container.innerHTML = path.milestones.map(milestone => {
            const isUnlocked = this.completedTopics.includes(milestone.afterTopic);
            
            return `
                <div class="milestone-item ${isUnlocked ? '' : 'locked'}">
                    <div class="milestone-icon">
                        <i class="fas ${isUnlocked ? 'fa-trophy' : 'fa-lock'}"></i>
                    </div>
                    <div class="milestone-title">${milestone.title}</div>
                    <div class="milestone-desc">${milestone.description}</div>
                </div>
            `;
        }).join('');
    }
    
    // 开始学习专题
    startTopic(topicId) {
        // 跳转到知识库对应专题
        window.location.href = `knowledge.html?topic=${topicId}&mode=study`;
    }
    
    // 复习专题
    reviewTopic(topicId) {
        window.location.href = `knowledge.html?topic=${topicId}&mode=review`;
    }
    
    // 预览专题
    previewTopic(topicId) {
        window.location.href = `knowledge.html?topic=${topicId}&mode=preview`;
    }
    
    // 返回路径选择
    backToSelection() {
        this.currentPath = null;
        document.getElementById('pathDetail').classList.remove('active');
        document.getElementById('pathSelection').style.display = 'block';
        this.renderPathSelection();
        window.scrollTo(0, 0);
    }
    
    // 绑定事件
    bindEvents() {
        // 路径卡片点击
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.path-card');
            if (card) {
                const pathId = card.dataset.pathId;
                if (pathId) {
                    this.renderPathDetail(pathId);
                }
            }
        });
        
        // 返回按钮
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToSelection());
        }
    }
    
    // 获取学习统计
    getStats() {
        const allTopics = Object.keys(KnowledgeBaseMeta.topics);
        const completed = this.completedTopics.length;
        const totalXP = this.completedTopics.reduce((sum, topicId) => {
            const meta = KnowledgeBaseMeta.getTopicMeta(topicId);
            return sum + (meta ? meta.xpReward : 0);
        }, 0);
        
        return {
            totalTopics: allTopics.length,
            completedTopics: completed,
            completionRate: Math.round((completed / allTopics.length) * 100),
            totalXP: totalXP,
            currentLevel: this.calculateLevel(totalXP)
        };
    }
    
    // 计算等级
    calculateLevel(xp) {
        if (xp < 500) return { name: '摄影新手', level: 1 };
        if (xp < 1000) return { name: '入门爱好者', level: 2 };
        if (xp < 2000) return { name: '进阶摄影师', level: 3 };
        if (xp < 3500) return { name: '专业摄影师', level: 4 };
        return { name: '摄影大师', level: 5 };
    }
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 初始化
let learningPathManager;
document.addEventListener('DOMContentLoaded', () => {
    learningPathManager = new LearningPathManager();
});

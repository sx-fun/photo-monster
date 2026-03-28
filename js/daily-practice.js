/**
 * Photo Monster - 每日一练模块
 * 管理每日挑战、练习记录、进度追踪
 */

class DailyPracticeManager {
    constructor() {
        this.storageKey = 'photoMonster_daily_practice';
        this.progressKey = 'photoMonster_learning_progress';
        this.completedTopics = this.loadCompletedTopics();
        this.practiceHistory = this.loadPracticeHistory();
        this.todayCompleted = [];
        this.currentChallenge = null;
        this.init();
    }
    
    init() {
        this.renderChallenges();
        this.renderHistory();
        this.updateStats();
        this.bindEvents();
        console.log('DailyPracticeManager 初始化完成');
    }
    
    // 加载已完成专题
    loadCompletedTopics() {
        try {
            const data = localStorage.getItem(this.progressKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    
    // 加载练习历史
    loadPracticeHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    
    // 保存练习历史
    savePracticeHistory() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.practiceHistory));
        } catch (e) {
            console.error('保存练习历史失败:', e);
        }
    }
    
    // 获取用户等级
    getUserLevel() {
        const completedCount = this.completedTopics.length;
        if (completedCount < 3) return 'beginner';
        if (completedCount < 8) return 'intermediate';
        return 'advanced';
    }
    
    // 获取今日挑战
    getTodayChallenges() {
        // 从知识库元数据获取推荐挑战
        const challenges = KnowledgeBaseMeta.getDailyChallenges(
            this.completedTopics,
            this.getUserLevel()
        );
        
        // 添加今日标记
        return challenges.map((challenge, index) => ({
            ...challenge,
            isToday: index === 0,
            completed: this.todayCompleted.includes(challenge.id)
        }));
    }
    
    // 渲染挑战列表
    renderChallenges(filterType = 'all') {
        const container = document.getElementById('challengesGrid');
        if (!container) return;
        
        let challenges = this.getTodayChallenges();
        
        // 类型筛选
        if (filterType !== 'all') {
            challenges = challenges.filter(c => c.type === filterType);
        }
        
        if (challenges.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #888;">
                    <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>暂无符合条件的挑战，先去学习一些专题吧！</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = challenges.map(challenge => {
            const typeInfo = KnowledgeBaseMeta.dailyChallenges.types[challenge.type];
            const topicMeta = KnowledgeBaseMeta.getTopicMeta(challenge.topicId);
            
            return `
                <div class="challenge-card ${challenge.completed ? 'completed' : ''} ${challenge.isToday ? 'in-progress' : ''}" 
                     data-challenge-id="${challenge.id}">
                    ${challenge.isToday ? '<span class="challenge-badge badge-today">今日推荐</span>' : ''}
                    ${challenge.completed ? '<span class="challenge-badge badge-completed">已完成</span>' : ''}
                    
                    <div class="challenge-type">
                        <i class="fas ${typeInfo.icon}"></i>
                        ${typeInfo.title}
                    </div>
                    
                    <h3 class="challenge-title">${challenge.title}</h3>
                    <p class="challenge-description">${challenge.description}</p>
                    
                    <div class="challenge-meta">
                        <span><i class="fas fa-book"></i> ${topicMeta ? topicMeta.title : '综合'}</span>
                        <span><i class="fas fa-signal"></i> ${topicMeta ? topicMeta.difficultyLabel : '入门'}</span>
                        <span><i class="fas fa-star"></i> ${typeInfo.xpReward} XP</span>
                    </div>
                    
                    ${challenge.tips ? `
                        <div class="challenge-tips">
                            <h4><i class="fas fa-lightbulb"></i> 练习提示</h4>
                            <ul>
                                ${challenge.tips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                    
                    <div class="challenge-actions">
                        ${challenge.completed ? `
                            <button class="btn-challenge secondary" disabled>
                                <i class="fas fa-check"></i> 已完成
                            </button>
                        ` : `
                            <button class="btn-challenge primary" onclick="dailyPracticeManager.startChallenge('${challenge.id}')">
                                <i class="fas fa-play"></i> 开始挑战
                            </button>
                        `}
                        <button class="btn-challenge secondary" onclick="dailyPracticeManager.skipChallenge('${challenge.id}')">
                            <i class="fas fa-forward"></i> 跳过
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // 开始挑战
    startChallenge(challengeId) {
        const challenges = this.getTodayChallenges();
        this.currentChallenge = challenges.find(c => c.id === challengeId);
        
        if (!this.currentChallenge) return;
        
        const modal = document.getElementById('challengeModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');
        
        title.textContent = this.currentChallenge.title;
        
        // 根据挑战类型渲染不同内容
        switch (this.currentChallenge.type) {
            case 'quiz':
                body.innerHTML = this.renderQuizContent(this.currentChallenge);
                break;
            case 'shooting':
                body.innerHTML = this.renderShootingContent(this.currentChallenge);
                break;
            case 'analysis':
                body.innerHTML = this.renderAnalysisContent(this.currentChallenge);
                break;
            case 'practice':
                body.innerHTML = this.renderPracticeContent(this.currentChallenge);
                break;
            default:
                body.innerHTML = '<p>挑战内容加载中...</p>';
        }
        
        modal.classList.add('active');
    }
    
    // 渲染问答内容
    renderQuizContent(challenge) {
        // 基于专题生成问答题目
        const questions = this.generateQuizQuestions(challenge.topicId, challenge.questionCount || 5);
        
        return `
            <div id="quizContainer">
                ${questions.map((q, index) => `
                    <div class="quiz-question" data-question-index="${index}">
                        <h4>${index + 1}. ${q.question}</h4>
                        <div class="quiz-options">
                            ${q.options.map((opt, optIndex) => `
                                <div class="quiz-option" data-option="${optIndex}" onclick="dailyPracticeManager.selectOption(${index}, ${optIndex}, ${q.correct})">
                                    ${opt}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
                <div style="margin-top: 24px; text-align: center;">
                    <button class="btn-challenge primary" onclick="dailyPracticeManager.submitQuiz()" id="submitQuizBtn">
                        提交答案
                    </button>
                </div>
            </div>
            <div id="quizResult" style="display: none; text-align: center;">
                <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
                <h3>挑战完成！</h3>
                <p style="font-size: 18px; margin: 16px 0;">
                    得分: <span id="quizScore" style="font-weight: 700; color: #667eea;"></span>
                </p>
                <button class="btn-challenge primary" onclick="dailyPracticeManager.completeChallenge()">
                    领取奖励
                </button>
            </div>
        `;
    }
    
    // 生成问答题目
    generateQuizQuestions(topicId, count) {
        // 基于专题内容生成题目（简化版）
        const questionBank = {
            composition: [
                { question: '三分法构图将画面分成几等份？', options: ['两等份', '三等份', '四等份', '九等份'], correct: 1 },
                { question: '哪种构图适合表现稳定、庄重的感觉？', options: ['三分法', '对称构图', '对角线构图', '留白构图'], correct: 1 },
                { question: '引导线构图的主要作用是什么？', options: ['增加色彩', '引导视线', '模糊背景', '增加对比'], correct: 1 }
            ],
            technical: [
                { question: '曝光三角不包括以下哪个？', options: ['光圈', '快门', 'ISO', '焦距'], correct: 3 },
                { question: '光圈数值越小，表示光圈越？', options: ['大', '小', '不变', '取决于镜头'], correct: 0 },
                { question: '快门速度1/500秒比1/60秒？', options: ['更慢', '更快', '相同', '无法比较'], correct: 1 }
            ],
            lighting: [
                { question: '黄金时刻是指？', options: ['正午时分', '日出后和日落前1小时', '午夜时分', '阴天全天'], correct: 1 },
                { question: '软光的特点是？', options: ['阴影清晰', '阴影柔和', '对比强烈', '方向性强'], correct: 1 }
            ]
        };
        
        const questions = questionBank[topicId] || questionBank.composition;
        return questions.slice(0, count);
    }
    
    // 选择选项
    selectOption(questionIndex, optionIndex, correctIndex) {
        const questionEl = document.querySelector(`[data-question-index="${questionIndex}"]`);
        const options = questionEl.querySelectorAll('.quiz-option');
        
        options.forEach((opt, idx) => {
            opt.classList.remove('selected');
            if (idx === optionIndex) {
                opt.classList.add('selected');
            }
        });
        
        questionEl.dataset.selected = optionIndex;
        questionEl.dataset.correct = correctIndex;
    }
    
    // 提交问答
    submitQuiz() {
        const questions = document.querySelectorAll('.quiz-question');
        let correct = 0;
        let total = questions.length;
        
        questions.forEach(q => {
            const selected = parseInt(q.dataset.selected);
            const correctAns = parseInt(q.dataset.correct);
            const options = q.querySelectorAll('.quiz-option');
            
            options.forEach((opt, idx) => {
                opt.style.pointerEvents = 'none';
                if (idx === correctAns) {
                    opt.classList.add('correct');
                } else if (idx === selected && selected !== correctAns) {
                    opt.classList.add('wrong');
                }
            });
            
            if (selected === correctAns) correct++;
        });
        
        const score = Math.round((correct / total) * 100);
        document.getElementById('quizScore').textContent = `${score}分 (${correct}/${total})`;
        
        setTimeout(() => {
            document.getElementById('quizContainer').style.display = 'none';
            document.getElementById('quizResult').style.display = 'block';
        }, 1500);
    }
    
    // 渲染拍摄挑战内容
    renderShootingContent(challenge) {
        return `
            <div style="text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">📸</div>
                <h3>${challenge.title}</h3>
                <p style="margin: 16px 0; color: #666;">${challenge.description}</p>
                
                ${challenge.tips ? `
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: left;">
                        <h4 style="margin-bottom: 12px;"><i class="fas fa-lightbulb"></i> 拍摄提示</h4>
                        <ul style="padding-left: 20px; color: #666;">
                            ${challenge.tips.map(tip => `<li style="margin: 8px 0;">${tip}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <div class="upload-area" id="uploadArea" onclick="document.getElementById('challengeUpload').click()">
                    <div class="upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div class="upload-text">点击或拖拽上传练习作品</div>
                    <div class="upload-hint">支持 JPG、PNG 格式，最大 10MB</div>
                    <input type="file" id="challengeUpload" accept="image/*" style="display: none;" 
                           onchange="dailyPracticeManager.handleUpload(this)">
                </div>
                
                <div id="uploadPreview" style="display: none; margin-top: 20px;">
                    <img id="previewImage" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                    <div style="margin-top: 16px;">
                        <button class="btn-challenge primary" onclick="dailyPracticeManager.completeChallenge()">
                            完成挑战
                        </button>
                        <button class="btn-challenge secondary" onclick="dailyPracticeManager.retakePhoto()">
                            重新拍摄
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 处理上传
    handleUpload(input) {
        const file = input.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('previewImage').src = e.target.result;
            document.getElementById('uploadArea').style.display = 'none';
            document.getElementById('uploadPreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
    
    // 重新拍摄
    retakePhoto() {
        document.getElementById('uploadArea').style.display = 'block';
        document.getElementById('uploadPreview').style.display = 'none';
        document.getElementById('challengeUpload').value = '';
    }
    
    // 渲染分析内容
    renderAnalysisContent(challenge) {
        return `
            <div style="text-align: center;">
                <div style="font-size: 64px; margin-bottom: 20px;">👁️</div>
                <h3>${challenge.title}</h3>
                <p style="margin: 16px 0; color: #666;">${challenge.description}</p>
                
                <div style="background: #f8f9fa; padding: 24px; border-radius: 12px; margin: 24px 0;">
                    <p style="font-size: 15px; line-height: 1.8; color: #555;">
                        请分析以下照片的<strong>构图手法</strong>、<strong>光线运用</strong>和<strong>色彩处理</strong>，
                        并给出你的评价和改进建议。
                    </p>
                </div>
                
                <div style="margin: 24px 0;">
                    <img src="../images/sample-analysis.jpg" 
                         style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
                         onerror="this.src='https://via.placeholder.com/600x400?text=示例照片'">
                </div>
                
                <textarea placeholder="在此输入你的分析..." 
                          style="width: 100%; min-height: 120px; padding: 16px; border: 2px solid #e0e0e0; 
                                 border-radius: 12px; font-size: 15px; resize: vertical; margin-bottom: 16px;"></textarea>
                
                <button class="btn-challenge primary" onclick="dailyPracticeManager.completeChallenge()">
                    提交分析
                </button>
            </div>
        `;
    }
    
    // 渲染练习内容
    renderPracticeContent(challenge) {
        return this.renderShootingContent(challenge);
    }
    
    // 完成挑战
    completeChallenge() {
        if (!this.currentChallenge) return;
        
        // 记录完成
        this.todayCompleted.push(this.currentChallenge.id);
        
        // 添加到历史
        const typeInfo = KnowledgeBaseMeta.dailyChallenges.types[this.currentChallenge.type];
        this.practiceHistory.unshift({
            challengeId: this.currentChallenge.id,
            title: this.currentChallenge.title,
            type: this.currentChallenge.type,
            xpReward: typeInfo.xpReward,
            completedAt: new Date().toISOString()
        });
        
        // 保存
        this.savePracticeHistory();
        
        // 关闭模态框
        document.getElementById('challengeModal').classList.remove('active');
        
        // 显示成功提示
        this.showSuccessToast(typeInfo.xpReward);
        
        // 刷新显示
        this.renderChallenges();
        this.renderHistory();
        this.updateStats();
    }
    
    // 显示成功提示
    showSuccessToast(xp) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-trophy" style="font-size: 28px;"></i>
                <div>
                    <div style="font-weight: 700; font-size: 16px;">挑战完成！</div>
                    <div style="font-size: 14px; opacity: 0.9;">获得 ${xp} XP</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // 跳过挑战
    skipChallenge(challengeId) {
        // 从今日列表中移除，生成新的
        this.renderChallenges();
    }
    
    // 渲染历史记录
    renderHistory() {
        const container = document.getElementById('historyList');
        if (!container) return;
        
        const recent = this.practiceHistory.slice(0, 10);
        
        if (recent.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #888;">
                    <i class="fas fa-clipboard-list" style="font-size: 32px; margin-bottom: 12px; opacity: 0.5;"></i>
                    <p>还没有练习记录，开始你的第一个挑战吧！</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recent.map(item => {
            const typeInfo = KnowledgeBaseMeta.dailyChallenges.types[item.type];
            const date = new Date(item.completedAt);
            const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
            
            return `
                <div class="history-item">
                    <div class="history-icon completed">
                        <i class="fas ${typeInfo.icon}"></i>
                    </div>
                    <div class="history-content">
                        <div class="history-title">${item.title}</div>
                        <div class="history-meta">${dateStr} · ${typeInfo.title}</div>
                    </div>
                    <div class="history-xp">+${item.xpReward} XP</div>
                </div>
            `;
        }).join('');
    }
    
    // 更新统计
    updateStats() {
        // 计算连续打卡天数（简化版）
        const streak = this.calculateStreak();
        document.getElementById('streakCount').textContent = `${streak} 天`;
        
        // 今日获得 XP
        const todayXP = this.todayCompleted.length * 50;
        document.getElementById('todayXP').textContent = `${todayXP} XP`;
        
        // 累计完成
        document.getElementById('totalCompleted').textContent = `${this.practiceHistory.length} 个`;
    }
    
    // 计算连续打卡天数
    calculateStreak() {
        if (this.practiceHistory.length === 0) return 0;
        
        // 简化计算：有记录就显示记录数
        return Math.min(this.practiceHistory.length, 30);
    }
    
    // 绑定事件
    bindEvents() {
        // 类型筛选
        document.querySelectorAll('.type-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                document.querySelectorAll('.type-tag').forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                this.renderChallenges(tag.dataset.type);
            });
        });
        
        // 关闭模态框
        document.getElementById('modalClose')?.addEventListener('click', () => {
            document.getElementById('challengeModal').classList.remove('active');
        });
        
        document.getElementById('challengeModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'challengeModal') {
                document.getElementById('challengeModal').classList.remove('active');
            }
        });
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
let dailyPracticeManager;
document.addEventListener('DOMContentLoaded', () => {
    dailyPracticeManager = new DailyPracticeManager();
});

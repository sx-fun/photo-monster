// Photo Monster - 知识库元数据与学习路径配置
// 为知识库专题提供难度分级、前置依赖、学习路径等元数据

const KnowledgeBaseMeta = {
    // ========== 专题元数据 ==========
    topics: {
        // 核心理论 - 入门级
        composition: {
            difficulty: 'beginner',
            difficultyLabel: '入门',
            estimatedTime: '30分钟',
            xpReward: 100,
            prerequisites: [],
            nextTopics: ['lighting', 'technical'],
            description: '掌握三分法、对称、引导线等基础构图技巧',
            skills: ['三分法', '对称构图', '引导线', '框架构图', '留白']
        },
        lighting: {
            difficulty: 'beginner',
            difficultyLabel: '入门',
            estimatedTime: '35分钟',
            xpReward: 100,
            prerequisites: [],
            nextTopics: ['color', 'portrait'],
            description: '理解硬光软光、光位方向、黄金时刻等光线知识',
            skills: ['硬光软光', '光位控制', '黄金时刻', '人工光源']
        },
        color: {
            difficulty: 'intermediate',
            difficultyLabel: '进阶',
            estimatedTime: '25分钟',
            xpReward: 150,
            prerequisites: ['composition'],
            nextTopics: ['post-processing'],
            description: '学习色温、配色方案、色彩情感等色彩理论',
            skills: ['色温', '配色方案', '色彩情感', '冷暖对比']
        },
        pillars: {
            difficulty: 'beginner',
            difficultyLabel: '入门',
            estimatedTime: '20分钟',
            xpReward: 80,
            prerequisites: [],
            nextTopics: ['composition', 'lighting'],
            description: '了解摄影的五大核心维度评估体系',
            skills: ['构图评估', '光线评估', '色彩评估', '清晰度评估', '创意评估']
        },
        
        // 技术基础 - 入门级
        technical: {
            difficulty: 'beginner',
            difficultyLabel: '入门',
            estimatedTime: '40分钟',
            xpReward: 120,
            prerequisites: [],
            nextTopics: ['equipment'],
            description: '掌握曝光三角、测光模式、对焦模式等技术基础',
            skills: ['光圈', '快门', 'ISO', '曝光补偿', '测光模式']
        },
        equipment: {
            difficulty: 'beginner',
            difficultyLabel: '入门',
            estimatedTime: '45分钟',
            xpReward: 100,
            prerequisites: ['technical'],
            nextTopics: ['portrait', 'landscape'],
            description: '了解相机类型、镜头选择、配件推荐等器材知识',
            skills: ['相机选择', '镜头选择', '配件推荐', '预算规划']
        },
        
        // 后期处理 - 进阶级
        'post-processing': {
            difficulty: 'intermediate',
            difficultyLabel: '进阶',
            estimatedTime: '50分钟',
            xpReward: 150,
            prerequisites: ['color', 'technical'],
            nextTopics: ['topaz'],
            description: '学习Lightroom基础、调色思路、修图流程',
            skills: ['Lightroom', '调色', '曝光调整', '色彩校正']
        },
        topaz: {
            difficulty: 'advanced',
            difficultyLabel: '高级',
            estimatedTime: '30分钟',
            xpReward: 200,
            prerequisites: ['post-processing'],
            nextTopics: ['midjourney'],
            description: '掌握Topaz降噪、锐化、放大等AI后期工具',
            skills: ['Topaz降噪', 'Topaz锐化', 'Topaz放大', 'AI修图']
        },
        midjourney: {
            difficulty: 'advanced',
            difficultyLabel: '高级',
            estimatedTime: '25分钟',
            xpReward: 200,
            prerequisites: ['topaz'],
            nextTopics: [],
            description: '学习AI摄影、Midjourney提示词、AI辅助创作',
            skills: ['Midjourney', 'AI生成', '提示词工程', 'AI辅助']
        },
        
        // 人像摄影 - 进阶级
        portrait: {
            difficulty: 'intermediate',
            difficultyLabel: '进阶',
            estimatedTime: '40分钟',
            xpReward: 150,
            prerequisites: ['composition', 'lighting'],
            nextTopics: ['posing', 'hanfu'],
            description: '掌握人像摄影的焦段选择、光线控制、拍摄技巧',
            skills: ['人像焦段', '人像光线', '背景处理', '情绪表达']
        },
        posing: {
            difficulty: 'intermediate',
            difficultyLabel: '进阶',
            estimatedTime: '35分钟',
            xpReward: 150,
            prerequisites: ['portrait'],
            nextTopics: ['wedding'],
            description: '学习人像摆姿引导、姿势库、男女差异化摆姿',
            skills: ['站姿', '坐姿', '手部姿势', '表情引导', '场景互动']
        },
        hanfu: {
            difficulty: 'intermediate',
            difficultyLabel: '进阶',
            estimatedTime: '30分钟',
            xpReward: 180,
            prerequisites: ['portrait'],
            nextTopics: [],
            description: '专攻汉服古风摄影的场景、姿势、后期特色',
            skills: ['古风场景', '汉服姿势', '道具使用', '古风后期']
        },
        
        // 风光摄影 - 进阶级
        landscape: {
            difficulty: 'intermediate',
            difficultyLabel: '进阶',
            estimatedTime: '35分钟',
            xpReward: 150,
            prerequisites: ['composition', 'technical'],
            nextTopics: ['astro', 'architecture'],
            description: '学习风光摄影的黄金时刻、长曝光、堆栈技法',
            skills: ['黄金时刻', '长曝光', '景深控制', '滤镜使用']
        },
        astro: {
            difficulty: 'advanced',
            difficultyLabel: '高级',
            estimatedTime: '40分钟',
            xpReward: 200,
            prerequisites: ['landscape', 'technical'],
            nextTopics: [],
            description: '掌握星空摄影、银河拍摄、星轨拍摄技术',
            skills: ['银河拍摄', '星轨拍摄', '星空后期', '500法则']
        },
        architecture: {
            difficulty: 'intermediate',
            difficultyLabel: '进阶',
            estimatedTime: '30分钟',
            xpReward: 150,
            prerequisites: ['composition', 'landscape'],
            nextTopics: [],
            description: '学习建筑摄影的透视控制、线条构图、城市风光',
            skills: ['透视控制', '移轴镜头', '蓝调时刻', '城市夜景']
        },
        
        // 专题摄影
        travel: {
            difficulty: 'intermediate',
            difficultyLabel: '进阶',
            estimatedTime: '25分钟',
            xpReward: 120,
            prerequisites: ['composition', 'landscape'],
            nextTopics: [],
            description: '旅拍Vlog的策划、拍摄、剪辑全流程',
            skills: ['旅拍策划', 'Vlog拍摄', '运镜技巧', '旅行剪辑']
        },
        street: {
            difficulty: 'intermediate',
            difficultyLabel: '进阶',
            estimatedTime: '25分钟',
            xpReward: 150,
            prerequisites: ['composition', 'technical'],
            nextTopics: [],
            description: '街头摄影的观察、抓拍、故事性表达',
            skills: ['街头观察', '抓拍技巧', '故事性', '黑白处理']
        },
        wildlife: {
            difficulty: 'advanced',
            difficultyLabel: '高级',
            estimatedTime: '35分钟',
            xpReward: 200,
            prerequisites: ['technical', 'equipment'],
            nextTopics: [],
            description: '野生动物摄影的器材、隐蔽、快门控制',
            skills: ['长焦使用', '动物行为', '高速快门', '野外安全']
        },
        wedding: {
            difficulty: 'advanced',
            difficultyLabel: '高级',
            estimatedTime: '45分钟',
            xpReward: 250,
            prerequisites: ['portrait', 'posing'],
            nextTopics: [],
            description: '婚礼摄影的流程、关键瞬间、团队协作',
            skills: ['婚礼流程', '关键瞬间', '团队配合', '后期交付']
        },
        
        // 视频拍摄
        video: {
            difficulty: 'intermediate',
            difficultyLabel: '进阶',
            estimatedTime: '40分钟',
            xpReward: 150,
            prerequisites: ['technical'],
            nextTopics: ['travel'],
            description: '视频拍摄的帧率、分辨率、运镜、剪辑基础',
            skills: ['视频参数', '运镜技巧', '稳定器', '视频剪辑']
        }
    },

    // ========== 学习路径定义 ==========
    learningPaths: {
        beginner: {
            id: 'beginner',
            title: '摄影新手入门',
            description: '从零开始建立摄影基础，掌握核心概念和基本技术',
            icon: 'fa-seedling',
            color: '#4CAF50',
            estimatedTotalTime: '约4小时',
            topics: [
                { topicId: 'pillars', order: 1, note: '先了解摄影评估的五大维度' },
                { topicId: 'composition', order: 2, note: '构图是摄影的基础语言' },
                { topicId: 'technical', order: 3, note: '掌握曝光三角，理解相机工作原理' },
                { topicId: 'lighting', order: 4, note: '学会观察和运用光线' },
                { topicId: 'equipment', order: 5, note: '了解器材，合理配置装备' }
            ],
            milestones: [
                { afterTopic: 'composition', title: '构图达人', description: '掌握5种以上构图方法' },
                { afterTopic: 'technical', title: '曝光掌控者', description: '理解并运用曝光三角' },
                { afterTopic: 'equipment', title: '装备入门', description: '完成新手器材配置' }
            ]
        },
        portrait: {
            id: 'portrait',
            title: '人像摄影师养成',
            description: '系统学习人像摄影，从基础到商业应用',
            icon: 'fa-user',
            color: '#E91E63',
            estimatedTotalTime: '约5小时',
            topics: [
                { topicId: 'composition', order: 1, note: '复习构图基础' },
                { topicId: 'lighting', order: 2, note: '深入理解人像光线' },
                { topicId: 'portrait', order: 3, note: '人像摄影核心技术' },
                { topicId: 'posing', order: 4, note: '学会引导摆姿' },
                { topicId: 'hanfu', order: 5, note: '古风人像专项（可选）' },
                { topicId: 'wedding', order: 6, note: '婚礼摄影实战（进阶）' }
            ],
            milestones: [
                { afterTopic: 'portrait', title: '人像入门', description: '掌握人像拍摄基础' },
                { afterTopic: 'posing', title: '摆姿专家', description: '能引导各种姿势' },
                { afterTopic: 'wedding', title: '商业摄影师', description: '具备婚礼拍摄能力' }
            ]
        },
        landscape: {
            id: 'landscape',
            title: '风光摄影师之路',
            description: '从自然风光到城市建筑，掌握风光摄影全技能',
            icon: 'fa-mountain',
            color: '#2196F3',
            estimatedTotalTime: '约4.5小时',
            topics: [
                { topicId: 'composition', order: 1, note: '风光构图要点' },
                { topicId: 'technical', order: 2, note: '风光摄影技术参数' },
                { topicId: 'landscape', order: 3, note: '风光摄影核心技法' },
                { topicId: 'astro', order: 4, note: '星空摄影（进阶）' },
                { topicId: 'architecture', order: 5, note: '建筑与城市风光' },
                { topicId: 'travel', order: 6, note: '旅拍实战' }
            ],
            milestones: [
                { afterTopic: 'landscape', title: '风光入门', description: '拍出合格风光作品' },
                { afterTopic: 'astro', title: '星空猎人', description: '掌握银河拍摄' },
                { afterTopic: 'travel', title: '旅拍达人', description: '完成旅拍作品' }
            ]
        },
        postprocessing: {
            id: 'postprocessing',
            title: '后期进阶大师',
            description: '从基础调色到AI修图，掌握现代后期工作流',
            icon: 'fa-magic',
            color: '#9C27B0',
            estimatedTotalTime: '约3小时',
            topics: [
                { topicId: 'color', order: 1, note: '色彩理论基础' },
                { topicId: 'post-processing', order: 2, note: 'Lightroom基础' },
                { topicId: 'topaz', order: 3, note: 'AI后期工具' },
                { topicId: 'midjourney', order: 4, note: 'AI辅助创作（进阶）' }
            ],
            milestones: [
                { afterTopic: 'post-processing', title: '调色师', description: '掌握Lightroom调色' },
                { afterTopic: 'topaz', title: 'AI修图师', description: '运用AI工具提升效率' },
                { afterTopic: 'midjourney', title: 'AI创作者', description: '融合AI与摄影' }
            ]
        }
    },

    // ========== 每日一练配置 ==========
    dailyChallenges: {
        // 挑战类型
        types: {
            quiz: {
                title: '知识问答',
                description: '测试你对摄影理论的掌握',
                icon: 'fa-question-circle',
                xpReward: 50
            },
            shooting: {
                title: '拍摄挑战',
                description: '完成指定的拍摄任务',
                icon: 'fa-camera',
                xpReward: 100
            },
            analysis: {
                title: '作品分析',
                description: '分析示例照片并给出评价',
                icon: 'fa-eye',
                xpReward: 80
            },
            practice: {
                title: '技巧练习',
                description: '练习特定的摄影技巧',
                icon: 'fa-dumbbell',
                xpReward: 60
            }
        },
        
        // 挑战题库（示例）
        challenges: [
            {
                id: 'c001',
                type: 'shooting',
                topicId: 'composition',
                difficulty: 'beginner',
                title: '三分法练习',
                description: '使用三分法构图拍摄5张照片，主体放在交点位置',
                tips: ['开启相机网格线辅助', '尝试横竖构图', '人物眼睛放在上三分之一线'],
                verification: 'upload'
            },
            {
                id: 'c002',
                type: 'quiz',
                topicId: 'technical',
                difficulty: 'beginner',
                title: '曝光三角测试',
                description: '回答5道关于光圈、快门、ISO的题目',
                questionCount: 5,
                passingScore: 80
            },
            {
                id: 'c003',
                type: 'shooting',
                topicId: 'lighting',
                difficulty: 'beginner',
                title: '黄金时刻拍摄',
                description: '在日出或日落时分拍摄一组照片',
                tips: ['提前30分钟到达拍摄地点', '尝试逆光拍摄轮廓光', '注意色温变化'],
                verification: 'upload'
            },
            {
                id: 'c004',
                type: 'analysis',
                topicId: 'composition',
                difficulty: 'intermediate',
                title: '构图分析',
                description: '分析提供的3张照片的构图手法',
                sampleImages: ['sample1.jpg', 'sample2.jpg', 'sample3.jpg']
            },
            {
                id: 'c005',
                type: 'practice',
                topicId: 'portrait',
                difficulty: 'intermediate',
                title: '自然光人像',
                description: '使用自然光拍摄人像，注意光位和补光',
                tips: ['选择阴天或阴影处', '使用反光板补光', '注意眼神光'],
                verification: 'upload'
            },
            {
                id: 'c006',
                type: 'shooting',
                topicId: 'landscape',
                difficulty: 'intermediate',
                title: '长曝光练习',
                description: '使用慢快门拍摄流水或车流',
                tips: ['使用三脚架', 'ISO设为最低', '尝试不同快门速度'],
                verification: 'upload'
            },
            {
                id: 'c007',
                type: 'quiz',
                topicId: 'color',
                difficulty: 'intermediate',
                title: '色彩理论',
                description: '测试配色方案和色彩情感知识',
                questionCount: 5,
                passingScore: 80
            },
            {
                id: 'c008',
                type: 'shooting',
                topicId: 'astro',
                difficulty: 'advanced',
                title: '银河拍摄',
                description: '在光污染少的地方拍摄银河',
                tips: ['使用500法则计算快门', '最大光圈', 'ISO 3200-6400'],
                verification: 'upload'
            }
        ]
    },

    // ========== 辅助方法 ==========
    
    // 获取专题元数据
    getTopicMeta(topicId) {
        return this.topics[topicId] || null;
    },
    
    // 获取学习路径
    getLearningPath(pathId) {
        return this.learningPaths[pathId] || null;
    },
    
    // 获取所有学习路径
    getAllLearningPaths() {
        return Object.values(this.learningPaths);
    },
    
    // 获取专题的完整学习链（包含前置和后续）
    getTopicChain(topicId) {
        const meta = this.topics[topicId];
        if (!meta) return null;
        
        return {
            current: topicId,
            prerequisites: meta.prerequisites,
            next: meta.nextTopics,
            difficulty: meta.difficulty
        };
    },
    
    // 根据难度获取专题
    getTopicsByDifficulty(difficulty) {
        return Object.entries(this.topics)
            .filter(([_, meta]) => meta.difficulty === difficulty)
            .map(([id, meta]) => ({ id, ...meta }));
    },
    
    // 获取今日挑战（基于学习进度）
    getDailyChallenges(completedTopics = [], userLevel = 'beginner') {
        // 根据用户等级筛选合适的挑战
        const suitableChallenges = this.dailyChallenges.challenges.filter(c => {
            // 难度匹配
            const difficultyMatch = 
                userLevel === 'beginner' ? c.difficulty === 'beginner' :
                userLevel === 'intermediate' ? ['beginner', 'intermediate'].includes(c.difficulty) :
                true;
            
            // 前置专题已完成
            const topicMeta = this.topics[c.topicId];
            const prereqsMet = !topicMeta || 
                topicMeta.prerequisites.every(p => completedTopics.includes(p));
            
            return difficultyMatch && prereqsMet;
        });
        
        // 随机选择3个挑战
        const shuffled = suitableChallenges.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    },
    
    // 计算路径完成进度
    calculatePathProgress(pathId, completedTopics) {
        const path = this.learningPaths[pathId];
        if (!path) return 0;
        
        const total = path.topics.length;
        const completed = path.topics.filter(t => 
            completedTopics.includes(t.topicId)
        ).length;
        
        return Math.round((completed / total) * 100);
    },
    
    // 获取下一个推荐专题
    getNextRecommendation(completedTopics, currentPathId = null) {
        if (currentPathId) {
            // 按当前路径推荐
            const path = this.learningPaths[currentPathId];
            if (path) {
                const nextTopic = path.topics.find(t => 
                    !completedTopics.includes(t.topicId)
                );
                if (nextTopic) return nextTopic.topicId;
            }
        }
        
        // 全局推荐：找已完成专题的后续
        for (const topicId of completedTopics.reverse()) {
            const meta = this.topics[topicId];
            if (meta && meta.nextTopics) {
                const next = meta.nextTopics.find(n => !completedTopics.includes(n));
                if (next) return next;
            }
        }
        
        // 默认推荐第一个入门专题
        return 'composition';
    }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KnowledgeBaseMeta;
}

console.log('KnowledgeBaseMeta 加载完成，包含', 
    Object.keys(KnowledgeBaseMeta.topics).length, '个专题，',
    Object.keys(KnowledgeBaseMeta.learningPaths).length, '条学习路径'
);

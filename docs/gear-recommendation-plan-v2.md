# Photo Monster 套装推荐系统优化方案 v2.0

> 基于现有自动化进程重新规划 | 制定时间: 2026-03-30

---

## 📊 现有自动化进程分析

### 当前活跃任务

| 任务名称 | 实际频率 | 配置问题 | 建议调整 |
|---------|---------|---------|---------|
| **Photo Monster 统一内容管理** | 每6小时 | ✅ 合理 | 保持现状 |
| **Photo Monster 内容更新-每月1日** | **每天 09:00** | ⚠️ 名称与配置不符 | 重命名或调整频率 |
| **weekly-security-scan** | 周一 09:00 | ✅ 合理(Claw项目) | 无需调整 |

### 关键发现

**"每月1日"任务实际配置为每天执行** - 这会导致：
- 不必要的频繁抓取（每天 vs 每月1次）
- 可能触发网站的反爬机制
- 资源浪费

---

## 🎯 重新规划方案

### 一、自动化任务调整

#### 调整1: 修正"每月1日"任务

**方案A - 改为真正的每月1日（推荐）**
```
名称: Photo Monster 月度深度更新
频率: 每月1日 09:00
任务: 深度抓取 + 价格更新 + 数据同步
```

**方案B - 接受每天执行，重命名**
```
名称: Photo Monster 每日内容检查
频率: 每天 09:00
任务: 轻量级检查，发现新品才深度抓取
```

**推荐选择方案A**，原因：
1. 摄影器材发布频率不高，每天抓取意义不大
2. 每月1日集中更新更符合用户习惯（月初看新品）
3. 减少服务器压力和反爬风险

#### 调整2: 优化"每6小时"任务分工

当前任务包含：文件监控 + 每14天内容抓取

**建议拆分**：

| 任务 | 频率 | 职责 |
|------|------|------|
| **统一内容管理** | 每6小时 | 仅文件变更检测（knowledge-base.js, rule-engine.js） |
| **双周内容抓取** | 每14天 | 网络抓取新机型/镜头信息 |

---

### 二、信息抓取策略（针对选择型号）

#### 2.1 抓取目标明确化

**填充目标**: `gear-guide.html` 中的型号选择器

```
用户流程:
选择品牌 → 选择型号(需抓取填充) → 选择预算 → 生成推荐
```

#### 2.2 分层抓取策略

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: 实时检测层 (每6小时)                           │
│  - 检测本地数据文件变更                                   │
│  - 触发数据同步                                          │
├─────────────────────────────────────────────────────────┤
│  Layer 2: 快速扫描层 (每周一 09:00)                      │
│  - RSS订阅检查 (PetaPixel, DPReview)                     │
│  - 新品发布检测                                          │
│  - 轻量级，仅获取标题和链接                               │
├─────────────────────────────────────────────────────────┤
│  Layer 3: 深度抓取层 (每月1日 09:00)                     │
│  - 全量抓取各品牌rumors网站                              │
│  - 价格数据更新                                          │
│  - 数据清洗和验证                                        │
│  - 生成更新报告                                          │
└─────────────────────────────────────────────────────────┘
```

#### 2.3 具体抓取源配置

**每周快速扫描**（周一 09:00，约10分钟）：
- PetaPixel RSS
- DPReview 新品页面
- Reddit r/cameras 热门帖

**每月深度抓取**（1日 09:00，约30-60分钟）：
- Sony Alpha Rumors
- Canon Rumors
- Nikon Rumors
- Fuji Rumors
- 43Rumors (M43系统)
- 各品牌官网新闻页

---

### 三、套装推荐功能改进建议

#### 3.1 现有功能评估

当前 `gear-guide.html` 已实现：
- ✅ 递进式选择（品牌→型号→预算）
- ✅ 基础套装生成
- ✅ 兼容性检查
- ✅ 价格计算

**待改进项**：

#### 3.2 改进建议（按优先级）

**P0 - 数据完整性（必须）**
- [ ] 补充2024-2025新机型到数据库
- [ ] 添加副厂镜头选项（Sigma Art, Tamron）
- [ ] 完善价格参考数据

**P1 - 智能推荐（重要）**
- [ ] 基于拍摄场景的预设套装
- [ ] 预算智能分配建议
- [ ] 相似用户选择推荐

**P2 - 用户体验（优化）**
- [ ] 套装对比功能（2-3套并排对比）
- [ ] 收藏/分享推荐方案
- [ ] 价格趋势提示

**P3 - 高级功能（未来）**
- [ ] 二手市场价格参考
- [ ] 租赁选项推荐
- [ ] 分期付款方案

#### 3.3 场景化套装模板

```javascript
// 预设套装配置
const presetCombos = {
  portrait: {
    name: '人像摄影套装',
    description: '适合人像写真、婚礼摄影',
    camera: { type: 'fullframe', priority: 'portrait' },
    lenses: ['85mm f/1.4', '50mm f/1.2', '24-70mm f/2.8'],
    budgetSplit: { body: 0.55, lens: 0.40, accessory: 0.05 }
  },
  landscape: {
    name: '风光摄影套装',
    description: '适合风景、建筑、星空摄影',
    camera: { type: 'fullframe', priority: 'landscape' },
    lenses: ['16-35mm f/2.8', '24-70mm f/2.8', '70-200mm f/4'],
    budgetSplit: { body: 0.50, lens: 0.45, accessory: 0.05 }
  },
  street: {
    name: '街头摄影套装',
    description: '轻便、快速、低调',
    camera: { type: 'aps-c', priority: 'compact' },
    lenses: ['35mm f/1.4', '23mm f/1.4'],
    budgetSplit: { body: 0.45, lens: 0.50, accessory: 0.05 }
  },
  video: {
    name: '视频创作套装',
    description: 'Vlog、短片、直播',
    camera: { type: 'fullframe', priority: 'video' },
    lenses: ['24-70mm f/2.8', '35mm f/1.4'],
    budgetSplit: { body: 0.60, lens: 0.30, accessory: 0.10 }
  }
};
```

---

### 四、本地规则引擎 + 网络抓取整合

#### 4.1 数据流架构

```
┌──────────────────────────────────────────────────────────────┐
│                     数据输入层                                 │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│ 本地静态数据  │ 网络抓取数据  │ 用户反馈数据  │ 价格参考数据     │
│ cameraDB     │ scraped-*.json│ ratings.json  │ price-ref.json  │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬────────┘
       │              │              │                │
       └──────────────┴──────┬───────┴────────────────┘
                             ▼
                    ┌─────────────────┐
                    │   数据融合引擎   │
                    │  (DataMerger)   │
                    │                 │
                    │ 优先级规则:      │
                    │ 官方 > 评测 >    │
                    │ 高可信传闻 >     │
                    │ 一般传闻         │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │   规则引擎处理   │
                    │ (RuleEngine)    │
                    │                 │
                    │ - 卡口匹配       │
                    │ - 预算筛选       │
                    │ - 场景匹配       │
                    └────────┬────────┘
                             ▼
                    ┌─────────────────┐
                    │  套装推荐生成器  │
                    │ (ComboGenerator)│
                    └─────────────────┘
```

#### 4.2 规则引擎核心配置

```javascript
// tools/sources/rule-engine.js

const RuleEngine = {
  // 卡口兼容性规则
  mountRules: {
    'RF': { native: ['RF'], adapted: ['EF'] },
    'FE': { native: ['FE', 'E'], adapted: [] },
    'Z': { native: ['Z'], adapted: ['F'] },
    'X': { native: ['X'], adapted: [] },
    'L': { native: ['L'], adapted: ['EF', 'R', 'M'] }
  },

  // 预算分配规则
  budgetRules: {
    entry: { max: 8000, split: { body: 0.60, lens: 0.35, accessory: 0.05 } },
    mid: { min: 8000, max: 15000, split: { body: 0.55, lens: 0.40, accessory: 0.05 } },
    pro: { min: 15000, max: 25000, split: { body: 0.50, lens: 0.45, accessory: 0.05 } },
    flagship: { min: 25000, split: { body: 0.55, lens: 0.40, accessory: 0.05 } }
  },

  // 场景匹配规则
  subjectRules: {
    portrait: {
      cameraFeatures: ['highRes', 'goodAF', 'portraitMode'],
      lensFocalLength: ['85mm', '50mm', '135mm'],
      lensAperture: ['f/1.2', 'f/1.4', 'f/1.8']
    },
    landscape: {
      cameraFeatures: ['highRes', 'goodDR', 'weatherSealed'],
      lensFocalLength: ['16-35mm', '14-24mm', '24-70mm'],
      lensAperture: ['f/2.8', 'f/4']
    },
    sports: {
      cameraFeatures: ['fastAF', 'highFPS', 'goodTracking'],
      lensFocalLength: ['70-200mm', '100-400mm', '400mm'],
      lensAperture: ['f/2.8', 'f/4', 'f/5.6']
    }
  }
};
```

#### 4.3 数据融合逻辑

```javascript
// 融合策略
function mergeGearData(localData, scrapedData) {
  const merged = { ...localData };
  
  for (const item of scrapedData) {
    const key = `${item.brand}-${item.model}`;
    const existing = merged[key];
    
    // 如果本地不存在，直接添加
    if (!existing) {
      merged[key] = { ...item, source: 'scraped', added: new Date() };
      continue;
    }
    
    // 如果抓取数据优先级更高，更新
    if (getPriority(item.status) > getPriority(existing.status)) {
      merged[key] = { 
        ...existing, 
        ...item, 
        source: 'merged',
        updated: new Date()
      };
    }
  }
  
  return merged;
}

function getPriority(status) {
  const priorities = {
    'official': 5,
    'announced': 4,
    'reviewed': 4,
    'rumored_high': 3,
    'rumored': 2,
    'speculated': 1
  };
  return priorities[status] || 0;
}
```

---

### 五、机型和镜头内容全面性评估与补充计划

#### 5.1 当前覆盖评估

| 品牌 | 相机 | 镜头 | 完整度 | 主要缺失 |
|------|------|------|--------|---------|
| Canon | ~20 | ~15 | 75% | R6 III, R5 II, RF新镜头 |
| Sony | ~18 | ~15 | 70% | A7 VI, A7S IV, FE新镜头 |
| Nikon | ~18 | ~12 | 70% | Z6 IV, Z5 II, Z卡口副厂 |
| Fujifilm | ~15 | ~10 | 65% | X-T6, X-Pro4, GF新镜头 |
| Panasonic | ~5 | ~5 | 40% | S1 II, L卡口联盟 |
| OM System | ~5 | ~5 | 40% | OM-3, 新Pro镜头 |
| Leica | ~3 | ~3 | 30% | SL3, M12 |
| Hasselblad | ~2 | ~2 | 25% | X3D |

#### 5.2 补充优先级

**紧急补充（2024-2025已发布）**：
- Canon EOS R6 Mark III
- Canon EOS R5 Mark II
- Sony A1 II
- Nikon Z6 III
- Fujifilm X-M5
- OM System OM-3

**高优先级（即将发布/热门）**：
- Sony A7 VI
- Canon R7 Mark II
- Nikon Z5 II
- Sigma 新RF卡口镜头
- Tamron 新Z卡口镜头

**中优先级（完善生态）**：
- 国产镜头（唯卓仕、铭匠、星曜）
- 老蛙特殊镜头
- 中画幅GFX镜头群

#### 5.3 数据补充流程

```
发现缺失机型
    ↓
网络搜索确认规格
    ↓
录入 local-data.js
    ↓
更新 price-reference.js
    ↓
运行 sync-to-website.js
    ↓
测试 gear-guide.html 选择器
    ↓
提交更新
```

---

### 六、修订后的实施计划

#### 阶段1: 自动化任务调整（本周）

- [ ] **Day 1**: 调整"每月1日"任务为真正的每月执行
- [ ] **Day 2**: 优化"每6小时"任务，明确职责边界
- [ ] **Day 3**: 测试自动化任务运行

#### 阶段2: 数据补充（第2-3周）

- [ ] **Week 2**: 补充2024-2025已发布新机型
- [ ] **Week 3**: 补充副厂镜头和国产镜头

#### 阶段3: 规则引擎开发（第4-5周）

- [ ] **Week 4**: 实现数据融合层
- [ ] **Week 5**: 开发规则引擎核心逻辑

#### 阶段4: 套装推荐增强（第6-7周）

- [ ] **Week 6**: 添加场景化推荐功能
- [ ] **Week 7**: 实现预算智能分配

#### 阶段5: 测试与优化（第8周）

- [ ] 全链路测试
- [ ] 性能优化
- [ ] 文档更新

---

### 七、预期效果

| 指标 | 当前 | 目标 | 达成方式 |
|------|------|------|---------|
| 数据新鲜度 | 手动更新 | 1周内自动更新 | 每周/每月自动抓取 |
| 机型覆盖率 | ~70% | ~90% | 补充新机型和副厂 |
| 推荐准确率 | 基础匹配 | 智能场景匹配 | 规则引擎优化 |
| 维护工作量 | 高 | 低 | 自动化抓取 |

---

### 八、下一步行动

请确认以下决策：

1. **"每月1日"任务调整**: 
   - [ ] 改为真正的每月1日执行（推荐）
   - [ ] 保持每天执行，重命名任务

2. **数据补充优先级**:
   - [ ] 先补充已发布新机型（推荐）
   - [ ] 先开发规则引擎

3. **套装推荐改进**:
   - [ ] 优先实现场景化推荐
   - [ ] 优先实现预算智能分配

确认后我将开始执行具体调整。

---

*方案版本: v2.0*
*制定时间: 2026-03-30*
*基于自动化进程: photo-monster (每6小时), photo-monster-1 (每天09:00)*

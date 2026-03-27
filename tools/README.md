# Photo Monster 自动更新系统

## 📋 系统概述

Photo Monster 自动更新系统用于定期抓取摄影器材新品信息，生成审核报告，并在用户确认后更新数据库。

## 🗂️ 文件结构

```
tools/
├── auto-update.js          # 主控脚本（整合全流程）
├── scraper.js              # 数据抓取主程序
├── review-report.js        # 审核报告生成器
├── update-db.js            # 数据库更新器
├── sources/                # 数据源抓取模块
│   ├── base-scraper.js     # 基础抓取类
│   ├── dpreview.js         # DPReview 抓取器
│   ├── sony.js             # 索尼抓取器
│   ├── canon.js            # 佳能抓取器
│   ├── nikon.js            # 尼康抓取器
│   ├── fujifilm.js         # 富士抓取器
│   ├── leica.js            # 徕卡抓取器
│   └── hasselblad.js       # 哈苏抓取器
├── temp/                   # 临时文件目录
│   ├── scrape-results-*.json    # 抓取结果
│   ├── review-report-*.json     # 审核报告
│   ├── review-report-*.txt      # 可读报告
│   ├── pending-review-*.json    # 待审核内容
│   ├── approved-*.json          # 已批准内容
│   └── workbuddy-notify-*.txt   # WorkBuddy通知
└── backups/                # 数据库备份目录
```

## 🚀 使用方法

### 1. 完整自动流程

```bash
node auto-update.js
```

执行：抓取 → 生成报告 → 检查已批准内容 → 更新数据库

### 2. 仅抓取数据

```bash
node auto-update.js scrape-only
```

执行：抓取数据源 → 生成审核报告

### 3. 仅更新数据库

```bash
node auto-update.js update-only
```

执行：处理已批准文件 → 更新数据库

### 4. 单独运行模块

```bash
# 仅抓取
node scraper.js

# 仅生成报告
node review-report.js

# 仅更新数据库（需已批准文件）
node update-db.js
```

## 📊 数据源

| 数据源 | 优先级 | 类型 |
|--------|--------|------|
| DPReview | P0 | 综合新闻 |
| Sony Alpha | P0 | 官方新闻 |
| Canon | P0 | 官方新闻 |
| Nikon | P0 | 官方新闻 |
| Fujifilm | P0 | 官方新闻 |
| Leica | P1 | 官方新闻 |
| Hasselblad | P1 | 官方新闻 |

## 🔄 工作流程

```
┌─────────────────┐
│  WorkBuddy 定时  │
│  (每14天 9:00)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  auto-update.js │
│  scrape-only   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   scraper.js    │
│  抓取7个数据源  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ review-report.js│
│  生成审核报告   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ WorkBuddy 通知  │
│  用户审核确认   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  用户执行命令   │
│ node approve.js │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   update-db.js  │
│  更新数据库     │
└─────────────────┘
```

## 📝 审核流程

### 流程概述

1. **自动抓取**：系统每14天自动抓取数据源
2. **生成报告**：抓取完成后生成审核报告
3. **WorkBuddy通知**：你会收到通知，告知新发现的内容
4. **人工审核**：查看 `temp/pending-review-xxx.txt` 文件
5. **确认/拒绝**：使用专用脚本操作
6. **自动更新**：确认后系统自动更新数据库并备份

### 操作命令

**查看审核报告：**
```bash
cat temp\pending-review-xxx.txt
```

**✅ 确认更新：**
```bash
node approve.js
```
- 显示审核内容摘要
- 自动重命名并执行更新

**❌ 拒绝更新：**
```bash
node reject.js
```
- 将内容移至 rejected/ 目录
- 不更新数据库

**批量拒绝：**
```bash
node reject.js --all
```

## ⚙️ 自动化配置

自动化任务已配置：

- **任务名称**: Photo Monster 内容自动更新
- **执行频率**: 每14天 9:00
- **工作目录**: `D:\PhotoMonster\tools`
- **执行命令**: `node auto-update.js scrape-only`

## 🔧 手动测试

```bash
# 进入工具目录
cd D:\PhotoMonster\tools

# 测试抓取
node auto-update.js scrape-only

# 查看生成的报告
cat temp/review-report-*.txt

# 模拟审核通过（重命名文件）
move temp\pending-review-xxx.json temp\approved-xxx.json

# 执行更新
node auto-update.js update-only
```

## 📦 依赖

- Node.js 14+
- node-fetch@2

```bash
npm install
```

## 🛡️ 安全与备份

- 每次更新前自动备份 `app.js` 到 `backups/` 目录
- 备份文件命名：`app.js.backup-YYYY-MM-DD-HH-MM-SS`
- 已处理文件移至 `temp/processed/` 目录

## 🐛 故障排除

### 抓取失败
- 检查网络连接
- 查看 `temp/scrape-results-*.json` 中的 errors 字段
- 数据源网站结构变化时需要更新对应的抓取器

### 更新失败
- 检查 `temp/` 目录是否有 `approved-*.json` 文件
- 查看备份文件是否正常生成
- 手动恢复：从 `backups/` 复制备份文件

## 📞 支持

如有问题，请检查：
1. `temp/` 目录下的日志文件
2. 审核报告中的错误信息
3. WorkBuddy 通知消息

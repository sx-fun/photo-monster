# Photo Monster 安全快速开始指南

## 🚀 安全启动流程

### 第一步：安全检查（必须）

```bash
cd D:\PhotoMonster\tools
node safe-mode.js
```

这会检查：
- ✅ Node.js 环境
- ✅ 文件权限
- ✅ 目录结构
- ✅ 安全配置
- ✅ 备份状态
- ✅ 网络配置

### 第二步：运行自动更新（安全模式）

```bash
# 完整流程（推荐）
node auto-update.js

# 仅抓取（生成审核报告）
node auto-update.js scrape-only

# 仅更新（处理已批准内容）
node auto-update.js update-only
```

### 第三步：审核更新内容

```bash
# 查看审核报告
cat temp\review-report-*.txt

# 查看 WorkBuddy 通知
cat temp\workbuddy-notify-*.txt
```

### 第四步：确认更新

**方式A - 重命名文件（推荐）**
```bash
# 重命名表示批准
move temp\pending-review-xxx.json temp\approved-xxx.json

# 然后运行更新
node auto-update.js update-only
```

**方式B - 直接更新**
```bash
# 直接运行（会提示确认）
node update-db-secure.js
```

## 🛡️ 安全特性

### 1. 域名白名单
- 仅允许访问7个官方数据源
- 自动拦截恶意域名

### 2. 输入验证
- 品牌白名单验证
- 字段长度限制
- 数值范围检查
- XSS 过滤

### 3. 自动备份
- 每次更新前自动备份
- 保留最近10个备份
- 计算文件哈希验证完整性

### 4. 审计日志
- 记录所有操作
- 监控安全事件
- 支持故障排查

### 5. 执行限制
- 超时保护（5分钟）
- 内存限制（512MB）
- 请求频率限制

## ⚠️ 安全警告

### 禁止的操作
- ❌ 修改 `security-config.js` 放宽限制
- ❌ 直接修改 `app.js` 而不备份
- ❌ 运行未知来源的脚本
- ❌ 禁用安全模式检查

### 建议的操作
- ✅ 定期运行 `safe-mode.js` 检查
- ✅ 更新前查看审核报告
- ✅ 保留备份文件
- ✅ 监控审计日志

## 🚨 紧急回滚

如果更新后出现问题：

```bash
# 1. 查看可用备份
dir backups\app.js.backup-*

# 2. 恢复备份（替换xxx为实际时间戳）
copy backups\app.js.backup-xxx ..\js\app.js

# 3. 验证恢复
node safe-mode.js
```

## 📊 安全监控

### 查看审计日志
```bash
node -e "const {audit} = require('./security-config'); console.log(JSON.stringify(audit.getLogs(), null, 2))"
```

### 检查最新备份
```bash
dir backups\ /o-d
```

### 验证文件完整性
```bash
# 计算当前文件哈希
node -e "const crypto=require('crypto'); const fs=require('fs'); console.log(crypto.createHash('sha256').update(fs.readFileSync('..\\js\\app.js')).digest('hex'))"

# 与备份哈希对比
type backups\app.js.backup-xxx.hash
```

## 📞 获取帮助

### 查看安全文档
```bash
type SECURITY.md
```

### 查看使用说明
```bash
type README.md
```

### 运行安全检查
```bash
node safe-mode.js
```

## ✅ 安全检查清单

每次运行前确认：
- [ ] 已运行 `safe-mode.js` 且检查通过
- [ ] 备份目录有可用备份
- [ ] 审核报告已查看
- [ ] 网络连接正常
- [ ] 磁盘空间充足

## 📝 更新记录

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-03-26 | 1.0 | 初始安全版本 |

---

**记住**: 安全永远是第一位的。如有疑问，请先备份！

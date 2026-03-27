# Photo Monster 安全白皮书

## 🔒 安全架构概述

Photo Monster 自动更新系统采用多层安全防护机制，确保网页安全、无毒、无风险。

## 🛡️ 安全层级

### 第一层：网络安全

#### 域名白名单机制
- **仅允许访问**预定义的7个官方数据源
- **禁止访问**任何其他域名
- **自动拦截**恶意域名请求

```javascript
allowedDomains: [
    'dpreview.com',
    'sony.com',
    'canon.com',
    'nikon.com',
    'fujifilm.com',
    'leica-camera.com',
    'hasselblad.com'
]
```

#### 请求限制
- 连接超时：10秒
- 读取超时：30秒
- 总超时：60秒
- 最大重定向：3次
- 最大响应大小：5MB
- 每分钟最大请求：30次

#### 协议和端口限制
- **禁止协议**: `file:`, `ftp:`, `gopher:`, `mailto:`
- **禁止端口**: 22(SSH), 23(Telnet), 25(SMTP), 135-139, 445(SMB), 3389(RDP)

### 第二层：输入验证

#### 数据类型白名单

**品牌白名单**
```javascript
allowedBrands: ['sony', 'canon', 'nikon', 'fujifilm', 
                'panasonic', 'olympus', 'leica', 'hasselblad']
```

**相机类型白名单**
```javascript
allowedCameraTypes: ['mirrorless', 'dslr', 'compact', 
                     'cinema', 'rangefinder', 'medium']
```

**传感器白名单**
```javascript
allowedSensors: ['fullframe', 'apsc', 'm43', 'medium', '1inch']
```

**卡口验证**
每个品牌只允许特定的卡口类型，防止非法数据注入

#### 字段长度限制
| 字段 | 最大长度 |
|------|---------|
| brand | 20 |
| model | 100 |
| type | 20 |
| sensor | 20 |
| mount | 10 |
| source | 50 |
| title | 200 |
| summary | 1000 |
| url | 500 |

#### 数值范围限制
- **像素 (mp)**: 1-400 MP
- **弱光性能 (lowLight)**: 1-15
- **价格 (price)**: 0-1,000,000

### 第三层：内容过滤

#### XSS 防护

**禁止的模式**
```javascript
forbiddenPatterns: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,  // 脚本标签
    /javascript:/gi,                                        // javascript协议
    /on\w+\s*=/gi,                                          // 事件处理器
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,  // iframe
    /eval\s*\(/gi,                                          // eval函数
]
```

**HTML实体编码**
```javascript
escapeChars: {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
}
```

### 第四层：文件安全

#### 文件类型限制
**允许**: `.json`, `.txt`, `.js`, `.md`

**禁止**
```javascript
forbiddenPatterns: [
    /\.exe$/i,   // 可执行文件
    /\.dll$/i,   // 动态链接库
    /\.bat$/i,   // 批处理
    /\.cmd$/i,   // 命令脚本
    /\.ps1$/i,   // PowerShell
    /\.sh$/i,    // Shell脚本
    /\.php$/i,   // PHP
    /\.jsp$/i,   // JSP
    /\.asp$/i,   // ASP
]
```

#### 路径安全检查
- 禁止路径遍历 (`..`)
- 禁止特殊字符 (`~`, `$`, `%`, `&`, `*`, `|`, `<`, `>`, `?`, `\0`)
- 最大文件大小：10MB

### 第五层：执行安全

#### 禁止的Node.js模块
```javascript
forbiddenModules: [
    'child_process',  // 禁止执行系统命令
    'cluster',        // 禁止集群
    'dgram',          // 禁止UDP
    'dns',            // 禁止DNS操作
    'net',            // 禁止网络监听
    'repl',           // 禁止交互式执行
    'tls',            // 禁止TLS服务器
    'vm',             // 禁止虚拟机
    'worker_threads'  // 禁止工作线程
]
```

#### 执行限制
- 最大执行时间：5分钟
- 最大内存使用：512MB

### 第六层：数据备份

#### 自动备份机制
1. **每次更新前自动备份** `app.js`
2. **计算文件哈希** 确保备份完整性
3. **保留最近10个备份**
4. **自动清理旧备份**

#### 备份验证
```javascript
// 备份时计算SHA256哈希
const hash = crypto.createHash('sha256')
    .update(content)
    .digest('hex');

// 保存哈希文件
fs.writeFileSync(`${backupPath}.hash`, hash);
```

### 第七层：审计日志

#### 记录的操作
- `fetch_start` - 开始抓取
- `fetch_complete` - 抓取完成
- `fetch_error` - 抓取错误
- `file_read` - 文件读取
- `file_write` - 文件写入
- `database_backup` - 数据库备份
- `database_update` - 数据库更新
- `validation_error` - 验证错误
- `security_violation` - 安全违规

#### 日志内容
```javascript
{
    timestamp: "2026-03-26T13:45:00.000Z",
    operation: "database_update",
    details: { added: 3, backup: "..." },
    pid: 12345,
    memory: { rss: 52428800, heapTotal: 18268160, heapUsed: 15432100 }
}
```

## 🚨 安全响应机制

### 自动拦截
当检测到以下情况时，系统自动拦截并记录：
- 访问非白名单域名
- 响应内容包含危险代码
- 请求频率超限
- 文件路径包含危险字符
- 数据验证失败

### 人工审核
- 所有抓取内容需**人工确认**后才更新
- 生成详细审核报告
- 支持一键回滚到备份版本

## 📋 安全使用指南

### 日常使用
```bash
# 1. 运行抓取（安全模式）
node auto-update.js scrape-only

# 2. 查看审核报告
cat temp/review-report-*.txt

# 3. 确认后更新
node auto-update.js update-only
```

### 紧急回滚
```bash
# 如果更新后出现问题，手动恢复备份
copy backups\app.js.backup-2026-03-26-13-45-00 ..\js\app.js
```

### 安全检查
```bash
# 查看审计日志
node -e "const {audit} = require('./security-config'); console.log(audit.getLogs())"
```

## ✅ 安全认证

### 代码安全
- ✅ 无 `eval()` 或 `Function()` 构造器
- ✅ 无 `child_process` 模块调用
- ✅ 无文件系统删除操作
- ✅ 无网络监听端口
- ✅ 无外部命令执行

### 数据安全
- ✅ 所有输入经过验证
- ✅ 所有输出经过转义
- ✅ 文件路径经过净化
- ✅ 数据库操作有备份

### 运行安全
- ✅ 超时机制防止死循环
- ✅ 内存限制防止溢出
- ✅ 请求频率限制
- ✅ 域名白名单限制

## 🔍 安全审计清单

- [ ] 检查所有URL是否在白名单中
- [ ] 验证所有输入数据类型
- [ ] 确认所有输出已转义
- [ ] 检查文件路径安全性
- [ ] 验证备份文件完整性
- [ ] 检查审计日志异常
- [ ] 确认无危险代码模式
- [ ] 验证执行时间和内存使用

## 📞 安全事件响应

如发现安全问题：
1. 立即停止自动化任务
2. 检查审计日志
3. 恢复最近备份
4. 报告问题详情

## 📝 版本记录

| 版本 | 日期 | 安全更新 |
|------|------|---------|
| 1.0 | 2026-03-26 | 初始安全架构 |

---

**安全承诺**: Photo Monster 自动更新系统承诺不执行任何危险操作，所有代码开源可审计，确保您的数据安全。

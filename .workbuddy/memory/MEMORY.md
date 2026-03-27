# Photo Monster 项目长期记忆

## 项目概述
- **项目路径**: D:\PhotoMonster
- **Photo Monster**: 摄影器材推荐网站，支持8个相机品牌（佳能/索尼/尼康/富士/松下/奥林巴斯/徕卡/哈苏）
- **核心文件**: js/app.js, js/knowledge-base.js, js/rule-engine.js, js/safe-mode.js
- **工具目录**: D:\PhotoMonster\tools\

## 自动化任务
- **ID**: photo-monster-4
- **名称**: Photo Monster 统一内容管理
- **类型**: 每小时执行（检测文件变更）+ 每14天（每月1日/15日）抓取外部新品
- **监控文件**: js/knowledge-base.js, js/rule-engine.js
- **状态文件**: D:\PhotoMonster\.workbuddy\photomonster\state.json
- **执行日志**: D:\PhotoMonster\.workbuddy\photomonster\automation-log.md

## 最近改进
- 2026-03-26: 完成七项规范化优化（SEO/隐私政策/Service Worker等）
- 2026-03-26: 完成安全加固部署（7层安全防护）
- 2026-03-26: 完成套装推荐功能改进（镜头筛选/兼容性标签/详细报告）
- 2026-03-26: 完成 about.html 商标免责声明添加

## 偏好设置
- 浏览器本地预览：使用 python -m http.server + Start-Process，不使用 preview_url
- 桌面路径：D:\HuaweiMoveData\Users\HUAWEI\Desktop

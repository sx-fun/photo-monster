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

## 月度更新执行
- **ID**: photo-monster-1
- **名称**: Photo Monster 月度深度更新
- **时间**: 每月1日 09:00
- **执行内容**: 深度抓取新器材、数据验证、同步到网站
- **数据源**: tools/sources/local-data.js (本地结构化数据)
- **价格库**: 55款相机 + 26款镜头 (tools/sources/price-reference.js)
- **最新执行**: 2026-04-27 (成功)
  - 新增相机3款：Canon EOS R6 V（本周官宣/5月13日发布会/7K Open Gate）、Sony A7R VI（5月高可信/67MP/同步两款GM镜）、Nikon Z9 II（Q4/ISO32泄露）
  - 新增镜头3款：Canon RF 20-50mm f/4L PZ（官宣）、Sony FE 16-28mm f/2 GM（高可信）、Sony FE 100-400mm f/4 GM II（高可信）
  - Nikon Z7 III 降至极低可信（NiknRumors确认规格伪造）
  - Canon RE-1 最新动态：CP+展出1英寸概念机 ≠ 全画幅版（Q4 2026-Q1 2027待定）
  - 清理愚人节假新闻（PetaPixel）
  - 数据验证通过: 新器材11项 + 价格81项
  - 下次关注: 2026-05-13 Canon R6V发布会后补充国行定价


## 偏好设置
- 浏览器本地预览：使用 python -m http.server + Start-Process，不使用 preview_url
- 桌面路径：D:\HuaweiMoveData\Users\HUAWEI\Desktop

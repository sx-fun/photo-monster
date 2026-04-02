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
- **价格库**: 53款相机 + 26款镜头 (tools/sources/price-reference.js)
- **最新执行**: 2026-04-02 (成功，补执行)
  - 5款相机/6支镜头/7条新闻已同步
  - 已校正 Sony Alpha 7 V、Canon EOS R6 Mark III、Fujifilm X-T50 为官方状态
  - 已新增 Nikon Z 70-200mm f/2.8 VR S II、Nikon Z 24-105mm f/4-7.1
  - 下月关注: Canon RE-1官宣、Nikon Z7 III进展、Panasonic Lumix S1 II是否转正


## 偏好设置
- 浏览器本地预览：使用 python -m http.server + Start-Process，不使用 preview_url
- 桌面路径：D:\HuaweiMoveData\Users\HUAWEI\Desktop

# Photo Monster 月度深度更新报告

- 执行时间：2026-04-02 15:55-16:01
- 执行状态：成功
- 执行方式：本地结构化数据校正 + 官方信息复核 + 抓取/同步脚本重跑

## 一、本轮更新摘要

本轮没有简单沿用旧的“传闻池”，而是先做了官方复核，把已经被官网确认的条目从传闻状态升级为正式信息，再同步到网站数据层。

### 已完成的核心更新

1. **机身信息校正**
   - Sony **Alpha 7 V**：改为官方已发布状态，确认约3300万像素、AI实时识别对焦、7K超采样4K60p，中国建议零售价 **¥17,999**。
   - Canon **EOS R6 Mark III**：改为官方已发布状态，确认约3250万像素、40fps电子连拍、7K RAW / 4K120p，参考价 **¥16,999**。
   - Fujifilm **X-T50**：纠正为已发布机型，不再错误标记为 2026 年传闻；同步修正为 **APS-C** 机型，参考价 **¥9,999**。

2. **镜头信息补充**
   - 新增 Nikon **Z 70-200mm f/2.8 VR S II**，官方信息已录入，参考价 **¥19,999**。
   - 新增 Nikon **Z 24-105mm f/4-7.1**，官方信息已录入，参考价 **¥3,980**。
   - Nikon **Z 28-400mm f/4-8 VR** 修正为官方条目，并把发布时间纠正为 **2024-04-04**。

3. **新闻池重建**
   - 将 Sony / Canon / Nikon 的已验证官方条目替换旧的低质量传闻描述。
   - 保留 **Canon RE-1** 作为观察中的传闻条目，继续追踪，不提前当作正式新品入库。
   - 抓取阶段额外收进 1 条 PetaPixel RSS 新闻，但该条属于泛行业内容，业务价值一般，仅作补充保留。

4. **转换逻辑修正**
   - 修复数据同步脚本中传感器字段的取值逻辑。
   - 现在会优先使用结构化规格中的 `expectedSpecs.sensor`，避免把 **APS-C** 机型错误写成 **fullframe**。

## 二、数据验证结果

### 可信度分层
- **official**：Sony Alpha 7 V、Canon EOS R6 Mark III、Nikon Z 70-200mm f/2.8 VR S II、Nikon Z 24-105mm f/4-7.1、Nikon Z 28-400mm f/4-8 VR、Fujifilm X-T50
- **rumored**：Canon RE-1、Nikon Z7 III、Panasonic Lumix S1 II、Sony FE 85mm f/1.2 GM II、Canon RF 35mm f/1.2L USM、Fujifilm XF 400mm f/5.6

### 抓取/聚合统计
- 相机：**5** 款
- 镜头：**6** 支
- 新闻：**7** 条
- 聚合后平均可信度：**3.45 / 5**

## 三、已更新的数据文件

### 网站数据
- `D:\PhotoMonster\data\new-gear-data.json`
- `D:\PhotoMonster\data\new-gear-data.js`
- `D:\PhotoMonster\data\news-data.json`
- `D:\PhotoMonster\data\news-data.js`
- `D:\PhotoMonster\data\price-data.json`
- `D:\PhotoMonster\data\price-data.js`

### 结构化源文件
- `D:\PhotoMonster\tools\sources\local-data.js`
- `D:\PhotoMonster\tools\sources\price-reference.js`
- `D:\PhotoMonster\tools\sync-to-website.js`

## 四、价格库更新结果

- 价格库版本：**2026.04.02**
- 价格库最后更新：**2026-04-02**
- 相机价格条目：**53** 款
- 镜头价格条目：**26** 支

### 本轮新增/修正的重点价格
- Sony Alpha 7 V：**¥17,999**
- Canon EOS R6 Mark III：**¥16,999**
- Fujifilm X-T50：**¥9,999**
- Nikon Z 70-200mm f/2.8 VR S II：**¥19,999**
- Nikon Z 24-105mm f/4-7.1：**¥3,980**

## 五、网络与抓取情况

### 成功
- 本地结构化数据加载成功
- PetaPixel RSS 获取成功
- 抓取结果和网站同步脚本执行成功

### 异常但已降级处理
- Reddit RSS（r/cameras / r/SonyAlpha / r/canon）出现超时或 ECONNRESET
- DPReview RSS 因 XML 实体扩展限制未能成功解析

### 处理结果
这些异常没有阻断本轮任务。系统已用“本地结构化数据 + 可用 RSS”完成本次同步。

## 六、建议下月重点关注

1. **Canon RE-1** 是否从传闻转为正式发布
2. **Nikon Z7 III** 是否出现更高可信度规格泄露或官宣信号
3. **Panasonic Lumix S1 II** 是否进入正式发布窗口
4. Sony / Canon 的高端新镜头（85/1.2、35/1.2）是否进入官宣阶段
5. 继续观察 PetaPixel / 官方新闻源，减少对 Reddit 源可用性的依赖

## 七、结论

这次更新的价值不只是“多抓了几条新闻”，而是把旧库里几条明显过期或错位的新品状态纠正了。现在网站里的新品数据比之前靠谱得多，尤其是 Sony Alpha 7 V、Canon EOS R6 Mark III、Fujifilm X-T50 这三条，不再停留在旧传闻口径。

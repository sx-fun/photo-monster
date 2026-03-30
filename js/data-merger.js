/**
 * Photo Monster 数据融合引擎
 * 整合本地静态数据、网络抓取数据、用户反馈数据
 * 
 * 阶段3: 规则引擎开发 - 数据融合层
 * 创建时间: 2026-03-30
 */

class DataMerger {
  constructor() {
    // 数据优先级（可信度）
    this.dataPriority = {
      'official': 5,      // 官方发布
      'announced': 4,    // 正式宣布
      'reviewed': 4,     // 媒体评测
      'rumored_high': 3, // 高可信度传闻
      'rumored': 2,      // 一般传闻
      'speculated': 1    // 猜测
    };
    
    // 数据源权重
    this.sourceWeights = {
      'local': 1.0,      // 本地静态数据
      'scraped': 0.8,    // 网络抓取
      'user': 0.6        // 用户反馈
    };
  }

  /**
   * 融合相机数据
   * @param {Object} localData - 本地静态数据
   * @param {Object} scrapedData - 网络抓取数据
   * @param {Object} userData - 用户反馈数据
   * @returns {Object} 融合后的数据
   */
  mergeCameraData(localData, scrapedData = {}, userData = {}) {
    const merged = JSON.parse(JSON.stringify(localData)); // 深拷贝本地数据
    
    // 合并抓取数据
    for (const [brand, models] of Object.entries(scrapedData)) {
      if (!merged[brand]) {
        merged[brand] = { name: this.getBrandName(brand), models: {} };
      }
      
      for (const [modelName, specs] of Object.entries(models)) {
        const existing = merged[brand].models[modelName];
        
        if (!existing) {
          // 新机型，直接添加
          merged[brand].models[modelName] = {
            ...specs,
            _source: 'scraped',
            _added: new Date().toISOString()
          };
        } else if (this.shouldUpdate(existing, specs)) {
          // 抓取数据优先级更高，更新
          merged[brand].models[modelName] = {
            ...existing,
            ...specs,
            _source: 'merged',
            _updated: new Date().toISOString()
          };
        }
      }
    }
    
    // 合并用户反馈数据（价格、评分等）
    for (const [brand, models] of Object.entries(userData)) {
      if (!merged[brand]) continue;
      
      for (const [modelName, userSpecs] of Object.entries(models)) {
        if (merged[brand].models[modelName]) {
          // 更新用户评分和价格反馈
          if (userSpecs.userRating) {
            merged[brand].models[modelName].userRating = userSpecs.userRating;
          }
          if (userSpecs.marketPrice) {
            merged[brand].models[modelName].marketPrice = userSpecs.marketPrice;
          }
          merged[brand].models[modelName]._userUpdated = new Date().toISOString();
        }
      }
    }
    
    return merged;
  }

  /**
   * 判断是否应更新数据
   */
  shouldUpdate(existing, incoming) {
    const existingPriority = this.dataPriority[existing.status] || 0;
    const incomingPriority = this.dataPriority[incoming.status] || 0;
    
    // 如果抓取数据优先级更高，或者本地数据较旧
    if (incomingPriority > existingPriority) {
      return true;
    }
    
    // 如果优先级相同，但抓取数据有更多信息
    if (incomingPriority === existingPriority) {
      const existingKeys = Object.keys(existing).length;
      const incomingKeys = Object.keys(incoming).length;
      return incomingKeys > existingKeys;
    }
    
    return false;
  }

  /**
   * 获取品牌中文名
   */
  getBrandName(brand) {
    const brandNames = {
      canon: '佳能',
      sony: '索尼',
      nikon: '尼康',
      fujifilm: '富士',
      panasonic: '松下',
      olympus: '奥林巴斯',
      leica: '徕卡',
      hasselblad: '哈苏'
    };
    return brandNames[brand] || brand;
  }

  /**
   * 验证数据质量
   */
  validateData(data) {
    const errors = [];
    const warnings = [];
    
    for (const [brand, brandData] of Object.entries(data)) {
      for (const [model, specs] of Object.entries(brandData.models || {})) {
        // 必填字段检查
        if (!specs.type) errors.push(`${brand}.${model}: 缺少 type`);
        if (!specs.sensor) errors.push(`${brand}.${model}: 缺少 sensor`);
        if (!specs.mp) errors.push(`${brand}.${model}: 缺少 mp`);
        if (!specs.mount) errors.push(`${brand}.${model}: 缺少 mount`);
        
        // 数值范围检查
        if (specs.mp && (specs.mp < 1 || specs.mp > 200)) {
          warnings.push(`${brand}.${model}: 像素值异常 (${specs.mp})`);
        }
        
        // 价格合理性检查
        if (specs.price && !['entry', 'mid', 'pro', 'flagship'].includes(specs.price)) {
          warnings.push(`${brand}.${model}: 价格等级异常 (${specs.price})`);
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      totalModels: this.countModels(data)
    };
  }

  /**
   * 统计机型数量
   */
  countModels(data) {
    let count = 0;
    for (const brandData of Object.values(data)) {
      count += Object.keys(brandData.models || {}).length;
    }
    return count;
  }

  /**
   * 生成数据报告
   */
  generateReport(mergedData) {
    const report = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalBrands: Object.keys(mergedData).length,
        totalModels: this.countModels(mergedData),
        byBrand: {}
      },
      newAdditions: [],
      updates: []
    };
    
    for (const [brand, brandData] of Object.entries(mergedData)) {
      report.summary.byBrand[brand] = Object.keys(brandData.models).length;
      
      for (const [model, specs] of Object.entries(brandData.models)) {
        if (specs._source === 'scraped' && specs._added) {
          report.newAdditions.push({ brand, model, date: specs._added });
        } else if (specs._source === 'merged' && specs._updated) {
          report.updates.push({ brand, model, date: specs._updated });
        }
      }
    }
    
    return report;
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataMerger;
}

// 浏览器环境
if (typeof window !== 'undefined') {
  window.DataMerger = DataMerger;
}

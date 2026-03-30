/**
 * Photo Monster 套装推荐引擎
 * 基于规则引擎的智能套装推荐
 * 
 * 阶段3: 规则引擎开发 - 套装推荐核心
 * 创建时间: 2026-03-30
 */

class ComboRecommendationEngine {
  constructor(cameraDB, lensDB) {
    this.cameraDB = cameraDB;
    this.lensDB = lensDB;
    
    // 预算分配规则
    this.budgetRules = {
      entry: { max: 8000, split: { body: 0.60, lens: 0.35, accessory: 0.05 } },
      mid: { min: 8000, max: 15000, split: { body: 0.55, lens: 0.40, accessory: 0.05 } },
      pro: { min: 15000, max: 25000, split: { body: 0.50, lens: 0.45, accessory: 0.05 } },
      flagship: { min: 25000, split: { body: 0.55, lens: 0.40, accessory: 0.05 } }
    };
    
    // 场景匹配规则
    this.subjectRules = {
      portrait: {
        cameraFeatures: ['highRes', 'goodAF', 'portraitMode'],
        lensFocalLength: ['85mm', '50mm', '135mm', '24-70mm'],
        lensAperture: ['f/1.2', 'f/1.4', 'f/1.8', 'f/2.8'],
        priority: ['portrait', 'general']
      },
      landscape: {
        cameraFeatures: ['highRes', 'goodDR', 'weatherSealed'],
        lensFocalLength: ['16-35mm', '14-24mm', '24-70mm', '70-200mm'],
        lensAperture: ['f/2.8', 'f/4'],
        priority: ['landscape', 'general']
      },
      sports: {
        cameraFeatures: ['fastAF', 'highFPS', 'goodTracking'],
        lensFocalLength: ['70-200mm', '100-400mm', '400mm', '600mm'],
        lensAperture: ['f/2.8', 'f/4', 'f/5.6'],
        priority: ['sports', 'wildlife']
      },
      street: {
        cameraFeatures: ['compact', 'silent', 'fastAF'],
        lensFocalLength: ['35mm', '23mm', '27mm', '50mm'],
        lensAperture: ['f/1.4', 'f/1.8', 'f/2'],
        priority: ['street', 'travel']
      },
      video: {
        cameraFeatures: ['video', 'stabilization', 'flipScreen'],
        lensFocalLength: ['24-70mm', '16-35mm', '50mm'],
        lensAperture: ['f/2.8', 'f/1.8'],
        priority: ['video', 'general']
      },
      wildlife: {
        cameraFeatures: ['fastAF', 'highFPS', 'weatherSealed'],
        lensFocalLength: ['100-400mm', '200-600mm', '400mm', '600mm'],
        lensAperture: ['f/4', 'f/5.6', 'f/6.3'],
        priority: ['wildlife', 'sports']
      }
    };
    
    // 卡口兼容性规则
    this.mountCompatibility = {
      'RF': { native: ['RF'], adapted: ['EF'] },
      'FE': { native: ['FE', 'E'], adapted: [] },
      'Z': { native: ['Z'], adapted: ['F'] },
      'X': { native: ['X'], adapted: [] },
      'L': { native: ['L'], adapted: ['EF', 'R', 'M'] },
      'M43': { native: ['M43'], adapted: [] },
      'GF': { native: ['GF'], adapted: [] }
    };
  }

  /**
   * 生成套装推荐
   * @param {Object} userPrefs 用户偏好
   * @returns {Array} 推荐套装列表
   */
  generateRecommendations(userPrefs) {
    const { budget, subject, experience, brand } = userPrefs;
    
    // 1. 确定预算等级
    const budgetLevel = this.getBudgetLevel(budget);
    const budgetSplit = this.budgetRules[budgetLevel].split;
    
    // 2. 计算各部分预算
    const bodyBudget = budget * budgetSplit.body;
    const lensBudget = budget * budgetSplit.lens;
    
    // 3. 筛选符合条件的相机
    const suitableCameras = this.filterCameras({
      budget: bodyBudget,
      subject,
      experience,
      brand
    });
    
    // 4. 为每台相机匹配镜头
    const combos = [];
    for (const camera of suitableCameras.slice(0, 5)) { // 取前5台
      const lenses = this.matchLenses(camera, subject, lensBudget);
      if (lenses.length > 0) {
        combos.push({
          camera,
          lenses,
          totalPrice: this.calculateTotalPrice(camera, lenses),
          score: this.calculateScore(camera, lenses, subject),
          compatibility: this.checkCompatibility(camera, lenses)
        });
      }
    }
    
    // 5. 按评分排序，返回前3套
    return combos.sort((a, b) => b.score - a.score).slice(0, 3);
  }

  /**
   * 筛选相机
   */
  filterCameras({ budget, subject, experience, brand }) {
    const cameras = [];
    const subjectRule = this.subjectRules[subject];
    
    for (const [brandKey, brandData] of Object.entries(this.cameraDB)) {
      if (brand && brand !== brandKey) continue;
      
      for (const [model, specs] of Object.entries(brandData.models)) {
        // 价格筛选
        const priceRange = this.getPriceRange(specs.price);
        if (priceRange.min > budget || priceRange.max < budget * 0.3) continue;
        
        // 场景匹配度评分
        const subjectScore = this.calculateSubjectScore(specs, subjectRule);
        
        cameras.push({
          brand: brandKey,
          model,
          ...specs,
          subjectScore
        });
      }
    }
    
    // 按场景匹配度排序
    return cameras.sort((a, b) => b.subjectScore - a.subjectScore);
  }

  /**
   * 匹配镜头
   */
  matchLenses(camera, subject, budget) {
    const subjectRule = this.subjectRules[subject];
    const compatibleMounts = this.getCompatibleMounts(camera.mount);
    const lenses = [];
    
    for (const [brand, brandLenses] of Object.entries(this.lensDB)) {
      for (const lens of brandLenses) {
        // 卡口兼容性检查
        if (!compatibleMounts.includes(lens.mount)) continue;
        
        // 预算检查
        if (lens.price > budget) continue;
        
        // 焦段匹配度
        const focalMatch = subjectRule.lensFocalLength.some(fl => 
          lens.focalLength.includes(fl)
        );
        
        // 光圈匹配度
        const apertureMatch = subjectRule.lensAperture.some(ap => 
          lens.aperture && lens.aperture.includes(ap)
        );
        
        lenses.push({
          ...lens,
          matchScore: (focalMatch ? 2 : 0) + (apertureMatch ? 1 : 0),
          compatibility: lens.mount === camera.mount ? 'native' : 'adapted'
        });
      }
    }
    
    // 按匹配度排序，返回前3个
    return lenses.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  }

  /**
   * 获取兼容卡口
   */
  getCompatibleMounts(cameraMount) {
    const compat = this.mountCompatibility[cameraMount];
    if (!compat) return [cameraMount];
    return [...compat.native, ...compat.adapted];
  }

  /**
   * 检查兼容性
   */
  checkCompatibility(camera, lenses) {
    const results = [];
    for (const lens of lenses) {
      if (lens.mount === camera.mount) {
        results.push({ lens, status: 'native', message: '原生兼容' });
      } else if (this.canAdapt(camera.mount, lens.mount)) {
        results.push({ lens, status: 'adapted', message: `需${camera.mount}转${lens.mount}转接环` });
      } else {
        results.push({ lens, status: 'incompatible', message: '不兼容' });
      }
    }
    return results;
  }

  /**
   * 判断是否可转接
   */
  canAdapt(cameraMount, lensMount) {
    const compat = this.mountCompatibility[cameraMount];
    return compat && compat.adapted.includes(lensMount);
  }

  /**
   * 计算场景匹配度
   */
  calculateSubjectScore(cameraSpecs, subjectRule) {
    if (!subjectRule) return 0;
    
    let score = 0;
    
    // 检查相机特性匹配
    for (const feature of subjectRule.cameraFeatures) {
      if (cameraSpecs.bestFor && cameraSpecs.bestFor.includes(feature)) {
        score += 1;
      }
    }
    
    return score;
  }

  /**
   * 计算套装评分
   */
  calculateScore(camera, lenses, subject) {
    let score = camera.subjectScore || 0;
    
    // 镜头匹配度加分
    for (const lens of lenses) {
      score += lens.matchScore || 0;
    }
    
    // 性价比加分（预算内价格越低越好）
    const totalPrice = this.calculateTotalPrice(camera, lenses);
    // 这里简化处理，实际应该根据用户预算计算
    
    return score;
  }

  /**
   * 计算总价
   */
  calculateTotalPrice(camera, lenses) {
    let total = 0;
    // 这里简化处理，实际应该从价格数据库获取
    return total;
  }

  /**
   * 获取预算等级
   */
  getBudgetLevel(budget) {
    if (budget <= 8000) return 'entry';
    if (budget <= 15000) return 'mid';
    if (budget <= 25000) return 'pro';
    return 'flagship';
  }

  /**
   * 获取价格范围
   */
  getPriceRange(priceLevel) {
    const ranges = {
      entry: { min: 3000, max: 8000 },
      mid: { min: 8000, max: 15000 },
      pro: { min: 15000, max: 25000 },
      flagship: { min: 25000, max: 80000 }
    };
    return ranges[priceLevel] || ranges.entry;
  }

  /**
   * 生成场景化预设套装
   */
  generatePresetCombos(subject, budget) {
    const presets = {
      portrait: {
        name: '人像摄影套装',
        description: '适合人像写真、婚礼摄影',
        recommendedBudget: { min: 12000, max: 30000 }
      },
      landscape: {
        name: '风光摄影套装',
        description: '适合风景、建筑、星空摄影',
        recommendedBudget: { min: 15000, max: 40000 }
      },
      street: {
        name: '街头摄影套装',
        description: '轻便、快速、低调',
        recommendedBudget: { min: 8000, max: 20000 }
      },
      sports: {
        name: '运动摄影套装',
        description: '高速连拍、精准对焦',
        recommendedBudget: { min: 20000, max: 60000 }
      },
      video: {
        name: '视频创作套装',
        description: 'Vlog、短片、直播',
        recommendedBudget: { min: 12000, max: 35000 }
      }
    };
    
    return presets[subject] || null;
  }
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComboRecommendationEngine;
}

// 浏览器环境
if (typeof window !== 'undefined') {
  window.ComboRecommendationEngine = ComboRecommendationEngine;
}

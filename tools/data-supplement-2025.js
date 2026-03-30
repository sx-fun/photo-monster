/**
 * Photo Monster 2024-2025 新机型补充数据
 * 用于补充 cameraDatabase 中缺失的新发布机型
 * 
 * 生成时间: 2026-03-30
 * 阶段: 阶段2 - 数据补充
 */

const newGearSupplement2025 = {
  // ==================== Canon 新机型 ====================
  canon: {
    'EOS R6 Mark III': {
      type: 'mirrorless',
      sensor: 'fullframe',
      mp: 24,
      lowLight: 10,
      price: 'pro',
      video: '4K120',
      mount: 'RF',
      bestFor: ['portrait', 'sports', 'video', 'lowlight'],
      releaseDate: '2025-02',
      status: 'announced',
      description: 'R6系列第三代，提升视频和对焦性能'
    },
    'EOS R5 Mark II': {
      type: 'mirrorless',
      sensor: 'fullframe',
      mp: 45,
      lowLight: 9,
      price: 'flagship',
      video: '8K60',
      mount: 'RF',
      bestFor: ['portrait', 'landscape', 'video', 'sports'],
      releaseDate: '2024-08',
      status: 'official',
      description: 'R5升级版，散热和视频性能大幅提升'
    },
    'EOS R7 Mark II': {
      type: 'mirrorless',
      sensor: 'apsc',
      mp: 32,
      lowLight: 8,
      price: 'mid',
      video: '4K60',
      mount: 'RF',
      bestFor: ['sports', 'wildlife', 'video'],
      releaseDate: '2025-06',
      status: 'rumored',
      description: 'APS-C旗舰，预计提升连拍和对焦'
    }
  },

  // ==================== Sony 新机型 ====================
  sony: {
    'A1 II': {
      type: 'mirrorless',
      sensor: 'fullframe',
      mp: 50,
      lowLight: 9,
      price: 'flagship',
      video: '8K30',
      mount: 'FE',
      bestFor: ['sports', 'wildlife', 'video', 'portrait'],
      releaseDate: '2024-11',
      status: 'official',
      description: '索尼旗舰，5010万像素，30fps连拍'
    },
    'A7 VI': {
      type: 'mirrorless',
      sensor: 'fullframe',
      mp: 33,
      lowLight: 9,
      price: 'pro',
      video: '4K60',
      mount: 'FE',
      bestFor: ['general', 'portrait', 'travel', 'video'],
      releaseDate: '2025-09',
      status: 'rumored',
      description: 'A7系列第六代，预计大幅提升AI对焦'
    },
    'A7S IV': {
      type: 'mirrorless',
      sensor: 'fullframe',
      mp: 24,
      lowLight: 10,
      price: 'pro',
      video: '4K120',
      mount: 'FE',
      bestFor: ['video', 'lowlight'],
      releaseDate: '2025-12',
      status: 'rumored',
      description: '视频专机，预计6K视频录制'
    }
  },

  // ==================== Nikon 新机型 ====================
  nikon: {
    'Z6 III': {
      type: 'mirrorless',
      sensor: 'fullframe',
      mp: 24,
      lowLight: 9,
      price: 'pro',
      video: '6K',
      mount: 'Z',
      bestFor: ['general', 'video', 'portrait'],
      releaseDate: '2024-06',
      status: 'official',
      description: '部分堆栈式传感器，6K视频'
    },
    'Z5 II': {
      type: 'mirrorless',
      sensor: 'fullframe',
      mp: 24,
      lowLight: 8,
      price: 'mid',
      video: '4K',
      mount: 'Z',
      bestFor: ['general', 'travel', 'portrait'],
      releaseDate: '2025-04',
      status: 'announced',
      description: '入门级全画幅，性价比之选'
    },
    'Z6 IV': {
      type: 'mirrorless',
      sensor: 'fullframe',
      mp: 33,
      lowLight: 9,
      price: 'pro',
      video: '6K',
      mount: 'Z',
      bestFor: ['general', 'video', 'sports'],
      releaseDate: '2026-01',
      status: 'rumored',
      description: 'Z6系列第四代，预计3300万像素'
    }
  },

  // ==================== Fujifilm 新机型 ====================
  fujifilm: {
    'X-M5': {
      type: 'mirrorless',
      sensor: 'apsc',
      mp: 26,
      lowLight: 7,
      price: 'entry',
      video: '4K',
      mount: 'X',
      bestFor: ['general', 'vlog', 'travel'],
      releaseDate: '2024-10',
      status: 'official',
      description: '入门级无反，轻便小巧'
    },
    'X-T6': {
      type: 'mirrorless',
      sensor: 'apsc',
      mp: 40,
      lowLight: 8,
      price: 'pro',
      video: '4K60',
      mount: 'X',
      bestFor: ['general', 'street', 'travel'],
      releaseDate: '2025-08',
      status: 'rumored',
      description: 'X-T系列新一代，预计4000万像素'
    },
    'X-Pro4': {
      type: 'mirrorless',
      sensor: 'apsc',
      mp: 40,
      lowLight: 8,
      price: 'pro',
      video: '4K',
      mount: 'X',
      bestFor: ['street', 'documentary'],
      releaseDate: '2025-11',
      status: 'rumored',
      description: '旁轴造型，混合取景器'
    },
    'GFX100RF': {
      type: 'mirrorless',
      sensor: 'medium',
      mp: 102,
      lowLight: 7,
      price: 'flagship',
      video: '4K',
      mount: 'GF',
      bestFor: ['portrait', 'landscape', 'commercial'],
      releaseDate: '2025-03',
      status: 'official',
      description: '1亿像素中画幅固定镜头相机'
    }
  },

  // ==================== Panasonic 新机型 ====================
  panasonic: {
    'Lumix S1 II': {
      type: 'mirrorless',
      sensor: 'fullframe',
      mp: 24,
      lowLight: 9,
      price: 'pro',
      video: '6K',
      mount: 'L',
      bestFor: ['video', 'general'],
      releaseDate: '2025-05',
      status: 'rumored',
      description: 'S1系列升级，视频性能提升'
    },
    'Lumix GH7': {
      type: 'mirrorless',
      sensor: 'm43',
      mp: 25,
      lowLight: 7,
      price: 'pro',
      video: '4K120',
      mount: 'M43',
      bestFor: ['video'],
      releaseDate: '2024-06',
      status: 'official',
      description: 'M43视频旗舰，专业视频功能'
    }
  },

  // ==================== OM System 新机型 ====================
  olympus: {
    'OM-3': {
      type: 'mirrorless',
      sensor: 'm43',
      mp: 20,
      lowLight: 7,
      price: 'pro',
      video: '4K',
      mount: 'M43',
      bestFor: ['travel', 'wildlife', 'general'],
      releaseDate: '2025-02',
      status: 'official',
      description: 'OM系统新旗舰，计算摄影功能'
    }
  }
};

// 副厂镜头补充数据
const thirdPartyLensSupplement2025 = {
  sigma: [
    { model: '24-70mm f/2.8 DG DN II', mount: 'FE', type: 'zoom', price: 7999, bestFor: ['general', 'portrait'] },
    { model: '28-45mm f/1.8 DG DN', mount: 'FE', type: 'zoom', price: 8999, bestFor: ['portrait', 'lowlight'] },
    { model: '50mm f/1.2 DG DN', mount: 'RF', type: 'prime', price: 8999, bestFor: ['portrait', 'lowlight'] },
    { model: '70-200mm f/2.8 DG DN OS', mount: 'FE', type: 'zoom', price: 10999, bestFor: ['sports', 'wildlife', 'portrait'] }
  ],
  tamron: [
    { model: '35-150mm f/2-2.8 Z', mount: 'Z', type: 'zoom', price: 12999, bestFor: ['portrait', 'wedding'] },
    { model: '28-300mm f/4-7.1 Z', mount: 'Z', type: 'zoom', price: 6999, bestFor: ['travel', 'general'] },
    { model: '50-400mm f/4.5-6.3 Z', mount: 'Z', type: 'zoom', price: 9999, bestFor: ['wildlife', 'sports'] }
  ],
  viltrox: [
    { model: '75mm f/1.2 Pro', mount: 'X', type: 'prime', price: 3499, bestFor: ['portrait'] },
    { model: '27mm f/1.2 Pro', mount: 'X', type: 'prime', price: 2999, bestFor: ['street', 'general'] },
    { model: '135mm f/1.8 LAB', mount: 'FE', type: 'prime', price: 4999, bestFor: ['portrait'] }
  ]
};

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { newGearSupplement2025, thirdPartyLensSupplement2025 };
}

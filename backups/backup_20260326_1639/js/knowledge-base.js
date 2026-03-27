// Photo Monster - 完整知识库
// 包含所有 20+ 摄影专题的详细内容

console.log('knowledge-base.js 开始加载...');

const KnowledgeBase = {
    // ========== 核心理论 ==========
    composition: {
        title: '构图法则',
        category: '核心理论',
        icon: 'fa-bullseye',
        content: `
            <h3>基础构图法则</h3>
            
            <h4>1. 三分法（Rule of Thirds）</h4>
            <p>三分法是最基础也最实用的构图方法，将画面用两条横线和两条竖线平均分成九宫格，形成4个交点。拍摄时将主体或重要元素放在这些交点或线上，而非画面正中央。</p>
            <ul>
                <li><strong>人物拍摄</strong>：将人物眼睛放在上三分之一线的交点位置</li>
                <li><strong>风景拍摄</strong>：地平线放在上三分之一或下三分之一处</li>
                <li><strong>运动物体</strong>：在物体前进方向预留更多空间</li>
            </ul>
            <p><strong>如何开启辅助线</strong>：大多数相机和手机都可以在设置中开启"网格线"或"九宫格"辅助构图。</p>
            
            <h4>2. 对称构图</h4>
            <p>对称构图通过画面左右或上下的对称关系，营造稳定、庄重、和谐的视觉效果。</p>
            <ul>
                <li><strong>适用场景</strong>：建筑摄影、倒影拍摄、产品摄影</li>
                <li><strong>拍摄技巧</strong>：寻找水面的倒影、建筑的中轴线、镜子的反射</li>
                <li><strong>打破对称</strong>：在对称中加入一个打破平衡的元素，增加趣味性</li>
            </ul>
            
            <h4>3. 引导线构图</h4>
            <p>利用画面中的线条元素引导观众的视线，自然地聚焦到主体上。</p>
            <ul>
                <li><strong>常见引导线</strong>：道路、栏杆、河流、海岸线、走廊、楼梯</li>
                <li><strong>线条类型</strong>：直线（稳定）、曲线（优雅）、汇聚线（纵深感）</li>
                <li><strong>拍摄角度</strong>：低角度可以增强线条的延伸感</li>
            </ul>
            
            <h4>4. 框架构图</h4>
            <p>利用前景元素形成"画框"，将主体框在中间，增加画面的层次感和纵深感。</p>
            <ul>
                <li><strong>天然框架</strong>：门窗、树枝、山洞、拱门</li>
                <li><strong>人工框架</strong>：相框、镜子、围栏</li>
                <li><strong>虚化框架</strong>：用大光圈虚化前景，形成色彩框架</li>
            </ul>
            
            <h4>5. 留白构图</h4>
            <p>留白不是空白，而是有意留下的视觉呼吸空间，可以营造意境、突出主体、引发想象。</p>
            <ul>
                <li><strong>人物留白</strong>：人物视线方向预留空间</li>
                <li><strong>运动留白</strong>：物体运动方向预留空间</li>
                <li><strong>意境留白</strong>：极简风格，大面积留白突出主体</li>
            </ul>
            
            <h3>进阶构图技巧</h3>
            
            <h4>黄金螺旋（斐波那契螺旋）</h4>
            <p>基于斐波那契数列（1,1,2,3,5,8,13...）绘制的螺旋线，被认为是最符合人眼审美的构图方式。将主体放在螺旋的终点位置，可以创造出自然和谐的视觉效果。</p>
            
            <h4>三角形构图</h4>
            <p>利用画面中的三个主要元素形成三角形，可以是正三角（稳定庄重）、倒三角（动感张力）或斜三角（灵活生动）。</p>
            
            <h4>对角线构图</h4>
            <p>将主体沿画面对角线方向排列，可以增强画面的动感和活力，适合表现运动、力量、延伸感。</p>
            
            <h4>重复与节奏</h4>
            <p>利用重复的元素创造韵律感，可以是完全相同元素的重复，也可以是渐变、交错的重复模式。</p>
            
            <h3>构图注意事项</h3>
            <ul>
                <li>不要让地平线从人物脖子处穿过</li>
                <li>避免画面边缘切割关节（脖子、膝盖、手腕）</li>
                <li>注意背景中的干扰元素（树枝、电线）</li>
                <li>学会先遵守规则，再打破规则</li>
            </ul>
        `,
        tips: ['初学者先掌握三分法和对称构图', '拍摄前先观察画面边缘', '多尝试不同角度和高度', '后期裁剪也是二次构图的机会']
    },
    
    lighting: {
        title: '光线运用',
        category: '核心理论',
        icon: 'fa-sun',
        content: `
            <h3>光的性质</h3>
            
            <h4>硬光（直射光）</h4>
            <p>硬光来自小光源或直射光源，光线方向性强，阴影边缘清晰锐利，明暗对比强烈。</p>
            <ul>
                <li><strong>特点</strong>：质感强烈、纹理清晰、立体感强</li>
                <li><strong>适用</strong>：表现质感（皮肤纹理、金属质感）、创造戏剧性效果</li>
                <li><strong>来源</strong>：正午阳光、裸灯闪光灯、聚光灯</li>
                <li><strong>注意事项</strong>：容易产生过重的阴影，人像拍摄可能显得过于 harsh</li>
            </ul>
            
            <h4>软光（漫射光）</h4>
            <p>软光来自大光源或经过漫射的光线，阴影边缘柔和过渡，明暗对比小。</p>
            <ul>
                <li><strong>特点</strong>：柔和均匀、阴影淡化、适合表现细节</li>
                <li><strong>适用</strong>：人像摄影、产品摄影、需要柔和氛围的场景</li>
                <li><strong>来源</strong>：阴天、阴影处、柔光箱、反光板补光</li>
                <li><strong>优势</strong>：对皮肤瑕疵友好，减少皱纹和毛孔的明显程度</li>
            </ul>
            
            <h4>硬光转软光的方法</h4>
            <ul>
                <li>使用柔光箱、硫酸纸、白布等漫射材料</li>
                <li>利用墙壁、天花板进行跳闪</li>
                <li>在阴影处拍摄，利用环境反射光</li>
                <li>使用反光板进行补光，柔化阴影</li>
            </ul>
            
            <h3>自然光时段详解</h3>
            
            <h4>黄金时刻（Golden Hour）</h4>
            <p>日出后1小时和日落前1小时，太阳角度低，光线柔和温暖，是摄影的最佳时段。</p>
            <ul>
                <li><strong>光线特点</strong>：色温约3000-4000K，呈暖黄色，角度低形成长阴影</li>
                <li><strong>拍摄效果</strong>：画面温暖、层次丰富、立体感强</li>
                <li><strong>适用题材</strong>：人像、风光、建筑、街拍</li>
                <li><strong>拍摄技巧</strong>：逆光拍摄可产生轮廓光，侧光强调质感</li>
            </ul>
            
            <h4>蓝调时刻（Blue Hour）</h4>
            <p>日落后20-40分钟和日出前20-40分钟，天空呈现深蓝色，与地面暖光形成冷暖对比。</p>
            <ul>
                <li><strong>光线特点</strong>：天空呈深蓝紫色，城市灯光已亮</li>
                <li><strong>拍摄效果</strong>：冷暖对比强烈，氛围神秘浪漫</li>
                <li><strong>适用题材</strong>：城市夜景、建筑摄影、灯光人像</li>
                <li><strong>注意事项</strong>：时间窗口短，需要提前准备</li>
            </ul>
            
            <h4>正午光线</h4>
            <p>太阳位于头顶正上方，光线强烈且方向垂直，通常被认为是最难拍摄的时段。</p>
            <ul>
                <li><strong>问题</strong>：顶光造成眼窝阴影、鼻子下方阴影、整体对比度过高</li>
                <li><strong>解决方案</strong>：寻找阴影处、使用反光板补光、拍摄黑白照片、拍摄建筑细节</li>
                <li><strong>创意利用</strong>：利用强烈阴影创造几何图案、拍摄高对比度黑白作品</li>
            </ul>
            
            <h4>阴天光线</h4>
            <p>云层成为天然的柔光箱，光线均匀柔和，是拍摄人像的理想光线。</p>
            <ul>
                <li><strong>优势</strong>：光线柔和无方向、色温稳定、全天可拍摄</li>
                <li><strong>劣势</strong>：画面可能显得平淡、缺乏层次</li>
                <li><strong>改善方法</strong>：寻找有方向性的漫射光（如靠近建筑物）、后期增加对比度</li>
            </ul>
            
            <h3>光位（光线的方向）</h3>
            
            <h4>顺光（正面光）</h4>
            <p>光源位于相机后方，直接照射被摄体正面。</p>
            <ul>
                <li><strong>效果</strong>：色彩还原好、细节清晰、但立体感差</li>
                <li><strong>适用</strong>：证件照、产品摄影、需要清晰记录的场景</li>
                <li><strong>缺点</strong>：画面扁平、缺乏层次、容易显得平淡</li>
            </ul>
            
            <h4>侧光（45度侧光）</h4>
            <p>光源位于被摄体侧面约45度角，是最常用的光位之一。</p>
            <ul>
                <li><strong>效果</strong>：立体感强、明暗对比适中、质感表现好</li>
                <li><strong>适用</strong>：人像摄影（经典布光）、风光摄影、静物摄影</li>
                <li><strong>变体</strong>：90度侧光（戏剧性更强，适合黑白）</li>
            </ul>
            
            <h4>逆光（轮廓光）</h4>
            <p>光源位于被摄体后方，相机对着光源拍摄。</p>
            <ul>
                <li><strong>效果1 - 轮廓光</strong>：主体边缘产生金色轮廓，画面通透</li>
                <li><strong>效果2 - 剪影</strong>：主体完全变黑，形成强烈图形感</li>
                <li><strong>效果3 - 透光</strong>：半透明物体（花瓣、树叶）呈现通透质感</li>
                <li><strong>拍摄技巧</strong>：需要给主体补光（反光板或闪光灯），或使用点测光对准主体</li>
            </ul>
            
            <h4>侧逆光</h4>
            <p>光源位于被摄体侧后方，结合了侧光和逆光的优点。</p>
            <ul>
                <li><strong>效果</strong>：既有轮廓光又有立体感，是最 flattering 的人像光位</li>
                <li><strong>黄金时刻侧逆光</strong>：可以拍出头发的金色轮廓，非常唯美</li>
            </ul>
            
            <h3>人工光源基础</h3>
            
            <h4>持续光源 vs 闪光灯</h4>
            <ul>
                <li><strong>持续光源</strong>（LED灯、钨丝灯）：所见即所得，适合视频和初学者</li>
                <li><strong>闪光灯</strong>：功率大、凝固动作，但需要经验预判效果</li>
            </ul>
            
            <h4>常用灯光配件</h4>
            <ul>
                <li><strong>柔光箱</strong>：将硬光变为软光，尺寸越大光线越柔和</li>
                <li><strong>反光伞</strong>：便携的柔光工具，银色增加对比，白色更柔和</li>
                <li><strong>反光板</strong>：五合一反光板（金、银、白、黑、柔光）最实用</li>
                <li><strong>蜂巢/格栅</strong>：控制光线扩散范围，创造聚光效果</li>
                <li><strong>硫酸纸/柔光布</strong>：大面积柔化光线</li>
            </ul>
        `,
        tips: ['黄金时刻是一天中最佳的拍摄时间', '学会利用阴影，而不是避开阴影', '逆光拍摄时记得给主体补光', '阴天是拍摄人像的理想天气']
    },
    
    color: {
        title: '色彩理论',
        category: '核心理论',
        icon: 'fa-palette',
        content: `
            <h3>色彩基础</h3>
            
            <h4>色温（Color Temperature）</h4>
            <p>色温用于描述光源的颜色特性，单位为开尔文（K）。不同色温会给人完全不同的视觉感受和情绪体验。</p>
            <ul>
                <li><strong>低色温（2700K-3500K）</strong>：暖黄色调，如白炽灯、烛光、日出日落。给人温馨、舒适、复古的感觉，适合家居、餐厅、人像摄影。</li>
                <li><strong>中色温（5000K-5500K）</strong>：自然白光，接近正午阳光。色彩还原准确，适合产品摄影、证件照。</li>
                <li><strong>高色温（6500K-8000K）</strong>：冷蓝白色调，如阴天、阴影处、荧光灯。给人清爽、冷静、科技的感觉，适合科技产品、医疗场景。</li>
            </ul>
            <p><strong>白平衡设置</strong>：相机通过调整白平衡来校正色温。使用RAW格式拍摄可以在后期自由调整白平衡。</p>
            
            <h4>色相、饱和度、明度（HSB/HSV）</h4>
            <ul>
                <li><strong>色相（Hue）</strong>：颜色的种类，如红、黄、蓝。色环上0-360度的位置。</li>
                <li><strong>饱和度（Saturation）</strong>：颜色的纯度，0%为灰色，100%为纯色。高饱和度鲜艳夺目，低饱和度淡雅高级。</li>
                <li><strong>明度（Brightness/Value）</strong>：颜色的明暗程度。高明度清新通透，低明度沉稳厚重。</li>
            </ul>
            
            <h3>配色方案</h3>
            
            <h4>互补色配色（Complementary）</h4>
            <p>色环上相对的两种颜色（180度），形成强烈对比。</p>
            <ul>
                <li><strong>经典组合</strong>：红-绿、蓝-橙、黄-紫</li>
                <li><strong>视觉效果</strong>：对比强烈、视觉冲击力大、画面活泼</li>
                <li><strong>使用技巧</strong>：一种颜色为主（70%），另一种为点缀（30%），避免1:1比例造成视觉疲劳</li>
                <li><strong>摄影应用</strong>：蓝调时刻的橙蓝对比、秋天红叶与蓝天的对比</li>
            </ul>
            
            <h4>类似色配色（Analogous）</h4>
            <p>色环上相邻的2-3种颜色（30-60度），和谐统一。</p>
            <ul>
                <li><strong>经典组合</strong>：黄-黄绿-绿、红-橙红-橙、蓝-蓝紫-紫</li>
                <li><strong>视觉效果</strong>：和谐舒适、过渡自然、氛围统一</li>
                <li><strong>使用技巧</strong>：选择一个主色，其他为辅助色</li>
                <li><strong>摄影应用</strong>：日落时分的橙红黄渐变、森林中的绿色层次</li>
            </ul>
            
            <h4>单色调配色（Monochromatic）</h4>
            <p>同一色相的不同明度和饱和度变化。</p>
            <ul>
                <li><strong>视觉效果</strong>：简约高级、统一和谐、情绪纯粹</li>
                <li><strong>使用技巧</strong>：通过明度对比创造层次，避免画面单调</li>
                <li><strong>摄影应用</strong>：雾中风景、雪景、极简风格摄影</li>
            </ul>
            
            <h4>冷暖对比</h4>
            <p>利用冷色（蓝、绿、紫）和暖色（红、橙、黄）的对比增强画面张力。</p>
            <ul>
                <li><strong>自然场景</strong>：夕阳（暖）与天空（冷）、篝火（暖）与夜晚（冷）</li>
                <li><strong>人工场景</strong>：室内暖光与窗外冷光、霓虹灯的色彩对比</li>
                <li><strong>后期技巧</strong>：分离色调（高光加暖、阴影加冷）增强立体感</li>
            </ul>
            
            <h4>三角形配色（Triadic）</h4>
            <p>色环上等距的三种颜色（120度），色彩丰富但平衡。</p>
            <ul>
                <li><strong>经典组合</strong>：红-黄-蓝（三原色）、橙-绿-紫（三间色）</li>
                <li><strong>视觉效果</strong>：色彩丰富、活泼生动、视觉平衡</li>
                <li><strong>使用技巧</strong>：需要控制各颜色的比例和饱和度，避免过于花哨</li>
            </ul>
            
            <h3>色彩情感与心理</h3>
            
            <h4>红色系</h4>
            <ul>
                <li><strong>情感</strong>：热情、爱情、危险、力量、喜庆</li>
                <li><strong>应用</strong>：婚礼、节日、运动、美食摄影</li>
                <li><strong>注意</strong>：大面积红色容易产生压迫感</li>
            </ul>
            
            <h4>蓝色系</h4>
            <ul>
                <li><strong>情感</strong>：冷静、忧郁、科技、信任、深邃</li>
                <li><strong>应用</strong>：科技产品、商务人像、海洋摄影</li>
                <li><strong>注意</strong>：食物摄影中蓝色会降低食欲</li>
            </ul>
            
            <h4>黄色系</h4>
            <ul>
                <li><strong>情感</strong>：温暖、活力、快乐、警示、阳光</li>
                <li><strong>应用</strong>：儿童摄影、美食、秋季风景</li>
                <li><strong>注意</strong>：明度高的黄色容易过曝</li>
            </ul>
            
            <h4>绿色系</h4>
            <ul>
                <li><strong>情感</strong>：自然、和平、生长、健康、清新</li>
                <li><strong>应用</strong>：自然风光、有机食品、环保主题</li>
                <li><strong>注意</strong>：人眼对绿色最敏感，容易成为视觉焦点</li>
            </ul>
            
            <h4>黑白灰</h4>
            <ul>
                <li><strong>情感</strong>：经典、永恒、严肃、高雅、纯粹</li>
                <li><strong>优势</strong>：去除色彩干扰，强调光影和构图</li>
                <li><strong>适用</strong>：纪实摄影、建筑摄影、人像摄影</li>
            </ul>
            
            <h3>摄影中的色彩控制</h3>
            
            <h4>前期控制</h4>
            <ul>
                <li><strong>服装搭配</strong>：人像摄影中让模特穿着与环境协调或对比的服装</li>
                <li><strong>道具选择</strong>：选择与主题色彩相符的道具</li>
                <li><strong>拍摄时间</strong>：黄金时刻偏暖、阴天偏冷</li>
                <li><strong>滤镜使用</strong>：偏振镜增强色彩饱和度、ND镜延长曝光创造柔和效果</li>
            </ul>
            
            <h4>后期调色</h4>
            <ul>
                <li><strong>白平衡</strong>：校正色温，或故意偏移创造氛围</li>
                <li><strong>HSL调整</strong>：单独调整特定颜色的色相、饱和度、明度</li>
                <li><strong>分离色调</strong>：高光和阴影分别着色，创造冷暖对比</li>
                <li><strong>色彩分级</strong>：阴影偏蓝、高光偏橙是好莱坞电影常用套路</li>
                <li><strong>色调曲线</strong>：通过RGB曲线精确控制色彩</li>
            </ul>
        `,
        tips: ['黄金时刻的自然暖色调最适合人像', '蓝调时刻的冷暖对比是城市夜景的经典配色', '后期调色前先确定照片的情绪基调', '不要过度饱和，保持色彩的自然感']
    },
    
    pillars: {
        title: '五大维度',
        category: '核心理论',
        icon: 'fa-star',
        content: `
            <h3>Photo Monster 点评体系</h3>
            
            <h4>1. 构图 (Composition)</h4>
            <p>画面元素的安排与组织，包括主体位置、线条运用、空间分配等。</p>
            <ul>
                <li>主体是否突出</li>
                <li>画面是否平衡</li>
                <li>是否有视觉引导</li>
            </ul>
            
            <h4>2. 光影 (Lighting)</h4>
            <p>光线的方向、性质、强度对画面的影响。</p>
            <ul>
                <li>光位选择是否恰当</li>
                <li>明暗层次是否丰富</li>
                <li>光影是否服务于主题</li>
            </ul>
            
            <h4>3. 色彩 (Color)</h4>
            <p>色调、饱和度、对比度的运用。</p>
            <ul>
                <li>色彩搭配是否和谐</li>
                <li>色温是否准确</li>
                <li>色彩是否传达情绪</li>
            </ul>
            
            <h4>4. 技术 (Technical)</h4>
            <p>曝光、对焦、清晰度等技术指标。</p>
            <ul>
                <li>曝光是否准确</li>
                <li>焦点是否清晰</li>
                <li>噪点控制是否得当</li>
            </ul>
            
            <h4>5. 情感 (Emotion)</h4>
            <p>照片传达的情感和故事性。</p>
            <ul>
                <li>是否有明确的主题</li>
                <li>是否能引起共鸣</li>
                <li>瞬间捕捉是否到位</li>
            </ul>
        `,
        tips: ['五个维度相互影响', '技术服务于表达', '情感是最难也是最重要的']
    },
    
    // ========== 技术基础 ==========
    technical: {
        title: '曝光三角',
        category: '技术基础',
        icon: 'fa-sliders-h',
        content: `
            <h3>曝光三要素详解</h3>
            <p>曝光三角是摄影曝光控制的三个核心参数：光圈、快门速度、ISO。三者相互关联，共同决定照片的曝光量。改变其中一个参数，必须相应调整其他参数来保持曝光平衡。</p>
            
            <h4>1. 光圈 (Aperture)</h4>
            <p>光圈是镜头中控制进光孔径大小的装置，用f值表示（如f/1.4、f/2.8、f/8）。光圈同时影响进光量和景深。</p>
            
            <h5>光圈数值规律</h5>
            <ul>
                <li><strong>f值越小，光圈越大</strong>：f/1.4是大光圈，f/22是小光圈</li>
                <li><strong>每档光圈相差√2倍</strong>：f/1.4 → f/2 → f/2.8 → f/4 → f/5.6 → f/8 → f/11 → f/16</li>
                <li><strong>每档进光量相差一倍</strong>：f/2.8的进光量是f/4的两倍</li>
            </ul>
            
            <h5>大光圈（f/1.2 - f/2.8）</h5>
            <ul>
                <li><strong>进光量大</strong>：适合暗光环境，可以使用更低ISO</li>
                <li><strong>景深浅</strong>：背景虚化明显，主体突出</li>
                <li><strong>适用场景</strong>：人像摄影、弱光环境、需要分离主体的场景</li>
                <li><strong>注意事项</strong>：景深极浅时对焦点要精准，边缘画质可能下降</li>
            </ul>
            
            <h5>中等光圈（f/4 - f/8）</h5>
            <ul>
                <li><strong>画质最佳</strong>：大多数镜头的最佳画质光圈范围</li>
                <li><strong>景深适中</strong>：既能突出主体，又能保留一定环境信息</li>
                <li><strong>适用场景</strong>：日常拍摄、街拍、环境人像</li>
            </ul>
            
            <h5>小光圈（f/11 - f/16+）</h5>
            <ul>
                <li><strong>景深大</strong>：从前景到背景都清晰</li>
                <li><strong>星芒效果</strong>：点光源会产生漂亮的星芒</li>
                <li><strong>适用场景</strong>：风光摄影、集体照、需要清晰交代环境的场景</li>
                <li><strong>注意事项</strong>：f/16以后可能出现衍射现象，画质反而下降</li>
            </ul>
            
            <h4>2. 快门速度 (Shutter Speed)</h4>
            <p>快门速度控制感光元件曝光的时间长度，影响进光量和运动物体的呈现方式。</p>
            
            <h5>高速快门（1/500秒以上）</h5>
            <ul>
                <li><strong>效果</strong>：冻结快速运动的物体</li>
                <li><strong>适用场景</strong>：体育运动、野生动物、飞溅的水花、跳跃瞬间</li>
                <li><strong>常用速度</strong>：跑步1/500s、汽车1/1000s、鸟类飞行1/2000s</li>
            </ul>
            
            <h5>中速快门（1/60秒 - 1/250秒）</h5>
            <ul>
                <li><strong>效果</strong>：日常拍摄的标准速度</li>
                <li><strong>安全快门</strong>：通常不低于镜头焦距的倒数（如50mm镜头不低于1/50s）</li>
                <li><strong>防抖补偿</strong>：有防抖功能可以放慢2-5档快门</li>
            </ul>
            
            <h5>慢速快门（1/30秒以下）</h5>
            <ul>
                <li><strong>动态模糊</strong>：记录运动轨迹，如车流光轨、丝绢流水</li>
                <li><strong>追焦拍摄</strong：移动相机跟随主体，背景产生动感模糊</li>
                <li><strong>注意事项</strong>：必须使用三脚架，或配合防抖技术</li>
                <li><strong>常用场景</strong>：瀑布（1-2秒）、车轨（10-30秒）、星轨（数分钟）</li>
            </ul>
            
            <h4>3. ISO 感光度</h4>
            <p>ISO表示感光元件对光线的敏感程度。ISO越高，感光越敏感，但噪点也会增加。</p>
            
            <h5>ISO等级划分</h5>
            <ul>
                <li><strong>低ISO（100-400）</strong>：画质最佳、动态范围最大、噪点最少。光线充足时的首选。</li>
                <li><strong>中ISO（800-3200）</strong>：画质可接受，适合阴天室内等中等光线环境。现代相机在此范围表现良好。</li>
                <li><strong>高ISO（6400-12800）</strong>：噪点明显，但在必要时（如新闻摄影、弱光抓拍）可以使用。</li>
                <li><strong>超高ISO（25600+）</strong>：画质严重下降，仅在极端情况下使用。</li>
            </ul>
            
            <h5>ISO使用原则</h5>
            <ul>
                <li><strong>能用低ISO就不用高ISO</strong>：始终从基础ISO开始</li>
                <li><strong>优先保证快门速度</strong>：如果光圈已经最大，宁可提高ISO也不要让快门过低导致模糊</li>
                <li><strong>了解相机极限</strong>：每款相机的高感表现不同，了解自己相机的可用ISO上限</li>
                <li><strong>RAW格式优势</strong>：RAW文件比JPEG有更大的降噪空间</li>
            </ul>
            
            <h4>曝光三要素的相互关系</h4>
            <p>三个参数通过"挡位"（Stop）相互关联。增加一挡曝光（更多光）可以通过以下任一方式实现：</p>
            <ul>
                <li>光圈放大一档（如f/8 → f/5.6）</li>
                <li>快门放慢一档（如1/250s → 1/125s）</li>
                <li>ISO提高一档（如ISO 400 → ISO 800）</li>
            </ul>
            <p>反之亦然。这就是曝光三角的平衡关系。</p>
            
            <h4>实际拍摄中的参数选择策略</h4>
            
            <h5>人像摄影</h5>
            <ul>
                <li><strong>优先</strong>：大光圈（f/1.4-f/2.8）获得背景虚化</li>
                <li><strong>其次</strong>：保证快门速度（1/125s以上）防止人物移动模糊</li>
                <li><strong>最后</strong>：调整ISO满足曝光需求</li>
            </ul>
            
            <h5>风光摄影</h5>
            <ul>
                <li><strong>优先</strong>：低ISO（100-200）获得最佳画质</li>
                <li><strong>其次</strong>：小光圈（f/8-f/11）获得大景深</li>
                <li><strong>最后</strong>：使用三脚架，快门速度不重要</li>
            </ul>
            
            <h5>运动摄影</h5>
            <ul>
                <li><strong>优先</strong>：高速快门（1/1000s以上）冻结动作</li>
                <li><strong>其次</strong>：大光圈增加进光量</li>
                <li><strong>最后</strong>：必要时提高ISO</li>
            </ul>
            
            <h4>曝光模式选择</h4>
            <ul>
                <li><strong>手动模式（M）</strong>：完全控制三个参数，适合固定光线环境</li>
                <li><strong>光圈优先（A/Av）</strong>：手动设置光圈，相机自动匹配快门，最常用</li>
                <li><strong>快门优先（S/Tv）</strong>：手动设置快门，相机自动匹配光圈，适合运动摄影</li>
                <li><strong>程序自动（P）</strong>：相机自动设置光圈快门，可快速调整</li>
            </ul>
        `,
        tips: ['记住曝光三角的平衡关系：改变一个参数必须相应调整其他参数', '优先保证ISO最低，其次考虑光圈需求，最后调整快门', '使用光圈优先模式可以应对90%的拍摄场景', '拍摄前检查直方图，确保曝光准确']
    },
    
    equipment: {
        title: '器材选购',
        category: '技术基础',
        icon: 'fa-camera',
        content: `
            <h3>相机机身选择</h3>
            
            <h4>画幅对比</h4>
            <p>画幅指感光元件的尺寸，是影响画质、景深、高感表现的核心因素。</p>
            
            <h5>中画幅（44×33mm或更大）</h5>
            <ul>
                <li><strong>代表机型</strong>：富士GFX 100S/100 II/50S II、哈苏X2D 100C/X1D II 50C</li>
                <li><strong>优势</strong>：极致画质（1亿像素）、商业广告首选、宽容度极高</li>
                <li><strong>劣势</strong>：价格昂贵（3-10万）、体积大、对焦相对慢</li>
                <li><strong>适用</strong>：商业摄影、风光摄影、追求极致画质的用户</li>
                <li><strong>推荐机型</strong>：富士GFX 100 II（1亿像素+8K视频）、哈苏X2D 100C（自然色彩解决方案）</li>
            </ul>
            
            <h5>全画幅（36×24mm）</h5>
            <ul>
                <li><strong>代表机型</strong>：索尼A7系列、佳能R系列、尼康Z系列</li>
                <li><strong>优势</strong>：画质优秀、高感好（ISO 6400可用）、景深控制灵活</li>
                <li><strong>劣势</strong>：机身和镜头价格较高、体积重量较大</li>
                <li><strong>适用</strong>：专业摄影师、发烧友、追求画质与便携平衡的用户</li>
                <li><strong>入门推荐</strong>：索尼A7C II（小巧）、佳能R8（性价比）、尼康Z5</li>
                <li><strong>专业推荐</strong>：索尼A7R V（6100万像素）、佳能R5 II（8K视频）、尼康Z8/Z9（旗舰性能）</li>
                <li><strong>视频推荐</strong>：索尼ZV-E1（全画幅Vlog）、松下S5 IIx（专业视频）</li>
            </ul>
            
            <h5>APS-C画幅（约23.5×15.6mm）</h5>
            <ul>
                <li><strong>代表机型</strong>：索尼A6000系列、富士X系列、佳能R7/R10/R50、尼康Z50/Z30</li>
                <li><strong>优势</strong>：性价比高（3000-8000元）、轻便、长焦有1.5倍等效优势</li>
                <li><strong>劣势</strong>：高感比全画幅差1-2档、虚化能力较弱</li>
                <li><strong>适用</strong>：摄影初学者、旅行摄影、需要轻便设备的用户</li>
                <li><strong>入门推荐</strong>：索尼ZV-E10 II（视频强）、富士X-M5/X-T30 II（直出色彩好）、佳能R50（易用）</li>
                <li><strong>性能推荐</strong>：富士X-T5/X-H2（4000万像素）、索尼A6700（AI对焦）、佳能R7（高速连拍）</li>
            </ul>
            
            <h5>M43画幅（17.3×13mm）</h5>
            <ul>
                <li><strong>代表机型</strong>：奥林巴斯OM-1/OM-5、松下GH6/G9 II</li>
                <li><strong>优势</strong>：极致轻便、防抖性能最强、镜头群丰富且便宜</li>
                <li><strong>劣势</strong>：高感较弱、虚化能力有限</li>
                <li><strong>适用</strong>：旅行摄影、视频拍摄、追求轻便的用户</li>
                <li><strong>视频推荐</strong>：松下GH6（5.7K录制）、松下G9 II（相位对焦）</li>
                <li><strong>拍照推荐</strong>：奥林巴斯OM-1（计算摄影）、奥林巴斯OM-5（轻便）</li>
            </ul>
            
            <h4>单反 vs 微单</h4>
            <p>微单（无反相机）已成为主流，单反逐渐退出市场。</p>
            <ul>
                <li><strong>微单优势</strong>：体积小巧、电子取景器所见即所得、视频性能强、对焦覆盖广</li>
                <li><strong>单反现状</strong>：佳能、尼康已停止新单反研发，仅二手市场流通</li>
                <li><strong>购买建议</strong>：2024年后强烈建议购买微单</li>
            </ul>
            
            <h3>镜头选购指南</h3>
            
            <h4>定焦镜头（Prime Lens）</h4>
            <p>焦距固定，通常光圈更大、画质更好、价格更亲民。</p>
            
            <h5>35mm 定焦</h5>
            <ul>
                <li><strong>视角</strong>：约63度，接近人眼自然视角</li>
                <li><strong>特点</strong>：环境感强、适合叙事</li>
                <li><strong>适用</strong>：人文纪实、环境人像、街头摄影、vlog</li>
                <li><strong>推荐</strong>：索尼35mm f/1.8、佳能RF 35mm f/1.8、适马35mm f/1.4</li>
            </ul>
            
            <h5>50mm 定焦（标准镜头）</h5>
            <ul>
                <li><strong>视角</strong>：约46度，最接近单眼视角</li>
                <li><strong>特点</strong>：透视自然、进可攻退可守</li>
                <li><strong>适用</strong>：万能挂机头、入门首选、日常记录</li>
                <li><strong>推荐</strong>：各品牌50mm f/1.8（"小痰盂"，仅几百元，性价比之王）</li>
            </ul>
            
            <h5>85mm 定焦（人像镜皇）</h5>
            <ul>
                <li><strong>视角</strong>：约28度，中长焦压缩感</li>
                <li><strong>特点</strong>：人像黄金焦段、背景虚化美丽、面部透视 flattering</li>
                <li><strong>适用</strong>：人像摄影、特写、婚礼摄影</li>
                <li><strong>推荐</strong>：索尼85mm f/1.8、佳能RF 85mm f/2、适马85mm f/1.4</li>
            </ul>
            
            <h4>变焦镜头（Zoom Lens）</h4>
            <p>焦距可变，使用灵活，适合需要快速构图的场景。</p>
            
            <h5>标准变焦（24-70mm f/2.8 或 f/4）</h5>
            <ul>
                <li><strong>覆盖焦段</strong>：广角到短长焦，最常用的焦段范围</li>
                <li><strong>适用</strong>：挂机头、旅行、婚礼、活动摄影</li>
                <li><strong>选择</strong>：f/2.8版本更重更贵但光圈大；f/4版本轻便便宜</li>
                <li><strong>推荐</strong>：腾龙28-75mm f/2.8（性价比高）、各品牌24-70mm f/2.8</li>
            </ul>
            
            <h5>长焦变焦（70-200mm f/2.8 或 f/4）</h5>
            <ul>
                <li><strong>特点</strong>：空间压缩感、背景虚化强</li>
                <li><strong>适用</strong>：人像摄影、运动摄影、野生动物、舞台演出</li>
                <li><strong>推荐</strong>：各品牌70-200mm f/2.8（专业之选）、70-200mm f/4（轻便之选）</li>
            </ul>
            
            <h5>广角变焦（16-35mm f/2.8 或 f/4）</h5>
            <ul>
                <li><strong>特点</strong>：视野宽广、透视夸张</li>
                <li><strong>适用</strong>：风光摄影、建筑摄影、星空摄影、环境人像</li>
                <li><strong>注意</strong>：边缘变形明显，人像拍摄慎用</li>
            </ul>
            
            <h3>配件选购</h3>
            
            <h4>三脚架</h4>
            <ul>
                <li><strong>材质</strong>：碳纤维（轻贵）vs 铝合金（重便宜）</li>
                <li><strong>云台</strong>：球形云台（灵活）vs 液压云台（视频）</li>
                <li><strong>推荐</strong>：思锐、百诺、马小路（国产性价比高）</li>
            </ul>
            
            <h4>滤镜</h4>
            <ul>
                <li><strong>UV镜</strong>：保护镜头前组，建议购买多层镀膜</li>
                <li><strong>偏振镜（CPL）</strong>：消除反光、增强色彩饱和度、压暗天空</li>
                <li><strong>ND减光镜</strong>：减少进光量，用于长曝光（ND1000拍流水、车轨）</li>
                <li><strong>渐变镜（GND）</strong>：平衡天空和地面光比</li>
            </ul>
            
            <h4>存储卡</h4>
            <ul>
                <li><strong>容量</strong>：64GB起步，建议128GB或256GB</li>
                <li><strong>速度</strong>：V30以上（拍视频）、V60/V90（4K高码率）</li>
                <li><strong>品牌</strong>：闪迪、三星、雷克沙</li>
            </ul>
            
            <h4>相机包</h4>
            <ul>
                <li><strong>双肩包</strong>：容量大，适合长途旅行</li>
                <li><strong>单肩包</strong>：取机方便，适合城市街拍</li>
                <li><strong>内胆包</strong>：可放入普通背包，轻便灵活</li>
            </ul>
            
            <h3>购买建议</h3>
            <ul>
                <li><strong>预算分配</strong>：机身:镜头:配件 = 4:4:2</li>
                <li><strong>先定焦后变焦</strong>：先买50mm f/1.8练手，再根据需要添置</li>
                <li><strong>镜头比机身重要</strong>：好镜头可以用10年，机身3-5年就换代</li>
                <li><strong>考虑系统生态</strong>：购买前看该品牌的镜头群是否丰富</li>
                <li><strong>二手市场</strong>：镜头保值，可以考虑二手；机身建议买新</li>
            </ul>
        `,
        tips: ['新手第一支镜头推荐50mm f/1.8，性价比之王', '预算有限时优先投资镜头', '三脚架买贵的，相机包买合适的', '存储卡一定要买高速的，否则会影响连拍和视频']
    },
    
    'post-processing': {
        title: '后期处理',
        category: '技术基础',
        icon: 'fa-magic',
        content: `
            <h3>Lightroom 完整工作流程</h3>
            <p>Lightroom是摄影师最常用的后期软件，集图片管理、批量处理、调色输出于一体。</p>
            
            <h4>第一步：导入与筛选</h4>
            <ul>
                <li><strong>导入设置</strong>：选择复制到指定位置，按日期自动建立文件夹</li>
                <li><strong>文件重命名</strong>：建议"日期_序号"格式，如20240321_001</li>
                <li><strong>添加关键词</strong>：导入时批量添加通用标签（地点、活动）</li>
                <li><strong>快速筛选</strong>：按X拒绝，按P留用，按数字键1-5评级</li>
                <li><strong>色标分类</strong>：红-精修，黄-待处理，绿-已完成</li>
            </ul>
            
            <h4>第二步：基础调整</h4>
            <p>基本面板是最常用的调整区域，从上到下依次调整。</p>
            <ul>
                <li><strong>白平衡</strong>：用吸管点击画面中的中性灰区域自动校正</li>
                <li><strong>色温/色调</strong>：向左偏蓝（冷），向右偏黄（暖）</li>
                <li><strong>曝光度</strong>：整体亮度调整，优先使用此滑块</li>
                <li><strong>对比度</strong>：控制明暗差异，建议适度，不要过度</li>
                <li><strong>高光/阴影</strong>：分别恢复亮部和暗部细节（RAW文件优势）</li>
                <li><strong>白色/黑色</strong>：设定画面的最白和最黑点，按住Alt键观察</li>
                <li><strong>清晰度</strong>：增强中间调对比，人像建议-10到+10，风光可+20到+40</li>
                <li><strong>自然饱和度</strong>：优先使用，智能保护肤色</li>
                <li><strong>饱和度</strong>：整体调整，容易过饱和，慎用</li>
            </ul>
            
            <h4>第三步：色调曲线</h4>
            <p>更精细的明暗控制，可以调整特定亮度区域。</p>
            <ul>
                <li><strong>点曲线</strong>：类似Photoshop曲线，可添加控制点</li>
                <li><strong>区域曲线</strong>：分别调整暗调、阴影、亮调、高光</li>
                <li><strong>S曲线</strong>：暗部压暗、亮部提亮，增强对比度</li>
                <li><strong>反S曲线</strong>：柔化效果，适合人像</li>
            </ul>
            
            <h4>第四步：HSL/颜色/黑白</h4>
            <p>精确控制特定颜色的色相、饱和度、明度。</p>
            <ul>
                <li><strong>色相</strong>：改变颜色种类，如橙色偏红或偏黄</li>
                <li><strong>饱和度</strong>：调整颜色鲜艳度，可降低杂乱颜色的饱和度</li>
                <li><strong>明亮度</strong>：调整颜色明暗，如提亮橙色让肤色更通透</li>
                <li><strong>目标调整工具</strong>：直接在画面上拖动调整特定颜色</li>
            </ul>
            
            <h4>第五步：分离色调</h4>
            <p>分别给高光和阴影添加颜色，创造电影感。</p>
            <ul>
                <li><strong>青橙色调</strong>：高光加橙，阴影加青（好莱坞电影常用）</li>
                <li><strong>冷暖对比</strong>：增强画面层次感和情绪</li>
                <li><strong>平衡滑块</strong>：控制高光阴影色调的过渡点</li>
            </ul>
            
            <h4>第六步：细节处理</h4>
            <ul>
                <li><strong>锐化</strong>：
                    <ul>
                        <li>数量：控制锐化强度，一般40-80</li>
                        <li>半径：控制边缘宽度，一般1.0-1.5</li>
                        <li>细节：控制细节增强，一般25-50</li>
                        <li>蒙版：按住Alt键拖动，只锐化边缘不锐化皮肤</li>
                    </ul>
                </li>
                <li><strong>降噪</strong>：
                    <ul>
                        <li>明亮度：消除亮度噪点，高ISO照片需要</li>
                        <li>颜色：消除彩色噪点，一般保持25左右</li>
                    </ul>
                </li>
            </ul>
            
            <h4>第七步：镜头校正</h4>
            <ul>
                <li><strong>启用配置文件校正</strong>：自动修正畸变和暗角</li>
                <li><strong>删除色差</strong>：消除紫边和绿边</li>
                <li><strong>手动校正</strong>：旋转、透视、变形调整</li>
            </ul>
            
            <h4>第八步：局部调整</h4>
            <ul>
                <li><strong>渐变滤镜</strong>：模拟渐变镜效果，压暗天空</li>
                <li><strong>径向滤镜</strong>：圆形选区，突出主体</li>
                <li><strong>调整画笔</strong>：自由涂抹选区，可调整范围</li>
                <li><strong>范围蒙版</strong>：基于颜色或亮度进一步细化选区</li>
            </ul>
            
            <h4>第九步：校准</h4>
            <p>调整红绿蓝三原色的色相和饱和度，影响整体色彩。</p>
            <ul>
                <li><strong>红原色</strong>：影响橙色和红色，向右偏橙适合肤色</li>
                <li><strong>绿原色</strong>：影响绿色和黄色</li>
                <li><strong>蓝原色</strong>：影响蓝色和青色，向左增加饱和度</li>
            </ul>
            
            <h4>第十步：导出</h4>
            <ul>
                <li><strong>文件设置</strong>：JPEG质量80-100，sRGB色彩空间</li>
                <li><strong>图像大小</strong>：长边2048px适合网络分享</li>
                <li><strong>输出锐化</strong>：屏幕/哑光纸/高光纸三选一</li>
                <li><strong>水印</strong>：可批量添加文字或图片水印</li>
            </ul>
            
            <h3>Photoshop 精修技巧</h3>
            
            <h4>人像磨皮方法</h4>
            <ul>
                <li><strong>污点修复画笔</strong>：快速去除痘痘、斑点</li>
                <li><strong>修补工具</strong>：去除较大瑕疵，纹理融合自然</li>
                <li><strong>Portraiture插件</strong>：一键磨皮，保留细节</li>
                <li><strong>高低频分离</strong>：专业磨皮技术，高频保留纹理，低频处理肤色</li>
                <li><strong>中性灰/双曲线</strong>：商业级磨皮，光影重塑</li>
            </ul>
            
            <h4>液化塑形</h4>
            <ul>
                <li><strong>向前变形工具</strong>：瘦脸、瘦身、调整发型</li>
                <li><strong>冻结蒙版</strong>：保护不需要调整的区域</li>
                <li><strong>脸部识别液化</strong>：自动识别五官，分别调整</li>
                <li><strong>适度原则</strong>：保持自然，不要过度</li>
            </ul>
            
            <h4>调色进阶</h4>
            <ul>
                <li><strong>可选颜色</strong>：精确调整特定颜色的CMYK成分</li>
                <li><strong>色彩平衡</strong>：分别调整阴影、中间调、高光的色彩倾向</li>
                <li><strong>通道混合器</strong>：基于通道的调色，可创造特殊色调</li>
                <li><strong>照片滤镜</strong>：模拟传统滤镜效果，如加温、冷却</li>
            </ul>
            
            <h3>常用后期风格</h3>
            <ul>
                <li><strong>日系清新</strong>：曝光+、对比度-、阴影+、色温偏蓝</li>
                <li><strong>胶片复古</strong>：对比度+、颗粒+、分离色调高光黄阴影蓝</li>
                <li><strong>黑白高对比</strong>：转黑白、对比度+、清晰度+、局部提亮</li>
                <li><strong>电影感</strong>：宽画幅裁剪、青橙色调、暗角、颗粒</li>
            </ul>
        `,
        tips: ['RAW格式是后期的基础，务必使用RAW拍摄', '调整要适度，保持自然感', '建立自己的预设，提高效率', '多练习，形成自己的工作流程']
    },
    
    video: {
        title: '视频拍摄',
        category: '技术基础',
        icon: 'fa-video',
        content: `
            <h3>视频基础参数设置</h3>
            
            <h4>帧率（Frame Rate）</h4>
            <p>帧率决定视频的流畅度和风格，不同帧率适用于不同场景。</p>
            <ul>
                <li><strong>24fps</strong>：电影标准帧率，有电影感和叙事感，适合剧情片、MV、文艺短片</li>
                <li><strong>25fps</strong>：PAL制式标准，中国大陆电视标准</li>
                <li><strong>30fps</strong>：NTSC制式标准，美国日本标准，适合新闻、访谈、日常记录</li>
                <li><strong>60fps</strong>：流畅度高，适合运动、游戏、需要后期慢动作的场景</li>
                <li><strong>120fps/240fps</strong>：高帧率用于慢动作回放，可放慢4-10倍</li>
            </ul>
            
            <h4>快门速度（Shutter Speed）</h4>
            <p>视频快门速度遵循"180度快门角"原则，即快门速度≈2×帧率。</p>
            <ul>
                <li><strong>24fps</strong>：快门速度 1/50s</li>
                <li><strong>30fps</strong>：快门速度 1/60s</li>
                <li><strong>60fps</strong>：快门速度 1/125s</li>
                <li><strong>效果</strong>：此设置可获得最自然的动态模糊，符合人眼习惯</li>
                <li><strong>高速快门</strong>：如1/1000s，画面会有卡顿感，适合特定风格</li>
                <li><strong>低速快门</strong>：如1/25s，动态模糊过度，画面拖影</li>
            </ul>
            
            <h4>分辨率选择</h4>
            <ul>
                <li><strong>1080p（Full HD）</strong>：1920×1080，文件小、剪辑流畅，适合网络分享</li>
                <li><strong>4K（Ultra HD）</strong>：3840×2160，画质细腻、后期可裁切，推荐首选</li>
                <li><strong>8K</strong>：7680×4320，专业级，文件巨大，一般用户不需要</li>
                <li><strong>建议</strong>：拍摄用4K，输出根据平台选择1080p或4K</li>
            </ul>
            
            <h4>编码格式</h4>
            <ul>
                <li><strong>H.264</strong>：兼容性最好，文件适中，适合大多数场景</li>
                <li><strong>H.265/HEVC</strong>：压缩效率更高，文件更小，但对电脑性能要求高</li>
                <li><strong>ProRes</strong>：苹果专业格式，画质无损，文件巨大，适合专业后期</li>
            </ul>
            
            <h3>视频曝光控制</h3>
            
            <h4>与照片的区别</h4>
            <ul>
                <li><strong>快门速度受限</strong>：必须保持2×帧率，不能随意调整</li>
                <li><strong>主要靠光圈和ISO</strong>：以及ND减光镜控制曝光</li>
                <li><strong>Log模式</strong>：专业视频使用Log曲线，保留更多动态范围，后期调色空间大</li>
            </ul>
            
            <h4>Log模式使用</h4>
            <ul>
                <li><strong>特点</strong>：画面灰蒙蒙，对比度低，饱和度低</li>
                <li><strong>优势</strong>：保留更多高光和暗部细节，后期调色空间大</li>
                <li><strong>使用场景</strong>：光线对比强烈、需要专业调色的项目</li>
                <li><strong>注意事项</strong>：必须使用LUT还原颜色，对后期能力要求高</li>
            </ul>
            
            <h3>运镜技巧</h3>
            
            <h4>基础运镜</h4>
            <ul>
                <li><strong>推（Push In）</strong>：镜头向前移动，强调主体、营造紧张感</li>
                <li><strong>拉（Pull Out）</strong>：镜头向后移动，展示环境、结束场景</li>
                <li><strong>摇（Pan）</strong>：镜头左右转动，跟随移动主体、展示宽阔场景</li>
                <li><strong>移（Truck）</strong>：镜头左右平移，跟随主体横向移动</li>
                <li><strong>升（Rise）</strong>：镜头向上移动，从局部到全景</li>
                <li><strong>降（Fall）</strong>：镜头向下移动，从全景到局部</li>
                <li><strong>跟（Follow）</strong>：跟随主体移动，保持主体在画面中</li>
            </ul>
            
            <h4>进阶运镜</h4>
            <ul>
                <li><strong>环绕（Orbit）</strong>：围绕主体360度旋转拍摄，增加立体感</li>
                <li><strong>低角度跟拍</strong>：贴近地面跟随拍摄，增强速度感</li>
                <li><strong>希区柯克变焦</strong>：推拉变焦同时进行，背景透视变化，主体大小不变</li>
                <li><strong>一镜到底</strong>：长镜头不剪辑，考验运镜和调度能力</li>
            </ul>
            
            <h4>运镜原则</h4>
            <ul>
                <li><strong>有目的性</strong>：每个运镜都要有叙事或情绪目的</li>
                <li><strong>起幅落幅</strong>：每个镜头都要有稳定的开始和结束</li>
                <li><strong>速度均匀</strong>：避免忽快忽慢，保持平滑</li>
                <li><strong>避免过度</strong>：运镜太多会分散观众注意力</li>
            </ul>
            
            <h3>稳定设备</h3>
            
            <h4>三脚架</h4>
            <ul>
                <li><strong>用途</strong>：固定机位、访谈、延时摄影</li>
                <li><strong>选择</strong>：液压云台比球型云台更适合视频</li>
            </ul>
            
            <h4>手持稳定器（云台）</h4>
            <ul>
                <li><strong>手机稳定器</strong>：大疆OM系列、智云Smooth系列</li>
                <li><strong>相机稳定器</strong>：大疆RS系列、智云WEEBILL系列</li>
                <li><strong>使用技巧</strong>：开启运动模式跟随快速移动，使用盗梦空间模式旋转拍摄</li>
            </ul>
            
            <h4>滑轨</h4>
            <ul>
                <li><strong>用途</strong>：实现平滑的推拉移镜头</li>
                <li><strong>类型</strong>：手动滑轨、电动滑轨（可编程重复运动）</li>
            </ul>
            
            <h3>音频录制</h3>
            <p>音频质量对视频的重要性占50%，不好的音频会让观众立即离开。</p>
            
            <h4>麦克风类型</h4>
            <ul>
                <li><strong>机顶麦克风</strong>：指向性收音，适合vlog、环境音</li>
                <li><strong>领夹麦克风</strong>：贴近声源，适合访谈、讲解</li>
                <li><strong>枪式麦克风</strong>：超指向性，适合采访、外景</li>
                <li><strong>录音笔</strong>：独立录音，音质最好，后期同步</li>
            </ul>
            
            <h4>录音技巧</h4>
            <ul>
                <li><strong>监听</strong>：必须戴耳机实时监听录音质量</li>
                <li><strong>电平控制</strong>：峰值保持在-12dB到-6dB之间，避免爆音</li>
                <li><strong>环境音</strong>：录制现场环境音（Room Tone），后期补空镜用</li>
                <li><strong>防风</strong>：户外使用防风罩（毛毛套），避免风噪</li>
            </ul>
            
            <h3>视频剪辑基础</h3>
            
            <h4>剪辑软件</h4>
            <ul>
                <li><strong>剪映</strong>：国产免费，功能强大，适合新手和短视频</li>
                <li><strong>Premiere Pro</strong>：专业级，与Photoshop/AE配合好</li>
                <li><strong>Final Cut Pro</strong>：苹果专属，优化好，适合Mac用户</li>
                <li><strong>DaVinci Resolve</strong>：免费专业级，调色功能最强</li>
            </ul>
            
            <h4>剪辑流程</h4>
            <ul>
                <li><strong>素材整理</strong>：分类、重命名、打好标签</li>
                <li><strong>粗剪</strong>：挑选镜头，搭建故事框架</li>
                <li><strong>精剪</strong>：调整节奏，添加转场</li>
                <li><strong>调色</strong>：统一色调，增强视觉效果</li>
                <li><strong>音频处理</strong>：降噪、配乐、音效、混音</li>
                <li><strong>字幕包装</strong>：添加标题、字幕、片尾</li>
                <li><strong>输出</strong>：根据平台要求选择格式和参数</li>
            </ul>
            
            <h4>转场技巧</h4>
            <ul>
                <li><strong>硬切</strong>：最常用，保持节奏</li>
                <li><strong>叠化</strong>：表示时间流逝或场景转换</li>
                <li><strong>匹配剪辑</strong>：利用相似形状或动作连接两个镜头</li>
                <li><strong>避免过度</strong>：少用花哨转场，保持简洁</li>
            </ul>
        `,
        tips: ['快门速度设置为帧率的2倍，如24fps用1/50s', '音频质量比画面更重要，务必重视收音', '拍摄时多录几秒，给剪辑留余地', '4K拍摄1080p输出，画质更好还能做数码变焦']
    },
    
    // ========== 人像摄影 ==========
    portrait: {
        title: '人像基础',
        category: '人像摄影',
        icon: 'fa-user',
        content: `
            <h3>人像镜头选择</h3>
            <p>不同焦段的人像镜头有不同的透视效果和适用场景。</p>
            
            <h4>35mm 镜头 - 环境人像</h4>
            <ul>
                <li><strong>特点</strong>：视角广（63度），带入环境背景</li>
                <li><strong>透视</strong>：轻微夸张，增强画面张力</li>
                <li><strong>适用</strong>：环境人像、街拍、室内狭小空间</li>
                <li><strong>注意事项</strong>：边缘会有拉伸变形，人物不要放太靠边</li>
                <li><strong>推荐光圈</strong>：f/1.4-f/2，既能分离主体又保留环境</li>
            </ul>
            
            <h4>50mm 镜头 - 标准人像</h4>
            <ul>
                <li><strong>特点</strong>：视角自然（46度），接近人眼所见</li>
                <li><strong>透视</strong>：自然真实，没有明显变形</li>
                <li><strong>适用</strong>：半身像、日常人像、入门练习</li>
                <li><strong>优势</strong>：价格便宜（50mm f/1.8仅几百元），轻便</li>
                <li><strong>注意事项</strong>：拍特写需要离得很近，可能让被摄者不适</li>
            </ul>
            
            <h4>85mm 镜头 - 人像黄金焦段</h4>
            <ul>
                <li><strong>特点</strong>：视角适中（28度），空间压缩感好</li>
                <li><strong>透视</strong>： flattering，面部比例最自然好看</li>
                <li><strong>适用</strong>：半身像、特写、户外人像</li>
                <li><strong>优势</strong>：拍摄距离舒适（2-3米），背景虚化美丽</li>
                <li><strong>推荐镜头</strong>：各品牌85mm f/1.8（性价比高）或f/1.4（专业级）</li>
            </ul>
            
            <h4>135mm 镜头 - 长焦人像</h4>
            <ul>
                <li><strong>特点</strong>：视角窄（18度），强烈的空间压缩</li>
                <li><strong>透视</strong>：背景拉近，虚化极致</li>
                <li><strong>适用</strong>：特写、户外人像、需要极致虚化的场景</li>
                <li><strong>注意事项</strong>：需要较远的拍摄距离（4-6米），沟通需要大声</li>
            </ul>
            
            <h3>人像布光基础</h3>
            
            <h4>蝴蝶光（Butterfly Lighting）</h4>
            <ul>
                <li><strong>布光方式</strong>：主光在人物正前方偏上，向下45度照射</li>
                <li><strong>特征</strong>：鼻子下方形成蝴蝶形状的阴影</li>
                <li><strong>效果</strong>：面部立体，显瘦，适合女性</li>
                <li><strong>适用</strong>： beauty摄影、证件照、时尚人像</li>
                <li><strong>辅助光</strong>：下巴下方放反光板或辅光，减轻阴影</li>
            </ul>
            
            <h4>伦勃朗光（Rembrandt Lighting）</h4>
            <ul>
                <li><strong>布光方式</strong>：主光在人物侧前方，高于眼睛</li>
                <li><strong>特征</strong>：阴影一侧的脸颊上有三角形光斑</li>
                <li><strong>效果</strong>：戏剧性、神秘感、立体感强</li>
                <li><strong>适用</strong>：男性人像、艺术人像、油画感照片</li>
                <li><strong>注意</strong>：三角形光斑不要太大或太小，与眼睛平齐最佳</li>
            </ul>
            
            <h4>环形光（Loop Lighting）</h4>
            <ul>
                <li><strong>布光方式</strong>：主光在30-45度侧前方</li>
                <li><strong>特征</strong>：鼻子的阴影与脸颊阴影相连形成环状</li>
                <li><strong>效果</strong>：自然、 flattering，适合大多数人</li>
                <li><strong>适用</strong>：通用布光，商业人像，家庭照</li>
            </ul>
            
            <h4>分割光（Split Lighting）</h4>
            <ul>
                <li><strong>布光方式</strong>：主光在正侧面90度</li>
                <li><strong>特征</strong>：一半脸亮，一半脸暗</li>
                <li><strong>效果</strong>：戏剧性、神秘感、强烈的明暗对比</li>
                <li><strong>适用</strong>：艺术人像、男性肖像、黑白摄影</li>
            </ul>
            
            <h4>平光（Flat Lighting）</h4>
            <ul>
                <li><strong>布光方式</strong>：光源在相机后方或正前方</li>
                <li><strong>特征</strong>：阴影很少，面部平整</li>
                <li><strong>效果</strong>：年轻化、瑕疵少，但缺乏立体感</li>
                <li><strong>适用</strong>： beauty照、证件照、需要磨皮效果时</li>
            </ul>
            
            <h3>人像构图技巧</h3>
            
            <h4>景别选择</h4>
            <ul>
                <li><strong>特写（Close-up）</strong>：胸部以上，强调表情和眼神</li>
                <li><strong>半身像（Medium Shot）</strong>：腰部以上，最常用的景别</li>
                <li><strong>七分身（7/8 Shot）</strong>：膝盖以上，展示服装和姿态</li>
                <li><strong>全身像（Full Shot）</strong>：完整人物，展示整体造型</li>
                <li><strong>环境人像</strong>：人物占画面1/3左右，强调环境氛围</li>
            </ul>
            
            <h4>裁切禁忌</h4>
            <ul>
                <li><strong>避免裁切关节</strong>：脖子、手肘、手腕、膝盖、脚踝</li>
                <li><strong>安全裁切点</strong>：大腿中部、小腿中部、上臂、前臂</li>
                <li><strong>特写裁切</strong>：额头上方留空间，下巴下方少留</li>
            </ul>
            
            <h4>眼神处理</h4>
            <ul>
                <li><strong>眼神光</strong>：眼睛里的反光点，让人物有神采</li>
                <li><strong>制造眼神光</strong>：使用反光板、柔光箱、或让模特看窗户</li>
                <li><strong>眼神方向</strong>：
                    <ul>
                        <li>看镜头：与观众直接交流</li>
                        <li>看镜头外侧：思考、憧憬</li>
                        <li>闭眼：宁静、享受</li>
                    </ul>
                </li>
                <li><strong>眼白控制</strong>：避免眼白过多，显得不自然</li>
            </ul>
            
            <h3>与模特沟通技巧</h3>
            <ul>
                <li><strong>建立信任</strong>：拍摄前聊天，让模特放松</li>
                <li><strong>具体指令</strong>：不要说"自然点"，要说"下巴收一点，眼睛看我"</li>
                <li><strong>正向反馈</strong>：多鼓励，"很好"、"漂亮"、"保持住"</li>
                <li><strong>展示成果</strong>：适时给模特看照片，增强信心</li>
                <li><strong>音乐氛围</strong>：播放模特喜欢的音乐，缓解紧张</li>
                <li><strong>准备参考</strong>：提前准备样片，给模特看想要的感觉</li>
            </ul>
            
            <h3>人像摄影参数设置</h3>
            <ul>
                <li><strong>光圈</strong>：f/1.4-f/2.8（虚化背景），f/4-f/5.6（环境人像）</li>
                <li><strong>快门</strong>：不低于1/125s（防抖），1/250s以上更安全</li>
                <li><strong>ISO</strong>：尽量保持低ISO，必要时可提高</li>
                <li><strong>对焦</strong>：单点对焦，对准眼睛</li>
                <li><strong>测光</strong>：评价测光或点测光对准面部</li>
                <li><strong>白平衡</strong>：自动或根据环境手动设置</li>
            </ul>
        `,
        tips: ['85mm f/1.8是新手人像的最佳选择，性价比高', '眼神光是人像的灵魂，一定要注意', '与模特的沟通比技术更重要，让TA放松才能拍出好照片', '拍摄时多变化角度和构图，给后期选片留余地'],
        exifRules: {
            focalLength: { min: 50, max: 135, ideal: 85 },
            aperture: { min: 1.2, max: 2.8, ideal: 1.8 },
            shutter: { min: 1/125, note: '避免抖动' }
        }
    },
    
    posing: {
        title: '摆姿引导',
        category: '人像摄影',
        icon: 'fa-female',
        content: `
            <h3>站姿引导</h3>
            <p>站姿是最常用的姿势，也是最能展现人物气质的姿势。</p>
            
            <h4>基础站姿原则</h4>
            <ul>
                <li><strong>重心腿（支撑腿）</strong>：一条腿直立承重，另一条腿放松弯曲，形成自然曲线</li>
                <li><strong>避免正面直站</strong>：侧身45度最显瘦，全身正面会显得呆板</li>
                <li><strong>膝盖微弯</strong>：不要完全伸直，微弯更显自然</li>
                <li><strong>脚尖方向</strong>：脚尖不要正对镜头，稍微侧向一边</li>
                <li><strong>手臂离开身体</strong>：手臂与身体留空隙，避免挤压显胖</li>
            </ul>
            
            <h4>常见站姿变化</h4>
            <ul>
                <li><strong>A字站姿</strong>：双脚分开与肩同宽，适合休闲风格</li>
                <li><strong>S曲线站姿</strong>：重心在一条腿，胯部推出，形成S形曲线</li>
                <li><strong>交叉腿站姿</strong>：一条腿交叉在另一条腿前，显腿长</li>
                <li><strong>倚靠站姿</strong>：背靠墙或扶栏杆，放松自然</li>
                <li><strong>行走站姿</strong>：模拟走路瞬间，动态感强</li>
            </ul>
            
            <h3>坐姿引导</h3>
            
            <h4>基础坐姿原则</h4>
            <ul>
                <li><strong>只坐椅子前沿1/3</strong>：保持脊柱挺直，不要瘫坐</li>
                <li><strong>腿部延伸</strong>：至少一条腿向镜头方向延伸，显腿长</li>
                <li><strong>避免正对镜头坐</strong>：侧身45度，双腿并拢斜放</li>
                <li><strong>手放位置</strong>：可以放膝盖、椅子边缘、或自然垂放</li>
            </ul>
            
            <h4>常见坐姿变化</h4>
            <ul>
                <li><strong>优雅侧坐</strong>：双腿并拢侧放，双手放膝盖上</li>
                <li><strong>盘腿坐</strong>：适合地板、草地，营造随性感觉</li>
                <li><strong>单腿屈膝</strong>：一条腿伸直，一条腿屈膝，手搭膝盖</li>
                <li><strong>抱膝坐</strong>：双腿屈膝抱在胸前，可爱或沉思感</li>
                <li><strong>二郎腿</strong>：优雅版二郎腿，上腿轻搭，脚尖下压</li>
            </ul>
            
            <h3>手部动作引导</h3>
            <p>手部是人像摄影中最难处理的部分，需要给手"找事做"。</p>
            
            <h4>女性手部动作</h4>
            <ul>
                <li><strong>撩头发</strong>：手指轻触发丝，自然优雅</li>
                <li><strong>托腮/扶脸</strong>：手轻触脸颊，修饰脸型，显脸小</li>
                <li><strong>摸脖子/锁骨</strong>：手指轻触颈部，性感优雅</li>
                <li><strong>双手交叠</strong>：放在腹部或身前，端庄大方</li>
                <li><strong>拿道具</strong>：花束、帽子、书本、咖啡杯</li>
                <li><strong>拉衣服</strong>：轻拉衣领、袖口、裙摆</li>
                <li><strong>遮阳</strong>：手放额头遮阳，自然生动</li>
            </ul>
            
            <h4>男性手部动作</h4>
            <ul>
                <li><strong>插口袋</strong>：单手或双手插口袋，帅气随性</li>
                <li><strong>整理衣领/袖口</strong>：展现绅士气质</li>
                <li><strong>抱臂</strong>：双臂交叉，展现自信</li>
                <li><strong>扶墙/栏杆</strong>：增加画面层次</li>
                <li><strong>拿道具</strong>：手表、眼镜、手机、公文包</li>
                <li><strong>手放腰间</strong>：拇指插腰带，自信姿态</li>
            </ul>
            
            <h4>手部姿势要点</h4>
            <ul>
                <li><strong>手指舒展</strong>：不要握拳或手指僵硬</li>
                <li><strong>展示手指侧面</strong>：比展示手背或手心更优雅</li>
                <li><strong>手腕弯曲</strong>：增加柔美线条</li>
                <li><strong>避免遮挡脸部</strong>：手部不要挡住眼睛或过多脸部</li>
            </ul>
            
            <h3>表情引导技巧</h3>
            
            <h4>眼神引导</h4>
            <ul>
                <li><strong>看镜头</strong>：与观众直接交流，最常用</li>
                <li><strong>看镜头上方</strong>：眼睛向上看，显得眼睛更大更有神</li>
                <li><strong>看远方</strong>：侧脸看向远方，营造憧憬、思考感</li>
                <li><strong>闭眼</strong>：享受阳光、感受风，宁静美好</li>
                <li><strong>回眸</strong>：身体侧对镜头，转头看镜头，动态感强</li>
            </ul>
            
            <h4>笑容引导</h4>
            <ul>
                <li><strong>发"诶"音</strong>：让模特发"诶"的音，自然露出微笑</li>
                <li><strong>想开心的事</strong>：引导模特回忆开心的事情</li>
                <li><strong>微笑程度</strong>：
                    <ul>
                        <li>浅笑：嘴角微扬，优雅含蓄</li>
                        <li>微笑：露出牙齿，自然亲切</li>
                        <li>大笑：开心释放，但要注意表情管理</li>
                    </ul>
                </li>
                <li><strong>避免假笑</strong>：眼睛也要笑，不是只有嘴笑</li>
            </ul>
            
            <h4>情绪引导</h4>
            <ul>
                <li><strong>讲故事</strong>："想象你在等一个重要的人"</li>
                <li><strong>给情境</strong>："想象这是你的婚礼当天"</li>
                <li><strong>播放音乐</strong>：根据想要的情绪播放相应音乐</li>
                <li><strong>情绪词汇</strong>：开心、忧郁、神秘、自信、温柔</li>
            </ul>
            
            <h3>特殊姿势</h3>
            
            <h4>躺姿</h4>
            <ul>
                <li><strong>侧躺</strong>：手撑头部，腿部弯曲，曲线优美</li>
                <li><strong>仰卧</strong>：头稍微抬起，避免双下巴</li>
                <li><strong>俯卧</strong>：手撑下巴，踢腿，活泼可爱</li>
            </ul>
            
            <h4>蹲姿</h4>
            <ul>
                <li><strong>单膝跪地</strong>：一膝跪地一膝立起，帅气有型</li>
                <li><strong>双腿蹲下</strong>：膝盖并拢，手放膝盖，可爱俏皮</li>
            </ul>
            
            <h4>动态姿势</h4>
            <ul>
                <li><strong>旋转</strong>：让模特旋转，抓拍裙摆飞扬瞬间</li>
                <li><strong>跳跃</strong>：跳跃瞬间，活力四射</li>
                <li><strong>走路</strong>：自然行走，抓拍动态</li>
                <li><strong>回头</strong>：向前走然后回头，自然生动</li>
            </ul>
            
            <h3>摆姿沟通话术</h3>
            <ul>
                <li><strong>不要说</strong>："自然点"、"放松"、"好看一点"</li>
                <li><strong>要说</strong>：
                    <ul>
                        <li>"下巴收一点点"</li>
                        <li>"左肩稍微低一点"</li>
                        <li>"眼睛看我的手"</li>
                        <li>"头往左边偏一点"</li>
                        <li>"肩膀放松下沉"</li>
                        <li>"背挺直，想象头顶有根线拉着"</li>
                    </ul>
                </li>
            </ul>
        `,
        tips: ['多示范少指挥，自己先做给模特看', '准备参考图，让模特知道想要什么效果', '抓拍自然瞬间比摆拍更生动', '多鼓励，营造轻松氛围']
    },
    
    hanfu: {
        title: '汉服古风',
        category: '人像摄影',
        icon: 'fa-fan',
        content: `
            <h3>汉服形制详解</h3>
            <p>汉服是汉族传统服饰，不同朝代有不同的形制特点。</p>
            
            <h4>唐制汉服</h4>
            <ul>
                <li><strong>特点</strong>：雍容华贵、色彩艳丽、开放大气</li>
                <li><strong>女性</strong>：齐胸襦裙（裙子系在胸上）、坦领半臂</li>
                <li><strong>男性</strong>：圆领袍、幞头</li>
                <li><strong>适合场景</strong>：牡丹花、宫殿、华丽布景</li>
                <li><strong>气质</strong>：大唐盛世、自信开放</li>
            </ul>
            
            <h4>宋制汉服</h4>
            <ul>
                <li><strong>特点</strong>：清雅简约、含蓄内敛、文人气质</li>
                <li><strong>女性</strong>：褙子、宋裤、抹胸</li>
                <li><strong>男性</strong>：直裰、道袍</li>
                <li><strong>适合场景</strong>：竹林、茶室、书房、雨天</li>
                <li><strong>气质</strong>：文人雅士、清雅脱俗</li>
            </ul>
            
            <h4>明制汉服</h4>
            <ul>
                <li><strong>特点</strong>：端庄大气、形制严谨、华丽精致</li>
                <li><strong>女性</strong>：袄裙、马面裙、比甲</li>
                <li><strong>男性</strong>：道袍、直裰、曳撒</li>
                <li><strong>适合场景</strong>：宫殿、园林、雪景</li>
                <li><strong>气质</strong>：端庄典雅、大家闺秀</li>
            </ul>
            
            <h4>魏晋风</h4>
            <ul>
                <li><strong>特点</strong>：飘逸洒脱、宽袍大袖、仙风道骨</li>
                <li><strong>形制</strong>：大袖衫、交领襦裙</li>
                <li><strong>适合场景</strong>：山水、竹林、瀑布</li>
                <li><strong>气质</strong>：仙气飘飘、超凡脱俗</li>
            </ul>
            
            <h3>场景选择</h3>
            
            <h4>古典园林</h4>
            <ul>
                <li><strong>元素</strong>：亭台楼阁、假山流水、曲径通幽</li>
                <li><strong>适合形制</strong>：宋制、明制</li>
                <li><strong>拍摄要点</strong>：利用框景、借景，体现园林层次</li>
                <li><strong>推荐地点</strong>：苏州园林、扬州园林、北京颐和园</li>
            </ul>
            
            <h4>古建筑</h4>
            <ul>
                <li><strong>元素</strong>：红墙黄瓦、雕梁画栋、飞檐斗拱</li>
                <li><strong>适合形制</strong>：明制、唐制</li>
                <li><strong>拍摄要点</strong>：对称构图，体现建筑庄严</li>
                <li><strong>推荐地点</strong>：故宫、太庙、天坛、寺庙</li>
            </ul>
            
            <h4>自然风光</h4>
            <ul>
                <li><strong>竹林</strong>：适合魏晋风、宋制，清幽雅致</li>
                <li><strong>花海</strong>：桃花、樱花、油菜花，适合春季拍摄</li>
                <li><strong>雪景</strong>：红白对比，适合明制、斗篷</li>
                <li><strong>山水</strong>：大场景，适合魏晋风、飘逸感</li>
            </ul>
            
            <h3>道具运用</h3>
            
            <h4>手持道具</h4>
            <ul>
                <li><strong>团扇</strong>：女子必备，可遮面、扇风、指方向</li>
                <li><strong>折扇</strong>：男子常用，开合之间显风度</li>
                <li><strong>油纸伞</strong>：遮阳挡雨，营造氛围</li>
                <li><strong>灯笼</strong>：夜景必备，暖光氛围</li>
                <li><strong>花束</strong>：应季鲜花，增添色彩</li>
            </ul>
            
            <h4>陈设道具</h4>
            <ul>
                <li><strong>古琴/古筝</strong>：文人气质，抚琴画面</li>
                <li><strong>棋盘</strong>：对弈场景，静谧雅致</li>
                <li><strong>茶具</strong>：茶道文化，禅意氛围</li>
                <li><strong>书卷/毛笔</strong>：书香门第，才情气质</li>
                <li><strong>剑</strong>：侠女、侠客，英气逼人</li>
            </ul>
            
            <h3>姿势指导</h3>
            
            <h4>站姿</h4>
            <ul>
                <li><strong>含胸拔背</strong>：微微含胸，背部挺直，含蓄优雅</li>
                <li><strong>手放位置</strong>：交叠于腹前、轻扶腰带、手持团扇</li>
                <li><strong>视线</strong>：低眉顺眼或远眺，避免直视镜头的现代感</li>
            </ul>
            
            <h4>坐姿</h4>
            <ul>
                <li><strong>侧坐</strong>：双腿并拢侧放，手放膝上</li>
                <li><strong>跪坐</strong>：正坐，臀部压在小腿上，端庄正式</li>
                <li><strong>倚坐</strong>：倚靠栏杆或石凳，放松自然</li>
            </ul>
            
            <h4>行礼姿势</h4>
            <ul>
                <li><strong>万福礼</strong>：女子行礼，双手交叠于腹前，微屈膝</li>
                <li><strong>作揖</strong>：男子行礼，双手抱拳或交叠于胸前</li>
                <li><strong>跪拜</strong>：大礼，双膝跪地，双手伏地</li>
            </ul>
            
            <h4>动态姿势</h4>
            <ul>
                <li><strong>旋转</strong>：裙摆飞扬，动态美感</li>
                <li><strong>甩袖</strong>：大袖衫甩动，飘逸感</li>
                <li><strong>回眸</strong>：向前走然后回头，百媚生</li>
                <li><strong>抚琴</strong>：专注抚琴，文艺气质</li>
            </ul>
            
            <h3>拍摄技巧</h3>
            
            <h4>构图</h4>
            <ul>
                <li><strong>竖构图</strong>：突出人物修长身形</li>
                <li><strong>横构图</strong>：交代环境，大场景</li>
                <li><strong>框架构图</strong>：利用门框、窗框、树枝</li>
                <li><strong>对称构图</strong>：古建筑前，体现庄重</li>
            </ul>
            
            <h4>光线</h4>
            <ul>
                <li><strong>逆光</strong>：发丝光、轮廓光，仙气感</li>
                <li><strong>侧光</strong>：强调服装纹理和层次</li>
                <li><strong>柔光</strong>：阴天或阴影处，适合清新风格</li>
                <li><strong>夜景</strong>：灯笼、蜡烛补光，暖色调</li>
            </ul>
            
            <h3>后期调色</h3>
            
            <h4>淡雅清新风</h4>
            <ul>
                <li>低饱和度、高明度</li>
                <li>色温偏冷，清新脱俗</li>
                <li>适合宋制、竹林、雨天</li>
            </ul>
            
            <h4>浓墨重彩风</h4>
            <ul>
                <li>高饱和度、对比强烈</li>
                <li>色温偏暖，华丽富贵</li>
                <li>适合唐制、宫殿、花海</li>
            </ul>
            
            <h4>水墨意境风</h4>
            <ul>
                <li>降低饱和度，接近黑白</li>
                <li>保留一点淡彩</li>
                <li>适合山水、竹林、雪景</li>
            </ul>
        `,
        tips: ['了解汉服文化背景', '注意发型和配饰搭配', '动作要优雅缓慢'],
        shootingPlan: {
            title: '汉服人像拍摄方案',
            preparation: ['确认汉服形制和朝代', '准备配套发型和发饰', '收集道具：扇子、伞、书卷'],
            location: '古典园林或古建筑',
            time: '黄金时刻或阴天柔光',
            poses: ['持扇半遮面', '倚栏远眺', '提裙漫步', '抚琴静坐'],
            lighting: '自然光为主，反光板补光'
        }
    },
    
    'commercial-portrait': {
        title: '商业肖像',
        category: '人像摄影',
        icon: 'fa-briefcase',
        content: `
            <h3>形象照拍摄</h3>
            <h4>布光方案</h4>
            <ul>
                <li><strong>单灯</strong>：柔光箱45度角</li>
                <li><strong>双灯</strong>：主光+填充光</li>
                <li><strong>三灯</strong>：主光+填充光+背景光</li>
            </ul>
            
            <h4>背景选择</h4>
            <ul>
                <li><strong>纯色背景</strong>：白、灰、黑</li>
                <li><strong>环境背景</strong>：办公室、工作室</li>
                <li><strong>虚化处理</strong>：突出人物</li>
            </ul>
            
            <h3>团队合影</h3>
            <ul>
                <li>高低错落，避免呆板排列</li>
                <li>服装统一或协调</li>
                <li>注意每个人的表情</li>
            </ul>
        `,
        tips: ['提前沟通服装要求', '准备化妆和造型', '多拍选优'],
        pricing: {
            headshot: '300-800元/人',
            team: '2000-5000元/组',
            corporate: '5000-20000元/天'
        }
    },
    
    // ========== 风光摄影 ==========
    landscape: {
        title: '风光基础',
        category: '风光摄影',
        icon: 'fa-mountain',
        content: `
            <h3>风光摄影器材</h3>
            
            <h4>相机选择</h4>
            <ul>
                <li><strong>全画幅</strong>：动态范围大，高感好，推荐索尼A7R系列、尼康Z7、佳能R5</li>
                <li><strong>中画幅</strong>：极致画质，如富士GFX系列</li>
                <li><strong>关键参数</strong>：高像素（4000万+）、宽容度（14档+）、耐候性</li>
            </ul>
            
            <h4>镜头选择</h4>
            <ul>
                <li><strong>超广角（14-24mm）</strong>：大场景、夸张透视、星空摄影</li>
                <li><strong>广角（16-35mm）</strong>：标准风光焦段，最常用</li>
                <li><strong>标准变焦（24-70mm）</strong>：中等场景、接片</li>
                <li><strong>长焦（70-200mm）</strong>：压缩空间、局部特写、远山</li>
            </ul>
            
            <h4>必备配件</h4>
            <ul>
                <li><strong>三脚架</strong>：碳纤维材质，承重10kg以上，带挂钩可挂重物</li>
                <li><strong>滤镜系统</strong>：
                    <ul>
                        <li>CPL偏振镜：消除反光、增强色彩、压暗天空</li>
                        <li>ND减光镜：ND64（6档）、ND1000（10档）用于长曝光</li>
                        <li>GND渐变镜：平衡天空与地面光比</li>
                    </ul>
                </li>
                <li><strong>快门线/遥控器</strong>：避免手按快门造成抖动</li>
                <li><strong>头灯</strong>：日出前或日落后照明，红光模式保护夜视</li>
                <li><strong>备用电池</strong>：低温环境电池消耗快</li>
            </ul>
            
            <h3>风光摄影构图</h3>
            
            <h4>前景运用</h4>
            <p>前景是风光摄影的灵魂，可以增加画面层次感和纵深感。</p>
            <ul>
                <li><strong>石头/岩石</strong>：海边、湖边常用前景</li>
                <li><strong>花朵/植物</strong>：低角度拍摄，虚化前景</li>
                <li><strong>道路/栏杆</strong>：引导线作用</li>
                <li><strong>水面倒影</strong>：对称构图，增加宁静感</li>
            </ul>
            
            <h4>常用构图技巧</h4>
            <ul>
                <li><strong>三分法</strong>：地平线放在上1/3或下1/3</li>
                <li><strong>引导线</strong>：道路、河流、海岸线引导视线</li>
                <li><strong>框架构图</strong>：利用树枝、山洞、门框框住主体</li>
                <li><strong>对称构图</strong>：倒影、建筑，营造稳定感</li>
                <li><strong>黄金螺旋</strong>：将视觉焦点放在螺旋终点</li>
            </ul>
            
            <h3>光线与时机</h3>
            
            <h4>黄金时刻（日出日落前后）</h4>
            <ul>
                <li><strong>时间</strong>：日出前30分钟到日出后30分钟，日落前30分钟到日落后30分钟</li>
                <li><strong>光线特点</strong>：色温3000-4000K，暖黄色，角度低</li>
                <li><strong>拍摄效果</strong>：侧光产生立体感，逆光产生轮廓光</li>
            </ul>
            
            <h4>蓝调时刻</h4>
            <ul>
                <li><strong>时间</strong>：日落后20-40分钟</li>
                <li><strong>光线特点</strong>：天空呈深蓝紫色，地面灯光已亮</li>
                <li><strong>拍摄效果</strong>：冷暖对比，城市风光最佳时机</li>
            </ul>
            
            <h4>特殊天气</h4>
            <ul>
                <li><strong>云层缝隙光</strong>：耶稣光、丁达尔效应</li>
                <li><strong>雨后</strong>：空气清新、彩虹、倒影</li>
                <li><strong>云海</strong>：高山、晨间，梦幻效果</li>
                <li><strong>雪景</strong>：注意曝光补偿+1到+2档</li>
            </ul>
            
            <h3>拍摄技巧</h3>
            
            <h4>景深控制</h4>
            <ul>
                <li><strong>光圈</strong>：f/8-f/11通常是镜头最佳画质光圈</li>
                <li><strong>超焦距</strong>：对焦在超焦距点，获得最大景深</li>
                <li><strong>焦点堆叠</strong>：多张不同焦点合成，全程清晰</li>
            </ul>
            
            <h4>长曝光技术</h4>
            <ul>
                <li><strong>丝绢流水</strong>：1-5秒，水流雾化</li>
                <li><strong>雾化海面</strong>：30秒-2分钟，海面如镜</li>
                <li><strong>云彩拉丝</strong>：30秒-5分钟，云彩流动感</li>
                <li><strong>车轨</strong>：10-30秒，城市夜景</li>
            </ul>
            
            <h4>包围曝光与HDR</h4>
            <ul>
                <li><strong>场景</strong>：大光比场景，如日出日落</li>
                <li><strong>拍摄</strong>：-2EV、0、+2EV三张包围</li>
                <li><strong>后期</strong>：合成HDR或手动曝光合并</li>
            </ul>
            
            <h3>全景接片</h3>
            <ul>
                <li><strong>拍摄</strong>：每张照片重叠30-50%，保持水平</li>
                <li><strong>参数</strong>：手动曝光、手动白平衡，保持一致</li>
                <li><strong>后期</strong>：Lightroom或PTGui接片</li>
            </ul>
            
            <h3>后期处理要点</h3>
            <ul>
                <li><strong>基础调整</strong>：曝光、对比度、白平衡</li>
                <li><strong>局部调整</strong>：渐变滤镜压暗天空，径向滤镜突出主体</li>
                <li><strong>色彩</strong>：分离色调（高光暖、阴影冷）</li>
                <li><strong>细节</strong>：适当锐化、降噪</li>
                <li><strong>去朦胧</strong>：增加通透感</li>
            </ul>
        `,
        tips: ['提前踩点规划构图', '关注天气预报，特殊天气出大片', '耐心等待最佳光线，风光摄影等光是常态', '使用三脚架和快门线确保画面清晰'],
        exifRules: {
            aperture: { min: 8, max: 16, ideal: 11, note: '小光圈保证景深' },
            iso: { max: 400, note: '低ISO保证画质' },
            tripod: true
        }
    },
    
    astro: {
        title: '星空摄影',
        category: '风光摄影',
        icon: 'fa-star',
        content: `
            <h3>银河拍摄详解</h3>
            
            <h4>器材要求</h4>
            <ul>
                <li><strong>相机</strong>：全画幅高感表现好，推荐索尼A7S系列、尼康D850、佳能R6</li>
                <li><strong>镜头</strong>：广角大光圈，f/2.8或更大，14-24mm最佳</li>
                <li><strong>三脚架</strong>：稳固防风，碳纤维材质，带挂钩</li>
                <li><strong>头灯</strong>：红光模式保护夜视能力</li>
                <li><strong>快门线</strong>：避免手按快门抖动</li>
                <li><strong>备用电池</strong>：长曝光耗电快，准备2-3块</li>
            </ul>
            
            <h4>拍摄参数</h4>
            <ul>
                <li><strong>光圈</strong>：使用镜头最大光圈</li>
                <li><strong>ISO</strong>：3200-6400，根据相机高感性能调整</li>
                <li><strong>快门</strong>：15-25秒（使用500法则计算：500÷焦距）</li>
                <li><strong>对焦</strong>：手动对焦到无穷远，或对准亮星放大对焦</li>
                <li><strong>白平衡</strong>：手动设置4000K左右，或自动后期调整</li>
            </ul>
            
            <h4>500法则</h4>
            <p>计算星空摄影最大曝光时间，避免星星拖尾。</p>
            <ul>
                <li><strong>公式</strong>：最大快门秒数 = 500 ÷ 焦距</li>
                <li><strong>示例</strong>：20mm镜头 → 500÷20 = 25秒</li>
                <li><strong>注意</strong>：全画幅用这个公式，APS-C要再除以1.5</li>
            </ul>
            
            <h4>拍摄时机</h4>
            <ul>
                <li><strong>季节</strong>：北半球4-9月可见银河中心，最壮观</li>
                <li><strong>月相</strong>：农历月初月末，月光最弱时</li>
                <li><strong>时间</strong>：银河中心在深夜最高，通常22:00-02:00</li>
                <li><strong>天气</strong>：晴朗无云，空气湿度低</li>
            </ul>
            
            <h4>光污染</h4>
            <ul>
                <li><strong>光污染等级</strong>：1-3级最佳，4-5级可拍，6级以上困难</li>
                <li><strong>查询工具</strong>：Light Pollution Map网站</li>
                <li><strong>寻找暗空</strong>：远离城市50公里以上，山区、沙漠、海边</li>
            </ul>
            
            <h3>星轨拍摄</h3>
            
            <h4>单张长曝光法</h4>
            <ul>
                <li><strong>曝光时间</strong>：30分钟到数小时</li>
                <li><strong>ISO</strong>：100-400</li>
                <li><strong>光圈</strong>：f/4-f/5.6</li>
                <li><strong>注意</strong>：长时间曝光会产生热噪点</li>
            </ul>
            
            <h4>多张叠加法（推荐）</h4>
            <ul>
                <li><strong>单张参数</strong>：ISO 800-1600，光圈最大，快门20-30秒</li>
                <li><strong>拍摄数量</strong>：连续拍摄30-100张</li>
                <li><strong>间隔</strong>：关闭长时间曝光降噪，连续拍摄</li>
                <li><strong>后期</strong>：使用StarStaX或Photoshop堆栈</li>
            </ul>
            
            <h4>找北极星</h4>
            <ul>
                <li><strong>方法</strong>：找到北斗七星，延长勺口两颗星5倍距离</li>
                <li><strong>效果</strong>：以北极星为中心，星星形成同心圆轨迹</li>
            </ul>
            
            <h3>深空天体摄影</h3>
            
            <h4>器材升级</h4>
            <ul>
                <li><strong>赤道仪</strong>：跟踪星空转动，实现更长曝光不拖尾</li>
                <li><strong>长焦镜头</strong>：200-600mm拍摄星云、星系</li>
                <li><strong>改机</strong>：移除相机低通滤镜，增强H-α波段敏感度</li>
            </ul>
            
            <h4>拍摄目标</h4>
            <ul>
                <li><strong>猎户座大星云</strong>：冬季最亮，肉眼可见</li>
                <li><strong>仙女座星系</strong>：秋季，肉眼可见的星系</li>
                <li><strong>昴星团（七姐妹）</strong>：冬季，蓝色反射星云</li>
            </ul>
            
            <h3>光绘摄影</h3>
            <ul>
                <li><strong>原理</strong>：长曝光+移动光源作画</li>
                <li><strong>工具</strong>：手电筒、荧光棒、钢丝棉（火花）</li>
                <li><strong>参数</strong>：ISO 100-400，光圈f/8-f/11，快门B门数秒到数分钟</li>
                <li><strong>技巧</strong>：人物可以定格在画面中，光源移动作画</li>
            </ul>
            
            <h3>后期处理</h3>
            <ul>
                <li><strong>降噪</strong>：使用Topaz DeNoise AI或Lightroom降噪</li>
                <li><strong>堆栈</strong>：多张叠加降低噪点</li>
                <li><strong>调色</strong>：增强银河细节，调整白平衡</li>
                <li><strong>地景合成</strong>：单独拍摄地景，与星空合成</li>
            </ul>
        `,
        tips: ['远离光污染是星空摄影的首要条件', '关注月相，避开满月前后', '使用Star Walk 2或Planit! APP规划拍摄', '对焦是难点，建议使用实时取景放大对焦亮星'],
        exifRules: {
            aperture: { note: '使用最大光圈' },
            iso: { min: 3200, max: 12800 },
            shutter: { max: 30, note: '500/焦距=最大秒数' }
        }
    },
    
    architecture: {
        title: '建筑摄影',
        category: '风光摄影',
        icon: 'fa-building',
        content: `
            <h3>建筑摄影器材</h3>
            
            <h4>镜头选择</h4>
            <ul>
                <li><strong>移轴镜头</strong>：TS-E 17mm/24mm，纠正透视变形，保持线条垂直</li>
                <li><strong>超广角</strong>：16-35mm，拍摄大场景和室内空间</li>
                <li><strong>标准变焦</strong>：24-70mm，拍摄建筑细节</li>
                <li><strong>长焦</strong>：70-200mm，压缩空间，拍摄局部</li>
            </ul>
            
            <h4>必备配件</h4>
            <ul>
                <li><strong>三脚架</strong>：确保画面清晰，小光圈长曝光必需</li>
                <li><strong>水平仪</strong>：保持相机水平，避免后期裁剪</li>
                <li><strong>CPL偏振镜</strong>：消除玻璃反光，增强天空色彩</li>
                <li><strong>ND减光镜</strong>：白天长曝光，消除人流</li>
            </ul>
            
            <h3>透视控制</h3>
            
            <h4>透视变形问题</h4>
            <p>仰拍建筑时，垂直线条会向上汇聚，产生"倾倒"效果。</p>
            <ul>
                <li><strong>产生原因</strong>：传感器平面与建筑立面不平行</li>
                <li><strong>视觉感受</strong>：建筑向后倾倒，不稳定感</li>
            </ul>
            
            <h4>解决方法</h4>
            <ul>
                <li><strong>移轴镜头</strong>：镜头光轴平移，纠正透视，最佳方案</li>
                <li><strong>后期纠正</strong>：Lightroom变换工具，会损失画面边缘</li>
                <li><strong>拍摄位置</strong>：找高点平视拍摄，或拍摄距离足够远</li>
                <li><strong>中画幅</strong>：更大的传感器，更大的移轴空间</li>
            </ul>
            
            <h3>构图技巧</h3>
            
            <h4>对称构图</h4>
            <ul>
                <li><strong>适用</strong>：正面拍摄，建筑本身对称</li>
                <li><strong>要点</strong>：严格居中，左右对称</li>
                <li><strong>倒影</strong>：利用水面倒影，上下对称</li>
            </ul>
            
            <h4>引导线</h4>
            <ul>
                <li><strong>元素</strong>：道路、走廊、栏杆、线条</li>
                <li><strong>作用</strong>：引导视线到建筑主体</li>
            </ul>
            
            <h4>框架构图</h4>
            <ul>
                <li><strong>元素</strong>：门窗、拱门、树枝</li>
                <li><strong>作用</strong>：框住建筑，增加层次</li>
            </ul>
            
            <h4>极简构图</h4>
            <ul>
                <li><strong>元素</strong>：几何线条、色块、光影</li>
                <li><strong>要点</strong>：去除多余元素，突出形式美</li>
            </ul>
            
            <h3>光线运用</h3>
            
            <h4>自然光</h4>
            <ul>
                <li><strong>侧光</strong>：强调建筑立体感，质感最佳</li>
                <li><strong>逆光</strong>：剪影效果，强调轮廓</li>
                <li><strong>黄金时刻</strong>：暖色调，质感温暖</li>
                <li><strong>阴天</strong>：光线柔和，适合表现细节</li>
            </ul>
            
            <h4>夜景拍摄</h4>
            <ul>
                <li><strong>蓝调时刻</strong>：天空还有细节，建筑灯光已亮</li>
                <li><strong>参数</strong>：ISO 100-400，f/8-f/11，快门数秒</li>
                <li><strong>车流</strong>：利用车流光轨增加动感</li>
                <li><strong>注意</strong>：高光不要过曝，暗部保留细节</li>
            </ul>
            
            <h3>室内空间摄影</h3>
            
            <h4>器材</h4>
            <ul>
                <li><strong>超广角</strong>：16-24mm，展现空间感</li>
                <li><strong>移轴</strong>：纠正垂直线条</li>
                <li><strong>三脚架</strong>：小光圈长曝光</li>
            </ul>
            
            <h4>布光</h4>
            <ul>
                <li><strong>自然光</strong>：利用窗户光线，柔和自然</li>
                <li><strong>人工光</strong>：闪光灯或持续光源补光</li>
                <li><strong>HDR</strong>：大光比场景，包围曝光</li>
            </ul>
            
            <h4>拍摄要点</h4>
            <ul>
                <li><strong>角落拍摄</strong>：展现空间最大深度</li>
                <li><strong>高度</strong>：镜头高度1.2-1.5米，符合人眼视角</li>
                <li><strong>整洁</strong>：清理杂物，保持画面简洁</li>
            </ul>
            
            <h3>后期处理</h3>
            <ul>
                <li><strong>透视纠正</strong>：变换工具，垂直线条拉直</li>
                <li><strong>HDR合成</strong>：大光比场景，保留细节</li>
                <li><strong>去畸变</strong>：镜头配置文件校正</li>
                <li><strong>清晰度</strong>：适当提升，增强质感</li>
            </ul>
        `,
        tips: ['使用实时取景精确对焦', '注意水平仪，保持横平竖直', '移轴镜头是建筑摄影的最佳选择', '蓝调时刻是城市建筑夜景的最佳拍摄时间'],
        exifRules: {
            aperture: { min: 8, max: 11 },
            iso: { max: 400 },
            tripod: true
        }
    },
    
    travel: {
        title: '旅拍Vlog',
        category: '风光摄影',
        icon: 'fa-plane',
        content: `
            <h3>旅拍人像技巧</h3>
            
            <h4>环境融合</h4>
            <ul>
                <li><strong>人小景大</strong>：人物占画面1/3以下，突出环境氛围</li>
                <li><strong>背影/侧影</strong>：不露正脸，营造神秘感</li>
                <li><strong>服装搭配</strong>：穿着与当地环境协调，或形成对比</li>
                <li><strong>道具运用</strong>：当地特色物品，如草帽、地图、相机</li>
            </ul>
            
            <h4>拍摄时机</h4>
            <ul>
                <li><strong>黄金时刻</strong>：日出日落，光线柔和温暖</li>
                <li><strong>蓝调时刻</strong>：城市灯光与天空冷暖对比</li>
                <li><strong>特殊天气</strong>：云海、彩虹、雪景，独特氛围</li>
            </ul>
            
            <h3>Vlog制作流程</h3>
            
            <h4>前期策划</h4>
            <ul>
                <li><strong>选题</strong>：确定主题，如美食之旅、探险之旅</li>
                <li><strong>脚本</strong>：撰写大纲，规划镜头和台词</li>
                <li><strong>分镜</strong>：设计关键画面，提高拍摄效率</li>
            </ul>
            
            <h4>拍摄内容</h4>
            <ol>
                <li><strong>开场</strong>：目的地介绍，吸引观众</li>
                <li><strong>过程</strong>：交通、住宿、美食，真实体验</li>
                <li><strong>景点</strong>：打卡、体验、互动</li>
                <li><strong>人文</strong>：当地人、文化、故事</li>
                <li><strong>结尾</strong>：总结、推荐、互动</li>
            </ol>
            
            <h4>必备镜头</h4>
            <ul>
                <li><strong>空镜</strong>：环境、建筑、风景</li>
                <li><strong>特写</strong>：美食、细节、表情</li>
                <li><strong>转场</strong>：遮挡、相似、运动匹配</li>
                <li><strong>B-roll</strong>：补充画面，丰富视觉</li>
            </ul>
            
            <h3>无人机航拍</h3>
            
            <h4>起飞前检查</h4>
            <ul>
                <li><strong>电量</strong>：无人机和遥控器电量充足</li>
                <li><strong>信号</strong>：GPS信号良好，指南针校准</li>
                <li><strong>禁飞区</strong>：查询当地禁飞规定</li>
                <li><strong>天气</strong>：风速、降雨情况</li>
            </ul>
            
            <h4>常用运镜</h4>
            <ul>
                <li><strong>环绕（Orbit）</strong>：围绕主体360度旋转</li>
                <li><strong>拉升（Reveal）</strong>：从低处拉升到高处，展现全景</li>
                <li><strong>跟随（Follow）</strong>：跟随主体移动</li>
                <li><strong>俯冲（Dive）</strong>：从高处俯冲向下，视觉冲击</li>
                <li><strong>平移（Truck）</strong>：水平移动，展现环境</li>
            </ul>
            
            <h4>安全注意</h4>
            <ul>
                <li>保持视距内飞行</li>
                <li>避让人群和建筑物</li>
                <li>注意返航电量</li>
                <li>购买保险</li>
            </ul>
            
            <h3>平台优化</h3>
            
            <h4>抖音/快手</h4>
            <ul>
                <li><strong>比例</strong>：竖屏9:16</li>
                <li><strong>时长</strong>：15-60秒，节奏快</li>
                <li><strong>音乐</strong>：热门BGM，卡点剪辑</li>
                <li><strong>标题</strong>：悬念、反转、干货</li>
            </ul>
            
            <h4>B站/YouTube</h4>
            <ul>
                <li><strong>比例</strong>：横屏16:9</li>
                <li><strong>时长</strong>：5-20分钟，内容深度</li>
                <li><strong>结构</strong>：完整叙事，有头有尾</li>
                <li><strong>互动</strong>：弹幕、评论、三连</li>
            </ul>
            
            <h4>小红书</h4>
            <ul>
                <li><strong>形式</strong>：图文为主，视频为辅</li>
                <li><strong>内容</strong>：攻略、清单、避坑</li>
                <li><strong>封面</strong>：精美拼图，标题醒目</li>
                <li><strong>标签</strong>：热门话题，精准标签</li>
            </ul>
            
            <h3>器材推荐</h3>
            <ul>
                <li><strong>相机</strong>：索尼A7C、富士X-S10（轻便高画质）</li>
                <li><strong>镜头</strong>：24-70mm万金油，16-35mm广角</li>
                <li><strong>无人机</strong>：大疆Mini系列（便携）、Air系列（画质）</li>
                <li><strong>稳定器</strong>：大疆OM系列（手机）、RS系列（相机）</li>
                <li><strong>三脚架</strong>：便携碳纤维，1kg以内</li>
                <li><strong>麦克风</strong>：罗德Wireless GO（无线收音）</li>
            </ul>
            
            <h3>剪辑软件</h3>
            <ul>
                <li><strong>剪映</strong>：免费，功能强大，适合新手</li>
                <li><strong>Premiere Pro</strong>：专业级，与AE配合</li>
                <li><strong>Final Cut Pro</strong>：Mac专属，效率高</li>
                <li><strong>DaVinci Resolve</strong>：免费专业级，调色强</li>
            </ul>
        `,
        tips: ['轻装上阵，器材够用就好', '多拍素材，给后期留余地', '讲好故事，情感共鸣最重要', '提前踩点，规划拍摄路线'],
        equipment: ['广角镜头', '无人机', '稳定器', '便携三脚架']
    },
    
    // ========== 专题摄影 ==========
    street: {
        title: '街头摄影',
        category: '专题摄影',
        icon: 'fa-walking',
        content: `
            <h3>街头摄影器材</h3>
            <ul>
                <li><strong>35mm</strong>：经典街拍焦段，接近人眼视角</li>
                <li><strong>28mm</strong>：广角冲击力强，适合环境人像</li>
                <li><strong>50mm</strong>：压缩感、背景虚化，适合特写</li>
                <li><strong>相机设置</strong>：光圈优先f/8，区域对焦，超焦距</li>
            </ul>
            
            <h3>拍摄技巧</h3>
            <ul>
                <li><strong>预判</strong>：提前构图等待决定性瞬间</li>
                <li><strong>盲拍</strong>：不举相机到眼前，减少侵入感</li>
                <li><strong>连拍</strong>：捕捉动态瞬间</li>
                <li><strong>层次感</strong>：利用前景中景背景创造深度</li>
                <li><strong>光影</strong>：寻找有趣的光影对比</li>
            </ul>
            
            <h3>主题类型</h3>
            <ul>
                <li><strong>决定性瞬间</strong>：人物动作、表情、互动的完美时机</li>
                <li><strong>几何构图</strong>：利用建筑线条、光影几何</li>
                <li><strong>对比冲突</strong>：新旧、大小、贫富、动静</li>
                <li><strong>孤独感</strong>：空旷街道上的 solitary figure</li>
                <li><strong>倒影</strong>：雨后水洼、玻璃橱窗</li>
            </ul>
            
            <h3>法律与道德</h3>
            <ul>
                <li><strong>公共场合</strong>：一般可拍摄，但尊重被摄者</li>
                <li><strong>商业用途</strong>：需要获得肖像权授权</li>
                <li><strong>敏感场所</strong>：避免拍摄军事、政府设施</li>
                <li><strong>被摄者反应</strong>：如对方反感，应删除照片并道歉</li>
            </ul>
            
            <h3>著名摄影师</h3>
            <ul>
                <li><strong>布列松</strong>：决定性瞬间理论创始人</li>
                <li><strong>薇薇安·迈尔</strong>：保姆摄影师，自拍与街头</li>
                <li><strong>森山大道</strong>：高反差、粗颗粒、模糊</li>
            </ul>
        `,
        tips: ['融入环境，不要显得像游客', '保持相机随时待命', '尊重被摄者，有冲突时礼貌处理', '多走多拍，量变产生质变'],
        masters: ['布列松', '薇薇安·迈尔', '森山大道']
    },

    wildlife: {
        title: '野生动物',
        category: '专题摄影',
        icon: 'fa-paw',
        content: `
            <h3>鸟类摄影</h3>
            
            <h4>器材要求</h4>
            <ul>
                <li><strong>长焦镜头</strong>：400mm起步，600mm+更佳</li>
                <li><strong>高速连拍</strong>：10fps以上，捕捉飞行动作</li>
                <li><strong>对焦系统</strong>：鸟类眼部对焦功能</li>
                <li><strong>三脚架/独脚架</strong>：支撑长焦，减少疲劳</li>
                <li><strong>伪装帐篷</strong>：近距离拍摄不惊扰</li>
            </ul>
            
            <h4>拍摄技巧</h4>
            <ul>
                <li><strong>眼部对焦</strong>：眼睛必须清晰锐利</li>
                <li><strong>背景虚化</strong>：大光圈+长焦分离主体</li>
                <li><strong>飞行姿态</strong>：翅膀位置要美观，避免完全展开或收起</li>
                <li><strong>眼神光</strong>：眼睛里的光点增加神采</li>
                <li><strong>预留空间</strong>：飞行方向预留更多空间</li>
            </ul>
            
            <h4>拍摄时机</h4>
            <ul>
                <li><strong>清晨</strong>：鸟类最活跃，光线柔和</li>
                <li><strong>黄昏</strong>：归巢时间，活动频繁</li>
                <li><strong>繁殖季</strong>：求偶、筑巢、育雏行为丰富</li>
                <li><strong>迁徙季</strong>：候鸟经过，种类丰富</li>
            </ul>
            
            <h3>野生动物伦理</h3>
            <ul>
                <li><strong>不干扰</strong>：不影响动物正常行为</li>
                <li><strong>保持距离</strong>：使用长焦，不靠近惊扰</li>
                <li><strong>不投喂</strong>：改变动物习性，危害健康</li>
                <li><strong>不破坏</strong>：不破坏栖息地，不留垃圾</li>
                <li><strong>保护优先</strong>：动物福利高于照片</li>
            </ul>
            
            <h3>哺乳动物摄影</h3>
            <ul>
                <li><strong>隐蔽接近</strong>：利用地形、植被隐蔽</li>
                <li><strong>耐心等待</strong>：在动物活动区域守候</li>
                <li><strong>了解习性</strong>：掌握动物活动规律</li>
                <li><strong>低角度</strong>：与动物视线平齐，更有冲击力</li>
            </ul>
            
            <h3>昆虫微距</h3>
            <ul>
                <li><strong>微距镜头</strong>：1:1或更高放大倍率</li>
                <li><strong>环形闪光灯</strong>：补光均匀，消除阴影</li>
                <li><strong>对焦堆栈</strong>：多张合成，增加景深</li>
                <li><strong>稳定</strong>：使用三脚架或豆袋</li>
                <li><strong>时机</strong>：清晨昆虫活动慢，易拍摄</li>
            </ul>
            
            <h3>拍摄地点推荐</h3>
            <ul>
                <li><strong>青海湖</strong>：候鸟天堂，斑头雁、棕头鸥</li>
                <li><strong>西双版纳</strong>：热带雨林，鸟类丰富</li>
                <li><strong>卧龙</strong>：大熊猫、金丝猴</li>
                <li><strong>可可西里</strong>：藏羚羊、野牦牛</li>
            </ul>
        `,
        tips: ['耐心是野生动物摄影的第一要素', '了解动物习性比器材更重要', '清晨和黄昏是最佳拍摄时机', '尊重动物，保护优先'],
        exifRules: {
            shutter: { min: 1/1000, note: '冻结动作' },
            iso: { note: '可适当提高保证快门' }
        }
    },
    
    'still-life': {
        title: '静物产品',
        category: '专题摄影',
        icon: 'fa-cube',
        content: `
            <h3>美食摄影</h3>
            <h4>布光方案</h4>
            <ul>
                <li><strong>侧光</strong>：强调纹理</li>
                <li><strong>逆光</strong>：透光效果</li>
                <li><strong>顶光</strong>：均匀照明</li>
            </ul>
            
            <h4>造型技巧</h4>
            <ul>
                <li>新鲜食材点缀</li>
                <li>酱汁淋面增加光泽</li>
                <li>餐具搭配</li>
                <li>45度角最诱人</li>
            </ul>
            
            <h3>电商白底</h3>
            <ul>
                <li>柔光箱均匀照明</li>
                <li>消除反光</li>
                <li>纯白背景</li>
                <li>多角度拍摄</li>
            </ul>
            
            <h3>悬浮摄影</h3>
            <ul>
                <li>分层拍摄后期合成</li>
                <li>使用细线悬挂</li>
                <li>注意阴影方向一致</li>
            </ul>
            
            <h3>液体高速摄影</h3>
            <ul>
                <li><strong>设备</strong>：高速闪光灯（闪光持续时间1/10000s以上）</li>
                <li><strong>原理</strong>：用短时闪光冻结液体飞溅</li>
                <li><strong>触发</strong>：声控或红外触发</li>
                <li><strong>环境</strong>：暗室，长曝光，闪光定格</li>
            </ul>
        `,
        tips: ['产品清洁是第一要务', '使用联机拍摄实时查看', '多角度拍摄供客户选择', '注意阴影方向的一致性'],
        equipment: ['微距镜头', '三脚架', '柔光箱', '硫酸纸']
    },

    wedding: {
        title: '婚礼活动',
        category: '专题摄影',
        icon: 'fa-heart',
        content: `
            <h3>婚礼摄影流程</h3>
            
            <h4>准备阶段</h4>
            <ul>
                <li><strong>沟通</strong>：了解新人需求、家庭情况、特殊安排</li>
                <li><strong>踩点</strong>：提前查看场地，规划拍摄点</li>
                <li><strong>器材</strong>：双机备份，备用电池、存储卡</li>
                <li><strong>服装</strong>：正装出席，不抢风头</li>
            </ul>
            
            <h4>当天拍摄</h4>
            <ol>
                <li><strong>化妆</strong>：新娘化妆过程、婚鞋、戒指</li>
                <li><strong>接亲</strong>：游戏环节、敬茶、出门</li>
                <li><strong>外景</strong>：新人合影、伴郎伴娘团</li>
                <li><strong>仪式</strong>：入场、交换戒指、亲吻、抛花</li>
                <li><strong>敬酒</strong>：宾客互动、全家福</li>
                <li><strong>送客</strong>：送别场景</li>
            </ol>
            
            <h3>关键瞬间</h3>
            <ul>
                <li><strong>first look</strong>：新郎第一次看新娘穿婚纱</li>
                <li><strong>父亲交接</strong>：父亲将女儿交给新郎</li>
                <li><strong>交换戒指</strong>：手部特写</li>
                <li><strong>亲吻</strong>：角度要美</li>
                <li><strong>抛花</strong>：动态瞬间</li>
                <li><strong>眼泪</strong>：情感瞬间</li>
            </ul>
            
            <h3>器材配置</h3>
            <ul>
                <li><strong>双机</strong>：一台广角（24-70mm），一台长焦（70-200mm）</li>
                <li><strong>闪光灯</strong>：机顶闪+离机闪，跳闪补光</li>
                <li><strong>备用</strong>：电池、存储卡、镜头</li>
            </ul>
            
            <h3>注意事项</h3>
            <ul>
                <li><strong>不可重拍</strong>：关键瞬间只有一次机会</li>
                <li><strong>预判</strong>：提前到位，等待瞬间</li>
                <li><strong>低调</strong>：不干扰仪式进行</li>
                <li><strong>备份</strong>：现场双卡备份，回家立即备份</li>
            </ul>
        `,
        tips: ['提前到场，熟悉环境', '与主持人沟通流程', '多拍备份，关键瞬间不能错过', '后期调色要温馨浪漫'],
        pricing: {
            basic: '3000-5000元',
            standard: '8000-15000元',
            premium: '20000元以上'
        }
    },

    // ========== AI摄影 ==========
    'ai-editing': {
        title: 'AI修图',
        category: 'AI摄影',
        icon: 'fa-robot',
        content: `
            <h3>AI修图工具</h3>
            
            <h4>Adobe Photoshop AI</h4>
            <ul>
                <li><strong>生成式填充</strong>：智能扩展画面、移除物体</li>
                <li><strong>生成式扩展</strong>：自动延伸画布内容</li>
                <li><strong>神经滤镜</strong>：一键磨皮、表情调整、年龄变换</li>
                <li><strong>移除工具</strong>：智能识别并去除干扰元素</li>
            </ul>
            
            <h4>Lightroom AI</h4>
            <ul>
                <li><strong>AI蒙版</strong>：自动识别主体、天空、背景</li>
                <li><strong>AI降噪</strong>：深度学习降噪，保留细节</li>
                <li><strong>镜头模糊</strong>：AI模拟景深效果</li>
            </ul>
            
            <h4>专业AI工具</h4>
            <ul>
                <li><strong>Topaz Photo AI</strong>：放大、降噪、锐化三合一</li>
                <li><strong>Luminar Neo</strong>：AI换天、人像修饰</li>
                <li><strong>Retouch4me</strong>：专业人像精修插件</li>
            </ul>
            
            <h3>AI修图工作流</h3>
            <ol>
                <li>基础调整（曝光、白平衡）</li>
                <li>AI降噪/放大（如需要）</li>
                <li>AI移除/修复瑕疵</li>
                <li>AI蒙版局部调整</li>
                <li>AI人像修饰（如适用）</li>
                <li>最终调色输出</li>
            </ol>
            
            <h3>使用建议</h3>
            <ul>
                <li>AI是辅助工具，审美判断仍需人工</li>
                <li>保留原始文件，AI修改可逆</li>
                <li>注意AI生成内容的版权问题</li>
            </ul>
        `,
        tips: ['AI降噪适合高ISO照片', '生成式填充需要精确选区', '适度使用，避免过度处理'],
        tools: ['Photoshop', 'Lightroom', 'Topaz Photo AI', 'Luminar Neo']
    },

    'ai-generation': {
        title: 'AI生成',
        category: 'AI摄影',
        icon: 'fa-wand-magic',
        content: `
            <h3>主流AI图像生成工具</h3>
            
            <h4>Midjourney</h4>
            <ul>
                <li><strong>特点</strong>：艺术感强，美学表现优秀</li>
                <li><strong>适用</strong>：概念设计、创意视觉</li>
                <li><strong>学习曲线</strong>：中等，需掌握提示词技巧</li>
            </ul>
            
            <h4>Stable Diffusion</h4>
            <ul>
                <li><strong>特点</strong>：开源免费，高度可定制</li>
                <li><strong>适用</strong>：本地部署、精细控制</li>
                <li><strong>优势</strong>：ControlNet精准控制构图</li>
            </ul>
            
            <h4>DALL·E 3</h4>
            <ul>
                <li><strong>特点</strong>：理解能力强，文字理解准确</li>
                <li><strong>适用</strong>：快速生成、概念验证</li>
                <li><strong>集成</strong>：ChatGPT Plus可用</li>
            </ul>
            
            <h4>Adobe Firefly</h4>
            <ul>
                <li><strong>特点</strong>：商业安全，训练数据合规</li>
                <li><strong>适用</strong>：商业设计、企业应用</li>
                <li><strong>集成</strong>：Photoshop、Illustrator原生支持</li>
            </ul>
            
            <h3>摄影相关应用</h3>
            <ul>
                <li><strong>灵感参考</strong>：生成创意构图和布光方案</li>
                <li><strong>背景生成</strong>：产品摄影的虚拟场景</li>
                <li><strong>风格探索</strong>：尝试不同摄影风格效果</li>
                <li><strong>素材补充</strong>：生成合成所需的元素</li>
            </ul>
            
            <h3>提示词技巧</h3>
            <ul>
                <li>使用具体摄影术语（焦段、光圈、光线）</li>
                <li>指定相机型号增强真实感</li>
                <li>加入摄影师风格参考</li>
                <li>使用负面提示词排除不想要的内容</li>
            </ul>
        `,
        tips: ['AI生成图片不可直接作为摄影作品', '可用于创意参考和前期规划', '注意平台使用条款和版权问题'],
        platforms: ['Midjourney', 'Stable Diffusion', 'DALL·E 3', 'Adobe Firefly']
    },

    topaz: {
        title: 'Topaz工具',
        category: 'AI摄影',
        icon: 'fa-wand-magic-sparkles',
        content: `
            <h3>Topaz Photo AI</h3>
            <p>集放大、降噪、锐化于一体的AI后期软件。</p>
            
            <h4>主要功能</h4>
            <ul>
                <li><strong>Gigapixel AI</strong>：图片放大，最高6倍，保留细节</li>
                <li><strong>DeNoise AI</strong>：AI降噪，恢复细节</li>
                <li><strong>Sharpen AI</strong>：智能锐化，修复模糊</li>
                <li><strong>Photo AI</strong>：三合一，自动优化</li>
            </ul>
            
            <h4>使用场景</h4>
            <ul>
                <li>老照片修复放大</li>
                <li>高ISO照片降噪</li>
                <li>手抖模糊修复</li>
                <li>打印大幅面输出</li>
            </ul>
            
            <h4>工作流程</h4>
            <ol>
                <li>导入图片</li>
                <li>选择AI模型（标准/低分辨率/艺术CG）</li>
                <li>调整强度参数</li>
                <li>预览对比</li>
                <li>导出保存</li>
            </ol>
            
            <h3>Topaz Video AI</h3>
            <ul>
                <li>视频放大、降噪、补帧</li>
                <li>老视频修复</li>
                <li> slo-mo 慢动作生成</li>
            </ul>
        `,
        tips: ['RAW格式效果最佳', '适度调整强度', '最后一步使用'],
        workflow: ['DeNoise降噪', 'Sharpen锐化', 'Gigapixel放大']
    },

    midjourney: {
        title: 'Midjourney',
        category: 'AI摄影',
        icon: 'fa-wand-magic-sparkles',
        content: `
            <h3>订阅计划</h3>
            <ul>
                <li><strong>Basic</strong>：$10/月，3.3小时GPU</li>
                <li><strong>Standard</strong>：$30/月，15小时GPU</li>
                <li><strong>Pro</strong>：$60/月，30小时GPU+隐身模式</li>
            </ul>
            
            <h3>常用参数</h3>
            <ul>
                <li><strong>--ar</strong>：宽高比（16:9, 3:2, 1:1）</li>
                <li><strong>--v 6</strong>：版本6，最新最真</li>
                <li><strong>--style raw</strong>：减少AI美化</li>
                <li><strong>--s 50</strong>：风格化程度</li>
                <li><strong>--q 2</strong>：质量等级</li>
            </ul>
            
            <h3>摄影提示词公式</h3>
            <p><code>[主体] + [环境] + [光线] + [相机参数] + [风格] + [质量词]</code></p>
            
            <h3>示例</h3>
            <p>"portrait of a young woman, golden hour lighting, shot on Canon R5, 85mm f/1.2, soft bokeh, professional photography, 8k, highly detailed --ar 2:3 --v 6 --style raw"</p>
            
            <h3>摄影风格关键词</h3>
            <ul>
                <li><strong>光线</strong>：golden hour, soft lighting, dramatic lighting</li>
                <li><strong>相机</strong>：shot on Canon R5, Sony A7IV</li>
                <li><strong>镜头</strong>：85mm f/1.2, 35mm lens</li>
                <li><strong>胶片</strong>：Kodak Portra 400, Fujifilm Velvia</li>
                <li><strong>风格</strong>：cinematic, documentary, fashion</li>
            </ul>
        `,
        tips: ['参考真实摄影作品描述', '使用具体相机参数', 'raw模式更真实'],
        resources: ['Midjourney官网', 'PromptHero', 'Lexica']
    },

    wedding: {
        title: '婚礼活动',
        category: '专题摄影',
        icon: 'fa-heart',
        content: `
            <h3>婚礼流程</h3>
            <ol>
                <li><strong>准备阶段</strong>：化妆、婚纱、细节</li>
                <li><strong>接亲</strong>：游戏、敬茶</li>
                <li><strong>外景</strong>：新人合影</li>
                <li><strong>仪式</strong>：交换戒指、亲吻</li>
                <li><strong>宴会</strong>：敬酒、互动</li>
            </ol>
            
            <h3>器材准备</h3>
            <ul>
                <li><strong>双机</strong>：24-70mm + 70-200mm</li>
                <li><strong>闪光灯</strong>：跳闪补光</li>
                <li><strong>备用电池</strong>：多带几块</li>
                <li><strong>双卡存储</strong>：数据安全</li>
            </ul>
            
            <h3>拍摄要点</h3>
            <ul>
                <li>提前踩点了解流程</li>
                <li>抓拍自然情感</li>
                <li>注意双方父母</li>
                <li>重要环节不能漏</li>
            </ul>
            
            <h3>活动摄影</h3>
            <ul>
                <li>全景、中景、特写都要有</li>
                <li>领导讲话、互动环节</li>
                <li>观众反应</li>
                <li>快速出片需求</li>
            </ul>
        `,
        tips: ['提前沟通需求', '准备 shot list', '快速反应抓瞬间'],
        pricing: {
            wedding: '3000-20000元/场',
            event: '2000-10000元/天'
        }
    },
    
    // ========== AI 摄影 ==========
    'ai-editing': {
        title: 'AI修图',
        category: 'AI 摄影',
        icon: 'fa-robot',
        content: `
            <h3>Topaz 系列</h3>
            <ul>
                <li><strong>DeNoise AI</strong>：AI降噪，保留细节</li>
                <li><strong>Sharpen AI</strong>：智能锐化，修复模糊</li>
                <li><strong>Gigapixel AI</strong>：无损放大，最高6倍</li>
                <li><strong>Photo AI</strong>：全能套件，一键优化</li>
            </ul>
            
            <h3>Adobe AI功能</h3>
            <ul>
                <li><strong>Camera Raw AI</strong>：降噪、超分辨率</li>
                <li><strong>Neural Filters</strong>：人像修饰、风格迁移</li>
                <li><strong>Generative Fill</strong>：生成式填充</li>
                <li><strong>AI蒙版</strong>：自动识别主体、天空</li>
            </ul>
            
            <h3>使用建议</h3>
            <ul>
                <li>AI是辅助，不是替代</li>
                <li>适度使用，避免过度处理</li>
                <li>保留原始文件</li>
            </ul>
        `,
        tips: ['降噪优先用AI', '放大需求用Gigapixel', '生成填充要谨慎'],
        tools: ['Topaz Photo AI', 'Adobe Photoshop', 'Luminar Neo']
    },
    
    'ai-generation': {
        title: 'AI生成',
        category: 'AI 摄影',
        icon: 'fa-magic',
        content: `
            <h3>Midjourney</h3>
            <h4>基础用法</h4>
            <ul>
                <li><strong>/imagine</strong>：生成图片</li>
                <li><strong>参数</strong>：--ar 16:9 --v 6 --style raw</li>
                <li><strong>提示词结构</strong>：主体+环境+风格+参数</li>
            </ul>
            
            <h4>摄影风格提示词</h4>
            <ul>
                <li>photo realistic, 8k, cinematic lighting</li>
                <li>shot on Sony A7R4, 85mm f/1.4</li>
                <li>golden hour, shallow depth of field</li>
            </ul>
            
            <h3>Stable Diffusion</h3>
            <ul>
                <li><strong>本地部署</strong>：需要显卡</li>
                <li><strong>模型选择</strong>：写实、动漫、艺术</li>
                <li><strong>ControlNet</strong>：控制构图姿态</li>
            </ul>
            
            <h3>伦理与版权</h3>
            <ul>
                <li>不冒充真实照片</li>
                <li>注意训练数据版权</li>
                <li>商业使用需谨慎</li>
            </ul>
        `,
        tips: ['提示词越详细越好', '多尝试不同参数', '结合真实摄影知识'],
        prompts: {
            portrait: 'professional portrait, soft lighting, 85mm lens, f/1.8, bokeh background',
            landscape: 'stunning landscape, golden hour, wide angle, sharp focus, vibrant colors'
        }
    },
    
    topaz: {
        title: 'Topaz工具',
        category: 'AI 摄影',
        icon: 'fa-tools',
        content: `
            <h3>Topaz DeNoise AI</h3>
            <ul>
                <li>自动识别噪点和细节</li>
                <li>比传统降噪保留更多纹理</li>
                <li>适合高ISO照片</li>
            </ul>
            
            <h3>Topaz Sharpen AI</h3>
            <ul>
                <li>修复轻微模糊</li>
                <li>三种模式：稳定、聚焦、锐化</li>
                <li>不能修复严重失焦</li>
            </ul>
            
            <h3>Topaz Gigapixel AI</h3>
            <ul>
                <li>无损放大最高6倍</li>
                <li>增加真实细节</li>
                <li>适合打印大尺寸</li>
            </ul>
            
            <h3>Topaz Photo AI</h3>
            <ul>
                <li>集成降噪、锐化、放大</li>
                <li>自动检测最优设置</li>
                <li>批量处理</li>
            </ul>
        `,
        tips: ['RAW格式效果最佳', '适度调整强度', '最后一步使用'],
        workflow: ['DeNoise降噪', 'Sharpen锐化', 'Gigapixel放大']
    },
    
    midjourney: {
        title: 'Midjourney',
        category: 'AI 摄影',
        icon: 'fa-wand-magic-sparkles',
        content: `
            <h3>订阅计划</h3>
            <ul>
                <li><strong>Basic</strong>：$10/月，3.3小时GPU</li>
                <li><strong>Standard</strong>：$30/月，15小时GPU</li>
                <li><strong>Pro</strong>：$60/月，30小时GPU+隐身模式</li>
            </ul>
            
            <h3>常用参数</h3>
            <ul>
                <li><strong>--ar</strong>：宽高比（16:9, 3:2, 1:1）</li>
                <li><strong>--v 6</strong>：版本6，最新最真</li>
                <li><strong>--style raw</strong>：减少AI美化</li>
                <li><strong>--s 50</strong>：风格化程度</li>
                <li><strong>--q 2</strong>：质量等级</li>
            </ul>
            
            <h3>摄影提示词公式</h3>
            <p><code>[主体] + [环境] + [光线] + [相机参数] + [风格] + [质量词]</code></p>
            
            <h3>示例</h3>
            <p>"portrait of a young woman, golden hour lighting, shot on Canon R5, 85mm f/1.2, soft bokeh, professional photography, 8k, highly detailed --ar 2:3 --v 6 --style raw"</p>
        `,
        tips: ['参考真实摄影作品描述', '使用具体相机参数', 'raw模式更真实'],
        resources: ['Midjourney官网', 'PromptHero', 'Lexica']
    },

    // ========== 缺失专题补充 ==========
    'post-processing': {
        title: '后期处理',
        category: '技术基础',
        icon: 'fa-sliders-h',
        content: `
            <h3>RAW处理流程</h3>
            <h4>1. 基础调整</h4>
            <ul>
                <li><strong>曝光</strong>：调整整体亮度，恢复高光/阴影细节</li>
                <li><strong>白平衡</strong>：校正色温，确保色彩准确</li>
                <li><strong>对比度</strong>：控制明暗差异，增强立体感</li>
            </ul>
            
            <h4>2. 色调调整</h4>
            <ul>
                <li><strong>HSL</strong>：单独调整色相、饱和度、明度</li>
                <li><strong>分离色调</strong>：高光/阴影分别着色</li>
                <li><strong>校准</strong>：红原色/绿原色/蓝原色微调</li>
            </ul>
            
            <h4>3. 细节优化</h4>
            <ul>
                <li><strong>锐化</strong>：数量、半径、细节、蒙版</li>
                <li><strong>降噪</strong>：明亮度降噪、颜色降噪</li>
                <li><strong>去朦胧</strong>：增强通透感</li>
            </ul>
            
            <h3>常用软件</h3>
            <ul>
                <li><strong>Lightroom</strong>：批量处理、资产管理</li>
                <li><strong>Photoshop</strong>：精修、合成、创意处理</li>
                <li><strong>Capture One</strong>：专业RAW处理</li>
                <li><strong>DXO PhotoLab</strong>：自动光学校正</li>
            </ul>
            
            <h3>输出设置</h3>
            <ul>
                <li><strong>网络分享</strong>：sRGB色彩空间，72dpi，长边2048px</li>
                <li><strong>打印输出</strong>：Adobe RGB或ProPhoto，300dpi</li>
                <li><strong>存档</strong>：TIFF或PSD，保留图层</li>
            </ul>
        `,
        tips: ['RAW格式保留最大调整空间', '调整顺序：曝光→色调→细节→风格', '善用局部调整工具'],
        software: ['Lightroom', 'Photoshop', 'Capture One']
    },

    'still-life': {
        title: '静物产品',
        category: '专题摄影',
        icon: 'fa-cube',
        content: `
            <h3>产品摄影类型</h3>
            <h4>1. 白底图</h4>
            <ul>
                <li><strong>用途</strong>：电商平台、产品目录</li>
                <li><strong>背景</strong>：纯白或纯黑，无阴影</li>
                <li><strong>布光</strong>：均匀柔和，消除反光</li>
                <li><strong>后期</strong>：抠图、校色、统一尺寸</li>
            </ul>
            
            <h4>2. 场景图</h4>
            <ul>
                <li><strong>用途</strong>：品牌宣传、社交媒体</li>
                <li><strong>道具</strong>：与产品相关的配饰和环境</li>
                <li><strong>氛围</strong>：营造使用场景和生活方式</li>
            </ul>
            
            <h4>3. 创意图</h4>
            <ul>
                <li><strong>用途</strong>：广告、海报</li>
                <li><strong>手法</strong>：悬浮、爆炸、微距等创意效果</li>
                <li><strong>后期</strong>：合成、特效、艺术处理</li>
            </ul>
            
            <h3>布光技巧</h3>
            <ul>
                <li><strong>柔光</strong>：硫酸纸、柔光箱消除硬阴影</li>
                <li><strong>旗板</strong>：精确控制光线范围</li>
                <li><strong>反光板</strong>：填充阴影，控制光比</li>
                <li><strong>偏振镜</strong>：消除非金属表面反光</li>
            </ul>
            
            <h3>拍摄要点</h3>
            <ul>
                <li>使用三脚架确保精准构图</li>
                <li>小光圈（f/8-f/16）获得大景深</li>
                <li>ISO 100保证画质纯净</li>
                <li>手动对焦确保焦点精准</li>
            </ul>
        `,
        tips: ['产品清洁是第一要务', '使用联机拍摄实时查看', '多角度拍摄供客户选择'],
        equipment: ['微距镜头或标准变焦', '三脚架', '柔光箱/硫酸纸']
    },

    'ai-editing': {
        title: 'AI修图',
        category: 'AI 摄影',
        icon: 'fa-robot',
        content: `
            <h3>AI修图工具</h3>
            <h4>1. Adobe Photoshop AI</h4>
            <ul>
                <li><strong>生成式填充</strong>：智能扩展画面、移除物体</li>
                <li><strong>生成式扩展</strong>：自动延伸画布内容</li>
                <li><strong>神经滤镜</strong>：一键磨皮、表情调整、年龄变换</li>
                <li><strong>移除工具</strong>：智能识别并去除干扰元素</li>
            </ul>
            
            <h4>2. Lightroom AI</h4>
            <ul>
                <li><strong>AI蒙版</strong>：自动识别主体、天空、背景</li>
                <li><strong>AI降噪</strong>：深度学习降噪，保留细节</li>
                <li><strong>镜头模糊</strong>：AI模拟景深效果</li>
            </ul>
            
            <h4>3. 专业AI工具</h4>
            <ul>
                <li><strong>Topaz Photo AI</strong>：放大、降噪、锐化三合一</li>
                <li><strong>Luminar Neo</strong>：AI换天、人像修饰</li>
                <li><strong>Retouch4me</strong>：专业人像精修插件</li>
            </ul>
            
            <h3>AI修图工作流</h3>
            <ol>
                <li>基础调整（曝光、白平衡）</li>
                <li>AI降噪/放大（如需要）</li>
                <li>AI移除/修复瑕疵</li>
                <li>AI蒙版局部调整</li>
                <li>AI人像修饰（如适用）</li>
                <li>最终调色输出</li>
            </ol>
            
            <h3>使用建议</h3>
            <ul>
                <li>AI是辅助工具，审美判断仍需人工</li>
                <li>保留原始文件，AI修改可逆</li>
                <li>注意AI生成内容的版权问题</li>
            </ul>
        `,
        tips: ['AI降噪适合高ISO照片', '生成式填充需要精确选区', '适度使用，避免过度处理'],
        tools: ['Photoshop', 'Lightroom', 'Topaz Photo AI', 'Luminar Neo']
    },

    'ai-generation': {
        title: 'AI生成',
        category: 'AI 摄影',
        icon: 'fa-wand-magic',
        content: `
            <h3>主流AI图像生成工具</h3>
            <h4>1. Midjourney</h4>
            <ul>
                <li><strong>特点</strong>：艺术感强，美学表现优秀</li>
                <li><strong>适用</strong>：概念设计、创意视觉</li>
                <li><strong>学习曲线</strong>：中等，需掌握提示词技巧</li>
            </ul>
            
            <h4>2. Stable Diffusion</h4>
            <ul>
                <li><strong>特点</strong>：开源免费，高度可定制</li>
                <li><strong>适用</strong>：本地部署、精细控制</li>
                <li><strong>优势</strong>：ControlNet精准控制构图</li>
            </ul>
            
            <h4>3. DALL·E 3</h4>
            <ul>
                <li><strong>特点</strong>：理解能力强，文字理解准确</li>
                <li><strong>适用</strong>：快速生成、概念验证</li>
                <li><strong>集成</strong>：ChatGPT Plus可用</li>
            </ul>
            
            <h4>4. Adobe Firefly</h4>
            <ul>
                <li><strong>特点</strong>：商业安全，训练数据合规</li>
                <li><strong>适用</strong>：商业设计、企业应用</li>
                <li><strong>集成</strong>：Photoshop、Illustrator原生支持</li>
            </ul>
            
            <h3>摄影相关应用</h3>
            <ul>
                <li><strong>灵感参考</strong>：生成创意构图和布光方案</li>
                <li><strong>背景生成</strong>：产品摄影的虚拟场景</li>
                <li><strong>风格探索</strong>：尝试不同摄影风格效果</li>
                <li><strong>素材补充</strong>：生成合成所需的元素</li>
            </ul>
            
            <h3>提示词技巧</h3>
            <ul>
                <li>使用具体摄影术语（焦段、光圈、光线）</li>
                <li>指定相机型号增强真实感</li>
                <li>加入摄影师风格参考</li>
                <li>使用负面提示词排除不想要的内容</li>
            </ul>
        `,
        tips: ['AI生成图片不可直接作为摄影作品', '可用于创意参考和前期规划', '注意平台使用条款和版权问题'],
        platforms: ['Midjourney', 'Stable Diffusion', 'DALL·E 3', 'Adobe Firefly']
    },

    // ========== 手机摄影 ==========
    'mobile-photography': {
        title: '手机摄影',
        category: '专题摄影',
        icon: 'fa-mobile-alt',
        content: `
            <h3>手机摄影的优势</h3>
            <ul>
                <li><strong>便携性</strong>：随时随地，随身携带</li>
                <li><strong>即时性</strong>：即拍即修即分享</li>
                <li><strong>隐蔽性</strong>：街拍时不易引起注意</li>
                <li><strong>计算摄影</strong>：AI算法辅助夜景、HDR、人像模式</li>
            </ul>
            
            <h3>手机摄影技巧</h3>
            <h4>1. 控制曝光</h4>
            <ul>
                <li>点击屏幕对焦后，上下滑动调整曝光补偿</li>
                <li>长按锁定对焦和曝光，适合逆光拍摄</li>
                <li>使用HDR模式处理大光比场景</li>
            </ul>
            
            <h4>2. 善用网格线</h4>
            <ul>
                <li>设置中开启九宫格辅助线</li>
                <li>将主体放在交点或线上</li>
                <li>利用网格保持水平垂直</li>
            </ul>
            
            <h4>3. 避免数码变焦</h4>
            <ul>
                <li>数码变焦会降低画质，尽量靠近拍摄</li>
                <li>使用光学变焦镜头（如有）</li>
                <li>后期裁剪比数码变焦效果更好</li>
            </ul>
            
            <h4>4. 保持镜头清洁</h4>
            <ul>
                <li>手机镜头容易沾染指纹和灰尘</li>
                <li>拍摄前用软布擦拭镜头</li>
                <li>注意检查画面是否有污点</li>
            </ul>
            
            <h3>专业模式使用</h3>
            <ul>
                <li><strong>ISO</strong>：光线充足用低ISO，夜景可适当提高</li>
                <li><strong>快门速度</strong>：拍流水用慢门，冻结动作用快門</li>
                <li><strong>对焦</strong>：微距拍摄时手动对焦更精准</li>
                <li><strong>白平衡</strong>：根据光源选择合适色温</li>
                <li><strong>RAW格式</strong>：保留更多后期空间（部分手机支持）</li>
            </ul>
            
            <h3>推荐手机修图APP</h3>
            <ul>
                <li><strong>Snapseed</strong>：Google出品，功能全面免费</li>
                <li><strong>VSCO</strong>：胶片模拟滤镜，社交分享</li>
                <li><strong>Lightroom Mobile</strong>：专业调色，同步桌面版</li>
                <li><strong>泼辣修图</strong>：国产优秀，本地化好</li>
                <li><strong>美图秀秀</strong>：人像美颜，简单易用</li>
            </ul>
            
            <h3>手机摄影构图技巧</h3>
            <ul>
                <li>低角度拍摄增强视觉冲击力</li>
                <li>利用水面倒影创造对称构图</li>
                <li>寻找框架元素增加层次感</li>
                <li>简化画面，突出主体</li>
            </ul>
        `,
        tips: ['手机摄影的关键是构图和光线', '多拍多练，培养摄影眼', '善用后期弥补手机硬件限制'],
        apps: ['Snapseed', 'VSCO', 'Lightroom Mobile', '泼辣修图']
    },

    // ========== 参数速查表 ==========
    'cheat-sheet': {
        title: '参数速查表',
        category: '工具',
        icon: 'fa-table',
        content: `
            <h3>常用光圈与效果</h3>
            <table class="cheat-table">
                <tr><th>光圈</th><th>效果</th><th>适用场景</th></tr>
                <tr><td>f/1.2-f/2.0</td><td>极浅景深，梦幻虚化</td><td>人像特写、艺术摄影</td></tr>
                <tr><td>f/2.8-f/4</td><td>适中景深，主体突出</td><td>人像、静物、街拍</td></tr>
                <tr><td>f/5.6-f/8</td><td>较大景深，画质最佳</td><td>风光、建筑、日常</td></tr>
                <tr><td>f/11-f/16</td><td>全景深，星芒效果</td><td>大风光、微距、夜景</td></tr>
            </table>
            
            <h3>安全快门速度</h3>
            <table class="cheat-table">
                <tr><th>焦距</th><th>安全快门</th><th>建议快门</th></tr>
                <tr><td>24mm</td><td>1/24s</td><td>1/30s</td></tr>
                <tr><td>35mm</td><td>1/35s</td><td>1/60s</td></tr>
                <tr><td>50mm</td><td>1/50s</td><td>1/60s-1/125s</td></tr>
                <tr><td>85mm</td><td>1/85s</td><td>1/125s-1/200s</td></tr>
                <tr><td>135mm</td><td>1/135s</td><td>1/200s-1/250s</td></tr>
                <tr><td>200mm</td><td>1/200s</td><td>1/250s-1/500s</td></tr>
            </table>
            <p><em>安全快门 = 1/焦距（全画幅等效）。使用防抖可降2-3档，拍运动物体需更快。</em></p>
            
            <h3>ISO使用建议</h3>
            <table class="cheat-table">
                <tr><th>ISO范围</th><th>画质</th><th>适用场景</th></tr>
                <tr><td>100-400</td><td>最佳画质</td><td>光线充足、三脚架拍摄</td></tr>
                <tr><td>800-1600</td><td>轻微噪点</td><td>阴天室内、黄昏</td></tr>
                <tr><td>3200-6400</td><td>明显噪点</td><td>夜景手持、舞台</td></tr>
                <tr><td>12800+</td><td>噪点严重</td><td>极端暗光，需后期降噪</td></tr>
            </table>
            
            <h3>常见场景参数参考</h3>
            <table class="cheat-table">
                <tr><th>场景</th><th>光圈</th><th>快门</th><th>ISO</th></tr>
                <tr><td>人像（虚化背景）</td><td>f/1.4-f/2.8</td><td>1/125s+</td><td>100-800</td></tr>
                <tr><td>风光（三脚架）</td><td>f/8-f/11</td><td>1-30s</td><td>100-400</td></tr>
                <tr><td>街拍</td><td>f/4-f/8</td><td>1/250s+</td><td>400-1600</td></tr>
                <tr><td>运动</td><td>f/2.8-f/5.6</td><td>1/1000s+</td><td>400-3200</td></tr>
                <tr><td>星空</td><td>最大</td><td>15-25s</td><td>3200-6400</td></tr>
                <tr><td>流水拉丝</td><td>f/8-f/16</td><td>1-4s</td><td>100+ND镜</td></tr>
            </table>
            
            <h3>色温参考</h3>
            <table class="cheat-table">
                <tr><th>光源</th><th>色温(K)</th><th>白平衡设置</th></tr>
                <tr><td>烛光</td><td>1800-2000</td><td>烛光/手动</td></tr>
                <tr><td>白炽灯</td><td>2700-3000</td><td>白炽灯</td></tr>
                <tr><td>日出日落</td><td>3000-4000</td><td>日光/阴天</td></tr>
                <tr><td>正午阳光</td><td>5000-5500</td><td>日光</td></tr>
                <tr><td>阴天</td><td>6000-7000</td><td>阴天</td></tr>
                <tr><td>阴影处</td><td>7000-8000</td><td>阴影</td></tr>
                <tr><td>荧光灯</td><td>4000-5000</td><td>荧光灯</td></tr>
            </table>
        `,
        tips: ['参数是起点，不是终点', '根据实际光线灵活调整', '优先保证快门速度不糊片']
    }
};

// 获取所有知识分类
function getKnowledgeCategories() {
    const categories = {};
    Object.values(KnowledgeBase).forEach(item => {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    });
    return categories;
}

// 根据关键词搜索知识
function searchKnowledge(keyword) {
    const results = [];
    const lowerKeyword = keyword.toLowerCase();
    
    Object.entries(KnowledgeBase).forEach(([key, item]) => {
        if (item.title.toLowerCase().includes(lowerKeyword) ||
            item.content.toLowerCase().includes(lowerKeyword) ||
            item.category.toLowerCase().includes(lowerKeyword)) {
            results.push({ key, ...item });
        }
    });
    
    return results;
}

// 确保全局可用
if (typeof window !== 'undefined') {
    window.KnowledgeBase = KnowledgeBase;
    window.getKnowledgeCategories = getKnowledgeCategories;
    window.searchKnowledge = searchKnowledge;
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { KnowledgeBase, getKnowledgeCategories, searchKnowledge };
}

console.log('knowledge-base.js 加载完成，主题数量:', Object.keys(KnowledgeBase).length);

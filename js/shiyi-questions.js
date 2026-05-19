const shiyiScaleOptions = [
  { label: "非常符合", value: 3 },
  { label: "比较符合", value: 2 },
  { label: "有点符合", value: 1 },
  { label: "有点不符合", value: -1 },
  { label: "比较不符合", value: -2 },
  { label: "非常不符合", value: -3 }
];

const shiyiModeConfig = {
  quick: {
    name: "轻测版",
    tier: 1,
    total: 20,
    desc: "20题｜约3分钟｜快速了解你的拾遗人格"
  },
  standard: {
    name: "标准版",
    tier: 2,
    total: 50,
    desc: "50题｜约8分钟｜推荐首次完整测评"
  },
  deep: {
    name: "深测版",
    tier: 3,
    total: 100,
    desc: "100题｜约15分钟｜适合深度探索与调研分析"
  }
};

/*
  dimension:
  EI = E 外显型 / I 内省型
  HC = H 亲历型 / C 共创型
  LT = L 生活型 / T 传统型
  MP = M 物艺型 / P 表演型

  positive:
  用户选择“符合”时，增加 positive 对应字母的分数；
  用户选择“不符合”时，增加 opposite 对应字母的分数。
*/

const shiyiQuestionBank = [
  // E / I：外显型 / 内省型
  {
    id: "EI001",
    tier: 1,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "在非遗活动现场，我通常会先被人群氛围、互动感和现场情绪吸引。"
  },
  {
    id: "EI002",
    tier: 1,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "接触一个非遗项目时，我更想先了解它的历史来源、传承脉络和文化背景。"
  },
  {
    id: "EI003",
    tier: 1,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "如果现场有非遗体验活动，我会比较愿意主动上前参与或和别人交流。"
  },
  {
    id: "EI004",
    tier: 1,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "相比热闹地参与活动，我更喜欢安静观察非遗项目中的细节。"
  },
  {
    id: "EI005",
    tier: 1,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "我更容易被有声音、有动作、有互动的非遗展示方式打动。"
  },
  {
    id: "EI006",
    tier: 2,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "我会在意一个非遗项目为什么能流传下来，而不只是它看起来是否热闹。"
  },
  {
    id: "EI007",
    tier: 2,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "在集市、展演或节庆现场，我通常会更快进入状态。"
  },
  {
    id: "EI008",
    tier: 2,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "如果没有足够的背景资料，我会觉得自己还没有真正理解一个非遗项目。"
  },
  {
    id: "EI009",
    tier: 2,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "我愿意把自己看到的非遗现场感受直接分享给身边的人。"
  },
  {
    id: "EI010",
    tier: 2,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "我更喜欢通过阅读、访谈或资料整理的方式慢慢认识非遗。"
  },
  {
    id: "EI011",
    tier: 2,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "热闹的非遗现场会让我产生更强的参与欲。"
  },
  {
    id: "EI012",
    tier: 2,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "我常常会思考非遗背后反映了怎样的地方社会和生活方式。"
  },
  {
    id: "EI013",
    tier: 3,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "我更喜欢边看、边听、边互动地了解非遗，而不是先阅读长篇介绍。"
  },
  {
    id: "EI014",
    tier: 3,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "我对非遗的兴趣往往来自它背后的故事，而不是第一眼的视觉冲击。"
  },
  {
    id: "EI015",
    tier: 3,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "如果有人邀请我参与非遗现场互动，我通常不会太排斥。"
  },
  {
    id: "EI016",
    tier: 3,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "我更愿意在旁边观察完整过程，再决定是否参与。"
  },
  {
    id: "EI017",
    tier: 3,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "我认为非遗最吸引人的地方之一，是它能让人聚在一起形成氛围。"
  },
  {
    id: "EI018",
    tier: 3,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "我会对非遗项目的传承谱系、代表人物或历史阶段产生兴趣。"
  },
  {
    id: "EI019",
    tier: 3,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "我喜欢能够马上看见、听见、参与到的非遗内容。"
  },
  {
    id: "EI020",
    tier: 3,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "我更看重非遗项目是否有值得深入理解的文化内涵。"
  },
  {
    id: "EI021",
    tier: 3,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "如果非遗展示很有现场感，我会更愿意停下来观看。"
  },
  {
    id: "EI022",
    tier: 3,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "我喜欢把一个非遗项目拆解成历史、人物、技艺和地域几个部分来理解。"
  },
  {
    id: "EI023",
    tier: 3,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "我会被非遗活动中的人声、掌声、鼓点或热闹场面感染。"
  },
  {
    id: "EI024",
    tier: 3,
    dimension: "EI",
    positive: "I",
    opposite: "E",
    text: "即使一个非遗项目表面不热闹，只要有深厚背景，我也会愿意了解。"
  },
  {
    id: "EI025",
    tier: 3,
    dimension: "EI",
    positive: "E",
    opposite: "I",
    text: "我更喜欢通过现场体验快速建立对非遗的第一印象。"
  },

  // H / C：亲历型 / 共创型
  {
    id: "HC001",
    tier: 1,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "如果有机会，我更想亲手体验非遗制作、表演或操作过程。"
  },
  {
    id: "HC002",
    tier: 1,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "相比亲自体验，我更愿意把非遗内容拍成视频、写成文章或做成设计作品。"
  },
  {
    id: "HC003",
    tier: 1,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "我觉得只有真正上手试过，才更容易理解一项非遗的难度和价值。"
  },
  {
    id: "HC004",
    tier: 1,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "我会自然地思考怎样把一个非遗项目讲给更多人听。"
  },
  {
    id: "HC005",
    tier: 1,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "参加非遗活动时，我更想成为体验者，而不是旁边负责记录的人。"
  },
  {
    id: "HC006",
    tier: 2,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "我更擅长把复杂的文化内容整理成别人容易理解的表达。"
  },
  {
    id: "HC007",
    tier: 2,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "非遗项目中的动作、步骤和手感，会让我产生亲自尝试的冲动。"
  },
  {
    id: "HC008",
    tier: 2,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "我会关注一个非遗项目适合用什么平台、什么形式进行传播。"
  },
  {
    id: "HC009",
    tier: 2,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "如果只能选择一种方式了解非遗，我会优先选择实地体验。"
  },
  {
    id: "HC010",
    tier: 2,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "我更愿意参与非遗推文、短视频、海报或活动策划这类工作。"
  },
  {
    id: "HC011",
    tier: 2,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "我喜欢在实践中学习，而不是只通过整理资料来了解非遗。"
  },
  {
    id: "HC012",
    tier: 2,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "我会在意非遗内容如何被年轻人看见、理解和转发。"
  },
  {
    id: "HC013",
    tier: 3,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "如果非遗项目有体验工坊，我会比只看展板更感兴趣。"
  },
  {
    id: "HC014",
    tier: 3,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "我喜欢把传统文化内容转换成更有趣、更有传播感的形式。"
  },
  {
    id: "HC015",
    tier: 3,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "我愿意花时间学习一项非遗技艺的基础动作或制作步骤。"
  },
  {
    id: "HC016",
    tier: 3,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "我更容易注意到一个非遗项目的标题、封面、镜头或叙事方式是否吸引人。"
  },
  {
    id: "HC017",
    tier: 3,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "比起旁观记录，我更希望自己能真正参与到非遗活动过程里。"
  },
  {
    id: "HC018",
    tier: 3,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "我常常会想，一个传统项目怎样才能被改造成适合当代传播的内容。"
  },
  {
    id: "HC019",
    tier: 3,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "我相信身体参与和亲手实践能帮助人更深地理解文化。"
  },
  {
    id: "HC020",
    tier: 3,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "我更喜欢通过剪辑、排版、写作、拍摄等方式参与非遗保护。"
  },
  {
    id: "HC021",
    tier: 3,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "我愿意在现场向传承人学习一个动作、一种技巧或一道工序。"
  },
  {
    id: "HC022",
    tier: 3,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "看到一个非遗项目时，我会思考它适合做成什么样的传播栏目。"
  },
  {
    id: "HC023",
    tier: 3,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "我更享受直接参与非遗活动时产生的沉浸感。"
  },
  {
    id: "HC024",
    tier: 3,
    dimension: "HC",
    positive: "C",
    opposite: "H",
    text: "我会希望用自己的表达方式，为传统文化增加新的观看入口。"
  },
  {
    id: "HC025",
    tier: 3,
    dimension: "HC",
    positive: "H",
    opposite: "C",
    text: "我认为实地走访和亲身体验比远程观看更能让我产生文化连接。"
  },

  // L / T：生活型 / 传统型
  {
    id: "LT001",
    tier: 1,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "我更容易被饮食、服饰、日用器物这类贴近日常生活的非遗打动。"
  },
  {
    id: "LT002",
    tier: 1,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "带有历史传说、仪式规矩或古法传承的非遗，会让我更想深入了解。"
  },
  {
    id: "LT003",
    tier: 1,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "我喜欢那些能融入日常生活、让人感到亲切的非遗项目。"
  },
  {
    id: "LT004",
    tier: 1,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "我会被有年代感、地方记忆和文化根脉的非遗吸引。"
  },
  {
    id: "LT005",
    tier: 1,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "一项非遗如果和吃穿住行有关，我通常更容易产生兴趣。"
  },
  {
    id: "LT006",
    tier: 2,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "我更看重非遗是否承载了古老的信仰、礼俗或历史记忆。"
  },
  {
    id: "LT007",
    tier: 2,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "我觉得非遗最动人的地方，是它能出现在普通人的日常生活里。"
  },
  {
    id: "LT008",
    tier: 2,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "一个非遗项目越有传统规矩和仪式结构，我越会觉得它值得研究。"
  },
  {
    id: "LT009",
    tier: 2,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "我会更喜欢有烟火气、地方味和生活温度的非遗内容。"
  },
  {
    id: "LT010",
    tier: 2,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "我对古法、祖传、仪式、谱系这类词汇比较敏感。"
  },
  {
    id: "LT011",
    tier: 2,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "如果一个非遗项目能被当代生活继续使用，我会觉得它特别有价值。"
  },
  {
    id: "LT012",
    tier: 2,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "我喜欢从历史和传统秩序中理解一个地方的文化。"
  },
  {
    id: "LT013",
    tier: 2,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "相比宏大的历史叙事，我更喜欢普通人生活里的非遗故事。"
  },
  {
    id: "LT014",
    tier: 3,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "我会对非遗项目中的禁忌、流程和仪式意义感到好奇。"
  },
  {
    id: "LT015",
    tier: 3,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "地方小吃、传统手作和生活习俗，比严肃展览更容易吸引我。"
  },
  {
    id: "LT016",
    tier: 3,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "我觉得非遗的重要性，很大一部分来自它背后的历史厚度。"
  },
  {
    id: "LT017",
    tier: 3,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "我愿意从日常消费、旅行打卡或生活体验中接触非遗。"
  },
  {
    id: "LT018",
    tier: 3,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "如果一个项目和地方传说、家族传承或传统仪式有关，我会更想了解。"
  },
  {
    id: "LT019",
    tier: 3,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "我认为非遗不一定要显得古老庄重，它也可以很生活、很轻松。"
  },
  {
    id: "LT020",
    tier: 3,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "我会被“传了几百年”“祖辈留下来”这样的文化叙事打动。"
  },
  {
    id: "LT021",
    tier: 3,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "我喜欢那些能让人马上联想到家乡、街巷、饭桌或集市的非遗。"
  },
  {
    id: "LT022",
    tier: 3,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "我更愿意花时间理解一个非遗项目在地方历史中的位置。"
  },
  {
    id: "LT023",
    tier: 3,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "我希望非遗能以更亲近日常生活的方式被更多年轻人看见。"
  },
  {
    id: "LT024",
    tier: 3,
    dimension: "LT",
    positive: "T",
    opposite: "L",
    text: "我觉得保留非遗中的传统形式、仪式和规则本身很重要。"
  },
  {
    id: "LT025",
    tier: 3,
    dimension: "LT",
    positive: "L",
    opposite: "T",
    text: "我更愿意从生活场景出发，理解非遗为什么和今天的人有关。"
  },

  // M / P：物艺型 / 表演型
  {
    id: "MP001",
    tier: 1,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "我更喜欢观察一件器物、一门工艺或一种材料是如何被制作出来的。"
  },
  {
    id: "MP002",
    tier: 1,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "比起静态展品，我更容易被音乐、舞蹈、戏剧或节庆表演吸引。"
  },
  {
    id: "MP003",
    tier: 1,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "我会对非遗中的材料、工具、手法和制作步骤产生兴趣。"
  },
  {
    id: "MP004",
    tier: 1,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "鼓点、唱腔、舞步或现场队伍，往往比器物本身更能吸引我的注意。"
  },
  {
    id: "MP005",
    tier: 1,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "如果一个非遗项目能做出看得见、摸得着的作品，我会更有兴趣。"
  },
  {
    id: "MP006",
    tier: 2,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "我更容易记住一个非遗表演的声音、节奏、动作或场面。"
  },
  {
    id: "MP007",
    tier: 2,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "传统医药、饮食制作、手工技艺这类内容会让我觉得很有探索价值。"
  },
  {
    id: "MP008",
    tier: 2,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "我认为表演类非遗最能让人快速感受到文化的生命力。"
  },
  {
    id: "MP009",
    tier: 2,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "我会想知道一项传统技艺为什么要用这种材料、这种工具和这种步骤。"
  },
  {
    id: "MP010",
    tier: 2,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "我喜欢有舞台感、节奏感和情绪感染力的非遗项目。"
  },
  {
    id: "MP011",
    tier: 2,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "相比看一场表演，我更想了解一个传统作品是怎么被做出来的。"
  },
  {
    id: "MP012",
    tier: 2,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "传统音乐、戏曲、曲艺或舞蹈更容易让我产生文化共鸣。"
  },
  {
    id: "MP013",
    tier: 2,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "我会被非遗项目中精细、耐心、重复打磨的制作过程吸引。"
  },
  {
    id: "MP014",
    tier: 3,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "一个非遗项目如果有强烈的现场表演效果，我会更愿意停留观看。"
  },
  {
    id: "MP015",
    tier: 3,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "我喜欢能呈现手艺人经验和技巧的非遗项目。"
  },
  {
    id: "MP016",
    tier: 3,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "我觉得人的声音、身体动作和舞台表达，是非遗最有魅力的部分之一。"
  },
  {
    id: "MP017",
    tier: 3,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "器物、纹样、药材、食材或工具背后的知识，会让我很想继续了解。"
  },
  {
    id: "MP018",
    tier: 3,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "我更容易被节庆队伍、民间舞蹈或戏曲唱段带入情绪。"
  },
  {
    id: "MP019",
    tier: 3,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "我欣赏那些能够通过双手和经验积累传承下来的技艺。"
  },
  {
    id: "MP020",
    tier: 3,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "我会觉得表演类非遗更适合被拍摄、传播和现场体验。"
  },
  {
    id: "MP021",
    tier: 3,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "我更愿意花时间看一个传统作品从原料到成品的完整过程。"
  },
  {
    id: "MP022",
    tier: 3,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "我会被传统表演中的服饰、动作、唱腔和场面调度吸引。"
  },
  {
    id: "MP023",
    tier: 3,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "如果一个非遗项目能体现独特工艺和制作智慧，我会觉得它很值得推荐。"
  },
  {
    id: "MP024",
    tier: 3,
    dimension: "MP",
    positive: "P",
    opposite: "M",
    text: "我认为非遗表演现场的感染力，是图文资料很难完全替代的。"
  },
  {
    id: "MP025",
    tier: 3,
    dimension: "MP",
    positive: "M",
    opposite: "P",
    text: "我对传统手工、医药、饮食、器物类非遗的兴趣通常比表演类更稳定。"
  }
];
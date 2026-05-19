const nationalHeritageSourceName = "中国非物质文化遗产网国家级项目名录公开信息整理";

const categoryBaseVector = {
  "民间文学": {
    E: 25, I: 75,
    H: 30, C: 70,
    L: 40, T: 60,
    M: 30, P: 70
  },
  "传统音乐": {
    E: 65, I: 35,
    H: 45, C: 55,
    L: 45, T: 55,
    M: 10, P: 90
  },
  "传统舞蹈": {
    E: 80, I: 20,
    H: 70, C: 30,
    L: 50, T: 50,
    M: 5, P: 95
  },
  "传统戏剧": {
    E: 65, I: 35,
    H: 45, C: 55,
    L: 30, T: 70,
    M: 10, P: 90
  },
  "曲艺": {
    E: 60, I: 40,
    H: 35, C: 65,
    L: 45, T: 55,
    M: 10, P: 90
  },
  "传统体育、游艺与杂技": {
    E: 85, I: 15,
    H: 80, C: 20,
    L: 60, T: 40,
    M: 30, P: 70
  },
  "传统美术": {
    E: 35, I: 65,
    H: 45, C: 55,
    L: 55, T: 45,
    M: 90, P: 10
  },
  "传统技艺": {
    E: 45, I: 55,
    H: 75, C: 25,
    L: 60, T: 40,
    M: 95, P: 5
  },
  "传统医药": {
    E: 25, I: 75,
    H: 60, C: 40,
    L: 35, T: 65,
    M: 95, P: 5
  },
  "民俗": {
    E: 75, I: 25,
    H: 65, C: 35,
    L: 70, T: 30,
    M: 35, P: 65
  }
};

const keywordAdjustRules = [
  {
    keywords: ["制", "造", "烧", "织", "绣", "雕", "营造", "制作", "工艺", "技艺"],
    adjust: { H: 8, M: 10, P: -6 }
  },
  {
    keywords: ["医", "药", "针灸", "制剂", "炮制", "诊法"],
    adjust: { I: 10, T: 8, M: 12, P: -8 }
  },
  {
    keywords: ["歌", "舞", "戏", "曲", "鼓", "音乐", "唱", "弹"],
    adjust: { E: 8, P: 12, M: -8 }
  },
  {
    keywords: ["节", "会", "庙会", "灯会", "祭典", "春节", "端午", "清明", "中秋"],
    adjust: { E: 10, H: 8, L: 8, P: 6 }
  },
  {
    keywords: ["传说", "史诗", "故事", "古歌", "宝卷"],
    adjust: { I: 10, C: 8, T: 8 }
  },
  {
    keywords: ["拳", "武术", "杂技", "棋", "龙舟", "空竹", "摔跤"],
    adjust: { E: 10, H: 12, P: 8 }
  }
];

const dimensionPairs = [
  ["E", "I"],
  ["H", "C"],
  ["L", "T"],
  ["M", "P"]
];

function clampScore(value) {
  return Math.max(5, Math.min(95, value));
}

function normalizePair(vector, left, right) {
  const total = vector[left] + vector[right];

  if (total <= 0) {
    vector[left] = 50;
    vector[right] = 50;
    return;
  }

  const leftScore = Math.round((vector[left] / total) * 100);
  vector[left] = clampScore(leftScore);
  vector[right] = 100 - vector[left];
}

function normalizeVector(vector) {
  dimensionPairs.forEach(pair => {
    normalizePair(vector, pair[0], pair[1]);
  });

  return vector;
}

function buildProjectVector(category, name, tags = [], manualVector = {}) {
  const base = categoryBaseVector[category] || {
    E: 50, I: 50,
    H: 50, C: 50,
    L: 50, T: 50,
    M: 50, P: 50
  };

  const vector = { ...base };
  const searchText = [name, category, ...tags].join(" ");

  keywordAdjustRules.forEach(rule => {
    const matched = rule.keywords.some(keyword => searchText.includes(keyword));

    if (!matched) return;

    Object.entries(rule.adjust).forEach(([key, value]) => {
      vector[key] = clampScore((vector[key] || 50) + value);
    });
  });

  Object.entries(manualVector).forEach(([key, value]) => {
    vector[key] = clampScore(value);
  });

  return normalizeVector(vector);
}

function getCodeFromVector(vector) {
  return [
    vector.E >= vector.I ? "E" : "I",
    vector.H >= vector.C ? "H" : "C",
    vector.L >= vector.T ? "L" : "T",
    vector.M >= vector.P ? "M" : "P"
  ].join("");
}

function flipCodeChar(code, index) {
  const pairs = [
    { E: "I", I: "E" },
    { H: "C", C: "H" },
    { L: "T", T: "L" },
    { M: "P", P: "M" }
  ];

  const chars = code.split("");
  chars[index] = pairs[index][chars[index]];
  return chars.join("");
}

function getFitCodesFromVector(vector) {
  const primaryCode = getCodeFromVector(vector);
  const closeIndexes = dimensionPairs
    .map((pair, index) => ({
      index,
      diff: Math.abs(vector[pair[0]] - vector[pair[1]])
    }))
    .filter(item => item.diff <= 20)
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 2);

  const codes = [primaryCode];

  closeIndexes.forEach(item => {
    codes.push(flipCodeChar(primaryCode, item.index));
  });

  return [...new Set(codes)];
}

function createNationalHeritageProject(config) {
  const vector = buildProjectVector(
    config.category,
    config.name,
    config.tags || [],
    config.manualVector || {}
  );

  return {
    id: config.id,
    name: config.name,
    level: "国家级",
    category: config.category,
    region: config.region || "中国",
    batch: config.batch || "待核对",
    projectCode: config.projectCode || "待核对",
    protectUnits: config.protectUnits || [],
    vector,
    fitCodes: config.fitCodes || getFitCodesFromVector(vector),
    tags: config.tags || [config.category],
    popularity: config.popularity || 70,
    experienceValue: config.experienceValue || 60,
    intro:
      config.intro ||
      `${config.name}是${config.category}类国家级非物质文化遗产代表性项目，适合作为拾遗人格测评的推荐项目样本。`,
    detailUrl: config.detailUrl || "",
    source: nationalHeritageSourceName
  };
}

const nationalHeritageProjects = [
  // 一、民间文学
  createNationalHeritageProject({
    id: "folk-literature-miaozu-guge",
    name: "苗族古歌",
    category: "民间文学",
    region: "贵州、湖南等地",
    tags: ["民间文学", "古歌", "口头传统", "史诗", "地方记忆"],
    popularity: 76,
    experienceValue: 52
  }),
  createNationalHeritageProject({
    id: "folk-literature-baishezhuan",
    name: "白蛇传传说",
    category: "民间文学",
    region: "江苏、浙江等地",
    tags: ["民间文学", "传说", "爱情故事", "地方记忆"],
    popularity: 95,
    experienceValue: 58
  }),
  createNationalHeritageProject({
    id: "folk-literature-liangzhu",
    name: "梁祝传说",
    category: "民间文学",
    region: "浙江、江苏、山东等地",
    tags: ["民间文学", "传说", "爱情故事", "口头传统"],
    popularity: 94,
    experienceValue: 56
  }),
  createNationalHeritageProject({
    id: "folk-literature-mengjiangnv",
    name: "孟姜女传说",
    category: "民间文学",
    region: "河北、山东、江苏等地",
    tags: ["民间文学", "传说", "历史记忆", "地方故事"],
    popularity: 88,
    experienceValue: 50
  }),
  createNationalHeritageProject({
    id: "folk-literature-gesaer",
    name: "格萨尔",
    category: "民间文学",
    region: "青海、西藏、四川等地",
    tags: ["民间文学", "史诗", "口头传统", "英雄叙事"],
    popularity: 86,
    experienceValue: 54
  }),
  createNationalHeritageProject({
    id: "folk-literature-jiangger",
    name: "江格尔",
    category: "民间文学",
    region: "新疆等地",
    tags: ["民间文学", "史诗", "口头传统", "英雄叙事"],
    popularity: 78,
    experienceValue: 50
  }),
  createNationalHeritageProject({
    id: "folk-literature-manas",
    name: "玛纳斯",
    category: "民间文学",
    region: "新疆等地",
    tags: ["民间文学", "史诗", "口头传统", "英雄叙事"],
    popularity: 80,
    experienceValue: 50
  }),
  createNationalHeritageProject({
    id: "folk-literature-ashima",
    name: "阿诗玛",
    category: "民间文学",
    region: "云南等地",
    tags: ["民间文学", "叙事长诗", "传说", "地方记忆"],
    popularity: 85,
    experienceValue: 55
  }),
  createNationalHeritageProject({
    id: "folk-literature-liusanjie-geyao",
    name: "刘三姐歌谣",
    category: "民间文学",
    region: "广西等地",
    tags: ["民间文学", "歌谣", "地方故事", "民歌"],
    popularity: 88,
    experienceValue: 68
  }),
  createNationalHeritageProject({
    id: "folk-literature-hexi-baojuan",
    name: "河西宝卷",
    category: "民间文学",
    region: "甘肃等地",
    tags: ["民间文学", "宝卷", "讲唱", "地方记忆"],
    popularity: 70,
    experienceValue: 45
  }),

  // 二、传统音乐
  createNationalHeritageProject({
    id: "music-guqin",
    name: "古琴艺术",
    category: "传统音乐",
    region: "中国",
    tags: ["传统音乐", "古琴", "文人文化", "审美", "历史"],
    popularity: 95,
    experienceValue: 65
  }),
  createNationalHeritageProject({
    id: "music-mongolian-long-song",
    name: "蒙古族长调民歌",
    category: "传统音乐",
    region: "内蒙古等地",
    tags: ["传统音乐", "民歌", "草原文化", "演唱"],
    popularity: 88,
    experienceValue: 70
  }),
  createNationalHeritageProject({
    id: "music-dong-dage",
    name: "侗族大歌",
    category: "传统音乐",
    region: "贵州、广西等地",
    tags: ["传统音乐", "合唱", "民歌", "村寨文化"],
    popularity: 88,
    experienceValue: 72
  }),
  createNationalHeritageProject({
    id: "music-xian-guyue",
    name: "西安鼓乐",
    category: "传统音乐",
    region: "陕西西安",
    tags: ["传统音乐", "鼓乐", "仪式", "历史"],
    popularity: 82,
    experienceValue: 68
  }),
  createNationalHeritageProject({
    id: "music-nanyin",
    name: "南音",
    category: "传统音乐",
    region: "福建泉州等地",
    tags: ["传统音乐", "南音", "古乐", "地方音乐"],
    popularity: 83,
    experienceValue: 66
  }),
  createNationalHeritageProject({
    id: "music-huaer",
    name: "花儿",
    category: "传统音乐",
    region: "甘肃、青海、宁夏等地",
    tags: ["传统音乐", "民歌", "山歌", "生活"],
    popularity: 80,
    experienceValue: 70
  }),
  createNationalHeritageProject({
    id: "music-xintianyou",
    name: "信天游",
    category: "传统音乐",
    region: "陕西、山西等地",
    tags: ["传统音乐", "民歌", "陕北", "生活"],
    popularity: 86,
    experienceValue: 70
  }),
  createNationalHeritageProject({
    id: "music-muqam",
    name: "新疆维吾尔木卡姆艺术",
    category: "传统音乐",
    region: "新疆等地",
    tags: ["传统音乐", "木卡姆", "歌舞", "史诗"],
    popularity: 90,
    experienceValue: 78
  }),
  createNationalHeritageProject({
    id: "music-humai",
    name: "呼麦",
    category: "传统音乐",
    region: "内蒙古等地",
    tags: ["传统音乐", "呼麦", "演唱", "草原文化"],
    popularity: 84,
    experienceValue: 75
  }),
  createNationalHeritageProject({
    id: "music-jiangnan-sizhu",
    name: "江南丝竹",
    category: "传统音乐",
    region: "江苏、上海等地",
    tags: ["传统音乐", "丝竹", "江南", "器乐"],
    popularity: 78,
    experienceValue: 62
  }),

  // 三、传统舞蹈
  createNationalHeritageProject({
    id: "dance-yangge",
    name: "秧歌",
    category: "传统舞蹈",
    region: "中国多地",
    tags: ["传统舞蹈", "民间舞蹈", "节庆", "生活"],
    popularity: 88,
    experienceValue: 86
  }),
  createNationalHeritageProject({
    id: "dance-longwu",
    name: "龙舞",
    category: "传统舞蹈",
    region: "中国多地",
    tags: ["传统舞蹈", "龙舞", "节庆", "民俗"],
    popularity: 95,
    experienceValue: 92
  }),
  createNationalHeritageProject({
    id: "dance-shiwu",
    name: "狮舞",
    category: "传统舞蹈",
    region: "中国多地",
    tags: ["传统舞蹈", "狮舞", "节庆", "民俗"],
    popularity: 94,
    experienceValue: 90
  }),
  createNationalHeritageProject({
    id: "dance-ansai-yaogu",
    name: "安塞腰鼓",
    category: "传统舞蹈",
    region: "陕西安塞",
    tags: ["传统舞蹈", "腰鼓", "鼓", "现场"],
    popularity: 92,
    experienceValue: 88
  }),
  createNationalHeritageProject({
    id: "dance-daizu-kongque",
    name: "傣族孔雀舞",
    category: "传统舞蹈",
    region: "云南等地",
    tags: ["传统舞蹈", "孔雀舞", "民族舞蹈", "表演"],
    popularity: 90,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "dance-guozhuang",
    name: "锅庄舞",
    category: "传统舞蹈",
    region: "藏族地区",
    tags: ["传统舞蹈", "锅庄", "民间舞蹈", "集体舞"],
    popularity: 82,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "dance-chaoxian-nongle",
    name: "朝鲜族农乐舞",
    category: "传统舞蹈",
    region: "吉林等地",
    tags: ["传统舞蹈", "农乐舞", "鼓乐", "民俗"],
    popularity: 80,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "dance-huaguzi",
    name: "花鼓灯",
    category: "传统舞蹈",
    region: "安徽等地",
    tags: ["传统舞蹈", "花鼓灯", "民间舞蹈", "节庆"],
    popularity: 78,
    experienceValue: 80
  }),
  createNationalHeritageProject({
    id: "dance-miaozu-lusheng",
    name: "苗族芦笙舞",
    category: "传统舞蹈",
    region: "贵州等地",
    tags: ["传统舞蹈", "芦笙", "民间舞蹈", "节庆"],
    popularity: 80,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "dance-tujia-baishou",
    name: "土家族摆手舞",
    category: "传统舞蹈",
    region: "湖南、湖北等地",
    tags: ["传统舞蹈", "摆手舞", "民俗", "集体舞"],
    popularity: 78,
    experienceValue: 80
  }),

  // 四、传统戏剧
  createNationalHeritageProject({
    id: "opera-kunqu",
    name: "昆曲",
    category: "传统戏剧",
    region: "江苏、浙江、上海等地",
    tags: ["传统戏剧", "昆曲", "戏曲", "传统审美"],
    popularity: 96,
    experienceValue: 72
  }),
  createNationalHeritageProject({
    id: "opera-jingju",
    name: "京剧",
    category: "传统戏剧",
    region: "北京等地",
    tags: ["传统戏剧", "京剧", "戏曲", "国粹"],
    popularity: 98,
    experienceValue: 78
  }),
  createNationalHeritageProject({
    id: "opera-yueju",
    name: "越剧",
    category: "传统戏剧",
    region: "浙江、上海等地",
    tags: ["传统戏剧", "越剧", "戏曲", "表演"],
    popularity: 88,
    experienceValue: 70
  }),
  createNationalHeritageProject({
    id: "opera-huangmei",
    name: "黄梅戏",
    category: "传统戏剧",
    region: "安徽等地",
    tags: ["传统戏剧", "黄梅戏", "戏曲", "生活"],
    popularity: 90,
    experienceValue: 72
  }),
  createNationalHeritageProject({
    id: "opera-yuju",
    name: "豫剧",
    category: "传统戏剧",
    region: "河南等地",
    tags: ["传统戏剧", "豫剧", "戏曲", "地方戏"],
    popularity: 89,
    experienceValue: 72
  }),
  createNationalHeritageProject({
    id: "opera-yueju-guangdong",
    name: "粤剧",
    category: "传统戏剧",
    region: "广东、香港、澳门等地",
    tags: ["传统戏剧", "粤剧", "戏曲", "岭南文化"],
    popularity: 92,
    experienceValue: 75
  }),
  createNationalHeritageProject({
    id: "opera-qinqiang",
    name: "秦腔",
    category: "传统戏剧",
    region: "陕西等地",
    tags: ["传统戏剧", "秦腔", "戏曲", "西北"],
    popularity: 85,
    experienceValue: 70
  }),
  createNationalHeritageProject({
    id: "opera-chuanju",
    name: "川剧",
    category: "传统戏剧",
    region: "四川、重庆等地",
    tags: ["传统戏剧", "川剧", "变脸", "戏曲"],
    popularity: 92,
    experienceValue: 80
  }),
  createNationalHeritageProject({
    id: "opera-zangxi",
    name: "藏戏",
    category: "传统戏剧",
    region: "西藏等地",
    tags: ["传统戏剧", "藏戏", "仪式", "面具"],
    popularity: 84,
    experienceValue: 76
  }),
  createNationalHeritageProject({
    id: "opera-liyuanxi",
    name: "梨园戏",
    category: "传统戏剧",
    region: "福建泉州等地",
    tags: ["传统戏剧", "梨园戏", "古老剧种", "地方戏"],
    popularity: 74,
    experienceValue: 65
  }),

  // 五、曲艺
  createNationalHeritageProject({
    id: "quyi-suzhou-pingtan",
    name: "苏州评弹",
    category: "曲艺",
    region: "江苏苏州等地",
    tags: ["曲艺", "评弹", "说唱", "江南"],
    popularity: 86,
    experienceValue: 68
  }),
  createNationalHeritageProject({
    id: "quyi-xiangsheng",
    name: "相声",
    category: "曲艺",
    region: "北京、天津等地",
    tags: ["曲艺", "相声", "说唱", "幽默"],
    popularity: 98,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "quyi-shandong-kuaishu",
    name: "山东快书",
    category: "曲艺",
    region: "山东等地",
    tags: ["曲艺", "快书", "说唱", "节奏"],
    popularity: 78,
    experienceValue: 68
  }),
  createNationalHeritageProject({
    id: "quyi-jingyun-dagu",
    name: "京韵大鼓",
    category: "曲艺",
    region: "北京、天津等地",
    tags: ["曲艺", "大鼓", "唱曲", "传统音乐"],
    popularity: 78,
    experienceValue: 65
  }),
  createNationalHeritageProject({
    id: "quyi-henan-zhui",
    name: "河南坠子",
    category: "曲艺",
    region: "河南等地",
    tags: ["曲艺", "河南坠子", "说唱", "地方曲艺"],
    popularity: 76,
    experienceValue: 64
  }),
  createNationalHeritageProject({
    id: "quyi-shaanbei-shuoshu",
    name: "陕北说书",
    category: "曲艺",
    region: "陕西等地",
    tags: ["曲艺", "说书", "陕北", "民间叙事"],
    popularity: 75,
    experienceValue: 62
  }),
  createNationalHeritageProject({
    id: "quyi-yangzhou-pinghua",
    name: "扬州评话",
    category: "曲艺",
    region: "江苏扬州等地",
    tags: ["曲艺", "评话", "说书", "地方叙事"],
    popularity: 74,
    experienceValue: 60
  }),
  createNationalHeritageProject({
    id: "quyi-sichuan-qingyin",
    name: "四川清音",
    category: "曲艺",
    region: "四川等地",
    tags: ["曲艺", "清音", "唱曲", "地方曲艺"],
    popularity: 73,
    experienceValue: 62
  }),
  createNationalHeritageProject({
    id: "quyi-errenzhuan",
    name: "二人转",
    category: "曲艺",
    region: "东北地区",
    tags: ["曲艺", "二人转", "说唱", "表演"],
    popularity: 88,
    experienceValue: 78
  }),
  createNationalHeritageProject({
    id: "quyi-tianjin-shidiao",
    name: "天津时调",
    category: "曲艺",
    region: "天津",
    tags: ["曲艺", "天津时调", "唱曲", "地方曲艺"],
    popularity: 72,
    experienceValue: 58
  }),

  // 六、传统体育、游艺与杂技
  createNationalHeritageProject({
    id: "sport-shaolin-kungfu",
    name: "少林功夫",
    category: "传统体育、游艺与杂技",
    region: "河南登封等地",
    tags: ["传统体育", "武术", "功夫", "身体技艺"],
    popularity: 98,
    experienceValue: 88
  }),
  createNationalHeritageProject({
    id: "sport-taijiquan",
    name: "太极拳",
    category: "传统体育、游艺与杂技",
    region: "河南、河北等地",
    tags: ["传统体育", "太极拳", "武术", "养生"],
    popularity: 98,
    experienceValue: 90
  }),
  createNationalHeritageProject({
    id: "sport-cangzhou-wushu",
    name: "沧州武术",
    category: "传统体育、游艺与杂技",
    region: "河北沧州",
    tags: ["传统体育", "武术", "地方武术", "身体技艺"],
    popularity: 82,
    experienceValue: 78
  }),
  createNationalHeritageProject({
    id: "sport-wuqiao-zaji",
    name: "吴桥杂技",
    category: "传统体育、游艺与杂技",
    region: "河北吴桥",
    tags: ["杂技", "表演", "身体技艺", "民间艺术"],
    popularity: 88,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "sport-weiqi",
    name: "围棋",
    category: "传统体育、游艺与杂技",
    region: "中国",
    tags: ["传统游艺", "围棋", "棋类", "智慧"],
    popularity: 94,
    experienceValue: 72
  }),
  createNationalHeritageProject({
    id: "sport-xiangqi",
    name: "象棋",
    category: "传统体育、游艺与杂技",
    region: "中国",
    tags: ["传统游艺", "象棋", "棋类", "生活"],
    popularity: 95,
    experienceValue: 76
  }),
  createNationalHeritageProject({
    id: "sport-zhusuan",
    name: "珠算",
    category: "传统体育、游艺与杂技",
    region: "中国",
    tags: ["传统游艺", "珠算", "计算", "智慧"],
    popularity: 86,
    experienceValue: 62,
    manualVector: { I: 80, C: 65, T: 60, M: 70 }
  }),
  createNationalHeritageProject({
    id: "sport-cuju",
    name: "蹴鞠",
    category: "传统体育、游艺与杂技",
    region: "山东等地",
    tags: ["传统体育", "蹴鞠", "身体体验", "历史"],
    popularity: 84,
    experienceValue: 78
  }),
  createNationalHeritageProject({
    id: "sport-dou-kongzhu",
    name: "抖空竹",
    category: "传统体育、游艺与杂技",
    region: "北京等地",
    tags: ["传统游艺", "空竹", "身体技艺", "生活"],
    popularity: 82,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "sport-saimalongzhou",
    name: "赛龙舟",
    category: "传统体育、游艺与杂技",
    region: "中国多地",
    tags: ["传统体育", "龙舟", "端午", "节庆", "民俗"],
    popularity: 96,
    experienceValue: 90
  }),

  // 七、传统美术
  createNationalHeritageProject({
    id: "art-jianzhi",
    name: "剪纸",
    category: "传统美术",
    region: "中国多地",
    tags: ["传统美术", "剪纸", "手工", "生活美学"],
    popularity: 96,
    experienceValue: 86
  }),
  createNationalHeritageProject({
    id: "art-mubannianhua",
    name: "木版年画",
    category: "传统美术",
    region: "天津、江苏、山东等地",
    tags: ["传统美术", "年画", "木版", "春节"],
    popularity: 88,
    experienceValue: 78
  }),
  createNationalHeritageProject({
    id: "art-suxiu",
    name: "苏绣",
    category: "传统美术",
    region: "江苏苏州",
    tags: ["传统美术", "刺绣", "苏绣", "手工"],
    popularity: 90,
    experienceValue: 80
  }),
  createNationalHeritageProject({
    id: "art-shuxiu",
    name: "蜀绣",
    category: "传统美术",
    region: "四川成都等地",
    tags: ["传统美术", "刺绣", "蜀绣", "手工"],
    popularity: 84,
    experienceValue: 78
  }),
  createNationalHeritageProject({
    id: "art-xiangxiu",
    name: "湘绣",
    category: "传统美术",
    region: "湖南长沙等地",
    tags: ["传统美术", "刺绣", "湘绣", "手工"],
    popularity: 84,
    experienceValue: 78
  }),
  createNationalHeritageProject({
    id: "art-nisu",
    name: "泥塑",
    category: "传统美术",
    region: "中国多地",
    tags: ["传统美术", "泥塑", "手工", "造型"],
    popularity: 82,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "art-mianren",
    name: "面人",
    category: "传统美术",
    region: "北京、山东等地",
    tags: ["传统美术", "面人", "手工", "生活"],
    popularity: 80,
    experienceValue: 84
  }),
  createNationalHeritageProject({
    id: "art-tangka",
    name: "唐卡",
    category: "传统美术",
    region: "西藏、青海等地",
    tags: ["传统美术", "唐卡", "宗教艺术", "传统"],
    popularity: 88,
    experienceValue: 68
  }),
  createNationalHeritageProject({
    id: "art-neihua",
    name: "内画",
    category: "传统美术",
    region: "河北、北京等地",
    tags: ["传统美术", "内画", "手工", "细节"],
    popularity: 78,
    experienceValue: 76
  }),
  createNationalHeritageProject({
    id: "art-huizhou-sandiao",
    name: "徽州三雕",
    category: "传统美术",
    region: "安徽徽州",
    tags: ["传统美术", "木雕", "砖雕", "石雕", "传统建筑"],
    popularity: 82,
    experienceValue: 74
  }),

  // 八、传统技艺
  createNationalHeritageProject({
    id: "craft-wood-structure",
    name: "中国传统木结构营造技艺",
    category: "传统技艺",
    region: "中国",
    tags: ["传统技艺", "营造", "木结构", "建筑", "工艺"],
    popularity: 90,
    experienceValue: 72
  }),
  createNationalHeritageProject({
    id: "craft-jingdezhen-porcelain",
    name: "景德镇手工制瓷技艺",
    category: "传统技艺",
    region: "江西景德镇",
    tags: ["传统技艺", "制瓷", "烧制", "陶瓷", "工艺"],
    popularity: 94,
    experienceValue: 84
  }),
  createNationalHeritageProject({
    id: "craft-longquan-celadon",
    name: "龙泉青瓷烧制技艺",
    category: "传统技艺",
    region: "浙江龙泉",
    tags: ["传统技艺", "青瓷", "烧制", "陶瓷", "工艺"],
    popularity: 90,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "craft-xuanzhi",
    name: "宣纸传统制作技艺",
    category: "传统技艺",
    region: "安徽泾县",
    tags: ["传统技艺", "宣纸", "制作", "文房", "工艺"],
    popularity: 92,
    experienceValue: 80
  }),
  createNationalHeritageProject({
    id: "craft-sericulture-silk",
    name: "中国传统桑蚕丝织技艺",
    category: "传统技艺",
    region: "浙江、江苏、四川等地",
    tags: ["传统技艺", "丝织", "桑蚕", "织造", "工艺"],
    popularity: 88,
    experienceValue: 80
  }),
  createNationalHeritageProject({
    id: "craft-nanjing-yunjin",
    name: "南京云锦木机妆花手工织造技艺",
    category: "传统技艺",
    region: "江苏南京",
    tags: ["传统技艺", "云锦", "织造", "手工", "工艺"],
    popularity: 90,
    experienceValue: 78
  }),
  createNationalHeritageProject({
    id: "craft-diaoban-yinshua",
    name: "雕版印刷技艺",
    category: "传统技艺",
    region: "江苏扬州等地",
    tags: ["传统技艺", "雕版", "印刷", "木版", "工艺"],
    popularity: 86,
    experienceValue: 76
  }),
  createNationalHeritageProject({
    id: "craft-green-tea",
    name: "绿茶制作技艺",
    category: "传统技艺",
    region: "浙江、安徽等地",
    tags: ["传统技艺", "制茶", "茶", "制作", "生活"],
    popularity: 92,
    experienceValue: 86
  }),
  createNationalHeritageProject({
    id: "craft-maotai-liquor",
    name: "茅台酒酿制技艺",
    category: "传统技艺",
    region: "贵州仁怀",
    tags: ["传统技艺", "酿制", "酒", "制作", "工艺"],
    popularity: 96,
    experienceValue: 70
  }),
  createNationalHeritageProject({
    id: "craft-duanyan",
    name: "端砚制作技艺",
    category: "传统技艺",
    region: "广东肇庆",
    tags: ["传统技艺", "端砚", "制作", "文房", "雕刻"],
    popularity: 84,
    experienceValue: 75
  }),

  // 九、传统医药
  createNationalHeritageProject({
    id: "medicine-zhongyi-zhenfa",
    name: "中医诊法",
    category: "传统医药",
    region: "中国",
    tags: ["传统医药", "中医", "诊法", "传统知识"],
    popularity: 94,
    experienceValue: 72
  }),
  createNationalHeritageProject({
    id: "medicine-zhongyao-paozhi",
    name: "中药炮制技术",
    category: "传统医药",
    region: "中国",
    tags: ["传统医药", "中药", "炮制", "药", "制作"],
    popularity: 90,
    experienceValue: 78
  }),
  createNationalHeritageProject({
    id: "medicine-zhongyi-zhiji",
    name: "中医传统制剂方法",
    category: "传统医药",
    region: "中国",
    tags: ["传统医药", "中医", "制剂", "药", "古法"],
    popularity: 88,
    experienceValue: 80
  }),
  createNationalHeritageProject({
    id: "medicine-zhenjiu",
    name: "针灸",
    category: "传统医药",
    region: "中国",
    tags: ["传统医药", "针灸", "中医", "身体经验"],
    popularity: 98,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "medicine-zangyiyao",
    name: "藏医药",
    category: "传统医药",
    region: "西藏、青海、四川等地",
    tags: ["传统医药", "藏医药", "传统知识", "草本"],
    popularity: 84,
    experienceValue: 70
  }),
  createNationalHeritageProject({
    id: "medicine-mengyiyao",
    name: "蒙医药",
    category: "传统医药",
    region: "内蒙古等地",
    tags: ["传统医药", "蒙医药", "传统知识", "草本"],
    popularity: 80,
    experienceValue: 68
  }),
  createNationalHeritageProject({
    id: "medicine-weiwuer-yiyao",
    name: "维吾尔医药",
    category: "传统医药",
    region: "新疆等地",
    tags: ["传统医药", "维吾尔医药", "传统知识", "草本"],
    popularity: 78,
    experienceValue: 68
  }),
  createNationalHeritageProject({
    id: "medicine-yaozu-yiyao",
    name: "瑶族医药",
    category: "传统医药",
    region: "广西、湖南等地",
    tags: ["传统医药", "瑶族医药", "草本", "地方知识"],
    popularity: 76,
    experienceValue: 70
  }),
  createNationalHeritageProject({
    id: "medicine-miaoyi",
    name: "苗医药",
    category: "传统医药",
    region: "贵州、湖南等地",
    tags: ["传统医药", "苗医药", "草本", "地方知识"],
    popularity: 78,
    experienceValue: 72
  }),
  createNationalHeritageProject({
    id: "medicine-shezu-yiyao",
    name: "畲族医药",
    category: "传统医药",
    region: "福建、浙江等地",
    tags: ["传统医药", "畲族医药", "草本", "地方知识"],
    popularity: 72,
    experienceValue: 66
  }),

  // 十、民俗
  createNationalHeritageProject({
    id: "custom-spring-festival",
    name: "春节",
    category: "民俗",
    region: "中国",
    tags: ["民俗", "春节", "节日", "生活", "年俗"],
    popularity: 100,
    experienceValue: 96
  }),
  createNationalHeritageProject({
    id: "custom-qingming",
    name: "清明节",
    category: "民俗",
    region: "中国",
    tags: ["民俗", "清明", "节日", "祭扫", "传统"],
    popularity: 98,
    experienceValue: 90
  }),
  createNationalHeritageProject({
    id: "custom-duanwu",
    name: "端午节",
    category: "民俗",
    region: "中国",
    tags: ["民俗", "端午", "节日", "龙舟", "生活"],
    popularity: 99,
    experienceValue: 96
  }),
  createNationalHeritageProject({
    id: "custom-qixi",
    name: "七夕节",
    category: "民俗",
    region: "中国",
    tags: ["民俗", "七夕", "节日", "传说", "生活"],
    popularity: 90,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "custom-mid-autumn",
    name: "中秋节",
    category: "民俗",
    region: "中国",
    tags: ["民俗", "中秋", "节日", "团圆", "生活"],
    popularity: 100,
    experienceValue: 96
  }),
  createNationalHeritageProject({
    id: "custom-chongyang",
    name: "重阳节",
    category: "民俗",
    region: "中国",
    tags: ["民俗", "重阳", "节日", "敬老", "传统"],
    popularity: 88,
    experienceValue: 80
  }),
  createNationalHeritageProject({
    id: "custom-24-solar-terms",
    name: "二十四节气",
    category: "民俗",
    region: "中国",
    tags: ["民俗", "二十四节气", "农时", "生活", "传统知识"],
    popularity: 96,
    experienceValue: 86
  }),
  createNationalHeritageProject({
    id: "custom-mazu",
    name: "妈祖祭典",
    category: "民俗",
    region: "福建莆田等地",
    tags: ["民俗", "妈祖", "祭典", "信俗", "仪式"],
    popularity: 88,
    experienceValue: 82
  }),
  createNationalHeritageProject({
    id: "custom-nadam",
    name: "那达慕",
    category: "民俗",
    region: "内蒙古等地",
    tags: ["民俗", "那达慕", "节庆", "体育", "草原文化"],
    popularity: 88,
    experienceValue: 90
  }),
  createNationalHeritageProject({
    id: "custom-huoba",
    name: "火把节",
    category: "民俗",
    region: "云南、四川等地",
    tags: ["民俗", "火把节", "节庆", "仪式", "表演"],
    popularity: 88,
    experienceValue: 90
  })
];

const nationalHeritageRecommendConfig = {
  maxRecommendCount: 3,
  weights: {
    codeMatch: 0.3,
    vectorSimilarity: 0.4,
    tagMatch: 0.15,
    popularity: 0.1,
    diversity: 0.05
  },
  diversity: {
    maxSameCategory: 2,
    preferDifferentRegion: true
  }
};
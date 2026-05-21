function getOppositeLetter(letter) {
  const oppositeMap = {
    E: "I",
    I: "E",
    H: "C",
    C: "H",
    L: "T",
    T: "L",
    M: "P",
    P: "M"
  };

  return oppositeMap[letter];
}

function getDimensionPairs() {
  return [
    ["E", "I"],
    ["H", "C"],
    ["L", "T"],
    ["M", "P"]
  ];
}

function normalizeUserScores(scores) {
  const normalized = { ...scores };

  getDimensionPairs().forEach(([left, right]) => {
    const leftValue = Number(normalized[left]);
    const rightValue = Number(normalized[right]);

    if (!Number.isFinite(leftValue) && Number.isFinite(rightValue)) {
      normalized[left] = 100 - rightValue;
    }

    if (Number.isFinite(leftValue) && !Number.isFinite(rightValue)) {
      normalized[right] = 100 - leftValue;
    }

    if (!Number.isFinite(normalized[left]) && !Number.isFinite(normalized[right])) {
      normalized[left] = 50;
      normalized[right] = 50;
    }
  });

  return normalized;
}

function getCodeFromScores(scores) {
  const normalized = normalizeUserScores(scores);

  return [
    normalized.E >= normalized.I ? "E" : "I",
    normalized.H >= normalized.C ? "H" : "C",
    normalized.L >= normalized.T ? "L" : "T",
    normalized.M >= normalized.P ? "M" : "P"
  ].join("");
}

function countSameCodeLetters(codeA, codeB) {
  let count = 0;

  for (let i = 0; i < 4; i++) {
    if (codeA[i] === codeB[i]) {
      count++;
    }
  }

  return count;
}

function getCodeMatchScore(userCode, projectFitCodes) {
  if (!projectFitCodes || projectFitCodes.length === 0) {
    return 50;
  }

  if (projectFitCodes.includes(userCode)) {
    return 100;
  }

  const bestMatchCount = Math.max(
    ...projectFitCodes.map(code => countSameCodeLetters(userCode, code))
  );

  const matchScoreMap = {
    4: 100,
    3: 82,
    2: 64,
    1: 46,
    0: 30
  };

  return matchScoreMap[bestMatchCount] || 50;
}

function getVectorSimilarityScore(userScores, projectVector) {
  const normalized = normalizeUserScores(userScores);

  const pairScores = getDimensionPairs().map(([left]) => {
    const userValue = normalized[left];
    const projectValue = projectVector[left];

    if (!Number.isFinite(projectValue)) {
      return 50;
    }

    return 100 - Math.abs(userValue - projectValue);
  });

  const total = pairScores.reduce((sum, score) => sum + score, 0);

  return Math.round(total / pairScores.length);
}

function getStrongLetters(scores) {
  const normalized = normalizeUserScores(scores);

  return getDimensionPairs().map(([left, right]) => {
    return normalized[left] >= normalized[right] ? left : right;
  });
}

function getInferredInterestTags(userResult) {
  const scores = normalizeUserScores(userResult.scores || {});
  const code = userResult.code || getCodeFromScores(scores);
  const letters = code.split("");

  const tagMap = {
    E: ["现场", "互动", "节庆", "热闹", "表演", "体验"],
    I: ["历史", "研究", "知识", "文献", "故事", "传统"],
    H: ["亲历", "体验", "制作", "实地", "身体", "工坊"],
    C: ["传播", "影像", "文创", "写作", "策划", "记录"],
    L: ["生活", "民俗", "饮食", "地方", "日常", "烟火"],
    T: ["传统", "历史", "仪式", "古法", "礼俗", "传承"],
    M: ["工艺", "手工", "医药", "器物", "材料", "制作"],
    P: ["表演", "音乐", "舞蹈", "戏剧", "曲艺", "节庆"]
  };

  const tags = [];

  letters.forEach(letter => {
    tags.push(...(tagMap[letter] || []));
  });

  if (scores.E >= 70) tags.push("现场", "互动");
  if (scores.I >= 70) tags.push("研究", "历史");
  if (scores.H >= 70) tags.push("体验", "制作");
  if (scores.C >= 70) tags.push("传播", "影像");
  if (scores.L >= 70) tags.push("生活", "民俗");
  if (scores.T >= 70) tags.push("仪式", "传统");
  if (scores.M >= 70) tags.push("工艺", "手工");
  if (scores.P >= 70) tags.push("表演", "音乐");

  return [...new Set(tags)];
}

function getTagMatchScore(userResult, project) {
  const userTags = userResult.interestTags || getInferredInterestTags(userResult);
  const projectTags = [
    project.category,
    ...(project.tags || [])
  ];

  if (userTags.length === 0 || projectTags.length === 0) {
    return 50;
  }

  let matchCount = 0;

  userTags.forEach(userTag => {
    const matched = projectTags.some(projectTag => {
      return projectTag.includes(userTag) || userTag.includes(projectTag);
    });

    if (matched) {
      matchCount++;
    }
  });

  const score = Math.round((matchCount / Math.min(userTags.length, 8)) * 100);

  return Math.max(30, Math.min(100, score));
}

function getPopularityScore(project) {
  return Math.max(30, Math.min(100, project.popularity || 70));
}

function getRecommendationScore(userResult, project) {
  const config = nationalHeritageRecommendConfig || {
    weights: {
      codeMatch: 0.3,
      vectorSimilarity: 0.4,
      tagMatch: 0.15,
      popularity: 0.1,
      diversity: 0.05
    }
  };

  const userScores = normalizeUserScores(userResult.scores || {});
  const userCode = userResult.code || getCodeFromScores(userScores);

  const codeMatch = getCodeMatchScore(userCode, project.fitCodes);
  const vectorSimilarity = getVectorSimilarityScore(userScores, project.vector);
  const tagMatch = getTagMatchScore({ ...userResult, code: userCode, scores: userScores }, project);
  const popularity = getPopularityScore(project);

  const totalScore =
    codeMatch * config.weights.codeMatch +
    vectorSimilarity * config.weights.vectorSimilarity +
    tagMatch * config.weights.tagMatch +
    popularity * config.weights.popularity;

  return {
    totalScore: Math.round(totalScore),
    scoreBreakdown: {
      codeMatch,
      vectorSimilarity,
      tagMatch,
      popularity
    }
  };
}

function getTopCategoryCount(selectedProjects, category) {
  return selectedProjects.filter(item => item.project.category === category).length;
}

function isRegionSimilar(regionA, regionB) {
  if (!regionA || !regionB) return false;
  return regionA === regionB || regionA.includes(regionB) || regionB.includes(regionA);
}

function selectDiversifiedProjects(scoredProjects, count = 3) {
  const selected = [];
  const config = nationalHeritageRecommendConfig || {};
  const maxSameCategory = config.diversity?.maxSameCategory || 2;

  for (const item of scoredProjects) {
    if (selected.length >= count) break;

    const sameCategoryCount = getTopCategoryCount(selected, item.project.category);

    if (sameCategoryCount >= maxSameCategory) {
      continue;
    }

    selected.push(item);
  }

  if (selected.length < count) {
    for (const item of scoredProjects) {
      if (selected.length >= count) break;

      const alreadySelected = selected.some(selectedItem => selectedItem.project.id === item.project.id);

      if (!alreadySelected) {
        selected.push(item);
      }
    }
  }

  return selected;
}

function getRecommendationRole(index) {
  const roles = [
    {
      title: "核心匹配项目",
      desc: "与你的拾遗人格代码和主要指标最契合。"
    },
    {
      title: "延展探索项目",
      desc: "与你的次强倾向相呼应，适合进一步拓展兴趣边界。"
    },
    {
      title: "惊喜契合项目",
      desc: "与你的潜在兴趣相关，可能带来意想不到的非遗体验。"
    }
  ];

  return roles[index] || {
    title: "推荐项目",
    desc: "与你的测评结果具有一定匹配度。"
  };
}

function getDominantDimensionText(userScores) {
  const normalized = normalizeUserScores(userScores);

  const dimensionNames = {
    E: "外显互动",
    I: "内省研究",
    H: "亲历体验",
    C: "内容共创",
    L: "生活烟火",
    T: "历史传统",
    M: "物艺技法",
    P: "表演现场"
  };

  const strongLetters = getStrongLetters(normalized);

  return strongLetters.map(letter => dimensionNames[letter]).join("、");
}

function buildRecommendationReason(userResult, project, role) {
  const scores = normalizeUserScores(userResult.scores || {});
  const dimensionText = getDominantDimensionText(scores);

  return `你的测评结果呈现出“${dimensionText}”等倾向，${project.name}在“${project.category}”方向上与你的兴趣画像较为契合。${role.desc}`;
}

function getScoredNationalHeritageProjects(userResult) {
  const scores = normalizeUserScores(userResult.scores || {});
  const code = userResult.code || getCodeFromScores(scores);

  return nationalHeritageProjects
    .map(project => {
      const recommendationScore = getRecommendationScore(
        {
          ...userResult,
          code,
          scores
        },
        project
      );

      return {
        project,
        totalScore: recommendationScore.totalScore,
        scoreBreakdown: recommendationScore.scoreBreakdown
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}

function formatRecommendationItems(items, userResult) {
  const scores = normalizeUserScores(userResult.scores || {});
  const code = userResult.code || getCodeFromScores(scores);

  return items.map((item, index) => {
    const role = getRecommendationRole(index % 3);

    return {
      rank: (index % 3) + 1,
      role: role.title,
      reason: buildRecommendationReason(
        {
          ...userResult,
          code,
          scores
        },
        item.project,
        role
      ),
      project: item.project,
      totalScore: item.totalScore,
      scoreBreakdown: item.scoreBreakdown
    };
  });
}

function getNationalHeritageRecommendationPool(userResult, options = {}) {
  const poolSize = options.poolSize || 30;
  const scoredProjects = getScoredNationalHeritageProjects(userResult);

  return formatRecommendationItems(
    scoredProjects.slice(0, poolSize),
    userResult
  );
}

function getNationalHeritageRecommendations(userResult, options = {}) {
  const count = options.count || nationalHeritageRecommendConfig?.maxRecommendCount || 3;
  const scoredProjects = getScoredNationalHeritageProjects(userResult);
  const selectedProjects = selectDiversifiedProjects(scoredProjects, count);

  return formatRecommendationItems(selectedProjects, userResult);
}

function getRecommendationDebugResult() {
  const demoUserResult = {
    code: "IHTM",
    scores: {
      E: 28,
      I: 72,
      H: 66,
      C: 34,
      L: 42,
      T: 58,
      M: 91,
      P: 9
    }
  };

  return getNationalHeritageRecommendations(demoUserResult);
}

window.shiyiRecommender = {
  getCodeFromScores,
  getNationalHeritageRecommendations,
  getNationalHeritageRecommendationPool,
  getRecommendationDebugResult,
  getVectorSimilarityScore,
  getTagMatchScore
};
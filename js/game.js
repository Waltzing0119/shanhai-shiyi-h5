const startScreen = document.getElementById("startScreen");
const questionScreen = document.getElementById("questionScreen");
const resultScreen = document.getElementById("resultScreen");

const modeName = document.getElementById("modeName");
const questionProgress = document.getElementById("questionProgress");
const progressBar = document.getElementById("progressBar");
const questionTitle = document.getElementById("questionTitle");
const optionsBox = document.getElementById("options");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const resultContent = document.getElementById("resultContent");

let currentMode = "standard";
let currentQuestions = [];
let currentIndex = 0;
let answers = [];

const testDimensionPairs = [
  ["E", "I"],
  ["H", "C"],
  ["L", "T"],
  ["M", "P"]
];

const dimensionMeta = {
  EI: {
    left: "E",
    right: "I",
    leftName: "外显型",
    rightName: "内省型"
  },
  HC: {
    left: "H",
    right: "C",
    leftName: "亲历型",
    rightName: "共创型"
  },
  LT: {
    left: "L",
    right: "T",
    leftName: "生活型",
    rightName: "传统型"
  },
  MP: {
    left: "M",
    right: "P",
    leftName: "物艺型",
    rightName: "表演型"
  }
};

function startTest(mode) {
  currentMode = mode;

  trackShiyiEvent("start_fybi_test", {
    test_mode: mode
  });

  const config = shiyiModeConfig[mode];

  currentQuestions = shiyiQuestionBank.filter(question => question.tier <= config.tier);
  currentIndex = 0;
  answers = new Array(currentQuestions.length).fill(null);

  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  questionScreen.classList.remove("hidden");

  renderQuestion();
}

function renderQuestion() {
  const config = shiyiModeConfig[currentMode];
  const question = currentQuestions[currentIndex];
  const selectedValue = answers[currentIndex];

  modeName.innerText = config.name;
  questionProgress.innerText = `${currentIndex + 1} / ${currentQuestions.length}`;
  progressBar.style.width = `${((currentIndex + 1) / currentQuestions.length) * 100}%`;

  questionTitle.innerText = question.text;
  optionsBox.innerHTML = "";

  shiyiScaleOptions.forEach(option => {
    const button = document.createElement("button");
    button.className = "scale-option";
    button.type = "button";
    button.innerText = option.label;

    if (selectedValue === option.value) {
      button.classList.add("selected");
    }

    button.onclick = () => {
      answers[currentIndex] = option.value;
      renderQuestion();
    };

    optionsBox.appendChild(button);
  });

  prevBtn.style.visibility = currentIndex === 0 ? "hidden" : "visible";
  nextBtn.innerText = currentIndex === currentQuestions.length - 1 ? "生成报告" : "下一题";

  if (answers[currentIndex] === null) {
    nextBtn.classList.add("disabled");
  } else {
    nextBtn.classList.remove("disabled");
  }
}

function goToNextQuestion() {
  if (answers[currentIndex] === null) {
    alert("请先选择一个符合程度。");
    return;
  }

  if (currentIndex >= currentQuestions.length - 1) {
    showResult();
    return;
  }

  currentIndex++;
  renderQuestion();
}

function goToPreviousQuestion() {
  if (currentIndex === 0) return;

  currentIndex--;
  renderQuestion();
}

function getInitialScores() {
  return {
    E: 0,
    I: 0,
    H: 0,
    C: 0,
    L: 0,
    T: 0,
    M: 0,
    P: 0
  };
}

function calculateRawScores() {
  const scores = getInitialScores();

  currentQuestions.forEach((question, index) => {
    const answerValue = answers[index];

    if (answerValue === null) return;

    if (answerValue > 0) {
      scores[question.positive] += Math.abs(answerValue);
    } else {
      scores[question.opposite] += Math.abs(answerValue);
    }
  });

  return scores;
}

function calculatePercentScores(rawScores) {
  const percentScores = {};

  testDimensionPairs.forEach(pair => {
    const left = pair[0];
    const right = pair[1];

    const leftScore = rawScores[left] || 0;
    const rightScore = rawScores[right] || 0;
    const total = leftScore + rightScore;

    if (total === 0) {
      percentScores[left] = 50;
      percentScores[right] = 50;
      return;
    }

    percentScores[left] = Math.round((leftScore / total) * 100);
    percentScores[right] = 100 - percentScores[left];
  });

  return percentScores;
}

function getResultCode(percentScores) {
  return [
    percentScores.E >= percentScores.I ? "E" : "I",
    percentScores.H >= percentScores.C ? "H" : "C",
    percentScores.L >= percentScores.T ? "L" : "T",
    percentScores.M >= percentScores.P ? "M" : "P"
  ].join("");
}

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hour}:${minute}`;
}

function getProfileImageHtml(profile) {
  return `
    <div class="profile-image-wrap">
      <img
        class="profile-image"
        src="${profile.image}"
        alt="${profile.name}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="profile-image-fallback">
        <span>${profile.code}</span>
        <p>人格形象待生成</p>
      </div>
    </div>
  `;
}

function renderScaleRow({ left, right, leftName, rightName, scores }) {
  const leftPercent = scores[left];
  const rightPercent = scores[right];

  return `
    <div class="scale-row">
      <div class="scale-label left">
        <strong>${left}</strong>
        <span>${leftName}</span>
        <em>${leftPercent}%</em>
      </div>

      <div class="scale-bar-wrap">
        <div class="scale-bar-left" style="width: ${leftPercent}%"></div>
        <div class="scale-bar-divider"></div>
      </div>

      <div class="scale-label right">
        <strong>${right}</strong>
        <span>${rightName}</span>
        <em>${rightPercent}%</em>
      </div>
    </div>
  `;
}

function renderScaleReport(scores) {
  return `
    <section class="result-section">
      <h3>类型数据量表</h3>
      <div class="scale-report">
        ${renderScaleRow({ ...dimensionMeta.EI, scores })}
        ${renderScaleRow({ ...dimensionMeta.HC, scores })}
        ${renderScaleRow({ ...dimensionMeta.LT, scores })}
        ${renderScaleRow({ ...dimensionMeta.MP, scores })}
      </div>
    </section>
  `;
}

function renderRecommendationCards(recommendations) {
  if (!recommendations || recommendations.length === 0) {
    return `
      <section class="result-section">
        <h3>推荐非遗项目</h3>
        <div class="empty-item">
          <p>暂未生成推荐项目，请稍后再试。</p>
        </div>
      </section>
    `;
  }

  const cards = recommendations.map(item => {
    const project = item.project;
    const link = project.detailUrl || "#";

    return `
      <a class="recommend-card" href="${link}">
        <div class="recommend-rank">${item.rank}</div>
        <div>
          <p class="recommend-role">${item.role}</p>
          <h4>${project.name}</h4>
          <p class="recommend-meta">${project.level} · ${project.category}</p>
          <p>${project.intro}</p>
          <p class="recommend-reason">${item.reason}</p>
          <p class="recommend-more">${project.detailUrl ? "点击查看详情 →" : "详情页待接入"}</p>
        </div>
      </a>
    `;
  }).join("");

  return `
    <section class="result-section">
      <button class="recommend-toggle" type="button" id="recommendToggle">
        推荐非遗项目（三项）<span>点击展开 / 收起</span>
      </button>

      <div class="recommend-list hidden" id="recommendList">
        ${cards}
      </div>
    </section>
  `;
}

function renderAnalysisReport(profile) {
  return `
    <section class="result-section analysis-report">
      <h3>文字分析报告</h3>

      <h4>人格概述</h4>
      <p>${profile.report}</p>

      <h4>核心关键词</h4>
      <p>${profile.keywords.join(" / ")}</p>

      <h4>适合的非遗方向</h4>
      <p>${profile.recommendedDirections}</p>

      <h4>适合的参与方式</h4>
      <p>${profile.participation}</p>
    </section>
  `;
}

function showResult() {
  const rawScores = calculateRawScores();
  const percentScores = calculatePercentScores(rawScores);
  const resultCode = getResultCode(percentScores);
  const profile = shiyiProfiles[resultCode];
  const generatedTime = formatDateTime(new Date());

  trackShiyiEvent("complete_fybi_test", {
    test_mode: currentMode,
    result_code: resultCode,
    result_name: profile.name
  });

  const recommendations = window.shiyiRecommender
    ? window.shiyiRecommender.getNationalHeritageRecommendations({
        code: resultCode,
        scores: percentScores
      })
    : [];

  questionScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  resultContent.innerHTML = `
    <div class="result-header-card">
      <p class="test-kicker">拾遗人格测评报告</p>
      <p class="generated-time">生成时间：${generatedTime}</p>

      <div class="result-main">
        <div>
          <p class="result-code-label">你的拾遗人格代码</p>
          <h2>${resultCode}</h2>
          <h3>${profile.name}</h3>
        </div>

        ${getProfileImageHtml(profile)}
      </div>
    </div>

    ${renderScaleReport(percentScores)}
    ${renderRecommendationCards(recommendations)}
    ${renderAnalysisReport(profile)}

    <div class="result-actions">
      <button class="btn primary red" type="button" id="restartBtn">重新测评</button>
      <a class="btn secondary dark" href="index.html">返回首页</a>
    </div>
  `;

  const recommendToggle = document.getElementById("recommendToggle");
  const recommendList = document.getElementById("recommendList");

  if (recommendToggle && recommendList) {
    recommendToggle.onclick = () => {
      recommendList.classList.toggle("hidden");
    };
  }

  document.getElementById("restartBtn").onclick = () => {
    resultScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  };

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

let selectedMode = "standard";

const selectedModeText = document.getElementById("selectedModeText");
const startSelectedModeBtn = document.getElementById("startSelectedMode");

function updateSelectedMode(mode) {
  selectedMode = mode;

  document.querySelectorAll(".mode-card").forEach(button => {
    if (button.dataset.mode === mode) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  });

  const config = shiyiModeConfig[mode];

  if (selectedModeText && config) {
    selectedModeText.innerText = `已选择：${config.name}｜${config.desc}`;
  }
}

document.querySelectorAll(".mode-card").forEach(button => {
  button.onclick = () => {
    const mode = button.dataset.mode;
    const config = shiyiModeConfig[mode];

    trackShiyiEvent("click_fybi_mode", {
      test_mode: mode,
      mode_name: config ? config.name : mode,
      entry_position: "fybi_mode_card"
    });

    updateSelectedMode(mode);
  };
});

if (startSelectedModeBtn) {
  startSelectedModeBtn.onclick = () => {
    startTest(selectedMode);
  };
}

updateSelectedMode(selectedMode);

nextBtn.onclick = goToNextQuestion;
prevBtn.onclick = goToPreviousQuestion;
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
const autoNextToggle = document.getElementById("autoNextToggle");

let currentMode = "standard";
let currentQuestions = [];
let currentIndex = 0;
let answers = [];
let autoNextTimer = null;
let currentRecommendationPool = [];
let currentRecommendationBatchIndex = 0;
const recommendationBatchSize = 3;

const LOTTERY_POPUP_KEY = "fybi_lottery_popup_20260521_dont_show";
const LOTTERY_GROUP_QR_CODE_SRC = "images/fybi-lottery-group-qrcode.jpg";

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

function clearAutoNextTimer() {
  if (autoNextTimer) {
    clearTimeout(autoNextTimer);
    autoNextTimer = null;
  }
}

function getLotteryPopup() {
  let modal = document.getElementById("fybiLotteryModal");

  if (modal) {
    return modal;
  }

  modal = document.createElement("div");
  modal.id = "fybiLotteryModal";
  modal.className = "fybi-lottery-modal hidden";
  modal.innerHTML = `
    <div class="fybi-lottery-mask" data-lottery-close></div>
    <div class="fybi-lottery-card" role="dialog" aria-modal="true" aria-labelledby="fybiLotteryTitle">
      <button class="fybi-lottery-close" type="button" data-lottery-close aria-label="\u5173\u95ed">&times;</button>

      <p class="fybi-lottery-kicker">\u5c71\u6d77\u62fe\u9057 \u00b7 \u975e\u9057FYBI\u516c\u6d4b</p>
      <h2 id="fybiLotteryTitle">\u516c\u6d4b\u798f\u5229\u6765\u5566\uff01</h2>

      <p class="fybi-lottery-main-text">
        \u606d\u559c\u4f60\u5b8c\u6210\u975e\u9057 FYBI \u6d4b\u8bc4\uff01<br>
        \u73b0\u5728\u626b\u7801\u8fdb\u5165\u516c\u6d4b\u62bd\u5956\u7fa4\uff0c\u5373\u53ef\u53c2\u4e0e\u7b2c\u4e00\u8f6e\u5976\u8336\u62bd\u5956\u3002
      </p>

      <p class="fybi-lottery-note">
        \u62bd\u4e2d\u540e\u51ed\u4f60\u7684 FYBI \u62a5\u544a/\u8bc1\u4e66\u622a\u56fe\u6838\u9a8c\u8d44\u683c\u3002<br>
        \u8f6c\u53d1\u5e73\u53f0\u5ba3\u4f20\u5185\u5bb9\uff0c\u8fd8\u53ef\u53c2\u4e0e\u7b2c\u4e8c\u8f6e\u62bd\u5956\u3002<br>
        \u4eca\u665a 23:30 \u5f00\u5956\uff01
      </p>

      <div class="fybi-lottery-qrcode-wrap">
        <img
          src="${LOTTERY_GROUP_QR_CODE_SRC}"
          alt="\u516c\u6d4b\u62bd\u5956\u7fa4\u4e8c\u7ef4\u7801"
          class="fybi-lottery-qrcode"
        >
        <div class="fybi-lottery-qr-placeholder">
          <span>\u8bf7\u5c06\u7fa4\u4e8c\u7ef4\u7801\u653e\u5230</span>
          <strong>images/fybi-lottery-group-qrcode.jpg</strong>
        </div>
      </div>

      <div class="fybi-lottery-tip">\u957f\u6309\u8bc6\u522b\u4e8c\u7ef4\u7801\u8fdb\u7fa4\u62bd\u5956</div>

      <label class="fybi-lottery-checkbox">
        <input type="checkbox" id="fybiLotteryDontShowAgain">
        <span>本次活动不再弹出提醒</span>
      </label>

      <div class="fybi-lottery-actions">
        <button class="fybi-lottery-primary" type="button" data-lottery-join>\u7acb\u5373\u8fdb\u7fa4\u62bd\u5956</button>
        <button class="fybi-lottery-secondary" type="button" data-lottery-export>\u4fdd\u5b58\u62a5\u544a/\u8bc1\u4e66</button>
        <button class="fybi-lottery-ghost" type="button" data-lottery-close>\u7a0d\u540e\u518d\u8bf4</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const qrCodeImage = modal.querySelector(".fybi-lottery-qrcode");
  if (qrCodeImage) {
    qrCodeImage.onerror = () => {
      qrCodeImage.classList.add("missing");
    };
  }

  modal.querySelectorAll("[data-lottery-close]").forEach(element => {
    element.addEventListener("click", closeLotteryPopup);
  });

  const joinButton = modal.querySelector("[data-lottery-join]");
  if (joinButton) {
    joinButton.addEventListener("click", clickJoinLotteryGroup);
  }

  const exportButton = modal.querySelector("[data-lottery-export]");
  if (exportButton) {
    exportButton.addEventListener("click", exportFybiReportFromLotteryPopup);
  }

  return modal;
}

function showLotteryPopup() {
  const modal = getLotteryPopup();
  modal.classList.remove("hidden");
  document.body.classList.add("fybi-lottery-open");

  trackShiyiEvent("fybi_lottery_popup_show", {
    event_category: "fybi",
    event_label: "report_page"
  });
}

function closeLotteryPopup() {
  const modal = document.getElementById("fybiLotteryModal");

  if (modal) {
    const dontShowCheckbox = modal.querySelector("#fybiLotteryDontShowAgain");

    try {
      if (dontShowCheckbox && dontShowCheckbox.checked) {
        localStorage.setItem(LOTTERY_POPUP_KEY, "true");
      } else {
        localStorage.removeItem(LOTTERY_POPUP_KEY);
      }
    } catch (error) {
      console.warn(error);
    }

    modal.classList.add("hidden");
  }

  document.body.classList.remove("fybi-lottery-open");

  trackShiyiEvent("fybi_lottery_popup_close", {
    event_category: "fybi",
    event_label: "report_page"
  });
}

function clickJoinLotteryGroup() {
  trackShiyiEvent("fybi_lottery_group_click", {
    event_category: "fybi",
    event_label: "report_popup"
  });

  const modal = getLotteryPopup();
  const qrWrap = modal.querySelector(".fybi-lottery-qrcode-wrap");
  const card = modal.querySelector(".fybi-lottery-card");

  if (qrWrap) {
    qrWrap.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  if (card) {
    card.classList.add("fybi-lottery-card-highlight");
    setTimeout(() => {
      card.classList.remove("fybi-lottery-card-highlight");
    }, 900);
  }
}

function exportFybiReportFromLotteryPopup() {
  trackShiyiEvent("fybi_lottery_export_click", {
    event_category: "fybi",
    event_label: "report_popup"
  });

  exportFybiReportAsImage(window.currentFybiReport);
}

function tryShowLotteryPopupAfterReportGenerated() {
  try {
    const dontShow = localStorage.getItem(LOTTERY_POPUP_KEY);

    if (dontShow === "true") {
      return;
    }

    showLotteryPopup();
  } catch (error) {
    showLotteryPopup();
  }
}

function selectAnswer(value) {
  clearAutoNextTimer();

  answers[currentIndex] = value;
  renderQuestion();

  if (autoNextToggle && autoNextToggle.checked) {
    autoNextTimer = setTimeout(() => {
      autoNextTimer = null;
      goToNextQuestion();
    }, 220);
  }
}

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
      selectAnswer(option.value);
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
  clearAutoNextTimer();

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
  clearAutoNextTimer();

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

function getFybiModeCode(mode) {
  const modeCodeMap = {
    quick: "Q20",
    standard: "S50",
    deep: "D100"
  };

  return modeCodeMap[mode] || "S50";
}

function getFybiTimeCode(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}`;
}

function getFybiRandomCode(length = 4) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

function createFybiCertificateNo(mode) {
  const modeCode = getFybiModeCode(mode);
  const timeCode = getFybiTimeCode();
  const randomCode = getFybiRandomCode(4);

  return `FYBI-${modeCode}-${timeCode}-${randomCode}`;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = String(text || "").split("");
  let line = "";

  chars.forEach(char => {
    const testLine = line + char;
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = char;
    } else {
      line = testLine;
    }
  });

  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }

  return y;
}

function drawTagPills(ctx, tags, startX, startTopY, maxWidth) {
  let x = startX;
  let y = startTopY;
  const tagHeight = 34;
  const gap = 10;

  ctx.font = "20px Microsoft YaHei, PingFang SC, Arial";

  tags.forEach(tag => {
    const text = String(tag);
    const tagWidth = ctx.measureText(text).width + 30;

    if (x + tagWidth > startX + maxWidth) {
      x = startX;
      y += tagHeight + gap;
    }

    ctx.fillStyle = "#fff0dd";
    drawRoundedRect(ctx, x, y, tagWidth, tagHeight, 17);
    ctx.fill();

    ctx.strokeStyle = "#ead9c0";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#8b2e1f";
    ctx.fillText(text, x + 15, y + 24);

    x += tagWidth + gap;
  });

  return y + tagHeight;
}

function loadCanvasImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`图片加载失败：${src}`));

    image.crossOrigin = "anonymous";
    image.src = src;
  });
}

function drawImageContain(ctx, image, x, y, width, height) {
  const imageRatio = image.width / image.height;
  const boxRatio = width / height;

  let drawWidth = width;
  let drawHeight = height;
  let drawX = x;
  let drawY = y;

  if (imageRatio > boxRatio) {
    drawHeight = width / imageRatio;
    drawY = y + (height - drawHeight) / 2;
  } else {
    drawWidth = height * imageRatio;
    drawX = x + (width - drawWidth) / 2;
  }

  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function drawCertificateAvatar(ctx, avatarImage, resultCode, x, y, width, height) {
  ctx.fillStyle = "#fff6e9";
  drawRoundedRect(ctx, x, y, width, height, 26);
  ctx.fill();

  ctx.strokeStyle = "#f0dfc6";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (avatarImage) {
    drawImageContain(ctx, avatarImage, x + 12, y + 10, width - 24, height - 20);
    return;
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#8b2e1f";
  ctx.font = "bold 34px Microsoft YaHei, PingFang SC, Arial";
  ctx.fillText(resultCode, x + width / 2, y + height / 2 + 10);
  ctx.textAlign = "left";
}

function drawTagPillsFromTop(ctx, tags, startX, startTopY, maxWidth) {
  let x = startX;
  let y = startTopY;
  const tagHeight = 34;
  const gap = 10;

  ctx.font = "20px Microsoft YaHei, PingFang SC, Arial";

  tags.forEach(tag => {
    const text = String(tag);
    const tagWidth = ctx.measureText(text).width + 30;

    if (x + tagWidth > startX + maxWidth) {
      x = startX;
      y += tagHeight + gap;
    }

    ctx.fillStyle = "#fff0dd";
    drawRoundedRect(ctx, x, y, tagWidth, tagHeight, 17);
    ctx.fill();

    ctx.strokeStyle = "#ead9c0";
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = "#8b2e1f";
    ctx.fillText(text, x + 15, y + 24);

    x += tagWidth + gap;
  });

  return y + tagHeight;
}

async function exportFybiReportAsImage(report) {
  if (!report) {
    alert("报告数据暂未生成，请完成测评后再导出。");
    return;
  }

  const canvas = document.createElement("canvas");
  const width = 1200;
  const height = 1850;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  let avatarImage = null;

  try {
    avatarImage = await loadCanvasImage(getFybiAvatarSrc(report.resultCode));
  } catch (error) {
    console.warn(error);
  }

  const panelX = 110;
  const panelY = 135;
  const panelWidth = 980;
  const panelHeight = 1625;
  const panelBottom = panelY + panelHeight;

  const cardX = 150;
  const cardWidth = 900;
  const cardInnerX = 195;
  const cardInnerWidth = 810;

  ctx.fillStyle = "#f8f4ed";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#8b2e1f";
  ctx.lineWidth = 8;
  ctx.strokeRect(44, 44, width - 88, height - 88);

  ctx.strokeStyle = "#d8b98c";
  ctx.lineWidth = 2;
  ctx.strokeRect(74, 74, width - 148, height - 148);

  ctx.fillStyle = "#fffaf2";
  drawRoundedRect(ctx, panelX, panelY, panelWidth, panelHeight, 36);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = "#8b2e1f";
  ctx.font = "bold 50px Microsoft YaHei, PingFang SC, Arial";
  ctx.fillText("山海拾遗 · 非遗FYBI测评报告证书", width / 2, 230);

  ctx.fillStyle = "#7a6a5a";
  ctx.font = "24px Microsoft YaHei, PingFang SC, Arial";
  ctx.fillText(`报告编号：${report.certificateNo}`, width / 2, 285);
  ctx.fillText(`生成时间：${report.generatedTime}`, width / 2, 325);

  ctx.fillStyle = "#2f2a25";
  ctx.font = "bold 42px Microsoft YaHei, PingFang SC, Arial";
  ctx.fillText(`你的拾遗人格代码：${report.resultCode}`, width / 2, 425);

  ctx.fillStyle = "#8b2e1f";
  ctx.font = "bold 42px Microsoft YaHei, PingFang SC, Arial";
  ctx.fillText(report.profile.name, width / 2, 485);

  ctx.textAlign = "left";

  let cursorY = 555;

  // 人格标签
  const tagCardY = cursorY;
  const tagCardHeight = 170;

  ctx.fillStyle = "#fff6e9";
  drawRoundedRect(ctx, cardX, tagCardY, cardWidth, tagCardHeight, 28);
  ctx.fill();

  ctx.fillStyle = "#8b2e1f";
  ctx.font = "bold 30px Microsoft YaHei, PingFang SC, Arial";
  ctx.fillText("人格标签", cardInnerX, tagCardY + 60);

  const avatarBoxSize = 120;
  const avatarBoxX = cardX + cardWidth - avatarBoxSize - 42;
  const avatarBoxY = tagCardY + 25;

  drawCertificateAvatar(
    ctx,
    avatarImage,
    report.resultCode,
    avatarBoxX,
    avatarBoxY,
    avatarBoxSize,
    avatarBoxSize
  );

  drawTagPills(
    ctx,
    report.profile.keywords || [],
    cardInnerX,
    tagCardY + 88,
    cardInnerWidth - avatarBoxSize - 70
  );

  cursorY = tagCardY + tagCardHeight + 52;

  // 类型数据量表
  const scaleCardY = cursorY;
  const scaleCardHeight = 405;

  ctx.fillStyle = "#fff6e9";
  drawRoundedRect(ctx, cardX, scaleCardY, cardWidth, scaleCardHeight, 28);
  ctx.fill();

  ctx.fillStyle = "#8b2e1f";
  ctx.font = "bold 30px Microsoft YaHei, PingFang SC, Arial";
  ctx.fillText("类型数据量表", cardInnerX, scaleCardY + 60);

  const dimensionRows = [
    { left: "E", leftName: "外显型", right: "I", rightName: "内省型" },
    { left: "H", leftName: "亲历型", right: "C", rightName: "共创型" },
    { left: "L", leftName: "生活型", right: "T", rightName: "传统型" },
    { left: "M", leftName: "物艺型", right: "P", rightName: "表演型" }
  ];

  let rowY = scaleCardY + 115;

  dimensionRows.forEach(row => {
    const leftPercent = report.scores[row.left];
    const rightPercent = report.scores[row.right];

    ctx.fillStyle = "#2f2a25";
    ctx.font = "22px Microsoft YaHei, PingFang SC, Arial";
    ctx.fillText(`${row.left} ${row.leftName} ${leftPercent}%`, cardInnerX, rowY);

    ctx.textAlign = "right";
    ctx.fillText(`${rightPercent}% ${row.rightName} ${row.right}`, cardInnerX + cardInnerWidth, rowY);
    ctx.textAlign = "left";

    ctx.fillStyle = "#ead9c0";
    drawRoundedRect(ctx, cardInnerX, rowY + 26, cardInnerWidth, 24, 12);
    ctx.fill();

    ctx.fillStyle = "#8b2e1f";
    drawRoundedRect(ctx, cardInnerX, rowY + 26, cardInnerWidth * (leftPercent / 100), 24, 12);
    ctx.fill();

    rowY += 78;
  });

  cursorY = scaleCardY + scaleCardHeight + 52;

  // 推荐项目
  const recommendCardY = cursorY;
  const recommendCardHeight = 365;

  ctx.fillStyle = "#fff6e9";
  drawRoundedRect(ctx, cardX, recommendCardY, cardWidth, recommendCardHeight, 28);
  ctx.fill();

  ctx.fillStyle = "#8b2e1f";
  ctx.font = "bold 30px Microsoft YaHei, PingFang SC, Arial";
  ctx.fillText("推荐非遗项目", cardInnerX, recommendCardY + 60);

  const recommendations = report.recommendations || [];

  if (recommendations.length === 0) {
    ctx.fillStyle = "#2f2a25";
    ctx.font = "24px Microsoft YaHei, PingFang SC, Arial";
    ctx.fillText("推荐项目暂未生成", cardInnerX, recommendCardY + 125);
  } else {
    recommendations.slice(0, 3).forEach((item, index) => {
      const project = item.project;
      const itemTop = recommendCardY + 105 + index * 86;
      const circleTop = itemTop + 2;
      const titleY = itemTop + 30;
      const tagTopY = itemTop + 43;

      ctx.fillStyle = index === 0 ? "#8b2e1f" : "#c98b4f";
      drawRoundedRect(ctx, cardInnerX, circleTop, 48, 48, 24);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px Microsoft YaHei, PingFang SC, Arial";
      ctx.textAlign = "center";
      ctx.fillText(String(index + 1), cardInnerX + 24, circleTop + 32);
      ctx.textAlign = "left";

      ctx.fillStyle = "#2f2a25";
      ctx.font = "bold 25px Microsoft YaHei, PingFang SC, Arial";
      ctx.fillText(project.name, cardInnerX + 75, titleY);

      const projectTags = [
        project.level || "国家级",
        project.category || "非遗项目",
        item.role || "推荐项目"
      ];

      drawTagPills(ctx, projectTags, cardInnerX + 75, tagTopY, 700);
    });
  }

  // 底部说明固定在白色背景框内部
  ctx.fillStyle = "#7a6a5a";
  ctx.font = "20px Microsoft YaHei, PingFang SC, Arial";
  drawWrappedText(
    ctx,
    "本报告由“山海拾遗”非遗数字平台自动生成，仅用于非遗兴趣探索与文化传播参考。",
    170,
    panelBottom - 105,
    860,
    30
  );

  ctx.textAlign = "center";
  ctx.fillStyle = "#8b2e1f";
  ctx.font = "bold 24px Microsoft YaHei, PingFang SC, Arial";
  ctx.fillText("广东海洋大学“山海拾遗”百千万工程实践团", width / 2, panelBottom - 35);

  try {
    const link = document.createElement("a");
    link.download = `山海拾遗-FYBI测评报告证书-${report.certificateNo}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    trackShiyiEvent("export_fybi_report", {
      certificate_no: report.certificateNo,
      result_code: report.resultCode,
      result_name: report.profile.name
    });
  } catch (error) {
    console.error(error);
    alert("证书导出失败。请使用线上链接或本地服务器预览，不要直接双击 HTML 文件打开。");
  }
}

const fybiAvatarMap = {
  EHLM: "images/fybi-avatars/base/FYBI_EHLM_v1.png",
  EHLP: "images/fybi-avatars/base/FYBI_EHLP_v1.png",
  EHTM: "images/fybi-avatars/base/FYBI_EHTM_v1.png",
  EHTP: "images/fybi-avatars/base/FYBI_EHTP_v1.png",

  ECLM: "images/fybi-avatars/base/FYBI_ECLM_v1.png",
  ECLP: "images/fybi-avatars/base/FYBI_ECLP_v1.png",
  ECTM: "images/fybi-avatars/base/FYBI_ECTM_v1.png",
  ECTP: "images/fybi-avatars/base/FYBI_ECTP_v1.png",

  IHLM: "images/fybi-avatars/base/FYBI_IHLM_v1.png",
  IHLP: "images/fybi-avatars/base/FYBI_IHLP_v1.png",
  IHTM: "images/fybi-avatars/base/FYBI_IHTM_v1.png",
  IHTP: "images/fybi-avatars/base/FYBI_IHTP_v1.png",

  ICLM: "images/fybi-avatars/base/FYBI_ICLM_v1.png",
  ICLP: "images/fybi-avatars/base/FYBI_ICLP_v1.png",
  ICTM: "images/fybi-avatars/base/FYBI_ICTM_v1.png",
  ICTP: "images/fybi-avatars/base/FYBI_ICTP_v1.png"
};

function getFybiAvatarSrc(resultCode) {
  return fybiAvatarMap[resultCode] || fybiAvatarMap.EHLP;
}

function getProfileImageHtml(profile, resultCode) {
  const avatarSrc = getFybiAvatarSrc(resultCode || profile.code);

  return `
    <div class="profile-image-wrap">
      <img
        class="profile-image"
        src="${avatarSrc}"
        alt="${profile.name}"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="profile-image-fallback">
        <span>${resultCode || profile.code}</span>
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

function getNationalHeritageDatabaseCount() {
  if (typeof nationalHeritageProjects !== "undefined" && Array.isArray(nationalHeritageProjects)) {
    return nationalHeritageProjects.length;
  }

  return 2301;
}

function renderRecommendationCardItem(item, index) {
  const project = item.project;

  const cardContent = `
    <div class="recommend-rank">${index + 1}</div>
    <div>
      <p class="recommend-role">${item.role}</p>
      <h4>${project.name}</h4>
      <p class="recommend-meta">${project.level} · ${project.category}</p>
      <p>${project.intro}</p>
      <p class="recommend-reason">${item.reason}</p>
      <p class="recommend-more">${project.detailUrl ? "点击查看详情 →" : "详情页待接入"}</p>
    </div>
  `;

  if (project.detailUrl) {
    return `
      <a class="recommend-card" href="${project.detailUrl}">
        ${cardContent}
      </a>
    `;
  }

  return `
    <article class="recommend-card recommend-card-disabled">
      ${cardContent}
    </article>
  `;
}

function renderRecommendationCardsHtml(recommendations) {
  return recommendations
    .map((item, index) => renderRecommendationCardItem(item, index))
    .join("");
}

function getCurrentRecommendationBatch() {
  if (!currentRecommendationPool || currentRecommendationPool.length === 0) {
    return [];
  }

  const start = currentRecommendationBatchIndex * recommendationBatchSize;
  const batch = currentRecommendationPool.slice(start, start + recommendationBatchSize);

  if (batch.length < recommendationBatchSize && currentRecommendationPool.length >= recommendationBatchSize) {
    return batch.concat(
      currentRecommendationPool.slice(0, recommendationBatchSize - batch.length)
    );
  }

  return batch;
}

function updateRecommendationBatch() {
  const currentBatch = getCurrentRecommendationBatch();
  const recommendCardsBox = document.getElementById("recommendCardsBox");

  if (recommendCardsBox) {
    recommendCardsBox.innerHTML = renderRecommendationCardsHtml(currentBatch);
  }

  if (window.currentFybiReport) {
    window.currentFybiReport.recommendations = currentBatch;
  }

  const analysisReportSection = document.getElementById("analysisReportSection");

  if (analysisReportSection && window.currentFybiReport) {
    analysisReportSection.outerHTML = renderAnalysisReport({
      profile: window.currentFybiReport.profile,
      scores: window.currentFybiReport.scores,
      resultCode: window.currentFybiReport.resultCode,
      recommendations: currentBatch
    });
  }
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

  const databaseCount = getNationalHeritageDatabaseCount();

  return `
    <section class="result-section">
      <button class="recommend-toggle" type="button" id="recommendToggle">
        推荐非遗项目<span>点击展开 / 收起</span>
      </button>

      <div class="recommend-list hidden" id="recommendList">
        <p class="recommend-database-note">
          系统已接入 <strong>${databaseCount}</strong> 条国家级非遗数据，并根据你的拾遗人格代码、四组维度比例和项目画像生成推荐。
        </p>

        <div id="recommendCardsBox">
          ${renderRecommendationCardsHtml(recommendations)}
        </div>

        <button class="recommend-refresh-btn" type="button" id="refreshRecommendBtn">
          换一批推荐项目
        </button>
      </div>
    </section>
  `;
}

const analysisDimensionMeta = [
  {
    left: "E",
    right: "I",
    leftName: "外显互动",
    rightName: "内省研究",
    leftDesc: "你更容易被现场氛围、互动体验、节庆热闹和即时反馈带动，适合从“看见、听见、参与到”的方式进入非遗。",
    rightDesc: "你更愿意先理解历史背景、传承脉络、人物故事和文化含义，适合从资料、访谈和深度观察中认识非遗。"
  },
  {
    left: "H",
    right: "C",
    leftName: "亲历体验",
    rightName: "内容共创",
    leftDesc: "你更重视亲手体验、实地参与、身体感知和过程感，越是能上手、能参与的项目，越容易让你产生真实连接。",
    rightDesc: "你更擅长把非遗内容转化成文字、影像、设计、策划或传播作品，会自然思考怎样让更多人理解和看见它。"
  },
  {
    left: "L",
    right: "T",
    leftName: "生活烟火",
    rightName: "历史传统",
    leftDesc: "你更容易被饮食、日常器物、地方风味、集市街巷和生活记忆吸引，会觉得非遗不只在展柜里，也在普通人的生活里。",
    rightDesc: "你更看重仪式、古法、谱系、历史厚度和传统秩序，会被“为什么这样传下来”以及背后的文化根脉吸引。"
  },
  {
    left: "M",
    right: "P",
    leftName: "物艺技法",
    rightName: "表演现场",
    leftDesc: "你更关注材料、工具、器物、药材、食材、制作步骤和手艺人的经验，适合探索看得见、摸得着、做得出来的非遗。",
    rightDesc: "你更容易被音乐、舞蹈、戏剧、曲艺、节庆队伍和现场表演感染，适合从声音、动作和氛围中感受非遗生命力。"
  }
];

function getTendencyLabel(diff) {
  if (diff <= 8) {
    return "接近平衡";
  }

  if (diff <= 20) {
    return "比较倾向";
  }

  return "明显倾向";
}

function getDimensionAnalysisItem(meta, scores) {
  const leftPercent = scores[meta.left];
  const rightPercent = scores[meta.right];
  const diff = Math.abs(leftPercent - rightPercent);

  if (diff <= 8) {
    return `
      <li>
        <strong>${meta.left}/${meta.right}：${meta.leftName} 与 ${meta.rightName}接近平衡</strong>
        <p>
          你的 ${meta.left} 为 ${leftPercent}%，${meta.right} 为 ${rightPercent}%，两侧差距不大。
          这说明你不是单一地偏向某一种理解方式，而是既能被${meta.leftName}吸引，也能理解${meta.rightName}的价值。
          在非遗体验中，你可能会一边享受现场感，一边希望知道它背后的来龙去脉。
        </p>
      </li>
    `;
  }

  if (leftPercent > rightPercent) {
    return `
      <li>
        <strong>${meta.left}/${meta.right}：${getTendencyLabel(diff)}“${meta.leftName}”</strong>
        <p>
          你的 ${meta.left} 为 ${leftPercent}%，高于 ${meta.right} 的 ${rightPercent}%。
          ${meta.leftDesc}
          所以你在接触非遗时，往往不是先从抽象概念开始，而是更容易被具体场景、体验过程或可感知的细节打动。
        </p>
      </li>
    `;
  }

  return `
    <li>
      <strong>${meta.left}/${meta.right}：${getTendencyLabel(diff)}“${meta.rightName}”</strong>
      <p>
        你的 ${meta.right} 为 ${rightPercent}%，高于 ${meta.left} 的 ${leftPercent}%。
        ${meta.rightDesc}
        所以你在接触非遗时，通常不只是看它“好不好玩、热不热闹”，也会在意它为什么形成、如何传承、和地方文化有什么关系。
      </p>
    </li>
  `;
}

function getOverallAnalysisText(profile, scores, resultCode) {
  const dominantTexts = analysisDimensionMeta.map(meta => {
    const leftPercent = scores[meta.left];
    const rightPercent = scores[meta.right];

    if (Math.abs(leftPercent - rightPercent) <= 8) {
      return `${meta.leftName}/${meta.rightName}均衡`;
    }

    return leftPercent > rightPercent ? meta.leftName : meta.rightName;
  });

  return `
    你的拾遗人格代码是 <strong>${resultCode}</strong>，对应 <strong>${profile.name}</strong>。
    这个结果不是只由某一道题决定的，而是由你在四组维度中的整体选择共同形成的。
    从量表上看，你的主要特征可以概括为：<strong>${dominantTexts.join("、")}</strong>。
    换句话说，系统认为你对非遗的兴趣并不是随机的，而是有比较清晰的偏好路径：
    你会被某些展示方式、参与方式和文化气质持续吸引。
  `;
}

function getRecommendationAnalysisHtml(recommendations) {
  if (!recommendations || recommendations.length === 0) {
    return `
      <p>
        本次暂未生成推荐项目。后续平台会继续扩充国家级非遗推荐库，让测评结果和项目推荐之间的匹配更准确。
      </p>
    `;
  }

  const items = recommendations.slice(0, 3).map(item => {
    const project = item.project;

    return `
      <li>
        <strong>${project.name}</strong>
        <p>${item.reason}</p>
      </li>
    `;
  }).join("");

  return `
    <p>
      推荐项目不是简单按照知名度排序，而是综合了你的拾遗人格代码、四组维度百分比、项目门类、关键词和项目画像。
      因此，即使两个人得到同一个人格代码，只要四项指标占比不同，最终推荐也可能不同。
    </p>
    <ul class="analysis-detail-list">
      ${items}
    </ul>
  `;
}

function getAnalysisTagHtml(keywords) {
  return `
    <div class="analysis-tag-row">
      ${(keywords || []).map(keyword => `<span>${keyword}</span>`).join("")}
    </div>
  `;
}

function renderAnalysisReport({ profile, scores, resultCode, recommendations }) {
  return `
    <section class="result-section analysis-report" id="analysisReportSection">
      <h3>文字分析报告</h3>

      <h4>你的整体画像</h4>
      <p>${getOverallAnalysisText(profile, scores, resultCode)}</p>
      <p>${profile.report}</p>

      <h4>系统从你的作答中看到了什么</h4>
      <ul class="analysis-detail-list">
        ${analysisDimensionMeta.map(meta => getDimensionAnalysisItem(meta, scores)).join("")}
      </ul>

      <h4>核心关键词</h4>
      ${getAnalysisTagHtml(profile.keywords)}

      <h4>为什么推荐这些非遗项目</h4>
      ${getRecommendationAnalysisHtml(recommendations)}

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
  const certificateNo = createFybiCertificateNo(currentMode);

  trackShiyiEvent("complete_fybi_test", {
    test_mode: currentMode,
    result_code: resultCode,
    result_name: profile.name,
    certificate_no: certificateNo
  });

  currentRecommendationPool = [];
  currentRecommendationBatchIndex = 0;
  
  if (window.shiyiRecommender) {
    if (window.shiyiRecommender.getNationalHeritageRecommendationPool) {
      currentRecommendationPool = window.shiyiRecommender.getNationalHeritageRecommendationPool(
        {
          code: resultCode,
          scores: percentScores
        },
        {
          poolSize: 30
        }
      );
    } else {
      currentRecommendationPool = window.shiyiRecommender.getNationalHeritageRecommendations({
        code: resultCode,
        scores: percentScores
      });
    }
  }

  const recommendations = getCurrentRecommendationBatch();

  const reportData = {
    resultCode,
    profile,
    scores: percentScores,
    generatedTime,
    certificateNo,
    recommendations,
    testMode: currentMode
  };

  window.currentFybiReport = reportData;

  questionScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  resultContent.innerHTML = `
    <div class="result-header-card">
      <p class="test-kicker">拾遗人格测评报告</p>
      <p class="generated-time">生成时间：${generatedTime}</p>
      <p class="certificate-number">报告编号：${certificateNo}</p>

      <div class="result-main">
        <div>
          <p class="result-code-label">你的拾遗人格代码</p>
          <h2>${resultCode}</h2>
          <h3>${profile.name}</h3>
        </div>

        ${getProfileImageHtml(profile, resultCode)}
      </div>
    </div>

    ${renderScaleReport(percentScores)}
    ${renderRecommendationCards(recommendations)}
    ${renderAnalysisReport({
      profile,
      scores: percentScores,
      resultCode,
      recommendations
    })}

    <div class="result-actions">
      <button class="btn primary red" type="button" id="exportReportBtn">导出证书</button>
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

const refreshRecommendBtn = document.getElementById("refreshRecommendBtn");

if (refreshRecommendBtn) {
  refreshRecommendBtn.onclick = () => {
    if (!currentRecommendationPool || currentRecommendationPool.length <= recommendationBatchSize) {
      return;
    }

    const maxBatchCount = Math.ceil(currentRecommendationPool.length / recommendationBatchSize);
    currentRecommendationBatchIndex = (currentRecommendationBatchIndex + 1) % maxBatchCount;

    updateRecommendationBatch();

    trackShiyiEvent("refresh_fybi_recommendations", {
      result_code: resultCode,
      result_name: profile.name,
      batch_index: currentRecommendationBatchIndex + 1
    });
  };
}

  document.getElementById("exportReportBtn").onclick = () => {
    exportFybiReportAsImage(window.currentFybiReport);
  };

  document.getElementById("restartBtn").onclick = () => {
    resultScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
  };

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  setTimeout(() => {
    tryShowLotteryPopupAfterReportGenerated();
  }, 350);
}

document.querySelectorAll(".mode-card").forEach(button => {
  button.onclick = () => {
    startTest(button.dataset.mode);
  };
});

nextBtn.onclick = goToNextQuestion;
prevBtn.onclick = goToPreviousQuestion;
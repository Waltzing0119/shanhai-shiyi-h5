const questions = [
  {
    question: "“山海拾遗非遗数字平台”的核心板块不包括以下哪一项？",
    options: ["非遗地图", "非遗体验小游戏", "宣传栏", "网络购物车"],
    answer: 3
  },
  {
    question: "非遗地图的主要作用是什么？",
    options: [
      "展示非遗项目分布并跳转介绍页面",
      "只用于显示天气",
      "只用于导航开车路线",
      "只用于聊天"
    ],
    answer: 0
  },
  {
    question: "平台设置“加入我们”入口的主要目的是什么？",
    options: [
      "方便传承人、协会、团队联系入驻",
      "隐藏平台内容",
      "减少用户参与",
      "关闭宣传渠道"
    ],
    answer: 0
  },
  {
    question: "非遗体验小游戏的意义是什么？",
    options: [
      "提升青年用户参与感",
      "替代所有线下非遗传承",
      "只为了娱乐不需要文化内容",
      "让用户无法了解非遗"
    ],
    answer: 0
  }
];

let current = 0;
let score = 0;
let answered = false;

const questionTitle = document.getElementById("questionTitle");
const optionsBox = document.getElementById("options");
const feedback = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");

function renderQuestion() {
  answered = false;
  feedback.innerText = "";
  nextBtn.style.display = "none";

  const q = questions[current];
  questionTitle.innerText = `第 ${current + 1} 题：${q.question}`;
  optionsBox.innerHTML = "";

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = option;
    btn.onclick = () => checkAnswer(btn, index);
    optionsBox.appendChild(btn);
  });
}

function checkAnswer(button, index) {
  if (answered) return;
  answered = true;

  const q = questions[current];
  const optionButtons = document.querySelectorAll(".option");

  optionButtons.forEach((btn, i) => {
    if (i === q.answer) {
      btn.classList.add("correct");
    }
  });

  if (index === q.answer) {
    score++;
    feedback.innerText = "回答正确！你离非遗守护人又近了一步。";
  } else {
    button.classList.add("wrong");
    feedback.innerText = "回答错误，不过没关系，继续了解非遗吧！";
  }

  nextBtn.style.display = "inline-block";
}

nextBtn.onclick = () => {
  current++;

  if (current >= questions.length) {
    showResult();
  } else {
    renderQuestion();
  }
};

function showResult() {
  questionTitle.innerText = "闯关完成！";
  optionsBox.innerHTML = "";
  feedback.innerHTML = `
    你的得分是：${score} / ${questions.length}<br />
    恭喜你获得“山海拾遗非遗守护人”称号！
  `;
  nextBtn.style.display = "none";
}

renderQuestion();
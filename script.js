var mode = "add";
var level = 1;
var streak = 0;

var currentAnswer = 0;
var currentQuestion = "";

var repeatQueue = [];
var usedQuestions = new Set();

var questionEl = document.getElementById("question");
var answersEl = document.getElementById("answers");
var streakEl = document.getElementById("streak");
var columnHelpEl = document.getElementById("column-help");

function setMode(newMode) {
  mode = newMode;
  updateUI();
  resetHistory();
  nextQuestion();
}

function setLevel(newLevel) {
  level = newLevel;
  updateUI();
  resetHistory();
  nextQuestion();
}

function updateUI() {

  var modes = ["add", "subtract", "mixed", "objects"];
  modes.forEach(m => {
    var b = document.getElementById("mode-" + m);
    if (b) b.classList.remove("active");
  });

  var activeMode = document.getElementById("mode-" + mode);
  if (activeMode) activeMode.classList.add("active");

  for (var i = 1; i <= 3; i++) {
    var lb = document.getElementById("level-" + i);
    if (lb) lb.classList.remove("active");
  }

  var activeLevel = document.getElementById("level-" + level);
  if (activeLevel) activeLevel.classList.add("active");
}

function resetHistory() {
  usedQuestions.clear();
  repeatQueue = [];
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function makeKey(a, op, b) {
  return a + op + b;
}

function generateAnswers(correct) {
  var answers = [correct];

  while (answers.length < 4) {
    var fake = correct + random(-10, 10);

    if (
      fake !== correct &&
      fake >= 0 &&
      fake <= 100 &&
      !answers.includes(fake)
    ) {
      answers.push(fake);
    }
  }

  return shuffle(answers);
}

function renderAnswers(arr) {
  answersEl.innerHTML = "";

  arr.forEach(a => {
    var btn = document.createElement("button");
    btn.textContent = a;

    btn.onclick = () => checkAnswer(a, btn);

    answersEl.appendChild(btn);
  });
}

function nextQuestion() {

  columnHelpEl.classList.add("hidden");

  var a, b, op;

  // ======================
  // LEVEL 1 FIXED LOGIC
  // ======================
  if (level === 1) {

    do {
      op = Math.random() > 0.5 ? "+" : "-";

      if (op === "+") {
        a = random(1, 19);
        b = random(1, 19 - a); // гарантирует ≤ 20
      } else {
        a = random(1, 20);
        b = random(1, a); // без отрицательных
      }

    } while (usedQuestions.has(makeKey(a, op, b)));

  }

  if (level === 2) {

    do {
      op = Math.random() > 0.5 ? "+" : "-";
      a = random(10, 99);
      b = random(1, 9);

      if (op === "-" && b > a) {
        var t = a; a = b; b = t;
      }

    } while (usedQuestions.has(makeKey(a, op, b)));
  }

  if (level === 3) {

    do {
      op = Math.random() > 0.5 ? "+" : "-";
      a = random(10, 99);
      b = random(10, 99);

      if (op === "-" && b > a) {
        var t2 = a; a = b; b = t2;
      }

    } while (usedQuestions.has(makeKey(a, op, b)));
  }

  usedQuestions.add(makeKey(a, op, b));

  currentAnswer = op === "+" ? a + b : a - b;
  currentQuestion = a + " " + op + " " + b;

  questionEl.textContent = currentQuestion + " = ?";

  renderAnswers(generateAnswers(currentAnswer));
}

function checkAnswer(ans, btn) {

  if (ans === currentAnswer) {
    streak++;
    streakEl.textContent = streak;
    btn.classList.add("correct");
    setTimeout(nextQuestion, 500);
  } else {
    streak = 0;
    streakEl.textContent = streak;
    btn.classList.add("wrong");
    setTimeout(nextQuestion, 700);
  }
}

updateUI();
nextQuestion();

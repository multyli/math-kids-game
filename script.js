var mode = "add";
var level = 1;
var streak = 0;

var currentAnswer = 0;
var currentQuestion = "";

var usedQuestions = new Set();

var questionEl = document.getElementById("question");
var answersEl = document.getElementById("answers");
var streakEl = document.getElementById("streak");

function setMode(newMode) {
  mode = newMode;
  usedQuestions.clear();
  updateUI();
  nextQuestion();
}

function setLevel(newLevel) {
  level = newLevel;
  usedQuestions.clear();
  updateUI();
  nextQuestion();
}

function updateUI() {

  // MODE highlight
  var modes = ["add", "subtract", "mixed", "objects"];

  modes.forEach(function(m) {
    var el = document.getElementById("mode-" + m);
    if (el) el.classList.remove("active");
  });

  var activeMode = document.getElementById("mode-" + mode);
  if (activeMode) activeMode.classList.add("active");

  // LEVEL highlight
  for (var i = 1; i <= 3; i++) {
    var el = document.getElementById("level-" + i);
    if (el) el.classList.remove("active");
  }

  var activeLevel = document.getElementById("level-" + level);
  if (activeLevel) activeLevel.classList.add("active");
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function key(a, op, b) {
  return a + op + b;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function generateAnswers(correct) {
  var arr = [correct];

  while (arr.length < 4) {
    var fake = correct + random(-5, 5);

    if (
      fake !== correct &&
      fake >= 0 &&
      fake <= 100 &&
      !arr.includes(fake)
    ) {
      arr.push(fake);
    }
  }

  return shuffle(arr);
}

function nextQuestion() {

  var a, b, op;

  // =========================
  // LEVEL 1 (СТРОГО <= 20)
  // =========================
  if (level === 1) {

    var attempts = 0;

    do {
      attempts++;

      op = Math.random() > 0.5 ? "+" : "-";

      if (op === "+") {
        a = random(1, 19);
        b = random(1, 20 - a); // <-- ЖЁСТКО ≤ 20
      } else {
        a = random(1, 20);
        b = random(1, a);
      }

      if (attempts > 50) break;

    } while (usedQuestions.has(key(a, op, b)));
  }

  // LEVEL 2
  if (level === 2) {

    do {
      op = Math.random() > 0.5 ? "+" : "-";
      a = random(10, 99);
      b = random(1, 9);

      if (op === "-" && b > a) {
        var t = a; a = b; b = t;
      }

    } while (usedQuestions.has(key(a, op, b)));
  }

  // LEVEL 3
  if (level === 3) {

    do {
      op = Math.random() > 0.5 ? "+" : "-";
      a = random(10, 99);
      b = random(10, 99);

      if (op === "-" && b > a) {
        var t2 = a; a = b; b = t2;
      }

    } while (usedQuestions.has(key(a, op, b)));
  }

  usedQuestions.add(key(a, op, b));

  currentAnswer = op === "+" ? a + b : a - b;
  currentQuestion = a + " " + op + " " + b;

  questionEl.textContent = currentQuestion + " = ?";

  answersEl.innerHTML = "";
  generateAnswers(currentAnswer).forEach(function(ans) {
    var btn = document.createElement("button");
    btn.textContent = ans;

    btn.onclick = function () {
      checkAnswer(ans, btn);
    };

    answersEl.appendChild(btn);
  });
}

function checkAnswer(ans, btn) {

  if (ans === currentAnswer) {
    streak++;
    streakEl.textContent = streak;
    btn.classList.add("correct");
    setTimeout(nextQuestion, 400);
  } else {
    streak = 0;
    streakEl.textContent = streak;
    btn.classList.add("wrong");
    setTimeout(nextQuestion, 600);
  }
}

// 🔥 СТАРТОВАЯ ИНИЦИАЛИЗАЦИЯ (ВАЖНО!)
updateUI();
nextQuestion();

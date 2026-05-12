var mode = "add";
var level = 1;
var streak = 0;

var currentAnswer = 0;
var currentQuestion = "";

var usedQuestions = new Set();

var questionEl = document.getElementById("question");
var answersEl = document.getElementById("answers");
var streakEl = document.getElementById("streak");

// ЭМОДЖИ
var goodEmojis = ["🎉", "😄", "👍", "🥳", "✨"];
var badEmojis = ["😢", "🙈", "😕", "💧", "🥺"];

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

  var modes = ["add", "subtract", "mixed", "objects"];

  modes.forEach(function(m) {
    var el = document.getElementById("mode-" + m);
    if (el) el.classList.remove("active");
  });

  var activeMode = document.getElementById("mode-" + mode);
  if (activeMode) activeMode.classList.add("active");

  for (var i = 1; i <= 3; i++) {
    var lvl = document.getElementById("level-" + i);
    if (lvl) lvl.classList.remove("active");
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

function showEmoji(success) {

  var emoji = document.createElement("div");

  emoji.className = "emoji-popup";

  if (success) {
    emoji.textContent =
      goodEmojis[random(0, goodEmojis.length - 1)];
  } else {
    emoji.textContent =
      badEmojis[random(0, badEmojis.length - 1)];
  }

  document.body.appendChild(emoji);

  setTimeout(function() {
    emoji.remove();
  }, 600);
}

function generateObjectsQuestion() {

  if (level === 1) {

    var count = random(1, 10);

    currentAnswer = count;

    questionEl.innerHTML = `
      <div class="objects">
        ${"🐌 ".repeat(count)}
      </div>

      <div style="margin-top:20px">
        Сколько улиток?
      </div>
    `;
  }

  if (level === 2) {

    var c1 = random(1, 5);
    var c2 = random(1, 5);

    currentAnswer = c1 + c2;

    questionEl.innerHTML = `
      <div class="objects">
        🪙 ${c1}
        &nbsp;&nbsp;
        🪙 ${c2}
      </div>

      <div style="margin-top:20px">
        Сколько монет?
      </div>
    `;
  }

  if (level === 3) {

    var total = 0;
    var html = "";

    var countCoins = random(3, 4);

    for (var i = 0; i < countCoins; i++) {

      var val = random(1, 9);

      total += val;

      html += "🪙 " + val + " ";
    }

    currentAnswer = total;

    questionEl.innerHTML = `
      <div class="objects">
        ${html}
      </div>

      <div style="margin-top:20px">
        Какая сумма?
      </div>
    `;
  }

  renderAnswers(generateAnswers(currentAnswer));
}

function nextQuestion() {

  // OBJECTS MODE
  if (mode === "objects") {
    generateObjectsQuestion();
    return;
  }

  var a, b, op;

  // ВЫБОР ОПЕРАЦИИ ПО РЕЖИМУ
  if (mode === "add") {
    op = "+";
  }

  if (mode === "subtract") {
    op = "-";
  }

  if (mode === "mixed") {
    op = Math.random() > 0.5 ? "+" : "-";
  }

  // LEVEL 1
  if (level === 1) {

    do {

      if (op === "+") {

        a = random(1, 19);
        b = random(1, 20 - a);

      } else {

        a = random(1, 20);
        b = random(1, a);

      }

    } while (usedQuestions.has(key(a, op, b)));
  }

  // LEVEL 2
  if (level === 2) {

    do {

      a = random(10, 99);
      b = random(1, 9);

      if (op === "-" && b > a) {
        var t = a;
        a = b;
        b = t;
      }

    } while (usedQuestions.has(key(a, op, b)));
  }

  // LEVEL 3
  if (level === 3) {

    do {

      a = random(10, 99);
      b = random(10, 99);

      if (op === "-" && b > a) {
        var t2 = a;
        a = b;
        b = t2;
      }

    } while (usedQuestions.has(key(a, op, b)));
  }

  usedQuestions.add(key(a, op, b));

  currentAnswer =
    op === "+"
      ? a + b
      : a - b;

  currentQuestion =
    a + " " + op + " " + b;

  questionEl.textContent =
    currentQuestion + " = ?";

  renderAnswers(
    generateAnswers(currentAnswer)
  );
}

function renderAnswers(arr) {

  answersEl.innerHTML = "";

  arr.forEach(function(ans) {

    var btn = document.createElement("button");

    btn.textContent = ans;

    btn.onclick = function() {
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

    showEmoji(true);

    setTimeout(function() {
      nextQuestion();
    }, 600);

  } else {

    streak = 0;

    streakEl.textContent = streak;

    btn.classList.add("wrong");

    showEmoji(false);

    setTimeout(function() {
      nextQuestion();
    }, 600);
  }
}

updateUI();
nextQuestion();

var mode = "add";
var level = 1;
var streak = 0;
var language = "ru";

var currentAnswer = 0;
var currentQuestion = "";
var currentQuestionData = null;

var usedQuestions = new Set();
var wrongQuestionsQueue = [];

var questionEl = document.getElementById("question");
var answersEl = document.getElementById("answers");
var streakEl = document.getElementById("streak");

var goodEmojis = ["🎉", "😄", "👍", "🥳", "✨"];
var badEmojis = ["😢", "🙈", "😕", "💧", "🥺"];

var translations = {
  ru: {
    title: "Математика",
    streak: "Без ошибок:",
    add: "➕ Сложение",
    subtract: "➖ Вычитание",
    mixed: "🎲 Смешанные",
    objects: "🐌 Предметы",
    level1: "⭐ Уровень 1",
    level2: "⭐⭐ Уровень 2",
    level3: "⭐⭐⭐ Уровень 3",
    snails: "Сколько улиток?",
    coins: "Сколько монет?",
    total: "Какая сумма?"
  },
  sl: {
    title: "Matematika",
    streak: "Brez napak:",
    add: "➕ Seštevanje",
    subtract: "➖ Odštevanje",
    mixed: "🎲 Mešano",
    objects: "🐌 Predmeti",
    level1: "⭐ Stopnja 1",
    level2: "⭐⭐ Stopnja 2",
    level3: "⭐⭐⭐ Stopnja 3",
    snails: "Koliko polžev?",
    coins: "Koliko kovancev?",
    total: "Kolikšna je vsota?"
  }
};

function setLanguage(lang) {
  language = lang;

  document.documentElement.lang = lang;

  document.getElementById("lang-ru").classList.remove("active");
  document.getElementById("lang-sl").classList.remove("active");

  document.getElementById("lang-" + lang).classList.add("active");

  applyTranslations();

  if (mode === "objects") {
    nextQuestion();
  }
}

function applyTranslations() {
  var t = translations[language];

  document.title = t.title;
  document.getElementById("title").textContent = t.title;
  document.getElementById("streak-label").textContent = t.streak;

  document.getElementById("mode-add").textContent = t.add;
  document.getElementById("mode-subtract").textContent = t.subtract;
  document.getElementById("mode-mixed").textContent = t.mixed;
  document.getElementById("mode-objects").textContent = t.objects;

  document.getElementById("level-1").textContent = t.level1;
  document.getElementById("level-2").textContent = t.level2;
  document.getElementById("level-3").textContent = t.level3;
}

function setMode(newMode) {
  mode = newMode;
  usedQuestions.clear();
  wrongQuestionsQueue = [];
  updateUI();
  nextQuestion();
}

function setLevel(newLevel) {
  level = newLevel;
  usedQuestions.clear();
  wrongQuestionsQueue = [];
  updateUI();
  nextQuestion();
}

function updateUI() {
  var modes = ["add", "subtract", "mixed", "objects"];

  modes.forEach(function(m) {
    var btn = document.getElementById("mode-" + m);

    if (btn) {
      btn.classList.remove("active");
    }
  });

  var activeMode = document.getElementById("mode-" + mode);

  if (activeMode) {
    activeMode.classList.add("active");
  }

  for (var i = 1; i <= 3; i++) {
    var lvlBtn = document.getElementById("level-" + i);

    if (lvlBtn) {
      lvlBtn.classList.remove("active");
    }
  }

  var activeLevel = document.getElementById("level-" + level);

  if (activeLevel) {
    activeLevel.classList.add("active");
  }
}

function random(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function shuffle(arr) {
  return arr.sort(function() {
    return Math.random() - 0.5;
  });
}

function key(a, op, b) {
  return a + op + b;
}

function generateAnswers(correct) {
  var answers = [correct];

  while (answers.length < 4) {
    var fake = correct + random(-5, 5);

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

function showEmoji(success) {
  var popup = document.createElement("div");

  popup.className = "emoji-popup";

  if (success) {
    popup.textContent = goodEmojis[random(0, goodEmojis.length - 1)];
  } else {
    popup.textContent = badEmojis[random(0, badEmojis.length - 1)];
  }

  document.body.appendChild(popup);

  setTimeout(function() {
    popup.remove();
  }, 600);
}

function renderColumnQuestion(a, op, b) {
  var top = String(a);
  var bottom = String(b);

  var width = Math.max(top.length, bottom.length);

  top = top.padStart(width, " ");
  bottom = bottom.padStart(width, " ");

  var topDigits = top.split("").map(function(char) {
    return '<span>' + (char === " " ? "&nbsp;" : char) + '</span>';
  }).join("");

  var bottomDigits = bottom.split("").map(function(char) {
    return '<span>' + (char === " " ? "&nbsp;" : char) + '</span>';
  }).join("");

  questionEl.innerHTML = `
    <div class="column-question">
      <div class="column-row">${topDigits}</div>
      <div class="column-row operator-row">
        <span class="operator">${op}</span>
        <div class="digits">${bottomDigits}</div>
      </div>
      <div class="column-line"></div>
      <div class="column-answer">?</div>
    </div>
  `;
}

function generateObjectsQuestion() {
  var t = translations[language];

  if (level === 1) {
    var count = random(1, 10);

    currentAnswer = count;

    questionEl.innerHTML = `
      <div class="objects">
        ${"🐌 ".repeat(count)}
      </div>

      <div style="margin-top:20px">
        ${t.snails}
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
        ${t.coins}
      </div>
    `;
  }

  if (level === 3) {
    var total = 0;
    var html = "";

    var coins = random(3, 4);

    for (var i = 0; i < coins; i++) {
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
        ${t.total}
      </div>
    `;
  }

  renderAnswers(generateAnswers(currentAnswer));
}

function nextQuestion() {
  if (mode === "objects") {
    generateObjectsQuestion();
    return;
  }

  if (wrongQuestionsQueue.length > 0) {
    var retry = wrongQuestionsQueue.shift();

    currentAnswer = retry.answer;
    currentQuestion = retry.a + " " + retry.op + " " + retry.b;
    currentQuestionData = retry;

    renderColumnQuestion(retry.a, retry.op, retry.b);

    renderAnswers(generateAnswers(currentAnswer));
    return;
  }

  var a, b, op;

  if (mode === "add") {
    op = "+";
  }

  if (mode === "subtract") {
    op = "-";
  }

  if (mode === "mixed") {
    op = Math.random() > 0.5 ? "+" : "-";
  }

  if (level === 1) {
    do {
      if (op === "+") {
        a = random(1, 19);
        b = random(1, 20 - a);
      } else {
        a = random(1, 20);
        b = random(1, a);
      }
    } while (
      usedQuestions.has(key(a, op, b))
    );
  }

  if (level === 2) {
    do {
      a = random(10, 99);
      b = random(1, 9);

      if (op === "-" && b > a) {
        var t = a;
        a = b;
        b = t;
      }
    } while (
      usedQuestions.has(key(a, op, b))
    );
  }

  if (level === 3) {
    do {
      a = random(10, 99);
      b = random(10, 99);

      if (op === "-" && b > a) {
        var t2 = a;
        a = b;
        b = t2;
      }
    } while (
      usedQuestions.has(key(a, op, b))
    );
  }

  usedQuestions.add(key(a, op, b));

  currentAnswer = op === "+" ? a + b : a - b;

  currentQuestion = a + " " + op + " " + b;

  currentQuestionData = {
    a: a,
    b: b,
    op: op,
    answer: currentAnswer
  };

  questionEl.textContent = currentQuestion + " = ?";

  renderAnswers(generateAnswers(currentAnswer));
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

    if (
      currentQuestionData &&
      mode !== "objects"
    ) {
      wrongQuestionsQueue.push({
        a: currentQuestionData.a,
        b: currentQuestionData.b,
        op: currentQuestionData.op,
        answer: currentQuestionData.answer
      });
    }

    showEmoji(false);

    setTimeout(function() {
      nextQuestion();
    }, 600);
  }
}

applyTranslations();
setLanguage("ru");
updateUI();
nextQuestion();

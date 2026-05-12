var mode = "add";
var level = 1;
var streak = 0;

var currentAnswer = 0;
var currentQuestion = "";

var repeatQueue = [];

var questionEl = document.getElementById("question");
var answersEl = document.getElementById("answers");
var streakEl = document.getElementById("streak");
var columnHelpEl = document.getElementById("column-help");

function setMode(newMode) {
  mode = newMode;
  nextQuestion();
}

function setLevel(newLevel) {
  level = newLevel;
  nextQuestion();
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
  return array.sort(function() {
    return Math.random() - 0.5;
  });
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

function renderAnswers(answers) {

  answersEl.innerHTML = "";

  answers.forEach(function(answer) {

    var btn = document.createElement("button");

    btn.textContent = answer;

    btn.onclick = function() {
      checkAnswer(answer, btn);
    };

    answersEl.appendChild(btn);
  });
}

function nextQuestion() {

  columnHelpEl.classList.add("hidden");

  if (repeatQueue.length > 0 && Math.random() < 0.4) {

    var repeat = repeatQueue.shift();

    currentQuestion = repeat.question;
    currentAnswer = repeat.answer;

    questionEl.innerHTML = `
      <div>Попробуем ещё 😊</div>
      <div style="margin-top:20px">${repeat.question}</div>
    `;

    showColumnHelp(repeat.a, repeat.b, repeat.operator);

    renderAnswers(generateAnswers(currentAnswer));

    return;
  }

  if (mode === "objects") {
    generateObjectsQuestion();
    return;
  }

  var a;
  var b;

  if (level === 1) {

    a = random(1, 20);
    b = random(1, 20);

  }

  if (level === 2) {

    a = random(10, 99);
    b = random(1, 9);

  }

  if (level === 3) {

    a = random(10, 99);
    b = random(10, 99);

  }

  var operator = "+";

  if (mode === "subtract") {

    operator = "-";

    if (b > a) {
      var temp = a;
      a = b;
      b = temp;
    }
  }

  if (mode === "mixed") {

    operator = Math.random() > 0.5 ? "+" : "-";

    if (operator === "-" && b > a) {
      var temp2 = a;
      a = b;
      b = temp2;
    }
  }

  currentAnswer =
    operator === "+"
      ? a + b
      : a - b;

  if (currentAnswer < 0 || currentAnswer > 100) {
    nextQuestion();
    return;
  }

  currentQuestion = a + " " + operator + " " + b;

  questionEl.textContent = currentQuestion + " = ?";

  renderAnswers(generateAnswers(currentAnswer));
}

function generateObjectsQuestion() {

  if (level === 1) {

    var count = random(1, 10);

    currentAnswer = count;

    var snails = "🐌 ".repeat(count);

    questionEl.innerHTML = `
      <div class="objects">
        ${snails}
      </div>

      <div style="margin-top:20px;font-size:32px">
        Сколько улиток?
      </div>
    `;
  }

  if (level === 2) {

    var coin1 = random(1, 5);
    var coin2 = random(1, 5);

    currentAnswer = coin1 + coin2;

    questionEl.innerHTML = `
      <div class="objects">
        🪙 ${coin1}
        &nbsp;&nbsp;
        🪙 ${coin2}
      </div>

      <div style="margin-top:20px;font-size:32px">
        Сколько всего монет?
      </div>
    `;
  }

  if (level === 3) {

    var coinsCount = random(3, 4);

    var total = 0;
    var coinsHtml = "";

    for (var i = 0; i < coinsCount; i++) {

      var value = random(1, 9);

      total += value;

      coinsHtml += `🪙 ${value} &nbsp; `;
    }

    currentAnswer = total;

    questionEl.innerHTML = `
      <div class="objects">
        ${coinsHtml}
      </div>

      <div style="margin-top:20px;font-size:32px">
        Какая сумма?
      </div>
    `;
  }

  renderAnswers(generateAnswers(currentAnswer));
}

function showColumnHelp(a, b, operator) {

  columnHelpEl.classList.remove("hidden");

  columnHelpEl.textContent = `
  ${a}
${operator} ${b}
────
  `;
}

function checkAnswer(answer, button) {

  if (answer === currentAnswer) {

    streak++;

    streakEl.textContent = streak;

    button.classList.add("correct");

    setTimeout(function() {
      nextQuestion();
    }, 700);

  } else {

    streak = 0;

    streakEl.textContent = streak;

    button.classList.add("wrong");

    var parts = currentQuestion.split(" ");

    if (parts.length === 3) {

      repeatQueue.push({
        a: parts[0],
        operator: parts[1],
        b: parts[2],
        question: currentQuestion,
        answer: currentAnswer
      });
    }

    setTimeout(function() {
      nextQuestion();
    }, 900);
  }
}

nextQuestion();
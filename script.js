let mode='add';
let level=1;
let streak=0;
let language='ru';

let currentAnswer=0;
let currentData=null;

const questionEl=document.getElementById('question');
const answersEl=document.getElementById('answers');
const streakEl=document.getElementById('streak');

const retryQueue=[];

const coinImage='https://static.wikia.nocookie.net/hollowknight/images/c/c9/Geo.png/revision/latest/scale-to-width/360?cb=20170508211247';

const translations={
ru:{
title:'Математика',
streak:'Без ошибок:',
add:'➕ Сложение',
subtract:'➖ Вычитание',
mixed:'🎲 Смешанные',
objects:'Монеты',
level1:'⭐ Уровень 1',
level2:'⭐⭐ Уровень 2',
level3:'⭐⭐⭐ Уровень 3',
coins:'Сколько всего монет?',
total:'Сколько монет?'
},
sl:{
title:'Matematika',
streak:'Brez napak:',
add:'➕ Seštevanje',
subtract:'➖ Odštevanje',
mixed:'🎲 Mešano',
objects:'Kovanci',
level1:'⭐ Stopnja 1',
level2:'⭐⭐ Stopnja 2',
level3:'⭐⭐⭐ Stopnja 3',
coins:'Koliko kovancev skupaj?',
total:'Koliko kovancev?'
}
};

function setLanguage(lang){

language=lang;

document.getElementById('lang-ru').classList.remove('active');
document.getElementById('lang-sl').classList.remove('active');

document.getElementById('lang-'+lang).classList.add('active');

const t=translations[lang];

document.title=t.title;
document.getElementById('title').textContent=t.title;
document.getElementById('streak-label').textContent=t.streak;

document.getElementById('mode-add').innerHTML=t.add;
document.getElementById('mode-subtract').innerHTML=t.subtract;
document.getElementById('mode-mixed').innerHTML=t.mixed;

document.getElementById('mode-objects').innerHTML=`
<img src="${coinImage}" class="button-coin">
${t.objects}
`;

document.getElementById('level-1').textContent=t.level1;
document.getElementById('level-2').textContent=t.level2;
document.getElementById('level-3').textContent=t.level3;

refreshCurrentQuestionText();
}

function refreshCurrentQuestionText(){

if(mode!=='objects'){
return;
}

objectsQuestion();
}

function setMode(m){
mode=m;
updateButtons();
nextQuestion();
}

function setLevel(l){
level=l;
updateButtons();
nextQuestion();
}

function updateButtons(){

['add','subtract','mixed','objects'].forEach(m=>{
document.getElementById('mode-'+m).classList.remove('active');
});

document.getElementById('mode-'+mode).classList.add('active');

[1,2,3].forEach(l=>{
document.getElementById('level-'+l).classList.remove('active');
});

document.getElementById('level-'+level).classList.add('active');
}

function rnd(min,max){
return Math.floor(Math.random()*(max-min+1))+min;
}

function shuffle(arr){
return arr.sort(()=>Math.random()-0.5);
}

function answers(correct){

const arr=[correct];

while(arr.length<4){

const v=correct+rnd(-5,5);

if(v>=0&&!arr.includes(v)){
arr.push(v);
}
}

return shuffle(arr);
}

function renderAnswers(list){

answersEl.innerHTML='';

list.forEach(v=>{

const btn=document.createElement('button');

btn.textContent=v;

btn.onclick=()=>check(v,btn);

answersEl.appendChild(btn);
});
}

function renderColumn(a,op,b){

const top=String(a);
const bottom=String(b);

const width=Math.max(top.length,bottom.length);

const t=top.padStart(width,' ');
const bt=bottom.padStart(width,' ');

questionEl.innerHTML=`
<div class="column-question">

<div class="column-row">
${t.split('').map(x=>`<span>${x===' '?'&nbsp;':x}</span>`).join('')}
</div>

<div class="column-row operator-row">
<span class="operator">${op}</span>

<div class="digits">
${bt.split('').map(x=>`<span>${x===' '?'&nbsp;':x}</span>`).join('')}
</div>
</div>

<div class="column-line"></div>
<div class="column-answer">?</div>

</div>`;
}

function createCoin(value){

return `
<div class="coin-block">
<img src="${coinImage}" class="coin-image">
<div class="coin-value">${value}</div>
</div>
`;
}

function objectsQuestion(){

const t=translations[language];

let values=[];

if(level===1){

values=[
rnd(2,10),
rnd(2,10)
];
}

if(level===2){

values=[
rnd(4,10),
rnd(4,10),
rnd(4,10)
];
}

if(level===3){

values=[
rnd(5,10),
rnd(5,10),
rnd(5,10),
rnd(5,10)
];
}

currentAnswer=values.reduce((a,b)=>a+b,0);

let html='<div class="coins-row">';

values.forEach(v=>{
html+=createCoin(v);
});

html+='</div>';

questionEl.innerHTML=`
${html}
<div style="margin-top:20px">
${t.total}
</div>
`;

renderAnswers(answers(currentAnswer));
}

function nextQuestion(){

if(retryQueue.length){

const q=retryQueue.shift();

currentData=q;
currentAnswer=q.answer;

renderColumn(q.a,q.op,q.b);

renderAnswers(answers(currentAnswer));

return;
}

if(mode==='objects'){
objectsQuestion();
return;
}

let op='+';

if(mode==='subtract'){
op='-';
}

if(mode==='mixed'){
op=Math.random()>0.5?'+':'-';
}

let a,b;

if(level===1){

if(op==='+'){

a=rnd(1,19);
b=rnd(1,20-a);

}else{

a=rnd(1,20);
b=rnd(1,a);
}
}

if(level===2){

a=rnd(10,99);
b=rnd(1,9);

if(op==='-' && b>a){
[a,b]=[b,a];
}
}

if(level===3){

a=rnd(10,99);
b=rnd(10,99);

if(op==='-' && b>a){
[a,b]=[b,a];
}
}

currentAnswer=op==='+'?a+b:a-b;

currentData={a,b,op,answer:currentAnswer};

questionEl.textContent=`${a} ${op} ${b} = ?`;

renderAnswers(answers(currentAnswer));
}

function emoji(ok){

const el=document.createElement('div');

el.className='emoji-popup';

el.textContent=ok?'🎉':'😢';

document.body.appendChild(el);

setTimeout(()=>{
el.remove();
},600);
}

function check(v,btn){

if(v===currentAnswer){

streak++;
btn.classList.add('correct');
emoji(true);

}else{

streak=0;
btn.classList.add('wrong');

if(mode!=='objects'){
retryQueue.push(currentData);
}

emoji(false);
}

streakEl.textContent=streak;

setTimeout(nextQuestion,600);
}

setLanguage('ru');
updateButtons();
nextQuestion();
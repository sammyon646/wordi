let levels = [];
let currentLevel = 0;
let letters = [];
let validWords = [];
let currentWord = "";
let found = [];
let currentLang = localStorage.getItem("lang") || "ru";

const levelTitle = document.getElementById("levelTitle");
const currentWordDiv = document.getElementById("currentWord");
const foundWordsDiv = document.getElementById("foundWords");
const canvas = document.getElementById("circleCanvas");
const ctx = canvas.getContext("2d");
const langSelect = document.getElementById("langSelect");

let letterPositions = [];
let selectedIndices = [];

// Установка языка
langSelect.value = currentLang;
langSelect.addEventListener("change", ()=>{
  currentLang = langSelect.value;
  localStorage.setItem("lang", currentLang);
  loadLevel(currentLevel);
});

// Загрузка уровней
async function loadLevels() {
  const res = await fetch("levels.json");
  levels = await res.json();
  loadLevel(currentLevel);
}

function loadLevel(index){
  currentLevel = index;
  const lvl = levels[index].languages[currentLang];
  letters = [...lvl.letters];
  validWords = lvl.words;
  found = [];
  selectedIndices = [];
  currentWord = "";
  updateCurrentWord("");
  foundWordsDiv.innerHTML = "";
  levelTitle.innerText = (currentLang==="ru"?"Уровень ":"Level ") + (index+1);
  layoutCircle();
}

// Раскладка букв по кругу
function layoutCircle(){
  const w = canvas.width = canvas.offsetWidth;
  const h = canvas.height = canvas.offsetHeight;
  const cx = w/2;
  const cy = h/2;
  const r = Math.min(w,h)/2 - 40;
  const n = letters.length;
  letterPositions = [];

  ctx.clearRect(0,0,w,h);
  ctx.font = "24px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for(let i=0;i<n;i++){
    const angle = (i/(n))*2*Math.PI - Math.PI/2;
    const x = cx + r*Math.cos(angle);
    const y = cy + r*Math.sin(angle);
    letterPositions.push({x,y});
  }
  redraw();
}

// Отрисовка всего круга с линиями
function redraw(){
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0,0,w,h);

  // линии между выбранными буквами
  if(selectedIndices.length>1){
    ctx.strokeStyle="#4b7bec";
    ctx.lineWidth=4;
    ctx.beginPath();
    for(let i=0;i<selectedIndices.length;i++){
      const pos = letterPositions[selectedIndices[i]];
      if(i===0) ctx.moveTo(pos.x,pos.y);
      else ctx.lineTo(pos.x,pos.y);
    }
    ctx.stroke();
  }

  // буквы
  letterPositions.forEach((pos,i)=>{
    drawLetter(pos.x,pos.y,letters[i],selectedIndices.includes(i));
  });
}

// Рисуем букву
function drawLetter(x,y,l,selected){
  ctx.fillStyle = selected ? "#4b7bec" : "#fff";
  ctx.strokeStyle = "#4b7bec";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x,y,25,0,2*Math.PI);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = selected ? "#fff" : "#4b7bec";
  ctx.fillText(l,x,y);
}

// События мыши и тача
let isDragging = false;
canvas.addEventListener("pointerdown", e=>{
  isDragging = true;
  handlePointer(e);
});
canvas.addEventListener("pointermove", e=>{
  if(isDragging) handlePointer(e);
});
canvas.addEventListener("pointerup", e=>{
  isDragging = false;
  checkWord();
});
canvas.addEventListener("pointerleave", e=>{
  if(isDragging){ isDragging=false; checkWord(); }
});

function handlePointer(e){
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  letterPositions.forEach((pos,i)=>{
    const dx = x - pos.x;
    const dy = y - pos.y;
    if(Math.sqrt(dx*dx + dy*dy)<25 && !selectedIndices.includes(i)){
      selectedIndices.push(i);
      currentWord += letters[i];
      updateCurrentWord(currentWord);
      redraw();
    }
  });
}

// Очистка слова
document.getElementById("clearBtn").onclick = ()=>{
  selectedIndices = [];
  currentWord = "";
  updateCurrentWord(currentWord);
  redraw();
}

// Перемешивание
document.getElementById("shuffleBtn").onclick = ()=>{
  letters.sort(()=>Math.random()-0.5);
  layoutCircle();
}

// Проверка слова
function checkWord(){
  if(currentWord && validWords.includes(currentWord) && !found.includes(currentWord)){
    found.push(currentWord);
    foundWordsDiv.innerHTML = found.join(", ");
  }
  currentWord="";
  selectedIndices=[];
  updateCurrentWord(currentWord);
  redraw();
}

function updateCurrentWord(w){ currentWordDiv.innerText = w; }

loadLevels();

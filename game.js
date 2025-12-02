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
const circleDiv = document.getElementById("circle");
const langSelect = document.getElementById("langSelect");

// Установка выбранного языка
langSelect.value = currentLang;
langSelect.addEventListener("change", ()=>{
  currentLang = langSelect.value;
  localStorage.setItem("lang", currentLang);
  loadLevel(currentLevel);
});

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
  renderCircle();
  updateCurrentWord("");
  foundWordsDiv.innerHTML = "";
  levelTitle.innerText = (currentLang==="ru"?"Уровень ":"Level ") + (index+1);
}

// Отображение круга букв
function renderCircle(){
  circleDiv.innerHTML = "";
  letters.forEach(l=>{
    const btn = document.createElement("button");
    btn.innerText = l;
    btn.onclick = ()=> addLetter(l);
    circleDiv.appendChild(btn);
  });
}

function addLetter(l){
  currentWord += l;
  updateCurrentWord(currentWord);
}

function updateCurrentWord(w){
  currentWordDiv.innerText = w;
}

// Очистка текущего слова
document.getElementById("clearBtn").onclick = ()=>{
  currentWord = "";
  updateCurrentWord(currentWord);
}

// Перемешать буквы
document.getElementById("shuffleBtn").onclick = ()=>{
  letters.sort(()=>Math.random()-0.5);
  renderCircle();
}

// Проверка слова при двойном клике
circleDiv.addEventListener("dblclick", ()=>{
  if(validWords.includes(currentWord) && !found.includes(currentWord)){
    found.push(currentWord);
    foundWordsDiv.innerHTML = found.join(", ");
    currentWord = "";
    updateCurrentWord("");
  } else {
    currentWord = "";
    updateCurrentWord("");
  }
})

loadLevels();

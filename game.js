const letters = ["О", "Р", "Л", "А"];
const validWords = ["ОРАЛ", "РОЛА", "ЛОР", "ОРЛА", "ОР", "ЛА"];

document.getElementById("letters").innerHTML = letters.join(" ");

document.getElementById("checkBtn").onclick = () => {
    const w = document.getElementById("wordInput").value.toUpperCase();
    if (validWords.includes(w)) {
        addWord(w);
    }
};

function addWord(word) {
    const div = document.getElementById("foundWords");
    div.innerHTML += `<div>${word}</div>`;
}

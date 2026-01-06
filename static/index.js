import palavras from '../palavras/saida.js';

window.guess = [];
window.word = "";
let count = 0;
let erros = 0;
let arr = [];
let flag = 0;

document.addEventListener("DOMContentLoaded", () => {
  alert("Bem-vindo ao Wordle! Tente adivinhar a palavra de 5 letras. Você tem 5 vidas. Boa sorte!");
  window.word = getRandomWord();
  console.log(`Palavra sorteada: ${window.word}`);

  for (let i = 0; i < 5; i++) {
    const tile = document.getElementById(`tile-${i}`);
    if (tile) tile.textContent = "";
  }
});

function CharacterInfo(){
    this.in_word = 0;
    this.correct_idx = 0;
}

CharacterInfo.prototype.isCharInWord = function(letter, word) {return word.includes(letter);}

function getRandomWord(){
    let num = Math.floor(Math.random()* palavras.length);
    return palavras[num];
}

function applyGuess(arr){
  arr.forEach(({ char, scoring }, i) => {
    console.log(
      `Char: ${char} | In word: ${scoring.in_word} | Correct idx: ${scoring.correct_idx} | Index: ${i}`
    );

    const botao = [...document.querySelectorAll(".key")]
      .find(b => b.textContent.trim() === char.toUpperCase());

    if (!botao) return;

    const tile = document.getElementById(`tile-${i}`);

    if (scoring.correct_idx) {
      tile.classList.add("correct");
      botao.style.backgroundColor = "green";
    } 
    else if (scoring.in_word) {
      tile.classList.add("partial");
      botao.style.backgroundColor = "yellow";
    } 
    else {
      tile.classList.add("wrong");
      botao.style.backgroundColor = "grey";
    }
  });
}

function SeeGuess(guess, word){
    if (guess.length !== 5) return; 
    else if (guess === word) return true;
    for (let i = 0; i < guess.length; i++) {
        const charInfo = new CharacterInfo();
        charInfo.in_word = charInfo.isCharInWord(guess[i], word);
        charInfo.correct_idx = guess[i] === word[i];
        arr.push({
            char: guess[i],
            scoring: charInfo
        });
    };
    return false;
}

document.querySelectorAll(".key").forEach(botao => {
  botao.addEventListener("click", () => {
    if (botao.classList.contains("enter")) { 
      if (SeeGuess(window.guess.join(""), window.word)) {
            applyGuess(arr);
            alert("Parabéns! Você acertou a palavra!");
            setTimeout(() => {  
            location.reload();
            },3000); // Aguarda 3 segundos antes de recarregar
            return;
        }
      if (window.guess.length < 5) {
            alert("Palavra incompleta!");
            return;
          }

      applyGuess(arr);
      arr = []; // limpa o array para a próxima tentativa
      console.log(`Tentativa: ${window.guess.join("")} | Palavra: ${window.word}`);
      window.guess = [];
      count = 0;
      alert("Tente novamente!");
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
            document.getElementById(`tile-${i}`).classList.remove("correct", "partial", "wrong");
            document.getElementById(`tile-${i}`).textContent = "";
          }}, 2000); // Aguarda 2 segundos antes de limpar os tiles
      kill_hearts();
      return;
      }
    else if (botao.classList.contains("backspace")) {
      if (window.guess.length > 0) {
        window.guess.pop();
        count--;
        document.getElementById(`tile-${count}`).textContent = "";
      }
    }       
    else if (window.guess.length < 5) {
      window.guess.push(botao.textContent.trim().toLowerCase());
      document.getElementById(`tile-${count}`).textContent = window.guess[window.guess.length - 1].toUpperCase();
      count++;
    }
  });
});

// captura teclas do teclado físico
document.addEventListener("keydown", function(event) { 
  if (event.key === "Enter") {
  document.querySelector(".key.enter")?.click();
  return;
}
  if (event.key === "Backspace") {
    document.querySelector(".key.backspace")?.click();
    return;
  }
  const tecla = event.key.toUpperCase(); // 👈 FALTAVA ISSO
  const botao = [...document.querySelectorAll(".key")]
    .find(b => b.textContent.toUpperCase() === tecla);
  if (botao) botao.click();
});

function kill_hearts() {
   ++erros;
  if (erros <= 5){
    console.log(`Erros: ${erros}`);
    const heart = document.getElementById(`heart-${erros}`);
    if (heart) {heart.style.visibility = "hidden"; } // fica invisível, mas o espaço continua lá
  }
  if (erros == 5) {
    alert("Você perdeu todas as suas vidas!");
    setTimeout(() => {
      location.reload();
    },3000); // Aguarda 4 segundos antes de recarregar
  } 
};

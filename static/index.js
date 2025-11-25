import palavras from '/palavras/saida.js';
//criei as variáveis globais guess e word
window.guess = [];
window.word = "";
let count = 0;
let erros = 5;


//iniciar o jogo ao carregar a página
window.onload = async function() { 
    alert("Bem-vindo ao Wordle! Tente adivinhar a palavra de 5 letras. Você tem 6 vidas. Boa sorte!");
    window.word = getRandomWord();
    console.log(`Palavra sorteada: ${window.word}`);
   };


function CharacterInfo(){
    this.in_word = 0;
    this.correct_idx = 0;
}

CharacterInfo.prototype.isCharInWord = function(letter, word) {return word.includes(letter);}

function getRandomWord(){
    let num = Math.floor(Math.random()* palavras.length);
    return palavras[num];
}
//se clicar em qualquer botão ou tecla cai aqui
document.querySelectorAll(".flex-item").forEach(botao => {
  botao.addEventListener("click", () => {
    
    if (botao.textContent.trim() === "Enter") {

        if (window.guess.length < 5) {
        alert(`A palavra deve ter 5 letras!`);
        return false;
        }
        //compara string da guess com a word
        if (window.guess.length === 5) {
            if (window.guess.join("")=== window.word) {
            alert("Parabéns! Você acertou a palavra!");
            //dá refresh na página para reiniciar o jogo
            location.reload();
            return true;
        }
        else {
            alert("Palavra incorreta!");
            kill_hearts();
            const arr = [];

            for (let i = 0; i < window.guess.length; i++) {
                const charInfo = new CharacterInfo();
                charInfo.in_word = charInfo.isCharInWord(window.guess[i], window.word);
                charInfo.correct_idx = window.guess[i] === window.word[i];

                arr.push({
                    char: window.guess[i],
                    scoring: charInfo
                });
            };
            arr.forEach(({char, scoring }, i) => {

                const botao = [...document.querySelectorAll(".flex-item")].find(b => b.textContent.trim() === char.toUpperCase());
                if (!botao) return;
                
                if (scoring.correct_idx){  
                    document.getElementById(`${i}`).style.backgroundColor = "green";
                    botao.style.backgroundColor = "green";
                    }
                else if (scoring.in_word){
                    document.getElementById(`${i}`).style.backgroundColor = "yellow";
                    botao.style.backgroundColor = "yellow";
                }
                else {
                    document.getElementById(`${i}`).style.backgroundColor = "grey";
                    botao.style.backgroundColor = "grey";
                }
                

            });    

            window.guess = [];
            count = 0;
            alert("Tente novamente!");
            for (let i = 0; i < 5; i++) {
                document.getElementById(`${i}`).style.backgroundColor = "lightblue";
                document.getElementById(`${i}`).textContent = "";
            }
            return;
        }

        }
    } 
    else if (botao.textContent.trim() === "Backspace") {

      //alert("Você clicou em BACKSPACE");
      if (window.guess.length > 0) {
        window.guess.pop();
        count--;
        document.getElementById(`${count}`).textContent = "";
        //document.getElementById(`${count}`).style.backgroundColor = "white";
      }
    }   
        
        
    else if (window.guess.length < 5) {
      window.guess.push(botao.textContent.trim().toLowerCase());
      document.getElementById(`${count}`).textContent = window.guess[window.guess.length - 1].toUpperCase();
      //document.getElementById(`${count}`).style.backgroundColor = "grey";
      count++;
    }
    //alert(`Palpite atual: ${window.guess}`);
  });
});
 

// captura teclas do teclado físico
document.addEventListener("keydown", function(event) {
  const tecla = event.key.toUpperCase();
  //alert(`Você pressionou a tecla: ${tecla}`);

  // procura botão correspondente
  const botao = [...document.querySelectorAll(".flex-item")]
    .find(b => b.textContent.toUpperCase() === tecla);
   //alert(`Botão ${botao.textContent} foi clicado!`);
  if (botao) botao.click();

});


function kill_hearts() {
  if (erros <= 9 ) {
    const heart = document.getElementById(`${erros}`);
    if (heart) {
      heart.textContent = "X";
      heart.style.backgroundColor = "red";
    }
    erros+=1;
    }
  else if (erros >= 9) {
    alert("Você perdeu todas as suas vidas!");
    const gameStatusElement = document.getElementById("game_status");
    if (gameStatusElement) {
      gameStatusElement.innerHTML = "Você perdeu!";
    }
    setTimeout(() => {
      location.reload();
    },4000); // Aguarda 4 segundos antes de recarregar
    
  }
}
const p1Button = document.querySelector('#p1Button');
const p2Button = document.querySelector('#p2Button');
const p1Display = document.querySelector('#p1Display');
const p2Display = document.querySelector('#p2Display');
const resetButton = document.querySelector('#reset');
const winningScoreSelect = document.querySelector('#playTo');
const phraseSpan = document.querySelector('#phrase');
const servingDisplay = document.querySelector('#servingDisplay');
const player1NameInput = document.querySelector("#player1Name")
const player2NameInput = document.querySelector("#player2Name")
const winningPhrase = ' wins!';
const startServingSelect = document.querySelector("#startServing")
const enabledSoundSelect = document.querySelector("#enabledSound")



let numberOfServesMap = {11: 2, 21: 5}

let playersName = ["Player 1", "Player 2"]
let playersScore = [0, 0]
let playersDisplay = [p1Display, p2Display]

let p1Score = 0;
let p2Score = 0;
let winningScore = 11;
let isGameOver = false;
let winningPhrase1 = 'Player One wins!';
let numberOfServes = 2;
let startingPlayer = 0;


function whoServe(){
    totalScore = playersScore[0] + playersScore[1]

    if (totalScore >= ((winningScore * 2) - 2)){
        return totalScore % 2
    }

    return parseInt(totalScore / numberOfServes) % 2
}


function checkEnd(){
    return (Math.max(...playersScore) >= winningScore) && Math.abs(playersScore[0] - playersScore[1]) > 1
}

function updateServingPerson(){
    servingDisplay.textContent = playersName[whoServe()];
}

function addScoreToPlayer(player) {
    if (isGameOver){
        return
    }

    playersScore[player] += 1;
    p1Display.textContent = playersScore[0];
    p2Display.textContent = playersScore[1];

    if (checkEnd()){
        isGameOver = true;
        p1Button.disabled = true;
        p2Button.disabled = true;
        phraseSpan.textContent = playersName[player] + winningPhrase;
        playersDisplay[player].classList.add('has-text-success');
        playersDisplay[(player + 1) % 2].classList.add('has-text-danger');
        return
    }

    updateServingPerson()
}

document.addEventListener('keydown', function(event) {
  // Get the key code
  var keyCode = event.keyCode || event.which;
  console.log(keyCode);
  // Handle specific key presses
  if (keyCode === 37) {
    addScoreToPlayer(0)
  } else if (keyCode === 39) {
    addScoreToPlayer(1)
  }
});

function updateName(){
    playersName = [player1NameInput.value, player2NameInput.value]
    servingDisplay.textContent = playersName[startingPlayer];
    p1Button.textContent = "+1 " + playersName[0];
    p2Button.textContent = "+1 " + playersName[1];
    startServingSelect.options[0].textContent = playersName[0]
    startServingSelect.options[1].textContent = playersName[1]
}


startServingSelect.addEventListener('change', function () {
    startingPlayer = parseInt(this.value);
    reset();
});


player1NameInput.addEventListener('input', updateName);
player2NameInput.addEventListener('input', updateName);


p1Button.addEventListener('click', function () {
    addScoreToPlayer(0)
});

p2Button.addEventListener('click',  function () {
   addScoreToPlayer(1)
});

winningScoreSelect.addEventListener('change', function () {
	winningScore = parseInt(this.value);
	numberOfServes = numberOfServesMap[winningScore]
	reset();
});

resetButton.addEventListener('click', reset);

function reset() {
	isGameOver = false;
	playersScore = [0, 0];
	p1Display.textContent = 0;
	p2Display.textContent = 0;
	p1Display.classList.remove('has-text-success', 'has-text-danger');
	p2Display.classList.remove('has-text-success', 'has-text-danger');
	p1Button.disabled = false;
	servingDisplay.textContent = playersName[startingPlayer];
	p2Button.disabled = false;
	phraseSpan.disabled = true;
	phraseSpan.textContent = '';
}

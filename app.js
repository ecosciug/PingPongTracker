const p1Button = document.querySelector('#p1Button');
const p2Button = document.querySelector('#p2Button');
const p1Display = document.querySelector('#p1Display');
const p2Display = document.querySelector('#p2Display');
const resetButton = document.querySelector('#reset');
const winningScoreSelect = document.querySelector('#playTo');
const phraseSpan = document.querySelector('#phrase');

let p1Score = 0;
let p2Score = 0;
let winningScore = 11;
let isGameOver = false;
let winningPhrase1 = 'Player One wins!';
let winningPhrase2 = 'Player Two wins!';


function checkEnd(){
    return Math.abs(p1Score - p2Score) > 1
}

function addScoreToPlayer1() {
	if (!isGameOver) {
		p1Score += 1;
		if (p1Score >= winningScore && checkEnd()) {
			isGameOver = true;
			p1Display.classList.add('has-text-success');
			p2Display.classList.add('has-text-danger');
			p1Button.disabled = true;
			p2Button.disabled = true;
			phraseSpan.textContent = winningPhrase1;
		}
		p1Display.textContent = p1Score;
	}
}

function addScoreToPlayer2() {
	if (!isGameOver) {
		p2Score += 1;
		if (p2Score >= winningScore && checkEnd()) {
			isGameOver = true;
			p2Display.classList.add('has-text-success');
			p1Display.classList.add('has-text-danger');
			p1Button.disabled = true;
			p2Button.disabled = true;
			phraseSpan.textContent = winningPhrase2;
		}
		p2Display.textContent = p2Score;
	}
}

document.addEventListener('keydown', function(event) {
  // Get the key code
  var keyCode = event.keyCode || event.which;
  console.log(keyCode);
  // Handle specific key presses
  if (keyCode === 37) {
    addScoreToPlayer1()
  } else if (keyCode === 39) {
    addScoreToPlayer2()
  }
});

p1Button.addEventListener('click', addScoreToPlayer1);

p2Button.addEventListener('click', addScoreToPlayer2);

winningScoreSelect.addEventListener('change', function () {
	winningScore = parseInt(this.value);
	reset();
});

resetButton.addEventListener('click', reset);

function reset() {
	isGameOver = false;
	p1Score = 0;
	p2Score = 0;
	p1Display.textContent = 0;
	p2Display.textContent = 0;
	p1Display.classList.remove('has-text-success', 'has-text-danger');
	p2Display.classList.remove('has-text-success', 'has-text-danger');
	p1Button.disabled = false;
	p2Button.disabled = false;
	phraseSpan.disabled = true;
	phraseSpan.textContent = '';
}

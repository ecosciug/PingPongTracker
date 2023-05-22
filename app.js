const p1Button = document.querySelector('#p1Button');
const p2Button = document.querySelector('#p2Button');
const p1Display = document.querySelector('#p1Display');
const p2Display = document.querySelector('#p2Display');
const resetButton = document.querySelector('#reset');
const winningScoreSelect = document.querySelector('#playTo');
const servingDisplay = document.querySelector('#servingDisplay');
const player1NameInput = document.querySelector("#player1Name")
const player2NameInput = document.querySelector("#player2Name")
const winningPhrase = ' wins!';
const startServingSelect = document.querySelector("#startServing")
const enabledSoundSelect = document.querySelector("#enabledSound")

let numberOfServesMap = { 11: 2, 21: 5 }

let playersName = ["Player 1", "Player 2"]
let playersScore = [0, 0]
let playersDisplay = [p1Display, p2Display]
let playersColour = ["#0d6efd", "#dc3545"]

let p1Score = 0;
let p2Score = 0;
let winningScore = 11;
let isGameOver = false;
let numberOfServes = 2;
let startingPlayer = 0;

let audioContext = null

window.onload = onLoad;

let announcers = []

function onLoad() {
    reset()

    fetch('https://raw.githubusercontent.com/ecosciug/PingPongTracker/master/sounds/female.json')
        .then(response => response.json())
        .then(data => {
            announcers.push(data.res)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    fetch('https://raw.githubusercontent.com/ecosciug/PingPongTracker/master/sounds/male.json')
        .then(response => response.json())
        .then(data => {
            announcers.push(data.res)
        })
        .catch(error => {
            console.error('Error:', error);
        });

    audioContext = new AudioContext();
}

function whoServe() {
    totalScore = playersScore[0] + playersScore[1]

    if (totalScore >= ((winningScore * 2) - 2)) {
        return totalScore % 2
    }

    return parseInt(totalScore / numberOfServes) % 2
}


function checkEnd() {
    return (Math.max(...playersScore) >= winningScore) && Math.abs(playersScore[0] - playersScore[1]) > 1
}

function updateServingPerson() {
    server = whoServe()
    servingDisplay.textContent = playersName[server] + " is serving!";
    servingDisplay.style.backgroundColor = playersColour[server];
}

function addScoreToPlayer(player) {
    if (isGameOver) {
        reset()
        return
    }

    playersScore[player] += 1;
    p1Display.textContent = playersScore[0];
    p2Display.textContent = playersScore[1];

    if (checkEnd()) {
        isGameOver = true;
        p1Button.disabled = true;
        p2Button.disabled = true;
        servingDisplay.textContent = playersName[player] + winningPhrase;
        servingDisplay.style.backgroundColor = playersColour[startingPlayer]
        servingDisplay.style.color = "white"
        playersDisplay[player].classList.add('has-text-success');
        playersDisplay[(player + 1) % 2].classList.add('has-text-danger');
        return
    }

    updateServingPerson()
    announceState()
}

document.addEventListener('keydown', function (event) {
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

p1Button.addEventListener('click', function () {
    addScoreToPlayer(0)
});

p2Button.addEventListener('click', function () {
    addScoreToPlayer(1)
});

function updateName() {
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
    p1Button.textContent = "+1 " + playersName[0];
    p2Button.textContent = "+1 " + playersName[1];
    servingDisplay.textContent = playersName[startingPlayer] + " is serving!";
    servingDisplay.style.backgroundColor = playersColour[startingPlayer]
    servingDisplay.style.color = "white"
    p2Button.disabled = false;
}

function announceState() {
    var serving = whoServe()
    var other = serving == 0 ? 1 : 0

    var announcerSource = announcers[serving]
    var firstScore = numberToDigitSounds(playersScore[serving])
    var secondScore = numberToDigitSounds(playersScore[other])

    const soundPromises = [];
    firstScore.forEach(sound =>
        soundPromises.push(new Promise((resolve, reject) => {
            let audioData = base64ToArrayBuffer(announcerSource[sound])
            audioContext.decodeAudioData(audioData, buffer => {
                resolve(buffer);
            }, error => {
                reject(error);
            })
        }))
    )
    secondScore.forEach(sound =>
        soundPromises.push(new Promise((resolve, reject) => {
            let audioData = base64ToArrayBuffer(announcerSource[sound])
            audioContext.decodeAudioData(audioData, buffer => {
                resolve(buffer);
            }, error => {
                reject(error);
            })
        }))
    )

    Promise.all(soundPromises)
        .then(buffers => {
            playSoundsSequentially(buffers);
        })
        .catch(error => {
            console.error('Error decoding audio data:', error);
        });
}

function playSoundsSequentially(buffers) {
    buffer = buffers.reduce((combined, buffer) => {
        if (combined == null) return buffer

        var numberOfChannels = combined.numberOfChannels;
        var tmp = audioContext.createBuffer(numberOfChannels, (combined.length + buffer.length), combined.sampleRate);
        for (var i = 0; i < numberOfChannels; i++) {
            var channel = tmp.getChannelData(i);
            channel.set(combined.getChannelData(i), 0);
            channel.set(buffer.getChannelData(i), combined.length);
        }
        return tmp;
    })

    playSound(buffer)
}

function numberToDigitSounds(number) {
    number = number % 100

    if (number < 21) {
        return [number]
    }

    lowDigit = number % 10

    if (lowDigit == 0) {
        return [number]
    }

    highDigit = number - lowDigit
    return [highDigit, lowDigit]
}

function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

function playSound(buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}

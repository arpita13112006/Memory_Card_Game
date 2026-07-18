const difficultyScreen = document.getElementById("difficulty-screen");
const gameScreen = document.getElementById("game-screen");

const easyBtn = document.getElementById("easy-level");
const mediumBtn = document.getElementById("medium-level");
const hardBtn = document.getElementById("hard-level");

const gameBoard = document.getElementById("game-board");

const movesText = document.getElementById("moves");
const timerText = document.getElementById("timer");

const playerScoreText = document.getElementById("player-score");
const computerScoreText = document.getElementById("computer-score");
const turnText = document.getElementById("turn-text");

const restartBtn = document.getElementById("restart-btn");
const backBtn = document.getElementById("game-back");


// =======================
// VARIABLES
// =======================

let cards = [];

let firstCard = null;
let secondCard = null;

let lockBoard = false;

let moves = 0;

let matchedPairs = 0;

let playerScore = 0;
let computerScore = 0;

let currentTurn = "player";

let timer = 0;
let timerInterval = null;




// =======================
// EMOJIS
// =======================

const easyEmojis = [
"🐶","🐶",
"🐱","🐱",
"🐼","🐼",
"🐸","🐸",
"🐵","🐵",
"🦊","🦊",
"🐰","🐰",
"🐻","🐻"
];

const mediumEmojis = [
"🐶","🐶",
"🐱","🐱",
"🐼","🐼",
"🐸","🐸",
"🐵","🐵",
"🦊","🦊",
"🐰","🐰",
"🐻","🐻",
"🐯","🐯",
"🦁","🦁",
"🐨","🐨",
"🐷","🐷"
];

const hardEmojis = [
"🐶","🐶",
"🐱","🐱",
"🐼","🐼",
"🐸","🐸",
"🐵","🐵",
"🦊","🦊",
"🐰","🐰",
"🐻","🐻",
"🐯","🐯",
"🦁","🦁",
"🐨","🐨",
"🐷","🐷",
"🐭","🐭",
"🐹","🐹",
"🐮","🐮",
"🐔","🐔",
"🦄","🦄",
"🐙","🐙"
];


// =======================
// SHUFFLE
// =======================

function shuffle(array){

    array.sort(() => Math.random() - 0.5);

}


// =======================
// DIFFICULTY
// =======================

easyBtn.addEventListener("click",function(){

    startGame(easyEmojis,4,"easy");

});

mediumBtn.addEventListener("click",function(){

    startGame(mediumEmojis,6,"medium");

});

hardBtn.addEventListener("click",function(){

    startGame(hardEmojis,6,"hard");

});


// =======================
// START GAME
// =======================

function startGame(emojiArray,columns,difficulty){

    difficultyScreen.style.display="none";

    gameScreen.style.display="block";

    moves=0;
    matchedPairs=0;

    firstCard=null;
    secondCard=null;

    lockBoard=false;

    movesText.textContent=0;

    playerScore=0;
    computerScore=0;

    playerScoreText.textContent=0;
    computerScoreText.textContent=0;

    currentTurn="player";

    turnText.textContent="😊 Your Turn";

    createBoard(emojiArray,columns);
    startTimer();

}
// =======================
// CREATE BOARD
// =======================

function createBoard(emojiArray, columns,difficulty){

    cards = [...emojiArray];

    shuffle(cards);

    gameBoard.innerHTML = "";
    clearInterval(timerInterval);

moves = 0;
matchedPairs = 0;

    gameBoard.style.gridTemplateColumns = `repeat(${columns},100px)`;
//gameBoard.className = difficulty;
    cards.forEach(function(emoji){

        const card = document.createElement("div");

        card.classList.add("card-box");

        card.textContent = "?";

        card.dataset.emoji = emoji;

        card.dataset.state = "hidden";

        card.addEventListener("click", flipCard);

        gameBoard.appendChild(card);

    });

}


// =======================
// FLIP CARD
// =======================

function flipCard(){

    const card = this;

    if(currentTurn !== "player") return;

    if(lockBoard) return;

    if(card.dataset.state !== "hidden") return;

    card.textContent = card.dataset.emoji;

    card.dataset.state = "open";

    if(firstCard == null){

        firstCard = card;

        return;

    }

    secondCard = card;

    lockBoard = true;

    moves++;

    movesText.textContent = moves;

    checkMatch();

}



// =======================
// CHECK MATCH
// =======================

function checkMatch(){

    if(firstCard.dataset.emoji === secondCard.dataset.emoji){

        firstCard.dataset.state = "matched";

        secondCard.dataset.state = "matched";

        matchedPairs++;

        playerScore++;

        playerScoreText.textContent = playerScore;

        resetTurn();

        checkWinner();

    }

    else{

        setTimeout(function(){

            firstCard.textContent = "?";

            secondCard.textContent = "?";

            firstCard.dataset.state = "hidden";

            secondCard.dataset.state = "hidden";

            resetTurn();

            currentTurn = "computer";

            turnText.textContent = "🤖 Computer Thinking...";

            setTimeout(computerMove,1000);

        },800);

    }

}



// =======================
// RESET TURN
// =======================

function resetTurn(){

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}

// =======================
// COMPUTER MOVE
// =======================

function computerMove(){

    // Agar game khatam ho gaya ho
    checkWinner();

    // Sirf hidden cards nikalo
    const hiddenCards = [];

    document.querySelectorAll(".card-box").forEach(function(card){

        if(card.dataset.state === "hidden"){
            hiddenCards.push(card);
        }

    });

    // Hidden cards 2 se kam bache
    if(hiddenCards.length < 2){
        return;
    }

    // First Random Card
    const firstIndex =
    Math.floor(Math.random()*hiddenCards.length);

    const first = hiddenCards[firstIndex];

    first.textContent = first.dataset.emoji;
    first.dataset.state = "open";

    // Second Random Card
    let secondIndex;

    do{

        secondIndex =
        Math.floor(Math.random()*hiddenCards.length);

    }while(secondIndex === firstIndex);

    const second = hiddenCards[secondIndex];

    setTimeout(function(){

        second.textContent = second.dataset.emoji;
        second.dataset.state = "open";

        if(first.dataset.emoji === second.dataset.emoji){

            first.dataset.state = "matched";
            second.dataset.state = "matched";

            computerScore++;
            computerScoreText.textContent = computerScore;

            matchedPairs++;

            checkWinner();

            // Computer fir se khelega
            setTimeout(computerMove,800);

        }
        else{

            setTimeout(function(){

                first.textContent="?";
                second.textContent="?";

                first.dataset.state="hidden";
                second.dataset.state="hidden";

                currentTurn="player";

                turnText.textContent="😊 Your Turn";

            },800);

        }

    },600);

}

// =======================
// CHECK WINNER
// =======================

function checkWinner(){

    const totalPairs = cards.length / 2;

    if(matchedPairs != totalPairs){
        return;
    }

    clearInterval(timerInterval);

    setTimeout(function(){

        if(playerScore > computerScore){

            alert("🎉 Congratulations!\n\nYou Won 🏆");

        }
        else if(computerScore > playerScore){

            alert("🤖 Computer Won!\n\nBetter Luck Next Time 😊");

        }
        else{

            alert("🤝 Match Draw!");

        }

    },500);
    lockBoard = true;

}

// =======================
// TIMER
// =======================

function startTimer(){

    clearInterval(timerInterval);

    timer = 0;

    timerText.textContent = "00:00";

    timerInterval = setInterval(function(){

        timer++;

        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;

        if(minutes < 10){
            minutes = "0" + minutes;
        }

        if(seconds < 10){
            seconds = "0" + seconds;
        }

        timerText.textContent = minutes + ":" + seconds;

    },1000);

}



// =======================
// RESTART
// =======================

restartBtn.addEventListener("click",function(){

    if(cards.length==16){

        startGame(easyEmojis,4);

    }

    else if(cards.length==24){

        startGame(mediumEmojis,6);

    }

    else{

        startGame(hardEmojis,6);

    }

});

// =======================
// BACK
// =======================

backBtn.addEventListener("click",function(){

    clearInterval(timerInterval);

    gameScreen.style.display="none";

    difficultyScreen.style.display="block";

});
// =======================
// MEDIUM
// =======================

mediumBtn.addEventListener("click",function(){

    startGame(mediumEmojis,6);

});

// =======================
// HARD
// =======================

hardBtn.addEventListener("click",function(){

    startGame(hardEmojis,6);

});


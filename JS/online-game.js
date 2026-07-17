// =======================
// SOCKET
// =======================

const socket = io();


// =======================
// ROOM CODE
// =======================

const roomCode = localStorage.getItem("roomCode");
const role = localStorage.getItem("role");

const restartBtn =
document.getElementById("restart-btn");

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let moves = 0;
let myTurn = false;

let seconds = 0;
let timerInterval = null;

console.log("Room Code :", roomCode);


// =======================
// LOAD BOARD
// =======================
socket.emit("rejoinRoom",{
    roomCode: roomCode,
    role: role
});

socket.emit("loadBoard", roomCode);


// =======================
// RECEIVE BOARD
// =======================

socket.on("loadBoard", function(board){

    createBoard(board);

    startTimer();

});

function createBoard(board){

    const gameBoard = document.getElementById("game-board");

    gameBoard.innerHTML = "";

    board.forEach(function(emoji, index){

        const card = document.createElement("div");

        card.classList.add("card-box");

        card.textContent = "?";

        card.dataset.emoji = emoji;

        card.dataset.state = "hidden";

        card.addEventListener("click", function(){

            console.log("Card Clicked");
            console.log("myTurn =", myTurn);

              if(!myTurn){

        return;

    }

    if(lockBoard){

        return;

    }

    if(card.dataset.state === "matched"){

        return;

    }

    if(card === firstCard){

        return;

    }

    console.log("Sending Flip :", index);

    socket.emit("flipCard",{

        roomCode: roomCode,

        index: index

    });

});

        gameBoard.appendChild(card);

    });

}

socket.on("flipCard", function(index){

    const cards = document.querySelectorAll(".card-box");

    const card = cards[index];

    card.textContent = card.dataset.emoji;

    if(firstCard === null){

        firstCard = card;

    }

    else if(secondCard === null){

        secondCard = card;

        checkMatch();

    }

});

function checkMatch(){

    lockBoard = true;

    if(firstCard.dataset.emoji === secondCard.dataset.emoji){

        firstCard.dataset.state = "matched";

        secondCard.dataset.state = "matched";

        resetTurn();

    }

    else{

        setTimeout(function(){

            firstCard.textContent = "?";

            secondCard.textContent = "?";

            resetTurn();

        },1000);

    }

}

function resetTurn(){

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}

socket.on("hideCards", function(data){

    const cards = document.querySelectorAll(".card-box");

    cards[data.first].textContent = "?";

    cards[data.second].textContent = "?";

});
socket.on("matchFound", function(data){

    const cards = document.querySelectorAll(".card-box");

    cards[data.first].dataset.state = "matched";

    cards[data.second].dataset.state = "matched";

});
socket.on("turnUpdate", function(playerId){

    console.log("My Socket :", socket.id);
console.log("Turn Player :", playerId);

    if(socket.id === playerId){

        myTurn = true;
        document.getElementById("turn-text").textContent = "🟢 Your Turn";

    }else{

        myTurn = false;
        document.getElementById("turn-text").textContent = "🔴 Friend's Turn";

    }

});

socket.on("scoreUpdate", function(scores){

    const playerScore = document.getElementById("player-score");
    const friendScore = document.getElementById("friend-score");

    if(role === "host"){

        playerScore.textContent = scores[0];
        friendScore.textContent = scores[1];

    }else{

        playerScore.textContent = scores[1];
        friendScore.textContent = scores[0];

    }

});

function startTimer(){

    if(timerInterval){
        return;
    }

    timerInterval = setInterval(function(){

        seconds++;

        const min = String(Math.floor(seconds/60)).padStart(2,"0");
        const sec = String(seconds%60).padStart(2,"0");

        document.getElementById("timer").textContent =
        min + ":" + sec;

    },1000);

}


//const restartBtn = document.getElementById("restart-btn");

restartBtn.addEventListener("click", function(){

    socket.emit("restartGame", roomCode);

});

socket.on("restartBoard",function(board){

    firstCard = null;
    secondCard = null;

    lockBoard = false;

    moves = 0;

    seconds = 0;

    clearInterval(timerInterval);

    timerInterval = null;

    document.getElementById("moves").textContent = "0";

    document.getElementById("timer").textContent = "00:00";

    document.getElementById("player-score").textContent = "0";
    document.getElementById("friend-score").textContent = "0";

    createBoard(board);

    startTimer();

});

socket.on("movesUpdate", function(moves){

    document.getElementById("moves").textContent = moves;

});
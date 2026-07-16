


// =======================
// SOCKET
// =======================

const socket = io();


// =======================
// ROOM CODE
// =======================

const roomCode = localStorage.getItem("roomCode");

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let moves = 0;
let myTurn = false;

console.log("Room Code :", roomCode);


// =======================
// LOAD BOARD
// =======================
socket.emit("rejoinRoom", roomCode);

socket.emit("loadBoard", roomCode);


// =======================
// RECEIVE BOARD
// =======================

socket.on("loadBoard", function(board){

    createBoard(board);

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
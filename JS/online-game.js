


// =======================
// SOCKET
// =======================

const socket = io();


// =======================
// ROOM CODE
// =======================

const roomCode = localStorage.getItem("roomCode");
const role = localStorage.getItem("role");

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let moves = 0;
let myTurn = false;

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

    if(socket.id === playerId){

        myTurn = true;
        document.getElementById("turn-text").textContent = "🟢 Your Turn";

    }else{

        myTurn = false;
        document.getElementById("turn-text").textContent = "🔴 Friend's Turn";

    }

});
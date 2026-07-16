// =======================
// SOCKET
// =======================

const socket = io();


// =======================
// ROOM CODE
// =======================

const roomCode = localStorage.getItem("roomCode");

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

    cards[index].textContent = cards[index].dataset.emoji;

});
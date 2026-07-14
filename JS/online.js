// =======================
// GET ELEMENTS
// =======================
const socket = io();
const createRoomBtn = document.getElementById("create-room");
const joinRoomBtn = document.getElementById("join-room");

const roomDisplay = document.getElementById("room-display");
const generatedCode = document.getElementById("generated-code");

const roomInput = document.getElementById("room-code");
const roomSection = document.getElementById("room-section");
const gameSection = document.getElementById("game-section");

roomSection.style.display = "block";
gameSection.style.display = "none";

// =======================
// GENERATE ROOM CODE
// =======================

function generateRoomCode(){

    const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "";

    for(let i=0; i<6; i++){

        const randomIndex =
        Math.floor(Math.random()*characters.length);

        code += characters[randomIndex];

    }

    return code;

}
// =======================
// CREATE ROOM
// =======================

createRoomBtn.addEventListener("click",function(){

    const roomCode = generateRoomCode();

    generatedCode.textContent = roomCode;

    roomDisplay.style.display = "block";
    socket.emit("createRoom", roomCode);

});
// =======================
// JOIN ROOM
// =======================

joinRoomBtn.addEventListener("click", function(){

    const roomCode = roomInput.value.trim().toUpperCase();

    if(roomCode === ""){

        alert("Please enter room code.");

        return;

    }

    if(roomCode.length != 6){

        alert("Room code must contain 6 characters.");

        return;

    }

    socket.emit("joinRoom", roomCode);

});
socket.on("roomNotFound", function(){

    alert("❌ Room Not Found");

});

socket.on("startGame", function(){

   document.getElementById("room-section").style.display = "none";

    document.getElementById("game-section").style.display = "block";

    roomSection.style.display = "none";
    gameSection.style.display = "block";

});
socket.on("loadBoard", function(board){

    const gameBoard = document.getElementById("game-board");

    gameBoard.innerHTML = "";

    gameBoard.style.gridTemplateColumns = "repeat(4,100px)";

    board.forEach(function(emoji){

        const card = document.createElement("div");

        card.classList.add("card-box");

        card.textContent = "?";

        card.dataset.emoji = emoji;

        card.dataset.state = "hidden";

        gameBoard.appendChild(card);

    });

});
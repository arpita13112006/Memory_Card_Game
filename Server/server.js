const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("../"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/../index.html");
});

const rooms = {};

const emojis = [
    "🐶","🐶",
    "🐱","🐱",
    "🐼","🐼",
    "🐸","🐸",
    "🐵","🐵",
    "🦊","🦊",
    "🐰","🐰",
    "🐻","🐻"
];

function shuffle(array){
    const temp = [...array];
    temp.sort(() => Math.random() - 0.5);
    return temp;
}

io.on("connection", function(socket){

    console.log("🟢 New User Connected");

    socket.on("createRoom", function(roomCode){

        socket.join(roomCode);

        rooms[roomCode] = {
            players: [socket.id],
            board: shuffle(emojis),
             turn: 0,
             flipped: [],
    matched: [],
    scores: [0, 0]
        };

        console.log("Room Created :", roomCode);
        console.log(rooms);
    });

    socket.on("joinRoom", function(roomCode){

        if(rooms[roomCode]){

            socket.join(roomCode);

            rooms[roomCode].players.push(socket.id);

            console.log("Player Joined :", roomCode);

            io.to(roomCode).emit("startGame");

            io.to(roomCode).emit("turnUpdate", rooms[roomCode].players[0]);

        }else{

            socket.emit("roomNotFound");

        }

    });

     socket.on("rejoinRoom", function(roomCode){

        if(rooms[roomCode]){

            socket.join(roomCode);

            console.log("Player Rejoined : " + roomCode);

            // io.to(roomCode).emit("turnUpdate", "Your Turn");

        }

    });

    socket.on("loadBoard", function(roomCode){

        if(rooms[roomCode]){

            socket.emit("loadBoard", rooms[roomCode].board);

        }

    });

    socket.on("flipCard", function(data){

    const room = rooms[data.roomCode];

    if(!room){

        return;

    }

    // Agar card pehle hi matched hai
    if(room.matched.includes(data.index)){

        return;

    }

    // Agar card pehle hi flip ho chuka hai
    if(room.flipped.includes(data.index)){

        return;

    }

    room.flipped.push(data.index);

    // Agar 2 cards flip ho gaye
if(room.flipped.length === 2){

    const firstIndex = room.flipped[0];

    const secondIndex = room.flipped[1];

    const firstEmoji = room.board[firstIndex];

    const secondEmoji = room.board[secondIndex];

    if(firstEmoji === secondEmoji){

        room.matched.push(firstIndex);
        room.matched.push(secondIndex);

        room.flipped = [];

        io.to(data.roomCode).emit("matchFound", {
            first:firstIndex,
            second:secondIndex
        });

    }

    else{

        setTimeout(function(){

            io.to(data.roomCode).emit("hideCards", {
                first:firstIndex,
                second:secondIndex
            });

            room.flipped = [];

        },1000);

    }

}

    io.to(data.roomCode).emit("flipCard", data.index);

});
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

    }

    else{

        myTurn = false;

        document.getElementById("turn-text").textContent = "🔴 Friend's Turn";

    }

});

    socket.on("disconnect", function(){

        console.log("🔴 User Disconnected");

    });

});   // <-- io.on yahan close hoga

server.listen(3000, function(){

    console.log("✅ Server Running...");
    console.log("http://localhost:3000");

});
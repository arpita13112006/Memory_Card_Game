const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("../"));

app.get("/", function (req, res) {
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

function shuffle(array) {
    const temp = [...array];
    temp.sort(() => Math.random() - 0.5);
    return temp;
}

io.on("connection", function(socket){

    console.log("🟢 New User Connected :", socket.id);

socket.on("createRoom", function(roomCode){

    socket.join(roomCode);

    rooms[roomCode] = {

        players: [socket.id],

        board: shuffle(emojis),

        turn: 0,

        flipped: [],

        matched: [],

        scores: [0,0]

    };

    console.log("Room Created :", roomCode);

    console.log(rooms);

});

    socket.on("joinRoom", function(roomCode){

    if(!rooms[roomCode]){

        socket.emit("roomNotFound");

        return;

    }

    socket.join(roomCode);

    rooms[roomCode].players.push(socket.id);

    console.log("Player Joined :", roomCode);

    io.to(roomCode).emit("startGame");

});
    socket.on("rejoinRoom", function(data){

    const room = rooms[data.roomCode];

    if(!room){
        return;
    }

    socket.join(data.roomCode);

    if(data.role === "host"){
        room.players[0] = socket.id;
    }
    else{
        room.players[1] = socket.id;
    }

    console.log("Player Rejoined :", data.roomCode);
    console.log(room.players);

    socket.emit("loadBoard", room.board);

    io.to(data.roomCode).emit("turnUpdate", room.players[room.turn]);

});

    socket.on("loadBoard", function(roomCode){

    if(!rooms[roomCode]){
        return;
    }

    socket.emit("loadBoard", rooms[roomCode].board);

});

    socket.on("flipCard", function(data){

    console.log("Flip Request :", data);

    const room = rooms[data.roomCode];

    if(!room){
        return;
    }

    if(room.matched.includes(data.index)){
        return;
    }

    if(room.flipped.includes(data.index)){
        return;
    }

    room.flipped.push(data.index);

    io.to(data.roomCode).emit("flipCard", data.index);

    if(room.flipped.length === 2){

        const first = room.flipped[0];
        const second = room.flipped[1];

        if(room.board[first] === room.board[second]){

            room.matched.push(first, second);

            io.to(data.roomCode).emit("matchFound",{
                first:first,
                second:second
            });

            room.flipped = [];

        }else{

            setTimeout(function(){

                io.to(data.roomCode).emit("hideCards",{
                    first:first,
                    second:second
                });

                room.flipped = [];

            },1000);

        }

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
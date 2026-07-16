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
            board: shuffle(emojis)
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

    io.to(data.roomCode).emit("flipCard", data.index);

});

    socket.on("disconnect", function(){

        console.log("🔴 User Disconnected");

    });

});   // <-- io.on yahan close hoga

server.listen(3000, function(){

    console.log("✅ Server Running...");
    console.log("http://localhost:3000");

});
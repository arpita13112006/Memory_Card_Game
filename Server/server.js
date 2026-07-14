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

io.on("connection", function(socket){

    console.log("🟢 New User Connected");

    socket.on("createRoom", function(roomCode){

        socket.join(roomCode);

        rooms[roomCode] = {

    players: [socket.id],

    board: shuffle(emojis)

};

        console.log("Room Created : " + roomCode);
        console.log(rooms);

    });

    socket.on("joinRoom", function(roomCode){

        if(rooms[roomCode]){

            socket.join(roomCode);

            rooms[roomCode].players.push(socket.id);

            console.log("Player Joined : " + roomCode);

            io.to(roomCode).emit("startGame");
            io.to(roomCode).emit("loadBoard", rooms[roomCode].board);

        }
        else{

            socket.emit("roomNotFound");

        }

    });

    socket.on("disconnect", function(){

        console.log("🔴 User Disconnected");

    });
});

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


server.listen(3000, function(){

    console.log("✅ Server Running...");
    console.log("http://localhost:3000");

});
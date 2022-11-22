const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const rooms = [], usernames = [];

app.use("/", express.static(__dirname + "/rooms"));

app.get("/", (req, res) => {
   res.sendFile(__dirname + "/rooms/index.html");
});

io.on("connection", (socket) => {
   socket.on("join", (room, username) => {
      rooms[socket.id] = room;
      usernames[socket.id] = username;
      socket.leaveAll();
      socket.join(room);
      io.in(room).emit("recieve", `${username} has entered the chat.`);
      socket.emit("join", room);
   });

   socket.on("send", (message) => {
      io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] + ": " + message);
   });

   socket.on("recieve", (message) => {
      socket.emit("recieve", message);
   });
});


server.listen(3000, () => { console.log("Connected!") });
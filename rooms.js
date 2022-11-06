const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);

app.use(express.static(path.join(__dirname, "rooms")));

httpserver.listen(3000);

const rooms = [], usernames = [];

io.on("connection", (socket) => {
   socket.on("join", (room, username) => {
      if (username != ""){
         rooms[socket.id] = room;
         usernames[socket.id] = username;
         socket.leaveAll();
         socket.join(room);
         io.in(room).emit("recieve", `${username} has entered the chat.`);
         socket.emit("join", room);
      }
   });

   socket.on("send", (message) => {
      io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] + ": " + message);
   });

   socket.on("recieve", (message) => {
      socket.emit("recieve", message);
   });
});
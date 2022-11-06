const express = require("express");
const mongoose = require("mongoose");

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use("/", express.static(__dirname + "/assets"));
app.use("/styles", express.static(__dirname + "/styles"));
app.use("/scripts", express.static(__dirname + "/scripts"));

const dbUrl = "mongodb+srv://Squirrel:nCCJ0sQuQQ5qhGsn@test-user-data.daqv1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(dbUrl , (err) => { 
   if (err) console.log(err);
   else console.log("MongoDB Connected!");
});

var Message = mongoose.model("Message", {
   name: String,
   msg: String,
   on: String
});

app.get("/", (req, res) => {
   res.sendFile(__dirname + '/index.html');
});

app.get("/messages", (req, res) => {
   // console.log("Fetched Messages!")
   Message.find({}, (err, messages) => {
      res.send(messages);
   })
});

io.on("connection", (socket) => {
   // console.log('a user connected');
   socket.on('disconnect', () => {
      // console.log('user disconnected');
   });
});

io.on("connection", (socket) => {
   socket.on('chat message', (msgData) => {
      // console.log(msgData);
      saveMsg(msgData);
      io.emit('chat message', msgData);
   });
});

function saveMsg(msgData) {
   const newMsg = new Message({
      name: msgData.name,
      msg: msgData.msg,
      on: msgData.on
   });
   newMsg.save((err, result) => {
      if (err) { console.log(err); }
      else { return result; }
   });
}

server.listen(4000);

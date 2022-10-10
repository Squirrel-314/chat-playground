const express = require('express');
const mongoose = require("mongoose");

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

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

// mongodb version
// io.on("connection", () =>{
//    // console.log("a user is connected")
// });

// app.get("/messages", (req, res) => {
//    // console.log("fetched messages")
//    Message.find({},(err, messages)=> {
//       res.send(messages);
//    })
// });

// app.post("/messagesss", (req, res) => {

//    // const newChat = new Message({
//    //    input: req.body.input,
//    //    user: signedInUser.name,
//    //    avatar: signedInUser.avatar,
//    //    datePosted: timePosted
//    // });
//    // newChat.save((err, result) => {
//    //    if (err) { console.log(err); }
//    //    else { res.send(result); return result; }
//    // });

//    console.log(req.body)
//    var message = new Message(req.body);
//    message.save((err) =>{
//      if(err)
//        sendStatus(500);
//      io.emit('message', req.body);
//      res.sendStatus(200);
//    })
// })


server.listen(4000);

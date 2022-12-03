/* =============
// Data
============= */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 3000;
const connection = mongoose.connection;

const saltRounds = 12;

let signedIn;
let signedInUser = "(not signed in)";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets/"));
app.use("/styles", express.static(__dirname + "/styles/"));
app.use("/scripts", express.static(__dirname + "/scripts/"));
app.set("view engine", "ejs");

// Mongoose things
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });
connection.on("error", console.error.bind(console, "Connection error: "));

// Schemas
const userSchema = new mongoose.Schema({
   username: String,
   email: String,
   password: String,
   bio: String,
   links: [],
   created: Date,
   handle: String,
   chats: [], // list of chat ids
});

const chatSchema = new mongoose.Schema({
   members: [],
   name: String,
   about: String,
   id: String,
   created: Date,
   messages: [],
   settings: {}
});

// Set the schemas
const Users = mongoose.model("Users", userSchema);
const Chats = mongoose.model("Chats", chatSchema);

/* =============
// Processing
============= */

// Sign in
function signIn(userInfo) {
   signedIn = true;
   signedInUser = userInfo;
}

// Basic data for each page
function getNewpageData() {
   return new Promise(resolve => {
      Users.find((err, users) => {
         // users.forEach((user) => { console.log(user); });
         if (err) { console.error(err); }
         else { 
            Chats.find((err, chats) => {
               // chats.forEach((chat) => { console.log(chat); });
               if (err) { console.error(err); }
               else {
                  let returnData = {
                     user: signedInUser,
                     users: users,
                     chats: chats
                  }
                  resolve(returnData);
                  return returnData;
               }
            });
         }
      });
   });
}

/* =============
// Socket
============= */

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const rooms = [], usernames = [];


io.on("connection", (socket) => {
   socket.on("join", (room, username) => {
      rooms[socket.id] = room;
      usernames[socket.id] = username;
      socket.username = username;
      socket.leaveAll();
      socket.join(room);
      const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
      io.in(rooms[socket.id]).emit("join", { room: room, users: sockets });   
   });

   socket.on("send", (message) => {
      saveMsg(message.chat, message.data);
      Users.findById(message.data.user, (err, user) => {
         if (err) console.log(err);
         else {
            let newMessage = message.data;
            newMessage.user = user.username;
            io.in(rooms[socket.id]).emit("recieve", newMessage);
         }
      });
   });

   socket.on("disconnect", () => {
      const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
      io.in(rooms[socket.id]).emit("left", { users: sockets });
   });
});


function saveMsg(chat, msgData) {
   Chats.findOneAndUpdate({ id: chat }, {
      $push: { messages: msgData }
   }, (err) => { if (err) console.log(err); });
}

/* =============
// Get requests
============= */

app.get("/", (req, res) => { goSomewhere(res, "home"); });

app.get("/:chatid", (req, res) => {
   Chats.findOne({ id: req.params.chatid }, (err, chat) => {
      if (err) console.error(err);
      else if (chat) {
         awaitData();
         async function awaitData() {
            let returnedData = await getNewpageData();
            returnedData.chat = chat;
            res.render("chat", returnedData);
         }
         
      }
      else res.render("lost");
   });
});

// Temporary landings
app.get("/sign-out", (req, res) => {
   signedIn = false;
   signedInUser = "(not signed in)";
   res.redirect("/");
});

function goSomewhere(res, where) {
   letsGo();
   async function letsGo() {
      let returnedData = await getNewpageData();
      res.render(where, returnedData);
   }
}

/* =============
// Account
============= */

// Sign in
app.post("/user/login", (req, res) => {
   Users.findOne({ username: req.body.name }, (err, user) => {
      if (err) return console.error(err);
      if (!user) { res.send("There is no account with this name!"); }
      else if (user) {
         bcrypt.compare(req.body.pscd, user.password)
            .catch(err => console.error(err.message))
            .then(match => {
               if (match) { signIn(user); res.send("Success!"); }
               else res.send("Wrong password!");
         });
      }
   });
});

// Signup
app.post("/user/create", (req, res) => {
   asyncCreate();
   async function asyncCreate() {
      let isAlreadyUsedName = await Users.findOne({ username: req.body.name });
      if (isAlreadyUsedName) { res.send("Choose a different name! (This one is taken!)"); }
      else {
         // Problem with this
         let isAlreadyUsedEmil = await Users.findOne({ email: req.body.emil });
         if (isAlreadyUsedEmil.email) { res.send("This email is already used!"); }
         else {
            bcryptForMe(req.body.pscd).then((passhash) => {
               const newDev = new Users({
                  username: req.body.name,
                  userCall: req.body.name,
                  email: req.body.emil,
                  password: passhash,
                  bio: "an empty page, filled with endless possibilities",
                  githubClientId: "false"
               });
               newDev.save(function (err) { if (err) return console.error(err); });
               sendEmail(
                  "Hurray! Your Git Organized account has been created!",
                  `<h2>Hurray!</h2>
                  <h4>Your Git Organized account has been created!</h4>
                  <p>I just wanted to let you know that your account (${req.body.name}) has been created. I will not send promotional emails unless you want me to. The only other emails I will send shall be triggered by your actions on my site.</p>
                  <i>Editor Rust :)</i>
                  <p>vegetabledash@gmail.com</p>`,
                  req.body.emil
               );
               // Sign in and go home
               Users.findOne({ name: req.body.name, email: req.body.emil, passcode: req.body.pscd }, (err, user) => {
                  if (err) return console.error(err);
                  else {
                     console.log(user);
                     signIn(user); res.send("Success!"); }
               });
            });
         }
      }
   }
});

let bcryptForMe = (pass) => {
   return new Promise((resolve) => {
      bcrypt.hash(pass, saltRounds)
      .catch(err => console.error(err.message))
      .then(hash => { resolve(hash); });
   });
}


/* =============
// Create Chat
============= */

app.post("/newchat", (req, res) => {
   let chatid = uuidv4();
   const newChat = new Chats({
      members: [signedInUser.username],
      name: req.body.name,
      about: req.body.about,
      id: chatid,
      created: req.body.date,
      messages: [],
      settings: req.body.settings
      /*
      type:
      public edit - anyone can view and edit
      public view - anyone can view, invite to edit (toggle invites)
      private edit - people invited can edit
      private view - people invited can view, invite to edit (toggle invites)
      note:
      allow anonymous on chats - option
      */
   });
   newChat.save(function (err, chat) {
      if (err) return console.error(err);
      else { res.send("Success!"); }
   });
   Users.findByIdAndUpdate(signedInUser.id, {
      $push: { chats: chatid }
   }, (err) => { if (err) console.log(err); } );
});

/* =============
// Mail
============= */

const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: "vegetabledash@gmail.com",
      pass: "rgagablxdefsiymr"
  }
});

function sendEmail(title, text, recipient) {
   var mailOptions = {
      from: "vegetabledash@gmail.com",
      to: recipient,
      subject: title,
      html: text
   };
   
   transporter.sendMail(mailOptions, function(err, info){
      if (err) { console.log(err); }
   });
}

/* =============
// Important stuff
============= */

// Get all lost requests
app.get("*", (req, res) => { res.render("lost"); });
server.listen(port);

// Auto sign in me
Users.findOne({ name: "Editor Rust" }, (err, user) => { signIn(user); });
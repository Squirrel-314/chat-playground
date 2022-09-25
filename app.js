/* =============
// Data
============= */
// System variables
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = process.env.PORT || 3000;
const connection = mongoose.connection;

// This will be changed later when the user signs in
let signedIn = false;
let signedInUser = "(not signed in)";

// This basically sets and starts all the libraries
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// This sets the base filepath for assets to /assets. It can be changed to anything
app.use("/", express.static(__dirname + "/assets"));
app.use("/styles", express.static(__dirname + "/styles"));
app.use("/scripts", express.static(__dirname + "/scripts"));
// Ejs is the view engine, it lets use use system varibles in html
app.set("view engine", "ejs");

// Mongoose things
mongoose.Promise = global.Promise;
// Acutally connect to the database with the connection link. You'll need to create a user on the database so you'll get access
mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true });

// nodemailer things
// What this does is setup the mailer, so we can email people when they sign up. Eventually we'll use this to send change password emails
const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.VD_EMAIL,
      pass: process.env.VD_EMAIL_PASSCODE
  }
});

// System things
connection.on("error", console.error.bind(console, 'Connection error: '));

// Schemas
// These are the basic datasets. Anything being saved to Mongo must be in schema format. If you're adding a value, add it here then run some code from oldapp.js to set it for all old users
const privateChatSchema = new mongoose.Schema({
   code: String,
   name: String,
   users: Array,
   // because it'll be like [["jane", "admin"], ["john", "member"], ["drew", "viewer"]]
   messages: Array
});

const useDataSchema = new mongoose.Schema({
   userCode: String,
   name: String,
   email: String,
   passcode: String,
   avatar: String,
   chats: [],
   dateAccountStarted: Date,
   lastPlayed: Date,
   dashcoins: Number,
   friends: [],
   friendInvitesSent: [],
   friendInvitesRecived: [],
   gameSave: {}
});

const chatSchema = new mongoose.Schema({
   input: String,
   user: String,
   avatar: Number,
   datePosted: Object
});

// Set the schemas
const PrivateChat = mongoose.model("PrivateChat", privateChatSchema);
const UserData = mongoose.model("UserData", useDataSchema);
const Chat = mongoose.model("Chat", chatSchema);

/* =============
// Processing
============= */

// The send email function, just to clean things up
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

// Sign in
function signIn(userInfo) {
   signedIn = true;
   signedInUser = userInfo;
}

// Basic data for each page
function getNewpageData() {
   return new Promise(resolve => {
      UserData.find((err, users) => {
         if (err) { console.error(err); }
         else {
            Chat.find(function(err, found) {
               if (err) { console.log(err); }
               else {
                  PrivateChat.find(function(err, doc) {
                     if (err) { console.log(err); }
                     else {
                        let returnData = {
                           user: signedInUser,
                           UserData: UserData,
                           users: users,
                           foundItems: found,
                           chats: doc
                        }
                        resolve(returnData);
                        return returnData;
                     }
                  });
               }
            });
         }
      });
   });
}

/* =============
// Get requests
============= */

async function letsGoTo(RES, page) {
   let returnedData = await getNewpageData();
   RES.render(page, returnedData);
}

// Public user pages
app.get("/users/:username", (req, res) => {
   UserData.findOne({ name: req.params.username }, (err, user) => {
      if (err) { console.error(err); }
      else if (user == null) { res.render("no-such-user"); }
      else { res.render("user-profile", { user: user, name: user.name }); }
   });
});

// If someone in the browser types a /, it'll go to the homepage
app.get("/", (req, res) => {
   // Because we set the view engine as ejs, this will render the home.ejs file in the view foler
   // The second input is an object with the variables we'll send to the page
   letsGoTo(res, "home");
});

app.get("/feelin-chatty", (req, res) => { letsGoTo(res, "fullchat"); });


// Temporary landings
app.get("/sign-out", (req, res) => {
   // This is not an actuall page, because it immediately send you back
   signedIn = false;
   user = null;
   signedInUser = "(not signed in)";
   res.redirect("/");
});

/* =============
// Account
============= */

// Sign in
app.post("/signin", (req, res) => {
   UserData.findOne({ name: req.body.name, email: req.body.emil, passcode: req.body.pscd }, (err, user) => {
      if (err) return console.error(err);
      if (!user) { res.send("The data dosen't line up. Try again!"); }
      else if (user) {
         signIn(user);
         res.send("Successful signin!");
      }
   });
});

/* =============
// Chats
============= */

app.post("/new-chat", (req, res) => {
   let chatCode = uuidv4();
   const newChat = new PrivateChat({
      code: chatCode,
      name: req.body.name,
      users: [[signedInUser.name, "admin"]]
   });
   UserData.findOneAndUpdate(
      { name: signedInUser.name },
      { $addToSet: { chats: chatCode } },
      { new: true },
      (err, doc) => {  if (err) return console.error(err); }
   );
   newChat.save((err, result) => {
      if (err) { console.log(err); }
      else { res.redirect("/"); }
   });
}); 

/* =============
// Chat
============= */

app.post("/chat-message", (req, res) => {
   let timePosted = new Date(req.body.datePosted);
   const newChat = new Chat({
      input: req.body.input,
      user: signedInUser.name,
      avatar: signedInUser.avatar,
      datePosted: timePosted
   });
   newChat.save((err, result) => {
      if (err) { console.log(err); }
      else { res.send(result); return result; }
   });
}); 

app.post("/edit-message", (req, res) => {
   Chat.findByIdAndUpdate(
      req.body.msgId,
      { input: req.body.newMessage,
        avatar: signedInUser.avatar },
      { new: true },
      (err, doc) => { if (err) return console.error(err); }
   );
   Chat.findOne({ name: signedInUser.name }, (err, doc) => {
      if (err) return console.error(err);
      else { res.send("Edited Successfully."); }
   });
});

app.post("/delete-message", (req, res) => {
   Chat.deleteOne( { _id: req.body.msgId }, (err) => { if (err) return console.error(err); } );
   Chat.findOne({ name: signedInUser.name }, (err, doc) => {
      if (err) return console.error(err);
      // else { res.redirect("/"); }
      else { res.send("Deleted Successfully."); }
   });
});

/* =============
// Video
============= */

// All this stuff is experimental, I'm just testing it, so I don't fully understand it. I did only start developing like 2 years ago
const server = require("http").Server(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, { debug: true, });

app.use("/peerjs", peerServer);
app.use(express.static("public"));

app.get("/start-video", (req, res) => {
   res.redirect(`/video-chat/${uuidv4()}`);  
});

app.get("/video-chat/:room", (req, res) => {
   res.render("videoroom", { roomId: req.params.room });
});

let listOfPeers = [];

peerServer.on("connection", (data) => {
   listOfPeers.push(data.id);
});

io.on("connection", (socket) => {
   // socket.broadcast.emit("user-connected", socket.id);
   let userId;
   socket.on("join-room", (roomId, usrId, userName) => {
      userId = usrId;
      socket.join(roomId);
      socket.emit("listOfPeers", listOfPeers);
      socket.broadcast.emit("user-connected", userId);
      socket.on("message", (message) => {
         io.to(roomId).emit("createMessage", message, userName);
      });
   });
   socket.on("disconnect", () => {
      if (listOfPeers.indexOf(5) > -1) { listOfPeers.splice(listOfPeers.indexOf(userId), 1); }
      socket.broadcast.emit("user-disconnected", userId);
   });
});

// Get all lost requests
app.get("*", (req, res) => {
   res.render("page-not-found");
});

// This is what actually starts the server
server.listen(port);

// Testing
UserData.findOne({ name: "Squirrel" }, (err, user) => { signIn(user); });

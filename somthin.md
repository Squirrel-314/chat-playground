

<!-- <!DOCTYPE html>
<html>
<head>
 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.min.js"></script>
 <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
 <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css">
 <script src="/socket.io/socket.io.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.min.js" integrity="sha512-eVL5Lb9al9FzgR63gDs1MxcDS2wFu3loYAgjIH0+Hg38tCS8Ag62dwKyH+wzDb+QauDpEZjXbMn11blw8cbTJQ==" crossorigin="anonymous"></script>


</head>
<body>
<div class="container">
 <br>
 <div class="jumbotron">
 <h1 class="display-4">Send Message</h1>
 <br>
 <input id = “name” class=”form-control” placeholder=”Name”>
 <br>
 <textarea id = “message” class=”form-control” placeholder=”Your Message Here”>
</textarea>
 <br>
 <button id=”send” class=”btn btn-success”>Send</button>
 </div>
 <div id=”messages”>
 
</div>
</div>
<script>

</script>
</body>
</html>


<script>
var socket = io();

socket.on("message", addMessages)


   $(() => {
    $("#send").click(()=>{
       sendMessage({
          name: $("#name").val(), 
          message:$("#message").val()});
        })
      getMessages()
    })
    
function addMessages(message){
   $("#messages").append(`
      <h4> ${message.name} </h4>
      <p>  ${message.message} </p>`)
   }
   
function getMessages(){
  $.get("http://localhost:3000/messages", (data) => {
   data.forEach(addMessages);
   })
 }
 
function sendMessage(message){
   $.post("http://localhost:3000/messages", message)
 }

</script> -->






















// app.use(express.static(__dirname));

// var bodyParser = require("body-parser")
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}))


// var mongoose = require("mongoose");

// var dbUrl = "mongodb+srv://Squirrel:nCCJ0sQuQQ5qhGsn@test-user-data.daqv1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// mongoose.connect(dbUrl , (err) => { 
//    if (err) console.log(err);
//    console.log("mongodb connected");
// })

// var Message = mongoose.model("Message",{ name : String, message : String})

// io.on("connection", () =>{
//    console.log("a user is connected")
//   })

// app.get("/messages", (req, res) => {
//    Message.find({},(err, messages)=> {
//      res.send(messages);
//    })
//  })

//  app.post('/messages', (req, res) => {
//    var message = new Message(req.body);
//    message.save((err) =>{
//      if(err)
//        sendStatus(500);
//      io.emit('message', req.body);
//      res.sendStatus(200);
//    })
//  })
 
let socket, msgBox, usernameInput, chatIDInput, messageInput, chatRoom;
let messages = [];

function onload() {
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("room");
  msgBox = document.querySelector(".msgs");

  socket.on("join", function(room){
    chatRoom.innerHTML = "Chatroom: " + room;
  });

  socket.on("recieve", function(message){
    console.log(message);
    if (messages.length < 9) {
      messages.push(message);
    }
    else {
      messages.shift();
      messages.push(message);
    }
    msgBox.innerHTML = "";
    for (i = 0; i < messages.length; i++) {
      let msg = document.createElement("P");
      msg.textContent = messages[i];
      msgBox.appendChild(msg);
    }
  })
}

function Connect() {
   socket.emit("join", chatIDInput.value, usernameInput.value);
}

function Send() {
   socket.emit("send", messageInput.value);
   messageInput.value = "";
}

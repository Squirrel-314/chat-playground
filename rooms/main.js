let socket = io();
let msgBox = document.querySelector(".msgs");
let usernameInput = document.getElementById("NameInput");
let chatIDInput = document.getElementById("roomInput");
let messageInput = document.getElementById("newMSg");

socket.on("join", function(room) {
   document.querySelector(".room").textContent = "Room: " + room;
   document.title = `${room} | Chat`;
});

socket.on("recieve", function(message) {
   let msg = document.createElement("P");
   msg.textContent = message;
   msgBox.appendChild(msg);

});

function join() {
   if (usernameInput.value != "") {
      socket.emit("join", chatIDInput.value, usernameInput.value);
      document.querySelector(".join").remove();
      document.querySelector(".chat").style.display = "grid";
   }
}

function post() {
   if (messageInput.value != "") {
      socket.emit("send", messageInput.value);
      messageInput.value = "";
   }
}

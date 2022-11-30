let socket = io();
let msgBox = document.querySelector(".messageBox");
let messageInput = document.getElementById("newMSg");

socket.on("join", (room) => {
   console.log("Joined");
});

socket.on("recieve", (message) => {
   let msg = document.createElement("DIV");
   console.log(message)
   msg.innerHTML = `
      <div class="py-2 px-4 my-2 border-b-2 border-gray-100">
         <p class="text-lg">${message.msg}</p>
         <p>Posted by ${message.user}</p>
         <p class="text-gray-700">On ${new Date(message.date).toLocaleString()}</p>
      </div>`;
   msgBox.appendChild(msg);
   scrollToLast();
});

socket.emit("join", chatId, username);

function post() {
   if (messageInput.value != "") {
      socket.emit("send", { chat: chatId, data: {
         msg: messageInput.value,
         date: new Date(),
         user: usercode
      }});
      messageInput.value = "";
   }
}

scrollToLast();
function scrollToLast() {
   msgBox.scrollIntoView({ behavior: "smooth", block: "end" });
}
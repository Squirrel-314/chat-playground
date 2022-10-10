var socket = io();

var messages = document.getElementById("messages");
var form = document.getElementById("form");

form.addEventListener("submit", function(e) {
   e.preventDefault();
   if (document.querySelector("#form").msg.value) {
      socket.emit("chat message", { name: document.querySelector("#form").name.value, msg: document.querySelector("#form").msg.value, on: new Date() });
      document.querySelector("#form").name.value = "";
      document.querySelector("#form").msg.value = "";
   }
});

socket.on("chat message", addMessage);

getMessages();

function getMessages() {
   $.get(`${window.location.origin}/messages`, (data) => {
      console.log("Fetched Messages:", data);
      data.forEach(addMessage);
   });
}

function addMessage(msg) {
   var item = document.createElement("li");
   setInterval(updateMsg, 60000);
   messages.appendChild(item);
   window.scrollTo(0, document.body.scrollHeight);
   updateMsg();
   function updateMsg() { console.log("update"); item.innerHTML = `${msg.msg} <br> Posted by <i>${msg.name}</i> ${mdy(msg.on)} at ${thetime(msg.on)} ${dateDiff(msg.on)}`; }
}

function mdy(dateString) {
   let dateObj = new Date(dateString);
   let currentDate = new Date().getUTCDate();
   if (dateObj.getUTCDate() != currentDate) { return `on ${dateObj.getUTCDate()}/${dateObj.getUTCMonth() + 1}/${dateObj.getUTCFullYear()}`; }
   else { return ""; }
}

function thetime(dateString) {
   let dateObj = new Date(dateString);
   let hours, mins;
   if (dateObj.getHours().toString().length < 2) { hours = `0${dateObj.getHours()}` }
   else { hours = `${dateObj.getHours()}` }
   if (dateObj.getMinutes().toString().length < 2) { mins = `0${dateObj.getMinutes()}` }
   else { mins = `${dateObj.getMinutes()}` }
   return `${hours}:${mins}`;
}

function dateDiff(dateString) {
   var then = new Date(dateString);
   var now = new Date();
   var diffMs = (now - then);
   var diffDays = Math.floor(diffMs / 86400000);
   var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
   var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

   if (diffDays == 0) {
      if (diffHrs == 0) { return `(${diffMins} minutes ago)`; }
      else { return `(${diffHrs} hours and ${diffMins} minutes ago)`; }
   }
   else if (diffDays < 31) { return `(${diffDays} days, ${diffHrs} hours, and ${diffMins} minutes ago)`; }
   else { return "(over 30 days ago)"; }
}

// Log somthing friendly
console.log(["Hey there!", "💖 Thank you! 💖", "Yay! So glad you came! 💖", "Great to see you!"][Math.floor(Math.random() * 4)]);
console.log("I'll use the log to record important events");
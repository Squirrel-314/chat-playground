// Numbers are from the Wikipedia 'Names of large numbers' page
// Forked from digit.js v0.1.1

function toWord(inputNum, type) {
   let num = Number(inputNum);
   // If the number is less than 7 digits, just put in commas
   if (num.toFixed().length < 7) { return commas(num); }
   else {
      num = num.toFixed();
      if (findTerrain(7)) { return returnNum(7, (type === "short" ? "M" : "Million")); }
      if (findTerrain(10)) { return returnNum(10, (type === "short" ? "B" : "Billion")); }
      if (findTerrain(13)) { return returnNum(13, (type === "short" ? "t" : "Trillion")); }
      if (findTerrain(16)) { return returnNum(16, (type === "short" ? "q" : "Quadrillion")); }
      if (findTerrain(19)) { return returnNum(19, (type === "short" ? "Q" : "Quintillion")); }
      if (findTerrain(22)) { return returnNum(22, (type === "short" ? "s" : "Sextillion")); }
      if (findTerrain(25)) { return returnNum(25, (type === "short" ? "S" : "Septillion")); }
      if (findTerrain(28)) { return returnNum(28, (type === "short" ? "o" : "Octillion")); }
      if (findTerrain(31)) { return returnNum(31, (type === "short" ? "n" : "Nonillion")); }
      if (findTerrain(34)) { return returnNum(34, (type === "short" ? "d" : "Decillion")); }
      if (findTerrain(37)) { return returnNum(37, (type === "short" ? "U" : "Undecillion")); }
      if (findTerrain(40)) { return returnNum(40, (type === "short" ? "D" : "Duodecillion")); }
      if (findTerrain(43)) { return returnNum(43, (type === "short" ? "T" : "Tredecillion")); }
      if (findTerrain(46)) { return returnNum(46, (type === "short" ? "qu" : "Quattuordecillion")); }
      if (findTerrain(49)) { return returnNum(49, (type === "short" ? "Qu" : "Quindecillion")); }
      if (findTerrain(52)) { return returnNum(52, (type === "short" ? "se" : "Sedecillion")); }
      if (findTerrain(55)) { return returnNum(55, (type === "short" ? "Se" : "Septendecillion")); }
      if (findTerrain(58)) { return returnNum(58, (type === "short" ? "O" : "Octodecillion")); }
      if (findTerrain(61)) { return returnNum(61, (type === "short" ? "N" : "Novendecillion")); }
      if (findTerrain(64)) { return returnNum(64, (type === "short" ? "V" : "Vigintillion")); }
      if (findTerrain(67)) { return returnNum(67, (type === "short" ? "Uv" : "Unvigintillion")); }
      if (findTerrain(70)) { return returnNum(70, (type === "short" ? "Du" : "Duovigintillion")); }
      if (findTerrain(73)) { return returnNum(73, (type === "short" ? "Tr" : "Tresvigintillion")); }
      if (findTerrain(76)) { return returnNum(76, (type === "short" ? "Qua" : "Quattuorvigintillion")); }
      else {
         console.warn(`The number you inputed to digit.js (${inputNum}) has passed the numbers we've added. I'll put commas in it for now.`);
         return commas(num);
      }
   }
   function findTerrain(terrain) {
      if (num.length === terrain || num.length === terrain + 1 || num.length === terrain + 2) { return true; }
      else { return false; }
   }
   function returnNum(number, str) {
      if (num.length == number) { num = `${num.substring(0, 1)}.${num.substring(1, 2)} ${str}`; }
      else if (num.length == (number + 1)) { num = `${num.substring(0, 2)}.${num.substring(2, 3)} ${str}`; }
      else if (num.length == (number + 2)) { num = `${num.substring(0, 3)}.${num.substring(3, 4)} ${str}`; }
      return num;
   }
}

// Stops decimals at thousandths
function commas(num) { return num.toLocaleString(); }

// ======================================
// Time Manipulation
// ======================================

function dmy(dateString) {
   let dateObj = new Date(dateString);
   let currentDate = new Date().getUTCDate();
   if (dateObj.getUTCDate() != currentDate) { return `on ${dateObj.getUTCDate()}/${dateObj.getUTCMonth() + 1}/${dateObj.getUTCFullYear()}`; }
   else { return ""; }
}

function mdy(dateString) {
   let dateObj = new Date(dateString);
   let currentDate = new Date().getUTCDate();
   if (dateObj.getUTCDate() != currentDate) { return `on ${dateObj.getUTCMonth() + 1}/${dateObj.getUTCDate()}/${dateObj.getUTCFullYear()}`; }
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
   let then = new Date(dateString);
   let now = new Date();
   let diffMs = (now - then);
   let diffDays = Math.floor(diffMs / 86400000);
   let diffHrs = Math.floor((diffMs % 86400000) / 3600000);
   let diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
   let months = Math.round(diffDays / 30);
   let years = Math.round(months / 12);

   if (diffDays == 0) {
      if (diffHrs == 0) { return `(${diffMins} minutes ago)`; }
      else { return `(${diffHrs} hours ago)`; }
   }
   else if (diffDays < 31) { return `(${diffDays} days ago)`; }
   else if (months < 12) {
      if (months == 1) return `(about 1 month ago)`;
      return `(about ${months} months ago)`;
   }
   else {
      if (years == 1) return `(about 1 year ago)`;
      return `(about ${years} years ago)`;
   }
}
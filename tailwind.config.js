/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      "./views/*.ejs"
   ],
   theme: {
     extend: {
      colors: {
        imgbglight: "#f4a460",
        yourmsgbg: "#E1FFF3",
        thormsgbg: "#FFFCF4",
        yourmsgbgdrk: "#004328",
        thormsgbgdrk: "#523C00",
      }
     },
   },
   plugins: [],
 }
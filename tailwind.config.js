/** @type {import('tailwindcss').Config} */
module.exports = {
   content: [
      './views/*.{html,ejs,js}',
      './views/project/*.{html,ejs,js}',
      './views/partials/*.{html,ejs,js}',
      './views/github-oauth/*.{html,ejs,js}',
      './scripts/*.{html,ejs,js}',
      './scripts/project/*.{html,ejs,js}'
   ],
   theme: {
     extend: {
      colors: {
        imgbglight: "#f4a460",
        yourmsgbg: "#E1FFF3",
        thormsgbg: "#FFFCF4",
        yourmsgbgdrk: "#004328",
        thormsgbgdrk: "#523C00",
        theme: "var(--theme)"
      }
     },
   },
   plugins: [],
 }
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [".views/src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

const express = require("express");


const app = express();
app.set("view engine", "ejs");

app.listen(3000, function(){
  console.log("servidor creado http://localhost:3000");
});
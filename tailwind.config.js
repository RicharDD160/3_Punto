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

// server.js o app.js
const express = require("express");
const path = require("path");
const app = express();

// Importar las rutas del CRUD
const crudRoutes = require("./routes/crud");

// Configuración del motor de vistas
app.set("view engine", "ejs");

// Configuración para que el servidor reciba datos HTML y JSON y no se envíen undefined
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views/src"));

// Servir archivos estáticos, asegura la ruta del CSS
app.use(express.static(path.join(__dirname, "views/src")));

// Rutas para renderizar las vistas
app.get("/registro", function (req, res) {
  res.render("registro");
});

app.get("/principal", function (req, res) {
  res.render("pag_principal");
});

app.get("/inicio", function (req, res) {
  res.render("inicio_sesion");
});

// Usar las rutas del CRUD
app.use("/", crudRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`Servidor creado http://localhost:${PORT}/principal`);
});

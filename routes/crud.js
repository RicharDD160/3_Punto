// routes/crud.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// Conexión a la base de datos
let conexion = mysql.createConnection({
  host: "localhost",
  database: "restaurante",
  user: "root",
  password: ""
});

conexion.connect(function (err) {
  if (err) {
    console.error("Error al conectar a la base de datos:", err.stack);
    return;
  }
  console.log("Conectado a la base de datos como id " + conexion.threadId);
});

// Almacenar los datos
router.post("/validar", function (req, res) {
  const datos = req.body;
  console.log("Datos recibidos:", datos);

  let user_id = datos.user_id;
  let Tipo_ID = datos.Tipo_ID;
  let Nombre = datos.Nombre;
  let Apellido = datos.Apellido;
  let Rol = datos.Rol;
  let password = datos.password;

  // Sentencia SQL para insertar datos en la tabla de admin (CREATE)
  let registrar = `INSERT INTO admin (user_id, Tipo_ID, Nombre, Apellido, Rol, password) 
                   VALUES ('${user_id}', '${Tipo_ID}', '${Nombre}', '${Apellido}', '${Rol}', '${password}')`;

  conexion.query(registrar, function (error, results, fields) {
    if (error) {
      console.error("Error al registrar los datos:", error);
      res.status(500).send("Error al registrar los datos");
    } else {
      console.log("Datos registrados correctamente");
      res.redirect('/inicio');
    }
  });
});

// Manejar el inicio de sesión
let currentUser = null;

router.post("/inicio", function (req, res) {
  const { user_id, Tipo_ID, Rol, password } = req.body;
  console.log("Intento de inicio de sesión con ID:", user_id);

  let verificar = `SELECT * FROM admin WHERE user_id = '${user_id}' AND Tipo_ID = '${Tipo_ID}' AND Rol = '${Rol}' AND password = '${password}'`;

  conexion.query(verificar, function (error, results, fields) {
    if (error) {
      console.error("Error al verificar los datos:", error);
      res.status(500).send("Error al verificar los datos");
    } else {
      if (results.length > 0) {
        const usuario = results[0];
        console.log("Usuario encontrado:", usuario);

        // Guardar los datos del usuario en la variable local
        currentUser = {
          id: usuario.user_id,
          nombre: usuario.Nombre,
          rol: usuario.Rol
        };

        // Redirigir según el rol del usuario
        if (usuario.Rol === 'Cajero') {
          res.redirect('/compra');
        } else if (usuario.Rol === 'Mesero') {
          res.redirect('/pedido');
        } else if (usuario.Rol === 'Admin') {
          res.redirect('/admin');
        }
      } else {
        console.log("Usuario o contraseña incorrectos");
        res.send("Usuario o contraseña incorrectos");
      }
    }
  });
});

// Ruta para mostrar la página de compras (Cajero)
router.get("/compra", function (req, res) {
  if (currentUser) {
    res.render("compra_mes", { user: currentUser });
  } else {
    res.redirect('/inicio');
  }
});

// Ruta para mostrar la página de pedidos (Mesero)
router.get("/pedido", function (req, res) {
  if (currentUser) {
    res.render("pedido", { user: currentUser });
  } else {
    res.redirect('/inicio');
  }
});

// Ruta para mostrar la página de administración (Admin)
router.get("/admin", function (req, res) {
  if (currentUser) {
    res.render("admin", { user: currentUser });
  } else {
    res.redirect('/inicio');
  }
});
router.get("/compra2", function (req, res) {
  if (currentUser) {
    res.render("compravista", { user: currentUser });
  } else {
    res.redirect('/inicio');
  }
});

 


///CREATE////

// Almacenar los datos en la tabla de pedidos
router.post("/pedido", function (req, res) {
    const datos1 = req.body;
    console.log("Datos recibidos para pedido:", datos1);
  
    let cedula = datos1.cedula;
    let nom_pedido = datos1.nom_pedido;
    let cantidad = datos1.cantidad;
  
    // Sentencia SQL para insertar datos en la tabla de pedidos 
    let registrar = `INSERT INTO pedidos (user_id, Nom_pedido, cantidad) 
                     VALUES ('${cedula}', '${nom_pedido}', '${cantidad}')`;


  
    conexion.query(registrar, function (error, results, fields) {
      if (error) {
        console.error("Error al registrar los datos del pedido:", error);
        res.status(500).send("Error al registrar los datos del pedido");
      } else {
        console.log("Pedido registrado correctamente");
        res.redirect('/pedidosvista');
      }
    });
  });
 
  ///READ////

  // Ruta para mostrar la vista de los pedidos y recuperar los datos de la base de datos
router.get("/pedidosvista", function (req, res) {
  conexion.query('SELECT * FROM pedidos', (error, results) => {
    if (error) {
      console.error("Error al recuperar los datos:", error);
      res.status(500).send("Error al recuperar los datos");
    } else {
      res.render("vistaped", { pedidos: results });
    }
  });
});

//UPDATE///

// Ruta para mostrar el formulario de edición de un pedido
router.get("/editar/:id_pedido", function (req, res) {
  const idPedido = req.params.id_pedido;

  // Recuperar el pedido específico de la base de datos
  conexion.query('SELECT * FROM pedidos WHERE id_pedido = ?', [idPedido], (error, results) => {
    if (error) {
      console.error("Error al recuperar el pedido:", error);
      res.status(500).send("Error al recuperar el pedido");
    } else {
      if (results.length > 0) {
        res.render("editar", { pedido: results[0] });
      } else {
        res.status(404).send("Pedido no encontrado");
      }
    }
  });
});

// Ruta para manejar la actualización de un pedido
router.post("/editar/:id_pedido", function (req, res) {
  const idPedido = req.params.id_pedido;
  const { user_id, Nom_pedido, cantidad } = req.body;

  // Actualizar el pedido en la base de datos
  const actualizar = `UPDATE pedidos SET user_id = ?, Nom_pedido = ?, cantidad = ? WHERE id_pedido = ?`;
  conexion.query(actualizar, [user_id, Nom_pedido, cantidad, idPedido], (error, results) => {
    if (error) {
      console.error("Error al actualizar el pedido:", error);
      res.status(500).send("Error al actualizar el pedido");
    } else {
      console.log("Pedido actualizado correctamente");
      res.redirect('/pedidosvista');
    }
  });
});


///DELETE ////


// Ruta para eliminar un pedido
router.post("/eliminar/:id_pedido", function (req, res) {
  const idPedido = req.params.id_pedido;

  // Sentencia SQL para eliminar el registro asociado en la tabla 'compra'
  const eliminarCompra = `DELETE FROM compra WHERE id_pedido = ?`;

  conexion.query(eliminarCompra, [idPedido], (error1, results1) => {
    if (error1) {
      console.error("Error al eliminar la compra asociada:", error1);
      res.status(500).send("Error al eliminar la compra asociada al pedido");
    } else {
      console.log("Compra asociada eliminada correctamente");
      
      // Después de eliminar la compra asociada, eliminamos el pedido
      const eliminarPedido = `DELETE FROM pedidos WHERE id_pedido = ?`;
      
      conexion.query(eliminarPedido, [idPedido], (error2, results2) => {
        if (error2) {
          console.error("Error al eliminar el pedido:", error2);
          res.status(500).send("Error al eliminar el pedido");
        } else {
          console.log("Pedido eliminado correctamente");
          res.redirect('/pedidosvista');
        }
      });
    }
  });
});



  
  
  module.exports = router;
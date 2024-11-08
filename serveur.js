require("dotenv").config();
const { signUp, logIn } = require("./firebase/firebase_auth"); // Asegúrate de que la ruta a tu archivo de configuración de Firebase sea correcta
const { admin } = require("./firebase/databaseConfig");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// Crear una instancia de la aplicación Express
const app = express();

// Obtener el puerto desde las variables de entorno o usar el puerto 8000 como valor predeterminado
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Middleware para analizar JSON

// Asignar puerto
const PORT = process.env.PORT || 8001;

//const path = require("path");

/**
 * Aqui se invocan las RUTAS
 */
// localhost/api/____
app.use("/api", require("./routes"));

// Ruta para obtener un mensaje simple
app.get("/", async (req, res) => {
  res.json("hiiii we working on another dimension");
});

// app.get("/", async (req, res) => {
//   try {
//     const snapshot = await admin.database().ref("/").once("value");
//     const data = snapshot.val();
//     res.json(data);
//   } catch (error) {
//     console.error("Error al obtener datos:", error);
//     res.status(500).send("Error al obtener datos");
//   }
// });

// Escuchar en el puerto
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// // Nuevas rutas por probar
// app.post("/login", async (req, res) => {
//   try {
//     console.log(req.body);
//     const userId = await logIn(req.body.tokenID); // Espera a que signUp resuelva la promesa
//     if (userId) {
//       res.status(200).send({
//         message: "Usuario",
//         userId: userId,
//         user: req.body.tokenID.user.uid,
//       });
//     } else {
//       res.status(400).send({ message: "Error al  usuario" });
//     }
//   } catch (error) {
//     console.error("Error al  usuario: ", error);
//   }
// });

// app.post("/signUp", async (req, res) => {
//   // console.log("entro")
//   // console.log()
//   // const array= req.body["Datos"];
//   try {
//     const userId = await signUp(req.body); // Espera a que signUp resuelva la promesa

//     if (userId) {
//       res
//         .status(200)
//         .send({ message: "Usuario registrado con éxito", userId: userId });
//     } else if (userId == null) {
//       res.status(400).send({ message: "Usuario ya registrado" });
//     } else {
//       res.status(400).send({ message: "Error al registrar usuario" });
//     }
//   } catch (error) {
//     console.error("Error al registrar usuario: ", error);
//     res.status(500).send("Error al registrar usuario");
//   }
// });

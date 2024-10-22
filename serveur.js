const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const db = require("./firebaseConfig");

// Acceso a la bd
const app = express();
const port = 8000;
app.use(cors());

// Ruta para obtener toda la base de datos
app.get('/', async (req, res) => {
  res.json('hiiii we working');
});

// Ruta para obtener toda la base de datos desde Firebase
app.get('/test', async (req, res) => {
    try {
      // Referencia a la raiz de la bd
      const ref = db.ref('/');
      
      // Consulta los datos de la bd
      const snapshot = await ref.once('value');
      
      // obtener los datos en formato JSON
      const data = snapshot.val();
      
      // Responde con los datos en formato JSON
      res.json(data);
    } catch (error) {
      console.error("Error al obtener los datos de Firebase:", error);
      res.status(500).json({ error: "Error al obtener los datos de Firebase" });
    }
  });

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

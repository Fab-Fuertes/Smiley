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
app.get("/", async (req, res) => {
  res.json("hiiii we working");
});

// Ruta para obtener toda la base de datos desde Firebase
app.get("/test", async (req, res) => {
  try {
    // Referencia a la raiz de la bd
    const ref = db.ref("/");

    // Consulta los datos de la bd
    const snapshot = await ref.once("value");

    // obtener los datos en formato JSON
    const data = snapshot.val();

    // Responde con los datos en formato JSON
    res.json(data);
  } catch (error) {
    console.error("Error al obtener los datos de Firebase:", error);
    res.status(500).json({ error: "Error al obtener los datos de Firebase" });
  }
});

// Ruta para obtener contar todas las opiniones
app.get('/count-opinions', async (req, res) => {
  try {
    const ref = db.ref('/opiniones');
    const snapshot = await ref.once('value');
    const opinionsData = snapshot.val();
    
    const opinionCounts = {};

    for (const userId in opinionsData) {
      const opinions = opinionsData[userId];

      for (const timestamp in opinions) {
        const opinion = opinions[timestamp];
        const terminalId = opinion.id; // Asegúrate de que 'id' es el terminalId que necesitas

        if (!opinionCounts[terminalId]) {
          opinionCounts[terminalId] = {
            Bien: 0,
            Ok: 0,
            Regular: 0,
            Mal: 0,
          };
        }

        // Increment the count based on the opinion
        opinionCounts[terminalId][opinion.apreciacion]++;
      }
    }

    res.json(opinionCounts);
  } catch (error) {
    console.error("Error counting opinions:", error);
    res.status(500).json({ error: "Error counting opinions" });
  }
});

// Monitoreo de las reacciones y envio de alertas si se superan los umbrales
const monitorReactions = () => {
  const terminalRef = db.ref("Terminales");

  terminalRef.on("value", (snapshot) => {
    const terminals = snapshot.val();

    if (terminals) {
      Object.entries(terminals).forEach(([terminalId, terminalData]) => {
        // Obtener el umbral específico para el terminal
        const umbral = terminalData.umbral || 0;

        // Obtener las opiniones
        const opinionsRef = db.ref(`opiniones/${terminalData.ID}`);
        opinionsRef.once("value", (opinionsSnapshot) => {
          const opinionsData = opinionsSnapshot.val() || {};
          const totalOpinions = Object.keys(opinionsData).length;

          let negativeReactions = 0;

          // Contar reacciones negativas
          Object.values(opinionsData).forEach((opinion) => {
            if (
              opinion.apreciacion === "Mal" ||
              opinion.apreciacion === "Regular"
            ) {
              negativeReactions++;
            }
          });

          // Calcular porcentaje de reacciones negativas
          const negativePercentage = (negativeReactions / totalOpinions) * 100;

          // Comparar con el umbral del terminal
          if (negativePercentage > umbral) {
            sendAlert(terminalId, negativeReactions, umbral);
          }
        });
      });
    }
  });
};

// Funcion para enviar la alerta
const sendAlert = (terminalId, reaccionesNegativas, umbral) => {
  const mensaje = `El terminal ${terminalId} ha superado el umbral de reacciones negativas (Neg: ${reaccionesNegativas}/ Umbral:${umbral}). Se requiere atencion de mantenimiento.`;

  console.log(mensaje);

  // Aqui se puede enviar un correo o una notificacion push
  // Utiliza una herramienta como nodemailer o Firebase Cloud Messaging (FCM)
};

// Iniciar el monitoreo de reacciones
monitorReactions();

// Ruta para actualizar el umbral
app.post("/update-dynamic-threshold", async (req, res) => {
  try {
    const terminalRef = db.ref("Terminales");
    const snapshot = await terminalRef.once("value");
    const terminals = snapshot.val();

    if (terminals) {
      await Promise.all(
        Object.entries(terminals).map(async ([terminalId, terminalData]) => {
          const opinionsRef = db.ref(`opiniones/${terminalData.ID}`);
          const opinionsSnapshot = await opinionsRef.once("value");
          const opinionsData = opinionsSnapshot.val() || {};

          const totalOpinions = Object.keys(opinionsData).length;
          let negativeReactions = 0;

          // Contar reacciones negativas
          Object.values(opinionsData).forEach((opinion) => {
            if (
              opinion.apreciacion === "Mal" ||
              opinion.apreciacion === "Regular"
            ) {
              negativeReactions++;
            }
          });

          // Calcular el porcentaje de reacciones negativas
          const negativePercentage =
            totalOpinions > 0 ? (negativeReactions / totalOpinions) * 100 : 0;

          // Actualizar el umbral con el porcentaje calculado
          await terminalRef
            .child(`${terminalId}/umbral`)
            .set(negativePercentage);
        })
      );
    }

    res.status(200).json({ message: "Los umbrales se han actualizado correctamente!" });
  } catch (error) {
    console.error("Error actualizando umbrales:", error);
    res
      .status(500)
      .json({ error: "Error actualizando umbrales" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
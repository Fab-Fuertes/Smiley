const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const db = require("./firebaseConfig");

// Acceso a la base de datos
const app = express();
const port = 8000;
app.use(cors());

// WebSocket para actualizaciones en tiempo real
const WebSocket = require("ws");
const http = require("http");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Ruta para obtener un mensaje simple
app.get("/", async (req, res) => {
  res.json("hiiii we working");
});

// Ruta para obtener toda la base de datos desde Firebase
app.get("/test", async (req, res) => {
  try {
    const ref = db.ref("/");
    const snapshot = await ref.once("value");
    const data = snapshot.val();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener los datos de Firebase:", error);
    res.status(500).json({ error: "Error al obtener los datos de Firebase" });
  }
});

// Ruta para contar todas las opiniones
app.get("/count-opinions", async (req, res) => {
  try {
    const ref = db.ref("/opiniones");
    const snapshot = await ref.once("value");
    const opinionsData = snapshot.val();

    const opinionCounts = {};

    for (const userId in opinionsData) {
      const opinions = opinionsData[userId];

      for (const timestamp in opinions) {
        const opinion = opinions[timestamp];
        const terminalId = opinion.id;

        if (!opinionCounts[terminalId]) {
          opinionCounts[terminalId] = {
            Bien: 0,
            Ok: 0,
            Regular: 0,
            Mal: 0,
          };
        }

        opinionCounts[terminalId][opinion.apreciacion]++;
      }
    }

    res.json(opinionCounts);
  } catch (error) {
    console.error("Error counting opinions:", error);
    res.status(500).json({ error: "Error counting opinions" });
  }
});

// Monitoreo de las reacciones y envío de alertas si se superan los umbrales
const monitorReactions = () => {
  const terminalRef = db.ref("Terminales");

  terminalRef.on("value", (snapshot) => {
    const terminals = snapshot.val();

    if (terminals) {
      Object.entries(terminals).forEach(([terminalId, terminalData]) => {
        const umbral = terminalData.umbral || 0;

        const opinionsRef = db.ref(`opiniones/${terminalData.ID}`);
        opinionsRef.on("value", (opinionsSnapshot) => {
          const opinionsData = opinionsSnapshot.val() || {};
          const totalOpinions = Object.keys(opinionsData).length;

          let negativeReactions = 0;

          Object.values(opinionsData).forEach((opinion) => {
            if (
              opinion.apreciacion === "Mal" ||
              opinion.apreciacion === "Regular"
            ) {
              negativeReactions++;
            }
          });

          const negativePercentage = (negativeReactions / totalOpinions) * 100;

          if (negativePercentage > umbral) {
            sendAlert(terminalId, negativeReactions, umbral);
          }
        });
      });
    }
  });
};

const sendAlert = (terminalId, reaccionesNegativas, umbral) => {
  const mensaje = `El terminal ${terminalId} ha superado el umbral de reacciones negativas (Neg: ${reaccionesNegativas}/ Umbral:${umbral}). Se requiere atención de mantenimiento.`;
  console.log(mensaje);
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

          Object.values(opinionsData).forEach((opinion) => {
            if (
              opinion.apreciacion === "Mal" ||
              opinion.apreciacion === "Regular"
            ) {
              negativeReactions++;
            }
          });

          const negativePercentage =
            totalOpinions > 0 ? (negativeReactions / totalOpinions) * 100 : 0;

          await terminalRef
            .child(`${terminalId}/umbral`)
            .set(negativePercentage);
        })
      );
    }

    res
      .status(200)
      .json({ message: "Los umbrales se han actualizado correctamente!" });
  } catch (error) {
    console.error("Error actualizando umbrales:", error);
    res.status(500).json({ error: "Error actualizando umbrales" });
  }
});

// WebSocket para actualizaciones en tiempo real desde Firebase
wss.on("connection", (ws) => {
  console.log("Nuevo cliente WebSocket conectado");

  // Enviar la información inicial de la base de datos
  const terminalRef = db.ref("Terminales");
  terminalRef.once("value", (snapshot) => {
    const terminals = snapshot.val();
    ws.send(JSON.stringify(terminals));
  });

  // Escuchar cambios en la base de datos y enviar actualizaciones
  const onValueChange = (snapshot) => {
    const terminals = snapshot.val();
    ws.send(JSON.stringify(terminals));
  };

  terminalRef.on("value", onValueChange);

  // Manejo de la desconexión
  ws.on("close", () => {
    console.log("Conexión WebSocket cerrada");
    terminalRef.off("value", onValueChange); // Desactivar el listener al cerrar
  });
});

// Funcion de prueba para simular una nueva opinion
const simulateOpinion = async () => {
  const terminalId = "00001"; // Cambia al ID correspondiente
  const opinionsRef = db.ref(`opiniones/${terminalId}`);
  
  try {
    const snapshot = await opinionsRef.once("value");
    const existingOpinions = snapshot.val() || {};
    const totalOpinions = Object.keys(existingOpinions).length;

    // Si el total de opiniones es menor a un cierto límite, se permite agregar una nueva
    if (totalOpinions < 100) { // Cambia 100 al límite deseado
      const newOpinion = {
        apreciacion: Math.random() > 0.5 ? "Bien" : "Mal", // Genera aleatoriamente "Bien" o "Mal"
        fecha: new Date().toISOString().split("T")[0],
        hora: new Date().toISOString().split("T")[1].split(".")[0],
        id: terminalId,
      };

      await opinionsRef.push(newOpinion); // Agrega la nueva opinión a Firebase
      console.log("Nueva opinión añadida:", newOpinion);
    } else {
      console.log(`Límite de opiniones alcanzado para el terminal ${terminalId}.`);
    }
  } catch (error) {
    console.error("Error al simular opinión:", error);
  }
};


// setInterval(simulateOpinion, 15000); // cada 15 segundos

// Escuchar en el puerto
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

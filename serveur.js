require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const admin = require("./databaseConfig");

// Acceso a la base de datos
const app = express();
const port = 8000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Middleware para analizar JSON

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
app.get("/db", async (req, res) => {
  try {
    const ref = admin.database().ref("/");
    const snapshot = await ref.once("value");
    const data = snapshot.val();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener los datos de Firebase:", error);
    res.status(500).json({ error: "Error al obtener los datos de Firebase" });
  }
});

// app.post("/register-worker", async (req, res) => {
//   console.log(req.body); // Agrega esto para depurar
//   const { id, name, email, password, userType } = req.body;

//   // Asegúrate de que todos los campos requeridos estén presentes
//   if (!name || !email || !password) {
//     return res.status(400).json({ error: "Faltan campos requeridos." });
//   }

//   try {
//     const userRecord = await registerWorker(req.body);
//     return res.status(201).json({
//       uid: userRecord.uid,
//       message: "Trabajador registrado exitosamente.",
//     });
//   } catch (error) {
//     console.error("Error al crear usuario trabajador:", error);
//     return res.status(500).json({ error: "Error al registrar el trabajador." });
//   }
// });

// Ruta para contar todas las opiniones
app.get("/count-opinions", async (req, res) => {
  try {
    const ref = admin.database().ref("/opiniones");
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
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
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

// Ruta para contar solo las apreciaciones positivas del rating ("Bien")
app.get("/count-positive-opinions", async (req, res) => {
  try {
    const ref = admin.database().ref("/opiniones");
    const snapshot = await ref.once("value");
    const opinionsData = snapshot.val();

    const positiveCounts = [];

    for (const terminalId in opinionsData) {
      const opinions = opinionsData[terminalId];
      let positiveCount = 0;

      for (const timestamp in opinions) {
        const opinion = opinions[timestamp];
        if (opinion.apreciacion === "4" || opinion.apreciacion === "5") {
          positiveCount++;
        }
      }

      positiveCounts.push({ terminalId, positiveCount });
    }

    // Ordenar los baños por la cantidad de apreciaciones "Bien"
    positiveCounts.sort((a, b) => b.positiveCount - a.positiveCount);

    res.json(positiveCounts);
  } catch (error) {
    console.error("Error counting positive opinions:", error);
    res.status(500).json({ error: "Error counting positive opinions" });
  }
});

// Monitoreo de las reacciones y envío de alertas si se superan los umbrales
const monitorReactions = () => {
  const terminalRef = admin.database().ref("Terminales");

  terminalRef.on("value", (snapshot) => {
    const terminals = snapshot.val();

    if (terminals) {
      Object.entries(terminals).forEach(([terminalId, terminalData]) => {
        const umbral = terminalData.umbral || 0;

        const opinionsRef = admin
          .database()
          .ref(`opiniones/${terminalData.ID}`);
        opinionsRef.on("value", (opinionsSnapshot) => {
          const opinionsData = opinionsSnapshot.val() || {};
          const totalOpinions = Object.keys(opinionsData).length;

          let negativeReactions = 0;

          Object.values(opinionsData).forEach((opinion) => {
            if (opinion.apreciacion === "1" || opinion.apreciacion === "2") {
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

const sendAlert = async (terminalId, reaccionesNegativas, umbral) => {
  const mensaje = `El terminal '${terminalId}' saltó una alerta de reacciones negativas\nCantidad: ${reaccionesNegativas} / Umbral: ${umbral}\nSe requiere atención de mantenimiento!`;
  console.log(mensaje);

  try {
    // Obtener el token de registro del dispositivo asociado al terminal o usuario
    const tokenSnapshot = await admin
      .database()
      .ref(`tokens/${terminalId}`)
      .once("value");
    const deviceToken = tokenSnapshot.val();

    // Si no hay token, no se envia la notificacion
    if (!deviceToken) {
      console.log(
        `No se encontro token de registro para el terminal ${terminalId}`
      );
      return;
    }

    // Configuracion de la notificacion
    const payload = {
      notification: {
        title: "Alerta de Mantenimiento",
        body: mensaje,
      },
      data: {
        terminalId: terminalId,
        reaccionesNegativas: reaccionesNegativas.toString(),
        umbral: umbral.toString(),
      },
    };

    // Opcional: Configuracion adicional, por ejemplo, prioridad de la noti
    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24, // 1 día
    };

    // Enviar la notif FCM
    await admin.messaging().sendToDevice(deviceToken, payload, options);
    console.log(
      `Notificacion enviada a ${deviceToken} para el terminal ${terminalId}`
    );
  } catch (error) {
    console.error("Error enviando la notificacion:", error);
  }
};

// Ruta para actualizar el umbral
app.post("/update-dynamic-threshold", async (req, res) => {
  try {
    const terminalRef = admin.database().ref("Terminales");
    const snapshot = await terminalRef.once("value");
    const terminals = snapshot.val();

    if (terminals) {
      await Promise.all(
        Object.entries(terminals).map(async ([terminalId, terminalData]) => {
          const opinionsRef = admin
            .database()
            .ref(`opiniones/${terminalData.ID}`);
          const opinionsSnapshot = await opinionsRef.once("value");
          const opinionsData = opinionsSnapshot.val() || {};

          const totalOpinions = Object.keys(opinionsData).length;
          let negativeReactions = 0;

          Object.values(opinionsData).forEach((opinion) => {
            if (
              opinion.apreciacion === "1" ||
              opinion.apreciacion === "2"
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
  const terminalRef = admin.database().ref("Terminales");
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

// // Funcion de prueba para simular una nueva opinion
// const simulateOpinion = async () => {
//   const terminalId = "00001"; // Cambia al ID correspondiente
//   const opinionsRef = admin.database().ref(`opiniones/${terminalId}`);

//   try {
//     const snapshot = await opinionsRef.once("value");
//     const existingOpinions = snapshot.val() || {};
//     const totalOpinions = Object.keys(existingOpinions).length;

//     // Si el total de opiniones es menor a un cierto límite, se permite agregar una nueva
//     if (totalOpinions < 100) {
//       // Cambia 100 al límite deseado
//       const newOpinion = {
//         apreciacion: Math.random() > 0.5 ? "Bien" : "Mal", // Genera aleatoriamente "Bien" o "Mal"
//         fecha: new Date().toISOString().split("T")[0],
//         hora: new Date().toISOString().split("T")[1].split(".")[0],
//         id: terminalId,
//       };

//       await opinionsRef.push(newOpinion); // Agrega la nueva opinión a Firebase
//       console.log("Nueva opinión añadida:", newOpinion);
//     } else {
//       console.log(
//         `Límite de opiniones alcanzado para el terminal ${terminalId}.`
//       );
//     }
//   } catch (error) {
//     console.error("Error al simular opinión:", error);
//   }
// };

// setInterval(simulateOpinion, 15000); // cada 15 segundos

// async function registerWorker(workerData) {
//   try {
//     const { name, email, password, userType } = workerData;

//     // Crear el usuario en Firebase Authentication
//     const userRecord = await admin.auth().createUser({
//       email: email,
//       password: password,
//       displayName: name,
//     });

//     // Asignar el tipo de usuario como reclamo personalizado
//     await admin
//       .auth()
//       .setCustomUserClaims(userRecord.uid, { userType: userType });

//     console.log("Usuario trabajador creado:", userRecord.uid);
//     return userRecord;
//   } catch (error) {
//     console.error("Error al crear usuario trabajador:", error);
//     throw error;
//   }
// }

// Iniciar el monitoreo de reacciones
monitorReactions();

// Escuchar en el puerto
server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// module.exports = { registerWorker };

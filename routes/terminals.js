const express = require("express");
const router = express.Router();
const { admin } = require("../firebase/databaseConfig");

// Ruta para obtener toda la realtime database
router.get("/db", async (req, res) => {
  try {
    const snapshot = await admin.database().ref("/").once("value");
    const data = snapshot.val();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).send("Error al obtener datos");
  }
});

// Ruta para contar la cantidad de terminales disponibles
router.get("/count-terminals", async (req, res) => {
  try {
    const terminalRef = admin.database().ref("/Terminales");
    const snapshot = await terminalRef.once("value");
    const terminals = snapshot.val();
    res.json(terminals);
  } catch (error) {
    console.error("Error al contar terminales:", error);
    res.status(500).json({ error: "Error al contar terminales" });
  }
});

// Ruta para actualizar el umbral
router.post("/update-dynamic-threshold", async (req, res) => {
  try {
    const terminalRef = admin.database().ref("Terminales");
    const snapshot = await terminalRef.once("value");
    const terminals = snapshot.val();
    console.log(req);
    
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
            if (opinion.apreciacion === "1" || opinion.apreciacion === "2") {
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

// Iniciar el monitoreo de reacciones
monitorReactions();

module.exports = router;

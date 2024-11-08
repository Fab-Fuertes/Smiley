const express = require("express");
const router = express.Router();
const { admin } = require("../firebase/databaseConfig");

// Ruta para contar solo las apreciaciones positivas del rating ("Bien")
router.get("/count-positive-opinions", async (req, res) => {
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

// Ruta para contar todas las opiniones
router.get("/overall-opinions", async (req, res) => {
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
            opinionCounts[terminalId] = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          }
          opinionCounts[terminalId][opinion.apreciacion]++;
        }
      }
  
      res.json(opinionCounts);
    } catch (error) {
      console.error("Error contando opiniones:", error);
      res.status(500).json({ error: "Error contando opiniones" });
    }
  });

module.exports = router;

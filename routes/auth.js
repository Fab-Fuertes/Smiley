const express = require("express");
const router = express.Router();
const {
  signUpWorker,
  logIn,
  getWorkers,
} = require("../firebase/firebase_auth");

// Ruta para el registro de usuarios (trabajadores o fundaciones)
router.post("/signup", async (req, res) => {
  try {
    const userId = await signUpWorker(req.body); // Llama a la función de registro
    if (userId) {
      res
        .status(201)
        .json({ userId, message: "Usuario registrado exitosamente" }); // Responde con el userId y mensaje de éxito
    } else {
      res
        .status(400)
        .json({ message: "Error en el registro. El usuario ya existe." }); // Si el usuario ya existe, devuelve error 400
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(500).json({ error: "Error al registrar usuario" }); // Error interno del servidor
  }
});

// Ruta para el inicio de sesión de usuarios
router.post("/login", async (req, res) => {
  const { tokenID } = req.body;
  console.log("Token recibido en backend:", tokenID);
  try {
    const loginResponse = await logIn(tokenID);
    if (loginResponse) {
      res.status(200).json({
        message: "Inicio de sesión exitoso",
        userId: loginResponse.userId,
        userData: loginResponse.userData,
      });
    } else {
      res.status(401).json({ message: "Credenciales no válidas" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// Ruta para obtener los trabajadores de un usuario específico
router.get("/:userId/workers", async (req, res) => {
  const { userId } = req.params;
  try {
    const workers = await getWorkers(userId);
    if (workers.length > 0) {
      res.status(200).json(workers);
    } else {
      res
        .status(404)
        .json({ message: "No se encontraron trabajadores para este usuario" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener trabajadores" });
  }
});

module.exports = router;

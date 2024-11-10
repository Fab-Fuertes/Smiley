const { auth, admin } = require("./databaseConfig"); // Asegúrate de que apunta al archivo correcto

async function logIn(tokenID) {
  try {
    // Verificar el tokenID con Firebase Admin y obtener el UID del usuario
    const decodedToken = await admin.auth().verifyIdToken(tokenID);
    const uid = decodedToken.uid;

    // Obtener los datos del usuario desde Firestore usando el UID
    const docRef = admin.firestore().collection("workers").doc(uid);
    const docSnap = await docRef.get();
    const userData = docSnap.exists ? docSnap.data() : null;

    // Verificar si se obtuvieron los datos del usuario
    if (!userData) {
      throw new Error("Usuario no encontrado en la colección 'workers'");
    }

    return { userId: uid, userData };
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    return null;
  }
}

async function emailVerification(email) {
  try {
    const userRecord = await auth.getUserByEmail(email);
    console.log("El usuario ya existe:", userRecord.uid);
    return userRecord.uid;
  } catch (error) {
    if (error.code !== "auth/user-not-found") {
      console.error("Error al verificar email:", error);
    }
    return null;
  }
}

async function signUpWorker(data) {
  try {
    const existingUser = await emailVerification(data.email);
    console.log("Resultado de la verificación de correo:", existingUser); // Para verificar si el correo ya existe.

    if (existingUser) {
      console.log("El usuario ya existe:", existingUser);
      return { message: "Error en el registro. El usuario ya existe." };
    }

    // Crear el usuario en Firebase Auth
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: `${data.name} ${data.last_name}`,
    });

    const userId = userRecord.uid;

    // Guardar los datos del trabajador en la colección "workers" de Firestore
    await admin.firestore().collection("workers").doc(userId).set({
      userId, // Agregar como campo en el documento
      email: data.email,
      name: data.name,
      last_name: data.last_name,
      phone: data.phone,
      role: data.role,
      createdAt: new Date(),
    });

    return { message: "Registro exitoso", userId: userId };
  } catch (error) {
    console.error("Error al registrar trabajador:", error);
    return { message: "Error en el registro", error: error.message };
  }
}

async function getWorkers(userId) {
  try {
    const workersRef = admin.firestore().collection("workers");
    const snapshot = await workersRef.where("userId", "==", userId).get();

    if (snapshot.empty) {
      console.log("No se encontraron trabajadores para este usuario.");
      return [];
    }

    const workers = [];
    snapshot.forEach((doc) => {
      workers.push({ id: doc.id, ...doc.data() });
    });

    return workers;
  } catch (error) {
    console.error("Error obteniendo trabajadores:", error);
    return [];
  }
}

async function getWorkerById(id) {
  try {
    const workerRef = admin.firestore().collection("workers").doc(id);
    const docSnap = await workerRef.get();

    if (!docSnap.exists) {
      console.log("Trabajador no encontrado.");
      return null;
    }

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error("Error obteniendo trabajador:", error);
    return null;
  }
}

module.exports = {
  signUpWorker,
  logIn,
  getWorkers,
  getWorkerById,
};

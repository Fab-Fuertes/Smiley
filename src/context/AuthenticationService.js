//import { auth, firestore } from "../../firebaseConfig";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";

import Worker from "../classes/Worker"; // Importa la clase para instanciar

// export const signUpAWorker = async (
//   email,
//   password,
//   name,
//   last_name,
//   phone,
//   role
// ) => {
//   try {
//     // Validaciones
//     if (!last_name || !phone || !email || !password || !name || !role) {
//       throw new Error("Todos los campos son obligatorios");
//     }

//     // Crear el usuario en Firebase Authentication
//     const userCredential = await auth().createUserWithEmailAndPassword(
//       auth,
//       email,
//       password
//     );
//     const user = userCredential.user;

//     // Crear el objeto Worker para el trabajador
//     const worker = new Worker(name, last_name, email, phone, role);

//     // Guardar los datos del usuario en Firestore
//     const userRef = firestore().collection("workers").doc(user.uid);
//     await userRef.set({
//       name: worker.getName(),
//       last_name: worker.getLastName(),
//       email: worker.getEmail(),
//       phone: worker.getPhone(),
//       role: worker.getUserType(),
//       createdAt: worker.getCreatedAt(),
//     });
//     console.log("User account registered!");
//     return worker;
//   } catch (error) {
//     console.error("Error al registrar el usuario:", error);
//     throw new Error("Error al registrar el usuario: " + error.message);
//   }
// };

export const signInAWorker = async (email, password) => {
  try {
    // Validación de campos
    if (!email || !password) {
      throw new Error("Email y contraseña son obligatorios");
    }

    // Validación del dominio del correo
    const domain = "@unimet.edu.ve";
    if (!email.endsWith(domain)) {
      throw new Error(`Solo los correos con dominio ${domain} pueden acceder`);
    }

    // Iniciar sesión con Firebase Authentication
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user;

    console.log("User account logged in!");

    // Obtener el token del usuario
    const token = await user.getIdToken();

    // Obtener los datos del usuario en Firestore
    const userRef = firestore().collection("workers").doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error("El usuario no existe en la base de datos");
    }

    const userData = userDoc.data();
    console.log("Datos del usuario:", userData);

    // Retornar el token y UID
    return { token, uid: user.uid };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw new Error("Error al iniciar sesión: " + error.message);
  }
};

export const fetchWorkerData = async (uid) => {
  try {
    const userRef = firestore().collection("workers").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      throw new Error("El usuario no existe en la base de datos");
    }

    const userData = userDoc.data();
    console.log("Datos del usuario:", userData);

    // Crear una instancia de Worker con los datos obtenidos
    const worker = new Worker(
      userData.name,
      userData.last_name,
      userData.email,
      userData.phone,
      userData.role
    );

    // Configurar los atributos adicionales
    worker._createdAt = userData.createdAt;
    worker._completedTasks = userData.completedTasks || [];
    worker._negativeOpinions = userData.negativeOpinions || [];
    worker._isWorking = userData.isWorking || false;

    return worker;
  } catch (error) {
    console.error("Error al obtener datos del Worker:", error);
    throw error;
  }
};

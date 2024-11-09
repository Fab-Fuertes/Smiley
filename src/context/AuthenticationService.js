import { createUserWithEmailAndPassword } from '@firebase/auth';
import {auth, firestore} from "../../firebaseConfig";

import Worker from "../classes/Worker"; // Importa la clase para instanciar

export const signUpAWorker = async (name, last_name, email, phone, password) => {
  try {
    // Validaciones
    if (!last_name || !phone || !email || !password || !name) {
      throw new Error('Todos los campos son obligatorios');
    }

    // Crear el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Crear el objeto Worker para el trabajador
    const worker = new Worker(name,last_name, email, phone);

    // Guardar los datos del usuario en Firestore
    const userRef = firestore().collection("workers").doc(user.uid);
    await userRef.set({
      name: worker.getName(),
      last_name: worker.getLastName(),
      email: worker.getEmail(),
      phone: worker.getPhone(),
      role: worker.getUserType(),
      createdAt: worker.getCreatedAt(),
    });

    return worker;
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    throw new Error('Error al registrar el usuario: ' + error.message);
  }
};

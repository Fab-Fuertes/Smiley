import { createUserWithEmailAndPassword } from 'firebase/auth';
import auth from "@react-native-firebase/auth"; // Asegúrate de tener tu configuración de Firebase
import firestore from '@react-native-firebase/firestore';
import Worker from "../classes/Worker"; // importar la clase para instanciar

export const signUpAWorker = async (email, password, nombre) => {
    try {
      // Validaciones
      if (!email || !password || !nombre) {
        throw new Error('Todos los campos son obligatorios');
      }
  
      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Crear el objeto Usuario para el trabajador
      const trabajador = new Worker(nombre, email, password); // Cambia estos valores según tu estructura
  
      // Guardar los datos del usuario en Firestore
      const userRef = firestore().collection('workers').doc(user.uid);
      await userRef.set({
        nombre: trabajador.getName(),
        email: trabajador.getEmail(),
        tipo: trabajador.getUserType(), // Especificamos el tipo de usuario
      });
  
      // Devolver el usuario
      return trabajador;
    } catch (error) {
      throw new Error('Error al registrar el usuario: ' + error.message);
    }
  };
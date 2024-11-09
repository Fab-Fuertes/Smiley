import { signInWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../../firebaseConfig";

export async function signInWithEmailAndPasswordAndFetchUserData(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;
      console.log("Usuario autenticado con ID:", userId);
      return userId;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return null;
    }
  }
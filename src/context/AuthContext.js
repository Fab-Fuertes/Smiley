import React, { createContext, useState, useContext, useEffect } from "react";
import { signInAWorker, fetchWorkerData } from "./AuthenticationService"; // Importa la función de signUp
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Información básica del usuario
  const [worker, setWorker] = useState(null); // Información del Worker
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        setIsAuthenticated(true);
        setUser(userAuth);

        // Utilizar fetchWorkerData para obtener y establecer el trabajador
        const workerInstance = await fetchWorkerData(userAuth.uid);
        setWorker(workerInstance);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setWorker(null);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const { token, uid } = await signInAWorker(email, password); // Usamos la función de login
      setUser({ uid, email }); // Establecemos el usuario
      setIsAuthenticated(true);

      // Obtener datos adicionales del Worker
      const workerDoc = await firestore().collection("workers").doc(uid).get();
      if (workerDoc.exists) {
        setWorker(workerDoc.data());
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const logout = async () => {
    try {
      await auth().signOut();
      setUser(null);
      setWorker(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // const register = async (email, password, name, last_name, phone, role) => {
  //   try {
  //     const worker = await signUpAWorker(
  //       email,
  //       password,
  //       name,
  //       last_name,
  //       phone,
  //       role
  //     );
  //     setUser(worker); // Guardamos el usuario recién registrado
  //     setIsAuthenticated(true);
  //     setWorker(worker);
  //   } catch (error) {
  //     console.error("Error al registrar el trabajador:", error);
  //   }
  // };

  const value = {
    isAuthenticated,
    user,
    worker,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { createContext, useState, useContext } from "react";
import { signUpAWorker } from "./AuthenticationService"; // Importa la función de signUp

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Funcion encargada de recibir la informacion de autenticacion
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Función para iniciar sesión
  const login = (user) => {
    setIsAuthenticated(true);
    setUser(user);
  };

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  // Función para registrar un usuario
  const registerUser = async (email, password, nombre) => {
    try {
      const newUser = await signUpAWorker(email, password, nombre);
      login(newUser);
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    registerUser
  };

  return (
    <AuthContext.Provider value={{ value }}>{children}</AuthContext.Provider>
  );
};

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext"; // Usar el contexto de autenticación
import { useNavigation } from "@react-navigation/native"; // Importar el hook useNavigation

export default function WelcomeScreen() {
  const { isAuthenticated, user } = useAuth(); // Accedemos al estado de autenticación
  const navigation = useNavigation(); // Usar el hook useNavigation para obtener el objeto navigation

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        {isAuthenticated
          ? `¡Bienvenido de nuevo, ${user?.name || "Usuario"}!`
          : "¡Bienvenido! Inicia sesión para continuar."}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          isAuthenticated
            ? navigation.navigate("Home")
            : navigation.navigate("Login")
        }
      >
        <Text style={styles.buttonText}>
          {isAuthenticated ? "Ir a la página de inicio" : "Comenzar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4D94FF", // Color azul más vibrante
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20, // Agregado para evitar que el texto se pegue a los bordes
  },
  welcomeText: {
    fontSize: 28,
    marginBottom: 40,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#FF6F61", // Color de fondo del botón (un color llamativo)
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 50, // Asegura que el botón esté más cerca de la parte inferior
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useAuth } from "../context/AuthContext"; // Usar el contexto de autenticación
import { useNavigation } from "@react-navigation/native"; // Importar el hook useNavigation

export default function WelcomeScreen() {
  const { isAuthenticated, user } = useAuth(); // Accedemos al estado de autenticación
  const navigation = useNavigation(); // Usar el hook useNavigation para obtener el objeto navigation

  return (
    <View style={styles.container}>
             <View style={styles.imageContainer}>
        <Image
          style={styles.image1}
          source={require("../../assets/smileylogo.png")}
        />
      </View>
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
    backgroundColor: "#190747", // Color de fondo principal
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 30,
    marginBottom: 50,
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "serif",
  },
  button: {
    backgroundColor: "#FF0000", // Color llamativo para el botón
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  imageContainer: {
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    marginTop: 10, // Espaciado superior opcional
  },
  image1: {
    width: 380,
    height: 180,
    borderRadius: 3,
    marginBottom: 20,
    borderWidth: 4,
  },
});

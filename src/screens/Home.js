import React from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext"; // Importar el contexto de autenticación
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importar el hook de navegación

export default function Home() {
  const { user, logout, worker } = useAuth(); // Accedemos al usuario del contexto de autenticación
  const navigation = useNavigation();

  if (!user && !worker) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    ); // Asegúrate de mostrar algo mientras se carga el usuario
  }

  const handleSignOut = async () => {
    try {
      await logout(); // Llamamos al método logout del contexto
      Alert.alert("Has cerrado sesión... ¡Hasta la próxima!");
      navigation.navigate("WelcomeScreen"); // Redirigir a la pantalla de bienvenida
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.imageContainer}>
        <Image
          style={styles.image1}
          source={require("../../assets/smileylogo.png")}
        />
      </View>
      <Image
        style={styles.image}
        source={require("../../assets/imagen23.png")}
      />
      <Text style={styles.welcomeText}>
        Bienvenido: {worker?.getName() || "Usuario"}!
      </Text>
      <Text style={styles.text}>Email: {worker?.getEmail()}</Text>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleSignOut}
        activeOpacity={0.8}
      >
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#190747",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    backgroundColor: "#007BFF",
    padding: 20,
    width: "100%",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    fontFamily: "serif",
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 35,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#007BFF",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "serif",
  },
  text: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "sans-serif",
  },
  divider: {
    height: 1,
    width: "80%",
    backgroundColor: "#DDD",
    marginVertical: 20,
  },
  logoutButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F4F8",
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
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

import React from "react";
import { View, Text, Button, Alert, StyleSheet, Image } from "react-native";
import { useAuth } from "../context/AuthContext"; // Importar el contexto de autenticación
import { SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Importar el hook de navegación

export default function Home() {
  const { user, logout, worker } = useAuth(); // Accedemos al usuario del contexto de autenticación
  const navigation = useNavigation();

  if (!user && !worker) {
    return <Text>Cargando...</Text>;  // Asegúrate de mostrar algo mientras se carga el usuario
  }
  
  const handleSignOut = async () => {
    try {
      await logout(); // Llamamos al método logout del contexto
      Alert.alert("Has cerrado sesión... Hasta la próxima!");
      navigation.navigate("WelcomeScreen"); // Redirigir a la pantalla de bienvenida
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>SMILEY</Text>
      <Image
        style={styles.image}
        source={require("../../assets/imagen23.png")}
      />
      <Text style={styles.welcomeText}>
        Bienvenido: {worker?.getName() || "Usuario"}!
      </Text>
      <Text style={styles.texto2}>Email: {worker?.getEmail()}</Text>
      
      <Button title="Cerrar sesión" onPress={handleSignOut} color="#FF0000" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    fontFamily: "serif",
  },
  texto2: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    marginBottom: 25,
    fontFamily: "serif",
  },
  slogan2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 25,
    fontFamily: "serif",
  },
  slogan: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "justify",
    marginBottom: 15,
    fontFamily: "serif",
  },
  image: {
    width: 199,
    height: 199,
    marginBottom: 30,
    borderRadius: 50,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "serif",
    fontStyle: "italic",
    marginBottom: 10,
  },
});

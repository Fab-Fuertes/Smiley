import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image
} from "react-native";
import { useAuth } from "../context/AuthContext"; // Usamos el contexto de autenticación
import { useNavigation } from "@react-navigation/native"; // Importar el hook de navegación
import { signInAWorker } from "../context/AuthenticationService";

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    if (!email || !password) {
      Alert.alert("Error", "Por favor, asegúrese de completar todos los campos.");
      setIsLoading(false);
      return;
    }

    try {
      const { token, uid } = await signInAWorker(email, password);
      const response = await fetch(
        "https://smiley-web-service.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokenID: token }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        login(email, password);
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", data.message || "Algo salió mal, intenta de nuevo.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Hubo un problema al iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
            <Text style={styles.title}>Bienvenido a Smiley</Text>

            <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/personaperfil.png")}
        />
      </View>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate aquí</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#190747",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#b0b0ff",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    backgroundColor: "#3ed532",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ffa49f",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 16,
    color: "#AAAAFF",
    textAlign: "center",
  },
  registerLink: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  imageContainer: {
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    marginTop: 10, // Espaciado superior opcional
  },
  image: {
    width: 130, // Ancho deseado
    height: 130, // Altura deseada
    borderRadius: 50, // Hace la imagen redonda
    marginBottom: 5, // Espaciado con respecto a otros elementos
  },
});

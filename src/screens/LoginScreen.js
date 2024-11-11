import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext"; // Usamos el contexto de autenticación
import Worker from "../classes/Worker";
import { signInAWorker } from "../context/AuthenticationService";
import { useNavigation } from "@react-navigation/native"; // Importar el hook de navegación

export default function LoginScreen() {
  const { login } = useAuth();

  const navigation = useNavigation(); // Obtener hook de navegación

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    if (!email || !password) {
      Alert.alert(
        "Error",
        "Por favor, asegúrese de completar todos los campos."
      );
      setIsLoading(false);
      return;
    }

    try {
      // Autentica al usuario y obtén el `tokenID` y `uid`
      const { token, uid } = await signInAWorker(email, password);

      console.log("Token recibido:", token);
      console.log("UID recibido:", uid);

      // Realiza la solicitud de inicio de sesión al backend
      const response = await fetch(
        "https://smiley-web-service.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenID: token }), // Envía el tokenID y uid al backend
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log("Inicio de sesión exitoso:", data);

        //
        login(email, password);
        
        // Navegar a Home después de un login exitoso
        navigation.navigate("Home");
      } else {
        console.error("Error al iniciar sesión:", data.message);
        Alert.alert(
          "Error",
          data.message || "Algo salió mal, por favor intenta de nuevo."
        );
      }
    } catch (error) {
      console.error("Error de autenticación en frontend:", error.message);
      Alert.alert(
        "Error",
        error.message || "Hubo un problema al iniciar sesión."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceda a Smiley</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar sesión"
          onPress={handleLogin}
          disabled={isLoading}
        />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? Regístrate aquí!
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  registerText: {
    color: "blue",
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../context/AuthContext"; // Usamos el contexto de autenticación
import {signInWithEmailAndPasswordAndFetchUserData} from '../context/auth';
import Worker from '../classes/Worker';

export default function LoginScreen({
  onLoginSuccess,
  navigateToRegister,
  onGuestLogin,
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    if (!email || !password) {
      Alert.alert("Error", "Por favor llene todos los campos");
      setIsLoading(false);
      return;
    }

    try {
      // Autenticar al usuario y obtener su ID
      const userId = await signInWithEmailAndPasswordAndFetchUserData(
        email,
        password
      );
      if (!userId) {
        Alert.alert(
          "Error",
          "El usuario no existe o la contraseña es incorrecta"
        );
        setIsLoading(false);
        return;
      }

      // Realizar la solicitud al backend para obtener los datos del usuario
      const response = await fetch(
        "https://smiley-web-service.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenID: userId }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const userData = responseData.userId;

        // Crear un nuevo objeto Worker y asignarlo al contexto
        const worker = new Worker(
          userId,
          userData.name,
          userData.email,
          userData.lastname,
          userData.phone,
        );
        login(worker);
        Alert.alert("Éxito", "Inicio de sesión exitoso");
        onLoginSuccess();
      } else {
        Alert.alert("Error", "Error en el servidor");
      }
    } catch (error) {
      Alert.alert("Error", "Error en el proceso de autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio de Sesión</Text>
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
      <Button
        title="Iniciar sesión"
        onPress={handleLogin}
        disabled={isLoading}
      />

      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? Regístrate aquí!
        </Text>
      </TouchableOpacity>

      <Button
      styles={styles.anonymousButtonContainer}
        title="Acceder como invitado"
        onPress={onGuestLogin}
        color="#808080"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "space-between", padding: 16 },
  formContainer: { flex: 1, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginVertical: 10 },
  registerText: {
    color: "blue",
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  anonymousButtonContainer: {
    marginBottom: 69,
  },
});

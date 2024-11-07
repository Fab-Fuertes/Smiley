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
import auth from "@react-native-firebase/auth";


export default function LoginScreen({
  setPassword,
  onLoginSuccess,
  navigateToRegister,
  onGuestLogin,
}) {
  const [email, setEmail] = useState("");
  const [localPassword, setLocalPassword] = useState("");

  const handleSignIn = () => {
    if (localPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    auth()
      .signInWithEmailAndPassword(email, localPassword)
      .then(() => {
        Alert.alert("Usuario autenticado!");
        setPassword(localPassword);
        onLoginSuccess();
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const handleAnonymousSignIn = () => {
    auth()
      .signInAnonymously()
      .then(() => {
        Alert.alert("Has accedido como invitado");
        onGuestLogin(); // Llama a la función para redirigir al área común
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
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
          value={localPassword}
          onChangeText={setLocalPassword}
          secureTextEntry
        />
        <Button title="Iniciar sesión" onPress={handleSignIn} />

        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.registerText}>
            No posee una cuenta? Regístrese aquí!
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.anonymousButtonContainer}>
        <Button
          title="Acceder sin registro"
          onPress={handleAnonymousSignIn}
          color="#808080"
        />
      </View>
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

// RegisterScreen.js
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

// import auth from "@react-native-firebase/auth";
import { useAuth } from "../context/AuthContext";
//import { signUpAWorker } from "../context/AuthenticationService";

export default function RegisterScreen({
  setName,
  setPassword,
  onRegisterSuccess,
  navigateToLogin,
}) {
  const { registerUser } = useAuth();
  const [email, setEmail] = useState("");
  const [localName, setLocalName] = useState("");
  const [localPassword, setLocalPassword] = useState("");

  const handleSignUp = async () => {
    //event.preventDefault();

    if (localPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!email || !localPassword) {
      Alert.alert(
        "Error",
        "La contraseña y correo son campos requeridos para su registro."
      );
      return;
    }

    if(!localName){
        Alert.alert("Error", "Por favor ingrese su nombre.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error","Por favor ingrese un correo valido.");
      return;
    }

    try {
      await registerUser(email, localPassword, localName);
      Alert.alert("Cuenta de usuario creada satisfactoriamente!");
      onRegisterSuccess();

    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={localName}
        onChangeText={setLocalName}
      />
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
      <Button title="Registrar" onPress={handleSignUp} />

      <TouchableOpacity onPress={navigateToLogin}>
        <Text style={styles.loginText}>
          ¿Ya tienes una cuenta? Inicia sesión aquí!
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 10, marginVertical: 10 },
  loginText: {
    color: "blue",
    marginTop: 15,
    textAlign: "center",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

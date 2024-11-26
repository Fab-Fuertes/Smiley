import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importar Picker
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
  const { login } = useAuth();
  const navigation = useNavigation();

  const roles = ["Limpieza", "Administración", "Técnico", "Gerente"];
  const [role, setRole] = useState("Limpieza");
  const [email, setEmail] = useState("");
  const [localName, setLocalName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
    if (!email || !localPassword || !localName || !lastName || !phone) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      setIsLoading(false);
      return;
    }
    if (localPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Por favor ingrese un correo válido.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://smiley-web-service.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: localPassword,
            name: localName,
            last_name: lastName,
            phone: phone,
            role: role,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Registro exitoso", "Cuenta creada satisfactoriamente.");
        login(email, localPassword);
        navigation.navigate("Home");
      } else {
        Alert.alert(
          "Error",
          data.message || "Algo salió mal, por favor intenta de nuevo."
        );
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Hubo un problema al registrar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea tu cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={localName}
        onChangeText={setLocalName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Selecciona tu rol</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        {roles.map((roleItem, index) => (
          <Picker.Item key={index} label={roleItem} value={roleItem} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={localPassword}
        onChangeText={setLocalPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>
          ¿Ya tienes una cuenta? Inicia sesión aquí.
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
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#3ed532",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#FF9B8D",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    color: "#FFD700",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    textDecorationLine: "underline",
  },
});

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
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native"; // Importar el hook de navegación
import { Picker } from "@react-native-picker/picker"; // Importar el componente Picker
import Worker from "../classes/Worker";

export default function RegisterScreen() {
  const { login } = useAuth(); // Obtén la función de registro del contexto
  const navigation = useNavigation(); // Hook de navegación para redirigir

  // Definir los roles disponibles
  const roles = ["Limpieza", "Administración", "Técnico", "Gerente"];
  const [role, setRole] = useState("Limpieza"); // Estado para el rol seleccionado

  const [email, setEmail] = useState("");
  const [localName, setLocalName] = useState("");
  const [lastName, setLastName] = useState(""); // Nuevo campo para el apellido
  const [phone, setPhone] = useState(""); // Nuevo campo para el teléfono
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
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
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
        // Registro exitoso
        console.log("Registro exitoso:", data);
        Alert.alert("Cuenta de usuario creada satisfactoriamente!");
        login(data.email, data.password);
        // Navegar a Home
        navigation.navigate("Home");
      } else {
        console.error("Error al registrar el usuario:", data.message);
        Alert.alert(
          "Error",
          data.message || "Algo salió mal, por favor intenta de nuevo."
        );
      }
    } catch (error) {
      console.error("Error al registrar el usuario:", error);

      // Asegúrate de manejar el error de forma que no cause más errores
      Alert.alert(
        "Error",
        error.message || "Hubo un problema al registrar el usuario."
      );
    } finally {
      setIsLoading(false);
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
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Campo de selección para los roles */}
      <Text style={styles.label}>Seleccione un rol</Text>
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)} // Actualizar el estado de role
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

      <Button title="Registrar" onPress={handleSignUp} disabled={isLoading} />

      {/* {isLoading && <ActivityIndicator size="large" color="#0000ff" />} */}

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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

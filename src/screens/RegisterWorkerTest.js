import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
} from "react-native";
import Worker from "../classes/Worker";
import auth from "@react-native-firebase/auth";
import { Alert } from "react-native";

const RegisterWorker = () => {
  // Configurar la URL del backend
  let backendURL;
  if (Platform.OS === "web") {
    backendURL = "http://localhost:8000";
  } else {
    backendURL = "http://10.0.2.2:8000";
  }

  const signUpTest = () => {
    auth()
      .createUserWithEmailAndPassword("emailTest@gmail.com", "Password")
      .then(() => {
        Alert.alert("User Created!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Registro de Trabajador</Text>
      <TextInput placeholder="Nombre" style={styles.input} />
      <TextInput placeholder="Email" style={styles.input} />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={styles.input}
      />
      <Button title="Registrar Trabajador" onPress={signUpTest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default RegisterWorker;

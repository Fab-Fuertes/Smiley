import { Text, StyleSheet, View, FlatList, Button, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native"; // Importar el hook de navegación

export default function Profile() {
  const { user, logout, worker } = useAuth(); // Accedemos al usuario del contexto de autenticación
  const navigation = useNavigation();

  if (!user && !worker) {
    return <Text>Cargando...</Text>; // Asegúrate de mostrar algo mientras se carga el usuario
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

  // Obtenemos la lista de tareas completadas
  const completedTasks = worker?.getCompletedTasks() || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <Text>Nombre: {worker.getName()}</Text>
      <Text>Apellido: {worker.getLastName()}</Text>
      <Text>Email: {worker.getEmail()}</Text>
      <Text>Rol: {worker.getWorkerRole()}</Text>
      <Text>Teléfono: {worker.getPhoneNumber()}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.subtitle}>Tareas Completadas:</Text>
        {completedTasks.length > 0 ? (
          <FlatList
            data={completedTasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={styles.taskItem}>• {item}</Text>
            )}
          />
        ) : (
          <Text>No hay tareas completadas aún.</Text>
        )}
      </View>

      <Button title="Cerrar sesión" onPress={handleSignOut} color="#FF0000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  taskItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  tasksContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
});

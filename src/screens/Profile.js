import { Text, StyleSheet, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, worker } = useAuth(); // Accedemos al usuario del contexto de autenticación
  if (!worker) {
    return <Text>Información de trabajador no disponible.</Text>;
  }
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

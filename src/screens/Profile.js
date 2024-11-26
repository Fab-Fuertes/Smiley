import { Text, StyleSheet, View, FlatList, Image } from "react-native";
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, worker } = useAuth(); // Accedemos al usuario del contexto de autenticación
  if (!worker) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noDataText}>
          Información de trabajador no disponible.
        </Text>
      </View>
    );
  }
  // Obtenemos la lista de tareas completadas
  const completedTasks = worker?.getCompletedTasks() || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require("../../assets/personaperfil.png")}
        />
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <Text style={styles.infoLabel}>Nombre:</Text>
        <Text style={styles.infoValue}>{worker.getName()}</Text>

        <Text style={styles.infoLabel}>Apellido:</Text>
        <Text style={styles.infoValue}>{worker.getLastName()}</Text>

        <Text style={styles.infoLabel}>Email:</Text>
        <Text style={styles.infoValue}>{worker.getEmail()}</Text>

        <Text style={styles.infoLabel}>Rol:</Text>
        <Text style={styles.infoValue}>{worker.getWorkerRole()}</Text>

        <Text style={styles.infoLabel}>Teléfono:</Text>
        <Text style={styles.infoValue}>{worker.getPhoneNumber()}</Text>
      </View>

      {/* Completed Tasks */}
      <View style={styles.tasksContainer}>
        <Text style={styles.subtitle}>Tareas Completadas</Text>
        {completedTasks.length > 0 ? (
          <FlatList
            data={completedTasks}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>• {item}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noTasks}>No hay tareas completadas aún.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#190747", // Fondo oscuro como en las pantallas anteriores
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  noDataText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  imageContainer: {
    justifyContent: "center", // Centra verticalmente
    alignItems: "center", // Centra horizontalmente
    marginTop: 10, // Espaciado superior opcional
  },
  image: {
    width: 100, // Ancho deseado
    height: 100, // Altura deseada
    borderRadius: 50, // Hace la imagen redonda
    marginBottom: 5, // Espaciado con respecto a otros elementos
  },
  profileContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: "#252A34",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#AAAAFF",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 15,
  },
  tasksContainer: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#252A34",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6200ea",
    marginBottom: 10,
  },
  taskItem: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#e8e8e8",
    borderRadius: 10,
  },
  taskText: {
    fontSize: 16,
    color: "#333",
  },
  noTasks: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 10,
  },
});

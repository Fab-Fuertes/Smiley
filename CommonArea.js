import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function CommonArea({ user, onLogout }) {
  const navigation = useNavigation();

  // Función para mostrar la alerta de confirmación de cierre de sesión
  const confirmLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", onPress: onLogout }, // Llama a la función onLogout pasada desde App
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Área Común</Text>
        <Text style={styles.text}>Hola, disfruta tu estancia!</Text>
        <TouchableOpacity onPress={confirmLogout} style={styles.button}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
        <Text style={styles.slogan}>
          Nuestro proyecto recopila, analiza y comparte las calificaciones
          detalladas de baños enviadas por los usuarios, garantizando que
          encuentres siempre un espacio higiénico, cómodo y acogedor donde más
          lo necesitas.
        </Text>
        <Text style={styles.slogan2}>
          Juntos, mejoramos los estándares de limpieza y comodidad en cada
          rincón de tu universidad.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
  },
});

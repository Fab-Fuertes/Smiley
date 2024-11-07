import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
// import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function CommonArea({ onLogout }) {
  // const navigation = useNavigation();

  const confirmLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", onPress: onLogout },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Área Común</Text>
      <Text style={styles.text}>Hola, disfruta tu estancia!</Text>
      
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

      <View style={styles.placeholdersContainer}>
        <TouchableOpacity
          style={styles.placeholder}
          onPress={() => Alert.alert("Placeholder", "Abrir Ranking")}
        >
          <Text style={styles.placeholderText}>Ranking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.placeholder}
          onPress={() => Alert.alert("Placeholder", "Abrir Monitor")}
        >
          <Text style={styles.placeholderText}>Monitor</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={confirmLogout} style={styles.button}>
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  placeholdersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  placeholder: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    padding: 20,
    marginHorizontal: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
  },
  slogan: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 15,
  },
  slogan2: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 15,
  },
});
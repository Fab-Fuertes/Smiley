import { Text, StyleSheet, View, FlatList } from "react-native";
import React, { useState, useEffect } from "react";

export default function MenuRating() {
  const [rankings, setRankings] = useState([]);

  // Configurar backendURL
  let backendURL =
    "https://smiley-web-service.onrender.com/api/opinions/count-positive-opinions";

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(backendURL);
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    };

    fetchRankings();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <Text style={styles.index}>#{index + 1}</Text>
      <View style={styles.cardContent}>
        <Text style={styles.letraBonita1}>
          Terminal 'Corimon', Piso ({item.terminalId})
        </Text>
        <Text style={styles.letraBonita2}>
          Apreciaciones Positivas: {item.positiveCount}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Baños Mejor Puntuados</Text>
      <FlatList
        data={rankings}
        renderItem={renderItem}
        keyExtractor={(item) => item.terminalId}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#190747", // Fondo oscuro como en las pantallas anteriores
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    textAlign: "center",
    fontFamily: "serif",
  },
  list: {
    paddingBottom: 10,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: "#252A34", // Fondo oscuro para las tarjetas
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  index: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700", // Amarillo dorado para el índice
    marginRight: 10,
  },
  cardContent: {
    flex: 1,
  },
  letraBonita1: {
    fontSize: 18,
    fontWeight: "600",
    color: "white", // Texto blanco sobre fondo oscuro
    fontFamily: "serif",
    marginBottom: 5,
  },
  letraBonita2: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#AAAAFF", // Azul claro para destacar el texto secundario
    fontFamily: "serif",
  },
});

import { Text, StyleSheet, View, Platform, FlatList } from "react-native";
import React, { useState, useEffect } from "react";

export default function MenuRating() {
  const [rankings, setRankings] = useState([]);

  // Configurar backendURL
  let backendURL;

  if (Platform.OS === "web") {
    backendURL = "http://localhost:8000";
  } else {
    backendURL = "http://10.0.2.2:8000";
  }

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(
          `${backendURL}/count-positive-opinions`
        );
        const data = await response.json();
        setRankings(data);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    };

    fetchRankings();
  }, []);

  const renderItem = ({ item, index }) => (
    <View style={styles.inputContainer}>
      <Text>
        {index + 1}. Terminal {item.terminalId} - Apreciaciones "Bien" o "Muy
        Bien": {item.positiveCount}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Baños mejor puntuados</Text>
      <FlatList
        data={rankings}
        renderItem={renderItem}
        keyExtractor={(item) => item.terminalId}
      />
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
  inputContainer: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
});

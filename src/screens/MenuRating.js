import { Text, StyleSheet, View, Platform, FlatList } from "react-native";
import React, { useState, useEffect } from "react";

export default function MenuRating() {
  const [rankings, setRankings] = useState([]);

  // Configurar backendURL
  let backendURL = "https://smiley-web-service.onrender.com/api/opinions/count-positive-opinions";

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
    <View>
      <Text style={styles.index}>{index + 1}. </Text>
      <View style={styles.inputContainer}> 
      <Text style={styles.letraBonita1}>
        Terminal 'Corimon', Piso({item.terminalId}):
      </Text>
      <Text style={styles.letraBonita2}>
        Apreciaciones Positivas: {item.positiveCount}
      </Text>
      </View>
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
    backgroundColor: "#007BFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: 'serif',
    color: 'white',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  index: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  letraBonita1: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  letraBonita2: {
    fontSize: 18,
    fontStyle: 'italic',
    fontFamily: 'serif',
  },
});

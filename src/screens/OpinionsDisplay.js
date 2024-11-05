import React from "react";
import { View, Text, StyleSheet } from "react-native";

const OpinionsDisplay = ({ terminalId, opinions }) => {
  const totalOpinions = Object.keys(opinions).length;

  const review = {
    "1": "Malo",
    "2": "Regular",
    "3": "Bien",
    "4": "Muy Bien",
    "5": "Excelente",
  }

  return (
    <View>
      <Text style={styles.subtitle}>{`Total de opiniones: ${totalOpinions}`}</Text>
      <View style={styles.anonymousButton}></View>
      <Text style={styles.title}>{`Opiniones de Terminal ${terminalId}`}</Text>
      {totalOpinions > 0 ? (
        Object.entries(opinions).map(([timestamp, opinion]) => (
          <View key={timestamp} style={styles.opinion}>
            <Text style={styles.subtitle}>{`Fecha: ${opinion.fecha}`}</Text>
            <Text style={styles.subtitle}>{`Hora: ${opinion.hora}`}</Text>
            <Text style={styles.subtitle}>{`Apreciación: ${review[opinion.apreciacion]}`}</Text>
          </View>
        ))
      ) : (
        <Text>No hay opiniones para este terminal</Text>
      )}
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    fontFamily: 'serif',
  },
  opinion: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  subtitle: {
    fontFamily: 'serif',
    fontSize: 20,
  },
  anonymousButton: {
    marginTop: 20,
  },
});

export default OpinionsDisplay;

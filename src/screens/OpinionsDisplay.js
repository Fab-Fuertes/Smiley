import React from "react";
import { View, Text, StyleSheet } from "react-native";

const OpinionsDisplay = ({ terminalId, opinions }) => {
  const totalOpinions = Object.keys(opinions).length;

  return (
    <View>
      <Text>{`Total de opiniones: ${totalOpinions}`}</Text>
      <Text style={styles.title}>{`Opiniones de Terminal ${terminalId}`}</Text>
      {totalOpinions > 0 ? (
        Object.entries(opinions).map(([timestamp, opinion]) => (
          <View key={timestamp} style={styles.opinion}>
            <Text>{`Fecha: ${opinion.fecha}`}</Text>
            <Text>{`Hora: ${opinion.hora}`}</Text>
            <Text>{`Apreciación: ${opinion.apreciacion}`}</Text>
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
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  opinion: {
    paddingVertical: 5,
  },
});

export default OpinionsDisplay;

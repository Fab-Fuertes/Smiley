import React from "react";
import { View, Text, StyleSheet } from "react-native";

const OpinionsDisplay = ({ terminalId, opinions }) => {
  const totalOpinions = Object.keys(opinions).length;

  // Diccionario para mapear apreciaciones con sus descripciones y colores
  const review = {
    "1": { text: "Malo", color: "#d8323b" }, // Rojo
    "2": { text: "Regular", color: "#e88354" }, // Naranja
    "3": { text: "Bien", color: "#fae70f" }, // Amarillo dorado
    "4": { text: "Muy Bien", color: "#95dd5b" }, // Verde claro
    "5": { text: "Excelente", color: "#3ed532" }, // verde
  };

  return (
    <View>
      <Text style={styles.subtitle2}>{`Total de opiniones: ${totalOpinions}`}</Text>
      <View style={styles.anonymousButton}></View>
      <Text style={styles.title}>{`Opiniones de Terminal ${terminalId}`}</Text>
      {totalOpinions > 0 ? (
        Object.entries(opinions).map(([timestamp, opinion]) => {
          const { text, color } = review[opinion.apreciacion] || {};
          return (
            <View
              key={timestamp}
              style={[styles.opinion, { backgroundColor: color || "#FFFFFF" }]} // Cambiar fondo dinámicamente
            >
              <Text style={styles.subtitle}>{`Fecha: ${opinion.fecha}`}</Text>
              <Text style={styles.subtitle}>{`Hora: ${opinion.hora}`}</Text>
              <Text style={styles.subtitle}>{`Apreciación: ${text}`}</Text>
            </View>
          );
        })
      ) : (
        <Text style={styles.subtitle3}>No hay opiniones para este terminal</Text>
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
    fontFamily: "serif",
    color: "#AAAAFF", // Azul claro para destacar el texto secundario
  },
  opinion: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "white", // Color por defecto (se sobrescribe dinámicamente)
  },
  subtitle: {
    fontFamily: "serif",
    fontSize: 20,
    color: "#000", // Texto en negro para contrastar con los fondos de colores
  },
  subtitle2: {
    fontFamily: "serif",
    fontSize: 20,
    color: "#FFFFFF",
  },
  subtitle3: {
    fontFamily: "serif",
    fontSize: 15,
    color: "#FFFFFF",
  },
  anonymousButton: {
    marginTop: 20,
  },
});

export default OpinionsDisplay;

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import UmbralConfig from "./UmbralConfig";
import OpinionsDisplay from "./OpinionsDisplay";

export default function DataDisplay() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend URL
  const backendURL = "https://smiley-web-service.onrender.com/api/terminals/db";

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(backendURL);
      const contentType = response.headers.get("content-type");

      if (!response.ok || !contentType.includes("application/json")) {
        throw new Error(
          "Error al obtener los datos. El formato de la respuesta no es válido."
        );
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError("Error al cargar los datos. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.noDataText}>No hay datos disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Terminales</Text>
        {data.Terminales ? (
          Object.entries(data.Terminales).map(([terminalKey, terminalData]) => {
            const terminalId = terminalData.ID;
            const umbral = terminalData.umbral;

            return (
              <View key={terminalKey} style={styles.card}>
                <Text style={styles.cardTitle}>
                  {`Corimon Piso (${terminalId})`}
                </Text>
                <OpinionsDisplay
                  terminalId={terminalId}
                  opinions={data.opiniones[terminalId] || {}}
                />
                <Text style={styles.subtitle}>
                  {`Umbral Configurado: ${umbral}`}
                </Text>
                <UmbralConfig
                  terminalId={terminalId}
                  refreshData={refreshData}
                />
              </View>
            );
          })
        ) : (
          <Text style={styles.noDataText}>No hay terminales disponibles</Text>
        )}
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={refreshData}
        >
          <Text style={styles.refreshButtonText}>Actualizar Datos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: "#190747",
  },
  container: {
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#252A34",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#252A34",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFD700",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#AAAAFF",
    marginTop: 10,
  },
  noDataText: {
    fontSize: 18,
    color: "#AAAAFF",
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: "#007BFF",
  },
  refreshButton: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  refreshButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

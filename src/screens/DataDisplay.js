import React, { useEffect, useState } from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import UmbralConfig from "./UmbralConfig";
import OpinionsDisplay from "./OpinionsDisplay";

export default function DataDisplay() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend URL
  let backendURL = "https://smiley-web-service.onrender.com/api/terminals/db";

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

  // const refreshData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${backendURL}`);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const jsonData = await response.json();
  //     setData(jsonData);
  //   } catch (err) {
  //     setError(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   refreshData();

  //   // Configurar WebSocket
  //   const socket = new WebSocket(`ws://10.0.2.2:8000`); // Cambia esto si es necesario

  //   socket.onopen = () => {
  //     console.log("WebSocket connection established");
  //   };

  //   socket.onmessage = (event) => {
  //     const newData = JSON.parse(event.data);
  //     setData((prevData) => ({ ...prevData, Terminales: newData }));
  //   };

  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   socket.onclose = () => {
  //     console.log("WebSocket connection closed");
  //   };

  //   setWs(socket); // Guardar socket en el estado

  //   return () => {
  //     socket.close(); // Cerrar la conexión al desmontar el componente
  //   };
  // }, []);

  useEffect(() => {
    refreshData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!data) {
    return <Text>No hay datos disponibles</Text>;
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Terminales:</Text>
        {data.Terminales ? (
          Object.entries(data.Terminales).map(([terminalKey, terminalData]) => {
            const terminalId = terminalData.ID;
            const umbral = terminalData.umbral;
            const opinionsForTerminal = data.opiniones[terminalId] || {};

            return (
              <View key={terminalKey}>
                <Text
                  style={styles.item}
                >{`Corimon piso (${terminalId})`}</Text>
                <OpinionsDisplay
                  terminalId={terminalData.ID}
                  opinions={data.opiniones[terminalId] || {}}
                />
                <Text style={styles.subtitle}>
                  {`Umbral Configurado: ${umbral}`}
                </Text>
                <UmbralConfig
                  terminalId={terminalData.ID}
                  refreshData={refreshData}
                />
              </View>
            );
          })
        ) : (
          <Text>No hay terminales disponibles</Text>
        )}
      </View>
    </ScrollView>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#007BFF",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "serif",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  item: {
    fontSize: 24,
    fontWeight: "bold",
    fontStyle: "italic",
    paddingVertical: 5,
    fontFamily: "serif",
  },
  anonymousButton: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});

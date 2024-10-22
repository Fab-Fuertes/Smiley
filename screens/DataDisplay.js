
import React, { useEffect, useState } from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import UmbralConfig from "./UmbralConfig";
import OpinionsDisplay from "./OpinionsDisplay";

export default function Mostrar(){

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ws, setWs] = useState(null); // Agregar estado para WebSocket

  // Configurar backendURL
  let backendURL;

  if (Platform.OS === "web") {
    backendURL = "http://localhost:8000";
  } else {
    backendURL = "http://10.0.2.2:8000";
  }

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/test`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    // Configurar WebSocket
    const socket = new WebSocket(`ws://10.0.2.2:8000`); // Cambia esto si es necesario

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData((prevData) => ({ ...prevData, Terminales: newData }));
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(socket); // Guardar socket en el estado

    return () => {
      socket.close(); // Cerrar la conexión al desmontar el componente
    };
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View>
        <Text>Error al cargar los datos: {error.message}</Text>
        {error.stack && <Text>{error.stack}</Text>}
      </View>
    );
  }

  if (!data) {
    return <Text>No hay datos disponibles</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Terminales:</Text>
      {data.Terminales ? (
        Object.entries(data.Terminales).map(([terminalKey, terminalData]) => {
          const terminalId = terminalData.ID;
          const umbral = terminalData.umbral;
          const opinionsForTerminal = data.opiniones[terminalId] || {};
          const totalOpinions = Object.keys(opinionsForTerminal).length;

          return (
            <View key={terminalKey}>
              <Text style={styles.item}>{`Terminal ID: ${terminalId}`}</Text>

              <OpinionsDisplay terminalId={terminalData.ID} opinions={data.opiniones[terminalId] || {}} />

              <Text style={styles.subtitle}>{`Umbral Configurado: ${umbral}`}</Text>

              <UmbralConfig terminalId={terminalData.ID} refreshData={refreshData} />
            </View>
          );
        })
      ) : (
        <Text>No hay terminales disponibles</Text>
      )}
    </View>
  );


}

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  item: {
    fontSize: 14,
    paddingVertical: 5,
  },
});

//export default DataDisplay;
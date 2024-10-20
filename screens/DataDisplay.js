import React, { useEffect, useState } from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import UmbralConfig from "./UmbralConfig";

// Componente para mostrar los datos obtenidos del backend
const DataDisplay = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let backendURL;

      // Detecta si la plataforma es web o móvil
      if (Platform.OS === "web") {
        backendURL = "http://localhost:8000";
      } else {
        backendURL = "http://10.0.2.2:8000";
      }

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

    fetchData();
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
          const umbral = terminalData.umbral; // Obtén el umbral configurado
          const opinionsForTerminal = data.opiniones[terminalId] || {};
          const totalOpinions = Object.keys(opinionsForTerminal).length;

          return (
            <View key={terminalKey}>
              <Text style={styles.item}>{`Terminal ID: ${terminalId}`}</Text>

              <Text>{`Total de opiniones: ${totalOpinions}`}</Text>

              {/* Detalles de las opiniones */}
              <Text
                style={styles.title}
              >{`Opiniones de Terminal ${terminalId}`}</Text>
              {totalOpinions > 0 ? (
                Object.entries(opinionsForTerminal).map(
                  ([timestamp, opinion]) => (
                    <View key={timestamp} style={styles.opinion}>
                      <Text>{`Fecha: ${opinion.fecha}`}</Text>
                      <Text>{`Hora: ${opinion.hora}`}</Text>
                      <Text>{`Apreciación: ${opinion.apreciacion}`}</Text>
                    </View>
                  )
                )
              ) : (
                <Text>No hay opiniones para este terminal</Text>
              )}
              <Text style={styles.subtitle}>{`Umbral Configurado: ${umbral}`}</Text>
              {/* Renderiza el componente UmbralConfig para cada terminal */}
              <UmbralConfig terminalId={terminalData.ID} />
            </View>
          );
        })
      ) : (
        <Text>No hay terminales disponibles</Text>
      )}
    </View>
  );
};

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

export default DataDisplay;
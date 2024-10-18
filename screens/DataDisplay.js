import React, { useEffect, useState } from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

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
        // Si está en un entorno web, usa localhost para el backend
        backendURL = "http://localhost:8000";
      } else {
        // Si está en un emulador Android, usa la IP específica del emulador
        backendURL = "http://10.0.2.2:8000";
      }

      try {
        // Realiza la petición al servidor
        const response = await fetch(`${backendURL}/test`);

        // Verifica si la respuesta es exitosa
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
        Object.entries(data.Terminales).map(([key, value]) => (
          <Text key={key} style={styles.item}>{`${key}: ${value}`}</Text>
        ))
      ) : (
        <Text>No hay terminales disponibles</Text>
      )}

      <Text style={styles.title}>Opiniones:</Text>
      {data.opiniones ? (
        Object.entries(data.opiniones).map(([userId, opinions]) => (
          <View key={userId}>
            <Text style={styles.subtitle}>Opiniones de {userId}:</Text>
            {Object.entries(opinions).map(([timestamp, opinion]) => (
              <Text
                key={timestamp}
                style={styles.item}
              >{`[${opinion.fecha} ${opinion.hora}] ${opinion.apreciacion}`}</Text>
            ))}
          </View>
        ))
      ) : (
        <Text>No hay opiniones disponibles</Text>
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

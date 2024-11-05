import { Text, Image, StyleSheet, View, ScrollView, Button } from "react-native";
import React, { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";

export default function Home({ user, accessType }) {
  const handleSignOut = () => {
    auth().signOut();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>SMILEY</Text>
        <Text style={styles.welcomeText}>Bienvenido {user.email}</Text>
        <Text style={styles.texto2}>
          Transformando la experiencia de cada visita
        </Text>
        <Image
          style={styles.image}
          source={require("../../assets/imagen23.png")}
        />
        <Text style={styles.slogan}>
          Nuestro proyecto recopila, analiza y comparte las calificaciones
          detalladas de baños enviadas por los usuarios, garantizando que
          encuentres siempre un espacio higiénico, cómodo y acogedor donde más
          lo necesitas.
        </Text>
        <Text style={styles.slogan2}>
          Juntos, mejoramos los estándares de limpieza y comodidad en cada
          rincón de tu universidad.
        </Text>
        <Button title="Cerrar sesión" onPress={handleSignOut} color="#FF0000" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007BFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  texto2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 25,
    fontStyle: "italic",
  },
  slogan2: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 25,
  },
  slogan: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "justify",
    marginBottom: 15,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 30,
    borderRadius: 50,
  },
});

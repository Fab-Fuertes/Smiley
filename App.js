import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context"; // SafeAreaProvider

enableScreens();

import Home from "./src/screens/Home";
import MenuRating from "./src/screens/MenuRating";
import DataDisplay from "./src/screens/DataDisplay";
import Profile from './src/screens/Profile';

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const Tab = createBottomTabNavigator();

  // Maneja los cambios en el estado de autenticación
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Cancela la suscripción cuando el componente se desmonta
  }, []);

  if (initializing) return null;

  if (!user) {
    return <LoginScreen />;
  }

  // Configuración de pestañas
  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          options={{
            title: "INICIO",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#0000ff" },
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
            headerTintColor: "white",
          }}
        >
          {() => <Home user={user} />}
        </Tab.Screen>
        <Tab.Screen
          name="Restrooms Rating"
          component={MenuRating}
          options={{
            title: "RANKING",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#0000ff" },
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="newspaper-variant"
                color={color}
                size={size}
              />
            ),
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="Data Display"
          component={DataDisplay}
          options={{
            title: "REACCIONES",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#0000ff" },
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="clipboard-text-multiple-outline"
                color={color}
                size={size}
              />
            ),
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            title: "PERFIL",
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#0000ff" },
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            ),
            headerTintColor: "white",
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => Alert.alert("Usuario autenticado"))
      .catch((error) => {
        if (error.code === "auth/invalid-email") {
          console.log("El email ingresado no es válido");
        } else if (error.code === "auth/user-not-found") {
          console.log("Usuario no encontrado");
        } else {
          console.error(error);
        }
      });
  };

  const handleSignUp = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => console.log("Cuenta de usuario creada y autenticada"))
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("El email ya está en uso");
        } else if (error.code === "auth/invalid-email") {
          console.log("El email ingresado no es válido");
        } else {
          console.error(error);
        }
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Iniciar sesión" onPress={handleSignIn} />
      <Button title="Registrar" onPress={handleSignUp} />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});

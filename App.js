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
import Profile from "./src/screens/Profile";
import CommonArea from "./src/screens/CommonArea";

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const Tab = createBottomTabNavigator();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return <LoginScreen />;
  }

  // Detectar el tipo de usuario
  const isAnonymous = user.isAnonymous;
  const isWorker = user.email && user.email.endsWith("@unimet.edu.ve");

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        Alert.alert("Has cerrado sesión");
        setUser(null); // Asegúrate de limpiar el estado del usuario
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  function MyTabs() {
    return (
      <Tab.Navigator>
        {isAnonymous ? (
          // Si el usuario es anónimo, mostrar WelcomeScreen y otras pestañas limitadas
          <>
            <Tab.Screen
              name="Welcome"
              options={{
                title: "INICIO",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#007BFF" },
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="account-circle"
                    color={color}
                    size={size}
                  />
                ),
                headerTintColor: "white",
              }}
            >
              {() => <CommonArea user={user} onLogout={handleLogout} />}
            </Tab.Screen>
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
          </>
        ) : (
          // Si el usuario NO es anónimo, mostrar todas las pestañas
          <>
            <Tab.Screen
              name="Home"
              options={{
                title: "INICIO",
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#0000ff" },
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="home"
                    color={color}
                    size={size}
                  />
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
          </>
        )}
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

  const handleAnonymousSignIn = () => {
    auth()
      .signInAnonymously()
      .then(() => Alert.alert("Acceso como usuario anónimo"))
      .catch((error) => {
        console.error("Error en el inicio de sesión anónimo:", error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Iniciar sesión" onPress={handleSignIn} />
      <Button title="Registrar" onPress={handleSignUp} />
      <View style={styles.anonymousButton}>
        <Button
          title="Acceso sin registro"
          onPress={handleAnonymousSignIn}
          color="#808080"
        />
      </View>
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
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    padding: 8,
  },
  anonymousButton: {
    marginTop: 20,
  },
});

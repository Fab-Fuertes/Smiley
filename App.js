import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import auth from "@react-native-firebase/auth";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context"; // SafeAreaProvider

enableScreens();

import Worker from "./src/classes/Worker";

import Home from "./src/screens/Home";
import MenuRating from "./src/screens/MenuRating";
import DataDisplay from "./src/screens/DataDisplay";
import Profile from "./src/screens/Profile";
import CommonArea from "./src/screens/CommonArea";

import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [worker, setWorker] = useState(null); // Guardar instancia de Worker
  const [name, setName] = useState(""); // Capturar nombre al registrarse
  const [password, setPassword] = useState(""); // Capturar contraseña al registrarse

  const Tab = createBottomTabNavigator();

  // NOTIFICACIONES
  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }

  // OBTENER TOKEN FCM
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log("TOKEN RETRIEVED =", token);
  };

  // const sendMessaging = async () => {
  //   const message = {
  //     notification: {
  //       title: "Basic Notification",
  //       body: "This is a basic notification sent from the server!",
  //       imageUrl: "https://my-cdn.com/app-logo.png",
  //     },

  //     tokens: [${getToken()}],
  //   };

  //   try {
  //     const response = await admin.messaging().sendEachForMulticast(message);
  //     console.log("Successfully sent messages:", response.successCount);
  //     console.log("Failed messages:", response.failureCount);
  //     if (response.responses[0].error) {
  //       console.log("First error:", response.responses[0].error);
  //     }
  //   } catch (error) {
  //     console.log("Error sending messages:", error);
  //   }
  // };

  useEffect(() => {
    // requestUserPermission();
    // sendMessaging();
    getToken();
  });

  function onAuthStateChanged(user) {
    setUser(user);
    if (user && user.email && user.email.endsWith("@unimet.edu.ve")) {
      // Crear una instancia de Worker si el usuario tiene correo institucional
      const workerInstance = new Worker(name, user.email, password);
      setWorker(workerInstance);
    } else {
      setWorker(null); // No es un usuario trabajador
    }
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return <LoginScreen setName={setName} setPassword={setPassword} />;
  }

  // Logout de usuario anonimo
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
        {/* Detectar el tipo de usuario anonimo */}
        {user.isAnonymous ? (
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
          // Si el usuario NO es anonimo, mostrar todas las pestañas
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
              {() => <Home user={user} worker={worker} />}
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

function LoginScreen({ setName, setPassword }) {
  const [email, setEmail] = useState("");
  const [localName, setLocalName] = useState(""); // Capturar nombre localmente para pasarlo al parámetro
  const [localPassword, setLocalPassword] = useState("");

  const handleSignIn = () => {
    setPassword(localPassword); // Guardar contraseña
    auth()
      .signInWithEmailAndPassword(email, localPassword)
      .then(() => Alert.alert("Usuario autenticado!"))
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
    setName(localName); // Guardar nombre en el estado
    setPassword(localPassword); // Guardar contraseña en el estado
    auth()
      .createUserWithEmailAndPassword(email, localPassword)
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
      <Text style={styles.titulo}>Inicio de Sesión</Text>
      <Text style={styles.subTitulo}>Ingrese como administrador</Text>
      <View style={styles.anonymousButton}></View>
      <TextInput
        style={styles.inputCont}
        placeholder="Nombre"
        value={localName}
        onChangeText={setLocalName}
      />
      <TextInput
        style={styles.inputCont}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.inputCont}
        placeholder="Contraseña"
        value={localPassword}
        onChangeText={setLocalPassword}
        secureTextEntry
      />
      <View style={styles.anonymousButton}></View>
      <Button title="Iniciar sesión" onPress={handleSignIn} />
      <View style={styles.anonymousButton}></View>
      <Button title="Registrar" onPress={handleSignUp} />
      <View style={styles.anonymousButton}>
        <View style={styles.anonymousButton}></View>
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
    backgroundColor: "#73a9f1",
  },
  titulo: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "serif",
  },
  subTitulo: {
    fontSize: 20,
    color: "black",
  },
  anonymousButton: {
    marginTop: 20,
  },
  inputCont: {
    borderWidth: 1,
    borderColor: "blue",
    padding: 10,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: "#f1f1f1",
    fontFamily: "serif",
  },
});

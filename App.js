import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { enableScreens } from "react-native-screens";

enableScreens();

import Home from "./src/screens/Home";
import CommonArea from "./src/screens/CommonArea";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context"; // SafeAreaProvider
import auth from "@react-native-firebase/auth";

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <MainApp />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const MainApp = () => {
  const [user, setUser] = useState(null);
  const [isLoginScreen, setIsLoginScreen] = useState(true);
  const [isGuest, setIsGuest] = useState(false); // Nuevo estado para modo invitado
  const [password, setPassword] = useState("");
  //const { login } = useAuth();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsGuest(authUser && authUser.isAnonymous); // Detecta si el usuario es invitado
    });
    return subscriber;
  }, []);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        Alert.alert("Has cerrado sesión");
        setUser(null);
        setIsGuest(false);
      });
  };

  const handleRegisterSucces = () => {
    // Cuando el registro sea exitoso, navegar a Home y actualizar el estado
    setUser(auth.currentUser);
  };

  if (!user) {
    return isLoginScreen ? (
      <LoginScreen
        setPassword={setPassword}
        onLoginSuccess={() => setUser(auth().currentUser)}
        onGuestLogin={() => setIsGuest(true)} // Activa el modo invitado
        navigateToRegister={() => setIsLoginScreen(false)}
      />
    ) : (
      <RegisterScreen
        setPassword={setPassword}
        onRegisterSuccess={handleRegisterSucces}
        navigateToLogin={() => setIsLoginScreen(true)}
      />
    );
  }

  // Muestra CommonArea si el usuario es invitado, sino muestra Home
  return (
    <View style={styles.container}>
      {isGuest ? <CommonArea onLogout={handleLogout} /> : <Home user={user} />}
      <Button title="Cerrar sesión" onPress={handleLogout} color="#FF0000" />
    </View>
  );
};

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

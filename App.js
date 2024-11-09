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
  const { user, isAuthenticated, login, logout, registerUser } = useAuth();
  const [isLoginScreen, setIsLoginScreen] = useState(true);

  if (!isAuthenticated) {
    return isLoginScreen ? (
      <LoginScreen
        onLogin={async (email, password) => {
          try {
            await login(email, password);
          } catch (error) {
            Alert.alert("Error", "Credenciales no válidas");
          }
        }}
        navigateToRegister={() => setIsLoginScreen(false)}
      />
    ) : (
      <RegisterScreen
        onRegister={async (data) => {
          try {
            await registerUser(data);
            setIsLoginScreen(true);
          } catch (error) {
            Alert.alert("Error", "No se pudo completar el registro");
          }
        }}
        navigateToLogin={() => setIsLoginScreen(true)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {user.isGuest ? <CommonArea onLogout={logout} /> : <Home user={user} />}
      <Button title="Cerrar sesión" onPress={logout} color="#FF0000" />
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

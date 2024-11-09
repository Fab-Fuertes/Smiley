import React, { useState } from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { enableScreens } from "react-native-screens";

import Home from "./src/screens/Home";
import CommonArea from "./src/screens/CommonArea";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

enableScreens();

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

  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert("Error", "Credenciales no válidas");
    }
  };

  const handleRegister = async (data) => {
    try {
      await registerUser(data);
      setIsLoginScreen(true);
    } catch (error) {
      Alert.alert("Error", "No se pudo completar el registro");
    }
  };

  if (!isAuthenticated) {
    return isLoginScreen ? (
      <LoginScreen
        onLogin={handleLogin}
        navigateToRegister={() => setIsLoginScreen(false)}
      />
    ) : (
      <RegisterScreen
        onRegister={handleRegister}
        navigateToLogin={() => setIsLoginScreen(true)}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Home />
      <View style={styles.logoutButtonContainer}>
        <Button title="Cerrar sesión" onPress={logout} color="#FF0000" />
      </View>
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
  logoutButtonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

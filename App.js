import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuth, AuthProvider } from "./src/context/AuthContext"; // Tu contexto de autenticación
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import Home from "./src/screens/Home";
import Profile from "./src/screens/Profile";
import DataDisplay from "./src/screens/DataDisplay";
import MenuRating from "./src/screens/MenuRating";
import WelcomeScreen from "./src/screens/WelcomeScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerTintColor: "white",
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuRating}
        options={{
          title: "RANKING", headerTitleAlign: "center", headerStyle: {backgroundColor: "#0000ff"},
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
          title: "REACCIONES", headerTitleAlign: "center", headerStyle: {backgroundColor: "#0000ff"},
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
          title: "PERFIL", headerTitleAlign: "center",
          headerStyle: {backgroundColor: "#0000ff"}, 
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
          headerTintColor: "white",
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const { isAuthenticated } = useAuth(); // Estado de autenticación desde el contexto
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica si el usuario ya está autenticado (a través de Firebase o similar)
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return null; // O un componente de loading mientras se verifica el estado de la sesión
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function Main() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

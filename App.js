import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MenuCalificaciones from './screens/CalificaconesPrev';
import Inicio from './screens/Home';
import Perfil from './screens/Perfil';
import DataDisplay from './screens/DataDisplay';
import CalificacionesAnteriores from './screens/CalificacionesAnteriores';

export default function App() {

  const Tab = createBottomTabNavigator();

  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Inicio" component={Inicio} options={{title: "INICIO", headerTitleAlign: "center", headerStyle: {backgroundColor: "#0000ff"}, tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ), headerTintColor: "white",}} />
        <Tab.Screen name="Calificaciones Baños" component={MenuCalificaciones} options={{title: "RANKING", headerTitleAlign: "center", headerStyle: {backgroundColor: "#0000ff"}, tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="newspaper-variant" color={color} size={size} />
          ), headerTintColor: "white",}} />
          <Tab.Screen name="Data Display" component={DataDisplay} options={{title: "REACCIONES", headerTitleAlign: "center", headerStyle: {backgroundColor: "#0000ff"}, tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-text-multiple-outline" color={color} size={size} />
          ), headerTintColor: "white",}} />
        <Tab.Screen name="Perfil" component={Perfil} options={{title: "PERFIL", headerTitleAlign: "center", headerStyle: {backgroundColor: "#0000ff"}, tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ), headerTintColor: "white",}} />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


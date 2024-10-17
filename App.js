import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MenuCalificaciones from './screens/CalificaconesPrev';
import Inicio from './screens/Home';

export default function App() {

  const Tab = createBottomTabNavigator();

  function MyTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Inicio" component={Inicio} options={{title: "INICIO", headerTitleAlign: "center", headerStyle: {backgroundColor: "#8B1874"}, headerTintColor: "white",}} />
        <Tab.Screen name="Calificaciones Baños" component={MenuCalificaciones} options={{title: "CALIFICACIONES", headerTitleAlign: "center", headerStyle: {backgroundColor: "#8B1874"}, headerTintColor: "white",}} />
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

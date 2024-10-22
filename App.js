import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import MenuCalificaciones from './screens/CalificaconesPrev';
import Inicio from './screens/Home';
import React from "react";
import {getAuth, signInAnonymously} from "firebase/auth";
import {getToken, onMessage} from "firebase/messaging";
import {messaging} from "./firebase";
import {ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const activarMensajes = async ()=> {
      const token = await getToken(messaging,{
        vapidKey: "BBA399nsCorVkR4G0OIjtpDwt89lLiNb01pPfOQh0rwHnbb06r8x12uMNvJfVYTBBEPmbGRKF6HkUMmwuRSGU5w"
      }).catch(error => console.log("Ocurrió un error al generar el Token"));
    
    
      if(token) console.log("Este es su token:",token);
      if(!token) console.log("No tiene un token asignado");
    }
    
    React.useEffect(()=>{
    onMessage(messaging, message=>{
      console.log("Tiene el siguiente mensaje:", message);
      toast(message.notification.title); })}, []);
      return (
      <div>   
    <ToastContainer />
    <button
    onClick={activarMensajes}
    > Recibir notificación</button>
      </div>
      );
    
    



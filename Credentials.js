
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getMessaging } from "firebase/messaging"
 
const firebaseConfig = {
  apiKey: "AIzaSyCE4J3smOCCH6FpZ_vsOqFFPPcDUGHjNWw",
  authDomain: "smiley-5a38d.firebaseapp.com",
  projectId: "smiley-5a38d",
  storageBucket: "smiley-5a38d.appspot.com",
  messagingSenderId: "454980203375",
  appId: "1:454980203375:web:5eb91e785d50bdad086e9a"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);




const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;

import firebase from 'firebase/app';
import 'firebase/messaging';


const messaging = firebase.messaging();
async function registrarDispositivo() {
  try {
    const currentToken = await messaging.getToken({ vapidKey: 'YOUR_PUBLIC_VAPID_KEY+' });
    
    if (currentToken) {
      console.log('FCM Registro de Token:', currentToken);

      
      const tokenGuardado = localStorage.getItem('deviceToken');
      
      if (!tokenGuardado || tokenGuardado !== currentToken) {
        // Simulación de registrar el dispositivo en el servidor
        postRegistrarDispositivoEnServidor(currentToken);
        localStorage.setItem('deviceToken', currentToken);
      }
    } else {
      console.warn('No se encontró un Token registrado, por favor, cumpla con los requisitos para generar uno.');
    }
  } catch (err) {
    console.warn('Falló el proceso de registrar el Token', err);
  }
}

function postRegistrarDispositivoEnServidor(token) {
  console.log('Registrando token en el servidor:', token);
}

registrarDispositivo();

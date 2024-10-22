// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyCE4J3smOCCH6FpZ_vsOqFFPPcDUGHjNWw",
  authDomain: "smiley-5a38d.firebaseapp.com",
  projectId: "smiley-5a38d",
  storageBucket: "smiley-5a38d.appspot.com",
  messagingSenderId: "454980203375",
  appId: "1:454980203375:web:5eb91e785d50bdad086e9a",
});
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = 'Solicitud Recibida';
  const notificationOptions = {
    body: 'Su solicitud ha sido recibida por parte del sistema. En breve, el personal de limpieza lo atenderá.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
importScripts("https://www.gstatic.com/firebasejs/9.8.4/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/9.8.4/firebase-messaging-compat.js")


 

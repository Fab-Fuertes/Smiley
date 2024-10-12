// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCE4J3smOCCH6FpZ_vsOqFFPPcDUGHjNWw",
  authDomain: "smiley-5a38d.firebaseapp.com",
  projectId: "smiley-5a38d",
  storageBucket: "smiley-5a38d.appspot.com",
  messagingSenderId: "454980203375",
  appId: "1:454980203375:web:5eb91e785d50bdad086e9a"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;

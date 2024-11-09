import {
  REACT_APP_apiKey,
  REACT_APP_authDomain,
  REACT_APP_databaseURL,
  REACT_APP_projectId,
  REACT_APP_storageBucket,
  REACT_APP_messagingSenderId,
  REACT_APP_appId,
} from "@env";

import { initializeApp } from "@firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";
//import { initializeAuth, getReactNativePersistence  } from "@firebase/auth";
//import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: REACT_APP_apiKey,
  authDomain: REACT_APP_authDomain,
  databaseURL: REACT_APP_databaseURL,
  projectId: REACT_APP_projectId,
  storageBucket: REACT_APP_storageBucket,
  messagingSenderId: REACT_APP_messagingSenderId,
  appId: REACT_APP_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const firestore = getFirestore(app);
export const auth = getAuth(app);
// // Initialize Auth with AsyncStorage persistence??
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });
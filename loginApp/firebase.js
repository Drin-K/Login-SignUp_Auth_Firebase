// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTSJlGI_9oAzis4yiwq_m6FtqNtuurRBo",
  authDomain: "loginauthapp-f8e2a.firebaseapp.com",
  projectId: "loginauthapp-f8e2a",
  storageBucket: "loginauthapp-f8e2a.firebasestorage.app",
  messagingSenderId: "342756370011",
  appId: "1:342756370011:web:8b70185dd46cb23465c17e"
};

// ✅ Inicializo Firebase
const app = initializeApp(firebaseConfig);

// ✅ Kjo është mënyra e duhur për Expo/React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth };
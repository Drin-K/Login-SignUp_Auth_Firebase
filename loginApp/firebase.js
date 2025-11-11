import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBTSJlGI_9oAzis4yiwq_m6FtqNtuurRBo",
  authDomain: "loginauthapp-f8e2a.firebaseapp.com",
  projectId: "loginauthapp-f8e2a",
  storageBucket: "loginauthapp-f8e2a.appspot.com", // ✅ corrected
  messagingSenderId: "342756370011",
  appId: "1:342756370011:web:8b70185dd46cb23465c17e",
};

// ✅ Mos e inicializo disa herë — përdor këtë truk
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Përdor initializeAuth vetëm në herën e parë
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ cole aqui a config do Firebase Console (Project settings > Your apps > Web)
const firebaseConfig = {
  apiKey: "AIzaSyC5CMgQ7gFeAQeAa48-AN4bHFg8R7gua3Y",
  authDomain: "controle-gastos-app2026.firebaseapp.com",
  projectId: "controle-gastos-app2026",
  storageBucket: "controle-gastos-app2026.firebasestorage.app",
  messagingSenderId: "1003062336032",
  appId: "1:1003062336032:web:ea9878d87ad1c587627a45"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
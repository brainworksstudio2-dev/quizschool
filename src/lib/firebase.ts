// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUpDW1kQgFJj88LtuTsSTCeJTHT7nj62U",
  authDomain: "photo-dcd62.firebaseapp.com",
  projectId: "photo-dcd62",
  storageBucket: "photo-dcd62.appspot.com",
  messagingSenderId: "593979535280",
  appId: "1:593979535280:web:77cae1f5a8aaaa8e9af075",
  measurementId: "G-WZYQG8RVEQ"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };

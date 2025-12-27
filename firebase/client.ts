// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDuSVSPqLyQenGALHJzvM473qDyiT7jWZM",
  authDomain: "prepwise-1d3ac.firebaseapp.com",
  projectId: "prepwise-1d3ac",
  storageBucket: "prepwise-1d3ac.firebasestorage.app",
  messagingSenderId: "988336814532",
  appId: "1:988336814532:web:ea970b659eb0a4548e8c91",
  measurementId: "G-C54VE4KFJM"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
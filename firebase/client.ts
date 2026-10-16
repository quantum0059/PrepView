// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// authDomain uses the app's own domain in production via NEXT_PUBLIC_BASE_URL.
// Combined with next.config.ts rewrites for /__/auth/*, this keeps the entire
// Google redirect flow same-origin so getRedirectResult() can read the result.
const productionAuthDomain = process.env.NEXT_PUBLIC_BASE_URL
  ?.replace(/^https?:\/\//, "")  // strip https://
  .replace(/\/$/, "");           // strip trailing slash

const firebaseConfig = {
  apiKey: "AIzaSyDuSVSPqLyQenGALHJzvM473qDyiT7jWZM",
  authDomain: productionAuthDomain ?? "prepwise-1d3ac.firebaseapp.com",
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

//new google provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({prompt: 'select_account'});

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore"; // Ensure the correct Firestore import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDs3Yk0Q1qT-atGRT_cQK77jiwsY8VJVV4",
  authDomain: "fir-health-789f4.firebaseapp.com",
  projectId: "fir-health-789f4",
  storageBucket: "fir-health-789f4.appspot.com",
  messagingSenderId: "841749478751",
  appId: "1:841749478751:web:c25c38f00ba84aa6234aea",
  measurementId: "G-SGD3L8WEHK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Initialize Firebase Auth with AsyncStorage persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firestore
export const db = getFirestore(app);

// Firestore collections
export const userRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
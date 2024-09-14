// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getReactNativePersistence,initializeAuth} from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore,collection } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);

export const auth = initializeAuth(app,{
    persistence:getReactNativePersistence(AsyncStorage)
});

export const  db = getFirestore(app);


export const  userRef = collection(db,'users');
export const  roomRef = collection(db,'rooms');
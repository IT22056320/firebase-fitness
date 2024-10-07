// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore"; // Ensure the correct Firestore import
import { getStorage } from "firebase/storage"; // Import Firebase Storage

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
const analytics = getAnalytics(app);

// Initialize Auth
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export const initializeAnalyticsIfInBrowser = () => {
  if (typeof window !== 'undefined') {
    return getAnalytics(app);
  }
  return null; // or return a mock or a default value if needed
};

// Initialize Firestore
export const db = getFirestore(app);
export const userRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');

// Initialize Storage
export const storage = getStorage(app); // Add this line
const MyComponent = () => {
  useEffect(() => {
    // Check if window is defined (i.e., we are in the browser)
    if (typeof window !== 'undefined') {
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
      // Now you can use analytics
    }
  }, []);

  return <div>Your Component</div>;
};

export default MyComponent;

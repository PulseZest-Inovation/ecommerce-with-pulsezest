import { initializeApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyC4X191jlI5WONorU4OkfFa844XzQYkFnk",
  authDomain: "ecommerce-with-pulsezest.firebaseapp.com",
  projectId: "ecommerce-with-pulsezest",
  storageBucket: "ecommerce-with-pulsezest.firebasestorage.app",
  messagingSenderId: "163595114954",
  appId: "1:163595114954:web:4bbe97ef15ea8036949733",
  measurementId: "G-HRHZMT8TC8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only if running in a browser environment)
let analytics: Analytics | undefined;

if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Initialize Firestore, Storage, and Auth
const db: Firestore = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth };

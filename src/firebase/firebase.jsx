// src/firebase/firebase.jsx

import { initializeApp } from "firebase/app"; // Import the initializeApp function
import { getAuth } from "firebase/auth"; // Import Auth functions
import { getFirestore } from "firebase/firestore"; // Import Firestore functions

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSoD7SJ5rlwVfYqUt8-wN10uBR2grBBWY",
  authDomain: "warehouse-management-11cf5.firebaseapp.com",
  projectId: "warehouse-management-11cf5",
  storageBucket: "warehouse-management-11cf5.appspot.com",
  messagingSenderId: "955380138700",
  appId: "1:955380138700:web:e725aad1af2d0fce4eb869",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); // Initialize with the config
const auth = getAuth(app); // Get Auth instance
const db = getFirestore(app); // Get Firestore instance

export { auth, db }; // Export auth and db for use in your app

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDhJIhZa2LZNA183mCO63ADYa9vLjyZAtg",
    authDomain: "ecom-user-95e9a.firebaseapp.com",
    projectId: "ecom-user-95e9a",
    storageBucket: "ecom-user-95e9a.firebasestorage.app",
    messagingSenderId: "269139453137",
    appId: "1:269139453137:web:4ff6b6e0f2e903163991f0",
    measurementId: "G-HTSDY1D4CX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXN_6qQknx7NDgab96EBcDPxCwsXCIQjw",
  authDomain: "itax-4b8d7.firebaseapp.com",
  projectId: "itax-4b8d7",
  storageBucket: "itax-4b8d7.firebasestorage.app",
  messagingSenderId: "410350051245",
  appId: "1:410350051245:web:7b485881791a9247fccb24",
  measurementId: "G-2K0Q3ZFVWS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
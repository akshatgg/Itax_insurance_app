// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey: "AIzaSyC7HdmXgysmn7AfhiICnu3PVAj-f17vPjs",
  authDomain: "itax-7c8ea.firebaseapp.com",
  projectId: "itax-7c8ea",
  storageBucket: "itax-7c8ea.firebasestorage.app",
  messagingSenderId: "532409625604",
  appId: "1:532409625604:web:545814898b227685209951",
  measurementId: "G-FR8DCX5P10"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)
export { app, auth, db }
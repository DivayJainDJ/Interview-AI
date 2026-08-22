
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY || "AIzaSyCZeScb9jlShpsFHFsx4USpz3_dupG2Yrc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN || "interviewai-24786.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID || "interviewai-24786",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET || "interviewai-24786.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID || "889366009830",
  appId: import.meta.env.VITE_FIREBASE_APPID || "1:889366009830:web:5bb42ffb48f94585f3a827",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID || "G-LTL0WGQ5WT"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}


import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyCZeScb9jlShpsFHFsx4USpz3_dupG2Yrc",
  authDomain: "interviewai-24786.firebaseapp.com",
  projectId: "interviewai-24786",
  storageBucket: "interviewai-24786.firebasestorage.app",
  messagingSenderId: "889366009830",
  appId: "1:889366009830:web:5bb42ffb48f94585f3a827",
  measurementId: "G-LTL0WGQ5WT"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}
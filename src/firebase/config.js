// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_FX1jAym1XEyz8ajHP0ako0c069gE2sU",
  authDomain: "burningham-realty-agent-tools.firebaseapp.com",
  databaseURL: "https://burningham-realty-agent-tools.firebaseio.com",
  projectId: "burningham-realty-agent-tools",
  storageBucket: "burningham-realty-agent-tools.appspot.com",
  messagingSenderId: "753011450605",
  appId: "1:753011450605:web:5e79def1364005cbcde2e4",
  measurementId: "G-Y87YRGQVY0",
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const functions = getFunctions();

export { auth, db, functions };

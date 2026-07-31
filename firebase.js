// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxBekhRzs_WwPNdAo0bvh0j0P5XrUg5Es",
  authDomain: "studyai-84e36.firebaseapp.com",
  projectId: "studyai-84e36",
  storageBucket: "studyai-84e36.firebasestorage.app",
  messagingSenderId: "800110717917",
  appId: "1:800110717917:web:b241a951ab6083a1aea434",
  measurementId: "G-PJME9K2KGV"
};

const app = initializeApp(firebaseConfig);

export { app };
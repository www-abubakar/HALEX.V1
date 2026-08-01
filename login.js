import { app, auth } from "./firebase.js";

import {
  getAuth,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";



const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {

      await signInWithEmailAndPassword(auth, email, password);

      alert("Login Successful 🎉");

      window.location.href = "dashboard.html";

    } catch (error) {

      alert(error.message);
      console.error(error);

    }

  });

}
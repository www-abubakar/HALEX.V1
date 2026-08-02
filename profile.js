import { app } from "./firebase.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const auth = getAuth(app);

const userEmail = document.getElementById("userEmail");
const userUid = document.getElementById("userUid");
const createdAt = document.getElementById("createdAt");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userEmail.textContent = "📧 " + user.email;
  userUid.textContent = user.uid;

  if (user.metadata.creationTime) {
    createdAt.textContent = user.metadata.creationTime;
  }

});

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

  alert("Logged Out");

  window.location.href = "login.html";

});
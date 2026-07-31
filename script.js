import { app } from "./firebase.js";

import { 
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const auth = getAuth(app);


// FAQ Code

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const button = item.querySelector(".faq-question");

    if(button){

        button.addEventListener("click", () => {

            item.classList.toggle("active");

        });

    }

});


// Signup Code

const signupForm = document.getElementById("signupForm");


if(signupForm){

signupForm.addEventListener("submit", (e)=>{

e.preventDefault();


const email = document.getElementById("email").value;

const password = document.getElementById("password").value;

const confirmPassword = document.getElementById("confirmPassword").value;


if(password !== confirmPassword){

alert("Password match nahi kar raha");

return;

}


createUserWithEmailAndPassword(auth,email,password)

.then(()=>{

alert("Account successfully created 🎉");

window.location.href="dashboard.html";

})

.catch((error)=>{

alert(error.message);

});


});

}


console.log("Firebase connected", app);
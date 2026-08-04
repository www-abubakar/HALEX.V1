// =================================
// STUDYAI SCRIPT.JS
// Version 2.0
// =================================


// Firebase Import
import { app } from "./firebase.js";

import {
  getAuth,
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";


const auth = getAuth(app);

console.log("Firebase Connected ✅");



// =================================
// MOBILE MENU
// =================================

const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");


if(menuBtn && navMenu){

    menuBtn.addEventListener("click",()=>{

        navMenu.classList.toggle("active");

    });

}



// =================================
// FAQ SECTION
// =================================

const faqItems = document.querySelectorAll(".faq-item");


faqItems.forEach((item)=>{


    const question = item.querySelector(".faq-question");


    if(question){

        question.addEventListener("click",()=>{

            item.classList.toggle("active");

        });

    }


});




// =================================
// SIGNUP SYSTEM
// =================================

const signupForm = document.getElementById("signupForm");


if(signupForm){


signupForm.addEventListener("submit", async(e)=>{


e.preventDefault();



const email =
document.getElementById("email").value.trim();


const password =
document.getElementById("password").value;


const confirmPassword =
document.getElementById("confirmPassword").value;




if(password !== confirmPassword){

alert("Passwords do not match ❌");

return;

}




if(password.length < 6){

alert("Password must be at least 6 characters");

return;

}




try{


await createUserWithEmailAndPassword(
auth,
email,
password
);



alert("Account created successfully 🎉");



window.location.href="dashboard.html";



}

catch(error){


console.error(error);


alert(error.message);


}



});


}





// =================================
// SMOOTH SCROLL
// =================================


const links = document.querySelectorAll("a[href^='#']");


links.forEach((link)=>{


link.addEventListener("click",(e)=>{


e.preventDefault();



const section =
document.querySelector(link.getAttribute("href"));



if(section){

section.scrollIntoView({

behavior:"smooth"

});

}



});


});





// =================================
// BUTTON CLICK EFFECT
// =================================


const buttons =
document.querySelectorAll("button");



buttons.forEach((btn)=>{


btn.addEventListener("click",()=>{


btn.style.transform="scale(0.95)";



setTimeout(()=>{


btn.style.transform="scale(1)";


},150);



});


});





// =================================
// PAGE LOAD ANIMATION
// =================================


window.addEventListener("load",()=>{


document.body.classList.add("loaded");


});





// =================================
// CURRENT YEAR FOOTER
// =================================


const year =
document.getElementById("year");

if(year){

year.textContent =
new Date().getFullYear();

}
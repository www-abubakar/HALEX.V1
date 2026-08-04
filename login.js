//==================================================
// STUDYAI LOGIN.JS V3
// PART 1
// Firebase Login + UI Controls
//==================================================


import { auth } from "./firebase.js";


import {
signInWithEmailAndPassword
} 
from 
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";





console.log("🚀 StudyAI Login V3 Loaded");





//==============================
// DOM ELEMENTS
//==============================


const loginForm =
document.getElementById("loginForm");


const emailInput =
document.getElementById("email");


const passwordInput =
document.getElementById("password");


const showPassword =
document.getElementById("showPassword");


const loginBtn =
document.getElementById("loginBtn");








//==============================
// SHOW / HIDE PASSWORD
//==============================


if(showPassword){


showPassword.onclick = ()=>{


if(passwordInput.type === "password"){


passwordInput.type="text";


showPassword.innerHTML =
`
<i class="fas fa-eye-slash"></i>
`;


}

else{


passwordInput.type="password";


showPassword.innerHTML =
`
<i class="fas fa-eye"></i>
`;



}


};



}








//==============================
// LOGIN SYSTEM
//==============================


if(loginForm){



loginForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();




const email =
emailInput.value.trim();



const password =
passwordInput.value.trim();






if(!email || !password){


showMessage(
"Please fill all fields ❌",
"error"
);


return;


}





// Button Loading


loginBtn.disabled=true;


loginBtn.innerHTML=
`
<i class="fas fa-spinner fa-spin"></i>
Logging in...
`;





try{



await signInWithEmailAndPassword(
auth,
email,
password
);





showMessage(
"Login Successful 🎉",
"success"
);






setTimeout(()=>{


window.location.href=
"dashboard.html";



},900);






}

catch(error){



console.log(error);



showMessage(
getErrorMessage(error.code),
"error"
);




loginBtn.disabled=false;


loginBtn.innerHTML=
`
<span>Login</span>

<i class="fas fa-arrow-right"></i>
`;



}




});



}
//==================================================
// STUDYAI LOGIN.JS V3
// PART 2 FINAL
// Toast + Error Handling + Remember Me
//==================================================





//==============================
// ERROR MESSAGE
//==============================


function getErrorMessage(code){



switch(code){


case "auth/invalid-email":

return "Invalid email address ❌";



case "auth/user-not-found":

return "Account not found ❌";



case "auth/wrong-password":

return "Wrong password ❌";



case "auth/invalid-credential":

return "Email or password incorrect ❌";



case "auth/too-many-requests":

return "Too many attempts. Try later ⏳";



default:

return "Login failed. Try again.";



}



}








//==============================
// TOAST MESSAGE
//==============================


function showMessage(
message,
type="success"
){



const toast =
document.createElement("div");



toast.className =
"toast-message " + type;



toast.innerHTML =
message;



document.body.appendChild(toast);






setTimeout(()=>{


toast.classList.add("show");


},50);






setTimeout(()=>{


toast.classList.remove("show");



setTimeout(()=>{


toast.remove();



},300);



},2500);



}








//==============================
// REMEMBER EMAIL
//==============================


const remember =
document.getElementById(
"rememberMe"
);





if(remember){



const savedEmail =
localStorage.getItem(
"studyai_email"
);



if(savedEmail){


emailInput.value =
savedEmail;


remember.checked =
true;


}






loginForm.addEventListener(
"submit",
()=>{



if(remember.checked){



localStorage.setItem(
"studyai_email",
emailInput.value
);



}

else{



localStorage.removeItem(
"studyai_email"
);



}



});



}








//==============================
// ENTER KEY SUPPORT
//==============================


document.addEventListener(
"keydown",
(e)=>{


if(e.key==="Enter"){


if(emailInput && passwordInput){


loginForm.requestSubmit();


}


}


});








//==============================
// PAGE READY
//==============================


window.addEventListener(
"load",
()=>{


console.log(
"✅ Login Page Ready"
);


});








//==============================
// END LOGIN V3
//==============================
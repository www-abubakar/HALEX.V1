// =================================
// STUDYAI AI TUTOR.JS V4
// Premium Fixed Version
// =================================

console.log("AI Tutor Loaded ✅");


import { db, auth } from "./firebase.js";

import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded",()=>{


const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");


if(!chatBox || !userInput || !sendBtn){

console.log("AI Tutor Elements Missing ❌");
return;

}


let isSending = false;



// ===============================
// BUTTON EVENTS
// ===============================


sendBtn.addEventListener(
"click",
sendMessage
);



userInput.addEventListener(
"keydown",
(e)=>{

if(e.key==="Enter"){

e.preventDefault();

sendMessage();
setTimeout(()=>{
chatBox.scrollTop = chatBox.scrollHeight;
},100);
}

});



// ===============================
// SEND MESSAGE
// ===============================


async function sendMessage(){


if(isSending) return;


const message =
userInput.value.trim();



if(!message) return;



isSending=true;


sendBtn.disabled=true;


addUserMessage(message);


userInput.value="";


const typing =
addTyping();



try{


const response =
await fetch(

"https://halex-v1.onrender.com/chat",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

message:message

})

}

);



const data =
await response.json();



typing.remove();



if(!response.ok){


addBotMessage(
"❌ "+(data.error || "Server Error")
);


return;


}



const bot =
addBotMessage("");



await typeWriter(
bot,
data.reply
);



// Firebase Save

if(auth.currentUser){


await addDoc(

collection(

db,

"users",

auth.currentUser.uid,

"chats"

),


{

userMessage:message,

aiReply:data.reply,

createdAt:serverTimestamp()

}

);


}


}
catch(error){


console.error(error);


typing.remove();


addBotMessage(
"❌ Network Error"
);


}
finally{


isSending=false;


sendBtn.disabled=false;


userInput.focus();


chatBox.scrollTop =
chatBox.scrollHeight;


}

}
  // ===============================
// USER MESSAGE UI
// ===============================


function addUserMessage(text){


const div =
document.createElement("div");


div.className =
"user-message";


div.innerHTML = `

<div class="message">
${escapeHTML(text)}
</div>

<div class="avatar">
👤
</div>

`;


chatBox.appendChild(div);


chatBox.scrollTop =
chatBox.scrollHeight;


}



// ===============================
// BOT MESSAGE UI
// ===============================


function addBotMessage(text){


const div =
document.createElement("div");


div.className =
"bot-message";


div.innerHTML = `

<div class="avatar">
🤖
</div>

<div class="message"></div>

`;


const box =
div.querySelector(".message");


box.textContent =
text;


chatBox.appendChild(div);


chatBox.scrollTop =
chatBox.scrollHeight;


return div;


}



// ===============================
// THINKING ANIMATION
// ===============================


function addTyping(){


const div =
document.createElement("div");


div.className =
"bot-message";


div.innerHTML = `

<div class="avatar">
🤖
</div>

<div class="typing-box">

<span></span>
<span></span>
<span></span>

</div>

`;


chatBox.appendChild(div);


chatBox.scrollTop =
chatBox.scrollHeight;


return div;


}



// ===============================
// TYPEWRITER EFFECT
// ===============================


async function typeWriter(bot,text){


const box =
bot.querySelector(".message");


box.textContent="";


for(
let i=0;
i<text.length;
i++
){


box.textContent +=
text.charAt(i);



chatBox.scrollTop =
chatBox.scrollHeight;



await new Promise(
resolve =>
setTimeout(
resolve,
12
)
);


}


}



// ===============================
// SECURITY
// ===============================


function escapeHTML(text){


return text
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;")
.replace(/'/g,"&#039;");


}
  // ===============================
// AUTO SCROLL OBSERVER
// ===============================


const observer =
new MutationObserver(()=>{

chatBox.scrollTop =
chatBox.scrollHeight;

});


observer.observe(
chatBox,
{
childList:true,
subtree:true
}
);



// ===============================
// INITIAL FOCUS
// ===============================


userInput.focus();
setTimeout(()=>{
chatBox.scrollTop = chatBox.scrollHeight;
},100);


});
// Mobile Sidebar

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if(menuToggle && sidebar){

menuToggle.addEventListener("click",()=>{

sidebar.classList.toggle("active");

});

document.addEventListener("click",(e)=>{

if(window.innerWidth<=992){

if(
!sidebar.contains(e.target) &&
!menuToggle.contains(e.target)
){
sidebar.classList.remove("active");
}

}

});

}
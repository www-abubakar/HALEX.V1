console.log("AI Tutor JS Loaded");
import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const API_KEY = "s-or-v1-06dc7124e64406f91d3476deb0eca8885dc2b66e8a32debba613f1269c4a5f61";


document.addEventListener("DOMContentLoaded", () => {


const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");


console.log("Button:", sendBtn);
console.log("Input:", userInput);
console.log("Chat:", chatBox);



if(!sendBtn){
    console.log("Send button not found");
    return;
}



sendBtn.addEventListener("click", sendMessage);



userInput.addEventListener("keydown", (e)=>{

    if(e.key === "Enter"){
        sendMessage();
    }

});



async function sendMessage(){


const message = userInput.value.trim();


if(!message) return;



const userMsg = document.createElement("div");

userMsg.className = "user-message";

userMsg.textContent = message;

chatBox.appendChild(userMsg);



userInput.value = "";



const botMsg = document.createElement("div");

botMsg.className = "bot-message";

botMsg.textContent = "🤖 Thinking...";


chatBox.appendChild(botMsg);



try{


const response = await fetch(

"https://openrouter.ai/api/v1/chat/completions",

{

method:"POST",


headers:{

"Authorization":`Bearer ${API_KEY}`,

"Content-Type":"application/json",

"HTTP-Referer":"http://localhost",

"X-Title":"StudyAI"

},



body:JSON.stringify({

model:"meta-llama/llama-3.1-8b-instruct",

messages:[

{

role:"user",

content:message

}

]

})


}

);



const data = await response.json();


console.log(data);



if(!response.ok){

botMsg.textContent =
"❌ " + (data.error?.message || "API Error");

return;

}



botMsg.textContent =
"🤖 " + data.choices[0].message.content;


  await addDoc(collection(db, "users", auth.currentUser.uid, "chats"), {
  userMessage: message,
  aiReply: data.choices[0].message.content,
  createdAt: serverTimestamp()
});
  
}

catch(error){

console.error(error);

botMsg.textContent="❌ Network Error";

}



chatBox.scrollTop = chatBox.scrollHeight;



}


});
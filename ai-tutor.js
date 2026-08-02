console.log("AI Tutor JS Loaded");

import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

console.log("Button:", sendBtn);
console.log("Input:", userInput);
console.log("Chat:", chatBox);

if (!sendBtn) {
    console.log("Send button not found");
    return;
}

sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

const message = userInput.value.trim();

if (!message) return;

const userMsg = document.createElement("div");
userMsg.className = "user-message";
userMsg.textContent = message;
chatBox.appendChild(userMsg);

userInput.value = "";

const botMsg = document.createElement("div");
botMsg.className = "bot-message";
botMsg.textContent = "🤖 Thinking...";
chatBox.appendChild(botMsg);

try {

const response = await fetch(
    "https://halex-v1.onrender.com/chat",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message
        })
    }
);

const data = await response.json();

console.log(data);

if (!response.ok) {
    botMsg.textContent =
        "❌ " + (data.error || "Server Error");
    return;
}
  botMsg.textContent = "🤖 " + data.reply;

if (auth.currentUser) {
    await addDoc(
        collection(db, "users", auth.currentUser.uid, "chats"),
        {
            userMessage: message,
            aiReply: data.reply,
            createdAt: serverTimestamp()
        }
    );
}

} catch (error) {

console.error(error);

botMsg.textContent = "❌ Network Error";

}

chatBox.scrollTop = chatBox.scrollHeight;

}

});
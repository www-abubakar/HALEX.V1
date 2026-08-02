const API_KEY = "or-v1-06dc7124e64406f91d3476deb0eca8885dc2b66e8a32debba613f1269c4a5f61";

import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const notesInput = document.getElementById("notesInput");
const summarizeBtn = document.getElementById("summarizeBtn");
const summaryOutput = document.getElementById("summaryOutput");

summarizeBtn.addEventListener("click", summarizeNotes);

async function summarizeNotes() {

  const notes = notesInput.value.trim();

  if (!notes) {
    alert("Please enter some notes.");
    return;
  }

  summaryOutput.innerHTML = "🤖 Summarizing...";

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "StudyAI"
        },
        body: JSON.stringify({
          model: "openrouter/auto",
          messages: [
            {
              role: "system",
              content: "You are an expert teacher. Summarize notes into easy bullet points."
            },
            {
              role: "user",
              content: notes
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      summaryOutput.innerHTML =
        "❌ " + (data.error?.message || "API Error");
      return;
    }

    summaryOutput.innerHTML =
      data.choices?.[0]?.message?.content || "No summary generated.";
await addDoc(
  collection(db, "users", auth.currentUser.uid, "notes"),
  {
    originalNotes: notes,
    summary: data.choices?.[0]?.message?.content || "",
    createdAt: serverTimestamp()
  }
);
  } catch (error) {

    console.error(error);
    summaryOutput.innerHTML = "❌ Network Error";

  }

}
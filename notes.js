import { db, auth } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const notesInput = document.getElementById("notesInput");
const summarizeBtn = document.getElementById("summarizeBtn");
const summaryOutput = document.getElementById("summaryOutput");


if (summarizeBtn) {
  summarizeBtn.addEventListener("click", summarizeNotes);
}


async function summarizeNotes() {

  const notes = notesInput.value.trim();

  if (!notes) {
    alert("Please enter some notes.");
    return;
  }


  summaryOutput.innerHTML = "🤖 Summarizing...";


  try {


    const response = await fetch(
      "https://halex-v1.onrender.com/summarize",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          notes: notes
        })
      }
    );


    const data = await response.json();


    if (!response.ok) {

      summaryOutput.innerHTML =
        "❌ " + (data.error || "API Error");

      return;
    }



    summaryOutput.innerHTML =
      data.summary || "No summary generated.";



    if (auth.currentUser) {

      await addDoc(
        collection(
          db,
          "users",
          auth.currentUser.uid,
          "notes"
        ),

        {
          originalNotes: notes,
          summary: data.summary || "",
          createdAt: serverTimestamp()
        }
      );

    }



  } catch (error) {


    console.error(error);

    summaryOutput.innerHTML =
      "❌ Network Error";


  }

}
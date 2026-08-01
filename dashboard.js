import { app, db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const auth = getAuth(app);

const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {

  if (user) {

    userEmail.textContent = "👤 " + user.email;
loadChatHistory(user.uid);
  } else {

    window.location.href = "login.html";

  }

});

logoutBtn.addEventListener("click", async () => {

  try {

    await signOut(auth);

    alert("Logged out successfully");

    window.location.href = "login.html";

  } catch (error) {

    alert(error.message);

  }

});
function loadChatHistory(uid){

const historyBox = document.getElementById("historyBox");


const chatsRef = collection(
  db,
  "users",
  uid,
  "chats"
);


const q = query(
  chatsRef,
  orderBy("createdAt","desc")
);



onSnapshot(q,(snapshot)=>{
  console.log("Documents:", snapshot.size);


historyBox.innerHTML="";


if(snapshot.empty){

historyBox.innerHTML="No chats found";

return;

}


snapshot.forEach((doc)=>{

const chat = doc.data();


historyBox.innerHTML += `
<div class="history-card">

<p><b>👤 You:</b> ${chat.userMessage}</p>

<p><b>🤖 AI:</b> ${chat.aiReply}</p>

<button onclick="deleteChat('${doc.id}')">
🗑 Delete
</button>

</div>
`;



});


});


}
window.deleteChat = async function(chatId){

try{

await deleteDoc(
doc(
db,
"users",
auth.currentUser.uid,
"chats",
chatId
)
);

alert("Chat Deleted ✅");

}catch(error){

alert(error.message);

}

}

const deleteAllBtn = document.getElementById("deleteAllBtn");

deleteAllBtn.addEventListener("click", async () => {

  if (!confirm("Delete all chats?")) return;

  const chatsRef = collection(
    db,
    "users",
    auth.currentUser.uid,
    "chats"
  );

  const snapshot = await getDocs(chatsRef);

  for (const chat of snapshot.docs) {
    await deleteDoc(chat.ref);
  }

  alert("✅ All chats deleted");
});
/*==================================================
   STUDYAI PREMIUM AI DASHBOARD
   dashboard.js
   PART 1
==================================================*/


//==============================
// FIREBASE IMPORTS
//==============================


import { auth, db } from "./firebase.js";



import {

collection,
query,
orderBy,
onSnapshot,
deleteDoc,
doc,
getDocs

}

from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";



import {

onAuthStateChanged,
signOut

}

from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";







console.log("🚀 StudyAI Premium Dashboard Loaded");








//==============================
// DOM ELEMENTS
//==============================



const sidebar = 
document.querySelector(".sidebar");



const menuToggle =
document.getElementById("menuToggle");



const searchInput =
document.getElementById("searchInput");



const userEmail =
document.getElementById("userEmail");



const welcomeText =
document.getElementById("welcomeText");



const logoutBtn =
document.getElementById("logoutBtn");



const historyBox =
document.getElementById("historyBox");



const deleteAllBtn =
document.getElementById("deleteAllBtn");



const chatCount =
document.getElementById("chatCount");



const quizCount =
document.getElementById("quizCount");



const notesCount =
document.getElementById("notesCount");









//==============================
// MOBILE SIDEBAR
//==============================



if(menuToggle && sidebar){



menuToggle.addEventListener(
"click",
()=>{


sidebar.classList.toggle("active");


});


}





document.addEventListener(
"click",
(e)=>{


if(

window.innerWidth <= 900 &&

sidebar &&

!sidebar.contains(e.target) &&

!menuToggle.contains(e.target)

){


sidebar.classList.remove("active");


}



});









//==============================
// GREETING SYSTEM
//==============================



function updateGreeting(){



if(!welcomeText)
return;



const hour =
new Date().getHours();



let greeting;



if(hour < 12){


greeting =
"Good Morning ☀️";


}

else if(hour < 18){


greeting =
"Good Afternoon 🌤";


}

else{


greeting =
"Good Evening 🌙";


}





welcomeText.textContent =
greeting;




}









//==============================
// AUTH SYSTEM
//==============================



onAuthStateChanged(

auth,

(user)=>{



if(!user){


window.location.href =
"login.html";


return;


}




if(userEmail){


userEmail.textContent =
user.email;


}




updateGreeting();





loadDashboard(
user.uid
);




}

);









//==============================
// LOAD DASHBOARD DATA
//==============================



function loadDashboard(uid){



loadChatHistory(uid);



loadStatistics(uid);



}






// PART 2 CONTINUE...
/*==================================================
   STUDYAI PREMIUM AI DASHBOARD
   dashboard.js
   PART 2
==================================================*/



//==============================
// CHAT HISTORY SYSTEM
//==============================



function loadChatHistory(uid){



if(!historyBox)
return;





historyBox.innerHTML = `

<div class="loading">

Loading conversations...

</div>

`;






const chatsRef = collection(

db,

"users",

uid,

"chats"

);






const q = query(

chatsRef,

orderBy(

"createdAt",

"desc"

)

);






onSnapshot(

q,

(snapshot)=>{



historyBox.innerHTML = "";





if(snapshot.empty){



historyBox.innerHTML = `

<div class="empty-history">

<i class="fas fa-comments"></i>

<h3>
No Conversations Yet
</h3>


<p>
Start learning with AI Tutor.
</p>


</div>

`;



if(chatCount){

chatCount.textContent="0";

}


return;


}







let total = 0;







snapshot.forEach(

(chat)=>{



total++;





const data =
chat.data();






const card =
document.createElement("div");





card.className =
"history-card";






card.innerHTML = `


<p>

<b>👤 You</b><br>

${data.userMessage || "No message"}

</p>



<p>

<b>🤖 AI</b><br>

${data.aiReply || "No reply"}

</p>




<button class="delete-chat"
data-id="${chat.id}">


<i class="fas fa-trash"></i>

Delete


</button>


`;






historyBox.appendChild(card);



});








if(chatCount){

chatCount.textContent =
total;

}






addDeleteEvents();





}


);



}









//==============================
// STATISTICS
//==============================



function loadStatistics(uid){



// QUIZ COUNT


const quizRef =
collection(

db,

"users",

uid,

"quizHistory"

);





onSnapshot(

quizRef,

(snapshot)=>{


animateNumber(

quizCount,

snapshot.size

);


}



);







// NOTES COUNT


const notesRef =
collection(

db,

"users",

uid,

"notes"

);





onSnapshot(

notesRef,

(snapshot)=>{


animateNumber(

notesCount,

snapshot.size

);


}



);



}









//==============================
// NUMBER ANIMATION
//==============================



function animateNumber(

element,

target

){



if(!element)
return;



let current = 0;



const interval =
setInterval(()=>{



current += Math.ceil(

target / 20

);





if(current >= target){



element.textContent =
target;



clearInterval(interval);



}

else{



element.textContent =
current;



}




},40);





}









//==============================
// DELETE SINGLE CHAT
//==============================



function addDeleteEvents(){



document

.querySelectorAll(".delete-chat")

.forEach(button=>{





button.onclick = async()=>{





const id =
button.dataset.id;






try{



await deleteDoc(

doc(

db,

"users",

auth.currentUser.uid,

"chats",

id

)

);




showToast(

"Chat deleted successfully ✅",

"success"

);





}

catch(error){



showToast(

"Delete failed ❌",

"error"

);



}



};





});





}









//==============================
// DELETE ALL CHATS
//==============================



if(deleteAllBtn){



deleteAllBtn.onclick = async()=>{





const confirmDelete =
confirm(

"Delete all AI conversations?"

);





if(!confirmDelete)
return;






try{



const chats =
collection(

db,

"users",

auth.currentUser.uid,

"chats"

);





const snapshot =
await getDocs(chats);






for(const item of snapshot.docs){



await deleteDoc(

item.ref

);



}





showToast(

"All chats removed 🗑",

"success"

);





}

catch(error){



showToast(

error.message,

"error"

);



}





};



}





// PART 3 CONTINUE...

/*==================================================
   STUDYAI PREMIUM AI DASHBOARD
   dashboard.js
   PART 3 FINAL
==================================================*/



//==============================
// LOGOUT SYSTEM
//==============================



if(logoutBtn){



logoutBtn.addEventListener(

"click",

async()=>{



try{



await signOut(auth);





showToast(

"Logged out successfully 👋",

"success"

);





setTimeout(()=>{


window.location.href =
"login.html";


},800);






}

catch(error){



showToast(

error.message,

"error"

);



}



}



);



}









//==============================
// SEARCH SYSTEM
//==============================



//==============================
// GLOBAL AI SEARCH
//==============================

const searchResults = document.getElementById("searchResults");

if (searchInput && searchResults) {

  searchInput.addEventListener("input", () => {

    const topic = searchInput.value.trim();

    searchResults.innerHTML =
      `<div class="search-title">AI Search</div>`;

    if (topic === "") {
      searchResults.classList.remove("active");
      return;
    }

    const options = [
      {
        icon: "fa-robot",
        title: `Ask AI about "${topic}"`,
        subtitle: "Open AI Tutor",
        page: "ai-tutor.html"
      },
      {
        icon: "fa-brain",
        title: `Generate "${topic}" Quiz`,
        subtitle: "Practice with AI",
        page: "quiz.html"
      },
      {
        icon: "fa-file-lines",
        title: `Create "${topic}" Notes`,
        subtitle: "AI Smart Notes",
        page: "notes.html"
      },
      {
        icon: "fa-book-open",
        title: `Search "${topic}" Papers`,
        subtitle: "Previous Papers",
        page: "pdf.html"
      }
    ];

    options.forEach(item => {

      const div = document.createElement("div");

      div.className = "search-item";

      div.innerHTML = `
        <i class="fas ${item.icon}"></i>

        <div>
          <strong>${item.title}</strong>
          <span>${item.subtitle}</span>
        </div>
      `;

      div.onclick = () => {
        window.location.href = item.page;
      };

      searchResults.appendChild(div);

    });

    searchResults.classList.add("active");

  });

  document.addEventListener("click", (e) => {

    if (!e.target.closest(".global-search")) {
      searchResults.classList.remove("active");
    }

  });

}





//==============================
// TOAST SYSTEM
//==============================



function showToast(

message,

type="success"

){





const toast =
document.createElement("div");





toast.className =

"toast " + type;






toast.innerHTML = message;






document.body.appendChild(toast);







setTimeout(()=>{


toast.classList.add(
"show"
);


},50);








setTimeout(()=>{


toast.classList.remove(
"show"
);



setTimeout(()=>{


toast.remove();


},300);



},2500);






}









//==============================
// ONLINE STATUS
//==============================



function updateOnlineStatus(){





const dot =

document.querySelector(

".notification span"

);





if(!dot)
return;







if(navigator.onLine){



dot.style.background =
"#22c55e";


dot.title =
"Online";



}

else{



dot.style.background =
"#ef4444";


dot.title =
"Offline";



}





}






window.addEventListener(

"online",

updateOnlineStatus

);





window.addEventListener(

"offline",

updateOnlineStatus

);






updateOnlineStatus();









//==============================
// PAGE LOAD ANIMATION
//==============================



window.addEventListener(

"load",

()=>{



document.body.style.opacity =
"0";





requestAnimationFrame(()=>{



document.body.style.transition =
"opacity .5s ease";



document.body.style.opacity =
"1";




});



});









//==============================
// CARD STAGGER ANIMATION
//==============================



const cards =

document.querySelectorAll(

".feature-card,.insight-card,.goal-card"

);






cards.forEach(

(card,index)=>{



card.style.animationDelay =

(index * 0.08)+"s";



});








console.log(

"✅ StudyAI Premium Dashboard Ready"

);
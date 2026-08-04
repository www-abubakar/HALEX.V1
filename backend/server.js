import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("StudyAI Backend is Running ✅");
});


// AI Tutor Chat
app.post("/chat", async (req, res) => {

  try {

    const { message } = req.body;


    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://halex-v1.onrender.com",
          "X-Title": "StudyAI"
        },

        body: JSON.stringify({

          model: "openrouter/auto",

          messages: [
            {
              role: "user",
              content: message
            }
          ]

        })

      }
    );


    const data = await response.json();


    res.json({

      reply:
      data.choices[0].message.content

    });


  } catch(error){

    console.error(error);

    res.status(500).json({
      error:"Server Error"
    });

  }

});




// Notes + PDF Summary
app.post("/summarize", async (req,res)=>{


try{


const { notes } = req.body;


const response = await fetch(

"https://openrouter.ai/api/v1/chat/completions",

{

method:"POST",

headers:{

"Authorization":
`Bearer ${process.env.OPENROUTER_API_KEY}`,

"Content-Type":"application/json"

},

body:JSON.stringify({

model:"openrouter/auto",

messages:[

{

role:"system",

content:
"You are an expert teacher. Summarize into simple bullet points."

},

{

role:"user",

content:notes

}

]

})

}

);



const data = await response.json();



res.json({

summary:
data.choices[0].message.content

});



}catch(error){


console.error(error);


res.status(500).json({

error:"Server Error"

});


}


});





// Quiz Generator
app.post("/quiz", async(req,res)=>{


try{


const { topic } = req.body;


const response = await fetch(

"https://openrouter.ai/api/v1/chat/completions",

{

method:"POST",

headers:{

"Authorization":
`Bearer ${process.env.OPENROUTER_API_KEY}`,

"Content-Type":"application/json"

},

body:JSON.stringify({

model:"openrouter/auto",

messages:[

{

role:"system",

content:

"Create exactly 10 multiple-choice questions with 4 options each. Mention correct answer after every question."

},

{

role:"user",

content:

`Generate a quiz about: ${topic}`

}

]

})

}

);



const data = await response.json();



res.json({

quiz:
data.choices[0].message.content

});



}catch(error){


console.error(error);


res.status(500).json({

error:"Server Error"

});


}


});





const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

console.log(
`🚀 Server running on port ${PORT}`
);

});
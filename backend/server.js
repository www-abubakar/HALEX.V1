import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req,res)=>{
    res.send("StudyAI Backend is Running ✅");
});



async function openRouterAI(messages){

    const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            method:"POST",

            headers:{
                "Authorization":
                `Bearer ${process.env.OPENROUTER_API_KEY}`,

                "Content-Type":"application/json",

                "HTTP-Referer":
                "https://halex-v1.onrender.com",

                "X-Title":"StudyAI"
            },

            body:JSON.stringify({

                model:"openrouter/auto",

                messages:messages

            })
        }
    );


    const data = await response.json();

console.log(JSON.stringify(data, null, 2));
  
    if(!response.ok){

        console.log("OpenRouter Error:",data);

        throw new Error(
            data.error?.message || "AI Error"
        );

    }


if (!data.choices || !data.choices.length) {
  throw new Error(JSON.stringify(data));
}

return data.choices[0].message.content;

}





// ===============================
// AI TUTOR CHAT
// ===============================

app.post("/chat",async(req,res)=>{

try{


const {message}=req.body;


const reply = await openRouterAI([

{
role:"user",
content:message
}

]);


res.json({
reply:reply
});


}catch(error){

console.log(error);

res.status(500).json({

error:error.message

});

}

});





// ===============================
// NOTES SUMMARY
// ===============================


app.post("/summarize",async(req,res)=>{

try{


const {notes}=req.body;


const summary = await openRouterAI([

{
role:"system",
content:
"You are an expert teacher. Summarize notes into simple bullet points."
},

{
role:"user",
content:notes
}

]);


res.json({

summary:summary

});


}catch(error){

console.log(error);

res.status(500).json({

error:error.message

});

}

});






// ===============================
// QUIZ GENERATOR
// ===============================


app.post("/quiz",async(req,res)=>{

try{


const {topic}=req.body;


const quiz = await openRouterAI([


{
role:"system",

content:

"Create exactly 10 multiple choice questions. Each question must have 4 options and mention correct answer."
},


{
role:"user",

content:

`Generate quiz about ${topic}`

}


]);



res.json({

quiz:quiz

});



}catch(error){


console.log(error);


res.status(500).json({

error:error.message

});


}


});





const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

console.log(
`🚀 Server running on port ${PORT}`
);

});
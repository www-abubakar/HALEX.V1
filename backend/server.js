import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get("/", (req, res) => {
  res.send("StudyAI Backend is Running ✅");
});

async function geminiAI(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash"
    });

    const result = await model.generateContent(prompt);

    const response = result.response;

    return response.text();

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI Server Error");
  }
}

// ===============================
// AI TUTOR CHAT
// ===============================

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const reply = await geminiAI(message);

    res.json({
      reply
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

// ===============================
// NOTES SUMMARY
// ===============================

app.post("/summarize", async (req, res) => {
  try {

    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({
        error: "Notes are required"
      });
    }

    const prompt = `
You are an expert teacher.

Summarize these notes into simple bullet points.

Notes:
${notes}
`;

    const summary = await geminiAI(prompt);

    res.json({
      summary
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
});

// ===============================
// QUIZ GENERATOR
// ===============================

app.post("/quiz", async (req, res) => {
  try {

    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        error: "Topic is required"
      });
    }

    const prompt = `
Create exactly 10 multiple choice questions about "${topic}".

Rules:
- Each question must have 4 options (A, B, C, D).
- Mention the correct answer after each question.
- Keep the language simple for students.
`;

    const quiz = await geminiAI(prompt);

    res.json({
      quiz
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
});

// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 StudyAI Backend Running on Port ${PORT}`);
});
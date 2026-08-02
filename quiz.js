const API_KEY = "or-v1-06dc7124e64406f91d3476deb0eca8885dc2b66e8a32debba613f1269c4a5f61";

const topicInput = document.getElementById("topicInput");
const generateBtn = document.getElementById("generateBtn");
const quizOutput = document.getElementById("quizOutput");

generateBtn.addEventListener("click", generateQuiz);

async function generateQuiz() {

  const topic = topicInput.value.trim();

  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  quizOutput.textContent = "🤖 Generating quiz...";

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
              content:
                "Create exactly 10 multiple-choice questions with 4 options each. After every question, clearly mention the correct answer."
            },
            {
              role: "user",
              content: `Generate a quiz about: ${topic}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      quizOutput.textContent =
        "❌ " + (data.error?.message || "API Error");
      return;
    }

    quizOutput.textContent =
      data.choices?.[0]?.message?.content || "No quiz generated.";

  } catch (error) {

    console.error(error);
    quizOutput.textContent = "❌ Network Error.";

  }

}
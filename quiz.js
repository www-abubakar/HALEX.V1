const topicInput = document.getElementById("topicInput");
const generateBtn = document.getElementById("generateBtn");
const quizOutput = document.getElementById("quizOutput");


if (generateBtn) {
  generateBtn.addEventListener("click", generateQuiz);
}


async function generateQuiz() {

  const topic = topicInput.value.trim();


  if (!topic) {
    alert("Please enter a topic.");
    return;
  }


  quizOutput.textContent = "🤖 Generating quiz...";


  try {

    const response = await fetch(
      "https://halex-v1.onrender.com/quiz",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          topic: topic
        })
      }
    );


    const data = await response.json();


    if (!response.ok) {

      quizOutput.textContent =
        "❌ " + (data.error || "API Error");

      return;
    }


    quizOutput.textContent =
      data.quiz || "No quiz generated.";


  } catch (error) {

    console.error(error);

    quizOutput.textContent =
      "❌ Network Error.";

  }

}
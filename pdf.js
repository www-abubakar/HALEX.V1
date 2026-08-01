const API_KEY ="k-or-v1-06dc7124e64406f91d3476deb0eca8885dc2b66e8a32debba613f1269c4a5f61";

const pdfFile = document.getElementById("pdfFile");
const readPdfBtn = document.getElementById("readPdfBtn");
const summaryOutput = document.getElementById("summaryOutput");

readPdfBtn.addEventListener("click", readPDF);

async function readPDF() {

  const file = pdfFile.files[0];

  if (!file) {
    alert("Please select a PDF file.");
    return;
  }

  summaryOutput.textContent = "📄 Reading PDF...";

  try {

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer
    }).promise;

    let text = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

      const page = await pdf.getPage(pageNum);

      const content = await page.getTextContent();

      text += content.items.map(item => item.str).join(" ") + "\n";

    }

    summaryOutput.textContent = "🤖 Summarizing...";

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
              content: "Summarize the following PDF into simple bullet points."
            },
            {
              role: "user",
              content: text.substring(0, 12000)
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      summaryOutput.textContent =
        "❌ " + (data.error?.message || "API Error");
      return;
    }

    summaryOutput.textContent =
      data.choices?.[0]?.message?.content || "No summary available.";

  } catch (error) {

    console.error(error);
    summaryOutput.textContent = "❌
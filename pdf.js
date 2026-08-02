const pdfFile = document.getElementById("pdfFile");
const readPdfBtn = document.getElementById("readPdfBtn");
const summaryOutput = document.getElementById("summaryOutput");


if (readPdfBtn) {
  readPdfBtn.addEventListener("click", readPDF);
}


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

      text += content.items
        .map(item => item.str)
        .join(" ") + "\n";

    }


    summaryOutput.textContent = "🤖 Summarizing...";


    const response = await fetch(
      "https://halex-v1.onrender.com/summarize",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          notes: text.substring(0, 12000)
        })
      }
    );


    const data = await response.json();


    if (!response.ok) {

      summaryOutput.textContent =
        "❌ " + (data.error || "API Error");

      return;

    }


    summaryOutput.textContent =
      data.summary || "No summary available.";


  } catch (error) {

    console.error(error);

    summaryOutput.textContent =
      "❌ Network Error";

  }

}
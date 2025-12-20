console.log("resume-jd.js loaded ✅");

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }

  return text;
}

async function analyzeFit() {
  console.log("Analyze Fit clicked ✅");

  const resumeFile = document.getElementById("resume").files[0];
  const jdFile = document.getElementById("jd").files[0];

  if (!resumeFile || !jdFile) {
    alert("Upload both Resume and JD PDFs");
    return;
  }

  const resumeText = await extractTextFromPDF(resumeFile);
  const jdText = await extractTextFromPDF(jdFile);

  console.log("Extracted text lengths:", resumeText.length, jdText.length);

  const response = await fetch(
    "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jdText })
    }
  );

  const data = await response.json();
  console.log("Backend response ✅", data);

  renderResults(data);
}

function renderResults(data) {
  document.getElementById("results").style.display = "block";
  document.getElementById("score").innerText = data.score;

  fillList("company", data.company_looking_for);
  fillList("strengths", data.strengths);
  fillList("weaknesses", data.weaknesses);
  fillList("opportunities", data.opportunities);
  fillList("threats", data.threats);
}

function fillList(id, items = []) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  items.forEach(i => {
    const li = document.createElement("li");
    li.innerText = i;
    el.appendChild(li);
  });
}

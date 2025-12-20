console.log("resume-jd.js loaded ✅");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

document.getElementById("analyzeBtn").onclick = analyzeFit;

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    text += strings.join(" ") + "\n";
  }

  return text;
}

async function analyzeFit() {
  console.log("Analyze Fit clicked ✅");

  const resumeFile = document.getElementById("resume").files[0];
  const jdFile = document.getElementById("jd").files[0];

  if (!resumeFile || !jdFile) {
    alert("Upload both Resume and JD");
    return;
  }

  try {
    const resumeText = await extractTextFromPDF(resumeFile);
    const jdText = await extractTextFromPDF(jdFile);

    console.log("Resume text length:", resumeText.length);
    console.log("JD text length:", jdText.length);

    const payload = {
      resumeText: resumeText.slice(0, 3000),
      jdText: jdText.slice(0, 3000)
    };

    const res = await fetch(
      "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();
    console.log("Backend response ✅", data);

    if (data.error) {
      alert("Resume analysis failed");
      return;
    }

    document.getElementById("results").style.display = "block";
    document.getElementById("score").innerText =
      `Overall Match Score: ${data.score}/100`;

  } catch (err) {
    console.error("Resume JD error ❌", err);
    alert("Resume analysis failed");
  }
}

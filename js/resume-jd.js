console.log("resume-jd.js loaded ✅");

document.getElementById("analyzeBtn").onclick = analyzeFit;

async function analyzeFit() {
  console.log("Analyze Fit clicked ✅");

  const resumeFile = document.getElementById("resume").files[0];
  const jdFile = document.getElementById("jd").files[0];

  if (!resumeFile || !jdFile) {
    alert("Upload both files");
    return;
  }

  // IMPORTANT: text placeholder for now (works like morning)
  const resumeText = resumeFile.name;
  const jdText = jdFile.name;

  console.log("Sending payload →", { resumeText, jdText });

  try {
    const res = await fetch(
      "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText })
      }
    );

    const data = await res.json();

    if (data.error) {
      console.error("Backend error:", data);
      alert("Resume analysis failed (LLM error)");
      return;
    }

    console.log("Backend response ✅", data);

    document.getElementById("results").style.display = "block";
    document.getElementById("score").innerText =
      `Overall Match Score: ${data.score}/100`;

  } catch (err) {
    console.error("Fetch failed ❌", err);
    alert("Network / backend failure");
  }
}

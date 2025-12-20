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

  // ⚠️ TEMP: filenames only (until PDF parsing)
  const payload = {
    resumeText: resumeFile.name,
    jdText: jdFile.name
  };

  console.log("Sending payload →", payload);

  try {
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
    console.error("Fetch error ❌", err);
    alert("Network error");
  }
}

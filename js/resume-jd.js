console.log("resume-jd.js loaded ✅");

document
  .getElementById("analyzeBtn")
  .addEventListener("click", analyzeFit);

async function readFile(file) {
  if (file.type === "text/plain") {
    return await file.text();
  }

  // PDF fallback (simple, safe)
  return file.name; // avoids 413; upgrade later
}

async function analyzeFit() {
  console.log("Analyze Fit clicked ✅");

  const resumeFile = document.getElementById("resume").files[0];
  const jdFile = document.getElementById("jd").files[0];

  if (!resumeFile || !jdFile) {
    alert("Upload both files");
    return;
  }

  const resumeText = await readFile(resumeFile);
  const jdText = await readFile(jdFile);

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
    console.log("Backend response ✅", data);

    document.getElementById("results").style.display = "block";
    document.getElementById("score").innerText =
      `Overall Match Score: ${data.score}/100`;

  } catch (err) {
    console.error("Analyze failed ❌", err);
    alert("Resume analysis failed");
  }
}

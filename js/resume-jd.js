const API_BASE = "https://interview-gpt-backend-00vj.onrender.com";

async function analyzeFit() {
  const resumeFile = document.getElementById("resumeFile").files[0];
  const jdFile = document.getElementById("jdFile").files[0];

  if (!resumeFile || !jdFile) {
    alert("Please upload both Resume and Job Description");
    return;
  }

  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jd", jdFile);

  try {
    const res = await fetch(`${API_BASE}/resume-jd/analyze`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      throw new Error("Backend failed");
    }

    const data = await res.json();
    console.log(data);

    renderResults(data);
  } catch (err) {
    console.error(err);
    alert("Failed to analyze");
  }
}

/* ===============================
   RENDER RESULTS (THIS WAS MISSING)
   =============================== */
function renderResults(data) {
  const container = document.getElementById("results");
  container.style.display = "block";

  container.innerHTML = `
    <h2>Overall Match Score: ${data.score}/100</h2>

    <h3>Company is Looking For</h3>
    <ul>${data.company_looking_for.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Strengths</h3>
    <ul>${data.strengths.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Weaknesses</h3>
    <ul>${data.weaknesses.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Opportunities</h3>
    <ul>${data.opportunities.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Threats</h3>
    <ul>${data.threats.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Phrase-Level Resume Improvements</h3>
    <ul>${data.phrase_improvements.map(i => `<li>${i}</li>`).join("")}</ul>
  `;
}

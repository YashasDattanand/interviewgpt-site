console.log("resume-jd.js loaded ✅");

const API_URL = "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze";

const analyzeBtn = document.getElementById("analyzeBtn");
const resumeInput = document.getElementById("resumeFile");
const jdInput = document.getElementById("jdFile");

const resultsDiv = document.getElementById("results");
const scoreEl = document.getElementById("score");

const companyEl = document.getElementById("company");
const strengthsEl = document.getElementById("strengths");
const weaknessesEl = document.getElementById("weaknesses");
const opportunitiesEl = document.getElementById("opportunities");
const threatsEl = document.getElementById("threats");

analyzeBtn.addEventListener("click", analyzeFit);

async function analyzeFit() {
  console.log("Analyze Fit clicked ✅");

  if (!resumeInput.files[0] || !jdInput.files[0]) {
    alert("Please upload both Resume and JD files.");
    return;
  }

  const payload = {
    resumeText: resumeInput.files[0].name,
    jdText: jdInput.files[0].name
  };

  console.log("Sending payload →", payload);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Backend response ✅", data);

    if (!res.ok || data.error) {
      throw new Error(data.error || "Backend failed");
    }

    renderResults(data);

  } catch (err) {
    console.error("Resume analysis failed ❌", err);
    alert("Resume analysis failed. Try again.");
  }
}

function renderResults(data) {
  resultsDiv.style.display = "block";

  scoreEl.textContent = Math.min(
    Math.max(Math.round(data.score || 0), 0),
    100
  );

  renderList(companyEl, data.company_looking_for);
  renderList(strengthsEl, data.strengths);
  renderList(weaknessesEl, data.weaknesses);
  renderList(opportunitiesEl, data.opportunities);
  renderList(threatsEl, data.threats);
}

function renderList(el, items) {
  el.innerHTML = "";
  if (!Array.isArray(items)) return;

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

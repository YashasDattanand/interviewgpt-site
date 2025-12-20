const API_URL = "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze";

/* ================================
   MAIN ACTION
================================ */
async function analyzeFit() {
  const resumeFile = document.getElementById("resume").files[0];
  const jdFile = document.getElementById("jd").files[0];

  if (!resumeFile || !jdFile) {
    alert("Upload both Resume and JD");
    return;
  }

  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jd", jdFile);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Backend error");

    const raw = await res.json();
    console.log("RAW RESPONSE:", raw);

    const data = normalizeData(raw);
    renderResults(data);

  } catch (err) {
    console.error(err);
    alert("Failed to analyze");
  }
}

/* ================================
   DATA NORMALIZATION (CRITICAL)
================================ */
function normalizeData(d) {
  return {
    score: d.score ?? 0,
    company: Array.isArray(d.company_looking_for) ? d.company_looking_for : [],
    strengths: Array.isArray(d.strengths) ? d.strengths : [],
    weaknesses: Array.isArray(d.weaknesses) ? d.weaknesses : [],
    opportunities: Array.isArray(d.opportunities) ? d.opportunities : [],
    threats: Array.isArray(d.threats) ? d.threats : [],
    phrases: Array.isArray(d.phrases) ? d.phrases : []
  };
}

/* ================================
   RENDER RESULTS
================================ */
function renderResults(d) {
  document.getElementById("results").style.display = "block";
  document.getElementById("score").textContent = `${d.score}/100`;

  fillList("company", d.company);
  fillList("strengths", d.strengths);
  fillList("weaknesses", d.weaknesses);
  fillList("opportunities", d.opportunities);
  fillList("threats", d.threats);

  renderPhraseImprovements(d.phrases);
  renderCharts(d);
}

/* ================================
   SAFE LIST RENDERER
================================ */
function fillList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";

  if (!items.length) {
    ul.innerHTML = "<li>No insights generated</li>";
    return;
  }

  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });
}

/* ================================
   PHRASE FIXES (NO [object Object])
================================ */
function renderPhraseImprovements(phrases) {
  const ul = document.getElementById("phrases");
  ul.innerHTML = "";

  if (!phrases.length) {
    ul.innerHTML = "<li>No phrase-level suggestions available</li>";
    return;
  }

  phrases.forEach(p => {
    if (!p.original || !p.improved) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Before:</strong> ${p.original}<br/>
      <strong>After:</strong> ${p.improved}
    `;
    ul.appendChild(li);
  });
}

/* ================================
   SCORING CHARTS (MID SIZE)
================================ */
function renderCharts(d) {
  // Clear old charts if re-run
  document.getElementById("charts").innerHTML = `
    <canvas id="scoreChart"></canvas>
    <canvas id="swotChart"></canvas>
  `;

  /* Match Score Breakdown */
  new Chart(document.getElementById("scoreChart"), {
    type: "doughnut",
    data: {
      labels: ["Matched", "Gap"],
      datasets: [{
        data: [d.score, 100 - d.score],
        backgroundColor: ["#4CAF50", "#2c2c2c"]
      }]
    },
    options: {
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });

  /* SWOT Volume */
  new Chart(document.getElementById("swotChart"), {
    type: "bar",
    data: {
      labels: ["Strengths", "Weaknesses", "Opportunities", "Threats"],
      datasets: [{
        data: [
          d.strengths.length,
          d.weaknesses.length,
          d.opportunities.length,
          d.threats.length
        ],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3", "#ff9800"]
      }]
    },
    options: {
      plugins: {
        legend: { display: false }
      }
    }
  });
}

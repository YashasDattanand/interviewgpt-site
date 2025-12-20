const API_URL = "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze";

async function analyzeFit() {
  const resumeFile = document.getElementById("resume").files[0];
  const jdFile = document.getElementById("jd").files[0];

  if (!resumeFile || !jdFile) {
    alert("Please upload both Resume and Job Description");
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

    if (!res.ok) throw new Error("Backend failed");

    const data = await res.json();
    console.log("Resume-JD Response:", data);

    renderResults(data);

  } catch (err) {
    console.error(err);
    alert("Failed to analyze");
  }
}

function renderResults(data) {
  document.getElementById("results").style.display = "block";

  document.getElementById("score").textContent = data.score ?? "N/A";

  safeFillList("company", data.company_looking_for);
  safeFillList("strengths", data.strengths);
  safeFillList("weaknesses", data.weaknesses);
  safeFillList("opportunities", data.opportunities);
  safeFillList("threats", data.threats);

  renderPhraseImprovements(data.phrases);
  renderCharts(data);
}

/* ---------- SAFE HELPERS ---------- */

function safeFillList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No data available";
    ul.appendChild(li);
    return;
  }

  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

function renderPhraseImprovements(phrases) {
  const ul = document.getElementById("phrases");
  ul.innerHTML = "";

  if (!Array.isArray(phrases) || phrases.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No phrase-level suggestions generated.";
    ul.appendChild(li);
    return;
  }

  phrases.forEach(p => {
    if (!p || !p.original || !p.improved) return;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Before:</strong> ${p.original}<br/>
      <strong>After:</strong> ${p.improved}
    `;
    ul.appendChild(li);
  });
}

/* ---------- CHARTS ---------- */

function renderCharts(data) {
  const strengths = Array.isArray(data.strengths) ? data.strengths.length : 0;
  const weaknesses = Array.isArray(data.weaknesses) ? data.weaknesses.length : 0;
  const opportunities = Array.isArray(data.opportunities) ? data.opportunities.length : 0;
  const threats = Array.isArray(data.threats) ? data.threats.length : 0;

  // Radar chart
  new Chart(document.getElementById("skillChart"), {
    type: "radar",
    data: {
      labels: ["Strengths", "Weaknesses", "Opportunities", "Threats"],
      datasets: [{
        label: "Profile Balance",
        data: [
          strengths * 10,
          Math.max(0, 100 - weaknesses * 15),
          opportunities * 10,
          Math.max(0, 100 - threats * 15)
        ],
        backgroundColor: "rgba(54,162,235,0.25)",
        borderColor: "#36a2eb",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });

  // Bar chart
  new Chart(document.getElementById("swotChart"), {
    type: "bar",
    data: {
      labels: ["Strengths", "Weaknesses", "Opportunities", "Threats"],
      datasets: [{
        data: [strengths, weaknesses, opportunities, threats],
        backgroundColor: ["#4caf50", "#f44336", "#2196f3", "#ff9800"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

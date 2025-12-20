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
    console.log(data);

    renderResults(data);

  } catch (err) {
    console.error(err);
    alert("Failed to analyze");
  }
}

function renderResults(data) {
  document.getElementById("results").style.display = "block";

  document.getElementById("score").textContent = data.score;

  fillList("company", data.company_looking_for);
  fillList("strengths", data.strengths);
  fillList("weaknesses", data.weaknesses);
  fillList("opportunities", data.opportunities);
  fillList("threats", data.threats);

  // Phrase-level improvements (FIXED [Object Object])
  const phrasesUl = document.getElementById("phrases");
  phrasesUl.innerHTML = "";
  data.phrases.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>Before:</strong> ${p.original}<br/>
      <strong>After:</strong> ${p.improved}
    `;
    phrasesUl.appendChild(li);
  });

  renderCharts(data);
}

function fillList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  });
}

function renderCharts(data) {
  // Skill Radar
  new Chart(document.getElementById("skillChart"), {
    type: "radar",
    data: {
      labels: ["Strengths", "Weaknesses", "Opportunities", "Threats"],
      datasets: [{
        label: "Profile Balance",
        data: [
          data.strengths.length * 10,
          100 - data.weaknesses.length * 15,
          data.opportunities.length * 10,
          100 - data.threats.length * 15
        ],
        backgroundColor: "rgba(54,162,235,0.25)",
        borderColor: "#36a2eb",
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });

  // SWOT Bar
  new Chart(document.getElementById("swotChart"), {
    type: "bar",
    data: {
      labels: ["Strengths", "Weaknesses", "Opportunities", "Threats"],
      datasets: [{
        data: [
          data.strengths.length,
          data.weaknesses.length,
          data.opportunities.length,
          data.threats.length
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

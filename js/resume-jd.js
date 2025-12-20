async function analyzeFit() {
  const resumeFile = document.getElementById("resume").files[0];
  const jdFile = document.getElementById("jd").files[0];

  if (!resumeFile || !jdFile) {
    alert("Please upload both Resume and Job Description.");
    return;
  }

  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jd", jdFile);

  try {
    const res = await fetch(
      "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze",
      { method: "POST", body: formData }
    );

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

  // ✅ SCORE (FIXED)
  const score = Math.min(100, Math.round(data.score || 0));
  document.getElementById("score").innerText = score;

  // Utility to render lists safely
  function fillList(id, arr = []) {
    const ul = document.getElementById(id);
    ul.innerHTML = "";
    if (!Array.isArray(arr)) return;
    arr.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
  }

  fillList("company", data.company_looking_for);
  fillList("strengths", data.strengths);
  fillList("weaknesses", data.weaknesses);
  fillList("opportunities", data.opportunities);
  fillList("threats", data.threats);

  renderCharts(score, data);
}

function renderCharts(score, data) {
  // Destroy existing charts if re-run
  if (window.overallChart) window.overallChart.destroy();
  if (window.sectionChart) window.sectionChart.destroy();

  const ctx1 = document.getElementById("overallChart");
  const ctx2 = document.getElementById("sectionChart");

  // ✅ OVERALL SCORE DONUT
  window.overallChart = new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: ["Match", "Gap"],
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: ["#4CAF50", "#333"]
      }]
    },
    options: {
      plugins: { legend: { labels: { color: "#fff" } } }
    }
  });

  // ✅ SECTION SCORE BAR (LOGIC-BASED, NOT RANDOM)
  const sectionScores = [
    data.strengths?.length || 0,
    data.weaknesses?.length || 0,
    data.opportunities?.length || 0,
    data.threats?.length || 0
  ];

  window.sectionChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["Strengths", "Weaknesses", "Opportunities", "Threats"],
      datasets: [{
        data: sectionScores,
        backgroundColor: ["#4CAF50", "#F44336", "#2196F3", "#FF9800"]
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { ticks: { color: "#fff" } }
      }
    }
  });
}

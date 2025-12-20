let overallChart;
let sectionChart;

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

  const score = Math.max(0, Math.min(100, Math.round(data.score || 0)));
  document.getElementById("score").innerText = score;

  function fillList(id, arr = []) {
    const ul = document.getElementById(id);
    ul.innerHTML = "";
    if (!Array.isArray(arr)) return;
    arr.forEach(text => {
      const li = document.createElement("li");
      li.textContent = text;
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

function resetCanvas(id) {
  const canvas = document.getElementById(id);
  const parent = canvas.parentNode;
  parent.removeChild(canvas);
  const newCanvas = document.createElement("canvas");
  newCanvas.id = id;
  parent.appendChild(newCanvas);
  return newCanvas.getContext("2d");
}

function renderCharts(score, data) {
  // 🔒 HARD RESET CANVAS (NO destroy())
  const ctx1 = resetCanvas("overallChart");
  const ctx2 = resetCanvas("sectionChart");

  overallChart = new Chart(ctx1, {
    type: "doughnut",
    data: {
      labels: ["Match", "Gap"],
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: ["#4CAF50", "#2c2c2c"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: "#fff" }
        }
      }
    }
  });

  sectionChart = new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["Strengths", "Weaknesses", "Opportunities", "Threats"],
      datasets: [{
        data: [
          data.strengths?.length || 0,
          data.weaknesses?.length || 0,
          data.opportunities?.length || 0,
          data.threats?.length || 0
        ],
        backgroundColor: ["#4CAF50", "#F44336", "#2196F3", "#FF9800"]
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#fff" } },
        y: { ticks: { color: "#fff" } }
      }
    }
  });
}

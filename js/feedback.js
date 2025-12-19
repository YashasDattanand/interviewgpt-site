document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("feedback");

  if (!raw) {
    document.getElementById("overall").innerText = "No feedback data found.";
    return;
  }

  const data = JSON.parse(raw);

  // OVERALL SCORE
  document.getElementById("overall").innerText =
    `Overall Score: ${data.overall || "N/A"}/10`;

  // LIST HELPERS
  function fillList(id, items) {
    const ul = document.getElementById(id);
    ul.innerHTML = "";
    (items || []).forEach(item => {
      const li = document.createElement("li");
      li.innerText = item;
      ul.appendChild(li);
    });
  }

  fillList("strengths", data.strengths);
  fillList("weaknesses", data.weaknesses);
  fillList("improvements", data.improvements);

  // RADAR CHART
  new Chart(document.getElementById("scoreChart"), {
    type: "radar",
    data: {
      labels: ["Communication", "Clarity", "Confidence", "Structure"],
      datasets: [{
        label: "Score",
        data: [
          data.scores.communication,
          data.scores.clarity,
          data.scores.confidence,
          data.scores.structure || 6
        ],
        backgroundColor: "rgba(56,189,248,0.25)",
        borderColor: "#38bdf8",
        pointBackgroundColor: "#38bdf8"
      }]
    },
    options: {
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 10,
          ticks: { color: "#cbd5f5" }
        }
      },
      plugins: { legend: { display: false } }
    }
  });

  // CONFIDENCE TIMELINE
  new Chart(document.getElementById("timelineChart"), {
    type: "line",
    data: {
      labels: data.timeline.map((_, i) => `Q${i + 1}`),
      datasets: [{
        label: "Confidence",
        data: data.timeline,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.3)",
        tension: 0.3
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 10 }
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("feedback");

  if (!raw) {
    document.getElementById("status").innerText = "No feedback data found.";
    return;
  }

  const data = JSON.parse(raw);

  document.getElementById("overall").innerText =
    `Overall Score: ${data.overall || 6}/10`;

  function fill(id, items) {
    const el = document.getElementById(id);
    el.innerHTML = "";
    items.forEach(i => {
      const li = document.createElement("li");
      li.innerText = i;
      el.appendChild(li);
    });
  }

  fill("strengths", data.strengths || []);
  fill("weaknesses", data.weaknesses || []);
  fill("improvements", data.improvements || []);

  // RADAR CHART
  new Chart(document.getElementById("radarChart"), {
    type: "radar",
    data: {
      labels: ["Communication", "Clarity", "Confidence", "Structure"],
      datasets: [{
        data: [
          data.scores.communication,
          data.scores.clarity,
          data.scores.confidence,
          data.scores.structure || 6
        ],
        backgroundColor: "rgba(56,189,248,0.25)",
        borderColor: "#38bdf8"
      }]
    },
    options: {
      scales: { r: { min: 0, max: 10 } },
      plugins: { legend: { display: false } }
    }
  });

  // CONFIDENCE TIMELINE
  new Chart(document.getElementById("timelineChart"), {
    type: "line",
    data: {
      labels: data.timeline.map((_, i) => `Q${i + 1}`),
      datasets: [{
        data: data.timeline,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.25)",
        tension: 0.4
      }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 10 } }
    }
  });
});

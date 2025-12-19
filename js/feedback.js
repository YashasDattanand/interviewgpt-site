const feedback = JSON.parse(localStorage.getItem("feedback"));
const transcript = JSON.parse(localStorage.getItem("transcript"));

if (!feedback) {
  document.getElementById("overall").innerText = "No feedback data found.";
  throw new Error("No feedback");
}

// ---------- OVERALL ----------
document.getElementById("overall").innerText =
  `Overall Score: ${feedback.overallScore}/10`;

// ---------- LISTS ----------
function fillList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  items.forEach(i => {
    const li = document.createElement("li");
    li.innerText = i;
    ul.appendChild(li);
  });
}

fillList("strengths", feedback.strengths);
fillList("weaknesses", feedback.weaknesses);
fillList("improvements", feedback.improvements);

// ---------- RADAR CHART ----------
new Chart(document.getElementById("scoreChart"), {
  type: "radar",
  data: {
    labels: ["Communication", "Clarity", "Confidence", "Structure"],
    datasets: [{
      label: "Scores",
      data: [
        feedback.scores.communication,
        feedback.scores.clarity,
        feedback.scores.confidence,
        feedback.scores.structure
      ],
      fill: true,
      backgroundColor: "rgba(56,189,248,0.2)",
      borderColor: "#38bdf8"
    }]
  },
  options: {
    scales: { r: { min: 0, max: 10 } }
  }
});

// ---------- TIMELINE (CONFIDENCE PER QUESTION) ----------
new Chart(document.getElementById("timelineChart"), {
  type: "line",
  data: {
    labels: feedback.timeline.map((_, i) => `Q${i + 1}`),
    datasets: [{
      label: "Confidence Trend",
      data: feedback.timeline,
      borderColor: "#22c55e",
      tension: 0.4
    }]
  }
});

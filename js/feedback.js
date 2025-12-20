(async () => {
  const conversation = JSON.parse(localStorage.getItem("conversation") || "[]");

  const res = await fetch(
    "https://interview-gpt-backend-00vj.onrender.com/feedback",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation })
    }
  );

  const data = await res.json();

  document.getElementById("feedback").innerHTML = `
    <h3>Interview Scores</h3>
    <canvas id="scoreChart" width="300" height="200"></canvas>

    <h3>Strengths</h3>
    <ul>${data.strengths.map(s => `<li>${s}</li>`).join("")}</ul>

    <h3>Weaknesses</h3>
    <ul>${data.weaknesses.map(w => `<li>${w}</li>`).join("")}</ul>

    <h3>Improvements</h3>
    <ul>${data.improvements.map(i => `<li>${i}</li>`).join("")}</ul>
  `;

  // ✅ Chart
  const ctx = document.getElementById("scoreChart").getContext("2d");
  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Communication", "Clarity", "Confidence"],
      datasets: [{
        label: "Interview Score",
        data: [
          data.scores.communication,
          data.scores.clarity,
          data.scores.confidence
        ],
        backgroundColor: "rgba(74, 222, 128, 0.2)",
        borderColor: "#4ade80"
      }]
    },
    options: {
      scales: { r: { min: 0, max: 10 } }
    }
  });
})();

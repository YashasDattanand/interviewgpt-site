const raw = localStorage.getItem("feedback");

if (!raw) {
  document.getElementById("status").innerText =
    "No feedback data found. Please complete an interview.";
} else {
  const data = JSON.parse(raw);
  document.getElementById("status").innerText = "";
  document.getElementById("content").style.display = "block";

  const avg = Math.round(
    (data.scores.communication +
     data.scores.clarity +
     data.scores.confidence) / 3
  );

  document.getElementById("overall").innerText = `Score: ${avg}/10`;

  function fill(id, arr) {
    const ul = document.getElementById(id);
    arr.forEach(x => {
      const li = document.createElement("li");
      li.innerText = x;
      ul.appendChild(li);
    });
  }

  fill("strengths", data.strengths);
  fill("weaknesses", data.weaknesses);
  fill("improvements", data.improvements);

  new Chart(document.getElementById("chart"), {
    type: "bar",
    data: {
      labels: ["Communication", "Clarity", "Confidence"],
      datasets: [{
        data: [
          data.scores.communication,
          data.scores.clarity,
          data.scores.confidence
        ],
        backgroundColor: ["#38bdf8", "#22c55e", "#f59e0b"]
      }]
    },
    options: {
      scales: { y: { min: 0, max: 10 } },
      plugins: { legend: { display: false } }
    }
  });
}

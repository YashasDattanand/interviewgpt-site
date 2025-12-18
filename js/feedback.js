async function loadFeedback() {
  const conversation = JSON.parse(localStorage.getItem("conversation"));

  const res = await fetch("https://interview-gpt-backend-00vj.onrender.com/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation })
  });

  const data = await res.json();

  new Chart(document.getElementById("chart"), {
    type: "radar",
    data: {
      labels: Object.keys(data.scores),
      datasets: [{
        label: "Score",
        data: Object.values(data.scores),
        backgroundColor: "rgba(0,123,255,0.3)"
      }]
    }
  });

  document.getElementById("text").innerHTML = `
    <h3>Strengths</h3><ul>${data.strengths.map(s=>`<li>${s}</li>`).join("")}</ul>
    <h3>Weaknesses</h3><ul>${data.weaknesses.map(s=>`<li>${s}</li>`).join("")}</ul>
    <h3>Improvements</h3><ul>${data.improvements.map(s=>`<li>${s}</li>`).join("")}</ul>
  `;
}

loadFeedback();

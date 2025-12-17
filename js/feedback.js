const conversation = JSON.parse(localStorage.getItem("conversation"));

fetch(`${BACKEND_URL}/feedback`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ conversation })
})
.then(r => r.json())
.then(data => {
  new Chart(document.getElementById("chart"), {
    type: "radar",
    data: {
      labels: Object.keys(data.scores),
      datasets: [{
        data: Object.values(data.scores),
        backgroundColor: "rgba(0,150,136,0.2)"
      }]
    }
  });

  document.getElementById("textFeedback").innerHTML = `
    <h3>Strengths</h3><ul>${data.strengths.map(s=>`<li>${s}</li>`).join("")}</ul>
    <h3>Improvements</h3><ul>${data.improvements.map(i=>`<li>${i}</li>`).join("")}</ul>
  `;
});

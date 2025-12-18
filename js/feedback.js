const BACKEND = "https://interview-gpt-backend-00vj.onrender.com";
const convo = JSON.parse(localStorage.getItem("conversation"));

fetch(`${BACKEND}/feedback`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ conversation: convo })
})
.then(r => r.json())
.then(d => {
  new Chart(chart, {
    type: "radar",
    data: {
      labels: Object.keys(d.scores),
      datasets: [{ data: Object.values(d.scores) }]
    }
  });

  text.innerHTML = `
    <h3>Strengths</h3><ul>${d.strengths.map(x=>`<li>${x}</li>`).join("")}</ul>
    <h3>Weaknesses</h3><ul>${d.weaknesses.map(x=>`<li>${x}</li>`).join("")}</ul>
    <h3>Improvements</h3><ul>${d.improvements.map(x=>`<li>${x}</li>`).join("")}</ul>
  `;
});

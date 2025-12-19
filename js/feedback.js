const convo = JSON.parse(localStorage.getItem("conversation")) || [];

fetch("https://interview-gpt-backend-00vj.onrender.com/feedback", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ conversation: convo })
})
.then(res => res.json())
.then(data => {
  document.getElementById("feedback").innerHTML = `
    <h3>Overall Score: ${data.overall || 6}/10</h3>

    <p><b>Communication:</b> ${data.scores.communication}</p>
    <p><b>Clarity:</b> ${data.scores.clarity}</p>
    <p><b>Confidence:</b> ${data.scores.confidence}</p>

    <h3>Strengths</h3>
    <ul>${data.strengths.map(s => `<li>${s}</li>`).join("")}</ul>

    <h3>Weaknesses</h3>
    <ul>${data.weaknesses.map(w => `<li>${w}</li>`).join("")}</ul>

    <h3>Improvements</h3>
    <ul>${data.improvements.map(i => `<li>${i}</li>`).join("")}</ul>
  `;
})
.catch(() => {
  document.getElementById("feedback").innerText = "Feedback generation failed.";
});

const API = "https://interview-gpt-backend-00vj.onrender.com";

async function loadFeedback() {
  const conversation = JSON.parse(localStorage.getItem("conversation")) || [];

  const res = await fetch(`${API}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation })
  });

  const data = await res.json();

  if (data.error) {
    document.body.innerHTML += "<p>Feedback failed</p>";
    return;
  }

  document.getElementById("scores").innerHTML = `
    Communication: ${data.scores.communication}<br>
    Clarity: ${data.scores.clarity}<br>
    Confidence: ${data.scores.confidence}
  `;

  document.getElementById("strengths").innerHTML =
    data.strengths.map(s => `<li>${s}</li>`).join("");

  document.getElementById("improvements").innerHTML =
    data.improvements.map(i => `<li>${i}</li>`).join("");
}

loadFeedback();

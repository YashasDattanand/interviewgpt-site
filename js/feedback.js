async function load() {
  const conversation = JSON.parse(localStorage.getItem("conversation"));

  const res = await fetch(
    "https://interview-gpt-backend-00vj.onrender.com/feedback",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversation })
    }
  );

  const data = await res.json();

  document.getElementById("output").innerHTML = `
Overall Score: ${data.overallScore}/10

Communication: ${data.communication}
Clarity: ${data.clarity}
Confidence: ${data.confidence}

Strengths:
- ${data.strengths.join("\n- ")}

Weaknesses:
- ${data.weaknesses.join("\n- ")}

Improvements:
- ${data.improvements.join("\n- ")}
`;
}

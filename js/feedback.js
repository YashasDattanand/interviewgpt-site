const BACKEND = "https://interview-gpt-backend-00vj.onrender.com";

async function loadFeedback() {
  const conversation = JSON.parse(localStorage.getItem("conversation"));

  const res = await fetch(`${BACKEND}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation })
  });

  const data = await res.json();

  document.getElementById("output").innerText =
    JSON.stringify(data, null, 2);
}

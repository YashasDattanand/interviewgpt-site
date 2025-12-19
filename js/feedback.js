async function load() {
  const conversation = JSON.parse(localStorage.getItem("conversation"));

  const res = await fetch("https://interview-gpt-backend-00vj.onrender.com/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation })
  });

  const data = await res.json();
  document.getElementById("output").textContent = JSON.stringify(data, null, 2);
}

function analyze() {
  fetch(`${BACKEND_URL}/resume-jd`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      resume: document.getElementById("resume").value,
      jd: document.getElementById("jd").value
    })
  })
  .then(r => r.json())
  .then(d => document.getElementById("result").innerText = JSON.stringify(d, null, 2));
}

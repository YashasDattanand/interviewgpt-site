async function analyzeFit() {
  const resume = document.getElementById("resume").files[0];
  const jd = document.getElementById("jd").files[0];

  if (!resume || !jd) {
    alert("Upload both Resume and JD");
    return;
  }

  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("jd", jd);

  const res = await fetch(
    "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze",
    {
      method: "POST",
      body: formData
    }
  );

  const data = await res.json();

  document.getElementById("results").style.display = "block";
  document.getElementById("score").innerText = data.overallScore + "%";

  const ctx = document.getElementById("resumeChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Skills Match", "Experience Fit", "Role Alignment"],
      datasets: [{
        data: [
          data.breakdown.skills,
          data.breakdown.experience,
          data.breakdown.role
        ],
        backgroundColor: ["#60a5fa", "#34d399", "#fbbf24"]
      }]
    },
    options: {
      scales: { y: { min: 0, max: 100 } },
      plugins: { legend: { display: false } }
    }
  });
}

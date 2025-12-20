const API = "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze";

let overallChart, sectionChart;

async function analyzeFit() {
  const resume = document.getElementById("resume").files[0];
  const jd = document.getElementById("jd").files[0];

  if (!resume || !jd) {
    alert("Upload both files");
    return;
  }

  const resumeText = await resume.text();
  const jdText = await jd.text();

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText, jdText })
  });

  const data = await res.json();
  renderResults(data);
}

function renderResults(data) {
  document.getElementById("results").style.display = "block";
  document.getElementById("score").innerText =
    `Overall Match Score: ${data.score}/100`;

  renderList("company", data.companyLookingFor);
  renderList("strengths", data.strengths);
  renderList("weaknesses", data.weaknesses);
  renderList("opportunities", data.opportunities);
  renderList("threats", data.threats);

  renderCharts(data);
}

function renderList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  items.forEach(i => {
    const li = document.createElement("li");
    li.innerText = i;
    ul.appendChild(li);
  });
}

function renderCharts(data) {
  if (overallChart) overallChart.destroy();
  if (sectionChart) sectionChart.destroy();

  overallChart = new Chart(
    document.getElementById("overallChart"),
    {
      type: "doughnut",
      data: {
        labels: ["Match", "Gap"],
        datasets: [{
          data: [data.score, 100 - data.score],
          backgroundColor: ["#4caf50", "#333"]
        }]
      }
    }
  );

  sectionChart = new Chart(
    document.getElementById("sectionChart"),
    {
      type: "bar",
      data: {
        labels: Object.keys(data.sectionScores),
        datasets: [{
          data: Object.values(data.sectionScores),
          backgroundColor: "#2196f3"
        }]
      },
      options: {
        scales: { y: { max: 100 } }
      }
    }
  );
}

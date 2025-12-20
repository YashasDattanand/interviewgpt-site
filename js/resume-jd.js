let donutChart = null;
let barChart = null;

async function readFile(file) {
  return new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsText(file);
  });
}

async function analyzeFit() {
  const resume = document.getElementById("resume").files[0];
  const jd = document.getElementById("jd").files[0];

  const resumeText = await readFile(resume);
  const jdText = await readFile(jd);

  const r = await fetch(
    "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jdText })
    }
  );

  const data = await r.json();
  renderResults(data);
}

function renderResults(d) {
  document.getElementById("results").style.display = "block";
  document.getElementById("scoreText").innerText =
    `Overall Match Score: ${d.score}/100`;

  fill("company", d.company_looking_for);
  fill("strengths", d.strengths);
  fill("weaknesses", d.weaknesses);
  fill("opportunities", d.opportunities);
  fill("threats", d.threats);

  if (donutChart) donutChart.destroy();
  if (barChart) barChart.destroy();

  donutChart = new Chart(
    document.getElementById("donut"),
    {
      type: "doughnut",
      data: {
        labels: ["Match", "Gap"],
        datasets: [{
          data: [d.score, 100 - d.score],
          backgroundColor: ["#4caf50", "#333"]
        }]
      }
    }
  );

  barChart = new Chart(
    document.getElementById("bars"),
    {
      type: "bar",
      data: {
        labels: Object.keys(d.section_scores),
        datasets: [{
          data: Object.values(d.section_scores),
          backgroundColor: ["#4caf50","#f44336","#2196f3","#ff9800"]
        }]
      },
      options: { scales: { y: { max: 100 } } }
    }
  );
}

function fill(id, arr) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  arr.forEach(v => {
    const li = document.createElement("li");
    li.textContent = v;
    el.appendChild(li);
  });
}

let donutChart = null;
let barChart = null;

const MAX_CHARS = 2500; // 🔒 prevents 413

function clip(text) {
  return text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;
}

async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

async function analyzeFit() {
  try {
    const resumeFile = document.getElementById("resume").files[0];
    const jdFile = document.getElementById("jd").files[0];

    if (!resumeFile || !jdFile) {
      alert("Please upload both Resume and JD");
      return;
    }

    let resumeText = clip(await readFile(resumeFile));
    let jdText = clip(await readFile(jdFile));

    const res = await fetch(
      "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText })
      }
    );

    // 🔒 HANDLE NON-JSON (413 / HTML)
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("Backend rejected request (too large). Try smaller PDF.");
    }

    const data = await res.json();
    renderResults(data);

  } catch (err) {
    console.error(err);
    alert("Resume analysis failed. Try smaller files.");
  }
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

  // destroy safely
  if (donutChart) { donutChart.destroy(); donutChart = null; }
  if (barChart) { barChart.destroy(); barChart = null; }

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
      options: {
        scales: { y: { max: 100, beginAtZero: true } }
      }
    }
  );
}

function fill(id, arr) {
  const el = document.getElementById(id);
  el.innerHTML = "";
  (arr || []).forEach(v => {
    const li = document.createElement("li");
    li.textContent = v;
    el.appendChild(li);
  });
}

async function analyze() {
  const resume = await document.getElementById("resumeFile").files[0].text();
  const jd = await document.getElementById("jdFile").files[0].text();

  const res = await fetch("https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeText: resume, jdText: jd })
  });

  const data = await res.json();
  document.getElementById("result").classList.remove("hidden");

  document.getElementById("overallScore").innerText = `${data.overallScore}/100`;

  renderList("strengths", data.strengths);
  renderList("weaknesses", data.weaknesses);
  renderList("opportunities", data.opportunities);
  renderList("threats", data.threats);
  renderList("companyExpectations", data.companyExpectations);

  const ctx = document.getElementById("scoreChart");
  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["Role Fit", "Domain", "Seniority", "Impact", "Tools"],
      datasets: [{
        data: Object.values(data.scores),
        backgroundColor: "rgba(0,180,255,0.3)",
        borderColor: "#00b4ff"
      }]
    }
  });

  const phrases = document.getElementById("phrases");
  data.phraseLevelSuggestions.forEach(p => {
    phrases.innerHTML += `
      <p><b>Before:</b> ${p.original}<br/>
      <b>After:</b> ${p.improved}</p><hr/>`;
  });
}

function renderList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  items.forEach(i => ul.innerHTML += `<li>${i}</li>`);
}

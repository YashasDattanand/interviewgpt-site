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

  try {
    const res = await fetch(
      "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze",
      {
        method: "POST",
        body: formData
      }
    );

    if (!res.ok) throw new Error("Backend failed");

    const data = await res.json();
    renderResults(data);
  } catch (err) {
    console.error(err);
    alert("Failed to analyze. Backend error.");
  }
}

function renderResults(data) {
  document.getElementById("results").style.display = "block";
  document.getElementById("score").innerText = `${data.score}/100`;

  fillList("strengths", data.strengths);
  fillList("weaknesses", data.weaknesses);
  fillList("opportunities", data.opportunities);
  fillList("threats", data.threats);
  fillList("company", data.company_looks_for);
  fillList("phrases", data.phrase_suggestions);
}

function fillList(id, items) {
  const ul = document.getElementById(id);
  ul.innerHTML = "";
  items.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ul.appendChild(li);
  });
}

const API_BASE = "https://interview-gpt-backend-00vj.onrender.com";

async function analyzeFit() {
  const resumeFile = document.getElementById("resumeFile").files[0];
  const jdFile = document.getElementById("jdFile").files[0];

  if (!resumeFile || !jdFile) {
    alert("Upload both Resume and JD");
    return;
  }

  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jd", jdFile);

  try {
    const res = await fetch(`${API_BASE}/resume-jd/analyze`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();

    document.getElementById("results").style.display = "block";
    document.getElementById("hintText").style.display = "none";

    document.getElementById("score").innerText = `${data.score} / 100`;

    fillList("companyNeeds", data.company_looking_for);
    fillList("strengths", data.strengths);
    fillList("weaknesses", data.weaknesses);
    fillList("opportunities", data.opportunities);
    fillList("threats", data.threats);

    document.getElementById("phrases").innerHTML =
      data.phrase_level_improvements
        .map(
          p => `
          <p>
            ❌ <b>${p.original}</b><br>
            ✅ ${p.suggested}<br>
            <i>${p.reason}</i>
          </p>
        `
        )
        .join("");
  } catch (err) {
    console.error(err);
    alert("Failed to analyze. Check backend.");
  }
}

function fillList(id, items) {
  document.getElementById(id).innerHTML =
    "<ul>" + items.map(i => `<li>${i}</li>`).join("") + "</ul>";
}

async function analyzeFit() {
  const resumeFile = document.getElementById("resume").files[0];
  const jdFile = document.getElementById("jd").files[0];

  if (!resumeFile || !jdFile) {
    alert("Upload both Resume and JD");
    return;
  }

  try {
    const resumeText = await extractText(resumeFile);
    const jdText = await extractText(jdFile);

    const res = await fetch(
      "https://interview-gpt-backend-00vj.onrender.com/resume-jd/analyze",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jdText })
      }
    );

    if (!res.ok) {
      throw new Error("Backend failed");
    }

    const data = await res.json();
    renderResults(data);
  } catch (err) {
    console.error(err);
    alert("Resume analysis failed. Try smaller PDFs.");
  }
}

function renderResults(data) {
  const results = document.getElementById("results");
  if (!results) return;

  results.style.display = "block";

  document.getElementById("score").innerText = `${data.score}/100`;

  fillList("company", data.company_looking_for);
  fillList("strengths", data.strengths);
  fillList("weaknesses", data.weaknesses);
  fillList("opportunities", data.opportunities);
  fillList("threats", data.threats);
}

function fillList(id, items = []) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerHTML = "";
  items.forEach(i => {
    const li = document.createElement("li");
    li.innerText = i;
    el.appendChild(li);
  });
}

/* VERY SIMPLE TEXT EXTRACTION */
function extractText(file) {
  return new Promise((resolve, reject) => {
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.slice(0, 4000));
      reader.onerror = reject;
      reader.readAsText(file);
    } else {
      // PDFs – do NOT parse fully, just name + size fallback
      resolve(`PDF File: ${file.name}`);
    }
  });
}

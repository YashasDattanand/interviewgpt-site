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
    console.log(data);
    renderResults(data);

  } catch (err) {
    console.error(err);
    alert("Failed to analyze");
  }
}

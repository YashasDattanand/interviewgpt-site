const data = JSON.parse(sessionStorage.getItem("feedback"));

document.getElementById("strengths").innerHTML =
  data.strengths.map(s => `<li>${s}</li>`).join("");

document.getElementById("weaknesses").innerHTML =
  data.weaknesses.map(s => `<li>${s}</li>`).join("");

document.getElementById("improvements").innerHTML =
  data.improvements.map(s => `<li>${s}</li>`).join("");

new Chart(document.getElementById("chart"), {
  type: "radar",
  data: {
    labels: ["Communication", "Clarity", "Confidence"],
    datasets: [{
      data: [
        data.scores.communication,
        data.scores.clarity,
        data.scores.confidence
      ],
      backgroundColor: "rgba(0,200,255,0.3)"
    }]
  }
});

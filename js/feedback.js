const data = JSON.parse(localStorage.getItem("feedback"));

document.getElementById("overall").innerText =
  `Overall Score: ${data.overall}/10`;

const ctx = document.getElementById("scoreChart");

new Chart(ctx, {
  type: "radar",
  data: {
    labels: ["Communication", "Clarity", "Confidence", "Structure"],
    datasets: [{
      label: "Interview Performance",
      data: Object.values(data.scores),
      backgroundColor: "rgba(0, 200, 255, 0.2)",
      borderColor: "#00c8ff"
    }]
  }
});

["strengths", "weaknesses", "improvements"].forEach(key => {
  const ul = document.getElementById(key);
  data[key].forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    ul.appendChild(li);
  });
});

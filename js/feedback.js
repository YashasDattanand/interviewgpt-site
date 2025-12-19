const feedback = JSON.parse(localStorage.getItem("feedback"));

const status = document.getElementById("status");
const scoresDiv = document.getElementById("scores");

if (!feedback) {
  status.innerText = "No feedback available.";
} else {
  status.remove();

  scoresDiv.innerHTML = `
    <h3>Scores</h3>
    <p>Communication: ${feedback.scores.communication}/10</p>
    <p>Clarity: ${feedback.scores.clarity}/10</p>
    <p>Confidence: ${feedback.scores.confidence}/10</p>
  `;

  feedback.strengths.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    document.getElementById("strengths").appendChild(li);
  });

  feedback.weaknesses.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    document.getElementById("weaknesses").appendChild(li);
  });

  feedback.improvements.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    document.getElementById("improvements").appendChild(li);
  });
}

const chat = document.getElementById("chat");
const input = document.getElementById("input");

const setup = JSON.parse(localStorage.getItem("setup"));
let conversation = [];

let recognition;

function startMic() {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.onresult = e => {
    input.value += " " + e.results[e.results.length - 1][0].transcript;
  };
  recognition.start();
}

function stopMic() {
  if (recognition) recognition.stop();
}

function addMessage(role, text) {
  chat.innerHTML += `<p><b>${role}:</b> ${text}</p>`;
}

async function sendAnswer() {
  const answer = input.value.trim();
  if (!answer) return;

  addMessage("You", answer);
  conversation.push({ role: "user", content: answer });
  input.value = "";

  const res = await fetch("https://interview-gpt-backend-00vj.onrender.com/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: setup.role,
      experience: setup.experience,
      company: setup.company,
      conversation
    })
  });

  const data = await res.json();

  addMessage("Coach", data.question);
  conversation.push({ role: "assistant", content: data.question });
}

function endInterview() {
  localStorage.setItem("conversation", JSON.stringify(conversation));
  window.location.href = "feedback.html";
}

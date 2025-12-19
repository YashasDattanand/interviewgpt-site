const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

let conversation = JSON.parse(localStorage.getItem("conversation")) || [];

function addMessage(role, text) {
  const div = document.createElement("div");
  div.innerHTML = `<b>${role}:</b> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

conversation.forEach(m => addMessage(m.role === "assistant" ? "Coach" : "You", m.content));

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("You", text);
  conversation.push({ role: "user", content: text });
  input.value = "";

  const res = await fetch("https://interview-gpt-backend-00vj.onrender.com/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: localStorage.getItem("role"),
      experience: localStorage.getItem("experience"),
      company: localStorage.getItem("company"),
      conversation
    })
  });

  const data = await res.json();

  // 🔥 FIX: use data.question
  addMessage("Coach", data.question);
  conversation.push({ role: "assistant", content: data.question });

  localStorage.setItem("conversation", JSON.stringify(conversation));
}

function endInterview() {
  localStorage.setItem("conversation", JSON.stringify(conversation));
  window.location.href = "feedback.html";
}

/* 🎤 Speech */
let recognition;
function startMic() {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.onresult = e => {
    input.value += " " + e.results[e.results.length - 1][0].transcript;
  };
  recognition.start();
}

function stopMic() {
  if (recognition) recognition.stop();
}

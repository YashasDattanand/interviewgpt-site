const params = new URLSearchParams(window.location.search);
const role = params.get("role");
const experience = params.get("experience");
const company = params.get("company");

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("input");

let conversation = [];

function append(sender, text) {
  const div = document.createElement("div");
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function speak(text) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.95;
  speechSynthesis.speak(u);
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  append("You", text);
  conversation.push({ role: "user", content: text });
  input.value = "";

  const res = await fetch("https://interview-gpt-backend-00vj.onrender.com/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, experience, company, conversation })
  });

  const data = await res.json();
  append("Coach", data.reply);
  speak(data.reply);

  conversation.push({ role: "assistant", content: data.reply });
}

document.getElementById("sendBtn").onclick = send;
document.getElementById("endBtn").onclick = () => {
  localStorage.setItem("conversation", JSON.stringify(conversation));
  window.location.href = "feedback.html";
};

// 🎤 SPEECH RECOGNITION (REUSABLE FIX)
let recognition;
function initMic() {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = e => {
    input.value += e.results[0][0].transcript;
  };
}

initMic();

document.getElementById("startMic").onclick = () => {
  recognition.stop();
  recognition.start();
};

document.getElementById("stopMic").onclick = () => recognition.stop();

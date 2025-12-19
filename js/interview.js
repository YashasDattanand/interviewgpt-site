const BACKEND_URL = "https://interview-gpt-backend-00vj.onrender.com";

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");
const startBtn = document.getElementById("startMic");
const stopBtn = document.getElementById("stopMic");
const sendBtn = document.getElementById("sendBtn");
const endBtn = document.getElementById("endBtn");

let recognition;
let listening = false;

let conversation = [];

// ================= SPEECH SETUP =================
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let transcript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    input.value += transcript.trim() + " ";
  };

  recognition.onend = () => {
    listening = false;
  };
}

// ================= UI HELPERS =================
function addMessage(role, text) {
  const p = document.createElement("p");
  p.className = role;
  p.innerText = `${role === "user" ? "You" : "Coach"}: ${text}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

// ================= MIC CONTROLS =================
startBtn.onclick = () => {
  if (!recognition || listening) return;
  recognition.start();
  listening = true;
};

stopBtn.onclick = () => {
  if (!recognition || !listening) return;
  recognition.stop();
  listening = false;
};

// ================= SEND MESSAGE =================
sendBtn.onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  conversation.push({ role: "user", content: text });
  input.value = "";

  const res = await fetch(`${BACKEND_URL}/interview`, {
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
  if (!data.question) return;

  addMessage("assistant", data.question);
  speak(data.question);

  conversation.push({
    role: "assistant",
    content: data.question
  });
};

// ================= END INTERVIEW =================
endBtn.onclick = async () => {
  const res = await fetch(`${BACKEND_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation })
  });

  const feedback = await res.json();

  // 🔴 CRITICAL — THIS ENABLES FEEDBACK PAGE
  localStorage.setItem("feedback", JSON.stringify(feedback));
  localStorage.setItem(
    "transcript",
    conversation.map(m => `${m.role}: ${m.content}`).join("\n")
  );

  window.location.href = "feedback.html";
};

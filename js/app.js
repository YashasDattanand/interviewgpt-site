const params = new URLSearchParams(window.location.search);
const role = params.get("role");
const experience = params.get("experience");
const company = params.get("company");

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("input");

let conversation = [];
let recognition;
let micActive = false;

/* ---------- UI HELPERS ---------- */

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

/* ---------- AI INTERACTION ---------- */

async function send() {
  const text = input.value.trim();
  if (!text) return;

  append("You", text);
  conversation.push({ role: "user", content: text });
  input.value = "";

  const res = await fetch(
    "https://interview-gpt-backend-00vj.onrender.com/interview",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, experience, company, conversation })
    }
  );

  const data = await res.json();
  append("Coach", data.reply);
  speak(data.reply);

  conversation.push({ role: "assistant", content: data.reply });
}

document.getElementById("sendBtn").onclick = send;

document.getElementById("endBtn").onclick = () => {
  stopMic();
  localStorage.setItem("conversation", JSON.stringify(conversation));
  window.location.href = "feedback.html";
};

/* ---------- 🎤 SPEECH RECOGNITION (AUTO-RESTART) ---------- */

function initMic() {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false; // must stay false
  recognition.interimResults = false;

  recognition.onresult = e => {
    input.value +=
      (input.value ? " " : "") + e.results[0][0].transcript;
  };

  recognition.onend = () => {
    if (micActive) {
      recognition.start(); // 🔥 auto-restart
    }
  };

  recognition.onerror = e => {
    console.warn("Mic error:", e);
    if (micActive) recognition.start();
  };
}

function startMic() {
  if (!recognition) initMic();
  micActive = true;
  recognition.start();
}

function stopMic() {
  micActive = false;
  recognition.stop();
}

document.getElementById("startMic").onclick = startMic;
document.getElementById("stopMic").onclick = stopMic;

initMic();

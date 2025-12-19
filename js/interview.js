const API_BASE = "https://interview-gpt-backend-00vj.onrender.com";

let conversation = [];
let questionCount = 0;

// DOM
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

// ---------- UI helpers ----------
function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = role;
  div.innerText = `${role === "assistant" ? "Coach" : "You"}: ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------- SEND MESSAGE ----------
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  conversation.push({ role: "user", content: text });
  input.value = "";

  const body = {
    role: localStorage.getItem("role"),
    experience: localStorage.getItem("experience"),
    company: localStorage.getItem("company"),
    conversation
  };

  const res = await fetch(`${API_BASE}/interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!data.question) {
    addMessage("assistant", "Something went wrong. Try again.");
    return;
  }

  addMessage("assistant", data.question);
  conversation.push({ role: "assistant", content: data.question });
  questionCount++;
}

// ---------- END INTERVIEW ----------
async function endInterview() {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation })
  });

  const feedback = await res.json();

  // 🔑 STORE EVERYTHING
  localStorage.setItem("feedback", JSON.stringify(feedback));
  localStorage.setItem("transcript", JSON.stringify(conversation));

  window.location.href = "feedback.html";
}

// ---------- EVENTS ----------
document.getElementById("sendBtn").onclick = sendMessage;
document.getElementById("endBtn").onclick = endInterview;

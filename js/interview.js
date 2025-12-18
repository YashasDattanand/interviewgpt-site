const chat = document.getElementById("chat");
const input = document.getElementById("input");

let conversation = JSON.parse(localStorage.getItem("conversation")) || [];
let recognition;
let listening = false;

// 🎤 Speech Recognition
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (e) => {
    input.value += e.results[e.results.length - 1][0].transcript + " ";
  };
}

// UI helpers
function add(role, text) {
  const div = document.createElement("div");
  div.className = role;
  div.innerText = `${role === "user" ? "You" : "Coach"}: ${text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// 🔥 Ask first question automatically
async function firstQuestion() {
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
  add("assistant", data.question);
  conversation.push({ role: "assistant", content: data.question });
  localStorage.setItem("conversation", JSON.stringify(conversation));
}

firstQuestion();

// 🎤 Buttons
startMic.onclick = () => {
  if (!listening && recognition) {
    recognition.start();
    listening = true;
  }
};

stopMic.onclick = () => {
  if (recognition && listening) {
    recognition.stop();
    listening = false;
  }
};

// 📨 Send message
send.onclick = async () => {
  if (!input.value.trim()) return;

  const msg = input.value;
  input.value = "";

  add("user", msg);
  conversation.push({ role: "user", content: msg });

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
  add("assistant", data.question);
  conversation.push({ role: "assistant", content: data.question });

  localStorage.setItem("conversation", JSON.stringify(conversation));
};

// 🛑 End interview
end.onclick = () => {
  localStorage.setItem("conversation", JSON.stringify(conversation));
  window.location.href = "feedback.html";
};

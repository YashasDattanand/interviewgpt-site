let recognition;
let conversation = [];

const setup = JSON.parse(localStorage.getItem("setup"));

async function askCoach(userText = "") {
  const res = await fetch(`${BACKEND_URL}/interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...setup,
      conversation,
      userText
    })
  });

  const data = await res.json();
  if (data.question) {
    conversation.push({ role: "assistant", content: data.question });
    renderChat();
  }
}

function renderChat() {
  const chat = document.getElementById("chat");
  chat.innerHTML = "";
  conversation.forEach(m => {
    const div = document.createElement("div");
    div.className = m.role;
    div.innerText = `${m.role === "assistant" ? "Coach" : "You"}: ${m.content}`;
    chat.appendChild(div);
  });
}

function submitAnswer() {
  const text = document.getElementById("answer").value.trim();
  if (!text) return;

  conversation.push({ role: "user", content: text });
  document.getElementById("answer").value = "";
  renderChat();
  askCoach(text);
}

function endInterview() {
  localStorage.setItem("conversation", JSON.stringify(conversation));
  window.location.href = "feedback.html";
}

/* 🎤 MIC */
function startMic() {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.onresult = e => {
    document.getElementById("answer").value += e.results[e.results.length - 1][0].transcript;
  };
  recognition.start();
}

function stopMic() {
  if (recognition) recognition.stop();
}

/* Start interview */
askCoach();

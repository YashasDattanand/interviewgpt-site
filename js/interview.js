const BACKEND = "https://interview-gpt-backend-00vj.onrender.com";

let conversation = JSON.parse(localStorage.getItem("conversation")) || [];

const chat = document.getElementById("chat");

function render(role, text) {
  const div = document.createElement("div");
  div.className = role;
  div.innerText = text;
  chat.appendChild(div);
}

async function sendText() {
  const text = input.value.trim();
  if (!text) return;

  render("user", text);
  input.value = "";

  conversation.push({ role: "user", content: text });

  const res = await fetch(`${BACKEND}/interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: localStorage.getItem("role"),
      experience: localStorage.getItem("experience"),
      company: localStorage.getItem("company"),
      conversation,
      userText: text
    })
  });

  const data = await res.json();

  render("assistant", data.question);
  conversation.push({ role: "assistant", content: data.question });

  localStorage.setItem("conversation", JSON.stringify(conversation));
}

function startMic() {
  const rec = new webkitSpeechRecognition();
  rec.continuous = false;
  rec.lang = "en-US";

  rec.onresult = e => {
    input.value = e.results[0][0].transcript;
  };

  rec.start();
}

function endInterview() {
  window.location.href = "feedback.html";
}

const BACKEND = "https://interview-gpt-backend-00vj.onrender.com";
const chat = document.getElementById("chat");
const input = document.getElementById("input");

let conversation = JSON.parse(localStorage.getItem("conversation"));
let setup = JSON.parse(localStorage.getItem("setup"));
let rec;

function render(who, text) {
  chat.innerHTML += `<div class="${who}">${text}</div>`;
  chat.scrollTop = chat.scrollHeight;
}

async function ask() {
  const res = await fetch(`${BACKEND}/interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...setup, conversation })
  });
  const data = await res.json();
  render("coach", data.question);
  conversation.push({ role: "assistant", content: data.question });
}

function send() {
  const text = input.value.trim();
  if (!text) return;
  render("user", text);
  conversation.push({ role: "user", content: text });
  input.value = "";
  localStorage.setItem("conversation", JSON.stringify(conversation));
  ask();
}

function startMic() {
  rec = new webkitSpeechRecognition();
  rec.continuous = true;
  rec.onresult = e => {
    input.value += " " + e.results[e.results.length - 1][0].transcript;
  };
  rec.start();
}

function stopMic() {
  if (rec) rec.stop();
}

function end() {
  localStorage.setItem("conversation", JSON.stringify(conversation));
  location.href = "feedback.html";
}

ask(); // initial question

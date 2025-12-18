const BACKEND = "https://interview-gpt-backend-00vj.onrender.com";

let conversation = JSON.parse(sessionStorage.getItem("conversation")) || [];
const role = sessionStorage.getItem("role");
const experience = sessionStorage.getItem("experience");
const company = sessionStorage.getItem("company");

function renderChat() {
  const box = document.getElementById("chat");
  box.innerHTML = "";
  conversation.forEach(m => {
    const div = document.createElement("div");
    div.className = m.role;
    div.innerText = `${m.role === "user" ? "You" : "Coach"}: ${m.content}`;
    box.appendChild(div);
  });
}

async function sendMessage() {
  const input = document.getElementById("input");
  if (!input.value.trim()) return;

  conversation.push({ role: "user", content: input.value });
  input.value = "";
  renderChat();

  const res = await fetch(`${BACKEND}/interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, experience, company, conversation }),
  });

  const data = await res.json();
  conversation.push({ role: "assistant", content: data.question });
  sessionStorage.setItem("conversation", JSON.stringify(conversation));
  renderChat();
}

async function endInterview() {
  const res = await fetch(`${BACKEND}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation }),
  });

  const data = await res.json();
  sessionStorage.setItem("feedback", JSON.stringify(data));
  window.location.href = "feedback.html";
}

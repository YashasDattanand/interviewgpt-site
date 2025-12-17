const API = "https://interview-gpt-backend-00vj.onrender.com";

let conversation = [];
let setup = JSON.parse(localStorage.getItem("setup"));

async function startInterview() {
  const res = await fetch(`${API}/interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: setup.role,
      experience: setup.experience,
      company: setup.company,
      conversation,
      userText: ""
    })
  });

  const data = await res.json();
  addCoachMessage(data.question);
  conversation.push({ role: "assistant", content: data.question });
}

async function submitAnswer() {
  const input = document.getElementById("answer");
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  conversation.push({ role: "user", content: text });
  input.value = "";

  const res = await fetch(`${API}/interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: setup.role,
      experience: setup.experience,
      company: setup.company,
      conversation,
      userText: text
    })
  });

  const data = await res.json();
  addCoachMessage(data.question);
  conversation.push({ role: "assistant", content: data.question });
}

async function endInterview() {
  localStorage.setItem("conversation", JSON.stringify(conversation));
  window.location.href = "feedback.html";
}

/* UI helpers */
function addCoachMessage(text) {
  document.getElementById("chat").innerHTML += `<p><b>Coach:</b> ${text}</p>`;
}

function addUserMessage(text) {
  document.getElementById("chat").innerHTML += `<p><b>You:</b> ${text}</p>`;
}

/* AUTO START */
startInterview();

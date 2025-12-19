const chat = document.getElementById("chat");
const setup = JSON.parse(localStorage.getItem("setup"));
let conversation = [];

async function send() {
  const text = document.getElementById("input").value;
  if (!text) return;

  conversation.push({ role: "user", content: text });
  chat.innerHTML += `<p><b>You:</b> ${text}</p>`;
  document.getElementById("input").value = "";

  const res = await fetch("https://interview-gpt-backend-00vj.onrender.com/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...setup,
      conversation
    })
  });

  const data = await res.json();
  conversation.push({ role: "assistant", content: data.question });
  chat.innerHTML += `<p><b>Coach:</b> ${data.question}</p>`;
}

function end() {
  localStorage.setItem("conversation", JSON.stringify(conversation));
  window.location.href = "feedback.html";
}

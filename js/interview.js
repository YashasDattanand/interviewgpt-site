let conversation = [];

function addMessage(role, text) {
  const box = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = role;
  div.innerHTML = `<b>${role === "assistant" ? "Coach" : "You"}:</b> ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  addMessage("user", text);

  conversation.push({ role: "user", content: text });

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

  addMessage("assistant", data.question);
  conversation.push({ role: "assistant", content: data.question });
}

async function endInterview() {
  if (conversation.length === 0) {
    alert("No interview data found");
    return;
  }

  const res = await fetch("https://interview-gpt-backend-00vj.onrender.com/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation })
  });

  const feedback = await res.json();

  // 🔒 GUARANTEED STORAGE
  localStorage.setItem("feedback", JSON.stringify(feedback));
  localStorage.setItem("transcript", JSON.stringify(conversation));

  // 🔁 REDIRECT ONLY AFTER SAVE
  window.location.href = "feedback.html";
}

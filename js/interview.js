const chatBox = document.getElementById("chat");
const input = document.getElementById("answer");

let conversation = [];

async function submitAnswer() {
  const text = input.value.trim();
  if (!text) return;

  appendMessage("You", text);
  conversation.push({ role: "user", content: text });
  input.value = "";

  const setup = JSON.parse(localStorage.getItem("setup"));

  const res = await fetch(
    "https://interview-gpt-backend-00vj.onrender.com/interview",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: setup.role,
        experience: setup.experience,
        company: setup.company,
        conversation
      })
    }
  );

  const data = await res.json();
  appendMessage("Coach", data.question);
  conversation.push({ role: "assistant", content: data.question });
}

function appendMessage(sender, text) {
  const p = document.createElement("p");
  p.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("input");

const role = sessionStorage.getItem("role");
const experience = sessionStorage.getItem("experience");
const company = sessionStorage.getItem("company");

if (!role || !experience) {
  alert("Setup missing. Redirecting.");
  window.location.href = "index.html";
}

let conversation = [];

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.innerHTML = `<b>${sender}:</b> ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function askBackend() {
  const res = await fetch("https://interview-gpt-backend-00vj.onrender.com/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role,
      experience,
      company,
      conversation
    })
  });

  const data = await res.json();
  conversation.push({ role: "assistant", content: data.question });
  addMessage("Coach", data.question);
}

document.getElementById("sendBtn").onclick = async () => {
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  conversation.push({ role: "user", content: text });
  addMessage("You", text);

  await askBackend();
};

document.getElementById("endBtn").onclick = async () => {
  const res = await fetch("https://interview-gpt-backend-00vj.onrender.com/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation })
  });

  sessionStorage.setItem("feedback", JSON.stringify(await res.json()));
  window.location.href = "feedback.html";
};

// First question
askBackend();

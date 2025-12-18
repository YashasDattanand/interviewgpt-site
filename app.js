const BACKEND = "https://interview-gpt-backend-00vj.onrender.com";

let state = {
  role: "",
  experience: "",
  company: "",
  conversation: []
};

let recognition;
let listening = false;

function startInterview() {
  state.role = document.getElementById("role").value;
  state.experience = document.getElementById("experience").value;
  state.company = document.getElementById("company").value;

  if (!state.role || !state.experience) {
    alert("Select role and experience");
    return;
  }

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("chat").classList.remove("hidden");

  askCoach();
}

async function askCoach() {
  const res = await fetch(`${BACKEND}/interview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state)
  });

  const data = await res.json();
  addMessage("Coach", data.question);
  state.conversation.push({ role: "assistant", content: data.question });
}

function submitAnswer() {
  const text = document.getElementById("input").value.trim();
  if (!text) return;

  addMessage("You", text);
  state.conversation.push({ role: "user", content: text });
  document.getElementById("input").value = "";

  askCoach();
}

function addMessage(who, text) {
  const box = document.getElementById("chatBox");
  const p = document.createElement("p");
  p.innerHTML = `<strong>${who}:</strong> ${text}`;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
}

function startMic() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Speech not supported");
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onresult = e => {
    document.getElementById("input").value +=
      e.results[e.results.length - 1][0].transcript;
  };

  recognition.start();
  listening = true;
}

function stopMic() {
  if (recognition && listening) {
    recognition.stop();
    listening = false;
  }
}

async function endInterview() {
  document.getElementById("chat").classList.add("hidden");
  document.getElementById("feedback").classList.remove("hidden");

  const res = await fetch(`${BACKEND}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversation: state.conversation })
  });

  const data = await res.json();
  document.getElementById("feedbackContent").textContent =
    JSON.stringify(data, null, 2);
}

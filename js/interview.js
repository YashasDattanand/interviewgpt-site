const BACKEND =
  "https://interview-gpt-backend-00vj.onrender.com/interview";

const chat = document.getElementById("chat");
const input = document.getElementById("input");

let conversation = [];
let recognition;
let listening = false;

/* ---------------------------
   TEXT TO SPEECH (COACH)
---------------------------- */
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

/* ---------------------------
   SPEECH TO TEXT (USER)
---------------------------- */
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (e) => {
    input.value = e.results[0][0].transcript;
  };
}

function startMic() {
  if (recognition && !listening) {
    recognition.start();
    listening = true;
  }
}

function stopMic() {
  if (recognition && listening) {
    recognition.stop();
    listening = false;
  }
}

/* ---------------------------
   SEND USER RESPONSE
---------------------------- */
async function send() {
  const text = input.value.trim();
  if (!text) return;

  chat.innerHTML += `<p><b>You:</b> ${text}</p>`;
  conversation.push({ role: "user", content: text });
  input.value = "";

  const setup = JSON.parse(localStorage.getItem("setup"));

  const res = await fetch(BACKEND, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: setup.role,
      experience: setup.experience,
      company: setup.company,
      conversation
    })
  });

  const data = await res.json();

  chat.innerHTML += `<p><b>Coach:</b> ${data.question}</p>`;
  speak(data.question);

  conversation.push({
    role: "assistant",
    content: data.question
  });

  chat.scrollTop = chat.scrollHeight;
}

/* ---------------------------
   END INTERVIEW
---------------------------- */
function endInterview() {
  localStorage.setItem(
    "conversation",
    JSON.stringify(conversation)
  );
  window.location.href = "feedback.html";
}

/* ---------------------------
   START FIRST QUESTION
---------------------------- */
(async function init() {
  const setup = JSON.parse(localStorage.getItem("setup"));

  const res = await fetch(BACKEND, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: setup.role,
      experience: setup.experience,
      company: setup.company,
      conversation: []
    })
  });

  const data = await res.json();

  chat.innerHTML += `<p><b>Coach:</b> ${data.question}</p>`;
  speak(data.question);

  conversation.push({
    role: "assistant",
    content: data.question
  });
})();

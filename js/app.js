/***********************
 * INTERVIEW – COACH MODE
 * SAFE + STABLE VERSION
 ***********************/

/* ========= CONFIG ========= */

const BACKEND_URL = "https://interview-gpt-backend-00vj.onrender.com";

/* ========= URL PARAMS ========= */

const params = new URLSearchParams(window.location.search);
const role = params.get("role") || "General";
const experience = params.get("experience") || "0-2";
const company = params.get("company") || "General";

/* ========= DOM ========= */

const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");

/* ========= UI HELPERS ========= */

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.style.marginBottom = "12px";
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* ========= CORE FUNCTION ========= */

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("You", message);
  userInput.value = "";

  try {
    const response = await fetch(`${BACKEND_URL}/interview/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message,
        role,
        experience,
        company
      })
    });

    /* ---- HARD SAFETY CHECK ---- */
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Backend did not return JSON");
    }

    const data = await response.json();

    if (!data.reply) {
      throw new Error("Invalid backend response");
    }

    appendMessage("Coach", data.reply);

  } catch (error) {
    console.error("Interview Error:", error);
    appendMessage(
      "System",
      "Interview service is temporarily unavailable. Please retry."
    );
  }
}

/* ========= BUTTON BINDINGS ========= */

document.getElementById("sendBtn")?.addEventListener("click", sendMessage);

userInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

/* ========= SESSION START MESSAGE ========= */

appendMessage(
  "Coach",
  `Welcome! I’ll act as your interview coach for a ${role} role (${experience} yrs) at ${company}. Let’s begin.`
);

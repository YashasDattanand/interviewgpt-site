async function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  conversation.push({ role: "user", content: text });

  const res = await fetch(BACKEND_URL + "/interview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role,
      experience,
      company,
      conversation,
    }),
  });

  const data = await res.json();

  if (data.question) {
    addMessage("coach", data.question);
    conversation.push({ role: "assistant", content: data.question });
  } else {
    addMessage("coach", "Something went wrong. Please try again.");
  }
}

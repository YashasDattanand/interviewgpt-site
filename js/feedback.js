const convo = JSON.parse(localStorage.getItem("conversation"));

fetch("https://interview-gpt-backend-00vj.onrender.com/feedback", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ conversation: convo })
})
.then(res => res.json())
.then(data => {
  document.getElementById("out").innerText =
    JSON.stringify(data, null, 2);
});

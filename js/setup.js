function start() {
  const role = document.getElementById("role").value;
  const experience = document.getElementById("experience").value;
  const company = document.getElementById("company").value;

  localStorage.setItem("setup", JSON.stringify({ role, experience, company }));
  window.location.href = "interview.html";
}

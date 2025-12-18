function startInterview() {
  const role = document.getElementById("role").value;
  const experience = document.getElementById("experience").value;
  const company = document.getElementById("company").value;

  if (!role || !experience) {
    alert("Select role and experience");
    return;
  }

  localStorage.setItem("setup", JSON.stringify({ role, experience, company }));
  window.location.href = "interview.html";
}

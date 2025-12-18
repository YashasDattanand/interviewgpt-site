function startInterview() {
  localStorage.setItem("role", role.value);
  localStorage.setItem("experience", experience.value);
  localStorage.setItem("company", company.value);
  localStorage.setItem("conversation", JSON.stringify([]));

  window.location.href = "interview.html";
}

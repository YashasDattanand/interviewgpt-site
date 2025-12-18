function start() {
  const role = role.value;
  const experience = experience.value;
  const company = company.value;

  if (!role || !experience) {
    alert("Select role and experience");
    return;
  }

  localStorage.setItem("setup", JSON.stringify({ role, experience, company }));
  localStorage.setItem("conversation", JSON.stringify([]));
  location.href = "interview.html";
}

document.getElementById("startBtn").onclick = () => {
  sessionStorage.setItem("role", role.value);
  sessionStorage.setItem("experience", experience.value);
  sessionStorage.setItem("company", company.value);
  window.location.href = "interview.html";
};

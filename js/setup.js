document.getElementById("startBtn").addEventListener("click", () => {
  const roleEl = document.getElementById("role");
  const expEl = document.getElementById("experience");
  const companyEl = document.getElementById("company");

  const role = roleEl.value;
  const experience = expEl.value;
  const company = companyEl.value;

  if (!role || !experience) {
    alert("Please select role and experience");
    return;
  }

  const setupData = {
    role,
    experience,
    company
  };

  localStorage.setItem("setup", JSON.stringify(setupData));
  localStorage.setItem("conversation", JSON.stringify([]));

  console.log("Setup saved:", setupData);

  // ✅ THIS IS THE IMPORTANT LINE
  window.location.href = "interview.html";
});

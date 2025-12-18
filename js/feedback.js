const data = JSON.parse(sessionStorage.getItem("feedback"));
document.getElementById("result").textContent = JSON.stringify(data, null, 2);

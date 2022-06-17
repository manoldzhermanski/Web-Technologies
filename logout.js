const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("access_token");
  location.href = "/";
});

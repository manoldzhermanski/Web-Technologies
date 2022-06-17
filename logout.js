const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  console.log('zdr')
  localStorage.removeItem("access_token");
  location.href = "/";
});

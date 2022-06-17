const onSubmit = async (e) => {
  e.preventDefault();

  const username = e.target.username.value.trim();
  const password = e.target.password.value.trim();

  try {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const response = await fetch("http://localhost:3002/login", {
      method: "POST",
      headers,
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const res = await response.json();
    if (response.status >= 400) {
      toggleModal(true, res.error);
    } else {
      localStorage.setItem("access_token", res.token);
      location.href = "draw.html";
    }
  } catch (e) {
    toggleModal(true, e);
  }
};

const toggleModal = (open, msg) => {
  let dialogBackground = document.getElementById("dialog-background");
  let dialog = document.getElementById("dialog");
  let title = document.getElementById("modal-title");
  let message = document.getElementById("modal-msg");
  let closeBtn = document.getElementById("close-list-btn");
  let footer = document.getElementsByClassName("modal-footer")[0];

  document.body.classList.toggle("overflow-hidden", open);
  dialogBackground.toggleAttribute("hidden", !open);
  dialog.toggleAttribute("hidden", !open);
  title.innerText = "WARNING";
  message.innerText = `${msg}`;
  closeBtn.innerText = "Close";
  dialog.style.marginLeft = "585px";
  dialog.style.marginTop = "185px";
  footer.style.marginTop = "33px";
};

const closeBtn = document.getElementById("close-list-btn");

closeBtn.addEventListener("click", (event) => {
  toggleModal(false);
});

const createBtn = document.getElementById("loginForm");
createBtn.addEventListener("submit", onSubmit);

const onSubmit = () => {

    const username = document.getElementById("username");
    const password = document.getElementById("password");
    
    let currUser = username.value.trim();
    let currPassword = password.value.trim();

    for (const [key, value] of Object.entries(localStorage)) {
        if(key === "user"){
            let text = localStorage.getItem("user");
            let user = JSON.parse(text);
            console.log(user.username)
            console.log(user.password);

            if(currUser === user.username) {
                if (currPassword === user.password){
                    location.href='personal-blog.html';
                } else {
                    toggleModal(true, "Invalid password.");
                }
            } else {
                toggleModal(true, "No such user.");
            }
        }
    }
}

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

const createBtn = document.getElementById("submitBtn");
createBtn.addEventListener("click", onSubmit);
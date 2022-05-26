const onSubmit = () => {

    const username = document.getElementById("username");
    const password = document.getElementById("password");
    
    let userInput = username.value.trim();
    let passwordInput = password.value.trim();

    for (const [key, value] of Object.entries(localStorage)) {
        if(key.includes("user")){
            let user = JSON.parse(localStorage.getItem(key));
            if(user.username === userInput) {
                if (passwordInput === user.password){
                    location.href='index.html';
                } else {
                    toggleModal(true, "Invalid password.");
                }
            } else {
                toggleModal(true, "No such user.");
            }
        }
    }
}

function saveUsersFromMongoDbToLocalStorage() {
    fetch('http://localhost:3002/users')
        .then((response) => response.json())
        .then((users) => {users
            if (users && users.length !== 0) {
                users.map(user => {
                if (!isLocalStorageAlreadyContainingUser(user.username)){
                    let rand = Math.random() * 1000;
                    let uniqueKey = "user" + Math.floor(rand);
                    localStorage.setItem(uniqueKey, JSON.stringify(user));  
                }
                })
            }
        })
}

const isLocalStorageAlreadyContainingUser = (username) => {
    for (const key of Object.keys(localStorage)) {
        if(key.includes("user")){
            let user = JSON.parse(localStorage.getItem(key));
            if(user.username === username){
                return true;
            }
        }
    }
    return false;
}

saveUsersFromMongoDbToLocalStorage();

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
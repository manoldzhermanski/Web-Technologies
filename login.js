<<<<<<< HEAD
const onSubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    
    let userInput = username.value.trim();
    let passwordInput = password.value.trim();

    for (const [key, value] of Object.entries(sessionStorage)) {
        if(key.includes("user")){
            let user = JSON.parse(sessionStorage.getItem(key));
            if(user.username == userInput) {
                console.log(user.username);
                console.log(userInput);
                if (passwordInput === user.password){
                    localStorage.setItem('username', user.username)
                    location.href='draw.html';
=======
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
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
                } else {
                    toggleModal(true, "Invalid password.");
                }
            } else {
                toggleModal(true, "No such user.");
            }
        }
    }
}

<<<<<<< HEAD
function saveUsersFromMongoDbToLocalStorage() {
    fetch('http://localhost:3002/users')
        .then((response) => response.json())
        .then((users) => {users
            if (users && users.length !== 0) {
                users.map(user => {
                if (!isSessionStorageAlreadyContainingUser(user.username)){
                    let rand = Math.random() * 1000;
                    let uniqueKey = "user" + Math.floor(rand);
                    sessionStorage.setItem(uniqueKey, JSON.stringify(user));  
                }
                })
            }
        })
}

const isSessionStorageAlreadyContainingUser = (username) => {
    for (const key of Object.keys(sessionStorage)) {
        if(key.includes("user")){
            let user = JSON.parse(sessionStorage.getItem(key));
            if(user.username === username){
                return true;
            }
        }
    }
    return false;
}

saveUsersFromMongoDbToLocalStorage();
console.log(localStorage);
=======
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
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

<<<<<<< HEAD
const createBtn = document.getElementById("loginForm");
createBtn.addEventListener("submit", onSubmit);
=======
const createBtn = document.getElementById("submitBtn");
createBtn.addEventListener("click", onSubmit);
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430

const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

<<<<<<< HEAD
const onRegister = (event) => {
    event.preventDefault();
    let usernameInput = username.value.trim();
    let emailInput = email.value.trim();
    let passwordInput = password.value.trim();
    let confirmPasswordInput = confirmPassword.value.trim();

    if (isValidUserName(usernameInput) && isValidEmail(emailInput)
        && (isMediumPassword(passwordInput) || isStrongPassword(passwordInput)) && arePasswordFieldsEqual(passwordInput, confirmPasswordInput)) {
        const user = { username: usernameInput, email: emailInput, password: passwordInput, pictures: [] };
        sendUserData(user);
        location.href='login.html';
=======
const onRegister = async (event) => {
    event.preventDefault();
    let currUsername = username.value.trim();
    let currEmail = email.value.trim();
    let currPassword = password.value.trim();
    let currConfirmPassword = confirmPassword.value.trim();

    if (isValidUserName(currUsername) && isValidEmail(currEmail)
        && (isMediumPassword(currPassword) || isStrongPassword(currPassword)) && arePasswordFieldsEqual(currPassword, currConfirmPassword)){
        const user = {username: currUsername, email: currEmail, password: currPassword, pictures: []};
       // getUsersData();
        sendUserData(user);
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
    } else {
        toggleModal(true, "Invalid user data.")
    }
}

<<<<<<< HEAD
function saveUsersFromMongoDbToSessionStorage() {
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

saveUsersFromMongoDbToSessionStorage();
console.log(sessionStorage);

const sendUserData = (userData) => {
    const url = 'http://localhost:3002/register';
    sendPostRequest(url, userData);
};

const sendPostRequest = (url, userData) => {
    console.log(JSON.stringify(userData));
    const res = fetch(url, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
        .then(response => response.json())
        .then(function () {
            console.log("User created");
        });
};

const onEnterPassword = () => {
    let currPassword = password.value.trim();
    if (isStrongPassword(currPassword)) {
        password.style.backgroundColor = "#ccffe0";
    }
    else if (!isStrongPassword(currPassword) && isMediumPassword(currPassword)) {
        password.style.backgroundColor = "#fcffcc";
=======
const sendUserData = userData => {
    const url = "http://localhost:3002/register";
    const options = { 
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    };
    sendRequest(url, options);
};

const getUsersData = () => {
    const url = "/users";
    const options = {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    sendRequest(url, options);
};

const sendRequest = (url, options) => {
    fetch(url, options)
        .then(data => console.log(data.json().body()));
};

const isValidUserName = (currUser) => {
    if (currUser === "" || currUser === undefined){
        return false;
    }

    for (const key of Object.keys(localStorage)) {
        if(key === "user"){
            let text = localStorage.getItem("user");
            let user = JSON.parse(text);
            if(currUser === user.username) {
              return false;
            }
        }
    }
    return true;
}

const isValidEmail = (mail) => {

    if (mail === "" || mail === undefined){
        return false;
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) === false){
        return false;
    }

    return true;
}

const isStrongPassword = (psw) => {
    let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    if (psw === "" || psw === undefined){
        return false;
    }

    if(strongRegex.test(psw) === false){
        return false;
    }

    return true;
}

const isMediumPassword = (currPassword) => {
    let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    if (currPassword === "" || currPassword === undefined){
        return false;
    }

    if(mediumRegex.test(currPassword) === false){
        password.style.backgroundColor = "red";
        return false;
    }

    return true;
}

const onEnterPassword = () => {
    let currPassword = password.value.trim();
    if (isStrongPassword(currPassword)){
        password.style.backgroundColor = "#ccffe0";
    }
    else if(!isStrongPassword(currPassword) && isMediumPassword(currPassword)) {
    password.style.backgroundColor = "#fcffcc";
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
    }
    else {
        password.style.backgroundColor = "#ffcccc";
        password.value = "";
        toggleModal(true, "Weak password.");
    }
}

const onEnterConfirmPassword = () => {
    let userpsw = password.value.trim();
    let confirmuserpsw = confirmPassword.value.trim();
<<<<<<< HEAD
    if (arePasswordFieldsEqual(userpsw, confirmuserpsw)) {
        if (isStrongPassword(confirmuserpsw)) {
=======
    if(arePasswordFieldsEqual(userpsw, confirmuserpsw)){
        if(isStrongPassword(confirmuserpsw)){
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
            confirmPassword.style.backgroundColor = "#ccffe0";
        } else {
            confirmPassword.style.backgroundColor = "#fcffcc";
        }
    } else {
        confirmPassword.style.backgroundColor = "#ffcccc";
        confirmPassword.value = "";
        toggleModal(true, "Passwords do not match.");
    }
}

<<<<<<< HEAD
const arePasswordFieldsEqual = (userpsw, confirmuserpsw) => {
=======
const arePasswordFieldsEqual = (userpsw,confirmuserpsw) => {
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
    return userpsw === confirmuserpsw;
}

const onEnterEmail = () => {
    let usermail = email.value.trim();
<<<<<<< HEAD
    if (isValidEmail(usermail)) {
=======
    if (isValidEmail(usermail)){
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
        email.style.backgroundColor = "#ccffe0";
    }
    else {
        email.style.backgroundColor = "#ffcccc";
        toggleModal(true, "Invalid email.");
    }
}

const onEnterUsername = () => {
    let uname = username.value.trim();
<<<<<<< HEAD
    if (isValidUserName(uname)) {
=======
    if (isValidUserName(uname)){
>>>>>>> e3564b2d954fc6a4199f163430727385dd500430
        username.style.backgroundColor = "#ccffe0";
    }
    else {
        username.style.backgroundColor = "#ffcccc";
        toggleModal(true, "User with such username already exist.");
    }
}

<<<<<<< HEAD
const isValidUserName = (usernameInput) => {
    if (usernameInput === "" || usernameInput === undefined) {
        return false;
    }

    for (const key of Object.keys(sessionStorage)) {
        if (key.includes("user")) {
            let user = JSON.parse(sessionStorage.getItem(key));
            if (user.username === usernameInput) {
                return false;
            }
        }
    }
    return true;
}

const isValidEmail = (mail) => {

    if (mail === "" || mail === undefined) {
        return false;
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) === false) {
        return false;
    }

    return true;
}

const isStrongPassword = (psw) => {
    let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    if (psw === "" || psw === undefined) {
        return false;
    }

    if (strongRegex.test(psw) === false) {
        return false;
    }

    return true;
}

const isMediumPassword = (currPassword) => {
    let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

    if (currPassword === "" || currPassword === undefined) {
        return false;
    }

    if (mediumRegex.test(currPassword) === false) {
        password.style.backgroundColor = "red";
        return false;
    }

    return true;
}

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

const createBtn = document.getElementById("createUserBtn");
createBtn.addEventListener("click", onRegister);

email.addEventListener("change", onEnterEmail);
password.addEventListener("change", onEnterPassword);
username.addEventListener("change", onEnterUsername);
confirmPassword.addEventListener("change", onEnterConfirmPassword);
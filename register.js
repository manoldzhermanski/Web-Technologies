const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirm-password");

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
    } else {
        toggleModal(true, "Invalid user data.")
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
console.log(localStorage);

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
    if (arePasswordFieldsEqual(userpsw, confirmuserpsw)) {
        if (isStrongPassword(confirmuserpsw)) {
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

const arePasswordFieldsEqual = (userpsw, confirmuserpsw) => {
    return userpsw === confirmuserpsw;
}

const onEnterEmail = () => {
    let usermail = email.value.trim();
    if (isValidEmail(usermail)) {
        email.style.backgroundColor = "#ccffe0";
    }
    else {
        email.style.backgroundColor = "#ffcccc";
        toggleModal(true, "Invalid email.");
    }
}

const onEnterUsername = () => {
    let uname = username.value.trim();
    if (isValidUserName(uname)) {
        username.style.backgroundColor = "#ccffe0";
    }
    else {
        username.style.backgroundColor = "#ffcccc";
        toggleModal(true, "User with such username already exist.");
    }
}

const isValidUserName = (usernameInput) => {
    if (usernameInput === "" || usernameInput === undefined) {
        return false;
    }

    for (const key of Object.keys(localStorage)) {
        if (key.includes("user")) {
            let user = JSON.parse(localStorage.getItem(key));
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
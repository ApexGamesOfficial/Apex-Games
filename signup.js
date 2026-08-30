const signupForm = document.getElementById("signupForm");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const formMessage = document.getElementById("formMessage");

signupForm.addEventListener("submit", function(event) {

    event.preventDefault();

    formMessage.textContent = "";


    if (password.value !== confirmPassword.value) {

        formMessage.textContent =
            "Your passwords don't match.";

        return;

    }


    if (password.value.length < 8) {

        formMessage.textContent =
            "Your password must be at least 8 characters.";

        return;

    }


    formMessage.style.color = "#168cff";

    formMessage.textContent =
        "Account system connection coming next.";

});

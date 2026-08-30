const loginForm = document.getElementById("loginForm");
const formMessage = document.getElementById("formMessage");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    formMessage.style.color = "#168cff";

    formMessage.textContent =
        "Apex Games account connection coming next.";

});

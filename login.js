const loginForm = document.getElementById("loginForm");
const formMessage = document.getElementById("formMessage");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    formMessage.textContent = "";

    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

    if (error) {
        formMessage.textContent = error.message;
        return;
    }

    formMessage.textContent = "Logged in successfully!";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 700);
});

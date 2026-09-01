const signupForm = document.getElementById("signupForm");
const formMessage = document.getElementById("formMessage");

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const gamertag = document
        .getElementById("gamertag")
        .value
        .trim();

    const displayName = document
        .getElementById("displayName")
        .value
        .trim();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    formMessage.textContent = "";


    if (password !== confirmPassword) {
        formMessage.textContent =
            "Passwords do not match.";

        return;
    }


    if (gamertag.length < 3) {
        formMessage.textContent =
            "Gamertag must be at least 3 characters.";

        return;
    }


    const {
        data,
        error
    } = await supabaseClient.auth.signUp({
        email,
        password
    });


    if (error) {
        formMessage.textContent =
            error.message;

        return;
    }


    const user = data.user;


    if (!user) {
        formMessage.textContent =
            "Account could not be created.";

        return;
    }


    const {
        error: profileError
    } = await supabaseClient
        .from("profiles")
        .insert({
            id: user.id,
            gamertag: gamertag,
            display_name: displayName
        });


    if (profileError) {

        if (
            profileError.message
                .toLowerCase()
                .includes("duplicate")
        ) {
            formMessage.textContent =
                "That gamertag is already taken.";
        } else {
            formMessage.textContent =
                "Account created, but profile setup failed: " +
                profileError.message;
        }

        return;
    }


    formMessage.textContent =
        "Account created successfully!";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
});

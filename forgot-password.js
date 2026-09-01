const forgotPasswordForm =
    document.getElementById(
        "forgotPasswordForm"
    );

const emailInput =
    document.getElementById(
        "email"
    );

const sendButton =
    document.getElementById(
        "sendButton"
    );

const formMessage =
    document.getElementById(
        "formMessage"
    );


forgotPasswordForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const email =
            emailInput.value
                .trim()
                .toLowerCase();


        if (!email) {
            return;
        }


        sendButton.disabled =
            true;

        sendButton.textContent =
            "Sending...";

        formMessage.className =
            "form-message";

        formMessage.textContent =
            "";


        const {
            error
        } =
            await supabaseClient
                .auth
                .resetPasswordForEmail(
                    email,
                    {
                        redirectTo:
                            "https://apexgamesofficial.github.io/Apex-Games/reset-password.html"
                    }
                );


        if (error) {

            console.error(
                "Password reset error:",
                error
            );

            formMessage.className =
                "form-message error";

            formMessage.textContent =
                "Unable to send reset email: " +
                error.message;

            sendButton.disabled =
                false;

            sendButton.textContent =
                "Send Reset Link";

            return;
        }


        formMessage.className =
            "form-message success";

        formMessage.textContent =
            "Reset link sent! Check your email.";

        sendButton.textContent =
            "Email Sent";
    }
);

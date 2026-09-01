const resetPasswordForm =
    document.getElementById(
        "resetPasswordForm"
    );

const newPasswordInput =
    document.getElementById(
        "newPassword"
    );

const confirmPasswordInput =
    document.getElementById(
        "confirmPassword"
    );

const resetButton =
    document.getElementById(
        "resetButton"
    );

const formMessage =
    document.getElementById(
        "formMessage"
    );

let recoveryReady = false;


async function checkRecoverySession() {

    const {
        data: { session }
    } =
        await supabaseClient.auth.getSession();


    if (session?.user) {

        recoveryReady = true;

        formMessage.textContent =
            "Reset link verified.";

        formMessage.className =
            "form-message success";

        return;
    }


    formMessage.textContent =
        "This reset link is invalid or has expired.";

    formMessage.className =
        "form-message error";
}


supabaseClient.auth.onAuthStateChange(
    (event, session) => {

        if (
            event === "PASSWORD_RECOVERY" ||
            session?.user
        ) {

            recoveryReady = true;

            formMessage.textContent =
                "Reset link verified.";

            formMessage.className =
                "form-message success";
        }
    }
);


resetPasswordForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!recoveryReady) {

            formMessage.textContent =
                "Your reset link has not been verified.";

            formMessage.className =
                "form-message error";

            return;
        }


        const newPassword =
            newPasswordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        if (
            newPassword.length < 8
        ) {

            formMessage.textContent =
                "Password must be at least 8 characters.";

            formMessage.className =
                "form-message error";

            return;
        }


        if (
            newPassword !==
            confirmPassword
        ) {

            formMessage.textContent =
                "Passwords do not match.";

            formMessage.className =
                "form-message error";

            return;
        }


        resetButton.disabled =
            true;

        resetButton.textContent =
            "Updating...";

        formMessage.textContent =
            "Updating password...";

        formMessage.className =
            "form-message";


        const {
            error
        } =
            await supabaseClient
                .auth
                .updateUser({
                    password:
                        newPassword
                });


        if (error) {

            console.error(
                "Password update error:",
                error
            );

            formMessage.textContent =
                "Unable to reset password: " +
                error.message;

            formMessage.className =
                "form-message error";

            resetButton.disabled =
                false;

            resetButton.textContent =
                "Reset Password";

            return;
        }


        formMessage.textContent =
            "Password changed! Redirecting to login...";

        formMessage.className =
            "form-message success";


        await supabaseClient.auth.signOut();


        setTimeout(
            () => {

                window.location.href =
                    "login.html";

            },
            1200
        );
    }
);


checkRecoverySession();

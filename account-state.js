const profileWidget =
    document.getElementById("profileWidget");

const profilePicture =
    document.getElementById("profilePicture");

const profileGamertag =
    document.getElementById("profileGamertag");


function showLoggedOut() {

    document
        .querySelectorAll(".login-link, .create-account-button")
        .forEach(button => {
            button.style.display = "";
        });

    if (profileWidget) {
        profileWidget.style.display = "none";
        profileWidget.hidden = true;
    }
}


function showLoggedIn(profile) {

    document
        .querySelectorAll(".login-link, .create-account-button")
        .forEach(button => {
            button.style.display = "none";
        });

    profileGamertag.textContent =
        profile.gamertag;

    profilePicture.src =
        profile.avatar_url ||
        "Default Apex Games Profile Picture.png";

    profileWidget.hidden = false;
    profileWidget.style.display = "flex";
}


async function updateAccountNavbar() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (!session?.user) {
        showLoggedOut();
        return;
    }


    const {
        data: profile,
        error
    } = await supabaseClient
        .from("profiles")
        .select("gamertag, avatar_url")
        .eq("id", session.user.id)
        .single();


    if (error || !profile) {
        showLoggedOut();
        return;
    }


    showLoggedIn(profile);
}


updateAccountNavbar();


supabaseClient.auth.onAuthStateChange(() => {
    updateAccountNavbar();
});

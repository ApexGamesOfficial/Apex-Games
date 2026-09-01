const loggedOutAccount =
    document.getElementById("loggedOutAccount");

const profileWidget =
    document.getElementById("profileWidget");

const profilePicture =
    document.getElementById("profilePicture");

const profileGamertag =
    document.getElementById("profileGamertag");


async function updateAccountNavbar() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (!session?.user) {

        loggedOutAccount.hidden = false;
        profileWidget.hidden = true;

        return;
    }


    const user = session.user;


    const {
        data: profile,
        error
    } = await supabaseClient
        .from("profiles")
        .select("gamertag, avatar_url")
        .eq("id", user.id)
        .single();


    if (error || !profile) {

        loggedOutAccount.hidden = false;
        profileWidget.hidden = true;

        return;
    }


    profileGamertag.textContent =
        profile.gamertag;

profilePicture.src =
    profile.avatar_url || "Default Apex Games Profile Picture.png";


   loggedOutAccount.hidden = true;
loggedOutAccount.style.display = "none";

profileWidget.hidden = false;
profileWidget.style.display = "flex";
}


updateAccountNavbar();


supabaseClient.auth.onAuthStateChange(() => {
    updateAccountNavbar();
});

const profileWidget =
    document.getElementById("profileWidget");

const profilePicture =
    document.getElementById("profilePicture");

const profileGamertag =
    document.getElementById("profileGamertag");

const profileAvatar =
    document.getElementById("profileAvatar");

const profileDisplayName =
    document.getElementById("profileDisplayName");

const profilePageGamertag =
    document.getElementById("profilePageGamertag");

const profileBio =
    document.getElementById("profileBio");

const detailGamertag =
    document.getElementById("detailGamertag");

const detailDisplayName =
    document.getElementById("detailDisplayName");

const memberSince =
    document.getElementById("memberSince");

const logoutButton =
    document.getElementById("logoutButton");


async function loadProfile() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (!session?.user) {
        window.location.href = "login.html";
        return;
    }


    const { data: profile, error } =
        await supabaseClient
            .from("profiles")
            .select(
                "gamertag, display_name, avatar_url, bio, created_at"
            )
            .eq("id", session.user.id)
            .single();


    if (error || !profile) {
        console.error(error);
        return;
    }


    const avatar =
        profile.avatar_url ||
        "Default Apex Games Profile Picture.png";

    const displayName =
        profile.display_name ||
        profile.gamertag;


    profilePicture.src = avatar;
    profileAvatar.src = avatar;

    profileGamertag.textContent =
        profile.gamertag;

    profileDisplayName.textContent =
        displayName;

    profilePageGamertag.textContent =
        profile.gamertag;

    profileBio.textContent =
        profile.bio || "No bio yet.";

    detailGamertag.textContent =
        profile.gamertag;

    detailDisplayName.textContent =
        displayName;


    if (profile.created_at) {

        const created =
            new Date(profile.created_at);

        memberSince.textContent =
            created.toLocaleDateString(
                undefined,
                {
                    year: "numeric",
                    month: "long"
                }
            );

    }

}


logoutButton.addEventListener(
    "click",
    async () => {

        const { error } =
            await supabaseClient.auth.signOut();

        if (error) {
            console.error(error);
            return;
        }

        window.location.href =
            "index.html";
    }
);


loadProfile();

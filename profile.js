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

const statusButton =
    document.getElementById("statusButton");

const statusText =
    document.getElementById("statusText");

const statusMenu =
    document.getElementById("statusMenu");


/* =========================================
   STATUS DISPLAY
========================================= */

function updateStatusDisplay(status) {

    const statusNames = {
        online: "ONLINE",
        away: "AWAY",
        dnd: "DO NOT DISTURB",
        offline: "APPEAR OFFLINE"
    };

    statusButton.classList.remove(
        "online",
        "away",
        "dnd",
        "offline"
    );

    statusButton.classList.add(status);

    statusText.textContent =
        statusNames[status] || "ONLINE";
}


/* =========================================
   LOAD PROFILE
========================================= */

async function loadProfile() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (!session?.user) {

        window.location.href =
            "login.html";

        return;
    }


    const {
        data: profile,
        error
    } = await supabaseClient
        .from("profiles")
        .select(`
            gamertag,
            display_name,
            avatar_url,
            bio,
            created_at,
            status
        `)
        .eq(
            "id",
            session.user.id
        )
        .single();


    if (error || !profile) {

        console.error(
            "Unable to load profile:",
            error
        );

        return;
    }


    const avatar =
        profile.avatar_url ||
        "Default Apex Games Profile Picture.png";

    const displayName =
        profile.display_name ||
        profile.gamertag;


    /* NAVBAR */

    profilePicture.src =
        avatar;

    profileGamertag.textContent =
        profile.gamertag;


    /* PROFILE HEADER */

    profileAvatar.src =
        avatar;

    profileDisplayName.textContent =
        displayName;

    profilePageGamertag.textContent =
        profile.gamertag;

    profileBio.textContent =
        profile.bio ||
        "No bio yet.";


    /* PROFILE INFO */

    detailGamertag.textContent =
        profile.gamertag;

    detailDisplayName.textContent =
        displayName;


    /* STATUS */

    updateStatusDisplay(
        profile.status || "online"
    );


    /* MEMBER SINCE */

    if (profile.created_at) {

        const created =
            new Date(
                profile.created_at
            );

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


/* =========================================
   STATUS MENU
========================================= */

statusButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        statusMenu.hidden =
            !statusMenu.hidden;
    }
);


statusMenu
    .querySelectorAll("[data-status]")
    .forEach(button => {

        button.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();
                event.stopPropagation();


                const newStatus =
                    button.dataset.status;


                const {
                    data: { session }
                } =
                    await supabaseClient.auth.getSession();


                if (!session?.user) {
                    return;
                }


                const {
                    error
                } = await supabaseClient
                    .from("profiles")
                    .update({
                        status:
                            newStatus,

                        updated_at:
                            new Date()
                                .toISOString()
                    })
                    .eq(
                        "id",
                        session.user.id
                    );


                if (error) {

                    console.error(
                        "Unable to save status:",
                        error
                    );

                    alert(
                        "Unable to save your status: " +
                        error.message
                    );

                    return;
                }


                updateStatusDisplay(
                    newStatus
                );

                statusMenu.hidden =
                    true;
            }
        );
    });


/* Close menu when clicking elsewhere */

document.addEventListener(
    "click",
    (event) => {

        if (
            !statusButton.contains(
                event.target
            ) &&
            !statusMenu.contains(
                event.target
            )
        ) {

            statusMenu.hidden =
                true;
        }
    }
);


/* =========================================
   LOG OUT
========================================= */

logoutButton.addEventListener(
    "click",
    async () => {

        const {
            error
        } = await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Unable to log out:",
                error
            );

            return;
        }


        window.location.href =
            "index.html";
    }
);


/* =========================================
   START
========================================= */

loadProfile();

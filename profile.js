/* =========================================
   APEX GAMES — PROFILE
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

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

const friendCount =
    document.getElementById("friendCount");

const friendPreviewRow =
    document.getElementById("friendPreviewRow");


let currentUser = null;


/* =========================================
   SAFE TEXT
========================================= */

function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        value || "";

    return element.innerHTML;
}


/* =========================================
   STATUS DISPLAY
========================================= */

function updateStatusDisplay(status) {

    if (
        !statusButton ||
        !statusText
    ) {
        return;
    }


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


    statusButton.classList.add(
        status
    );


    statusText.textContent =
        statusNames[status] ||
        "ONLINE";
}


/* =========================================
   LOAD PROFILE
========================================= */

async function loadProfile() {

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
            currentUser.id
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

    if (profilePicture) {
        profilePicture.src =
            avatar;
    }

    if (profileGamertag) {
        profileGamertag.textContent =
            profile.gamertag;
    }


    /* PROFILE HEADER */

    if (profileAvatar) {
        profileAvatar.src =
            avatar;
    }

    if (profileDisplayName) {
        profileDisplayName.textContent =
            displayName;
    }

    if (profilePageGamertag) {
        profilePageGamertag.textContent =
            profile.gamertag;
    }

    if (profileBio) {
        profileBio.textContent =
            profile.bio ||
            "No bio yet.";
    }


    /* PROFILE INFO */

    if (detailGamertag) {
        detailGamertag.textContent =
            profile.gamertag;
    }

    if (detailDisplayName) {
        detailDisplayName.textContent =
            displayName;
    }


    /* STATUS */

    updateStatusDisplay(
        profile.status ||
        "online"
    );


    /* MEMBER SINCE */

    if (
        memberSince &&
        profile.created_at
    ) {

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
   LOAD FRIENDS
   ONE QUERY = COUNT + PREVIEWS
========================================= */

async function loadFriendsProfileData() {

    if (
        !friendCount ||
        !friendPreviewRow
    ) {
        return;
    }


    const {
        data: friendships,
        error
    } = await supabaseClient
        .from("friend_requests")
        .select(`
            id,
            sender_id,
            receiver_id,

            sender:profiles!friend_requests_sender_id_fkey (
                id,
                gamertag,
                display_name,
                avatar_url,
                status
            ),

            receiver:profiles!friend_requests_receiver_id_fkey (
                id,
                gamertag,
                display_name,
                avatar_url,
                status
            )
        `)
        .eq(
            "status",
            "accepted"
        )
        .or(
            `sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`
        );


    if (error) {

        console.error(
            "Unable to load friends:",
            error
        );


        friendCount.textContent =
            "Friends";


        friendPreviewRow.innerHTML = `
            <p class="friend-preview-empty">
                Unable to load friends.
            </p>
        `;


        return;
    }


    const friends =
        (friendships || [])
            .map(friendship => {

                if (
                    friendship.sender_id ===
                    currentUser.id
                ) {
                    return friendship.receiver;
                }

                return friendship.sender;
            })
            .filter(Boolean);


    /* FRIEND COUNT */

    const count =
        friends.length;


    friendCount.textContent =
        `${count} ${
            count === 1
                ? "Friend"
                : "Friends"
        }`;


    /* NO FRIENDS */

    if (count === 0) {

        friendPreviewRow.innerHTML = `
            <p class="friend-preview-empty">
                No friends yet.
            </p>
        `;

        return;
    }


    /* FRIEND PREVIEWS */

    friendPreviewRow.innerHTML =
        "";


    friends
        .slice(0, 4)
        .forEach(friend => {

            const avatar =
                friend.avatar_url ||
                "Default Apex Games Profile Picture.png";


            const displayName =
                friend.display_name ||
                friend.gamertag;


            const status =
                [
                    "online",
                    "away",
                    "dnd",
                    "offline"
                ].includes(
                    friend.status
                )
                    ? friend.status
                    : "offline";


            const statusNames = {
                online:
                    "Online",

                away:
                    "Away",

                dnd:
                    "Do Not Disturb",

                offline:
                    "Appear Offline"
            };


            const friendCard =
                document.createElement(
                    "a"
                );


            friendCard.href =
                "friends.html";


            friendCard.className =
                "friend-preview";


            friendCard.innerHTML = `

                <div
                    class="friend-preview-avatar-wrap"
                >

                    <img
                        src="${escapeHTML(avatar)}"
                        alt="${escapeHTML(displayName)}"
                        class="friend-preview-avatar"
                    >

                    <span
                        class="friend-preview-status ${status}"
                        title="${statusNames[status]}"
                    ></span>

                </div>

                <span
                    class="friend-preview-name"
                >
                    ${escapeHTML(friend.gamertag)}
                </span>

            `;


            friendPreviewRow.appendChild(
                friendCard
            );
        });
}


/* =========================================
   STATUS MENU
========================================= */

if (
    statusButton &&
    statusMenu
) {

    statusButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();
            event.stopPropagation();


            statusMenu.hidden =
                !statusMenu.hidden;
        }
    );


    statusMenu
        .querySelectorAll(
            "[data-status]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                async (event) => {

                    event.preventDefault();
                    event.stopPropagation();


                    if (!currentUser) {
                        return;
                    }


                    const newStatus =
                        button.dataset.status;


                    if (
                        ![
                            "online",
                            "away",
                            "dnd",
                            "offline"
                        ].includes(
                            newStatus
                        )
                    ) {
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
                            currentUser.id
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
}


/* =========================================
   LOG OUT
========================================= */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const {
                error
            } =
                await supabaseClient
                    .auth
                    .signOut();


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
}


/* =========================================
   START PROFILE PAGE
========================================= */

async function startProfilePage() {

    const {
        data: { session }
    } =
        await supabaseClient
            .auth
            .getSession();


    if (!session?.user) {

        window.location.href =
            "login.html";

        return;
    }


    currentUser =
        session.user;


    /*
        Start these together.

        Profile data does NOT need to
        finish before friends can load.
    */

    await Promise.all([
        loadProfile(),
        loadFriendsProfileData()
    ]);
}


startProfilePage();

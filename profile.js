/* =========================================================
   APEX GAMES — PROFILE
========================================================= */


const DEFAULT_AVATAR =
    "Default Apex Games Profile Picture.png";


/* =========================================================
   DOM
========================================================= */

const profilePicture =
    document.getElementById(
        "profilePicture"
    );

const profileGamertag =
    document.getElementById(
        "profileGamertag"
    );

const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );

const profileDisplayName =
    document.getElementById(
        "profileDisplayName"
    );

const profilePageGamertag =
    document.getElementById(
        "profilePageGamertag"
    );

const profileBio =
    document.getElementById(
        "profileBio"
    );

const detailGamertag =
    document.getElementById(
        "detailGamertag"
    );

const detailDisplayName =
    document.getElementById(
        "detailDisplayName"
    );

const memberSince =
    document.getElementById(
        "memberSince"
    );

const logoutButton =
    document.getElementById(
        "logoutButton"
    );

const statusButton =
    document.getElementById(
        "statusButton"
    );

const statusText =
    document.getElementById(
        "statusText"
    );

const statusMenu =
    document.getElementById(
        "statusMenu"
    );

const friendCount =
    document.getElementById(
        "friendCount"
    );

const friendPreviewRow =
    document.getElementById(
        "friendPreviewRow"
    );

const profileBadges =
    document.getElementById(
        "profileBadges"
    );


/* =========================================================
   STATE
========================================================= */

let currentUser =
    null;

let currentProfile =
    null;

let profileFriends =
    [];


/* =========================================================
   HELPERS
========================================================= */

function escapeHTML(
    value
) {

    const element =
        document.createElement(
            "div"
        );


    element.textContent =
        value || "";


    return element.innerHTML;
}


function safeAvatar(
    image,
    url
) {

    if (!image) {
        return;
    }


    image.onerror =
        () => {

            image.onerror =
                null;

            image.src =
                DEFAULT_AVATAR;
        };


    image.src =
        url ||
        DEFAULT_AVATAR;
}


/* =========================================================
   STATUS HELPERS
========================================================= */

function normalizeStatus(
    status
) {

    if (
        status === "online" ||
        status === "away" ||
        status === "dnd" ||
        status === "offline"
    ) {

        return status;
    }


    return "offline";
}


function statusLabel(
    status
) {

    const labels = {

        online:
            "Online",

        away:
            "Away",

        dnd:
            "Do Not Disturb",

        offline:
            "Offline"
    };


    return labels[
        normalizeStatus(
            status
        )
    ];
}


/* =========================================================
   LIVE STATUS
========================================================= */

function liveStatus(
    userId
) {

    if (
        typeof window.getLiveStatus ===
        "function"
    ) {

        return normalizeStatus(
            window.getLiveStatus(
                userId
            )
        );
    }


    return "offline";
}


/* =========================================================
   PROFILE STATUS BUTTON
========================================================= */

function updateStatusDisplay(
    status
) {

    if (
        !statusButton ||
        !statusText
    ) {

        return;
    }


    const normalized =
        normalizeStatus(
            status
        );


    const statusNames = {

        online:
            "ONLINE",

        away:
            "AWAY",

        dnd:
            "DO NOT DISTURB",

        offline:
            "APPEAR OFFLINE"
    };


    statusButton.classList.remove(
        "online",
        "away",
        "dnd",
        "offline"
    );


    statusButton.classList.add(
        normalized
    );


    statusText.textContent =
        statusNames[
            normalized
        ];
}


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    const {
        data: profile,
        error
    } =
        await supabaseClient
            .from(
                "profiles"
            )
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


    if (
        error ||
        !profile
    ) {

        console.error(
            "Unable to load profile:",
            error
        );

        return;
    }


    currentProfile =
        profile;


    const avatar =
        profile.avatar_url ||
        DEFAULT_AVATAR;


    const displayName =
        profile.display_name ||
        profile.gamertag;


    /* NAV */

    safeAvatar(
        profilePicture,
        avatar
    );


    if (
        profileGamertag
    ) {

        profileGamertag.textContent =
            profile.gamertag;
    }


    /* HEADER */

    safeAvatar(
        profileAvatar,
        avatar
    );


    if (
        profileDisplayName
    ) {

        profileDisplayName.textContent =
            displayName;
    }


    if (
        profilePageGamertag
    ) {

        profilePageGamertag.textContent =
            profile.gamertag;
    }


    if (
        profileBio
    ) {

        profileBio.textContent =
            profile.bio ||
            "No bio yet.";
    }


    /* PROFILE INFO */

    if (
        detailGamertag
    ) {

        detailGamertag.textContent =
            profile.gamertag;
    }


    if (
        detailDisplayName
    ) {

        detailDisplayName.textContent =
            displayName;
    }


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
                    year:
                        "numeric",

                    month:
                        "long"
                }
            );
    }


    /*
        profiles.status is now the user's
        preferred status.

        Presence determines whether they're
        actually connected.
    */

    updateStatusDisplay(
        normalizeStatus(
            profile.status ||
            "online"
        )
    );
}


/* =========================================================
   LOAD FRIENDS
========================================================= */

async function loadFriendsProfileData() {

    if (
        !friendCount ||
        !friendPreviewRow
    ) {

        return;
    }


    const {
        data: relationships,
        error
    } =
        await supabaseClient
            .from(
                "friend_requests"
            )
            .select(`
                sender_id,
                receiver_id,
                status
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


    const friendIds =
        [
            ...new Set(
                (relationships || [])
                    .map(
                        relationship => {

                            if (
                                relationship.sender_id ===
                                currentUser.id
                            ) {

                                return relationship.receiver_id;
                            }


                            return relationship.sender_id;
                        }
                    )
            )
        ];


    if (
        friendIds.length ===
        0
    ) {

        profileFriends =
            [];

        renderFriendPreviews();

        return;
    }


    const {
        data: profiles,
        error: profileError
    } =
        await supabaseClient
            .from(
                "profiles"
            )
            .select(`
                id,
                gamertag,
                display_name,
                avatar_url
            `)
            .in(
                "id",
                friendIds
            );


    if (
        profileError
    ) {

        console.error(
            "Unable to load friend profiles:",
            profileError
        );


        friendPreviewRow.innerHTML = `
            <p class="friend-preview-empty">
                Unable to load friends.
            </p>
        `;


        return;
    }


    profileFriends =
        (profiles || [])
            .sort(
                (
                    a,
                    b
                ) =>
                    (
                        a.gamertag ||
                        ""
                    )
                        .localeCompare(
                            b.gamertag ||
                            ""
                        )
            );


    renderFriendPreviews();
}


/* =========================================================
   RENDER FRIENDS
========================================================= */

function renderFriendPreviews() {

    if (
        !friendCount ||
        !friendPreviewRow
    ) {

        return;
    }


    const count =
        profileFriends.length;


    friendCount.textContent =
        `${count} ${
            count === 1
                ? "Friend"
                : "Friends"
        }`;


    friendPreviewRow.innerHTML =
        "";


    if (
        count ===
        0
    ) {

        friendPreviewRow.innerHTML = `
            <p class="friend-preview-empty">
                No friends yet.
            </p>
        `;

        return;
    }


    profileFriends
        .slice(
            0,
            4
        )
        .forEach(
            friend => {

                const avatar =
                    friend.avatar_url ||
                    DEFAULT_AVATAR;


                const displayName =
                    friend.display_name ||
                    friend.gamertag ||
                    "Friend";


                const status =
                    liveStatus(
                        friend.id
                    );


                const card =
                    document.createElement(
                        "a"
                    );


                card.href =
                    "friends.html";


                card.className =
                    "friend-preview";


                card.innerHTML = `

                    <div class="friend-preview-avatar-wrap">

                        <img
                            class="friend-preview-avatar"
                            src="${escapeHTML(avatar)}"
                            alt="${escapeHTML(displayName)}"
                        >

                        <span
                            class="friend-preview-status ${status}"
                            title="${escapeHTML(statusLabel(status))}"
                        ></span>

                    </div>


                    <div class="friend-preview-info">

                        <span class="friend-preview-name">
                            ${escapeHTML(friend.gamertag || "Friend")}
                        </span>

                        <span class="friend-preview-presence">
                            ${escapeHTML(statusLabel(status))}
                        </span>

                    </div>

                `;


                const image =
                    card.querySelector(
                        ".friend-preview-avatar"
                    );


                if (
                    image
                ) {

                    image.onerror =
                        () => {

                            image.onerror =
                                null;

                            image.src =
                                DEFAULT_AVATAR;
                        };
                }


                friendPreviewRow.appendChild(
                    card
                );
            }
        );
}


/* =========================================================
   PRESENCE UPDATES
========================================================= */

window.addEventListener(
    "apex-presence-updated",
    () => {

        renderFriendPreviews();
    }
);


/* =========================================================
   LOAD BADGES
========================================================= */

async function loadBadges() {

    if (
        !profileBadges
    ) {

        return;
    }


    profileBadges.innerHTML = `
        <p class="badge-empty">
            Loading badges...
        </p>
    `;


    const {
        data,
        error
    } =
        await supabaseClient
            .from(
                "launch_registrations"
            )
            .select(`
                badge,
                registered_at
            `)
            .eq(
                "user_id",
                currentUser.id
            )
            .maybeSingle();


    if (
        error
    ) {

        console.error(
            "Unable to load badges:",
            error
        );


        profileBadges.innerHTML = `
            <p class="badge-empty">
                Unable to load badges.
            </p>
        `;


        return;
    }


    profileBadges.innerHTML =
        "";


    if (
        !data ||
        data.badge !==
            "Beta Tester"
    ) {

        profileBadges.innerHTML = `
            <p class="badge-empty">
                No badges yet.
            </p>
        `;

        return;
    }


    const badge =
        document.createElement(
            "div"
        );


    badge.className =
        "apex-badge beta-tester-badge";


    badge.innerHTML = `

        <div class="badge-emblem">
            β
        </div>


        <div class="badge-content">

            <strong>
                BETA TESTER
            </strong>

            <span>
                Pre-Launch Member · 2026
            </span>

        </div>

    `;


    profileBadges.appendChild(
        badge
    );
}


/* =========================================================
   STATUS MENU
========================================================= */

if (
    statusButton &&
    statusMenu
) {

    statusButton.addEventListener(
        "click",
        event => {

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
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    async event => {

                        event.preventDefault();
                        event.stopPropagation();


                        if (
                            !currentUser
                        ) {

                            return;
                        }


                        const newStatus =
                            normalizeStatus(
                                button.dataset.status
                            );


                        /*
                            presence.js now handles:

                            1. local status preference
                            2. database preference
                            3. Realtime Presence tracking
                        */

                        if (
                            typeof window.setLiveStatus ===
                            "function"
                        ) {

                            await window.setLiveStatus(
                                newStatus
                            );

                        } else {

                            const {
                                error
                            } =
                                await supabaseClient
                                    .from(
                                        "profiles"
                                    )
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


                            if (
                                error
                            ) {

                                console.error(
                                    "Unable to save status:",
                                    error
                                );

                                return;
                            }
                        }


                        if (
                            currentProfile
                        ) {

                            currentProfile.status =
                                newStatus;
                        }


                        updateStatusDisplay(
                            newStatus
                        );


                        statusMenu.hidden =
                            true;
                    }
                );
            }
        );


    document.addEventListener(
        "click",
        event => {

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


/* =========================================================
   LOGOUT
========================================================= */

if (
    logoutButton
) {

    logoutButton.addEventListener(
        "click",
        async () => {

            const {
                error
            } =
                await supabaseClient
                    .auth
                    .signOut();


            if (
                error
            ) {

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


/* =========================================================
   START
========================================================= */

async function startProfilePage() {

    const {
        data: {
            session
        }
    } =
        await supabaseClient
            .auth
            .getSession();


    if (
        !session?.user
    ) {

        window.location.href =
            "login.html";

        return;
    }


    currentUser =
        session.user;


    await Promise.all([
        loadProfile(),
        loadFriendsProfileData(),
        loadBadges()
    ]);


    /*
        Presence may already have synchronized
        before profile.js attached its event listener.

        Force one render using the current live state.
    */

    renderFriendPreviews();
}


startProfilePage();

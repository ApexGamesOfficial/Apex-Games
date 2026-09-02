const friendSearchForm =
    document.getElementById("friendSearchForm");

const friendSearchInput =
    document.getElementById("friendSearchInput");

const searchResults =
    document.getElementById("searchResults");

const friendsMessage =
    document.getElementById("friendsMessage");

const incomingRequests =
    document.getElementById("incomingRequests");

const friendsList =
    document.getElementById("friendsList");


let currentUser = null;


/* =========================================
   LOAD PAGE
========================================= */

async function loadFriendsPage() {

    const {
        data: { session }
    } = await supabaseClient.auth.getSession();


    if (!session?.user) {

        window.location.href =
            "login.html";

        return;
    }


    currentUser = session.user;


    await loadIncomingRequests();

    await loadFriendsList();
}


/* =========================================
   SEARCH
========================================= */

friendSearchForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const search =
            friendSearchInput.value.trim();


        if (!search) {
            return;
        }


        friendsMessage.textContent = "";

        searchResults.innerHTML = `
            <p class="empty-results">
                Searching...
            </p>
        `;


        const {
            data: profile,
            error
        } = await supabaseClient
            .from("profiles")
            .select(`
                id,
                gamertag,
                display_name,
                avatar_url
            `)
            .ilike(
                "gamertag",
                search
            )
            .maybeSingle();


        if (error) {

            console.error(
                "Search error:",
                error
            );

            searchResults.innerHTML = `
                <p class="empty-results">
                    Unable to search right now.
                </p>
            `;

            return;
        }


        if (!profile) {

            searchResults.innerHTML = `
                <p class="empty-results">
                    No player found with that gamertag.
                </p>
            `;

            return;
        }


        if (
            profile.id === currentUser.id
        ) {

            searchResults.innerHTML = `
                <p class="empty-results">
                    That's your own account 😭
                </p>
            `;

            return;
        }


        showPlayer(profile);
    }
);


/* =========================================
   SHOW SEARCH RESULT
========================================= */

function showPlayer(profile) {

    const avatar =
        profile.avatar_url ||
        "Default Apex Games Profile Picture.png";


    const displayName =
        profile.display_name ||
        profile.gamertag;


    searchResults.innerHTML = `

        <article class="player-result">

            <img
                src="${avatar}"
                alt="Profile Picture"
            >

            <div class="player-result-info">

                <h3>
                    ${escapeHTML(displayName)}
                </h3>

                <p>
                    @${escapeHTML(profile.gamertag)}
                </p>

            </div>

            <button
                class="send-request-button"
                id="sendRequestButton"
                type="button"
            >
                Add Friend
            </button>

        </article>

    `;


    document
        .getElementById(
            "sendRequestButton"
        )
        .addEventListener(
            "click",
            () => {
                sendFriendRequest(
                    profile
                );
            }
        );
}


/* =========================================
   SEND FRIEND REQUEST
========================================= */

async function sendFriendRequest(profile) {

    const button =
        document.getElementById(
            "sendRequestButton"
        );


    button.disabled = true;

    button.textContent =
        "Sending...";


    const {
        data: existing,
        error: existingError
    } = await supabaseClient
        .from("friend_requests")
        .select(`
            id,
            sender_id,
            receiver_id,
            status
        `)
        .or(
            `and(sender_id.eq.${currentUser.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${currentUser.id})`
        )
        .maybeSingle();


    if (existingError) {

        console.error(
            "Friend status error:",
            existingError
        );

        friendsMessage.textContent =
            "Unable to check friend status.";

        button.disabled = false;

        button.textContent =
            "Add Friend";

        return;
    }


    if (existing) {

        if (
            existing.status ===
            "pending"
        ) {

            friendsMessage.textContent =
                "A friend request already exists between these accounts.";

        } else if (
            existing.status ===
            "accepted"
        ) {

            friendsMessage.textContent =
                "You're already friends.";

        } else {

            friendsMessage.textContent =
                "A previous friend request already exists.";
        }


        button.textContent =
            "Unavailable";

        return;
    }


    const {
        error
    } = await supabaseClient
        .from("friend_requests")
        .insert({
            sender_id:
                currentUser.id,

            receiver_id:
                profile.id,

            status:
                "pending"
        });


    if (error) {

        console.error(
            "Send request error:",
            error
        );

        friendsMessage.textContent =
            "Unable to send friend request: " +
            error.message;

        button.disabled = false;

        button.textContent =
            "Add Friend";

        return;
    }


    button.textContent =
        "Request Sent";

    friendsMessage.textContent =
        `Friend request sent to @${profile.gamertag}!`;
}


/* =========================================
   INCOMING REQUESTS
========================================= */

async function loadIncomingRequests() {

    incomingRequests.innerHTML = `
        <p class="empty-results">
            Loading friend requests...
        </p>
    `;


    const {
        data: requests,
        error
    } = await supabaseClient
        .from("friend_requests")
        .select(`
            id,
            sender_id,
            status,
            sender:profiles!friend_requests_sender_id_fkey (
                id,
                gamertag,
                display_name,
                avatar_url
            )
        `)
        .eq(
            "receiver_id",
            currentUser.id
        )
        .eq(
            "status",
            "pending"
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Incoming request error:",
            error
        );

        incomingRequests.innerHTML = `
            <p class="empty-results">
                Unable to load friend requests.
            </p>
        `;

        return;
    }


    if (!requests?.length) {

        incomingRequests.innerHTML = `
            <p class="empty-results">
                No incoming friend requests.
            </p>
        `;

        return;
    }


    incomingRequests.innerHTML = "";


    requests.forEach(request => {

        const sender =
            request.sender;


        if (!sender) {
            return;
        }


        const avatar =
            sender.avatar_url ||
            "Default Apex Games Profile Picture.png";


        const displayName =
            sender.display_name ||
            sender.gamertag;


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "request-card";


        card.innerHTML = `

            <img
                src="${avatar}"
                alt="Profile Picture"
            >

            <div class="request-card-info">

                <h3>
                    ${escapeHTML(displayName)}
                </h3>

                <p>
                    @${escapeHTML(sender.gamertag)}
                </p>

            </div>

            <div class="request-actions">

                <button
                    class="accept-request-button"
                    type="button"
                >
                    Accept
                </button>

                <button
                    class="decline-request-button"
                    type="button"
                >
                    Decline
                </button>

            </div>

        `;


        card
            .querySelector(
                ".accept-request-button"
            )
            .addEventListener(
                "click",
                () => {
                    respondToRequest(
                        request.id,
                        "accepted",
                        card
                    );
                }
            );


        card
            .querySelector(
                ".decline-request-button"
            )
            .addEventListener(
                "click",
                () => {
                    respondToRequest(
                        request.id,
                        "declined",
                        card
                    );
                }
            );


        incomingRequests.appendChild(
            card
        );
    });
}


/* =========================================
   ACCEPT / DECLINE
========================================= */

async function respondToRequest(
    requestId,
    newStatus,
    card
) {

    const buttons =
        card.querySelectorAll(
            "button"
        );


    buttons.forEach(button => {
        button.disabled = true;
    });


    const {
        error
    } = await supabaseClient
        .from("friend_requests")
        .update({
            status:
                newStatus
        })
        .eq(
            "id",
            requestId
        );


    if (error) {

        console.error(
            "Respond request error:",
            error
        );

        friendsMessage.textContent =
            "Unable to update friend request: " +
            error.message;


        buttons.forEach(button => {
            button.disabled = false;
        });


        return;
    }


    card.remove();


    if (
        newStatus === "accepted"
    ) {

        friendsMessage.textContent =
            "Friend request accepted!";

        await loadFriendsList();

    } else {

        friendsMessage.textContent =
            "Friend request declined.";
    }


    await loadIncomingRequests();
}


/* =========================================
   FRIENDS LIST
========================================= */

async function loadFriendsList() {

    friendsList.innerHTML = `
        <p class="empty-results">
            Loading friends...
        </p>
    `;


    const {
        data: requests,
        error
    } = await supabaseClient
        .from("friend_requests")
        .select(`
            id,
            sender_id,
            receiver_id,
            status,
            sender:profiles!friend_requests_sender_id_fkey (
                id,
                gamertag,
                display_name,
                avatar_url
            ),
            receiver:profiles!friend_requests_receiver_id_fkey (
                id,
                gamertag,
                display_name,
                avatar_url
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
            "Friends list error:",
            error
        );

        friendsList.innerHTML = `
            <p class="empty-results">
                Unable to load friends.
            </p>
        `;

        return;
    }


    if (!requests?.length) {

        friendsList.innerHTML = `
            <p class="empty-results">
                You haven't added any friends yet.
            </p>
        `;

        return;
    }


    friendsList.innerHTML = "";


    requests.forEach(request => {

        const friend =
            request.sender_id ===
            currentUser.id
                ? request.receiver
                : request.sender;


        if (!friend) {
            return;
        }


        const avatar =
            friend.avatar_url ||
            "Default Apex Games Profile Picture.png";


        const displayName =
            friend.display_name ||
            friend.gamertag;


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "friend-card";


        card.innerHTML = `

            <img
                src="${avatar}"
                alt="Profile Picture"
            >

            <div class="friend-card-info">

                <h3>
                    ${escapeHTML(displayName)}
                </h3>

                <p>
                    @${escapeHTML(friend.gamertag)}
                </p>

            </div>

            <div class="friend-card-actions">

                <button
                    class="message-friend-button"
                    type="button"
                >
                    Message
                </button>

            </div>

        `;


        card
            .querySelector(
                ".message-friend-button"
            )
            .addEventListener(
                "click",
                () => {

                    window.location.href =
                        `chat.html?user=${friend.id}`;

                }
            );


        friendsList.appendChild(
            card
        );
    });
}


/* =========================================
   SAFE TEXT
========================================= */

function escapeHTML(value) {

    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        value || "";

    return element.innerHTML;
}


/* =========================================
   START
========================================= */

loadFriendsPage();

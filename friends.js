const friendSearchForm =
    document.getElementById("friendSearchForm");

const friendSearchInput =
    document.getElementById("friendSearchInput");

const searchResults =
    document.getElementById("searchResults");

const friendsMessage =
    document.getElementById("friendsMessage");

const incomingRequests =
    document.getElementById(
        "incomingRequests"
    );


let currentUser = null;


/* =========================================
   LOAD USER
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

}


loadFriendsPage();


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

        searchResults.innerHTML =
            `<p class="empty-results">Searching...</p>`;


        const {
            data: profile,
            error
        } = await supabaseClient
            .from("profiles")
            .select(
                "id, gamertag, display_name, avatar_url"
            )
            .ilike(
                "gamertag",
                search
            )
            .maybeSingle();


        if (error) {

            console.error(error);

            searchResults.innerHTML =
                `<p class="empty-results">
                    Unable to search right now.
                </p>`;

            return;
        }


        if (!profile) {

            searchResults.innerHTML =
                `<p class="empty-results">
                    No player found with that gamertag.
                </p>`;

            return;
        }


        if (profile.id === currentUser.id) {

            searchResults.innerHTML =
                `<p class="empty-results">
                    That's your own account 😭
                </p>`;

            return;
        }


        showPlayer(profile);

    }
);


/* =========================================
   SHOW RESULT
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
            >
                Add Friend
            </button>

        </article>

    `;


    document
        .getElementById("sendRequestButton")
        .addEventListener(
            "click",
            () => sendFriendRequest(profile)
        );

}


/* =========================================
   SEND REQUEST
========================================= */

async function sendFriendRequest(profile) {

    const button =
        document.getElementById(
            "sendRequestButton"
        );


    button.disabled = true;

    button.textContent =
        "Sending...";


    /*
        Check both directions.

        This prevents:
        A → B
        AND
        B → A

        existing at the same time.
    */

    const {
        data: existing,
        error: existingError
    } = await supabaseClient
        .from("friend_requests")
        .select(
            "id, sender_id, receiver_id, status"
        )
        .or(
            `and(sender_id.eq.${currentUser.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${currentUser.id})`
        )
        .maybeSingle();


    if (existingError) {

        console.error(existingError);

        friendsMessage.textContent =
            "Unable to check friend status.";

        button.disabled = false;

        button.textContent =
            "Add Friend";

        return;
    }


    if (existing) {

        if (existing.status === "pending") {

            friendsMessage.textContent =
                "A friend request already exists between these accounts.";

        } else if (
            existing.status === "accepted"
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

        console.error(error);

        friendsMessage.textContent =
            "Unable to send friend request.";

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
   SAFE TEXT
========================================= */

function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        value || "";

    return element.innerHTML;

}

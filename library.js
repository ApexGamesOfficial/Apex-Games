/* =========================================================
   APEX GAMES — LIBRARY v22
   CLIENT + UNSUPPORTED WEB LIBRARY
========================================================= */

const DEFAULT_AVATAR = "Default Apex Games Profile Picture.png";


/* =========================================================
   GAME DATA
========================================================= */

const libraryGames = [
    {
        id: "apex-demo",
        title: "Apex Demo",
        shortTitle: "A",
        developer: "Apex Games",
        studio: "APEX GAMES",
        description:
            "Apex Demo is a temporary title used to preview the Apex Games Library experience.",
        genre: "Action",
        release: "2026",
        platform: "Windows",
        version: "0.1.0",
        build: "1001",
        installSize: "1.8 GB",
        installed: true,
        playtimeMinutes: 0,
        lastPlayed: null,
        achievementsUnlocked: 0,
        achievementsTotal: 0,
        communityScore: null,
        ratingCount: 0,
        bannerAccent: "blue"
    },

    {
        id: "project-unknown",
        title: "Project Unknown",
        shortTitle: "P",
        developer: "Apex Games",
        studio: "APEX GAMES",
        description:
            "Project Unknown is a placeholder for a future Apex Games title.",
        genre: "Adventure",
        release: "TBA",
        platform: "Windows",
        version: "Pre-Release",
        build: "—",
        installSize: "4.2 GB",
        installed: false,
        playtimeMinutes: 0,
        lastPlayed: null,
        achievementsUnlocked: 0,
        achievementsTotal: 0,
        communityScore: null,
        ratingCount: 0,
        bannerAccent: "dark"
    }
];


/* =========================================================
   STATE
========================================================= */

let selectedGameId =
    localStorage.getItem("apexLibrarySelectedGame") ||
    libraryGames[0].id;

let clientFilter = "all";
let clientSearch = "";

let webFilter = "all";
let webSearch = "";


/* =========================================================
   SHORTCUT
========================================================= */

function $(id) {
    return document.getElementById(id);
}


/* =========================================================
   STORAGE
========================================================= */

function getFavorites() {
    try {
        const value =
            JSON.parse(
                localStorage.getItem("apexLibraryFavorites") ||
                "[]"
            );

        return Array.isArray(value)
            ? value
            : [];
    } catch {
        return [];
    }
}


function isFavorite(gameId) {
    return getFavorites().includes(gameId);
}


function toggleFavorite(gameId) {
    const favorites = getFavorites();

    const index =
        favorites.indexOf(gameId);

    if (index >= 0) {
        favorites.splice(index, 1);
    } else {
        favorites.push(gameId);
    }

    localStorage.setItem(
        "apexLibraryFavorites",
        JSON.stringify(favorites)
    );
}


function getRating(gameId) {
    const rating =
        Number(
            localStorage.getItem(
                `apexLibraryRating:${gameId}`
            )
        );

    return rating >= 1 && rating <= 5
        ? rating
        : 0;
}


function saveRating(gameId, rating) {
    localStorage.setItem(
        `apexLibraryRating:${gameId}`,
        String(rating)
    );
}


/* =========================================================
   HELPERS
========================================================= */

function findGame(gameId) {
    return (
        libraryGames.find(
            game => game.id === gameId
        ) ||
        null
    );
}


function selectedGame() {
    return findGame(selectedGameId);
}


function formatPlaytime(minutes) {
    const total =
        Number(minutes) || 0;

    if (total < 60) {
        return `${total} ${
            total === 1
                ? "minute"
                : "minutes"
        }`;
    }

    const hours =
        total / 60;

    return `${
        Number.isInteger(hours)
            ? hours
            : hours.toFixed(1)
    } ${
        hours === 1
            ? "hour"
            : "hours"
    }`;
}


function formatLastPlayed(value) {
    if (!value) {
        return "Never";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Never";
    }

    return date.toLocaleDateString(
        undefined,
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


function achievementPercent(game) {
    const total =
        Number(
            game.achievementsTotal
        ) || 0;

    const unlocked =
        Number(
            game.achievementsUnlocked
        ) || 0;

    if (total <= 0) {
        return 0;
    }

    return Math.min(
        100,
        Math.max(
            0,
            unlocked / total * 100
        )
    );
}


function escapeHTML(value) {
    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =========================================================
   ACCOUNT
========================================================= */

async function loadAccount() {
    const loggedOut =
        $("loggedOutAccount");

    const profileWidget =
        $("profileWidget");

    const profilePicture =
        $("profilePicture");

    const profileGamertag =
        $("profileGamertag");


    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.warn(
            "Supabase client unavailable."
        );

        return;
    }


    try {
        const {
            data: {
                session
            }
        } =
            await supabaseClient
                .auth
                .getSession();


        if (!session?.user) {
            if (loggedOut) {
                loggedOut.hidden =
                    false;
            }

            if (profileWidget) {
                profileWidget.hidden =
                    true;
            }

            return;
        }


        if (loggedOut) {
            loggedOut.hidden =
                true;
        }

        if (profileWidget) {
            profileWidget.hidden =
                false;
        }


        const {
            data: profile
        } =
            await supabaseClient
                .from("profiles")
                .select(
                    "gamertag, avatar_url"
                )
                .eq(
                    "id",
                    session.user.id
                )
                .maybeSingle();


        if (
            profileGamertag
        ) {
            profileGamertag.textContent =
                profile?.gamertag ||
                "Player";
        }


        if (
            profilePicture
        ) {
            profilePicture.src =
                profile?.avatar_url ||
                DEFAULT_AVATAR;

            profilePicture.onerror =
                () => {
                    profilePicture.onerror =
                        null;

                    profilePicture.src =
                        DEFAULT_AVATAR;
                };
        }

    } catch (error) {
        console.error(
            "Account load failed:",
            error
        );
    }
}


/* =========================================================
   CLIENT BRIDGE
========================================================= */

function hasClientBridge() {
    return Boolean(
        window.ApexClient &&
        typeof window.ApexClient ===
            "object"
    );
}


function updateClientIndicator() {
    const text =
        $("clientConnectionText");

    if (!text) {
        return;
    }

    if (hasClientBridge()) {
        text.textContent =
            "Connected";

        document.body
            .classList
            .add(
                "client-connected"
            );
    } else {
        text.textContent =
            "Web preview mode";

        document.body
            .classList
            .remove(
                "client-connected"
            );
    }
}


/* =========================================================
   CLIENT MESSAGE
========================================================= */

function showClientMessage(
    title,
    text
) {
    const box =
        $("clientActionMessage");

    if (!box) {
        return;
    }

    $("clientMessageTitle").textContent =
        title;

    $("clientMessageText").textContent =
        text;

    box.hidden =
        false;
}


function hideClientMessage() {
    const box =
        $("clientActionMessage");

    if (box) {
        box.hidden =
            true;
    }
}


/* =========================================================
   CLIENT FILTERING
========================================================= */

function getClientGames() {
    const query =
        clientSearch
            .trim()
            .toLowerCase();

    return libraryGames.filter(
        game => {
            const matches =
                !query ||
                game.title
                    .toLowerCase()
                    .includes(query) ||
                game.developer
                    .toLowerCase()
                    .includes(query);

            if (!matches) {
                return false;
            }

            if (
                clientFilter ===
                "installed"
            ) {
                return game.installed;
            }

            if (
                clientFilter ===
                "favorites"
            ) {
                return isFavorite(
                    game.id
                );
            }

            if (
                clientFilter ===
                "recent"
            ) {
                return Boolean(
                    game.lastPlayed
                );
            }

            return true;
        }
    );
}


/* =========================================================
   CLIENT LIST
========================================================= */

function renderClientList() {
    const list =
        $("gameList");

    if (!list) {
        return;
    }

    const games =
        getClientGames();

    list.innerHTML =
        "";


    const count =
        $("libraryGameCount");

    if (count) {
        count.textContent =
            `${libraryGames.length} ${
                libraryGames.length === 1
                    ? "game"
                    : "games"
            }`;
    }


    const empty =
        $("libraryListEmpty");

    if (empty) {
        empty.hidden =
            games.length !== 0;
    }


    games.forEach(
        game => {
            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "library-game";

            if (
                game.id ===
                selectedGameId
            ) {
                button.classList.add(
                    "active"
                );
            }

            button.innerHTML = `
                <div class="game-list-icon">
                    ${escapeHTML(game.shortTitle)}
                </div>

                <div class="game-list-copy">

                    <div class="game-list-title-row">

                        <strong>
                            ${escapeHTML(game.title)}
                        </strong>

                        ${
                            isFavorite(game.id)
                                ? `
                                    <span
                                        class="game-list-favorite"
                                    >
                                        ♥
                                    </span>
                                `
                                : ""
                        }

                    </div>

                    <span>
                        ${
                            game.installed
                                ? "Ready to Play"
                                : "Not Installed"
                        }
                    </span>

                </div>
            `;

            button.addEventListener(
                "click",
                () => {
                    selectedGameId =
                        game.id;

                    localStorage.setItem(
                        "apexLibrarySelectedGame",
                        game.id
                    );

                    renderClientList();
                    renderSelectedGame();
                }
            );

            list.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   SELECTED CLIENT GAME
========================================================= */

function renderSelectedGame() {
    const game =
        selectedGame();

    if (!game) {
        return;
    }


    const values = {
        selectedTitle:
            game.title,

        selectedStudio:
            game.studio,

        selectedGenre:
            game.genre,

        selectedRelease:
            game.release,

        aboutTitle:
            game.title,

        gameDescription:
            game.description,

        gameDeveloper:
            game.developer,

        gamePlatform:
            game.platform,

        gameVersion:
            game.version,

        gameBuild:
            game.build,

        installSize:
            game.installSize,

        gameStatus:
            game.installed
                ? "Installed"
                : "Not Installed",

        playtime:
            formatPlaytime(
                game.playtimeMinutes
            ),

        lastPlayed:
            formatLastPlayed(
                game.lastPlayed
            )
    };


    Object.entries(values)
        .forEach(
            ([id, value]) => {
                const element =
                    $(id);

                if (element) {
                    element.textContent =
                        value;
                }
            }
        );


    const play =
        $("playButton");

    if (play) {
        play.textContent =
            game.installed
                ? "▶ PLAY"
                : "INSTALL";

        play.classList.toggle(
            "install-mode",
            !game.installed
        );
    }


    const favorite =
        $("favoriteButton");

    if (favorite) {
        favorite.textContent =
            isFavorite(game.id)
                ? "♥"
                : "♡";
    }


    const percent =
        achievementPercent(
            game
        );

    if ($("achievementCount")) {
        $("achievementCount")
            .textContent =
            `${game.achievementsUnlocked} / ${game.achievementsTotal}`;
    }

    if ($("achievementBar")) {
        $("achievementBar")
            .style
            .width =
            `${percent}%`;
    }

    if ($("achievementMessage")) {
        $("achievementMessage")
            .textContent =
            game.achievementsTotal > 0
                ? `${Math.round(percent)}% complete`
                : "Achievements will appear here for supported games.";
    }


    renderClientRating(
        game
    );


    const installed =
        Boolean(
            game.installed
        );

    [
        $("verifyButton"),
        $("openFolderButton"),
        $("uninstallButton")
    ].forEach(
        button => {
            if (button) {
                button.disabled =
                    !installed;
            }
        }
    );


    if ($("manageMessage")) {
        $("manageMessage")
            .textContent =
            installed
                ? "Manage this game's local installation through the Apex Games Client."
                : "Install this game before using installation management tools.";
    }


    const banner =
        $("gameBanner");

    if (banner) {
        banner.classList.toggle(
            "banner-dark",
            game.bannerAccent ===
                "dark"
        );
    }
}


/* =========================================================
   CLIENT RATING
========================================================= */

function renderClientRating(game) {
    const rating =
        getRating(
            game.id
        );

    document
        .querySelectorAll(
            "#starRating button"
        )
        .forEach(
            star => {
                const value =
                    Number(
                        star.dataset.rating
                    );

                star.textContent =
                    value <= rating
                        ? "★"
                        : "☆";
            }
        );


    if ($("ratingMessage")) {
        $("ratingMessage")
            .textContent =
            rating
                ? `You rated this game ${rating}/5`
                : "Not rated";
    }


    if ($("communityScore")) {
        $("communityScore")
            .textContent =
            game.communityScore ??
            "—";
    }


    if ($("ratingCount")) {
        $("ratingCount")
            .textContent =
            game.ratingCount > 0
                ? `${game.ratingCount} ratings`
                : "No ratings yet";
    }
}


/* =========================================================
   WEB FILTERING
========================================================= */

function getWebGames() {
    const query =
        webSearch
            .trim()
            .toLowerCase();

    return libraryGames.filter(
        game => {
            const matches =
                !query ||
                game.title
                    .toLowerCase()
                    .includes(query) ||
                game.developer
                    .toLowerCase()
                    .includes(query) ||
                game.genre
                    .toLowerCase()
                    .includes(query);

            if (!matches) {
                return false;
            }


            if (
                webFilter ===
                "favorites"
            ) {
                return isFavorite(
                    game.id
                );
            }


            if (
                webFilter ===
                "recent"
            ) {
                return Boolean(
                    game.lastPlayed
                );
            }


            return true;
        }
    );
}


/* =========================================================
   WEB GAME LIST
========================================================= */

function renderWebLibrary() {
    const list =
        $("webGameList");

    const count =
        $("webGameCount");

    const empty =
        $("webLibraryEmpty");


    if (!list) {
        return;
    }


    const games =
        getWebGames();


    if (count) {
        count.textContent =
            `${libraryGames.length} ${
                libraryGames.length === 1
                    ? "game"
                    : "games"
            }`;
    }


    list.innerHTML =
        "";


    if (empty) {
        empty.hidden =
            games.length !== 0;
    }


    games.forEach(
        game => {
            const favorite =
                isFavorite(
                    game.id
                );

            const unlocked =
                Number(
                    game.achievementsUnlocked
                ) || 0;

            const total =
                Number(
                    game.achievementsTotal
                ) || 0;

            const percent =
                achievementPercent(
                    game
                );


            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "web-game-card";

            card.innerHTML = `

                <div
                    class="web-game-art ${
                        game.bannerAccent === "dark"
                            ? "dark"
                            : ""
                    }"
                >

                    <div class="web-game-art-grid"></div>

                    <span class="web-game-art-letter">
                        ${escapeHTML(game.shortTitle)}
                    </span>

                </div>


                <div class="web-game-info">

                    <div class="web-game-title-row">

                        <h3>
                            ${escapeHTML(game.title)}
                        </h3>

                        ${
                            favorite
                                ? `
                                    <span
                                        class="web-game-favorite-indicator"
                                    >
                                        ♥
                                    </span>
                                `
                                : ""
                        }

                    </div>


                    <p class="web-game-developer">
                        ${escapeHTML(game.developer)}
                        ·
                        ${escapeHTML(game.genre)}
                    </p>


                    <div class="web-game-stats">

                        <div class="web-game-stat">
                            <span>
                                TOTAL PLAYED
                            </span>

                            <strong>
                                ${escapeHTML(
                                    formatPlaytime(
                                        game.playtimeMinutes
                                    )
                                )}
                            </strong>
                        </div>


                        <div class="web-game-stat">
                            <span>
                                LAST PLAYED
                            </span>

                            <strong>
                                ${escapeHTML(
                                    formatLastPlayed(
                                        game.lastPlayed
                                    )
                                )}
                            </strong>
                        </div>


                        <div class="web-game-stat">
                            <span>
                                ACHIEVEMENTS
                            </span>

                            <strong>
                                ${unlocked} / ${total}
                            </strong>

                            <div class="web-achievement-track">

                                <div
                                    class="web-achievement-fill"
                                    style="width:${percent}%"
                                ></div>

                            </div>
                        </div>


                        <div class="web-game-stat">
                            <span>
                                PLATFORM
                            </span>

                            <strong>
                                ${escapeHTML(game.platform)}
                            </strong>
                        </div>

                    </div>

                </div>


                <div class="web-game-actions">

                    <button
                        class="web-view-game-button"
                        type="button"
                    >
                        VIEW GAME →
                    </button>

                    <button
                        class="web-favorite-button ${
                            favorite
                                ? "active"
                                : ""
                        }"
                        type="button"
                    >
                        ${
                            favorite
                                ? "♥ FAVORITED"
                                : "♡ FAVORITE"
                        }
                    </button>

                </div>
            `;


            const buttons =
                card.querySelectorAll(
                    "button"
                );


            const viewButton =
                buttons[0];

            const favoriteWeb =
                buttons[1];


            viewButton.addEventListener(
                "click",
                () => {
                    selectedGameId =
                        game.id;

                    localStorage.setItem(
                        "apexLibrarySelectedGame",
                        game.id
                    );
                }
            );


            favoriteWeb.addEventListener(
                "click",
                () => {
                    toggleFavorite(
                        game.id
                    );

                    renderWebLibrary();
                    renderClientList();
                    renderSelectedGame();
                }
            );


            list.appendChild(
                card
            );
        }
    );
}


/* =========================================================
   CLIENT EVENT LISTENERS
========================================================= */

function setupClientEvents() {
    const search =
        $("librarySearch");

    if (search) {
        search.addEventListener(
            "input",
            () => {
                clientSearch =
                    search.value;

                renderClientList();
            }
        );
    }


    document
        .querySelectorAll(
            ".filter-button"
        )
        .forEach(
            button => {
                button.addEventListener(
                    "click",
                    () => {
                        clientFilter =
                            button.dataset.filter ||
                            "all";

                        document
                            .querySelectorAll(
                                ".filter-button"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );

                        button.classList.add(
                            "active"
                        );

                        renderClientList();
                    }
                );
            }
        );


    const favorite =
        $("favoriteButton");

    if (favorite) {
        favorite.addEventListener(
            "click",
            () => {
                const game =
                    selectedGame();

                if (!game) {
                    return;
                }

                toggleFavorite(
                    game.id
                );

                renderSelectedGame();
                renderClientList();
                renderWebLibrary();
            }
        );
    }


    document
        .querySelectorAll(
            "#starRating button"
        )
        .forEach(
            star => {
                star.addEventListener(
                    "click",
                    () => {
                        const game =
                            selectedGame();

                        if (!game) {
                            return;
                        }

                        saveRating(
                            game.id,
                            Number(
                                star.dataset.rating
                            )
                        );

                        renderClientRating(
                            game
                        );
                    }
                );
            }
        );


    const play =
        $("playButton");

    if (play) {
        play.addEventListener(
            "click",
            async () => {
                const game =
                    selectedGame();

                if (!game) {
                    return;
                }

                if (!hasClientBridge()) {
                    showClientMessage(
                        "Apex Games Client Required",
                        game.installed
                            ? `${game.title} requires the desktop client to launch.`
                            : `${game.title} requires the desktop client to install.`
                    );

                    return;
                }


                try {
                    if (
                        game.installed &&
                        typeof window
                            .ApexClient
                            .launchGame ===
                            "function"
                    ) {
                        await window
                            .ApexClient
                            .launchGame(
                                game.id
                            );

                        game.lastPlayed =
                            new Date()
                                .toISOString();
                    }

                    else if (
                        !game.installed &&
                        typeof window
                            .ApexClient
                            .installGame ===
                            "function"
                    ) {
                        await window
                            .ApexClient
                            .installGame(
                                game.id
                            );

                        game.installed =
                            true;
                    }

                    renderClientList();
                    renderSelectedGame();
                    renderWebLibrary();

                } catch (error) {
                    showClientMessage(
                        "Client Error",
                        error?.message ||
                        "The Apex Games Client could not complete this action."
                    );
                }
            }
        );
    }


    const dismiss =
        $("dismissClientMessage");

    if (dismiss) {
        dismiss.addEventListener(
            "click",
            hideClientMessage
        );
    }
}


/* =========================================================
   WEB EVENT LISTENERS
========================================================= */

function setupWebEvents() {
    const search =
        $("webLibrarySearch");

    if (search) {
        search.addEventListener(
            "input",
            () => {
                webSearch =
                    search.value;

                renderWebLibrary();
            }
        );
    }


    document
        .querySelectorAll(
            ".web-filter-button"
        )
        .forEach(
            button => {
                button.addEventListener(
                    "click",
                    () => {
                        webFilter =
                            button.dataset.webFilter ||
                            "all";


                        document
                            .querySelectorAll(
                                ".web-filter-button"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        button.classList.add(
                            "active"
                        );


                        renderWebLibrary();
                    }
                );
            }
        );
}


/* =========================================================
   PHASE 2 VIEW
========================================================= */

function showUnsupportedLibrary(
    deviceName = "ChromeOS"
) {
    const client =
        $("clientLibrary");

    const unsupported =
        $("unsupportedLibrary");

    if (client) {
        client.hidden =
            true;
    }

    if (unsupported) {
        unsupported.hidden =
            false;
    }

    if ($("unsupportedDeviceName")) {
        $("unsupportedDeviceName")
            .textContent =
            deviceName;
    }
}


/* =========================================================
   START
========================================================= */

async function startLibrary() {
    /*
        IMPORTANT:
        Render the library BEFORE waiting for Supabase.

        That way even if account/network loading has a
        problem, Your Games still works.
    */

    setupClientEvents();

    setupWebEvents();

    updateClientIndicator();

    renderClientList();

    renderSelectedGame();

    renderWebLibrary();

   const device =
    window.detectApexDevice
        ? window.detectApexDevice()
        : {
            deviceType: "unknown",
            os: "unknown",
            clientSupported: false
        };


const deviceName =
    window.getApexDeviceName
        ? window.getApexDeviceName(
            device
        )
        : "Unknown Device";


if (
    device.clientSupported
) {

    const client =
        $("clientLibrary");

    const unsupported =
        $("unsupportedLibrary");


    if (
        unsupported
    ) {

        unsupported.hidden =
            true;
    }


    if (
        client
    ) {

        client.hidden =
            false;
    }

} else {

    showUnsupportedLibrary(
        deviceName
    );
}


    /*
        Account loading is separate so a Supabase issue
        cannot break the actual Library.
    */

    await loadAccount();
}


startLibrary();

/* =========================================================
   APEX GAMES — CLIENT LIBRARY
========================================================= */


const DEFAULT_AVATAR =
    "Default Apex Games Profile Picture.png";


/* =========================================================
   GAME DATA

   TEMPORARY LOCAL DATA.

   Later this can come from:
   - Supabase ownership
   - Apex Games Store
   - Apex Games Client installation data
========================================================= */

const libraryGames = [

    {
        id:
            "apex-demo",

        title:
            "Apex Demo",

        shortTitle:
            "A",

        developer:
            "Apex Games",

        studio:
            "APEX GAMES",

        description:
            "Apex Demo is a temporary title used to preview the Apex Games Client Library experience. It demonstrates game installation, favorites, ratings, play history, achievements, and client management.",

        genre:
            "Action",

        release:
            "2026",

        platform:
            "Windows",

        version:
            "0.1.0",

        build:
            "1001",

        installSize:
            "1.8 GB",

        installed:
            true,

        playtimeMinutes:
            0,

        lastPlayed:
            null,

        achievementsUnlocked:
            0,

        achievementsTotal:
            0,

        communityScore:
            null,

        ratingCount:
            0,

        bannerAccent:
            "blue"
    },


    {
        id:
            "project-unknown",

        title:
            "Project Unknown",

        shortTitle:
            "P",

        developer:
            "Apex Games",

        studio:
            "APEX GAMES",

        description:
            "Project Unknown is a placeholder for a future Apex Games title. Games owned by your Apex Games Account will eventually appear automatically inside this library.",

        genre:
            "Adventure",

        release:
            "TBA",

        platform:
            "Windows",

        version:
            "Pre-Release",

        build:
            "—",

        installSize:
            "4.2 GB",

        installed:
            false,

        playtimeMinutes:
            0,

        lastPlayed:
            null,

        achievementsUnlocked:
            0,

        achievementsTotal:
            0,

        communityScore:
            null,

        ratingCount:
            0,

        bannerAccent:
            "dark"
    }

];


/* =========================================================
   DOM
========================================================= */

const loggedOutAccount =
    document.getElementById(
        "loggedOutAccount"
    );

const profileWidget =
    document.getElementById(
        "profileWidget"
    );

const profilePicture =
    document.getElementById(
        "profilePicture"
    );

const profileGamertag =
    document.getElementById(
        "profileGamertag"
    );


const gameList =
    document.getElementById(
        "gameList"
    );

const librarySearch =
    document.getElementById(
        "librarySearch"
    );

const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );

const libraryListEmpty =
    document.getElementById(
        "libraryListEmpty"
    );

const libraryGameCount =
    document.getElementById(
        "libraryGameCount"
    );


const selectedTitle =
    document.getElementById(
        "selectedTitle"
    );

const selectedStudio =
    document.getElementById(
        "selectedStudio"
    );

const selectedGenre =
    document.getElementById(
        "selectedGenre"
    );

const selectedRelease =
    document.getElementById(
        "selectedRelease"
    );

const aboutTitle =
    document.getElementById(
        "aboutTitle"
    );

const gameDescription =
    document.getElementById(
        "gameDescription"
    );

const gameBanner =
    document.getElementById(
        "gameBanner"
    );


const playButton =
    document.getElementById(
        "playButton"
    );

const favoriteButton =
    document.getElementById(
        "favoriteButton"
    );

const playtime =
    document.getElementById(
        "playtime"
    );

const lastPlayed =
    document.getElementById(
        "lastPlayed"
    );

const installSize =
    document.getElementById(
        "installSize"
    );


const gameDeveloper =
    document.getElementById(
        "gameDeveloper"
    );

const gameStatus =
    document.getElementById(
        "gameStatus"
    );

const gamePlatform =
    document.getElementById(
        "gamePlatform"
    );

const gameVersion =
    document.getElementById(
        "gameVersion"
    );

const gameBuild =
    document.getElementById(
        "gameBuild"
    );


const achievementCount =
    document.getElementById(
        "achievementCount"
    );

const achievementBar =
    document.getElementById(
        "achievementBar"
    );

const achievementMessage =
    document.getElementById(
        "achievementMessage"
    );


const stars =
    document.querySelectorAll(
        "#starRating button"
    );

const ratingMessage =
    document.getElementById(
        "ratingMessage"
    );

const communityScore =
    document.getElementById(
        "communityScore"
    );

const ratingCount =
    document.getElementById(
        "ratingCount"
    );


const verifyButton =
    document.getElementById(
        "verifyButton"
    );

const openFolderButton =
    document.getElementById(
        "openFolderButton"
    );

const uninstallButton =
    document.getElementById(
        "uninstallButton"
    );

const manageMessage =
    document.getElementById(
        "manageMessage"
    );


const clientActionMessage =
    document.getElementById(
        "clientActionMessage"
    );

const clientMessageTitle =
    document.getElementById(
        "clientMessageTitle"
    );

const clientMessageText =
    document.getElementById(
        "clientMessageText"
    );

const dismissClientMessage =
    document.getElementById(
        "dismissClientMessage"
    );

const clientConnectionText =
    document.getElementById(
        "clientConnectionText"
    );


/* =========================================================
   STATE
========================================================= */

let currentUser =
    null;

let selectedGameId =
    localStorage.getItem(
        "apexLibrarySelectedGame"
    ) ||
    libraryGames[0]?.id ||
    null;


let currentFilter =
    "all";


let currentSearch =
    "";


/* =========================================================
   STORAGE HELPERS
========================================================= */

function getFavoriteIds() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "apexLibraryFavorites"
                ) ||
                "[]"
            );


        return Array.isArray(saved)
            ? saved
            : [];

    } catch {

        return [];
    }
}


function saveFavoriteIds(
    ids
) {

    localStorage.setItem(
        "apexLibraryFavorites",
        JSON.stringify(ids)
    );
}


function isFavorite(
    gameId
) {

    return getFavoriteIds()
        .includes(
            gameId
        );
}


function toggleFavorite(
    gameId
) {

    const favorites =
        getFavoriteIds();


    const index =
        favorites.indexOf(
            gameId
        );


    if (
        index >=
        0
    ) {

        favorites.splice(
            index,
            1
        );

    } else {

        favorites.push(
            gameId
        );
    }


    saveFavoriteIds(
        favorites
    );
}


function getRating(
    gameId
) {

    const value =
        Number(
            localStorage.getItem(
                `apexLibraryRating:${gameId}`
            )
        );


    if (
        value >= 1 &&
        value <= 5
    ) {

        return value;
    }


    return 0;
}


function saveRating(
    gameId,
    rating
) {

    localStorage.setItem(
        `apexLibraryRating:${gameId}`,
        String(rating)
    );
}


/* =========================================================
   CLIENT BRIDGE

   Later the real Apex desktop application can inject:

   window.ApexClient = {
       installGame(id),
       launchGame(id),
       uninstallGame(id),
       verifyGame(id),
       openGameFolder(id)
   }

   The website does NOT pretend it can perform native
   installation by itself.
========================================================= */

function hasNativeClientBridge() {

    return Boolean(
        window.ApexClient &&
        typeof window.ApexClient ===
            "object"
    );
}


function updateClientIndicator() {

    if (
        !clientConnectionText
    ) {

        return;
    }


    if (
        hasNativeClientBridge()
    ) {

        clientConnectionText.textContent =
            "Connected";

        document.body.classList.add(
            "client-connected"
        );

    } else {

        clientConnectionText.textContent =
            "Web preview mode";

        document.body.classList.remove(
            "client-connected"
        );
    }
}


/* =========================================================
   CLIENT MESSAGE
========================================================= */

function showClientMessage(
    title,
    message
) {

    if (
        !clientActionMessage
    ) {

        return;
    }


    clientMessageTitle.textContent =
        title;


    clientMessageText.textContent =
        message;


    clientActionMessage.hidden =
        false;
}


function hideClientMessage() {

    if (
        clientActionMessage
    ) {

        clientActionMessage.hidden =
            true;
    }
}


if (
    dismissClientMessage
) {

    dismissClientMessage.addEventListener(
        "click",
        hideClientMessage
    );
}


/* =========================================================
   AUTH / ACCOUNT
========================================================= */

async function loadAccount() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        return;
    }


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

        currentUser =
            null;


        if (
            loggedOutAccount
        ) {

            loggedOutAccount.hidden =
                false;
        }


        if (
            profileWidget
        ) {

            profileWidget.hidden =
                true;
        }


        return;
    }


    currentUser =
        session.user;


    if (
        loggedOutAccount
    ) {

        loggedOutAccount.hidden =
            true;
    }


    if (
        profileWidget
    ) {

        profileWidget.hidden =
            false;
    }


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
                avatar_url
            `)
            .eq(
                "id",
                currentUser.id
            )
            .maybeSingle();


    if (
        error ||
        !profile
    ) {

        return;
    }


    if (
        profileGamertag
    ) {

        profileGamertag.textContent =
            profile.gamertag ||
            "Player";
    }


    if (
        profilePicture
    ) {

        profilePicture.src =
            profile.avatar_url ||
            DEFAULT_AVATAR;


        profilePicture.onerror =
            () => {

                profilePicture.onerror =
                    null;

                profilePicture.src =
                    DEFAULT_AVATAR;
            };
    }
}


/* =========================================================
   GAME HELPERS
========================================================= */

function findGame(
    gameId
) {

    return libraryGames.find(
        game =>
            game.id ===
            gameId
    ) || null;
}


function selectedGame() {

    return findGame(
        selectedGameId
    );
}


function formatPlaytime(
    minutes
) {

    const total =
        Number(minutes) ||
        0;


    if (
        total <
        60
    ) {

        return total === 1
            ? "1 minute"
            : `${total} minutes`;
    }


    const hours =
        total /
        60;


    if (
        Number.isInteger(
            hours
        )
    ) {

        return `${hours} ${
            hours === 1
                ? "hour"
                : "hours"
        }`;
    }


    return `${hours.toFixed(1)} hours`;
}


function formatLastPlayed(
    value
) {

    if (
        !value
    ) {

        return "Never";
    }


    const date =
        new Date(
            value
        );


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
            month:
                "short",

            day:
                "numeric",

            year:
                "numeric"
        }
    );
}


/* =========================================================
   FILTERING
========================================================= */

function getVisibleGames() {

    const query =
        currentSearch
            .trim()
            .toLowerCase();


    return libraryGames.filter(
        game => {

            const matchesSearch =
                !query ||
                game.title
                    .toLowerCase()
                    .includes(
                        query
                    ) ||
                game.developer
                    .toLowerCase()
                    .includes(
                        query
                    );


            if (
                !matchesSearch
            ) {

                return false;
            }


            switch (
                currentFilter
            ) {

                case "installed":

                    return game.installed;


                case "favorites":

                    return isFavorite(
                        game.id
                    );


                case "recent":

                    return Boolean(
                        game.lastPlayed
                    );


                default:

                    return true;
            }
        }
    );
}


/* =========================================================
   RENDER GAME LIST
========================================================= */

function renderGameList() {

    if (
        !gameList
    ) {

        return;
    }


    const visibleGames =
        getVisibleGames();


    gameList.innerHTML =
        "";


    if (
        libraryGameCount
    ) {

        const count =
            libraryGames.length;


        libraryGameCount.textContent =
            `${count} ${
                count === 1
                    ? "game"
                    : "games"
            }`;
    }


    if (
        libraryListEmpty
    ) {

        libraryListEmpty.hidden =
            visibleGames.length >
            0;
    }


    visibleGames.forEach(
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


            button.dataset.gameId =
                game.id;


            button.innerHTML = `

                <div class="game-list-icon">
                    ${game.shortTitle}
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
                                        title="Favorite"
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

                    selectGame(
                        game.id
                    );
                }
            );


            gameList.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   SAFE HTML
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


/* =========================================================
   SELECT GAME
========================================================= */

function selectGame(
    gameId
) {

    const game =
        findGame(
            gameId
        );


    if (
        !game
    ) {

        return;
    }


    selectedGameId =
        game.id;


    localStorage.setItem(
        "apexLibrarySelectedGame",
        game.id
    );


    renderGameList();
    renderSelectedGame();
}


/* =========================================================
   RENDER SELECTED GAME
========================================================= */

function renderSelectedGame() {

    const game =
        selectedGame();


    if (
        !game
    ) {

        return;
    }


    selectedTitle.textContent =
        game.title;


    selectedStudio.textContent =
        game.studio;


    selectedGenre.textContent =
        game.genre;


    selectedRelease.textContent =
        game.release;


    aboutTitle.textContent =
        game.title;


    gameDescription.textContent =
        game.description;


    gameDeveloper.textContent =
        game.developer;


    gamePlatform.textContent =
        game.platform;


    gameVersion.textContent =
        game.version;


    gameBuild.textContent =
        game.build;


    installSize.textContent =
        game.installSize;


    gameStatus.textContent =
        game.installed
            ? "Installed"
            : "Not Installed";


    playtime.textContent =
        formatPlaytime(
            game.playtimeMinutes
        );


    lastPlayed.textContent =
        formatLastPlayed(
            game.lastPlayed
        );


    playButton.textContent =
        game.installed
            ? "▶ PLAY"
            : "INSTALL";


    playButton.classList.toggle(
        "install-mode",
        !game.installed
    );


    const favorite =
        isFavorite(
            game.id
        );


    favoriteButton.textContent =
        favorite
            ? "♥"
            : "♡";


    favoriteButton.title =
        favorite
            ? "Remove from Favorites"
            : "Add to Favorites";


    favoriteButton.setAttribute(
        "aria-label",
        favoriteButton.title
    );


    renderAchievements(
        game
    );


    renderRating(
        game
    );


    renderManagement(
        game
    );


    renderBannerAccent(
        game
    );
}


/* =========================================================
   BANNER STYLE
========================================================= */

function renderBannerAccent(
    game
) {

    if (
        !gameBanner
    ) {

        return;
    }


    gameBanner.classList.remove(
        "banner-blue",
        "banner-dark"
    );


    gameBanner.classList.add(
        game.bannerAccent ===
            "dark"
            ? "banner-dark"
            : "banner-blue"
    );
}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function renderAchievements(
    game
) {

    const unlocked =
        Number(
            game.achievementsUnlocked
        ) ||
        0;


    const total =
        Number(
            game.achievementsTotal
        ) ||
        0;


    achievementCount.textContent =
        `${unlocked} / ${total}`;


    const percent =
        total > 0
            ? Math.min(
                100,
                Math.max(
                    0,
                    (
                        unlocked /
                        total
                    ) *
                    100
                )
            )
            : 0;


    achievementBar.style.width =
        `${percent}%`;


    achievementMessage.textContent =
        total > 0
            ? `${Math.round(percent)}% complete`
            : "Achievements will appear here for supported games.";
}


/* =========================================================
   RATINGS
========================================================= */

function renderRating(
    game
) {

    const personalRating =
        getRating(
            game.id
        );


    stars.forEach(
        star => {

            const value =
                Number(
                    star.dataset.rating
                );


            star.textContent =
                value <=
                personalRating
                    ? "★"
                    : "☆";
        }
    );


    ratingMessage.textContent =
        personalRating > 0
            ? `You rated this game ${personalRating}/5`
            : "Not rated";


    communityScore.textContent =
        game.communityScore ??
        "—";


    ratingCount.textContent =
        game.ratingCount > 0
            ? `${game.ratingCount.toLocaleString()} ratings`
            : "No ratings yet";
}


stars.forEach(
    star => {

        star.addEventListener(
            "click",
            () => {

                const game =
                    selectedGame();


                if (
                    !game
                ) {

                    return;
                }


                const rating =
                    Number(
                        star.dataset.rating
                    );


                saveRating(
                    game.id,
                    rating
                );


                renderRating(
                    game
                );
            }
        );
    }
);


/* =========================================================
   FAVORITE
========================================================= */

favoriteButton.addEventListener(
    "click",
    () => {

        const game =
            selectedGame();


        if (
            !game
        ) {

            return;
        }


        toggleFavorite(
            game.id
        );


        renderGameList();
        renderSelectedGame();
    }
);


/* =========================================================
   SEARCH
========================================================= */

librarySearch.addEventListener(
    "input",
    () => {

        currentSearch =
            librarySearch.value;


        renderGameList();
    }
);


/* =========================================================
   FILTERS
========================================================= */

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                currentFilter =
                    button.dataset.filter ||
                    "all";


                filterButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );
                    }
                );


                button.classList.add(
                    "active"
                );


                renderGameList();
            }
        );
    }
);


/* =========================================================
   PLAY / INSTALL
========================================================= */

playButton.addEventListener(
    "click",
    async () => {

        const game =
            selectedGame();


        if (
            !game
        ) {

            return;
        }


        if (
            game.installed
        ) {

            await launchSelectedGame(
                game
            );

        } else {

            await installSelectedGame(
                game
            );
        }
    }
);


/* =========================================================
   INSTALL
========================================================= */

async function installSelectedGame(
    game
) {

    if (
        hasNativeClientBridge() &&
        typeof window.ApexClient.installGame ===
            "function"
    ) {

        try {

            showClientMessage(
                "Installing",
                `Preparing ${game.title}...`
            );


            await window.ApexClient.installGame(
                game.id
            );


            game.installed =
                true;


            showClientMessage(
                "Installation Complete",
                `${game.title} is ready to play.`
            );


            renderGameList();
            renderSelectedGame();


            return;

        } catch (
            error
        ) {

            console.error(
                "Install failed:",
                error
            );


            showClientMessage(
                "Installation Failed",
                error?.message ||
                `Apex Games could not install ${game.title}.`
            );


            return;
        }
    }


    showClientMessage(
        "Apex Games Client Required",
        `Installing ${game.title} requires the desktop Apex Games Client. The browser Library is currently running in preview mode.`
    );
}


/* =========================================================
   LAUNCH
========================================================= */

async function launchSelectedGame(
    game
) {

    if (
        hasNativeClientBridge() &&
        typeof window.ApexClient.launchGame ===
            "function"
    ) {

        try {

            await window.ApexClient.launchGame(
                game.id
            );


            game.lastPlayed =
                new Date()
                    .toISOString();


            renderGameList();
            renderSelectedGame();


            return;

        } catch (
            error
        ) {

            console.error(
                "Launch failed:",
                error
            );


            showClientMessage(
                "Unable to Launch",
                error?.message ||
                `Apex Games could not launch ${game.title}.`
            );


            return;
        }
    }


    showClientMessage(
        "Apex Games Client Required",
        `${game.title} is installed in this Library preview, but native game launching requires the Apex Games desktop client.`
    );
}


/* =========================================================
   MANAGEMENT
========================================================= */

function renderManagement(
    game
) {

    const installed =
        Boolean(
            game.installed
        );


    verifyButton.disabled =
        !installed;


    openFolderButton.disabled =
        !installed;


    uninstallButton.disabled =
        !installed;


    manageMessage.textContent =
        installed
            ? "Manage this game's local installation through the Apex Games Client."
            : "Install this game before using installation management tools.";
}


/* =========================================================
   VERIFY FILES
========================================================= */

verifyButton.addEventListener(
    "click",
    async () => {

        const game =
            selectedGame();


        if (
            !game?.installed
        ) {

            return;
        }


        if (
            hasNativeClientBridge() &&
            typeof window.ApexClient.verifyGame ===
                "function"
        ) {

            try {

                showClientMessage(
                    "Verifying Files",
                    `Checking ${game.title}...`
                );


                await window.ApexClient.verifyGame(
                    game.id
                );


                showClientMessage(
                    "Verification Complete",
                    `${game.title} passed file verification.`
                );


                return;

            } catch (
                error
            ) {

                showClientMessage(
                    "Verification Failed",
                    error?.message ||
                    "Apex Games could not verify this installation."
                );


                return;
            }
        }


        showClientMessage(
            "Apex Games Client Required",
            "File verification is available through the desktop client."
        );
    }
);


/* =========================================================
   OPEN FOLDER
========================================================= */

openFolderButton.addEventListener(
    "click",
    async () => {

        const game =
            selectedGame();


        if (
            !game?.installed
        ) {

            return;
        }


        if (
            hasNativeClientBridge() &&
            typeof window.ApexClient.openGameFolder ===
                "function"
        ) {

            try {

                await window.ApexClient.openGameFolder(
                    game.id
                );


                return;

            } catch (
                error
            ) {

                showClientMessage(
                    "Unable to Open Folder",
                    error?.message ||
                    "Apex Games could not open the installation folder."
                );


                return;
            }
        }


        showClientMessage(
            "Apex Games Client Required",
            "Browsing local game files is available through the desktop client."
        );
    }
);


/* =========================================================
   UNINSTALL
========================================================= */

uninstallButton.addEventListener(
    "click",
    async () => {

        const game =
            selectedGame();


        if (
            !game?.installed
        ) {

            return;
        }


        if (
            hasNativeClientBridge() &&
            typeof window.ApexClient.uninstallGame ===
                "function"
        ) {

            try {

                await window.ApexClient.uninstallGame(
                    game.id
                );


                game.installed =
                    false;


                showClientMessage(
                    "Game Uninstalled",
                    `${game.title} has been removed from this device.`
                );


                renderGameList();
                renderSelectedGame();


                return;

            } catch (
                error
            ) {

                showClientMessage(
                    "Uninstall Failed",
                    error?.message ||
                    `Apex Games could not uninstall ${game.title}.`
                );


                return;
            }
        }


        showClientMessage(
            "Apex Games Client Required",
            "Uninstalling native games is available through the desktop client."
        );
    }
);


/* =========================================================
   START
========================================================= */

async function startLibrary() {

    updateClientIndicator();


    await loadAccount();


    if (
        !findGame(
            selectedGameId
        )
    ) {

        selectedGameId =
            libraryGames[0]?.id ||
            null;
    }


    renderGameList();
    renderSelectedGame();
}


startLibrary();

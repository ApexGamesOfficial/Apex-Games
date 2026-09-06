/* =========================================================
   APEX GAMES STORE v0.1
========================================================= */

const DEFAULT_AVATAR =
    "Default Apex Games Profile Picture.png";



/* =========================================================
   STORE DATA
========================================================= */

const STORE_GAMES = [

    {
        id: "apex-demo",

        title: "Apex Demo",

        bannerTitle: "APEX DEMO",

        developer: "Apex Games",

        description:
            "Step into the Apex ecosystem with the official Apex Games demonstration title.",

        genre: "Action",

        release: "2026",

        platform: "Windows",

        status: "Available",

        accent: "blue",

        filters: [
            "action"
        ],

        tags: [
            "Action",
            "Windows",
            "Apex Games"
        ]
    },


    {
        id: "project-unknown",

        title: "Project Unknown",

        bannerTitle:
            "PROJECT UNKNOWN",

        developer:
            "Apex Games",

        description:
            "An upcoming Apex Games adventure currently in development. More information will be revealed in the future.",

        genre:
            "Adventure",

        release:
            "TBA",

        platform:
            "Windows",

        status:
            "Coming Soon",

        accent:
            "dark",

        filters: [
            "adventure",
            "coming-soon"
        ],

        tags: [
            "Adventure",
            "Windows",
            "Coming Soon"
        ]
    }

];



/* =========================================================
   ELEMENTS
========================================================= */

const storeSearch =
    document.getElementById(
        "storeSearch"
    );

const clearSearchButton =
    document.getElementById(
        "clearSearchButton"
    );

const filters =
    document.getElementById(
        "filters"
    );

const gameGrid =
    document.getElementById(
        "gameGrid"
    );

const resultCount =
    document.getElementById(
        "resultCount"
    );

const storeEmpty =
    document.getElementById(
        "storeEmpty"
    );

const resetStoreButton =
    document.getElementById(
        "resetStoreButton"
    );


const gameModal =
    document.getElementById(
        "gameModal"
    );

const modalBackdrop =
    document.getElementById(
        "modalBackdrop"
    );

const modalClose =
    document.getElementById(
        "modalClose"
    );

const modalBanner =
    document.getElementById(
        "modalBanner"
    );

const modalBannerTitle =
    document.getElementById(
        "modalBannerTitle"
    );

const modalDeveloper =
    document.getElementById(
        "modalDeveloper"
    );

const modalRelease =
    document.getElementById(
        "modalRelease"
    );

const modalGameTitle =
    document.getElementById(
        "modalGameTitle"
    );

const modalDescription =
    document.getElementById(
        "modalDescription"
    );

const modalTags =
    document.getElementById(
        "modalTags"
    );

const modalPlatform =
    document.getElementById(
        "modalPlatform"
    );

const modalReleaseInfo =
    document.getElementById(
        "modalReleaseInfo"
    );

const modalDeveloperInfo =
    document.getElementById(
        "modalDeveloperInfo"
    );


const accountAvatar =
    document.getElementById(
        "accountAvatar"
    );

const accountGamertag =
    document.getElementById(
        "accountGamertag"
    );

const accountPresence =
    document.getElementById(
        "accountPresence"
    );



/* =========================================================
   STATE
========================================================= */

let activeFilter =
    "all";

let currentUser =
    null;



/* =========================================================
   START
========================================================= */

async function startStore() {

    renderStore();


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

            setAvatar(
                accountAvatar,
                null
            );


            accountGamertag.textContent =
                "Sign In";


            return;
        }


        currentUser =
            session.user;


        await loadAccount();


        updateAccountPresence();

    } catch (error) {

        console.error(
            "Unable to load Store account:",
            error
        );
    }
}



/* =========================================================
   ACCOUNT
========================================================= */

async function loadAccount() {

    const {
        data: profile,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(`
                gamertag,
                avatar_url
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


    accountGamertag.textContent =
        profile.gamertag ||
        "Account";


    setAvatar(
        accountAvatar,
        profile.avatar_url
    );
}


function setAvatar(
    image,
    url
) {

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
   PRESENCE
========================================================= */

function updateAccountPresence() {

    if (
        !currentUser ||
        typeof window.getLiveStatus !==
            "function"
    ) {

        return;
    }


    const status =
        window.getLiveStatus(
            currentUser.id
        );


    accountPresence.className =
        `account-presence ${
            status === "online"
                ? "online"
                : "offline"
        }`;
}


window.addEventListener(
    "apex-presence-updated",
    updateAccountPresence
);



/* =========================================================
   RENDER STORE
========================================================= */

function renderStore() {

    const search =
        storeSearch
            .value
            .trim()
            .toLowerCase();


    const games =
        STORE_GAMES.filter(
            game => {

                const matchesFilter =
                    activeFilter === "all" ||
                    game.filters.includes(
                        activeFilter
                    );


                const searchable =
                    [
                        game.title,
                        game.developer,
                        game.description,
                        game.genre,
                        game.platform,
                        game.release,
                        ...game.tags
                    ]
                        .join(" ")
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchable.includes(
                        search
                    );


                return (
                    matchesFilter &&
                    matchesSearch
                );
            }
        );


    gameGrid.innerHTML =
        "";


    games.forEach(
        game => {

            gameGrid.appendChild(
                createGameCard(
                    game
                )
            );
        }
    );


    resultCount.textContent =
        `${games.length} ${
            games.length === 1
                ? "game"
                : "games"
        }`;


    storeEmpty.hidden =
        games.length !== 0;


    gameGrid.hidden =
        games.length === 0;


    clearSearchButton.hidden =
        storeSearch.value.length ===
        0;
}



/* =========================================================
   GAME CARD
========================================================= */

function createGameCard(
    game
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "game-card";


    card.dataset.accent =
        game.accent;


    card.tabIndex =
        0;


    card.setAttribute(
        "role",
        "button"
    );


    card.setAttribute(
        "aria-label",
        `View ${game.title}`
    );


    const banner =
        document.createElement(
            "div"
        );


    banner.className =
        "game-card-banner";


    const logo =
        document.createElement(
            "img"
        );


    logo.src =
        "apex-logo.png";


    logo.alt =
        "";


    const bannerTitle =
        document.createElement(
            "span"
        );


    bannerTitle.className =
        "game-card-banner-title";


    bannerTitle.textContent =
        game.bannerTitle;


    const status =
        document.createElement(
            "span"
        );


    status.className =
        "game-status";


    status.textContent =
        game.status;


    banner.append(
        logo,
        bannerTitle,
        status
    );


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "game-card-content";


    const developer =
        document.createElement(
            "span"
        );


    developer.className =
        "game-developer";


    developer.textContent =
        game.developer;


    const title =
        document.createElement(
            "h3"
        );


    title.className =
        "game-title";


    title.textContent =
        game.title;


    const footer =
        document.createElement(
            "div"
        );


    footer.className =
        "game-card-footer";


    const genre =
        document.createElement(
            "span"
        );


    genre.className =
        "game-genre";


    genre.textContent =
        game.genre;


    const release =
        document.createElement(
            "span"
        );


    release.className =
        "game-release";


    release.textContent =
        game.release;


    footer.append(
        genre,
        release
    );


    content.append(
        developer,
        title,
        footer
    );


    card.append(
        banner,
        content
    );


    card.addEventListener(
        "click",
        () => {

            openGame(
                game.id
            );
        }
    );


    card.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();


                openGame(
                    game.id
                );
            }
        }
    );


    return card;
}



/* =========================================================
   FILTERS
========================================================= */

filters.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".filter"
            );


        if (!button) {
            return;
        }


        activeFilter =
            button.dataset.filter;


        document
            .querySelectorAll(
                ".filter"
            )
            .forEach(
                item => {

                    item.classList.toggle(
                        "active",
                        item === button
                    );
                }
            );


        renderStore();
    }
);



/* =========================================================
   SEARCH
========================================================= */

storeSearch.addEventListener(
    "input",
    renderStore
);


clearSearchButton.addEventListener(
    "click",
    () => {

        storeSearch.value =
            "";


        storeSearch.focus();


        renderStore();
    }
);



/* =========================================================
   RESET
========================================================= */

resetStoreButton.addEventListener(
    "click",
    () => {

        activeFilter =
            "all";


        storeSearch.value =
            "";


        document
            .querySelectorAll(
                ".filter"
            )
            .forEach(
                button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.filter ===
                            "all"
                    );
                }
            );


        renderStore();
    }
);



/* =========================================================
   GAME DETAILS
========================================================= */

function openGame(
    gameId
) {

    const game =
        STORE_GAMES.find(
            item =>
                item.id ===
                gameId
        );


    if (!game) {
        return;
    }


    modalBanner.classList.toggle(
        "dark",
        game.accent ===
            "dark"
    );


    modalBannerTitle.textContent =
        game.bannerTitle;


    modalDeveloper.textContent =
        game.developer;


    modalRelease.textContent =
        game.release;


    modalGameTitle.textContent =
        game.title;


    modalDescription.textContent =
        game.description;


    modalPlatform.textContent =
        game.platform;


    modalReleaseInfo.textContent =
        game.release;


    modalDeveloperInfo.textContent =
        game.developer;


    modalTags.innerHTML =
        "";


    game.tags.forEach(
        tag => {

            const element =
                document.createElement(
                    "span"
                );


            element.textContent =
                tag;


            modalTags.appendChild(
                element
            );
        }
    );


    gameModal.hidden =
        false;


    document.body.style.overflow =
        "hidden";


    modalClose.focus();
}


function closeGame() {

    gameModal.hidden =
        true;


    document.body.style.overflow =
        "";
}



/* =========================================================
   FEATURED BUTTON
========================================================= */

document
    .querySelectorAll(
        "[data-open-game]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    openGame(
                        button.dataset.openGame
                    );
                }
            );
        }
    );



/* =========================================================
   MODAL EVENTS
========================================================= */

modalClose.addEventListener(
    "click",
    closeGame
);


modalBackdrop.addEventListener(
    "click",
    closeGame
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !gameModal.hidden
        ) {

            closeGame();
        }
    }
);



/* =========================================================
   GO
========================================================= */

startStore();

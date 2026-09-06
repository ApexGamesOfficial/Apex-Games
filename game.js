/* =========================================================
   APEX GAMES
   GAME PAGE v0.1
========================================================= */


/* =========================================================
   GAME DATABASE

   Later this can be moved into a shared games-data.js file
   so Store + Game + Library all use one catalog.
========================================================= */

const APEX_GAME_CATALOG = {

    "apex-demo": {

        id: "apex-demo",

        title: "Apex Demo",

        artTitle: "APEX DEMO",

        developer: "Apex Games",

        publisher: "Apex Games",

        description:
            "Enter the Apex Games ecosystem with the official demonstration experience.",

        about:
            "Apex Demo is the official demonstration title for the Apex Games platform. It is designed to showcase the Apex Games ecosystem and eventually demonstrate the complete journey from discovering a game in the Store to owning it in your Library and launching it through the Apex Games Client.",

        genre: "Action",

        tags: [
            "Action",
            "Singleplayer",
            "Apex Games"
        ],

        release: "2026",

        platform: "Windows",

        status: "Demo",

        price: "Free",

        accent: "blue",

        features: [

            {
                title: "Apex Games Integration",

                description:
                    "Built as an official demonstration of the Apex Games ecosystem."
            },

            {
                title: "Singleplayer",

                description:
                    "Experience the demonstration as a standalone player."
            },

            {
                title: "Windows Client",

                description:
                    "Designed for the future Apex Games Windows Client."
            },

            {
                title: "Library Support",

                description:
                    "Built to connect with the Apex Games Library ownership system."
            }

        ]

    },


    "project-unknown": {

        id: "project-unknown",

        title: "Project Unknown",

        artTitle: "PROJECT UNKNOWN",

        developer: "Apex Games",

        publisher: "Apex Games",

        description:
            "An upcoming Apex Games adventure currently in development.",

        about:
            "Project Unknown is an upcoming title from Apex Games. More information about the project, its world, gameplay, release window, and features will be revealed as development continues.",

        genre: "Adventure",

        tags: [
            "Adventure",
            "Singleplayer",
            "Coming Soon"
        ],

        release: "TBA",

        platform: "Windows",

        status: "Coming Soon",

        price: "TBA",

        accent: "dark",

        features: [

            {
                title: "Adventure",

                description:
                    "An upcoming adventure experience from Apex Games."
            },

            {
                title: "Singleplayer",

                description:
                    "Designed around a focused singleplayer experience."
            },

            {
                title: "In Development",

                description:
                    "Project Unknown is actively being developed."
            },

            {
                title: "More Coming Soon",

                description:
                    "Additional information will be revealed in the future."
            }

        ]

    }

};


/* =========================================================
   ELEMENTS
========================================================= */

const gameDeveloper =
    document.getElementById("gameDeveloper");

const gameTitle =
    document.getElementById("gameTitle");

const headingTags =
    document.getElementById("headingTags");

const gameHeroArt =
    document.getElementById("gameHeroArt");

const heroGameTitle =
    document.getElementById("heroGameTitle");

const summaryArt =
    document.getElementById("summaryArt");

const summaryTitle =
    document.getElementById("summaryTitle");

const summaryDescription =
    document.getElementById("summaryDescription");

const summaryDeveloper =
    document.getElementById("summaryDeveloper");

const summaryPublisher =
    document.getElementById("summaryPublisher");

const summaryRelease =
    document.getElementById("summaryRelease");

const summaryPlatform =
    document.getElementById("summaryPlatform");

const gameTags =
    document.getElementById("gameTags");

const purchaseTitle =
    document.getElementById("purchaseTitle");

const purchaseDescription =
    document.getElementById("purchaseDescription");

const gamePrice =
    document.getElementById("gamePrice");

const acquireButton =
    document.getElementById("acquireButton");

const acquireNotice =
    document.getElementById("acquireNotice");

const aboutTitle =
    document.getElementById("aboutTitle");

const aboutDescription =
    document.getElementById("aboutDescription");

const featureGrid =
    document.getElementById("featureGrid");

const infoTitle =
    document.getElementById("infoTitle");

const infoGenre =
    document.getElementById("infoGenre");

const infoDeveloper =
    document.getElementById("infoDeveloper");

const infoPublisher =
    document.getElementById("infoPublisher");

const infoRelease =
    document.getElementById("infoRelease");

const infoPlatform =
    document.getElementById("infoPlatform");

const gameNotFound =
    document.getElementById("gameNotFound");

const screenshotButtons =
    document.querySelectorAll(".screenshot-card");


/* =========================================================
   SAFE TEXT
========================================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   GAME ID
========================================================= */

function getGameId() {

    const params =
        new URLSearchParams(window.location.search);

    return params.get("id");

}


/* =========================================================
   TAGS
========================================================= */

function renderTags(tags = []) {

    const html =
        tags
            .map(
                tag =>
                    `<span class="game-tag">${escapeHTML(tag)}</span>`
            )
            .join("");

    headingTags.innerHTML = html;

    gameTags.innerHTML = html;

}


/* =========================================================
   FEATURES
========================================================= */

function renderFeatures(features = []) {

    featureGrid.innerHTML =
        features
            .map(
                (feature, index) => `

                    <article class="feature-card">

                        <span class="feature-number">
                            ${String(index + 1).padStart(2, "0")}
                        </span>

                        <strong>
                            ${escapeHTML(feature.title)}
                        </strong>

                        <p>
                            ${escapeHTML(feature.description)}
                        </p>

                    </article>

                `
            )
            .join("");

}


/* =========================================================
   GAME PAGE
========================================================= */

function renderGame(game) {

    document.title =
        `${game.title} | Apex Games`;


    /* Heading */

    gameDeveloper.textContent =
        game.developer;

    gameTitle.textContent =
        game.title;


    /* Hero */

    heroGameTitle.textContent =
        game.artTitle || game.title;

    summaryTitle.textContent =
        game.artTitle || game.title;


    if (game.accent === "dark") {

        gameHeroArt.classList.add("dark");

        summaryArt.classList.add("dark");

    }


    /* Summary */

    summaryDescription.textContent =
        game.description;

    summaryDeveloper.textContent =
        game.developer;

    summaryPublisher.textContent =
        game.publisher;

    summaryRelease.textContent =
        game.release;

    summaryPlatform.textContent =
        game.platform;


    /* Purchase */

    purchaseTitle.textContent =
        game.status === "Coming Soon"
            ? `${game.title} is coming soon`
            : `Get ${game.title}`;


    purchaseDescription.textContent =
        game.status === "Coming Soon"
            ? "This title is not currently available."
            : "Add this title to your Apex Games Library.";


    gamePrice.textContent =
        game.price;


    if (game.status === "Coming Soon") {

        acquireButton.textContent =
            "Coming Soon";

        acquireButton.disabled =
            true;

    } else {

        acquireButton.textContent =
            "Add to Library";

        acquireButton.disabled =
            false;

    }


    /* About */

    aboutTitle.textContent =
        `About ${game.title}`;

    aboutDescription.textContent =
        game.about;


    /* Details */

    infoTitle.textContent =
        game.title;

    infoGenre.textContent =
        game.genre;

    infoDeveloper.textContent =
        game.developer;

    infoPublisher.textContent =
        game.publisher;

    infoRelease.textContent =
        game.release;

    infoPlatform.textContent =
        game.platform;


    renderTags(game.tags);

    renderFeatures(game.features);

}


/* =========================================================
   NOT FOUND
========================================================= */

function showNotFound() {

    const pageSections = [
        document.querySelector(".game-back-row"),
        document.querySelector(".game-heading"),
        document.querySelector(".game-showcase"),
        document.querySelector(".game-content-grid")
    ];


    pageSections.forEach(section => {

        if (section) {
            section.hidden = true;
        }

    });


    gameNotFound.hidden =
        false;


    document.title =
        "Game Not Found | Apex Games";

}


/* =========================================================
   ACQUIRE

   IMPORTANT:
   We do NOT fake ownership here.

   The real Supabase ownership system will be connected
   when the Store/Library acquisition backend is ready.
========================================================= */

function setupAcquireButton(game) {

    if (
        !game ||
        game.status === "Coming Soon"
    ) {
        return;
    }


    acquireButton.addEventListener(
        "click",
        () => {

            acquireNotice.hidden =
                false;

            acquireNotice.textContent =
                "Game acquisition is not connected yet. Apex Games will connect this button to your real Library ownership before release.";

        }
    );

}


/* =========================================================
   MEDIA SELECTOR

   Placeholder behavior for now.
   Later these buttons can switch real screenshots/videos.
========================================================= */

function setupMediaSelector() {

    screenshotButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    screenshotButtons.forEach(
                        item =>
                            item.classList.remove("active")
                    );


                    button.classList.add("active");

                }
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const navSearch =
        document.getElementById("navSearch");

    const navSearchInput =
        document.getElementById("navSearchInput");

    const storeSearch =
        document.getElementById("storeSearch");

    const storeSearchInput =
        document.getElementById("storeSearchInput");


    navSearch?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const query =
                navSearchInput.value.trim();

            if (!query) {
                return;
            }

            window.location.href =
                `search.html?q=${encodeURIComponent(query)}`;

        }
    );


    storeSearch?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const query =
                storeSearchInput.value.trim();

            if (!query) {
                window.location.href =
                    "store.html";

                return;
            }

            window.location.href =
                `store.html?search=${encodeURIComponent(query)}`;

        }
    );

}


/* =========================================================
   START
========================================================= */

function initGamePage() {

    const gameId =
        getGameId();

    const game =
        APEX_GAME_CATALOG[gameId];


    if (!game) {

        showNotFound();

        setupSearch();

        return;

    }


    renderGame(game);

    setupAcquireButton(game);

    setupMediaSelector();

    setupSearch();

}


/* =========================================================
   RUN
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initGamePage
);

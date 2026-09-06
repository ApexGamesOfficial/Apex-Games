/* =========================================================
   APEX GAMES STORE v0.3
========================================================= */

const STORE_GAMES = [

    {
        id: "apex-demo",

        title: "Apex Demo",

        artTitle: "APEX DEMO",

        developer: "Apex Games",

        description:
            "Enter the Apex Games ecosystem with the official demonstration experience.",

        genre: "Action",

        categories: [
            "action",
            "apex"
        ],

        tags: [
            "Action",
            "Singleplayer",
            "Apex Games"
        ],

        release: "2026",

        platform: "Windows",

        status: "Available",

        accent: "blue"
    },


    {
        id: "project-unknown",

        title: "Project Unknown",

        artTitle: "PROJECT UNKNOWN",

        developer: "Apex Games",

        description:
            "An upcoming Apex Games adventure currently in development.",

        genre: "Adventure",

        categories: [
            "adventure",
            "coming-soon",
            "apex"
        ],

        tags: [
            "Adventure",
            "Singleplayer",
            "Coming Soon"
        ],

        release: "TBA",

        platform: "Windows",

        status: "Coming Soon",

        accent: "dark"
    }

];



/* =========================================================
   STATE
========================================================= */

let selectedCategory = "all";

let featuredIndex = 0;



/* =========================================================
   ELEMENTS
========================================================= */

const storeSearch =
    document.getElementById("storeSearch");

const clearSearch =
    document.getElementById("clearSearch");

const gameCardGrid =
    document.getElementById("gameCardGrid");

const upcomingGrid =
    document.getElementById("upcomingGrid");

const noGames =
    document.getElementById("noGames");

const resetStore =
    document.getElementById("resetStore");

const showAllGames =
    document.getElementById("showAllGames");


const featuredLink =
    document.getElementById("featuredLink");

const featuredArtBackground =
    document.getElementById("featuredArtBackground");

const featuredArtTitle =
    document.getElementById("featuredArtTitle");

const featuredDeveloper =
    document.getElementById("featuredDeveloper");

const featuredTitle =
    document.getElementById("featuredTitle");

const featuredDescription =
    document.getElementById("featuredDescription");

const featuredTags =
    document.getElementById("featuredTags");

const featuredStatus =
    document.getElementById("featuredStatus");

const featuredPlatform =
    document.getElementById("featuredPlatform");

const featuredPagination =
    document.getElementById("featuredPagination");



/* =========================================================
   FILTERING
========================================================= */

function getFilteredGames() {

    const query =
        storeSearch
            .value
            .trim()
            .toLowerCase();


    return STORE_GAMES.filter(
        game => {

            const categoryMatches =
                selectedCategory === "all" ||
                game.categories.includes(
                    selectedCategory
                );


            const searchableText =
                [
                    game.title,
                    game.developer,
                    game.description,
                    game.genre,
                    game.release,
                    game.platform,
                    game.status,
                    ...game.tags
                ]
                    .join(" ")
                    .toLowerCase();


            const searchMatches =
                !query ||
                searchableText.includes(
                    query
                );


            return (
                categoryMatches &&
                searchMatches
            );
        }
    );
}



/* =========================================================
   MAIN GAME CARDS
========================================================= */

function renderGameCards() {

    const games =
        getFilteredGames();


    gameCardGrid.innerHTML = "";


    games.forEach(
        game => {

            gameCardGrid.appendChild(
                createGameCard(game)
            );
        }
    );


    noGames.hidden =
        games.length > 0;


    clearSearch.hidden =
        storeSearch.value.length === 0;
}



function createGameCard(game) {

    const card =
        document.createElement("a");


    card.href =
        `game.html?id=${encodeURIComponent(game.id)}`;


    card.className =
        `game-card ${
            game.accent === "dark"
                ? "dark"
                : ""
        }`;


    card.innerHTML = `

        <div class="game-card-art">

            <img
                src="apex-logo.png"
                alt=""
            >

            <span class="game-card-art-title">
                ${escapeHTML(game.artTitle)}
            </span>

        </div>


        <div class="game-card-content">

            <h3>
                ${escapeHTML(game.title)}
            </h3>


            <span class="game-card-developer">
                ${escapeHTML(game.developer)}
            </span>


            <div class="game-card-tags">

                ${game.tags
                    .map(
                        tag =>
                            `<span>${escapeHTML(tag)}</span>`
                    )
                    .join("")}

            </div>


            <div class="game-card-bottom">

                <span class="game-card-status">
                    ${escapeHTML(game.status)}
                </span>

                <span class="game-card-platform">
                    ${escapeHTML(game.platform)}
                </span>

            </div>

        </div>

    `;


    return card;
}



/* =========================================================
   NEW & UPCOMING
========================================================= */

function renderUpcoming() {

    upcomingGrid.innerHTML = "";


    STORE_GAMES.forEach(
        game => {

            upcomingGrid.appendChild(
                createWideCard(game)
            );
        }
    );
}



function createWideCard(game) {

    const card =
        document.createElement("a");


    card.href =
        `game.html?id=${encodeURIComponent(game.id)}`;


    card.className =
        `wide-game-card ${
            game.accent === "dark"
                ? "dark"
                : ""
        }`;


    card.innerHTML = `

        <div class="wide-card-art">

            <img
                src="apex-logo.png"
                alt=""
            >

        </div>


        <div class="wide-card-info">

            <h3>
                ${escapeHTML(game.title)}
            </h3>

            <p>
                ${escapeHTML(game.description)}
            </p>

            <div class="wide-card-meta">

                <span>
                    ${escapeHTML(game.status)}
                </span>

                <span>
                    ${escapeHTML(game.release)}
                </span>

            </div>

        </div>

    `;


    return card;
}



/* =========================================================
   FEATURED
========================================================= */

function renderFeaturedPagination() {

    featuredPagination.innerHTML =
        "";


    STORE_GAMES.forEach(
        (game, index) => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.setAttribute(
                "aria-label",
                `Feature ${game.title}`
            );


            button.addEventListener(
                "click",
                () => {

                    featuredIndex =
                        index;


                    updateFeatured();
                }
            );


            featuredPagination.appendChild(
                button
            );
        }
    );


    updateFeatured();
}



function updateFeatured() {

    const game =
        STORE_GAMES[
            featuredIndex
        ];


    featuredLink.href =
        `game.html?id=${encodeURIComponent(game.id)}`;


    featuredArtTitle.textContent =
        game.artTitle;


    featuredDeveloper.textContent =
        game.developer.toUpperCase();


    featuredTitle.textContent =
        game.title;


    featuredDescription.textContent =
        game.description;


    featuredStatus.textContent =
        game.status;


    featuredPlatform.textContent =
        game.platform;


    featuredTags.innerHTML =
        "";


    game.tags.forEach(
        tag => {

            const element =
                document.createElement("span");


            element.textContent =
                tag;


            featuredTags.appendChild(
                element
            );
        }
    );


    if (
        game.accent === "dark"
    ) {

        featuredArtBackground.style.background = `

            radial-gradient(
                circle at 50% 48%,
                rgba(124, 156, 184, .18),
                transparent 30%
            ),

            linear-gradient(
                135deg,
                #21374a,
                #09131d 70%
            )

        `;

    } else {

        featuredArtBackground.style.background = `

            radial-gradient(
                circle at 50% 48%,
                rgba(24, 140, 255, .30),
                transparent 30%
            ),

            linear-gradient(
                135deg,
                #16324d,
                #08121e 70%
            )

        `;
    }


    [...featuredPagination.children]
        .forEach(
            (button, index) => {

                button.classList.toggle(
                    "active",
                    index === featuredIndex
                );
            }
        );
}



/* =========================================================
   SEARCH
========================================================= */

storeSearch.addEventListener(
    "input",
    () => {

        renderGameCards();

        document
            .getElementById("games")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }
);



clearSearch.addEventListener(
    "click",
    () => {

        storeSearch.value =
            "";


        renderGameCards();


        storeSearch.focus();
    }
);



/* =========================================================
   CATEGORIES
========================================================= */

document
    .querySelectorAll(
        "[data-category]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectedCategory =
                        button.dataset.category;


                    storeSearch.value =
                        "";


                    renderGameCards();


                    document
                        .getElementById("games")
                        ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                }
            );
        }
    );



showAllGames.addEventListener(
    "click",
    () => {

        selectedCategory =
            "all";


        storeSearch.value =
            "";


        renderGameCards();


        document
            .getElementById("games")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    }
);



resetStore.addEventListener(
    "click",
    () => {

        selectedCategory =
            "all";


        storeSearch.value =
            "";


        renderGameCards();
    }
);



/* =========================================================
   STORE NAV SCROLLING
========================================================= */

document
    .querySelectorAll(
        "[data-scroll]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        document.getElementById(
                            button.dataset.scroll
                        );


                    target?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            );
        }
    );



/* =========================================================
   GLOBAL NAV SEARCH
========================================================= */

const navSearch =
    document.getElementById("navSearch");

const navSearchInput =
    document.getElementById("navSearchInput");


navSearch?.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const query =
            navSearchInput
                .value
                .trim();


        if (!query) {
            return;
        }


        window.location.href =
            `search.html?q=${encodeURIComponent(query)}`;
    }
);



/* =========================================================
   SAFETY
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}



/* =========================================================
   START
========================================================= */

renderGameCards();

renderUpcoming();

renderFeaturedPagination();

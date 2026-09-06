/* =========================================================
   APEX GAMES STORE v0.2
========================================================= */

const STORE_GAMES = [

    {
        id: "apex-demo",

        title: "Apex Demo",

        artTitle: "APEX DEMO",

        developer: "Apex Games",

        description:
            "Enter the Apex Games ecosystem with the official demonstration experience.",

        longDescription:
            "Apex Demo is the official demonstration title for the Apex Games platform, built to test the future Apex Client, Library, game delivery, updates, and the complete Apex ecosystem.",

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

        longDescription:
            "Project Unknown is an upcoming Apex Games title. More information about the experience, gameplay, and release will be revealed in the future.",

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

let activeCategory = "all";

let featuredIndex = 0;



/* =========================================================
   ELEMENTS
========================================================= */

const storeSearch =
    document.getElementById("storeSearch");

const clearStoreSearch =
    document.getElementById("clearStoreSearch");

const categoryTabs =
    document.getElementById("categoryTabs");

const gameList =
    document.getElementById("gameList");

const gameCount =
    document.getElementById("gameCount");

const nothingFound =
    document.getElementById("nothingFound");

const resetStore =
    document.getElementById("resetStore");


const previewArt =
    document.getElementById("previewArt");

const previewArtTitle =
    document.getElementById("previewArtTitle");

const previewTitle =
    document.getElementById("previewTitle");

const previewDescription =
    document.getElementById("previewDescription");

const previewRelease =
    document.getElementById("previewRelease");

const previewDeveloper =
    document.getElementById("previewDeveloper");

const previewTags =
    document.getElementById("previewTags");


const featuredMainLink =
    document.getElementById("featuredMainLink");

const featuredMainBackground =
    document.getElementById("featuredMainBackground");

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

const featuredDots =
    document.getElementById("featuredDots");



/* =========================================================
   STORE RENDER
========================================================= */

function getVisibleGames() {

    const query =
        storeSearch
            .value
            .trim()
            .toLowerCase();


    return STORE_GAMES.filter(
        game => {

            const categoryMatch =
                activeCategory === "all" ||
                game.categories.includes(
                    activeCategory
                );


            const text =
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


            const searchMatch =
                !query ||
                text.includes(query);


            return (
                categoryMatch &&
                searchMatch
            );
        }
    );
}



function renderGames() {

    const games =
        getVisibleGames();


    gameList.innerHTML = "";


    games.forEach(
        game => {

            gameList.appendChild(
                createGameRow(game)
            );
        }
    );


    gameCount.textContent =
        `${games.length} ${
            games.length === 1
                ? "game"
                : "games"
        }`;


    nothingFound.hidden =
        games.length !== 0;


    clearStoreSearch.hidden =
        storeSearch.value.length === 0;


    if (games.length > 0) {
        showPreview(games[0]);
    }
}



/* =========================================================
   GAME ROW
========================================================= */

function createGameRow(game) {

    const row =
        document.createElement("a");


    row.className =
        "game-row";


    row.href =
        `game.html?id=${encodeURIComponent(game.id)}`;


    row.dataset.gameId =
        game.id;


    row.dataset.accent =
        game.accent;


    row.innerHTML = `

        <div class="game-row-art">

            <img
                src="apex-logo.png"
                alt=""
            >

            <span>
                ${escapeHTML(game.artTitle)}
            </span>

        </div>


        <div class="game-row-info">

            <h3>
                ${escapeHTML(game.title)}
            </h3>

            <p>
                ${escapeHTML(game.developer)}
            </p>

            <div class="game-row-tags">

                ${game.tags
                    .map(
                        tag =>
                            `<span>${escapeHTML(tag)}</span>`
                    )
                    .join("")}

            </div>

        </div>


        <div class="game-row-right">

            <span class="row-status">
                ${escapeHTML(game.status)}
            </span>

            <span class="row-release">
                ${escapeHTML(game.release)}
            </span>

        </div>

    `;


    row.addEventListener(
        "mouseenter",
        () => {

            setActivePreviewRow(
                row
            );


            showPreview(
                game
            );
        }
    );


    row.addEventListener(
        "focus",
        () => {

            setActivePreviewRow(
                row
            );


            showPreview(
                game
            );
        }
    );


    return row;
}



function setActivePreviewRow(row) {

    document
        .querySelectorAll(".game-row")
        .forEach(
            item => {

                item.classList.toggle(
                    "preview-active",
                    item === row
                );
            }
        );
}



/* =========================================================
   BIG HOVER PREVIEW
========================================================= */

function showPreview(game) {

    previewArt.classList.toggle(
        "dark",
        game.accent === "dark"
    );


    previewArtTitle.textContent =
        game.artTitle;


    previewTitle.textContent =
        game.title;


    previewDescription.textContent =
        game.description;


    previewRelease.textContent =
        game.release;


    previewDeveloper.textContent =
        game.developer;


    previewTags.innerHTML = "";


    game.tags.forEach(
        tag => {

            const span =
                document.createElement("span");


            span.textContent =
                tag;


            previewTags.appendChild(
                span
            );
        }
    );
}



/* =========================================================
   SEARCH
========================================================= */

storeSearch.addEventListener(
    "input",
    renderGames
);


clearStoreSearch.addEventListener(
    "click",
    () => {

        storeSearch.value = "";

        storeSearch.focus();

        renderGames();
    }
);



/* =========================================================
   CATEGORIES
========================================================= */

categoryTabs.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-category]"
            );


        if (!button) {
            return;
        }


        setCategory(
            button.dataset.category
        );
    }
);



document
    .querySelectorAll(
        "[data-category-jump]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    setCategory(
                        button.dataset.categoryJump
                    );


                    document
                        .querySelector(".browse-games")
                        ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                }
            );
        }
    );



document
    .querySelectorAll(
        "[data-filter-button]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    setCategory(
                        button.dataset.filterButton
                    );


                    document
                        .querySelector(".browse-games")
                        ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                }
            );
        }
    );



function setCategory(category) {

    activeCategory =
        category;


    document
        .querySelectorAll(
            "[data-category]"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.category ===
                        category
                );
            }
        );


    renderGames();
}



/* =========================================================
   RESET
========================================================= */

resetStore.addEventListener(
    "click",
    () => {

        storeSearch.value = "";

        setCategory("all");
    }
);



/* =========================================================
   FEATURED
========================================================= */

function renderFeatured() {

    featuredDots.innerHTML =
        "";


    STORE_GAMES.forEach(
        (game, index) => {

            const button =
                document.createElement("button");


            button.type =
                "button";


            button.setAttribute(
                "aria-label",
                `Show ${game.title}`
            );


            button.classList.toggle(
                "active",
                index === featuredIndex
            );


            button.addEventListener(
                "click",
                () => {

                    featuredIndex =
                        index;


                    updateFeatured();
                }
            );


            featuredDots.appendChild(
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


    featuredMainLink.href =
        `game.html?id=${encodeURIComponent(game.id)}`;


    featuredMainBackground.style.background =
        game.accent === "dark"

            ? `
                radial-gradient(
                    circle at 50% 50%,
                    rgba(120, 136, 157, .18),
                    transparent 31%
                ),
                linear-gradient(
                    135deg,
                    #141920,
                    #06080b 70%
                )
            `

            : `
                radial-gradient(
                    circle at 50% 50%,
                    rgba(22, 140, 255, .30),
                    transparent 31%
                ),
                linear-gradient(
                    135deg,
                    #101c2b,
                    #06090e 70%
                )
            `;


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

            const span =
                document.createElement("span");


            span.textContent =
                tag;


            featuredTags.appendChild(
                span
            );
        }
    );


    [...featuredDots.children]
        .forEach(
            (dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === featuredIndex
                );
            }
        );
}



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

renderGames();

renderFeatured();

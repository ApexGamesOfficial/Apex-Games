/* =========================================================
   APEX GAMES STORE v0.4
   Dense storefront + featured carousel + preview-ready cards
========================================================= */

const STORE_GAMES = [
    {
        id: "apex-demo",
        title: "Apex Demo",
        artTitle: "APEX DEMO",
        developer: "Apex Games",
        description: "Enter the Apex Games ecosystem with the official demonstration experience.",
        genre: "Action",
        categories: [
            "action",
            "singleplayer",
            "apex",
            "free-to-play"
        ],
        tags: [
            "Action",
            "Singleplayer",
            "Apex Games"
        ],
        release: "2026",
        platform: "Windows",
        status: "Available",
        price: 0,
        originalPrice: null,
        discount: 0,
        thumbnail: "apex-logo.png",
        previewVideo: "",
        featured: true,
        trending: true,
        topSeller: false,
        accent: "blue"
    },

    {
        id: "project-unknown",
        title: "Project Unknown",
        artTitle: "PROJECT UNKNOWN",
        developer: "Apex Games",
        description: "An upcoming Apex Games adventure currently in development.",
        genre: "Adventure",
        categories: [
            "adventure",
            "singleplayer",
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
        price: null,
        originalPrice: null,
        discount: 0,
        thumbnail: "apex-logo.png",
        previewVideo: "",
        featured: true,
        trending: false,
        topSeller: false,
        accent: "dark"
    }
];


/* =========================================================
   STATE
========================================================= */

let selectedCategory = "all";
let featuredIndex = 0;
let featuredTimer = null;
let discoveryMode = "new";

const FEATURE_MS = 7000;


/* =========================================================
   ELEMENTS
========================================================= */

const $ = id =>
    document.getElementById(id);

const storeSearch =
    $("storeSearch");

const clearSearch =
    $("clearSearch");

const gameCardGrid =
    $("gameCardGrid");

const noGames =
    $("noGames");

const resetStore =
    $("resetStore");

const showAllGames =
    $("showAllGames");

const featuredTrack =
    $("featuredTrack");

const featuredPagination =
    $("featuredPagination");

const recommendedRow =
    $("recommendedRow");

const becauseRow =
    $("becauseRow");

const discoveryList =
    $("discoveryList");

const discoveryPreview =
    $("discoveryPreview");


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
   PRICE
========================================================= */

function priceHTML(game) {

    if (
        game.status === "Coming Soon" ||
        game.price === null
    ) {
        return `
            <span class="coming">
                Coming Soon
            </span>
        `;
    }

    if (game.price === 0) {
        return `
            <strong>
                Free to Play
            </strong>
        `;
    }

    const price =
        `$${Number(game.price).toFixed(2)}`;

    if (
        game.discount &&
        game.originalPrice
    ) {
        return `
            <span class="discount">
                -${game.discount}%
            </span>

            <span class="old">
                $${Number(game.originalPrice).toFixed(2)}
            </span>

            <strong>
                ${price}
            </strong>
        `;
    }

    return `
        <strong>
            ${price}
        </strong>
    `;
}


/* =========================================================
   GAME URL
========================================================= */

function gameURL(game) {
    return `game.html?id=${encodeURIComponent(game.id)}`;
}


/* =========================================================
   GAME MEDIA
========================================================= */

function mediaHTML(game) {

    return `
        <div class="store-game-media">

            <div class="store-game-placeholder">

                <img
                    src="${escapeHTML(game.thumbnail || "apex-logo.png")}"
                    alt=""
                >

            </div>

            ${
                game.previewVideo
                    ? `
                        <video
                            muted
                            loop
                            playsinline
                            preload="none"
                            data-src="${escapeHTML(game.previewVideo)}"
                        ></video>
                    `
                    : ""
            }

        </div>
    `;
}


/* =========================================================
   VIDEO PREVIEW
========================================================= */

function bindPreview(card, game) {

    if (!game.previewVideo) {
        return;
    }

    let timer;

    const video =
        card.querySelector("video");

    if (!video) {
        return;
    }


    const start = () => {

        timer =
            setTimeout(
                () => {

                    if (!video.src) {
                        video.src =
                            video.dataset.src;
                    }

                    card.classList.add(
                        "previewing"
                    );

                    video
                        .play()
                        .catch(() => {});

                },
                350
            );

    };


    const stop = () => {

        clearTimeout(timer);

        card.classList.remove(
            "previewing"
        );

        video.pause();

        try {
            video.currentTime = 0;
        } catch (_) {
            /* ignore */
        }

    };


    card.addEventListener(
        "mouseenter",
        start
    );

    card.addEventListener(
        "mouseleave",
        stop
    );

    card.addEventListener(
        "focusin",
        start
    );

    card.addEventListener(
        "focusout",
        stop
    );
}


/* =========================================================
   GAME CARD
========================================================= */

function createGameCard(game) {

    const card =
        document.createElement("a");

    card.href =
        gameURL(game);

    card.className =
        "store-game-card";


    card.innerHTML = `

        ${mediaHTML(game)}

        <div class="store-game-body">

            <div class="store-game-title">
                ${escapeHTML(game.title)}
            </div>

            <div class="store-game-tags">

                ${
                    game.tags
                        .slice(0, 3)
                        .map(
                            tag => `
                                <span>
                                    ${escapeHTML(tag)}
                                </span>
                            `
                        )
                        .join("")
                }

            </div>

            <div class="store-game-price">
                ${priceHTML(game)}
            </div>

        </div>
    `;


    bindPreview(
        card,
        game
    );

    return card;
}


/* =========================================================
   FILTERING
========================================================= */

function getFilteredGames() {

    const query =
        (
            storeSearch?.value ||
            ""
        )
            .trim()
            .toLowerCase();


    return STORE_GAMES.filter(
        game => {

            const categoryMatch =
                selectedCategory === "all" ||
                game.categories.includes(
                    selectedCategory
                );


            const searchText = [
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


            const searchMatch =
                !query ||
                searchText.includes(query);


            return (
                categoryMatch &&
                searchMatch
            );

        }
    );
}


/* =========================================================
   EXPLORE GAMES
========================================================= */

function renderGameCards() {

    if (!gameCardGrid) {
        return;
    }


    const games =
        getFilteredGames();


    gameCardGrid.innerHTML =
        "";


    games.forEach(
        game => {

            gameCardGrid.appendChild(
                createGameCard(game)
            );

        }
    );


    if (noGames) {
        noGames.hidden =
            games.length > 0;
    }


    if (clearSearch) {

        clearSearch.hidden =
            !storeSearch?.value.length;

    }
}


/* =========================================================
   RECOMMENDATION ROWS
========================================================= */

function renderRows() {

    [
        recommendedRow,
        becauseRow
    ]
        .forEach(
            (row, index) => {

                if (!row) {
                    return;
                }


                row.innerHTML =
                    "";


                const games =
                    index === 0
                        ? [...STORE_GAMES]
                        : [...STORE_GAMES].reverse();


                games
                    .slice(0, 4)
                    .forEach(
                        game => {

                            row.appendChild(
                                createGameCard(game)
                            );

                        }
                    );

            }
        );
}


/* =========================================================
   FEATURED SLIDE
========================================================= */

function featuredSlide(game) {

    const link =
        document.createElement("a");

    link.className =
        "featured-slide";

    link.href =
        gameURL(game);


    link.innerHTML = `

        <div
            class="
                featured-slide-art
                ${
                    game.accent === "dark"
                        ? "dark"
                        : ""
                }
            "
        >

            <img
                src="${escapeHTML(game.thumbnail || "apex-logo.png")}"
                alt=""
            >

            <strong>
                ${escapeHTML(game.artTitle)}
            </strong>

        </div>


        <div class="featured-slide-info">

            <div>

                <span class="section-label">
                    ${escapeHTML(game.developer.toUpperCase())}
                </span>

                <h2>
                    ${escapeHTML(game.title)}
                </h2>

                <p>
                    ${escapeHTML(game.description)}
                </p>

            </div>


            <div
                class="featured-mini-shots"
                aria-hidden="true"
            >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>


            <div class="featured-tags">

                ${
                    game.tags
                        .map(
                            tag => `
                                <span>
                                    ${escapeHTML(tag)}
                                </span>
                            `
                        )
                        .join("")
                }

            </div>


            <div class="featured-price">

                <span>
                    ${escapeHTML(game.platform)}
                </span>

                <strong>
                    ${
                        game.status === "Coming Soon"
                            ? "Coming Soon"
                            : game.price === 0
                                ? "Free to Play"
                                : `$${Number(game.price).toFixed(2)}`
                    }
                </strong>

            </div>

        </div>
    `;


    return link;
}


/* =========================================================
   FEATURED
========================================================= */

function renderFeatured() {

    if (
        !featuredTrack ||
        !featuredPagination
    ) {
        return;
    }


    const games =
        STORE_GAMES.filter(
            game =>
                game.featured
        );


    featuredTrack.innerHTML =
        "";

    featuredPagination.innerHTML =
        "";


    games.forEach(
        (game, index) => {

            featuredTrack.appendChild(
                featuredSlide(game)
            );


            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.setAttribute(
                "aria-label",
                `Show ${game.title}`
            );


            button.addEventListener(
                "click",
                () => {

                    setFeatured(
                        index,
                        true
                    );

                }
            );


            featuredPagination.appendChild(
                button
            );

        }
    );


    setFeatured(
        0,
        false
    );


    const viewport =
        featuredTrack.parentElement;


    if (viewport) {

        viewport.addEventListener(
            "mouseenter",
            stopFeatured
        );

        viewport.addEventListener(
            "mouseleave",
            startFeatured
        );

        viewport.addEventListener(
            "focusin",
            stopFeatured
        );

        viewport.addEventListener(
            "focusout",
            startFeatured
        );

    }


    startFeatured();
}


/* =========================================================
   FEATURED SLIDER
========================================================= */

function setFeatured(
    index,
    restart
) {

    if (!featuredTrack) {
        return;
    }


    const count =
        featuredTrack.children.length;


    if (!count) {
        return;
    }


    featuredIndex =
        (
            index +
            count
        ) %
        count;


    featuredTrack.style.transform =
        `translateX(-${featuredIndex * 100}%)`;


    if (featuredPagination) {

        [
            ...featuredPagination.children
        ]
            .forEach(
                (button, buttonIndex) => {

                    button.classList.toggle(
                        "active",
                        buttonIndex ===
                            featuredIndex
                    );

                }
            );

    }


    if (restart) {

        stopFeatured();
        startFeatured();

    }
}


function startFeatured() {

    if (!featuredTrack) {
        return;
    }


    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {
        return;
    }


    if (
        featuredTrack.children.length <
        2
    ) {
        return;
    }


    stopFeatured();


    featuredTimer =
        window.setInterval(
            () => {

                setFeatured(
                    featuredIndex + 1,
                    false
                );

            },
            FEATURE_MS
        );
}


function stopFeatured() {

    if (!featuredTimer) {
        return;
    }


    clearInterval(
        featuredTimer
    );

    featuredTimer =
        null;
}


/* =========================================================
   DISCOVERY DATA
========================================================= */

function gamesForDiscovery() {

    switch (discoveryMode) {

        case "top":

            return [
                ...STORE_GAMES
            ]
                .sort(
                    (a, b) =>
                        Number(
                            b.topSeller
                        ) -
                        Number(
                            a.topSeller
                        )
                );


        case "upcoming":

            return STORE_GAMES.filter(
                game =>
                    game.status ===
                    "Coming Soon"
            );


        case "specials":

            return STORE_GAMES.filter(
                game =>
                    game.discount > 0
            );


        case "free":

            return STORE_GAMES.filter(
                game =>
                    game.price === 0
            );


        default:

            return [
                ...STORE_GAMES
            ].reverse();

    }
}


/* =========================================================
   DISCOVERY
========================================================= */

function renderDiscovery() {

    if (
        !discoveryList ||
        !discoveryPreview
    ) {
        return;
    }


    const games =
        gamesForDiscovery();


    discoveryList.innerHTML =
        "";


    if (!games.length) {

        discoveryList.innerHTML = `

            <div class="no-games">

                <h3>
                    Nothing here yet
                </h3>

                <p>
                    As the Apex Games catalog grows,
                    qualifying games will appear here
                    automatically.
                </p>

            </div>
        `;


        discoveryPreview.innerHTML = `

            <h3>
                More games are coming.
            </h3>

            <p>
                This section is ready for future releases
                without inventing listings.
            </p>
        `;


        return;
    }


    games
        .slice(0, 7)
        .forEach(
            (game, index) => {

                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    gameURL(game);


                link.className =
                    `discovery-item${
                        index === 0
                            ? " active"
                            : ""
                    }`;


                link.innerHTML = `

                    <div
                        class="discovery-item-media"
                    >

                        <img
                            src="${escapeHTML(game.thumbnail || "apex-logo.png")}"
                            alt=""
                        >

                    </div>


                    <div
                        class="discovery-item-info"
                    >

                        <strong>
                            ${escapeHTML(game.title)}
                        </strong>

                        <span>
                            ${
                                game.tags
                                    .slice(0, 4)
                                    .map(
                                        escapeHTML
                                    )
                                    .join(", ")
                            }
                        </span>

                    </div>


                    <div
                        class="discovery-item-price"
                    >

                        ${
                            game.status ===
                            "Coming Soon"
                                ? "Coming Soon"
                                : game.price === 0
                                    ? "Free"
                                    : `$${Number(game.price).toFixed(2)}`
                        }

                    </div>
                `;


                link.addEventListener(
                    "mouseenter",
                    () => {

                        [
                            ...discoveryList.children
                        ]
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        link.classList.add(
                            "active"
                        );


                        renderDiscoveryPreview(
                            game
                        );

                    }
                );


                link.addEventListener(
                    "focus",
                    () => {

                        renderDiscoveryPreview(
                            game
                        );

                    }
                );


                discoveryList.appendChild(
                    link
                );

            }
        );


    renderDiscoveryPreview(
        games[0]
    );
}


/* =========================================================
   DISCOVERY PREVIEW
========================================================= */

function renderDiscoveryPreview(
    game
) {

    if (
        !discoveryPreview ||
        !game
    ) {
        return;
    }


    discoveryPreview.innerHTML = `

        <h3>
            ${escapeHTML(game.title)}
        </h3>

        <p>
            ${escapeHTML(game.developer)}
        </p>


        <div class="preview-tags">

            ${
                game.tags
                    .map(
                        tag => `
                            <span>
                                ${escapeHTML(tag)}
                            </span>
                        `
                    )
                    .join("")
            }

        </div>


        <div class="preview-art">

            <img
                src="${escapeHTML(game.thumbnail || "apex-logo.png")}"
                alt=""
            >

        </div>
    `;
}


/* =========================================================
   DISCOVERY TABS
========================================================= */

document
    .querySelectorAll(
        "[data-discovery]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            "[data-discovery]"
                        )
                        .forEach(
                            tab => {

                                tab.classList.remove(
                                    "active"
                                );

                                tab.setAttribute(
                                    "aria-selected",
                                    "false"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );

                    button.setAttribute(
                        "aria-selected",
                        "true"
                    );


                    discoveryMode =
                        button.dataset.discovery;


                    renderDiscovery();

                }
            );

        }
    );


/* =========================================================
   STORE SEARCH
========================================================= */

storeSearch?.addEventListener(
    "input",
    () => {

        renderGameCards();

    }
);


clearSearch?.addEventListener(
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


                    document
                        .querySelectorAll(
                            "[data-category]"
                        )
                        .forEach(
                            categoryButton =>
                                categoryButton
                                    .classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    if (storeSearch) {
                        storeSearch.value = "";
                    }


                    renderGameCards();


                    $("games")
                        ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                }
            );

        }
    );


/* =========================================================
   BROWSE ALL
========================================================= */

showAllGames?.addEventListener(
    "click",
    () => {

        selectedCategory =
            "all";


        if (storeSearch) {
            storeSearch.value = "";
        }


        document
            .querySelectorAll(
                "[data-category]"
            )
            .forEach(
                button =>
                    button
                        .classList
                        .remove(
                            "active"
                        )
            );


        renderGameCards();


        $("games")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    }
);


/* =========================================================
   RESET
========================================================= */

resetStore?.addEventListener(
    "click",
    () => {

        selectedCategory =
            "all";


        if (storeSearch) {
            storeSearch.value = "";
        }


        document
            .querySelectorAll(
                "[data-category]"
            )
            .forEach(
                button =>
                    button
                        .classList
                        .remove(
                            "active"
                        )
            );


        renderGameCards();

    }
);


/* =========================================================
   STORE NAV SCROLL
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
                        $(
                            button.dataset.scroll
                        );


                    target
                        ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                }
            );

        }
    );


/* =========================================================
   START
========================================================= */

renderFeatured();
renderRows();
renderDiscovery();
renderGameCards();

console.log(
    "[Apex Games] Store v0.4 ready."
);

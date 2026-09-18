/* =========================================================
   APEX GAMES STORE V3
   Storefront rendering, discovery, carousels, previews,
   conditional personalization, search, and categories.
========================================================= */


/* =========================================================
   STORE CONFIG
========================================================= */

const STORE_CONFIG = {
    featuredRotationMs: 7000,

    /*
       Keep this FALSE until APX Cloud Gaming actually launches.
    */
    apxCloudGamingLaunched: false,

    /*
       These features only display when qualifying real data
       exists. They do not create fake storefront content.
    */
    enablePlayerPicks: false,
    enablePersonalization: true
};


/* =========================================================
   STORE CATALOG

   Only real/current Apex Games catalog entries belong here.
========================================================= */

const STORE_GAMES = [

    {
        id: "apex-demo",

        title: "Apex Demo",
        artTitle: "APEX DEMO",

        developer: "Apex Games",
        publisher: "Apex Games",

        description:
            "Enter the Apex Games ecosystem with the official demonstration experience.",

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
        releaseOrder: 2,

        platform: "Windows",

        status: "Available",

        price: 0,
        originalPrice: null,
        discount: 0,

        /*
           Use a full 16:9 image here later when one exists.

           With only apex-logo.png, Store V3 automatically uses
           the fallback artwork mode instead of stretching the
           logo across the whole thumbnail.
        */
        thumbnail: "apex-logo.png",
        artwork: "",
        screenshots: [],

        /*
           NEVER add a fake preview.

           When a real trailer/gameplay clip exists, put its
           URL/path here and V3 will lazy-load it on hover.
        */
        previewVideo: "",

        featured: true,
        trending: true,
        topSeller: false,

        featuredBadge: "AVAILABLE NOW",

        accent: "blue",

        apxOptimized: false
    },


    {
        id: "project-unknown",

        title: "Project Unknown",
        artTitle: "PROJECT UNKNOWN",

        developer: "Apex Games",
        publisher: "Apex Games",

        description:
            "An upcoming Apex Games adventure currently in development.",

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
        releaseOrder: 1,

        platform: "Windows",

        status: "Coming Soon",

        price: null,
        originalPrice: null,
        discount: 0,

        thumbnail: "apex-logo.png",
        artwork: "",
        screenshots: [],

        previewVideo: "",

        featured: true,
        trending: false,
        topSeller: false,

        featuredBadge: "COMING SOON",

        accent: "dark",

        apxOptimized: false
    }

];


/* =========================================================
   REAL PROMOTIONS / EVENTS

   Empty on purpose.

   When Apex has a legitimate discount, free weekend,
   publisher event, seasonal event, etc., add it here.

   Deals & Events stays completely hidden while this is empty.
========================================================= */

const STORE_EVENTS = [];


/* =========================================================
   COMMUNITY PICKS

   Empty until Apex has actual community recommendation data.
========================================================= */

const PLAYER_PICKS = [];


/* =========================================================
   PLAYER CONTEXT FOUNDATION

   Store V3 can use real account/library data later.

   Until that data is available, history-based sections remain
   hidden instead of pretending to know what the player likes.
========================================================= */

const PLAYER_STORE_CONTEXT = {
    ownedGameIds: [],
    playedGameIds: [],
    followedDevelopers: [],
    favoriteCategories: []
};


/* =========================================================
   STATE
========================================================= */

let selectedCategory = "all";

let featuredIndex = 0;
let featuredTimer = null;
let featuredPaused = false;


/* =========================================================
   ELEMENT HELPERS
========================================================= */

const $ = id =>
    document.getElementById(id);


const storePage =
    document.querySelector(".store-page");

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

const featuredCarousel =
    $("featuredCarousel");

const featuredTrack =
    $("featuredTrack");

const featuredPagination =
    $("featuredPagination");

const featuredPrevious =
    $("featuredPrevious");

const featuredNext =
    $("featuredNext");

const dealsSection =
    $("deals-events");

const dealsRow =
    $("dealsRow");

const recommendationsSection =
    $("recommendations");

const recommendedRow =
    $("recommendedRow");

const becauseSection =
    $("because-you-played");

const becauseRow =
    $("becauseRow");

const becauseGameTitle =
    $("becauseGameTitle");

const freshReleasesRow =
    $("freshReleasesRow");

const categoryRow =
    $("categoryRow");

const studioSection =
    $("studios-you-might-like");

const studioRow =
    $("studioRow");

const playerPicksSection =
    $("player-picks");

const playerPicksRow =
    $("playerPicksRow");

const apxSection =
    $("best-on-apx");

const apxRow =
    $("apxRow");


/* =========================================================
   SAFETY
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
   UTILITY
========================================================= */

function unique(values) {

    return [
        ...new Set(values)
    ];
}


function gameById(id) {

    return STORE_GAMES.find(
        game =>
            game.id === id
    );
}


function gameURL(game) {

    return (
        `game.html?id=${
            encodeURIComponent(game.id)
        }`
    );
}


function prefersReducedMotion() {

    return window
        .matchMedia(
            "(prefers-reduced-motion: reduce)"
        )
        .matches;
}


function hasFinePointer() {

    return window
        .matchMedia(
            "(hover: hover) and (pointer: fine)"
        )
        .matches;
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
            <span class="coming-soon">
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


    const currentPrice =
        `$${Number(game.price).toFixed(2)}`;


    if (
        game.discount > 0 &&
        game.originalPrice !== null
    ) {

        return `

            <span class="discount">
                -${escapeHTML(game.discount)}%
            </span>

            <span class="old-price">
                $${Number(
                    game.originalPrice
                ).toFixed(2)}
            </span>

            <strong>
                ${currentPrice}
            </strong>
        `;
    }


    return `
        <strong>
            ${currentPrice}
        </strong>
    `;
}


/* =========================================================
   ARTWORK
========================================================= */

function hasFullArtwork(game) {

    return Boolean(
        game.artwork &&
        game.artwork.trim()
    );
}


function artworkSource(game) {

    return (
        game.artwork ||
        game.thumbnail ||
        "apex-logo.png"
    );
}


/* =========================================================
   GAME MEDIA

   V3 STRUCTURE:

   .store-game-media
       .store-game-artwork
           img
       video

   CSS scales .store-game-artwork — NOT the logo itself.
========================================================= */

function mediaHTML(game) {

    const fallback =
        !hasFullArtwork(game);


    return `

        <div class="store-game-media">

            <div
                class="
                    store-game-artwork
                    ${fallback ? "is-fallback" : ""}
                "
            >

                <img
                    src="${escapeHTML(
                        artworkSource(game)
                    )}"
                    alt=""
                    loading="lazy"
                    draggable="false"
                >

            </div>


            ${
                game.previewVideo
                    ? `

                        <video
                            class="store-game-preview"
                            muted
                            loop
                            playsinline
                            preload="none"
                            data-src="${escapeHTML(
                                game.previewVideo
                            )}"
                        ></video>

                    `
                    : ""
            }

        </div>
    `;
}


/* =========================================================
   PREVIEW VIDEO

   - Desktop/fine pointer only
   - Lazy loads
   - Muted
   - Stops + resets when leaving
   - Does not fake video when none exists
========================================================= */

function bindPreview(
    card,
    game
) {

    if (
        !game.previewVideo ||
        !hasFinePointer()
    ) {
        return;
    }


    const video =
        card.querySelector(
            ".store-game-preview"
        );


    if (!video) {
        return;
    }


    let hoverTimer = null;


    const start = () => {

        clearTimeout(
            hoverTimer
        );


        hoverTimer =
            window.setTimeout(
                async () => {

                    if (!video.src) {

                        video.src =
                            video.dataset.src || "";

                    }


                    if (!video.src) {
                        return;
                    }


                    card.classList.add(
                        "previewing"
                    );


                    try {

                        await video.play();

                    } catch (_) {

                        card.classList.remove(
                            "previewing"
                        );

                    }

                },
                325
            );
    };


    const stop = () => {

        clearTimeout(
            hoverTimer
        );


        card.classList.remove(
            "previewing"
        );


        video.pause();


        try {

            video.currentTime = 0;

        } catch (_) {

            /* browser may reject resetting before metadata */

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


    card.dataset.gameId =
        game.id;


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
   FEATURED SLIDE
========================================================= */

function createFeaturedSlide(game) {

    const slide =
        document.createElement("a");


    slide.className =
        "featured-slide";


    slide.href =
        gameURL(game);


    const fallback =
        !hasFullArtwork(game);


    const screenshotHTML =
        (game.screenshots || [])
            .slice(0, 4)
            .map(
                screenshot => `

                    <div class="featured-mini-shot">

                        <img
                            src="${escapeHTML(
                                screenshot
                            )}"
                            alt=""
                            loading="lazy"
                        >

                    </div>

                `
            )
            .join("");


    slide.innerHTML = `

        <div class="featured-slide-art">

            ${
                fallback
                    ? `

                        <div class="featured-fallback">

                            <img
                                src="${escapeHTML(
                                    game.thumbnail ||
                                    "apex-logo.png"
                                )}"
                                alt=""
                            >

                        </div>

                    `
                    : `

                        <img
                            class="featured-slide-artwork"
                            src="${escapeHTML(
                                game.artwork
                            )}"
                            alt=""
                            draggable="false"
                        >

                    `
            }


            <span class="featured-badge">
                ${escapeHTML(
                    game.featuredBadge ||
                    game.status
                )}
            </span>

        </div>


        <div class="featured-slide-info">

            <span class="section-label">
                ${escapeHTML(
                    game.developer.toUpperCase()
                )}
            </span>


            <h2>
                ${escapeHTML(game.title)}
            </h2>


            <p>
                ${escapeHTML(
                    game.description
                )}
            </p>


            ${
                screenshotHTML
                    ? `

                        <div class="featured-mini-shots">
                            ${screenshotHTML}
                        </div>

                    `
                    : ""
            }


            <div class="featured-tags">

                ${
                    game.tags
                        .slice(0, 5)
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


            <div class="featured-meta">

                <span class="featured-status">
                    ${escapeHTML(
                        game.platform
                    )}
                    ·
                    ${escapeHTML(
                        game.release
                    )}
                </span>


                <span class="featured-price">
                    ${
                        game.status === "Coming Soon"
                            ? "Coming Soon"
                            : game.price === 0
                                ? "Free to Play"
                                : `$${Number(
                                    game.price
                                ).toFixed(2)}`
                    }
                </span>

            </div>

        </div>
    `;


    return slide;
}


/* =========================================================
   FEATURED RENDER
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
                createFeaturedSlide(game)
            );


            const indicator =
                document.createElement(
                    "button"
                );


            indicator.type =
                "button";


            indicator.setAttribute(
                "aria-label",
                `Show ${game.title}`
            );


            indicator.addEventListener(
                "click",
                () => {

                    setFeatured(
                        index,
                        true
                    );

                }
            );


            featuredPagination.appendChild(
                indicator
            );

        }
    );


    featuredIndex = 0;


    setFeatured(
        0,
        false
    );


    const hasMultiple =
        games.length > 1;


    if (featuredPrevious) {

        featuredPrevious.hidden =
            !hasMultiple;

    }


    if (featuredNext) {

        featuredNext.hidden =
            !hasMultiple;

    }


    if (featuredPagination) {

        featuredPagination.hidden =
            !hasMultiple;

    }


    setupFeaturedInteraction();


    startFeatured();
}


/* =========================================================
   FEATURED POSITION
========================================================= */

function setFeatured(
    index,
    restartTimer = false
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
        `translateX(-${
            featuredIndex * 100
        }%)`;


    [
        ...featuredPagination.children
    ]
        .forEach(
            (
                indicator,
                indicatorIndex
            ) => {

                const active =
                    indicatorIndex ===
                    featuredIndex;


                indicator.classList.toggle(
                    "active",
                    active
                );


                indicator.setAttribute(
                    "aria-current",
                    active
                        ? "true"
                        : "false"
                );

            }
        );


    if (restartTimer) {

        stopFeatured();
        startFeatured();

    }
}


/* =========================================================
   FEATURED TIMER
========================================================= */

function startFeatured() {

    stopFeatured();


    if (
        featuredPaused ||
        prefersReducedMotion() ||
        !featuredTrack ||
        featuredTrack.children.length < 2
    ) {
        return;
    }


    featuredTimer =
        window.setInterval(
            () => {

                setFeatured(
                    featuredIndex + 1,
                    false
                );

            },
            STORE_CONFIG.featuredRotationMs
        );
}


function stopFeatured() {

    if (featuredTimer) {

        window.clearInterval(
            featuredTimer
        );


        featuredTimer =
            null;

    }
}


/* =========================================================
   FEATURED INTERACTION
========================================================= */

function setupFeaturedInteraction() {

    featuredPrevious
        ?.addEventListener(
            "click",
            () => {

                setFeatured(
                    featuredIndex - 1,
                    true
                );

            }
        );


    featuredNext
        ?.addEventListener(
            "click",
            () => {

                setFeatured(
                    featuredIndex + 1,
                    true
                );

            }
        );


    if (!featuredCarousel) {
        return;
    }


    const pause = () => {

        featuredPaused = true;

        stopFeatured();

    };


    const resume = () => {

        featuredPaused = false;

        startFeatured();

    };


    featuredCarousel.addEventListener(
        "mouseenter",
        pause
    );


    featuredCarousel.addEventListener(
        "mouseleave",
        resume
    );


    featuredCarousel.addEventListener(
        "focusin",
        pause
    );


    featuredCarousel.addEventListener(
        "focusout",
        event => {

            if (
                featuredCarousel.contains(
                    event.relatedTarget
                )
            ) {
                return;
            }


            resume();

        }
    );
}


/* =========================================================
   FRESH RELEASES
========================================================= */

function getFreshReleases() {

    return [
        ...STORE_GAMES
    ]
        .sort(
            (a, b) =>
                (
                    b.releaseOrder || 0
                ) -
                (
                    a.releaseOrder || 0
                )
        );
}


function renderFreshReleases() {

    renderGameRow(
        freshReleasesRow,
        getFreshReleases()
    );
}


/* =========================================================
   DEALS & EVENTS
========================================================= */

function renderDealsAndEvents() {

    if (
        !dealsSection ||
        !dealsRow
    ) {
        return;
    }


    dealsRow.innerHTML =
        "";


    const realEvents =
        STORE_EVENTS.filter(
            event =>
                event &&
                event.title
        );


    const discountedGames =
        STORE_GAMES.filter(
            game =>
                game.discount > 0 &&
                game.originalPrice !== null
        )
            .map(
                game => ({
                    type: "GAME DEAL",
                    title: game.title,
                    subtitle: "Limited-time offer",
                    href: gameURL(game),
                    artwork:
                        game.artwork ||
                        game.thumbnail,
                    discount:
                        game.discount,
                    game
                })
            );


    const items = [
        ...realEvents,
        ...discountedGames
    ];


    if (!items.length) {

        dealsSection.hidden =
            true;

        return;
    }


    items.forEach(
        item => {

            dealsRow.appendChild(
                createDealCard(item)
            );

        }
    );


    dealsSection.hidden =
        false;
}


/* =========================================================
   DEAL CARD
========================================================= */

function createDealCard(item) {

    const card =
        document.createElement("a");


    card.className =
        "deal-card";


    card.href =
        item.href || "#";


    const game =
        item.game || null;


    const artwork =
        item.artwork ||
        game?.artwork ||
        game?.thumbnail ||
        "apex-logo.png";


    const fallback =
        !item.artwork &&
        !game?.artwork;


    card.innerHTML = `

        <div class="deal-card-media">

            <img
                src="${escapeHTML(artwork)}"
                alt=""
                loading="lazy"
                style="${
                    fallback
                        ? "object-fit:contain;padding:54px;"
                        : ""
                }"
            >


            <span class="deal-type">
                ${escapeHTML(
                    item.type ||
                    "EVENT"
                )}
            </span>

        </div>


        <div class="deal-card-body">

            <div class="deal-card-info">

                <strong>
                    ${escapeHTML(
                        item.title
                    )}
                </strong>


                <span>
                    ${escapeHTML(
                        item.subtitle ||
                        ""
                    )}
                </span>

            </div>


            ${
                item.discount
                    ? `

                        <div class="deal-pricing">

                            <span class="deal-discount">
                                -${escapeHTML(
                                    item.discount
                                )}%
                            </span>

                        </div>

                    `
                    : ""
            }

        </div>
    `;


    return card;
}


/* =========================================================
   GENERIC GAME ROW
========================================================= */

function renderGameRow(
    row,
    games
) {

    if (!row) {
        return;
    }


    row.innerHTML =
        "";


    games.forEach(
        game => {

            row.appendChild(
                createGameCard(game)
            );

        }
    );
}


/* =========================================================
   PERSONALIZATION

   No activity = no fake personalization.
========================================================= */

function renderPersonalization() {

    if (
        !STORE_CONFIG.enablePersonalization
    ) {

        hidePersonalizedSections();

        return;
    }


    const owned =
        PLAYER_STORE_CONTEXT
            .ownedGameIds
            .map(gameById)
            .filter(Boolean);


    const played =
        PLAYER_STORE_CONTEXT
            .playedGameIds
            .map(gameById)
            .filter(Boolean);


    const activityGames =
        unique([
            ...owned.map(game => game.id),
            ...played.map(game => game.id)
        ])
            .map(gameById)
            .filter(Boolean);


    /*
       RECOMMENDED FOR YOU

       Require at least one real ownership/play signal.
    */

    if (
        recommendationsSection &&
        recommendedRow &&
        activityGames.length
    ) {

        const likedCategories =
            unique(
                activityGames.flatMap(
                    game =>
                        game.categories
                )
            );


        const recommendations =
            STORE_GAMES.filter(
                game => {

                    const alreadyKnown =
                        activityGames.some(
                            activity =>
                                activity.id ===
                                game.id
                        );


                    const categoryMatch =
                        game.categories.some(
                            category =>
                                likedCategories.includes(
                                    category
                                )
                        );


                    return (
                        !alreadyKnown &&
                        categoryMatch
                    );

                }
            );


        if (recommendations.length) {

            renderGameRow(
                recommendedRow,
                recommendations
            );


            recommendationsSection.hidden =
                false;

        } else {

            recommendationsSection.hidden =
                true;

        }

    } else if (recommendationsSection) {

        recommendationsSection.hidden =
            true;

    }


    /*
       BECAUSE YOU PLAYED
    */

    if (
        becauseSection &&
        becauseRow &&
        played.length
    ) {

        const sourceGame =
            played[
                played.length - 1
            ];


        const similar =
            STORE_GAMES.filter(
                game => {

                    if (
                        game.id ===
                        sourceGame.id
                    ) {
                        return false;
                    }


                    return game.categories.some(
                        category =>
                            sourceGame.categories.includes(
                                category
                            )
                    );

                }
            );


        if (similar.length) {

            if (becauseGameTitle) {

                becauseGameTitle.textContent =
                    sourceGame.title
                        ? ` ${sourceGame.title}`
                        : "";

            }


            renderGameRow(
                becauseRow,
                similar
            );


            becauseSection.hidden =
                false;

        } else {

            becauseSection.hidden =
                true;

        }

    } else if (becauseSection) {

        becauseSection.hidden =
            true;

    }


    renderStudios(
        activityGames
    );
}


function hidePersonalizedSections() {

    if (recommendationsSection) {
        recommendationsSection.hidden = true;
    }

    if (becauseSection) {
        becauseSection.hidden = true;
    }

    if (studioSection) {
        studioSection.hidden = true;
    }
}


/* =========================================================
   STUDIOS YOU MIGHT LIKE

   Only appears after player activity exists.
========================================================= */

function renderStudios(
    activityGames
) {

    if (
        !studioSection ||
        !studioRow
    ) {
        return;
    }


    if (!activityGames.length) {

        studioSection.hidden =
            true;

        return;
    }


    const knownStudios =
        unique(
            activityGames.flatMap(
                game => [
                    game.developer,
                    game.publisher
                ]
            )
        )
            .filter(Boolean);


    const studioGames =
        STORE_GAMES.filter(
            game =>
                knownStudios.includes(
                    game.developer
                ) ||
                knownStudios.includes(
                    game.publisher
                )
        );


    const studios =
        unique(
            studioGames.flatMap(
                game => [
                    game.developer,
                    game.publisher
                ]
            )
        )
            .filter(Boolean);


    if (!studios.length) {

        studioSection.hidden =
            true;

        return;
    }


    studioRow.innerHTML =
        "";


    studios.forEach(
        studio => {

            const matchingGames =
                STORE_GAMES.filter(
                    game =>
                        game.developer ===
                            studio ||
                        game.publisher ===
                            studio
                );


            studioRow.appendChild(
                createStudioCard(
                    studio,
                    matchingGames
                )
            );

        }
    );


    studioSection.hidden =
        false;
}


/* =========================================================
   STUDIO CARD
========================================================= */

function createStudioCard(
    studio,
    games
) {

    const card =
        document.createElement("a");


    /*
       Until developer profile/store pages exist, clicking a
       studio searches the Store for that studio.
    */

    card.href =
        "#games";


    card.className =
        "studio-card";


    const sampleGame =
        games[0];


    const art =
        sampleGame?.artwork ||
        sampleGame?.thumbnail ||
        "apex-logo.png";


    card.innerHTML = `

        <div class="studio-card-art">

            <img
                src="${escapeHTML(art)}"
                alt=""
                loading="lazy"
                style="${
                    !sampleGame?.artwork
                        ? "object-fit:contain;padding:36px;"
                        : ""
                }"
            >

        </div>


        <div class="studio-card-body">

            <div class="studio-logo">

                <img
                    src="apex-logo.png"
                    alt=""
                >

            </div>


            <div class="studio-name">
                ${escapeHTML(studio)}
            </div>

        </div>
    `;


    card.addEventListener(
        "click",
        event => {

            event.preventDefault();


            if (storeSearch) {

                storeSearch.value =
                    studio;

            }


            selectedCategory =
                "all";


            updateSearchState();

            renderGameCards();


            $("games")
                ?.scrollIntoView({
                    behavior:
                        prefersReducedMotion()
                            ? "auto"
                            : "smooth",

                    block: "start"
                });

        }
    );


    return card;
}


/* =========================================================
   PLAYER PICKS
========================================================= */

function renderPlayerPicks() {

    if (
        !playerPicksSection ||
        !playerPicksRow
    ) {
        return;
    }


    if (
        !STORE_CONFIG.enablePlayerPicks ||
        !PLAYER_PICKS.length
    ) {

        playerPicksSection.hidden =
            true;

        return;
    }


    const games =
        PLAYER_PICKS
            .map(gameById)
            .filter(Boolean);


    if (!games.length) {

        playerPicksSection.hidden =
            true;

        return;
    }


    renderGameRow(
        playerPicksRow,
        games
    );


    playerPicksSection.hidden =
        false;
}


/* =========================================================
   BEST ON APX
========================================================= */

function renderBestOnAPX() {

    if (
        !apxSection ||
        !apxRow
    ) {
        return;
    }


    if (
        !STORE_CONFIG
            .apxCloudGamingLaunched
    ) {

        apxSection.hidden =
            true;

        return;
    }


    const games =
        STORE_GAMES.filter(
            game =>
                game.apxOptimized
        );


    if (!games.length) {

        apxSection.hidden =
            true;

        return;
    }


    renderGameRow(
        apxRow,
        games
    );


    apxSection.hidden =
        false;
}


/* =========================================================
   CATEGORY DATA

   V3 only shows categories represented by real catalog games.
========================================================= */

const CATEGORY_LABELS = {
    action: "ACTION",
    adventure: "ADVENTURE",
    singleplayer: "SINGLEPLAYER",
    multiplayer: "MULTIPLAYER",
    racing: "RACING",
    strategy: "STRATEGY",
    simulation: "SIMULATION",
    sports: "SPORTS",
    horror: "HORROR",
    puzzle: "PUZZLE",
    casual: "CASUAL",
    "free-to-play": "FREE TO PLAY",
    apex: "APEX GAMES",
    "coming-soon": "COMING SOON"
};


/* =========================================================
   CATEGORY RENDER
========================================================= */

function renderCategories() {

    if (!categoryRow) {
        return;
    }


    categoryRow.innerHTML =
        "";


    const categories =
        unique(
            STORE_GAMES.flatMap(
                game =>
                    game.categories
            )
        );


    categories.forEach(
        category => {

            const games =
                STORE_GAMES.filter(
                    game =>
                        game.categories.includes(
                            category
                        )
                );


            if (!games.length) {
                return;
            }


            categoryRow.appendChild(
                createCategoryCard(
                    category,
                    games
                )
            );

        }
    );
}


/* =========================================================
   CATEGORY CARD
========================================================= */

function createCategoryCard(
    category,
    games
) {

    const card =
        document.createElement("a");


    card.href =
        "#games";


    card.className =
        "category-card";


    card.dataset.category =
        category;


    const label =
        CATEGORY_LABELS[category] ||
        category
            .replaceAll("-", " ")
            .toUpperCase();


    card.innerHTML = `

        <div
            class="category-card-background"
            aria-hidden="true"
        ></div>


        <span class="category-name">
            ${escapeHTML(label)}
        </span>
    `;


    card.addEventListener(
        "click",
        event => {

            event.preventDefault();


            selectedCategory =
                category;


            if (storeSearch) {

                storeSearch.value =
                    "";

            }


            updateSearchState();

            renderGameCards();


            $("games")
                ?.scrollIntoView({
                    behavior:
                        prefersReducedMotion()
                            ? "auto"
                            : "smooth",

                    block: "start"
                });

        }
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
                selectedCategory ===
                    "all" ||
                game.categories.includes(
                    selectedCategory
                );


            const searchText = [

                game.title,
                game.developer,
                game.publisher,
                game.description,
                game.genre,
                game.release,
                game.platform,
                game.status,

                ...game.categories,
                ...game.tags

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


            const searchMatch =
                !query ||
                searchText.includes(
                    query
                );


            return (
                categoryMatch &&
                searchMatch
            );

        }
    );
}


/* =========================================================
   BROWSE GAMES
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


    updateSearchState();
}


/* =========================================================
   SEARCH STATE
========================================================= */

function updateSearchState() {

    const query =
        (
            storeSearch?.value ||
            ""
        )
            .trim();


    const searching =
        query.length > 0;


    if (clearSearch) {

        clearSearch.hidden =
            !searching;

    }


    /*
       Typing in search turns the page into a focused catalog
       search. Category filtering alone does not.
    */

    storePage
        ?.classList
        .toggle(
            "searching",
            searching
        );
}


/* =========================================================
   SEARCH
========================================================= */

storeSearch
    ?.addEventListener(
        "input",
        () => {

            selectedCategory =
                "all";


            renderGameCards();

        }
    );


clearSearch
    ?.addEventListener(
        "click",
        () => {

            if (!storeSearch) {
                return;
            }


            storeSearch.value =
                "";


            selectedCategory =
                "all";


            renderGameCards();


            storeSearch.focus();

        }
    );


/* =========================================================
   SHOW ALL
========================================================= */

showAllGames
    ?.addEventListener(
        "click",
        () => {

            selectedCategory =
                "all";


            if (storeSearch) {

                storeSearch.value =
                    "";

            }


            renderGameCards();


            $("games")
                ?.scrollIntoView({
                    behavior:
                        prefersReducedMotion()
                            ? "auto"
                            : "smooth",

                    block: "start"
                });

        }
    );


/* =========================================================
   RESET STORE
========================================================= */

resetStore
    ?.addEventListener(
        "click",
        () => {

            selectedCategory =
                "all";


            if (storeSearch) {

                storeSearch.value =
                    "";

            }


            renderGameCards();

        }
    );


/* =========================================================
   STORE NAVIGATION
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
                            behavior:
                                prefersReducedMotion()
                                    ? "auto"
                                    : "smooth",

                            block: "start"
                        });

                }
            );

        }
    );


/* =========================================================
   HORIZONTAL CAROUSELS

   Arrows:
   - hidden if row does not overflow
   - left disabled at beginning
   - right disabled at end
   - scroll roughly one visible group
========================================================= */

function setupHorizontalCarousels() {

    document
        .querySelectorAll(
            "[data-carousel-track]"
        )
        .forEach(
            track => {

                const name =
                    track.dataset
                        .carouselTrack;


                const previous =
                    document.querySelector(
                        `[data-carousel-previous="${name}"]`
                    );


                const next =
                    document.querySelector(
                        `[data-carousel-next="${name}"]`
                    );


                if (
                    !previous ||
                    !next
                ) {
                    return;
                }


                const update = () => {

                    updateCarouselControls(
                        track,
                        previous,
                        next
                    );

                };


                previous.addEventListener(
                    "click",
                    () => {

                        scrollCarousel(
                            track,
                            -1
                        );

                    }
                );


                next.addEventListener(
                    "click",
                    () => {

                        scrollCarousel(
                            track,
                            1
                        );

                    }
                );


                track.addEventListener(
                    "scroll",
                    update,
                    {
                        passive: true
                    }
                );


                requestAnimationFrame(
                    update
                );

            }
        );


    window.addEventListener(
        "resize",
        refreshCarouselControls
    );
}


/* =========================================================
   CAROUSEL SCROLL
========================================================= */

function scrollCarousel(
    track,
    direction
) {

    const amount =
        Math.max(
            220,
            track.clientWidth * .82
        );


    track.scrollBy({
        left:
            amount *
            direction,

        behavior:
            prefersReducedMotion()
                ? "auto"
                : "smooth"
    });
}


/* =========================================================
   CAROUSEL ARROW STATE
========================================================= */

function updateCarouselControls(
    track,
    previous,
    next
) {

    const tolerance = 3;


    const maxScroll =
        Math.max(
            0,
            track.scrollWidth -
            track.clientWidth
        );


    const overflowing =
        maxScroll >
        tolerance;


    /*
       If all items fit, neither arrow exists visually.
    */

    previous.hidden =
        !overflowing;


    next.hidden =
        !overflowing;


    if (!overflowing) {

        previous.disabled =
            true;

        next.disabled =
            true;

        return;
    }


    previous.disabled =
        track.scrollLeft <=
        tolerance;


    next.disabled =
        track.scrollLeft >=
        maxScroll -
        tolerance;
}


/* =========================================================
   REFRESH ALL ROW ARROWS
========================================================= */

function refreshCarouselControls() {

    document
        .querySelectorAll(
            "[data-carousel-track]"
        )
        .forEach(
            track => {

                const name =
                    track.dataset
                        .carouselTrack;


                const previous =
                    document.querySelector(
                        `[data-carousel-previous="${name}"]`
                    );


                const next =
                    document.querySelector(
                        `[data-carousel-next="${name}"]`
                    );


                if (
                    previous &&
                    next
                ) {

                    updateCarouselControls(
                        track,
                        previous,
                        next
                    );

                }

            }
        );
}


/* =========================================================
   VIEW ALL DEALS
========================================================= */

$("viewAllDeals")
    ?.addEventListener(
        "click",
        () => {

            dealsSection
                ?.scrollIntoView({
                    behavior:
                        prefersReducedMotion()
                            ? "auto"
                            : "smooth",

                    block: "start"
                });

        }
    );


/* =========================================================
   OPTIONAL PLAYER CONTEXT BRIDGE

   Other Apex systems can later call:

   window.ApexStore.setPlayerContext({
       ownedGameIds: [...],
       playedGameIds: [...],
       followedDevelopers: [...],
       favoriteCategories: [...]
   });

   That lets Library/Presence/account data activate personalized
   sections without hardcoding fake history into Store V3.
========================================================= */

function setPlayerContext(
    context = {}
) {

    if (
        Array.isArray(
            context.ownedGameIds
        )
    ) {

        PLAYER_STORE_CONTEXT
            .ownedGameIds =
                [
                    ...context
                        .ownedGameIds
                ];

    }


    if (
        Array.isArray(
            context.playedGameIds
        )
    ) {

        PLAYER_STORE_CONTEXT
            .playedGameIds =
                [
                    ...context
                        .playedGameIds
                ];

    }


    if (
        Array.isArray(
            context.followedDevelopers
        )
    ) {

        PLAYER_STORE_CONTEXT
            .followedDevelopers =
                [
                    ...context
                        .followedDevelopers
                ];

    }


    if (
        Array.isArray(
            context.favoriteCategories
        )
    ) {

        PLAYER_STORE_CONTEXT
            .favoriteCategories =
                [
                    ...context
                        .favoriteCategories
                ];

    }


    renderPersonalization();


    requestAnimationFrame(
        refreshCarouselControls
    );
}


/* =========================================================
   PUBLIC STORE API
========================================================= */

window.ApexStore = {

    setPlayerContext,

    refresh() {

        renderAll();

    },

    getGames() {

        return STORE_GAMES.map(
            game => ({
                ...game
            })
        );

    }

};


/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {

    renderFeatured();

    renderDealsAndEvents();

    renderPersonalization();

    renderFreshReleases();

    renderCategories();

    renderPlayerPicks();

    renderBestOnAPX();

    renderGameCards();


    requestAnimationFrame(
        refreshCarouselControls
    );
}


/* =========================================================
   START
========================================================= */

renderAll();

setupHorizontalCarousels();


/*
   Images/fonts can slightly change final widths after the first
   layout pass, so check overflow again after the page loads.
*/

window.addEventListener(
    "load",
    () => {

        refreshCarouselControls();

    }
);


console.log(
    "[Apex Games] Store V3 ready."
);

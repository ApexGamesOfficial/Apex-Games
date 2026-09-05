document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* =================================================
           NEWS SPOTLIGHT
           Changes automatically every 2 days
        ================================================= */

        if (
            typeof apexNews !== "undefined" &&
            apexNews.length > 0
        ) {

            const TWO_DAYS =
                1000 *
                60 *
                60 *
                24 *
                2;


            const spotlightIndex =
                Math.floor(
                    Date.now() /
                    TWO_DAYS
                ) %
                apexNews.length;


            const story =
                apexNews[
                    spotlightIndex
                ];


            const image =
                document.getElementById(
                    "spotlightImage"
                );

            const category =
                document.getElementById(
                    "spotlightCategory"
                );

            const date =
                document.getElementById(
                    "spotlightDate"
                );

            const title =
                document.getElementById(
                    "spotlightTitle"
                );

            const description =
                document.getElementById(
                    "spotlightDescription"
                );

            const link =
                document.getElementById(
                    "spotlightLink"
                );


            if (category) {
                category.textContent =
                    story.category;
            }


            if (date) {
                date.textContent =
                    story.date;
            }


            if (title) {
                title.textContent =
                    story.title;
            }


            if (description) {
                description.textContent =
                    story.description;
            }


            if (link) {
                link.href =
                    story.link;
            }


            if (
                image &&
                story.image
            ) {

                image.style.backgroundImage =
                    `
                    linear-gradient(
                        0deg,
                        rgba(6,8,11,.75),
                        transparent 65%
                    ),
                    url("${story.image}")
                    `;

            }

        }



        /* =================================================
           LATEST NEWS
        ================================================= */

        const latestGrid =
            document.getElementById(
                "latestNewsGrid"
            );


        if (
            latestGrid &&
            typeof apexNews !== "undefined"
        ) {

            latestGrid.innerHTML =
                "";


            apexNews
                .slice(
                    0,
                    3
                )
                .forEach(
                    story => {

                        const card =
                            document.createElement(
                                "a"
                            );


                        card.className =
                            "news-card";


                        card.href =
                            story.link;


                        const imageStyle =
                            story.image
                                ?
                                `
                                background-image:
                                    linear-gradient(
                                        0deg,
                                        rgba(5,7,10,.45),
                                        transparent
                                    ),
                                    url('${story.image}')
                                `
                                :
                                "";


                        card.innerHTML =
                            `

                            <div
                                class="news-card-image"
                                style="${imageStyle}"
                            ></div>


                            <div class="news-card-content">

                                <div class="news-card-meta">

                                    ${story.category}
                                    ·
                                    ${story.date}

                                </div>


                                <h3>
                                    ${story.title}
                                </h3>


                                <p>
                                    ${story.description}
                                </p>

                            </div>

                            `;


                        latestGrid.appendChild(
                            card
                        );

                    }
                );

        }



        /* =================================================
           DESKTOP SEARCH
        ================================================= */

        const searchForm =
            document.getElementById(
                "navSearch"
            );


        const searchInput =
            document.getElementById(
                "navSearchInput"
            );


        function submitSearch(
            input
        ) {

            if (!input) {
                return;
            }


            const query =
                input.value.trim();


            if (!query) {
                return;
            }


            window.location.href =
                `search.html?q=${
                    encodeURIComponent(
                        query
                    )
                }`;

        }


        searchForm?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                submitSearch(
                    searchInput
                );

            }
        );



        /* =================================================
           MOBILE MENU
        ================================================= */

        const mobileMenu =
            document.getElementById(
                "mobileMenu"
            );


        const mobileMenuButton =
            document.getElementById(
                "mobileMenuButton"
            );


        const mobileMenuClose =
            document.getElementById(
                "mobileMenuClose"
            );


        const mobileMenuBackdrop =
            document.getElementById(
                "mobileMenuBackdrop"
            );


        const mobileSearchButton =
            document.getElementById(
                "mobileSearchButton"
            );


        const mobileSearch =
            document.getElementById(
                "mobileSearch"
            );


        const mobileSearchInput =
            document.getElementById(
                "mobileSearchInput"
            );



        function openMobileMenu(
            focusSearch = false
        ) {

            document.body.classList.add(
                "mobile-menu-open"
            );


            mobileMenu?.setAttribute(
                "aria-hidden",
                "false"
            );


            mobileMenuButton?.setAttribute(
                "aria-expanded",
                "true"
            );


            mobileMenuBackdrop?.setAttribute(
                "aria-hidden",
                "false"
            );


            if (
                focusSearch &&
                mobileSearchInput
            ) {

                window.setTimeout(
                    () => {

                        mobileSearchInput.focus();

                    },
                    280
                );

            }

        }



        function closeMobileMenu() {

            document.body.classList.remove(
                "mobile-menu-open"
            );


            mobileMenu?.setAttribute(
                "aria-hidden",
                "true"
            );


            mobileMenuButton?.setAttribute(
                "aria-expanded",
                "false"
            );


            mobileMenuBackdrop?.setAttribute(
                "aria-hidden",
                "true"
            );

        }



        mobileMenuButton?.addEventListener(
            "click",
            () => {

                const isOpen =
                    document.body.classList.contains(
                        "mobile-menu-open"
                    );


                if (isOpen) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );



        mobileMenuClose?.addEventListener(
            "click",
            closeMobileMenu
        );



        mobileMenuBackdrop?.addEventListener(
            "click",
            closeMobileMenu
        );



        mobileSearchButton?.addEventListener(
            "click",
            () => {

                openMobileMenu(
                    true
                );

            }
        );



        mobileSearch?.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                submitSearch(
                    mobileSearchInput
                );

            }
        );



        /* ESC closes menu */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeMobileMenu();

                }

            }
        );



        /* =================================================
           CLOSE MOBILE MENU WHEN RETURNING TO DESKTOP
        ================================================= */

        const desktopMedia =
            window.matchMedia(
                "(min-width: 951px)"
            );


        function handleDesktopChange(
            event
        ) {

            if (
                event.matches
            ) {

                closeMobileMenu();

            }

        }


        if (
            typeof desktopMedia
                .addEventListener ===
            "function"
        ) {

            desktopMedia.addEventListener(
                "change",
                handleDesktopChange
            );

        }



        /* =================================================
           MOBILE ACCOUNT SYNC

           account-state.js controls the original desktop
           account elements.

           We mirror those values into the mobile menu.
        ================================================= */

        const desktopLoggedOut =
            document.getElementById(
                "loggedOutAccount"
            );


        const desktopProfile =
            document.getElementById(
                "profileWidget"
            );


        const desktopPicture =
            document.getElementById(
                "profilePicture"
            );


        const desktopGamertag =
            document.getElementById(
                "profileGamertag"
            );


        const mobileLoggedOut =
            document.getElementById(
                "mobileLoggedOutAccount"
            );


        const mobileProfile =
            document.getElementById(
                "mobileProfileWidget"
            );


        const mobilePicture =
            document.getElementById(
                "mobileProfilePicture"
            );


        const mobileGamertag =
            document.getElementById(
                "mobileProfileGamertag"
            );



        function syncMobileAccount() {

            if (
                !desktopProfile ||
                !mobileProfile ||
                !mobileLoggedOut
            ) {

                return;
            }


            const loggedIn =
                !desktopProfile.hidden;


            if (
                loggedIn
            ) {

                mobileLoggedOut.hidden =
                    true;


                mobileProfile.hidden =
                    false;


                if (
                    desktopGamertag &&
                    mobileGamertag
                ) {

                    mobileGamertag.textContent =
                        desktopGamertag
                            .textContent
                            .trim() ||
                        "Player";

                }


                if (
                    desktopPicture &&
                    mobilePicture
                ) {

                    mobilePicture.src =
                        desktopPicture.src;

                }

            } else {

                mobileLoggedOut.hidden =
                    false;


                mobileProfile.hidden =
                    true;

            }

        }



        syncMobileAccount();



        /*
           account-state.js changes the desktop account
           after Supabase finishes loading.

           MutationObserver lets the mobile version follow
           those changes automatically.
        */

        if (
            desktopProfile &&
            desktopLoggedOut
        ) {

            const accountObserver =
                new MutationObserver(
                    syncMobileAccount
                );


            accountObserver.observe(
                desktopProfile,
                {
                    attributes: true,
                    attributeFilter: [
                        "hidden"
                    ],
                    childList: true,
                    subtree: true
                }
            );


            accountObserver.observe(
                desktopLoggedOut,
                {
                    attributes: true,
                    attributeFilter: [
                        "hidden"
                    ]
                }
            );


            if (
                desktopGamertag
            ) {

                accountObserver.observe(
                    desktopGamertag,
                    {
                        childList: true,
                        subtree: true,
                        characterData: true
                    }
                );

            }


            if (
                desktopPicture
            ) {

                accountObserver.observe(
                    desktopPicture,
                    {
                        attributes: true,
                        attributeFilter: [
                            "src"
                        ]
                    }
                );

            }

        }

    }
);

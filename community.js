/* =========================================================
   APEX GAMES — COMMUNITY
   community.js
   ========================================================= */

(() => {
    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const guidelinesButton =
        document.getElementById(
            "communityGuidelinesButton"
        );

    const guidelinesModal =
        document.getElementById(
            "communityGuidelinesModal"
        );

    const modalBackdrop =
        document.getElementById(
            "communityModalBackdrop"
        );

    const guidelinesClose =
        document.getElementById(
            "communityGuidelinesClose"
        );

    const guidelinesDone =
        document.getElementById(
            "communityGuidelinesDone"
        );

    const playerSearchForm =
        document.getElementById(
            "communityPlayerSearch"
        );

    const playerSearchInput =
        document.getElementById(
            "communityPlayerSearchInput"
        );

    const playerSearchMessage =
        document.getElementById(
            "playerSearchMessage"
        );


    /* =====================================================
       COMMUNITY GUIDELINES MODAL
    ===================================================== */

    let previousFocus = null;


    function openGuidelines() {

        if (
            !guidelinesModal ||
            !modalBackdrop
        ) {
            return;
        }

        previousFocus =
            document.activeElement;

        guidelinesModal.hidden = false;
        modalBackdrop.hidden = false;

        document.body.classList.add(
            "modal-open"
        );

        guidelinesClose?.focus();
    }


    function closeGuidelines() {

        if (
            !guidelinesModal ||
            !modalBackdrop
        ) {
            return;
        }

        guidelinesModal.hidden = true;
        modalBackdrop.hidden = true;

        document.body.classList.remove(
            "modal-open"
        );

        if (
            previousFocus &&
            typeof previousFocus.focus === "function"
        ) {
            previousFocus.focus();
        }
    }


    guidelinesButton?.addEventListener(
        "click",
        openGuidelines
    );


    guidelinesClose?.addEventListener(
        "click",
        closeGuidelines
    );


    guidelinesDone?.addEventListener(
        "click",
        closeGuidelines
    );


    modalBackdrop?.addEventListener(
        "click",
        closeGuidelines
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                guidelinesModal &&
                !guidelinesModal.hidden
            ) {
                closeGuidelines();
            }

        }
    );


    /* =====================================================
       PLAYER SEARCH

       This intentionally does NOT fake player results.

       Once the Apex Games public-profile search backend is
       ready, this form can be connected to that endpoint.
    ===================================================== */

    playerSearchForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const query =
                playerSearchInput
                    ?.value
                    .trim() || "";


            if (!query) {

                if (playerSearchMessage) {
                    playerSearchMessage.textContent =
                        "Enter a gamertag to search.";
                }

                playerSearchInput?.focus();

                return;
            }


            /*
             * Do not invent players or expose account data
             * from the client.
             *
             * Public profile discovery should eventually
             * use a server-controlled/public-safe query.
             */

            if (playerSearchMessage) {
                playerSearchMessage.textContent =
                    "Player search will become available when public profile discovery is connected.";
            }

        }
    );


    playerSearchInput?.addEventListener(
        "input",
        () => {

            if (playerSearchMessage) {
                playerSearchMessage.textContent = "";
            }

        }
    );


    /* =====================================================
       READY
    ===================================================== */

    console.info(
        "[Apex Games Community] Community Home ready."
    );

})();

/* =========================================================
   APEX GAMES — GLOBAL NAVIGATION
   apex-nav.js
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       CONFIG
       ===================================================== */

    const DEFAULT_AVATAR =
        "Default Apex Games Profile Picture.png";

    const PAGE =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() || "index.html";


    /* =====================================================
       HELPERS
       ===================================================== */

    const escapeHTML = value =>
        String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");


    function pageIs(...pages) {
        return pages.includes(PAGE);
    }


    function createChevron() {
        return `
            <span
                class="nav-chevron"
                aria-hidden="true"
            ></span>
        `;
    }


    /* =====================================================
       FIND EXISTING NAVBAR
       ===================================================== */

    const oldTopbar =
        document.querySelector(".topbar");

    if (!oldTopbar) {
        console.warn(
            "[Apex Nav] No .topbar was found on this page."
        );

        return;
    }


    /* =====================================================
       NAVBAR MARKUP
       ===================================================== */

    const topbar =
        document.createElement("header");

    topbar.className = "topbar";
    topbar.id = "apexGlobalNav";

    topbar.innerHTML = `

        <div class="nav-left">

            <a
                href="index.html"
                class="brand"
                aria-label="Apex Games Home"
            >
                <img
                    src="apex-logo.png"
                    alt="Apex Games"
                >
            </a>


            <nav
                class="main-nav"
                aria-label="Main navigation"
            >

                <!-- HOME -->

                <div class="nav-item">

                    <a
                        href="index.html"
                        class="nav-link
                        ${
                            pageIs(
                                "index.html",
                                ""
                            )
                                ? "active"
                                : ""
                        }"
                    >
                        Home
                    </a>

                </div>


                <!-- LIBRARY -->

                <div
                    class="nav-item nav-dropdown-item"
                    data-nav-dropdown="library"
                >

                    <div class="nav-split-control">

                        <a
                            href="library.html"
                            class="nav-link nav-split-link ${
                                pageIs("library.html")
                                    ? "active"
                                    : ""
                            }"
                        >
                            Library
                        </a>

                        <button
                            class="nav-dropdown-trigger nav-arrow-trigger"
                            type="button"
                            aria-label="Open Library menu"
                            aria-expanded="false"
                            aria-haspopup="true"
                        >
                            ${createChevron()}
                        </button>

                    </div>


                    <div
                        class="nav-dropdown"
                        role="menu"
                    >

                        <a
                            href="library.html"
                            role="menuitem"
                        >
                            Home
                        </a>

                        <a
                            href="library.html?filter=all"
                            role="menuitem"
                        >
                            All Games
                        </a>

                        <a
                            href="library.html?filter=installed"
                            role="menuitem"
                        >
                            Installed
                        </a>

                        <a
                            href="library.html?filter=favorites"
                            role="menuitem"
                        >
                            Favorites
                        </a>

                    </div>

                </div>


                <!-- CHAT -->

                <div class="nav-item">

                    <a
                        href="chat.html"
                        class="nav-link
                        ${
                            pageIs("chat.html")
                                ? "active"
                                : ""
                        }"
                    >
                        Chat
                    </a>

                </div>


                <!-- STORE -->

                <div
                    class="nav-item nav-dropdown-item"
                    data-nav-dropdown="store"
                >

                    <div class="nav-split-control">

                        <a
                            href="store.html"
                            class="nav-link nav-split-link ${
                                pageIs(
                                    "store.html",
                                    "wishlist.html",
                                    "points-shop.html"
                                )
                                    ? "active"
                                    : ""
                            }"
                        >
                            Store
                        </a>

                        <button
                            class="nav-dropdown-trigger nav-arrow-trigger"
                            type="button"
                            aria-label="Open Store menu"
                            aria-expanded="false"
                            aria-haspopup="true"
                        >
                            ${createChevron()}
                        </button>

                    </div>


                    <div
                        class="nav-dropdown"
                        role="menu"
                    >

                        <a
                            href="store.html"
                            role="menuitem"
                        >
                            Your Store
                        </a>

                        <a
                            href="store.html#new-noteworthy"
                            role="menuitem"
                        >
                            New &amp; Noteworthy
                        </a>

                        <a
                            href="store.html#categories"
                            role="menuitem"
                        >
                            Categories
                        </a>

                        <a
                            href="points-shop.html"
                            role="menuitem"
                        >
                            Points Shop
                        </a>

                        <a
                            href="wishlist.html"
                            role="menuitem"
                        >
                            Wishlist
                        </a>

                    </div>

                </div>


                <!-- COMMUNITY -->

                <div
                    class="nav-item nav-dropdown-item"
                    data-nav-dropdown="community"
                >

                    <div class="nav-split-control">

                        <a
                            href="community.html"
                            class="nav-link nav-split-link ${
                                pageIs(
                                    "community.html",
                                    "discussions.html",
                                    "activity.html",
                                    "creators.html",
                                    "friends.html"
                                )
                                    ? "active"
                                    : ""
                            }"
                        >
                            Community
                        </a>

                        <button
                            class="nav-dropdown-trigger nav-arrow-trigger"
                            type="button"
                            aria-label="Open Community menu"
                            aria-expanded="false"
                            aria-haspopup="true"
                        >
                            ${createChevron()}
                        </button>

                    </div>


                    <div
                        class="nav-dropdown"
                        role="menu"
                    >

                        <a
                            href="community.html"
                            role="menuitem"
                        >
                            Community Home
                        </a>

                        <a
                            href="discussions.html"
                            role="menuitem"
                        >
                            Discussions
                        </a>

                        <a
                            href="activity.html"
                            role="menuitem"
                        >
                            Activity
                        </a>

                        <a
                            href="creators.html"
                            role="menuitem"
                        >
                            Creators
                        </a>

                        <a
                            href="friends.html"
                            role="menuitem"
                        >
                            Friends
                        </a>

                    </div>

                </div>


                <!-- NEWS -->

                <div class="nav-item">

                    <a
                        href="news.html"
                        class="nav-link
                        ${
                            pageIs("news.html")
                                ? "active"
                                : ""
                        }"
                    >
                        News
                    </a>

                </div>


                <!-- ABOUT -->

                <div class="nav-item">

                    <a
                        href="about.html"
                        class="nav-link
                        ${
                            pageIs("about.html")
                                ? "active"
                                : ""
                        }"
                    >
                        About
                    </a>

                </div>

            </nav>

        </div>


        <!-- =============================================
             GLOBAL SEARCH
             ============================================= -->

        <form
            class="nav-search"
            id="navSearch"
            role="search"
        >

            <span
                class="search-icon"
                aria-hidden="true"
            >
                ⌕
            </span>

            <input
                type="search"
                id="navSearchInput"
                placeholder="Search Apex Games"
                autocomplete="off"
                aria-label="Search Apex Games"
            >

        </form>


        <!-- =============================================
             RIGHT SIDE
             ============================================= -->

        <div class="nav-right">


            <!-- INSTALL CLIENT -->

            <a
                href="client.html"
                class="install-client-button"
            >
                Install Client
            </a>


            <!-- NOTIFICATIONS -->

            <div
                class="notification-wrapper"
                id="notificationWrapper"
            >

                <button
                    class="notification-button"
                    id="notificationButton"
                    type="button"
                    aria-label="Notifications"
                    aria-expanded="false"
                    aria-haspopup="true"
                >

                    <span
                        class="notification-bell"
                        aria-hidden="true"
                    ></span>

                    <span
                        class="notification-badge"
                        id="notificationBadge"
                        aria-label="Unread notifications"
                    >
                        0
                    </span>

                </button>


                <section
                    class="notification-panel"
                    id="notificationPanel"
                    aria-label="Notifications"
                >

                    <div class="notification-header">

                        <strong>
                            Notifications
                        </strong>

                        <button
                            type="button"
                            id="markNotificationsRead"
                        >
                            Mark all read
                        </button>

                    </div>


                    <div
                        class="notification-list"
                        id="notificationList"
                    >

                        <div class="notification-empty">
                            No notifications yet.
                        </div>

                    </div>


                    <div class="notification-footer">

                        <a href="notifications.html">
                            View all notifications
                        </a>

                    </div>

                </section>

            </div>


            <!-- ACCOUNT -->

            <div
                class="nav-account"
                id="apexNavAccount"
            >

                <!-- LOGGED OUT -->

                <div
                    class="logged-out-account"
                    id="loggedOutAccount"
                >

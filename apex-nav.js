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

       We replace the current page's topbar instead of
       requiring every page to duplicate the new markup.
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

                    <button
                        class="nav-dropdown-trigger
                        ${
                            pageIs("library.html")
                                ? "active"
                                : ""
                        }"
                        type="button"
                        aria-expanded="false"
                        aria-haspopup="true"
                    >
                        Library
                        ${createChevron()}
                    </button>

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

                    <button
                        class="nav-dropdown-trigger
                        ${
                            pageIs(
                                "store.html",
                                "wishlist.html",
                                "points-shop.html"
                            )
                                ? "active"
                                : ""
                        }"
                        type="button"
                        aria-expanded="false"
                        aria-haspopup="true"
                    >
                        Store
                        ${createChevron()}
                    </button>

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

                    <button
                        class="nav-dropdown-trigger
                        ${
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
                        type="button"
                        aria-expanded="false"
                        aria-haspopup="true"
                    >
                        Community
                        ${createChevron()}
                    </button>

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

                    <a
                        href="login.html"
                        class="login-link"
                    >
                        Log In
                    </a>

                    <a
                        href="signup.html"
                        class="create-account-button"
                    >
                        Create Account
                    </a>

                </div>


                <!-- LOGGED IN -->

                <button
                    class="profile-widget"
                    id="profileWidget"
                    type="button"
                    aria-expanded="false"
                    aria-haspopup="true"
                    hidden
                >

                    <img
                        src="${DEFAULT_AVATAR}"
                        alt=""
                        id="profilePicture"
                    >

                    <span class="profile-widget-copy">

                        <span id="profileGamertag">
                            Player
                        </span>

                        <span
                            class="profile-wallet"
                            id="profileWallet"
                        >
                            Wallet
                        </span>

                    </span>

                    <span
                        class="profile-arrow"
                        aria-hidden="true"
                    ></span>

                </button>


                <!-- PROFILE DROPDOWN -->

                <section
                    class="account-dropdown"
                    id="accountDropdown"
                    aria-label="Account menu"
                >

                    <div class="account-dropdown-header">

                        <img
                            src="${DEFAULT_AVATAR}"
                            alt=""
                            id="accountDropdownAvatar"
                        >

                        <div>

                            <span
                                class="account-dropdown-name"
                                id="accountDropdownName"
                            >
                                Player
                            </span>

                            <span
                                class="account-dropdown-status"
                            >

                                <span
                                    class="account-status-dot"
                                ></span>

                                <span
                                    id="accountDropdownStatus"
                                >
                                    Online
                                </span>

                            </span>

                        </div>

                    </div>


                    <div class="account-menu">

                        <a href="profile.html">
                            <span>Profile</span>
                        </a>

                        <a href="account.html">
                            <span>Account Info</span>
                        </a>

                        <a href="wallet.html">

                            <span>
                                Apex Games Wallet
                            </span>

                            <span
                                class="account-menu-secondary"
                                id="accountWalletBalance"
                            >
                                —
                            </span>

                        </a>

                        <a href="purchase-history.html">
                            <span>
                                Purchase History
                            </span>
                        </a>

                        <div
                            class="account-menu-separator"
                        ></div>

                        <a href="friends.html">
                            <span>Friends</span>
                        </a>

                        <a href="settings.html">
                            <span>Settings</span>
                        </a>

                        <a href="support.html">
                            <span>Support</span>
                        </a>

                        <div
                            class="account-menu-separator"
                        ></div>

                        <button
                            type="button"
                            id="apexNavLogout"
                        >
                            <span>Log Out</span>
                        </button>

                    </div>

                </section>

            </div>

        </div>
    `;


    oldTopbar.replaceWith(topbar);


    /* =====================================================
       REFERENCES
       ===================================================== */

    const dropdownItems =
        [
            ...topbar.querySelectorAll(
                ".nav-dropdown-item"
            )
        ];

    const notificationWrapper =
        document.getElementById(
            "notificationWrapper"
        );

    const notificationButton =
        document.getElementById(
            "notificationButton"
        );

    const navAccount =
        document.getElementById(
            "apexNavAccount"
        );

    const profileWidget =
        document.getElementById(
            "profileWidget"
        );


    /* =====================================================
       CLOSE MENUS
       ===================================================== */

    function closeNavDropdowns(
        except = null
    ) {

        dropdownItems.forEach(item => {

            if (item === except) {
                return;
            }

            item.classList.remove(
                "dropdown-open"
            );

            item
                .querySelector(
                    ".nav-dropdown-trigger"
                )
                ?.setAttribute(
                    "aria-expanded",
                    "false"
                );

        });

    }


    function closeNotifications() {

        notificationWrapper
            ?.classList
            .remove("dropdown-open");

        notificationButton
            ?.setAttribute(
                "aria-expanded",
                "false"
            );

    }


    function closeAccountMenu() {

        navAccount
            ?.classList
            .remove("dropdown-open");

        profileWidget
            ?.setAttribute(
                "aria-expanded",
                "false"
            );

    }


    function closeEverything() {

        closeNavDropdowns();
        closeNotifications();
        closeAccountMenu();

    }


    /* =====================================================
       NAV DROPDOWNS
       ===================================================== */

    dropdownItems.forEach(item => {

        const trigger =
            item.querySelector(
                ".nav-dropdown-trigger"
            );

        trigger?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const opening =
                    !item.classList.contains(
                        "dropdown-open"
                    );

                closeEverything();

                if (opening) {

                    item.classList.add(
                        "dropdown-open"
                    );

                    trigger.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            }
        );

    });


    /* =====================================================
       NOTIFICATIONS DROPDOWN
       ===================================================== */

    notificationButton
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const opening =
                    !notificationWrapper
                        .classList
                        .contains(
                            "dropdown-open"
                        );

                closeEverything();

                if (opening) {

                    notificationWrapper
                        .classList
                        .add(
                            "dropdown-open"
                        );

                    notificationButton
                        .setAttribute(
                            "aria-expanded",
                            "true"
                        );

                }

            }
        );


    /* =====================================================
       PROFILE DROPDOWN
       ===================================================== */

    profileWidget
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const opening =
                    !navAccount
                        .classList
                        .contains(
                            "dropdown-open"
                        );

                closeEverything();

                if (opening) {

                    navAccount
                        .classList
                        .add(
                            "dropdown-open"
                        );

                    profileWidget
                        .setAttribute(
                            "aria-expanded",
                            "true"
                        );

                }

            }
        );


    /* =====================================================
       CLICK OUTSIDE / ESCAPE
       ===================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                !topbar.contains(
                    event.target
                )
            ) {

                closeEverything();
                return;

            }

            const insideOpenMenu =
                event.target.closest(
                    ".nav-dropdown," +
                    ".notification-panel," +
                    ".account-dropdown"
                );

            if (!insideOpenMenu) {
                return;
            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeEverything();

            }

        }
    );


    /* =====================================================
       SEARCH
       ===================================================== */

    const navSearch =
        document.getElementById(
            "navSearch"
        );

    const navSearchInput =
        document.getElementById(
            "navSearchInput"
        );


    navSearch?.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const query =
                navSearchInput
                    ?.value
                    .trim();

            if (!query) {
                return;
            }

            window.location.href =
                `search.html?q=${
                    encodeURIComponent(query)
                }`;

        }
    );


    /* =====================================================
       NOTIFICATION DATA

       Stored locally for now.

       This gives us the UI/data foundation without pretending
       Apex already has a live server notification backend.
       ===================================================== */

    const NOTIFICATION_KEY =
        "apexGamesNotifications";

    let notifications = [];


    function loadNotifications() {

        try {

            const stored =
                localStorage.getItem(
                    NOTIFICATION_KEY
                );

            notifications =
                stored
                    ? JSON.parse(stored)
                    : [];

            if (
                !Array.isArray(
                    notifications
                )
            ) {
                notifications = [];
            }

        } catch (error) {

            console.warn(
                "[Apex Nav] Could not load notifications.",
                error
            );

            notifications = [];

        }

    }


    function saveNotifications() {

        try {

            localStorage.setItem(
                NOTIFICATION_KEY,
                JSON.stringify(
                    notifications
                )
            );

        } catch (error) {

            console.warn(
                "[Apex Nav] Could not save notifications.",
                error
            );

        }

    }


    function formatNotificationTime(
        timestamp
    ) {

        if (!timestamp) {
            return "";
        }

        const date =
            new Date(timestamp);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }

        const difference =
            Date.now() -
            date.getTime();

        const minute =
            60 * 1000;

        const hour =
            60 * minute;

        const day =
            24 * hour;


        if (difference < minute) {
            return "Just now";
        }

        if (difference < hour) {

            return `${
                Math.floor(
                    difference / minute
                )
            }m ago`;

        }

        if (difference < day) {

            return `${
                Math.floor(
                    difference / hour
                )
            }h ago`;

        }

        if (difference < 7 * day) {

            return `${
                Math.floor(
                    difference / day
                )
            }d ago`;

        }

        return date.toLocaleDateString();

    }


    function notificationIcon(
        notification
    ) {

        if (notification.image) {

            return `
                <span
                    class="notification-icon"
                >
                    <img
                        src="${
                            escapeHTML(
                                notification.image
                            )
                        }"
                        alt=""
                    >
                </span>
            `;

        }

        const icons = {

            friend: "F",
            game: "▶",
            chat: "C",
            community: "C",
            wishlist: "W",
            achievement: "★",
            install: "↓",
            system: "A"

        };

        return `
            <span
                class="notification-icon"
                aria-hidden="true"
            >
                ${
                    icons[
                        notification.type
                    ] || "A"
                }
            </span>
        `;

    }


    function renderNotifications() {

        const list =
            document.getElementById(
                "notificationList"
            );

        const badge =
            document.getElementById(
                "notificationBadge"
            );

        if (!list || !badge) {
            return;
        }


        const unread =
            notifications.filter(
                notification =>
                    !notification.read
            ).length;


        if (unread > 0) {

            badge.textContent =
                unread > 99
                    ? "99+"
                    : String(unread);

            badge.classList.add(
                "visible"
            );

        } else {

            badge.textContent = "0";

            badge.classList.remove(
                "visible"
            );

        }


        if (
            notifications.length === 0
        ) {

            list.innerHTML = `
                <div
                    class="notification-empty"
                >
                    No notifications yet.
                </div>
            `;

            return;
        }


        list.innerHTML =
            notifications
                .slice(0, 30)
                .map(notification => `

                    <button
                        type="button"
                        class="
                            notification-row
                            ${
                                notification.read
                                    ? ""
                                    : "unread"
                            }
                        "
                        data-notification-id="${
                            escapeHTML(
                                notification.id
                            )
                        }"
                    >

                        ${
                            notificationIcon(
                                notification
                            )
                        }

                        <span
                            class="notification-copy"
                        >

                            <span
                                class="notification-message"
                            >
                                ${
                                    escapeHTML(
                                        notification.message
                                    )
                                }
                            </span>

                            <span
                                class="notification-time"
                            >
                                ${
                                    escapeHTML(
                                        formatNotificationTime(
                                            notification.timestamp
                                        )
                                    )
                                }
                            </span>

                        </span>

                    </button>

                `)
                .join("");

    }


    /* =====================================================
       ADD NOTIFICATION API

       Other Apex scripts will eventually call:

       window.ApexNotifications.push({...})
       ===================================================== */

    function addNotification(
        data = {}
    ) {

        if (!data.message) {
            return null;
        }

        const notification = {

            id:
                data.id ||
                (
                    crypto.randomUUID
                        ? crypto.randomUUID()
                        : `${Date.now()}-${Math.random()}`
                ),

            type:
                data.type ||
                "system",

            message:
                String(
                    data.message
                ),

            image:
                data.image ||
                "",

            href:
                data.href ||
                "",

            timestamp:
                data.timestamp ||
                new Date().toISOString(),

            read:
                Boolean(
                    data.read
                )

        };


        notifications.unshift(
            notification
        );

        notifications =
            notifications.slice(
                0,
                100
            );


        saveNotifications();
        renderNotifications();


        if (
            data.toast !== false
        ) {

            showToast(
                notification
            );

        }


        return notification;

    }


    /* =====================================================
       NOTIFICATION INTERACTION
       ===================================================== */

    document
        .getElementById(
            "notificationList"
        )
        ?.addEventListener(
            "click",
            event => {

                const row =
                    event.target.closest(
                        "[data-notification-id]"
                    );

                if (!row) {
                    return;
                }

                const id =
                    row.dataset
                        .notificationId;

                const notification =
                    notifications.find(
                        item =>
                            item.id === id
                    );

                if (!notification) {
                    return;
                }


                notification.read = true;

                saveNotifications();
                renderNotifications();


                if (
                    notification.href
                ) {

                    window.location.href =
                        notification.href;

                }

            }
        );


    document
        .getElementById(
            "markNotificationsRead"
        )
        ?.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                notifications.forEach(
                    notification => {

                        notification.read =
                            true;

                    }
                );

                saveNotifications();
                renderNotifications();

            }
        );


    /* =====================================================
       TOAST SYSTEM
       ===================================================== */

    const toastContainer =
        document.createElement("div");

    toastContainer.className =
        "apex-toast-container";

    toastContainer.id =
        "apexToastContainer";

    document.body.appendChild(
        toastContainer
    );


    function showToast(
        notification
    ) {

        const toast =
            document.createElement("div");

        toast.className =
            "apex-toast";

        toast.innerHTML = `

            <span
                class="apex-toast-icon"
            >

                ${
                    notification.image

                        ? `
                            <img
                                src="${
                                    escapeHTML(
                                        notification.image
                                    )
                                }"
                                alt=""
                            >
                        `

                        : "A"
                }

            </span>


            <span
                class="apex-toast-copy"
            >

                <strong>
                    Apex Games
                </strong>

                <span>
                    ${
                        escapeHTML(
                            notification.message
                        )
                    }
                </span>

            </span>


            <button
                class="apex-toast-close"
                type="button"
                aria-label="Dismiss notification"
            >
                ×
            </button>
        `;


        toastContainer.appendChild(
            toast
        );


        requestAnimationFrame(
            () => {

                toast.classList.add(
                    "visible"
                );

            }
        );


        let removed = false;


        function removeToast() {

            if (removed) {
                return;
            }

            removed = true;

            toast.classList.remove(
                "visible"
            );

            window.setTimeout(
                () => toast.remove(),
                200
            );

        }


        toast
            .querySelector(
                ".apex-toast-close"
            )
            ?.addEventListener(
                "click",
                event => {

                    event.stopPropagation();
                    removeToast();

                }
            );


        toast.addEventListener(
            "click",
            () => {

                if (
                    notification.href
                ) {

                    window.location.href =
                        notification.href;

                }

            }
        );


        window.setTimeout(
            removeToast,
            6500
        );

    }


    /* =====================================================
       ACCOUNT DISPLAY API

       account-state.js can continue doing its existing work.
       This also gives it / future code one clean API for the
       upgraded navbar.
       ===================================================== */

    function setLoggedOut() {

        const loggedOut =
            document.getElementById(
                "loggedOutAccount"
            );

        const profile =
            document.getElementById(
                "profileWidget"
            );


        if (loggedOut) {
            loggedOut.hidden = false;
        }

        if (profile) {
            profile.hidden = true;
        }

        closeAccountMenu();

    }


    function setUser(
        user = {}
    ) {

        const loggedOut =
            document.getElementById(
                "loggedOutAccount"
            );

        const profile =
            document.getElementById(
                "profileWidget"
            );

        if (loggedOut) {
            loggedOut.hidden = true;
        }

        if (profile) {
            profile.hidden = false;
        }


        const username =
            user.gamertag ||
            user.username ||
            user.displayName ||
            "Player";

        const avatar =
            user.avatar ||
            user.avatarUrl ||
            user.profilePicture ||
            DEFAULT_AVATAR;


        const profilePicture =
            document.getElementById(
                "profilePicture"
            );

        const profileGamertag =
            document.getElementById(
                "profileGamertag"
            );

        const dropdownAvatar =
            document.getElementById(
                "accountDropdownAvatar"
            );

        const dropdownName =
            document.getElementById(
                "accountDropdownName"
            );

        const dropdownStatus =
            document.getElementById(
                "accountDropdownStatus"
            );


        if (profilePicture) {
            profilePicture.src = avatar;
        }

        if (dropdownAvatar) {
            dropdownAvatar.src = avatar;
        }

        if (profileGamertag) {
            profileGamertag.textContent =
                username;
        }

        if (dropdownName) {
            dropdownName.textContent =
                username;
        }

        if (
            dropdownStatus &&
            user.status
        ) {

            dropdownStatus.textContent =
                user.status;

        }


        setWalletBalance(
            user.walletBalance
        );

    }


    /* =====================================================
       WALLET

       IMPORTANT:
       No fake balance is displayed.

       If no real balance is supplied, the navbar simply
       displays "Wallet" and the dropdown shows "—".
       ===================================================== */

    function setWalletBalance(
        value
    ) {

        const profileWallet =
            document.getElementById(
                "profileWallet"
            );

        const accountBalance =
            document.getElementById(
                "accountWalletBalance"
            );


        const numeric =
            Number(value);


        if (
            value === null ||
            value === undefined ||
            value === "" ||
            !Number.isFinite(numeric)
        ) {

            if (profileWallet) {

                profileWallet.textContent =
                    "Wallet";

            }

            if (accountBalance) {

                accountBalance.textContent =
                    "—";

            }

            return;

        }


        const formatted =
            new Intl.NumberFormat(
                "en-US",
                {
                    style: "currency",
                    currency: "USD"
                }
            ).format(numeric);


        if (profileWallet) {

            profileWallet.textContent =
                formatted;

        }

        if (accountBalance) {

            accountBalance.textContent =
                formatted;

        }

    }


    /* =====================================================
       LOG OUT

       We first try to use the existing Supabase client if
       one is exposed by the site.

       Existing account code can also listen for the custom
       event below and handle logout itself.
       ===================================================== */

    document
        .getElementById(
            "apexNavLogout"
        )
        ?.addEventListener(
            "click",
            async () => {

                const event =
                    new CustomEvent(
                        "apex:logout-request",
                        {
                            cancelable: true
                        }
                    );

                const allowed =
                    window.dispatchEvent(
                        event
                    );

                if (!allowed) {
                    return;
                }


                try {

                    const client =
                        window.supabaseClient ||
                        window.apexSupabase ||
                        window.supabase;

                    if (
                        client?.auth?.signOut
                    ) {

                        await client.auth.signOut();

                        window.location.href =
                            "index.html";

                        return;

                    }

                } catch (error) {

                    console.error(
                        "[Apex Nav] Logout failed.",
                        error
                    );

                }


                /*
                   If the site's account-state system handles
                   logout separately, it can intercept the
                   custom event above.

                   We intentionally do NOT delete random
                   authentication localStorage keys here.
                */

                console.warn(
                    "[Apex Nav] No logout handler was available."
                );

            }
        );


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ApexNav = {

        setUser,
        setLoggedOut,
        setWalletBalance,
        closeMenus:
            closeEverything

    };


    window.ApexNotifications = {

        push:
            addNotification,

        getAll() {

            return [
                ...notifications
            ];

        },

        markAllRead() {

            notifications.forEach(
                notification => {

                    notification.read =
                        true;

                }
            );

            saveNotifications();
            renderNotifications();

        },

        clear() {

            notifications = [];

            saveNotifications();
            renderNotifications();

        }

    };


    /* =====================================================
       ACCOUNT-STATE COMPATIBILITY

       Existing account-state.js currently expects these IDs:
       loggedOutAccount
       profileWidget
       profilePicture
       profileGamertag

       We intentionally preserved all four.
       ===================================================== */


    /* =====================================================
       INIT
       ===================================================== */

    loadNotifications();
    renderNotifications();


    console.log(
        "[Apex Games] Global navigation ready."
    );

})();

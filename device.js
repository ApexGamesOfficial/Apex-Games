/* =========================================================
   APEX GAMES — DEVICE DETECTOR

   Shared site-wide device detection.

   Returns:
   {
       deviceType: "desktop" | "tablet" | "mobile" | "unknown",
       os: "windows" | "chromeos" | "android" | "ios" | "macos" | "linux" | "unknown",
       clientSupported: true | false,
       touch: true | false
   }

   CURRENT CLIENT SUPPORT:
   Windows desktop only.
========================================================= */


function detectApexDevice() {

    const ua =
        navigator.userAgent ||
        "";

    const platform =
        navigator.platform ||
        "";

    const maxTouchPoints =
        Number(
            navigator.maxTouchPoints
        ) || 0;

    const touch =
        maxTouchPoints > 0 ||
        "ontouchstart" in window;


    const uaLower =
        ua.toLowerCase();

    const platformLower =
        platform.toLowerCase();


    /* =====================================================
       OS DETECTION
    ===================================================== */

    let os =
        "unknown";


    /*
       ChromeOS

       ChromeOS user agents normally include "CrOS".
       Check this BEFORE Linux because ChromeOS also
       identifies as Linux internally.
    */

    if (
        ua.includes("CrOS")
    ) {

        os =
            "chromeos";
    }


    /*
       Android

       Android tablets and phones normally include
       "Android" in the UA.
    */

    else if (
        ua.includes("Android")
    ) {

        os =
            "android";
    }


    /*
       iPhone / iPad / iPod
    */

    else if (
        /iPhone|iPad|iPod/.test(
            ua
        )
    ) {

        os =
            "ios";
    }


    /*
       Modern iPadOS can sometimes pretend to be macOS.

       Mac platform + touch points > 1 is usually iPadOS.
    */

    else if (
        platform === "MacIntel" &&
        maxTouchPoints > 1
    ) {

        os =
            "ios";
    }


    /*
       Windows
    */

    else if (
        ua.includes("Windows") ||
        platformLower.includes("win")
    ) {

        os =
            "windows";
    }


    /*
       macOS
    */

    else if (
        ua.includes("Mac OS X") ||
        platformLower.includes("mac")
    ) {

        os =
            "macos";
    }


    /*
       Linux

       Must come AFTER ChromeOS and Android.
    */

    else if (
        ua.includes("Linux") ||
        platformLower.includes("linux")
    ) {

        os =
            "linux";
    }


    /* =====================================================
       DEVICE TYPE
    ===================================================== */

    let deviceType =
        "desktop";


    const mobileUA =
        /Mobi|iPhone|iPod|Android.*Mobile/i
            .test(
                ua
            );


    const tabletUA =
        /iPad|Tablet/i
            .test(
                ua
            );


    /*
       Android without "Mobile" usually means tablet.
    */

    const androidTablet =
        os === "android" &&
        !uaLower.includes(
            "mobile"
        );


    /*
       iPadOS
    */

    const iosTablet =
        os === "ios" &&
        (
            ua.includes("iPad") ||
            (
                platform === "MacIntel" &&
                maxTouchPoints > 1
            )
        );


    if (
        tabletUA ||
        androidTablet ||
        iosTablet
    ) {

        deviceType =
            "tablet";
    }


    else if (
        mobileUA
    ) {

        deviceType =
            "mobile";
    }


    else if (
        os === "unknown"
    ) {

        deviceType =
            touch
                ? "unknown"
                : "desktop";
    }


    else {

        deviceType =
            "desktop";
    }


    /* =====================================================
       CLIENT SUPPORT

       Launch support:
       Windows DESKTOP only.

       This intentionally does NOT say every Windows
       browser/device is supported.
    ===================================================== */

    const clientSupported =
        os === "windows" &&
        deviceType === "desktop";


    /* =====================================================
       RESULT
    ===================================================== */

    return {
        deviceType,
        os,
        clientSupported,
        touch
    };
}


/* =========================================================
   FRIENDLY DEVICE NAME
========================================================= */

function getApexDeviceName(
    device
) {

    if (
        !device
    ) {

        return "Unknown Device";
    }


    switch (
        device.os
    ) {

        case "windows":

            return device.deviceType ===
                "desktop"
                ? "Windows PC"
                : "Windows Device";


        case "chromeos":

            return "ChromeOS";


        case "android":

            return device.deviceType ===
                "tablet"
                ? "Android Tablet"
                : "Android";


        case "ios":

            return device.deviceType ===
                "tablet"
                ? "iPadOS"
                : "iOS";


        case "macos":

            return "macOS";


        case "linux":

            return "Linux";


        default:

            return "Unknown Device";
    }
}


/* =========================================================
   EXPOSE SITE-WIDE
========================================================= */

window.detectApexDevice =
    detectApexDevice;


window.getApexDeviceName =
    getApexDeviceName;

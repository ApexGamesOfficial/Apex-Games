const stars = document.querySelectorAll("#starRating button");
const ratingMessage = document.getElementById("ratingMessage");
const favoriteButton = document.getElementById("favoriteButton");
const searchInput = document.getElementById("librarySearch");
const games = document.querySelectorAll(".library-game");


// ================================
// STAR RATING
// ================================

let currentRating = 0;

stars.forEach(star => {

    star.addEventListener("click", () => {

        currentRating = Number(star.dataset.rating);

        updateStars();

        ratingMessage.textContent =
            `You rated this game ${currentRating}/5`;

    });

});


function updateStars() {

    stars.forEach(star => {

        const starValue = Number(star.dataset.rating);

        star.textContent =
            starValue <= currentRating ? "★" : "☆";

    });

}


// ================================
// FAVORITE
// ================================

let favorited = false;

favoriteButton.addEventListener("click", () => {

    favorited = !favorited;

    favoriteButton.textContent =
        favorited ? "♥" : "♡";

});


// ================================
// SEARCH
// ================================

searchInput.addEventListener("input", () => {

    const search =
        searchInput.value.toLowerCase().trim();

    games.forEach(game => {

        const gameName =
            game.innerText.toLowerCase();

        game.style.display =
            gameName.includes(search)
                ? "flex"
                : "none";

    });

});


// ================================
// GAME SELECTION
// ================================

const gameData = {

    demo: {
        title: "Apex Demo",
        description:
            "This is a temporary game used to preview your Apex Games Library. Your owned games will eventually appear here automatically.",
        status: "Installed",
        button: "▶ PLAY"
    },

    project: {
        title: "Project Unknown",
        description:
            "A placeholder for a future Apex Games title. Games connected to your Apex account will eventually appear in this library.",
        status: "Not Installed",
        button: "INSTALL"
    }

};


games.forEach(game => {

    game.addEventListener("click", () => {

        games.forEach(item =>
            item.classList.remove("active")
        );

        game.classList.add("active");

        const selected =
            gameData[game.dataset.game];

        document.getElementById("selectedTitle")
            .textContent = selected.title;

        document.getElementById("aboutTitle")
            .textContent = selected.title;

        document.getElementById("gameDescription")
            .textContent = selected.description;

        document.getElementById("gameStatus")
            .textContent = selected.status;

        document.getElementById("playButton")
            .textContent = selected.button;


        // Reset personal rating when switching games
        currentRating = 0;

        updateStars();

        ratingMessage.textContent = "Not rated";

    });

});

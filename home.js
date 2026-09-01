document.addEventListener("DOMContentLoaded", () => {

    /* ========================================
       NEWS SPOTLIGHT
       Changes automatically every 2 days
    ======================================== */

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
                Date.now() / TWO_DAYS
            ) % apexNews.length;


        const story =
            apexNews[spotlightIndex];


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


        category.textContent =
            story.category;

        date.textContent =
            story.date;

        title.textContent =
            story.title;

        description.textContent =
            story.description;

        link.href =
            story.link;


        if (story.image) {

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



    /* ========================================
       LATEST NEWS
    ======================================== */

    const latestGrid =
        document.getElementById(
            "latestNewsGrid"
        );


    if (
        latestGrid &&
        typeof apexNews !== "undefined"
    ) {

        apexNews
            .slice(0, 3)
            .forEach(story => {

                const card =
                    document.createElement("a");


                card.className =
                    "news-card";


                card.href =
                    story.link;


                const imageStyle =
                    story.image
                    ? `background-image:
                       linear-gradient(
                           0deg,
                           rgba(5,7,10,.45),
                           transparent
                       ),
                       url('${story.image}')`
                    : "";


                card.innerHTML = `

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

            });

    }



    /* ========================================
       SEARCH
    ======================================== */

    const searchForm =
        document.getElementById(
            "navSearch"
        );


    const searchInput =
        document.getElementById(
            "navSearchInput"
        );


    searchForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const query =
                searchInput.value.trim();


            if (!query) {
                return;
            }


            /*
                Search page will be built later.
            */

            window.location.href =
                `search.html?q=${
                    encodeURIComponent(query)
                }`;

        }
    );

});

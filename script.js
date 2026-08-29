document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {
            document.body.classList.add("page-changing");
        });

    });

});

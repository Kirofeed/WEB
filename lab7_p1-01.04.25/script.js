document.addEventListener('DOMContentLoaded', () => {
    const homePage = document.getElementById('home-page');
    const studioPage = document.getElementById('studio-page');
    const goToStudioBtn = document.getElementById('goToStudioBtn');
    const goHomeBtn = document.getElementById('goHomeBtn');

    function showPage(pageToShow) {
        homePage.classList.remove('active');
        studioPage.classList.remove('active');

        pageToShow.classList.add('active');
    }

    goToStudioBtn.addEventListener('click', () => {
        showPage(studioPage);
    });

    goHomeBtn.addEventListener('click', () => {
        showPage(homePage);
    });
});

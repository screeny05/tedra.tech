const $overlay = document.querySelector('.overlay');

$overlay.addEventListener('click', () => {
    document.documentElement.classList.remove('is--overlay-active');
    document.documentElement.classList.remove('is--menu-active');
});

window.addEventListener('load', () => {
    const $trigger = document.querySelector('.js-menu-trigger');

    $trigger.addEventListener('click', e => {
        e.preventDefault();
        document.documentElement.classList.toggle('is--menu-active');
    });
});

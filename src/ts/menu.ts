const $trigger = document.querySelector('.js-menu-trigger');
const $menu = document.querySelector('.js-menu-target');
const $links = $menu.querySelectorAll('a:not(.js-menu-trigger)');

const onLinkClick = () => {
    document.documentElement.classList.remove('is--menu-active');
    document.documentElement.classList.remove('is--overlay-active');
};

$trigger.addEventListener('click', e => {
    e.preventDefault();
    document.documentElement.classList.toggle('is--menu-active');
    document.documentElement.classList.toggle('is--overlay-active');
});

$links.forEach($link => {
    $link.addEventListener('click', onLinkClick);
});

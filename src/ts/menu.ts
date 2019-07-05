const $trigger = document.querySelector('.js-menu-trigger');
const $menu = document.querySelector('.js-menu-target');

$trigger.addEventListener('click', e => {
    e.preventDefault();
    document.documentElement.classList.toggle('body--menu-active');
});

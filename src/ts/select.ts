const $select = document.querySelector('select');

$select.addEventListener('change', () => {
    $select.classList.add('is--selected');
});

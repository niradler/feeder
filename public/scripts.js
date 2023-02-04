
document.querySelectorAll('#theme-options').forEach((el) => el.addEventListener('click', changeTheme));
function changeTheme(el) {
    const selectedTheme = el.target.getAttribute('data-value');
    document.querySelector('html').setAttribute('data-theme', selectedTheme);
    localStorage.setItem('theme', selectedTheme);
}

const theme = localStorage.getItem('theme');
if (theme) {
    document.querySelector('html').setAttribute('data-theme', theme);
}

const themeKey = "FEEDER_THEME"

document.querySelectorAll('#theme-options').forEach((el) => el.addEventListener('click', changeTheme));
function changeTheme(el) {
    const selectedTheme = el.target.getAttribute('data-value');
    document.querySelector('html').setAttribute('data-theme', selectedTheme);
    localStorage.setItem(themeKey, selectedTheme);
}

const theme = localStorage.getItem(themeKey);
if (theme) {
    document.querySelector('html').setAttribute('data-theme', theme);
}
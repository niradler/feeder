
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


const queryParams = new URLSearchParams(window.location.search)
const searchQuery = queryParams.get('search') || "";
if (searchQuery) {
    htmx.find("#search-input").value = searchQuery;
}

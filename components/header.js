const { html, htmlFragment } = require('@statikly-stack/render')

module.exports = ({ pageLogo, themes }) => {
    return html`
<div class="navbar bg-base-100">
    <div class="navbar-start">
        <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </label>
            <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                <li><label for="filters-modal">Filters</label></li>
            </ul>
        </div>
        <a class="btn btn-ghost normal-case text-xl" href="/">${pageLogo}</a>
    </div>
    <div class="navbar-end">
        <label class="swap">
            <input type="checkbox" id="notification-status" checked />
            <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                viewBox="0 0 24 24">
                <path
                    d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
            </svg>
            <svg class="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
                viewBox="0 0 24 24">
                <path
                    d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
            </svg>
        </label>
        <div class="dropdown dropdown-bottom dropdown-end">
            <label tabindex="0" class="btn m-1">Themes</label>
            <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                ${themes.map(theme => htmlFragment`<li><span id="theme-options" data-value="${theme}">${theme}</span>
                </li>`)}
            </ul>
        </div>
    </div>
</div>
    `
}
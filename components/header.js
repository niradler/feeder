const { html, htmlFragment } = require('@statikly-stack/render')

module.exports = ({ links, pageLogo, themes }) => {
    return html`
<div class="navbar bg-base-100">
    <div class="navbar-start">
        <div class="dropdown">
            <label tabindex="0" class="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
            </label>
            <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                ${links.map(link => htmlFragment`<li><a href="${link.url}" class="link link-hover">${link.title}</a>
                </li>`)}
            </ul>
        </div>
        <a href="/" class="btn btn-ghost normal-case text-xl">${pageLogo}</a>
    </div>
    <div class="navbar-end">
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
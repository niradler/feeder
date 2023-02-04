const { html } = require('@statikly-stack/render')


module.exports = () => {
    return html`
    <footer class="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <div>
            <p>Copyright © 2023 - All right reserved, the code is available on github</p>
        </div>
    </footer>
    `
}
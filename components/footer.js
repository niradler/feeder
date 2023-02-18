const { htmlFragment } = require('@statikly-stack/render')


module.exports = () => {
    return htmlFragment`
    <footer class="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <div>
            <p>Copyright © 2023 - All right reserved, the code is available on github <a
                    href="https://github.com/niradler/feeder" target="_blank">niradler/feeder</a></p>
        </div>
    </footer>
    `;
}
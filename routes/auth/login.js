const { html, htmlFragment, renderIf } = require('@statikly-stack/render')
const { verifyPassword } = fromRoot.require('src/auth');
const layout = fromRoot.require('components/layout');

const { corsOrigin, prod } = statikly_app._config;

async function get(req, res) {
    const hasError = res.flash('error').length > 0;

    const body = () =>
        html`
        <div class="hero min-h-screen bg-base-200">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">Login</h1>
                    <p class="py-6">Please enter a Password, Password can be set by environment variable FEEDER_PASSWORD or
                        feeder
                        will automatically create one for you and print it to the console.</p>
                    <form method="POST">
                        <input type="text" name="password" placeholder="Password"
                            class="input input-bordered w-full max-w-xs ${renderIf(hasError, 'input-error')}" />
                    </form>
                </div>
            </div>
        </div>
        <div class="divider"></div>
    `;

    return layout({ body });
}

function post(req, res) {
    const { password } = req.body;
    console.info('password', { password })
    try {
        const token = verifyPassword(password)
        res.setCookie('feeder_token', token, {
            domain: corsOrigin[0],
            path: '/',
            secure: prod,
            httpOnly: true,
            sameSite: true
        })
        console.info('verifyPassword')
        res.redirect("/")
    } catch (error) {
        req.log.error(error)
        req.flash('error', ['password in not correct'])
        res.redirect("/auth/login")
    }
}

module.exports = { post, get };

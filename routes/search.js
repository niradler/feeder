const { all } = fromRoot.require('components/alerts');
const { htmlFragment, renderIf } = require('@statikly-stack/render')
const { pageSize } = require('src/config');
const { verifyToken } = fromRoot.require('src/auth');
const { reqToQuery, queryToAlerts, buildQuery } = require('src/actions')

async function post(req, res) {
    const query = reqToQuery(req)

    const alerts = await queryToAlerts(this.db, query)

    res.type('text/html');
    res.header('HX-Push', `/?${buildQuery(query)}`)

    return htmlFragment`
    ${all({ alerts })}
    ${renderIf(alerts.length === pageSize,
        htmlFragment`
        <div class="flex justify-center" id="more-results">
        <button class="btn" hx-get="/?page=2" hx-trigger="click" hx-target="#more-results"
            hx-swap="outerHTML">Load More</button>
    </div>
    `)}
    `;
}

const route = {
    method: "POST",
    handler: post,
    preHandler: verifyToken
}

module.exports = { route };

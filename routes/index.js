const { html, htmlFragment, renderIf } = require('@statikly-stack/render')
const { pageSize } = require('src/config');
const layout = fromRoot.require('components/layout');
const { all } = fromRoot.require('components/alerts');
const { alertHeader } = fromRoot.require('components/alertHeader');
const { verifyToken } = fromRoot.require('src/auth');
const { reqToQuery, queryToAlerts, buildQuery, isHxReq } = require('src/actions')


async function get(req, res) {
    res.type('text/html');
    const query = reqToQuery(req);
    const isHx = isHxReq(req);
    const { page, search, tagId } = query;
    const alerts = await queryToAlerts(this.db, query);

    const searchResults = htmlFragment`
    ${all({ alerts })}
    ${renderIf(alerts.length >= pageSize,
        htmlFragment`
        <div class="flex justify-center" id="more-results">
        <button class="btn" hx-get="/?${buildQuery({ ...query, page: page + 1 })}" hx-trigger="click" hx-target="#more-results"
            hx-swap="outerHTML">Load More</button>
        </div>
    `)}`;

    if (isHx) {
        res.header('HX-Push', `/?${buildQuery(query)}`)
        return searchResults;
    }

    const tags = await this.db.tag.findMany({
        select: {
            id: true,
            text: true
        },
    })

    const body = () =>
        html`
    ${alertHeader({ search })}
    <div class="divider"></div>
    
    <div class="flex justify-center">
        <div hx-ext="sse" sse-connect="/sse/listen" id="sse" hx-trigger="sse:message"></div>
        <progress class="progress w-56 htmx-indicator" id="search-indicator"></progress>
    </div>
    
    <div id="search-results">
        ${searchResults}
    </div>
    <div class="divider"></div>
    </div>
    `;

    return layout({ body, tags, tagId });
}

const route = {
    handler: get,
    preHandler: verifyToken
}

module.exports = { route };

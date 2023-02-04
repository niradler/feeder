const { html, htmlFragment } = require('@statikly-stack/render')
const layout = fromRoot.require('components/layout');
const { all } = fromRoot.require('components/alerts');

const header = () => {
    return html`
        <div class="flex justify-center">
            <div class="form-control">
                <div class="input-group">
                    <input id="search-input" class="input input-bordered" type="search" name="search"
                        placeholder="Begin Typing To Search..." hx-post="/search" hx-trigger="keyup changed delay:500ms, search"
                        hx-target="#search-results" hx-indicator=".htmx-indicator">
                    <button class="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    `
}

async function get(req, res) {
    const pageSize = 20
    const isHx = req.headers['hx-request'] === 'true';
    const { page, search } = req.query;
    const findOptions = {
        take: pageSize, skip: (Number(page || 1) - 1) * pageSize,
        orderBy: [
            {
                timestamp: 'desc',
            },
        ],
    }
    if (search) {
        findOptions.where = {
            OR: [
                {
                    title: {
                        contains: search
                    }
                },
                {
                    description: {
                        contains: search
                    }
                },
                {
                    tags: {
                        contains: search
                    }
                }
            ]

        }
    }
    const alerts = await this.db.alert.findMany(findOptions)

    const searchResults = htmlFragment`
    ${all({ alerts })}
    <div class="flex justify-center" id="more-results">
        <button class="btn" hx-get="/?page=${page + 1}" hx-trigger="click" hx-target="#more-results"
            hx-swap="outerHTML">Load More</button>
    </div>
    `;

    if (isHx) {
        if (alerts.length === 0) {
            return res.notFound()
        }
        return searchResults;
    }

    const body = (context) =>
        html`
    ${header}
    <div class="divider"></div>
    
    <div class="flex justify-center">
        <div hx-ext="sse" sse-connect="/sse/listen" sse-swap="message"></div>
        <progress class="progress w-56 htmx-indicator" id="search-indicator"></progress>
    </div>
    
    <div id="search-results">
        ${searchResults}
    </div>
    <div class="divider"></div>
    </div>
    `;

    return layout({ body });
}

module.exports = { get };

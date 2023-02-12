const { html, htmlFragment, renderIf, renderList } = require('@statikly-stack/render')
const { pageSize } = require('data.json');
const layout = fromRoot.require('components/layout');
const { all } = fromRoot.require('components/alerts');
const { verifyToken } = fromRoot.require('src/auth');

const header = ({ search, tags }) => {
    return htmlFragment`
        <div class="flex justify-center">
            <div class="form-control mr-5">
                <select class="select select-bordered w-full max-w-xs" hx-get="/" hx-target="#search-results" hx-indicator=".htmx-indicator" name="tagId">
                <option disabled selected>Tags</option>
                ${renderList(tags, (tag) => htmlFragment`<option value="${tag.id}">${tag.text}</option>`)}
                </select>
            </div>          
            <div class="form-control mr-5">
                <div class="input-group">
                    <input id="search-input" class="input input-bordered" type="search" name="search"
                        placeholder="Begin Typing To Search..." 
                        hx-post="/search" 
                        hx-trigger="keyup changed delay:500ms, search"
                        hx-target="#search-results" 
                        hx-indicator=".htmx-indicator"
                        ${renderIf(search, `value=${search}`)}
                        >
                    <button class="btn btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
            </div>
            <div class="form-control mr-5">
                <input name="start" type="datetime-local" class="input input-bordered" placeholder="Select date start" hx-push-url="true">
            </div>            
            <div class="form-control mr-5">
                <input name="end" type="datetime-local" class="input input-bordered" placeholder="Select date end" hx-push-url="true">
            </div>
        </div>
    `
}

const getAlerts = async (db, { page, search, isHx, tagId }) => {
    let skip = (page - 1) * pageSize;
    let take = pageSize;
    if (!isHx) {
        skip = 0;
        take = pageSize * page;
    }
    const findOptions = {
        take, skip,
        orderBy: [
            {
                timestamp: 'desc',
            },
        ],
        include: {
            tags: true,
        }
    }

    if (tagId) {
        findOptions.where = {
            tags: {
                every: {
                    id: tagId
                }

            }
        }
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
                }
            ]

        }
    }

    const alerts = await db.alert.findMany(findOptions)

    return alerts;
}

async function get(req, res) {
    const isHx = req.headers['hx-request'] === 'true';
    let { page, search, tagId } = req.query;
    search = search || '';
    page = page ? Number(page) : 1
    const alerts = await getAlerts(this.db, { page, search, isHx, tagId })

    let qs = {
        page,
        search,
        tagId
    };
    Object.keys(qs).forEach((key) => {
        if (typeof qs[key] === 'undefined' || qs[key] === '') {
            delete qs[key];
        }
    });
    const urlParams = new URLSearchParams(qs).toString()
    const searchResults = htmlFragment`
    ${all({ alerts })}
    ${renderIf(alerts.length === pageSize,
        htmlFragment`
        <div class="flex justify-center" id="more-results">
        <button class="btn" hx-get="/?page=${page + 1}" hx-trigger="click" hx-target="#more-results"
            hx-swap="outerHTML">Load More</button>
    </div>
    `)}`;

    if (isHx) {
        if (alerts.length === 0) {
            return res.notFound()
        }
        res.header('HX-Push', `/?${urlParams}`)
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
    ${header({ search, tags })}
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

    return layout({ body });
}

const route = {
    handler: get,
    preHandler: verifyToken
}

module.exports = { route };

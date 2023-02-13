const { html, htmlFragment, renderIf } = require('@statikly-stack/render')
const { pageSize } = require('data.json');
const layout = fromRoot.require('components/layout');
const { all } = fromRoot.require('components/alerts');
const { alertHeader } = fromRoot.require('components/alertHeader');
const { verifyToken } = fromRoot.require('src/auth');

const getAlerts = async (db, { page, search, isHx, tagId, start, end }) => {
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

    findOptions.where = {}
    if (tagId) {
        findOptions.where = {
            tags: {
                every: {
                    id: tagId
                }

            },
            ...findOptions.where
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
            ],
            ...findOptions.where
        }
    }

    if (start && end) {
        findOptions.where = {
            timestamp: {
                gte: new Date(start),
                lt: new Date(end)
            },
            ...findOptions.where
        }
    }

    const alerts = await db.alert.findMany(findOptions)

    return alerts;
}

async function get(req, res) {
    res.type('text/html');
    const isHx = req.headers['hx-request'] === 'true';
    let { page, search, tagId, start, end } = req.query;
    search = search || '';
    page = page ? Number(page) : 1
    const alerts = await getAlerts(this.db, {
        page, search, isHx, tagId, start, end
    })

    let qs = {
        page,
        search,
        tagId,
        start,
        end
    };
    Object.keys(qs).forEach((key) => {
        if (typeof qs[key] === 'undefined' || qs[key] === '') {
            delete qs[key];
        }
    });
    const urlParams = new URLSearchParams(qs).toString()

    const searchResults = htmlFragment`
    ${all({ alerts })}
    ${renderIf(alerts.length >= pageSize,
        htmlFragment`
        <div class="flex justify-center" id="more-results">
        <button class="btn" hx-get="/?page=${page + 1}" hx-trigger="click" hx-target="#more-results"
            hx-swap="outerHTML">Load More</button>
        </div>
    `)}`;

    if (isHx) {
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
    ${alertHeader({ search, tags, tagId })}
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

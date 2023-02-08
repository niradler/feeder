const { all } = fromRoot.require('components/alerts');
const { htmlFragment, renderIf } = require('@statikly-stack/render')
const { pageSize } = require('data.json');
const { verifyToken } = fromRoot.require('src/auth');

async function post(req, res) {
    const alerts = await this.db.alert.findMany({
        take: pageSize,
        orderBy: [
            {
                timestamp: 'desc',
            },
        ],
        where: {
            OR: [
                {
                    title: {
                        contains: req.body.search
                    }
                },
                {
                    description: {
                        contains: req.body.search
                    }
                },
                {
                    tags: {
                        contains: req.body.search
                    }
                }
            ]

        }
    })

    res.type('text/html');
    res.header('HX-Push', `/?search=${req.body.search}&page=1`)

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

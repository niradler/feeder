const { all } = fromRoot.require('components/alerts');
const { htmlFragment } = require('@statikly-stack/render')

async function post(req, res) {
    const pageSize = 20
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
    res.header('HX-Push', `/?search=${req.body.search}`)

    return htmlFragment`
    ${all({ alerts })}
    <div class="flex justify-center" id="more-results">
        <button class="btn" hx-get="/?page=1" hx-trigger="click" hx-target="#more-results"
            hx-swap="outerHTML">Load More</button>
    </div>
    `;
}

module.exports = { post };

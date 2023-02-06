
const assets = ['htmx.org/dist/htmx.js', 'htmx.org/dist/ext/sse.js']

async function get(req, res) {
    const asset = req.query.asset
    if (assets.includes(asset)) {
        return res.sendFile(asset, fromRoot.path('node_modules'))
    }

    res.status(404)
    return;
}

module.exports = { get };

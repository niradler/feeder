const { on } = require('events')
const { alertsEmitter } = fromRoot.require('src/events');
const { verifyToken } = fromRoot.require('src/auth');
const { basicAlert } = fromRoot.require('components/alerts');

function get(req, res) {

    res.sse(
        (async function* () {
            for await (const [event] of on(alertsEmitter, "create")) {
                yield {
                    id: event.type,
                    type: event.type,
                    data: JSON.stringify({ alert: event.data, html: basicAlert(event.data) }),
                };
            }
        })()
    );

}

const route = {
    handler: get,
    preHandler: verifyToken
}

module.exports = { route };

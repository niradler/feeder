const { on } = require('events')
const { alertsEmitter } = fromRoot.require('src/events');
const { basicAlert } = fromRoot.require('components/alerts');

function get(req, res) {

    res.sse(
        (async function* () {
            for await (const [event] of on(alertsEmitter, "create")) {
                yield {
                    id: event.type,
                    type: event.type,
                    data: "<h1>Refresh to get latest</h1>",
                };
            }
        })()
    );

}

module.exports = { get };

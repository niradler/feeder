const { plugin } = require('@statikly-stack/core')
const { FastifySSEPlugin } = require('fastify-sse-v2');
const client = fromRoot.require('src/db/client');


module.exports = plugin(async function (app, options) {
    const { expiresIn = 300, serverExpiresIn = 300 } = options
    await app.register(require('@fastify/caching'), {
        expiresIn: expiresIn, serverExpiresIn
    });

    await app.register(require('@fastify/swagger'), {
        exposeRoute: true,
        swagger: {
            info: { title: 'feeder-api' },
        },
    })

    await app.register(FastifySSEPlugin);
    app.ready().then(() => app.swagger())
    app.decorate("db", client)

    app.log.debug("app loaded successfully");
})

module.exports.autoConfig = { name: 'app', dependencies: [] };
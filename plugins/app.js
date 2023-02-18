const { plugin } = require('@statikly-stack/core')
const { generateSecret } = require('@statikly-stack/core/build/utils/common')
const { FastifySSEPlugin } = require('fastify-sse-v2');
const client = fromRoot.require('src/db/client');

const { sessionSecret } = require('src/config');

module.exports = plugin(async function (app, options) {
    const { expiresIn = 300, serverExpiresIn = 300, prod } = options
    if (prod) {
        await app.register(require('@fastify/caching'), {
            expiresIn, serverExpiresIn
        });
    }

    await app.register(require('@fastify/cookie'), { secret: sessionSecret });
    await app.register(require('@fastify/session'), { secret: sessionSecret, cookie: { secure: 'auto' } });
    await app.register(require('@fastify/flash'));
    await app.register(require('@fastify/swagger'), {
        exposeRoute: true,
        swagger: {
            info: { title: 'feeder-api' },
        },
    })

    await app.register(FastifySSEPlugin);
    app.ready().then(() => app.swagger())
    app.decorate('db', client)
    app.decorateReply('httpErrors', () => app.httpErrors)

    app.log.debug('app loaded successfully');
})

module.exports.autoConfig = { name: 'app', dependencies: [] };
const S = require('fluent-json-schema')
const { alertsEmitter } = fromRoot.require('src/events');
const { verifyApiKey } = fromRoot.require('src/auth');

async function handler(req, res) {
    try {
        const alert = await this.db.alert.create({ data: req.body })
        alertsEmitter.emit('create', { type: 'create', data: alert })
    } catch (error) {
        req.log.error(error)
        res.status(500)
        return { status: 'failed' }
    }

    return { status: 'success' }
}

const schema = {
    body:
        S.object()
            .raw({ additionalProperties: false })
            .id('createAlert')
            .title('Create alert schema')
            .prop('title', S.string().required())
            .prop('description', S.string())
            .prop('timestamp', S.string())
            .prop('groupId', S.string())
            .prop('level', S.string())
            .prop('action', S.string())
            .prop('actionMethod', S.string().enum(['GET', 'get', 'post', 'POST']))
            .prop('tags', S.string())
}

const route = {
    method: "POST",
    schema,
    preHandler: verifyApiKey,
    handler
}

module.exports = { route };

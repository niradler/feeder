const S = require('fluent-json-schema')
const { alertsEmitter } = fromRoot.require('src/events');
const { verifyApiKey } = fromRoot.require('src/auth');

async function createAlert(db, body) {
    let { tags = [], ...newAlert } = body;

    let exists, existsText;
    if (tags.length > 0) {
        exists = await db.tag.findMany({
            select: {
                text: true
            },
            where: {
                text: {
                    in: tags
                }
            }
        })
        existsText = exists.map(tag => tag.text);
        tags = tags.filter(tag => !existsText.includes(tag)).map(text => ({ text }))
    }

    const alert = await db.alert.create({
        data: {
            ...newAlert,
            tags: {
                connect: exists,
                create: tags,

            },
        },
    })

    return alert;
}

async function handler(req, res) {
    try {
        const alert = await createAlert(this.db, req.body)
        alertsEmitter.emit('create', { type: 'create', data: alert })
    } catch (error) {
        req.log.error(`webhook error: ${error.message}`);
        res.status(500)
        return { status: 'failed' }
    }

    return { status: 'success' }
}

const schema = {
    headers: S.object()
        .id('authHeader')
        .prop('authorization', S.string().required()),
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
            .prop('tags', S.array(S.string()))
}

const route = {
    method: "POST",
    schema,
    preHandler: verifyApiKey,
    handler
}

module.exports = { route };

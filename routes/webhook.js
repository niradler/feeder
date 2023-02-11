const S = require('fluent-json-schema')
const { alertsEmitter } = fromRoot.require('src/events');
const { verifyApiKey } = fromRoot.require('src/auth');

// TODO: tags insert refactor is needed, due to prisma/sqlite limitation

async function handler(req, res) {
    try {
        let { tags, ...newAlert } = req.body;
        tags = tags || [];

        if (tags.length > 0) {
            const exists = await this.db.tag.findMany({
                select: {
                    text: true
                },
                where: {
                    text: {
                        in: tags
                    }
                }
            })
            const existsText = exists.map(tag => tag.text);
            tags = tags.filter(tag => !existsText.includes(tag)).map(tag => ({ text: tag }))
            let createdTags = []
            if (tags.length > 0) {
                createdTags = await Promise.all(tags.map(tag => this.db.tag.create({
                    data: tag,
                    select: {
                        text: true
                    },
                })))

            }
            newAlert.tags = { connect: [...exists, ...createdTags] }
        }
        const alert = await this.db.alert.create({
            data: newAlert
        })

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

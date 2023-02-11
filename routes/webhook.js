const S = require('fluent-json-schema')
const { alertsEmitter } = fromRoot.require('src/events');
const { verifyApiKey } = fromRoot.require('src/auth');

async function handler(req, res) {
    try {
        let { tags, ...newAlert } = req.body;
        tags = tags || [];

        if (tags.length > 0) {
            const exists = await this.db.tag.findMany({
                where: {
                    text: {
                        in: tags
                    }
                }
            })
            const existsText = exists.map(tag => tag.text);
            tags = tags.filter(tag => !existsText.includes(tag)).map(tag => ({ text: tag }))
            console.log({ tags })
            const createdTags = await this.db.tag.create({
                data: tags,
            })
            newAlert.tags = { connect: [...exists, createdTags] }
        }

        const alert = await this.db.alert.create({
            data: newAlert
        })
        // await prisma.brand.create({
        //     data: {
        //       name: "Apple",
        //       slug: "apple",
        //       categories: {
        //         connect: {
        //           id: "ckzr32wlx0000wtt1lrhj85e1",
        //         },
        //       },
        //     },
        //   });
        alertsEmitter.emit('create', { type: 'create', data: alert })
    } catch (error) {
        req.log.error(error)
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

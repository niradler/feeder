const { pageSize } = require('src/config');

const isHxReq = (req) => req.headers['hx-request'] === 'true';

const reqToQuery = (req) => {
    const isHx = isHxReq(req)
    let { page, search, tagId, start, end } = req.body || req.query;
    search = search || '';
    page = page ? Number(page) : 1

    return { isHx, page, search, tagId, start, end }
}

const buildQuery = (qs = {}) => {
    delete qs.isHx
    Object.keys(qs).forEach((key) => {
        if (typeof qs[key] === 'undefined' || qs[key] === '') {
            delete qs[key];
        }
    });
    return new URLSearchParams(qs).toString()
}

const queryToAlerts = async (db, { isHx, page, search, tagId, start, end }) => {
    let skip = (page - 1) * pageSize;
    let take = pageSize;
    if (!isHx) {
        skip = 0;
        take = pageSize * page;
    }
    const findOptions = {
        take, skip,
        orderBy: [
            {
                timestamp: 'desc',
            },
        ],
        include: {
            tags: true,
        }
    }

    findOptions.where = {}
    if (tagId) {
        findOptions.where = {
            tags: {
                every: {
                    id: tagId
                }

            },
            ...findOptions.where
        }
    }

    if (search) {
        findOptions.where = {
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ],
            ...findOptions.where
        }
    }

    if (start && end) {
        findOptions.where = {
            timestamp: {
                gte: new Date(start),
                lt: new Date(end)
            },
            ...findOptions.where
        }
    }

    const alerts = await db.alert.findMany(findOptions)

    return alerts;
}

module.exports = {
    reqToQuery,
    queryToAlerts,
    buildQuery,
    isHxReq
}
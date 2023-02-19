# Self hosted Feed

Consolidate alerts from multiple feeds, use the feeder `/webhook` endpoint to add alerts to the feed.

[blog post](https://blog.niradler.com/consolidate-alerts-with-feeder)

## Usage

docker-compose is the easiest way to start, by default feeder will use Sqlite, you can change that easily with prisma orm.

```yml
version: '3.4'

services:
    feeder:
        container_name: feeder
        image: niradler/feeder
        restart: always
        environment:
            DATABASE_URL: 'postgresql://postgres:${DB_POSTGRESDB_PASSWORD}@postgres:5432/feeder?schema=public'
            JWT_SECRET: '${JWT_SECRET}'
            SESSION_SECRET: '${SESSION_SECRET}'
            FEEDER_PASSWORD: '${FEEDER_PASSWORD}'
            API_KEY: '${API_KEY}'
            NODE_ENV: production
            STATIKLY_CORS_ORIGIN: localhost
            STATIKLY_GLOBAL_HELMET: false
        volumes:
            - ./data:/usr/src/app/prisma/data
        ports:
            - 3111:3111
    postgres:
        image: postgres:latest
        container_name: postgres
        restart: always
        volumes:
            - ./data:/var/lib/postgresql/data
        environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: '${DB_POSTGRESDB_PASSWORD}'
        ports:
            - '5432:5432'
```

Add some alerts:

```sh
curl --location --request POST 'http://localhost:3111/webhook' \
--header 'Authorization: API_KEY' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title":"Security Alert (S3)",
    "description":"Public bucket found, account 1236549, bucket: public-bucket-danger",
    "level":"error"
}'
```

Available Alert fields:

-   `title` - The title of the alert
-   `description` - The description of the alert
-   `level` - The level of the alert, can be empty/error/warning/info
-   `action` - The form action for the alert (trigger by the response button, see image above)
-   `actionMethod` - The form method for the alert, default to `POST`
-   `timestamp` - The timestamp for the alert
-   `tags` - The tags for the alert (experimental)
-   `groupId` - The groupId for the alert (experimental)

Open the browser and go to localhost:3111

![homepage](https://github.com/niradler/feeder/blob/main/demo/feeder.png?raw=true)

### Tech Stack

-   Statikly + Fastify
-   Prisma
-   htmx
-   tailwind + daisyUI

### TODO:

-   steps ui (consolidate alerts with groupId)
-   integrations (TBD)
-   filter by timestamp

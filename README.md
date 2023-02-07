# Self hosted Feed

consolidate alerts from multiple feeds, use the feeder `/webhook` endpoint to add alerts to the feed.

## Usage

docker-compose is the easiest way to start

```yml
version: '3.4'

services:
    niradlercom:
        container_name: feeder
        image: niradler/feeder
        restart: always
        environment:
            DATABASE_URL: 'file:./data/feeder.db'
            API_KEY: '${API_KEY}'
            NODE_ENV: production
            STATIKLY_CORS_ORIGIN: localhost
            STATIKLY_GLOBAL_HELMET: false
        ports:
            - 3111:3111
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

-   Statikly
-   htmx
-   tailwind + daisyUI

### TODO:

-   socket connection should update the ui instead of requesting to refresh
-   steps ui (consolidate alerts)
-   docker
-   login (not sure if this is needed)

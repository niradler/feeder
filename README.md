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
            - 3111:3000
```

Add some alerts

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

Open the browser and go to localhost:3111

![homepage](https://github.com/niradler/feeder/blob/main/demo/feeder.png?raw=true)

TODO:

- socket connection should update the ui instead of requesting to refresh
- steps ui (consolidate alerts)
- docker
- login (not sure if this is needed)

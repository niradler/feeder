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
      DATABASE_URL: "file:./data/feeder.db"
      API_KEY: "${API_KEY}"
      NODE_ENV: production
      STATIKLY_CORS_ORIGIN: localhost
      STATIKLY_GLOBAL_HELMET: false
    ports:
      - 3111:3000
```

`curl `

go to localhost:3111



TODO:

- socket connection should update the ui instead of requesting to refresh
- steps ui (consolidate alerts)
- docker
- login (not sure if this is needed)
  
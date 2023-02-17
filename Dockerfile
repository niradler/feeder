FROM niradler/statikly

WORKDIR /usr/src/app

USER root
RUN apk add --no-cache libc6-compat openssl

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm i -g npm
RUN npm install --production --silent
COPY . .

RUN chown -R node /usr/src/app
USER node

EXPOSE 3111

ENTRYPOINT [ ]

CMD ["sh" ,"start.sh"]

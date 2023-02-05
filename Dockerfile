FROM niradler/statikly

WORKDIR /usr/src/app

USER root
RUN apk add --no-cache libc6-compat

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .

EXPOSE 3000
RUN chown -R node /usr/src/app
USER node

ENTRYPOINT [ ]

CMD ["sh" ,"start.sh"]

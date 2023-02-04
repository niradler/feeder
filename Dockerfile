FROM niradler/statikly

WORKDIR /usr/src/app

USER root

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent
COPY . .

EXPOSE 3000
RUN chown -R node /usr/src/app
USER node

CMD ["start" ,"-a", "plugins" ,"--level" ,"info", "--host", "0.0.0.0"]

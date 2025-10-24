FROM node:24.7.0-alpine as dependencies

LABEL maintainer="bchang16@myseneca.ca"

LABEL description="Fragment Node.js Express Application"

COPY package*.json ./

RUN npm install

FROM node:24.7.0-alpine as runtime

ENV PORT=8080 \ NPM_CONFIG_LOGLEVEL=warn \ NPM_CONFIG_COLOR=false

WORKDIR /app

COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

CMD npm start

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=30s --start-period=10s --retries=3 \
  CMD curl --fail http://localhost || exit 1

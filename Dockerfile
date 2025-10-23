FROM node:24.7.0-alpine

LABEL maintainer="bchang16@myseneca.ca"

LABEL description="Fragment Node.js Express Application"

ENV PORT=8080 \ NPM_CONFIG_LOGLEVEL=warn \ NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY ./src ./src

COPY ./tests/.htpasswd ./tests/.htpasswd

CMD npm start

EXPOSE 8080

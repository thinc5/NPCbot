FROM node:14.4.0-alpine3.12

WORKDIR /opt/app

COPY . .

RUN apk add --no-cache make gcc g++ python2 && \
  npm install && \
  apk del make gcc g++ python2

CMD npm run start

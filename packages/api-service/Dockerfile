FROM node:18-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./
# https://github.com/nodejs/docker-node/issues/282#issuecomment-358907790
RUN apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++ \
    && npm ci \
    && apk del build-dependencies

COPY ./ ./
RUN npm run build

#

FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist/package*.json ./

RUN apk --no-cache --virtual build-dependencies add \
    python3 \
    make \
    g++ \
    && npm ci --production \
    && apk del build-dependencies

COPY --from=build /usr/src/app/dist/ ./

RUN apk add --no-cache bash

COPY ./wait-for-it.sh  ./

EXPOSE 3000

CMD [ "npm", "start" ]

FROM node:latest AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

RUN yarn add @nestjs/swagger swagger-ui-express

COPY . .

FROM node:latest as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

RUN	yarn install @nestjs/config

RUN yarn install @hapi/joi @types/hapi__joi

RUN yarn install @nestjs/typeorm typeorm pg

RUN yarn install @nestjs/passport passport passport-local

CMD tail -F /dev/null
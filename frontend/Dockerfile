FROM node:lts
# vue-cli reqires 8.10.0+ 

EXPOSE 8080

WORKDIR /app

COPY package.json /app/package.json

RUN yarn install

RUN yarn global add @vue/cli

# RUN vue add vuetify

USER node

CMD ["yarn", "serve"]

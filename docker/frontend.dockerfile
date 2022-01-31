FROM node:lts
# vue-cli reqires 8.10.0+ 

WORKDIR /app

RUN yarn global add @vue/cli

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "-c", "yarn install --non-interactive && yarn serve"]

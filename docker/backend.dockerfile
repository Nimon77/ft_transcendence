FROM node:lts

WORKDIR /app

RUN yarn global add @nestjs/cli

EXPOSE 3000

ENTRYPOINT [ "/bin/sh", "-c", "yarn install --non-interactive && yarn start:dev" ]

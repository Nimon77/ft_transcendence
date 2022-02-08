FROM node:lts
RUN npm i -g pnpm

WORKDIR /app
RUN rm -r node_modules

RUN pnpm i

EXPOSE 3000

CMD ["pnpm","start:dev"]
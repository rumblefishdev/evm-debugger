FROM node:16-buster

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

COPY ./dist/hardhat.config.js .

CMD [ "node", "dist/script.js" ]
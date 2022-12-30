FROM node:16-buster

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

COPY ./dist/hardhat.config.js .
COPY patches/node_modules/hardhat/internal/core/providers/http.js node_modules/hardhat/internal/core/providers/http.js

CMD [ "node", "dist/transactionTraceProvider.js" ]
FROM node:18.19.0
WORKDIR /usr/src/app

COPY ./dist/ ./dist/
COPY ./node_modules/ ./node_modules/
COPY ./dist/hardhat.config.js .

CMD [ "node", "dist/src/sqsConsumer.js" ]
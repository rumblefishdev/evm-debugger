FROM node:16-buster AS build
ARG bundle=transaction-trace-provider.zip

WORKDIR /usr/src/app
ADD ${bundle} /tmp
RUN unzip -q /tmp/${bundle} && rm /tmp/${bundle}

FROM node:16-buster

WORKDIR /usr/src/app
COPY --from=build /usr/src/app /usr/src/app

COPY ./dist/hardhat.config.js .
COPY patches/node_modules/hardhat/internal/core/providers/http.js node_modules/hardhat/internal/core/providers/http.js

CMD [ "node", "dist/transactionTraceProvider.js" ]
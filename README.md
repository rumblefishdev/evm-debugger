### Development

To start development, you have to:

1. Install `lerna` globally with `npm i -g lerna@^6.0.3`
2. Run `lerna bootstrap`
3. Run `lerna link`
4. Run `lerna run build`
5. Run `npm i --legacy-peer-deps`
6. Run `npm run frontend:start`

### Testing

You must fetch abis and sources for all new test transactions added to `./packages/analyzer/test` by running `npm run analyzer:test:fetch-abis`.

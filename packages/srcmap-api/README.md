# Description

Simple API handler that initialize lifecycle of tx analyze.


# Building

Package is built by `esbuild` bundler.

`npm run build`

# Tests

`npm run test`

`npm run unit`

`npm run unit-watch`

# Development

To provide full flow experience please use `packages/infra/local` stack.

`make start`

`make logs`

`make clean`

Stack output contain url to API and lambdas are in the sync with life code thanks to SAM configuration.

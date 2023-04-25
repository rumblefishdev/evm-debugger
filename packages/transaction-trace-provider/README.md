# Description

Package contain handlers to SQS.
Main consumer lambda is responsible for fetching trace logs, putting them into S3 bucket and generating proper DDB event.
Dead Letter lambda is only consuming message and putting `FAILED` DDB event.

# Building

Package is built by `esbuild` bundler.

`npm run build`

## Hardhat

Due to `hardhat` internal tricks it is impossible to keep it as bundled package. Due to it, is attached to infrastructure as 
a dependency lambda layer with source in the `dependecies` directory.

### Retry/API rate limit bug

Due to [issue](https://github.com/NomicFoundation/hardhat/issues/3501) we are forced to make manual patch in `postinstall` step.

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

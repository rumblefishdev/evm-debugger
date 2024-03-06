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

# Build docker image and push to ECR

run `make rebootstrap` in root directory
cd to `packages/transaction-trace-provider`
run `npm run build` to build package
run `docker build .` to build docker image
run `docker tag <tag-from-docker-build> 428196107266.dkr.ecr.us-east-1.amazonaws.com/transaction-trace-provider:v<new-version>` to tag the image
login to ecr by running `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 428196107266.dkr.ecr.us-east-1.amazonaws.com`
run `docker push 428196107266.dkr.ecr.us-east-1.amazonaws.com/transaction-trace-provider:v<new-version>` to push the image to ecr
update version in `packages/infra/services.yml` -> `TransactionTraceProviderImage` to the new version
run `make stage-deploy` in infra directory to deploy the new version of the image to staging
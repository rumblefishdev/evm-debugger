# Push docker container to dev

```
export AWS_PROFILE=rf # assumign this is how you name the profile
make login-ecr
make deploy-dev
```


# Run container on a local machine for testing purpose


## Build container

```
make build-dev
```

## Run it

```
docker run \
    -e TX_HASH=0xcbed2a2785f14ff75d5b251c4d2e260f07d60e1352123f7d1de80b13c0483873 \
    -e CHAIN_ID=1 \
    -e HARDHAT_FORKING_URL=https://eth-mainnet.alchemyapi.io/v2/PmDXrefs8kgu3ERHun0yjVkeGrVqs0MQ \
    -e TRANSACTION_TRACE_BUCKET=transaction-trace-storage.rumblefish.dev \
    -e AWS_PROFILE=rf \
    -v $HOME/.aws:/root/.aws \
    045028348791.dkr.ecr.us-east-1.amazonaws.com/transaction-trace-provider
```

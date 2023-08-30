#!/bin/bash
#
# Script for pulling contract created by srcmap functions from s3
# For debugging purposes only
#
# Usage: ./scripts/pull-contract-payload.sh <CHAIN_ID> <ADDRESS> <ENVIRONMENT>
#
# Example:
# ./scripts/pull-contract-payload.sh 1 0xbd82Cd2f7C2B8710A879580399CFbfF61c5020B9
#
# You can also specify environment as third argument, default is stage
# ./scripts/pull-contract-payload.sh 1 0xbd82Cd2f7C2B8710A879580399CFbfF61c5020B9 prod

SCRIPT_DIR_PATH=$( cd ${0%/*} && pwd -P )

CHAIN_ID=$1
ADDRESS=$2
ENVIRONMENT=${3:-stage}

if [ -z "$CHAIN_ID" ]; then
  echo "First argument CHAIN_ID is required"
  exit 1
fi

if [ -z "$ADDRESS" ]; then
  echo "Second argument ADDRESS is required"
  exit 1
fi

if [ "$ENVIRONMENT" != "stage" ] && [ "$ENVIRONMENT" != "prod" ]; then
  echo "Third argument ENVIRONMENT must be either stage or prod"
  exit 1
fi

BUCKET=transaction-trace-storage-$ENVIRONMENT.rumblefish.dev
CONTRACT_BUCKET_PATH=s3://$BUCKET/contracts/$CHAIN_ID/$ADDRESS
CONTRACT_DIR_PATH=$SCRIPT_DIR_PATH/.tmp/contracts/$CHAIN_ID/$ADDRESS
PAYLOAD_PATH=$CONTRACT_DIR_PATH/payload.json

echo "Pulling contract payload for $CHAIN_ID/$ADDRESS from $ENVIRONMENT"
rm -rf $CONTRACT_DIR_PATH
aws s3 sync $CONTRACT_BUCKET_PATH $CONTRACT_DIR_PATH

if [ ! -f "$PAYLOAD_PATH" ]; then
  echo "No contract payload found for $CHAIN_ID/$ADDRESS in $ENVIRONMENT"
  rm -rf $CONTRACT_DIR_PATH
  exit 1
fi

TMP_FILE=$(mktemp)
cat $PAYLOAD_PATH | jq . > $TMP_FILE
mv $TMP_FILE $PAYLOAD_PATH

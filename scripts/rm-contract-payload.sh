#!/bin/bash
#
# Script for removing contract payload stored on s3 bucked created by srcmap functions
# For debugging purposes only
#
# Usage: ./scripts/rm-contract-payload.sh <CHAIN_ID> <ADDRESS> <ENVIRONMENT>
#
# Example:
# ./scripts/rm-contract-payload.sh 1 0xbd82Cd2f7C2B8710A879580399CFbfF61c5020B9
#
# You can also specify environment as third argument, default is stage
# ./scripts/rm-contract-payload.sh 1 0xbd82Cd2f7C2B8710A879580399CFbfF61c5020B9 prod

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

echo "Removing contract payload for $CHAIN_ID/$ADDRESS from $ENVIRONMENT"
aws s3 rm $CONTRACT_BUCKET_PATH --recursive | true

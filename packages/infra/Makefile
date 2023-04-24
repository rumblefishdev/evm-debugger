DEV_PARAMETERS_FILE=template-config.stage.json
DEV_PARAMETERS=$(shell cat $(DEV_PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
DEV_REGION=us-east-1

DEV_ARTIFACTS_BUCKET_NAME=artifacts.evm-transaction-trace.rumblefish.com
DEV_ARTIFACTS_S3_PREFIX=dev/infrastructure
DEV_STACK_NAME=evm-transaction-trace

TEMPLATE_FILE=main.yml
CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND

VERSION=current
ARTIFACT_NAME=main.zip

.PHONY: deploy-dev

build-dev:
	lerna bootstrap
	lerna link
	sam build

upload-dev: build-dev
	sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(DEV_ARTIFACTS_BUCKET_NAME) --s3-prefix $(DEV_ARTIFACTS_S3_PREFIX)/$(VERSION) --region $(DEV_REGION)
	zip $(ARTIFACT_NAME) $(TEMPLATE_FILE) $(DEV_PARAMETERS_FILE) Makefile

deploy-dev: upload-dev
	sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(DEV_STACK_NAME) --capabilities $(CAPABILITIES)  --region $(DEV_REGION) --parameter-overrides $(DEV_PARAMETERS)

logs-dev:
	sam logs --stack-name $(DEV_STACK_NAME) --tail

logs-sqs-dev:
	sam logs -n TransactionTraceSqsHandlerFunction --stack-name ${DEV_STACK_NAME} --tail


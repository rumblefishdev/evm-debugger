.DEFAULT_GOAL := build

REGION=us-east-1
ARTIFACTS_BUCKET_NAME=artifacts.evm-transaction-trace.rumblefish.com
TEMPLATE_FILE=main.yml
CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM
TAGS="Owner=evm-debugger"

VERSION=current
ARTIFACT_NAME=main.zip

build:
	sam build

upload-stage: ARTIFACTS_S3_PREFIX=stage/infrastructure
upload-stage: PARAMETERS_FILE=template-config.stage.json
upload-stage: build
	sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(ARTIFACTS_BUCKET_NAME) --s3-prefix $(ARTIFACTS_S3_PREFIX)/$(VERSION) --region $(REGION)

deploy-stage: STACK_NAME=evm-transaction-trace-stage
deploy-stage: PARAMETERS_FILE=template-config.stage.json
deploy-stage: PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
deploy-stage: upload-stage
	sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS) --tags $(TAGS)

logs-stage: STACK_NAME=evm-transaction-trace-stage
logs-stage:
	sam logs --stack-name $(STACK_NAME) --tail

logs-sqs-stage: STACK_NAME=evm-transaction-trace-stage
logs-sqs-stage:
	sam logs -n TransactionTraceService/TransactionTraceSqsHandlerFunction --stack-name ${STACK_NAME} --tail


# PROD

upload-prod: ARTIFACTS_S3_PREFIX=prod/infrastructure
upload-prod: PARAMETERS_FILE=template-config.prod.json
upload-prod: build
	sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(ARTIFACTS_BUCKET_NAME) --s3-prefix $(ARTIFACTS_S3_PREFIX)/$(VERSION) --region $(REGION)

deploy-prod: STACK_NAME=evm-transaction-trace-prod
deploy-prod: PARAMETERS_FILE=template-config.prod.json
deploy-prod: PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
deploy-prod: upload-prod
	sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)  --tags $(TAGS)

logs-prod: STACK_NAME=evm-transaction-trace-prod
logs-prod:
	sam logs --stack-name $(STACK_NAME) --tail

logs-sqs-prod: STACK_NAME=evm-transaction-trace-prod
logs-sqs-prod:
	sam logs -n TransactionTraceService/TransactionTraceSqsHandlerFunction --stack-name ${STACK_NAME} --tail

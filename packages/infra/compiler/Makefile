REGION=us-east-1
ARTIFACTS_BUCKET_NAME=artifacts.evm-transaction-trace.rumblefish.com
TEMPLATE_FILE=template.yml
CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM
TAGS="Owner=evm-debugger"

VERSION=current
ARTIFACT_NAME=template.zip
SOLC_VERSIONS = v0.8.20 v0.8.19 v0.8.18 v0.8.17 v0.8.16 v0.8.15 v0.8.14 v0.8.13 v0.8.12 v0.8.11 v0.8.10 v0.8.9 v0.8.8 v0.8.7 v0.8.6 v0.8.5 v0.8.4 v0.8.3 v0.8.2 v0.8.1 v0.8.0 v0.7.6 v0.7.5 v0.7.4 v0.7.3 v0.7.2 v0.7.1 v0.7.0 v0.6.12 v0.6.11 v0.6.10 v0.6.9 v0.6.8 v0.6.7 v0.6.6 v0.6.5 v0.6.4 v0.6.3 v0.6.2 v0.6.1 v0.6.0


build:
	sam build

# STAGE

deploy-stage: STACK_NAME=evm-scrmap-compiler-stage
deploy-stage: PARAMETERS_FILE=template-config.stage.json
deploy-stage: PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
deploy-stage: VERSIONS_FILE=solc-versions.stage.json
deploy-stage: VERSIONS=$(shell cat $(VERSIONS_FILE) | jqn 'join(" ")')
deploy-stage: ARTIFACTS_S3_PREFIX=stage/infrastructure/compiler
deploy-stage:
deploy-stage: 
	for version in ${VERSIONS}; do \
		echo "Running for: $${version};"; \
		node ./bin/prebuild.js $${version}; \
		echo "Stack: ${STACK_NAME}-$${version}"; \
		pwd; \
		sam build; \
		sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(ARTIFACTS_BUCKET_NAME) --s3-prefix $(ARTIFACTS_S3_PREFIX)/$(VERSION) --region $(REGION); \
		sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(STACK_NAME)-$${version} --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)  --tags $(TAGS); \
	done


# PROD

upload-prod: ARTIFACTS_S3_PREFIX=prod/infrastructure/compiler
upload-prod: PARAMETERS_FILE=template-config.prod.json
upload-prod: build
	sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(ARTIFACTS_BUCKET_NAME) --s3-prefix $(ARTIFACTS_S3_PREFIX)/$(VERSION) --region $(REGION)

deploy-prod: STACK_NAME=evm-transaction-trace-prod
deploy-prod: PARAMETERS_FILE=template-config.prod.json
deploy-prod: PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
deploy-prod: upload-prod
	sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS)  --tags $(TAGS)


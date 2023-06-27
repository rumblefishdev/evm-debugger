REGION=us-east-1
ARTIFACTS_BUCKET_NAME=artifacts.evm-transaction-trace.rumblefish.com
TEMPLATE_FILE=template.yml
CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM
TAGS="Owner=evm-debugger"

VERSION=current
ARTIFACT_NAME=template.zip

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
	for version in $(VERSIONS); do \
		echo "Running for: $${version};"; \
		node ./bin/prebuild.js $${version}; \
		sam build; \
		sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(ARTIFACTS_BUCKET_NAME) --s3-prefix $(ARTIFACTS_S3_PREFIX)/$(VERSION) --region $(REGION); \
		sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(STACK_NAME)-$${version} --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS) CompilerVersion=$${version}  --tags $(TAGS); \
	done


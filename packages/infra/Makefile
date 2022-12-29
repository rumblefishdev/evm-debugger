DEV_PARAMETERS_FILE=template-config.stage.json
DEV_PARAMETERS=$(shell cat $(DEV_PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
DEV_REGION=us-east-1

DEV_ARTIFACTS_BUCKET_NAME=artifacts.evm-debugger-hardhat.rumblefish.com
DEV_ARTIFACTS_S3_PREFIX=dev/infrastructure
DEV_STACK_NAME=evm-debugger-harhat

TEMPLATE_FILE=main.yml
CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND

VERSION=current
ARTIFACT_NAME=main.zip

.PHONY: deploy-dev

#copy-s3-zip-files-dev:
#	aws s3 cp s3://$(DEV_ARTIFACTS_BUCKET_NAME)/dev/library-app/library-app.zip .
#	aws s3 cp s3://$(DEV_ARTIFACTS_BUCKET_NAME)/dev/library-app/imagestateactions.yml .

build-dev:
	sam build

upload-dev: build-dev
	sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(DEV_ARTIFACTS_BUCKET_NAME) --s3-prefix $(DEV_ARTIFACTS_S3_PREFIX)/$(VERSION) --region $(DEV_REGION)
	zip $(ARTIFACT_NAME) $(TEMPLATE_FILE) $(DEV_PARAMETERS_FILE) Makefile
	aws s3 cp $(ARTIFACT_NAME) s3://$(DEV_ARTIFACTS_BUCKET_NAME)/$(DEV_ARTIFACTS_S3_PREFIX)/$(VERSION)/ --region $(DEV_REGION)

deploy-dev: upload-dev
	sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(DEV_STACK_NAME) --capabilities $(CAPABILITIES)  --region $(DEV_REGION) --parameter-overrides $(DEV_PARAMETERS)



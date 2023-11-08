.DEFAULT_GOAL := help

###############################################
################## Variables ##################
###############################################

REGION=us-east-1
ARTIFACTS_BUCKET_NAME=artifacts.evm-transaction-trace.rumblefish.com
CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM
S3_VERSION=current
BUILD_DIR=.aws-sam/build
CACHE_DIR=.aws-sam/cache
TEMPLATE_FILE=.aws-sam/build/template.yaml
OUTPUT_TEMPLATE_FILE=.aws-sam/main.yaml
ARTIFACT_NAME=main.zip

###############################################
################# Functions ###################
###############################################

define env-name-check
	@if [ -z "${ENV_NAME}" ]; then \
		echo "Please specify an environment to deploy"; \
		echo "Example:"; \
		echo "	ENV_NAME=stage"; \
		exit 1; \
	fi
endef

###############################################
############# Internal Targets ################
###############################################

.PHONY: .build
.build:
	sam build \
		--build-dir $(BUILD_DIR) \
		--cache-dir $(BUILD_DIR) \

.PHONY: .package
.package: ARTIFACTS_S3_PREFIX=$(ENV_NAME)/infrastructure/$(S3_VERSION)
.package:
	$(env-name-check)
	sam package \
		--output-template-file $(OUTPUT_TEMPLATE_FILE) \
		--template-file $(TEMPLATE_FILE) \
		--s3-bucket $(ARTIFACTS_BUCKET_NAME) \
		--s3-prefix $(ARTIFACTS_S3_PREFIX) \
		--region $(REGION)

.PHONY: .deploy
.deploy: STACK_NAME=evm-transaction-trace-$(ENV_NAME)
.deploy: PARAMETERS_FILE=template-config.$(ENV_NAME).json
.deploy: PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
.deploy: GIT_COMMIT=$(shell git rev-parse HEAD)
.deploy: TAGS="Owner=evm-debugger Environment=$(ENV_NAME) GitCommit=$(GIT_COMMIT)"
.deploy:
	$(env-name-check)
	sam deploy \
		--template-file $(OUTPUT_TEMPLATE_FILE) \
		--stack-name $(STACK_NAME) \
		--capabilities $(CAPABILITIES)  \
		--region $(REGION) \
		--parameter-overrides $(PARAMETERS) \
		--tags $(TAGS)

.PHONY: .logs
.logs: STACK_NAME=evm-transaction-trace-$(ENV_NAME)
.logs:
	$(env-name-check)
	sam logs --stack-name $(STACK_NAME) --tail

.PHONY: .logs-sqs
.logs-sqs: STACK_NAME=evm-transaction-trace-$(ENV_NAME)
.logs-sqs:
	$(env-name-check)
	sam logs -n TransactionTraceService/TransactionTraceSqsHandlerFunction --stack-name $(STACK_NAME) --tail

.PHONY: .frontend-build
.frontend-build:
	$(env-name-check)

	cd ../types && npm run build
	cd ../analyzer && npm run build
	cd ../frontend && npm run build:$(ENV_NAME)

.PHONY: .frontend-deploy
.frontend-deploy: PREFIX=evm-debugger
.frontend-deploy:
	$(env-name-check)

	if [ -z "${CLOUD_FRONT_DISTRIBUTION_ID}" ]; then \
		echo "Please specify a CloudFront distribution id to deploy"; \
		echo "Example:"; \
		echo "	CLOUD_FRONT_DISTRIBUTION_ID=12312312312312"; \
		exit 1; \
	fi

	if [ -z "${BUCKET_NAME}" ]; then \
		echo "Please specify a bucket name to deploy"; \
		echo "Example:"; \
		echo "	BUCKET_NAME=some-bucket"; \
		exit 1; \
	fi

	if [ -z "${PREFIX}" ]; then \
		echo "Please specify a prefix to deploy"; \
		echo "Example:"; \
		echo "	PREFIX=some-prefix"; \
		exit 1; \
	fi

	aws s3 sync ../frontend/build s3://${BUCKET_NAME}/$(PREFIX) --delete --exact-timestamps
	aws cloudfront create-invalidation --distribution-id ${CLOUD_FRONT_DISTRIBUTION_ID} --paths "/$(PREFIX)/*"

###############################################
################## Targets ####################
###############################################

.PHONY: help
help:
	@echo ""
	@echo "Usage:"
	@echo "  make <target>"
	@echo ""
	@echo "Stage targets:"
	@echo "  make stage-deploy            - deploy stage infra cloudformation stack"
	@echo "  make stage-logs              - show stage logs"
	@echo "  make stage-logs-sqs          - show stage sqs logs"
	@echo "  make stage-frontend-deploy   - deploy stage frontend to s3"
	@echo ""
	@echo "Prod targets:"
	@echo "  make prod-deploy             - deploy prod infra cloudformation stack"
	@echo "  make prod-logs               - show prod logs"
	@echo "  make prod-logs-sqs           - show prod sqs logs"
	@echo "  make prod-frontend-deploy    - deploy prod frontend to s3"
	@echo ""
	@echo "Utils"
	@echo "  make help                    - show this help"
	@echo ""

local-rebootstrap:
	@if [ -z "${CI}" ]; then \
		$(MAKE) -C ../.. rebootstrap; \
	fi

.PHONY: build
build:
	@$(MAKE) -s .build

################## Stage ####################

.PHONY: stage-deploy
stage-deploy:
	@$(MAKE) -s .build
	@$(MAKE) -s .package ENV_NAME=stage
	@$(MAKE) -s .deploy ENV_NAME=stage

.PHONY: stage-frontend-deploy
stage-frontend-deploy: ENV_NAME=stage
stage-frontend-deploy: CLOUD_FRONT_DISTRIBUTION_ID=E1TRXMZGQSBIBH
stage-frontend-deploy: BUCKET_NAME=www-staging-aldnr.rumblefish.dev.evmdebugger
stage-frontend-deploy:
	@$(MAKE) -s .frontend-build ENV_NAME=$(ENV_NAME)
	@$(MAKE) -s .frontend-deploy \
		ENV_NAME=$(ENV_NAME) \
		CLOUD_FRONT_DISTRIBUTION_ID=$(CLOUD_FRONT_DISTRIBUTION_ID) \
		BUCKET_NAME=$(BUCKET_NAME)

.PHONY: stage-logs
stage-logs:
	@$(MAKE) -s .logs ENV_NAME=stage

.PHONY: stage-logs-sqs
stage-logs-sqs:
	@$(MAKE) -s .logs-sqs ENV_NAME=stage

################## Prod ####################

.PHONY: prod-deploy
prod-deploy:
	@$(MAKE) -s .build
	@$(MAKE) -s .package ENV_NAME=prod
	@$(MAKE) -s .deploy ENV_NAME=prod

# .PHONY: prod-frontend-deploy
# prod-frontend-deploy: ENV_NAME=prod
# prod-frontend-deploy: CLOUD_FRONT_DISTRIBUTION_ID=E3IK5XITYN78AJ
# prod-frontend-deploy: BUCKET_NAME=www.rumblefish.dev.evmdebugger
# prod-frontend-deploy: 
# 	@$(MAKE) -s .frontend-build ENV_NAME=$(ENV_NAME)
# 	@$(MAKE) -s .frontend-deploy \
# 		ENV_NAME=$(ENV_NAME) \
# 		CLOUD_FRONT_DISTRIBUTION_ID=$(CLOUD_FRONT_DISTRIBUTION_ID) \
# 		BUCKET_NAME=$(BUCKET_NAME)

.PHONY: prod-logs
prod-logs:
	@$(MAKE) -s .logs ENV_NAME=prod

.PHONY: prod-logs-sqs
prod-logs-sqs:
	@$(MAKE) -s .logs-sqs ENV_NAME=prod

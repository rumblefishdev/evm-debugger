.DEFAULT_GOAL := help

###############################################
################## Variables ##################
###############################################

REGION=us-east-1
ARTIFACTS_BUCKET_NAME=artifacts.evm-transaction-trace.rumblefish.com
CAPABILITIES=CAPABILITY_IAM CAPABILITY_AUTO_EXPAND CAPABILITY_NAMED_IAM
S3_VERSION=current
ARTIFACT_NAME=template.zip

###############################################
################# Functions ###################
###############################################

define solc-version-check
	@if [ -z "${SOLC_VERSION}" ]; then \
		echo "Please specify a Solc compiler version to deploy"; \
		echo "Version should be picked from following tags list"; \
		echo "	https://api.github.com/repos/ethereum/solidity/tags"; \
		echo "All dots in version should be replaced with dashes"; \
		echo ""; \
		echo "Example:"; \
		echo "	SOLC_VERSION=v0-8-20"; \
		exit 1; \
	fi
endef

define env-name-check
	@if [ -z "${ENV_NAME}" ]; then \
		echo "Please specify an environment to deploy"; \
		echo "Example:"; \
		echo "	ENV_NAME=stage"; \
		exit 1; \
	fi
endef

define ci-check
	@if [ -n "${CI}" ]; then \
		echo "This target is only to be run locally"; \
		exit 1; \
	fi
endef

define stacks-status
	$(eval STATUSES := $(1))
	@aws cloudformation list-stacks \
		--region $(REGION) \
		--stack-status-filter $(STATUSES) \
		--query "StackSummaries[?starts_with(StackName, 'emv-debugger-$(ENV_NAME)-srcmap-compiler-')].[LastUpdatedTime,StackName,StackStatus]" \
		--output text | \
		sort -k 2
endef

###############################################
############# Internal Targets ################
###############################################

.PHONY: .build
.build: BUILD_DIR=.aws-sam/$(SOLC_VERSION)/build
.build: CACHE_DIR=.aws-sam/$(SOLC_VERSION)/cache
.build:
	$(solc-version-check)
	@echo "================================"
	@echo "===== Running for: $(SOLC_VERSION)"
	@echo "================================"

	node ./bin/prebuild.js $(SOLC_VERSION)
	sam build \
		--build-dir $(BUILD_DIR) \
		--cache-dir $(BUILD_DIR) \

.PHONY: .package
.package: TEMPLATE_FILE=.aws-sam/$(SOLC_VERSION)/build/template.yaml
.package: OUTPUT_TEMPLATE_FILE=.aws-sam/$(SOLC_VERSION)/main_$(ENV_NAME).yaml
.package: ARTIFACTS_S3_PREFIX=$(ENV_NAME)/infrastructure/compiler/$(S3_VERSION)
.package:
	$(solc-version-check)
	$(env-name-check)

	sam package \
		--output-template-file $(OUTPUT_TEMPLATE_FILE) \
		--template-file $(TEMPLATE_FILE) \
		--s3-bucket $(ARTIFACTS_BUCKET_NAME) \
		--s3-prefix $(ARTIFACTS_S3_PREFIX) \
		--region $(REGION)

.PHONY: .deploy
.deploy: OUTPUT_TEMPLATE_FILE=.aws-sam/$(SOLC_VERSION)/main_$(ENV_NAME).yaml
.deploy: STACK_NAME=emv-debugger-$(ENV_NAME)-srcmap-compiler-$(SOLC_VERSION)
.deploy: PARAMETERS_FILE=template-config.$(ENV_NAME).json
.deploy: PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
.deploy: GIT_COMMIT=$(shell git rev-parse HEAD)
.deploy: TAGS="Owner=evm-debugger Environment=$(ENV_NAME) GitCommit=$(GIT_COMMIT)"
.deploy:
	$(solc-version-check)
	$(env-name-check)

	sam deploy \
		--template-file $(OUTPUT_TEMPLATE_FILE) \
		--stack-name $(STACK_NAME) \
		--capabilities $(CAPABILITIES)  \
		--region $(REGION) \
		--parameter-overrides $(PARAMETERS) CompilerVersion=$(SOLC_VERSION) \
		--tags $(TAGS)

.PHONY: .deploy-single
.deploy-single:
	$(solc-version-check)
	$(env-name-check)
	@$(MAKE) -s .build SOLC_VERSION=$(SOLC_VERSION)
	@$(MAKE) -s .package SOLC_VERSION=$(SOLC_VERSION) ENV_NAME=$(ENV_NAME)
	@$(MAKE) -s .deploy SOLC_VERSION=$(SOLC_VERSION) ENV_NAME=$(ENV_NAME)

.PHONY: .deploy-all
.deploy-all: VERSIONS_FILE=solc-versions.$(ENV_NAME).json
.deploy-all: VERSIONS=$(shell cat $(VERSIONS_FILE) | jqn 'join(" ")')
.deploy-all:
	$(env-name-check)
	@for version in $(VERSIONS); do \
		$(MAKE) -s .build SOLC_VERSION=$${version}; \
		$(MAKE) -s .package SOLC_VERSION=$${version} ENV_NAME=$(ENV_NAME); \
		$(MAKE) -s .deploy SOLC_VERSION=$${version} ENV_NAME=$(ENV_NAME); \
	done

.PHONY: .deploy-in-background
.deploy-in-background: OUTPUT_TEMPLATE_FILE=.aws-sam/$(SOLC_VERSION)/main_$(ENV_NAME).yaml

.PHONY: .deploy-all-async
.deploy-all-async: VERSIONS_FILE=solc-versions.$(ENV_NAME).json
.deploy-all-async: VERSIONS=$(shell cat $(VERSIONS_FILE) | jqn 'join(" ")')
.deploy-all-async:
	$(ci-check)
	$(env-name-check)

	@echo "================================"
	@echo "===== Building for: $(ENV_NAME)"
	@echo "================================"

	@for version in $(VERSIONS); do \
		$(MAKE) -s .build SOLC_VERSION=$${version}; \
	done

	@echo "================================"
	@echo "===== Deploying for: $(ENV_NAME)"
	@echo "================================"
	@for version in $(VERSIONS); do \
		( \
			$(MAKE) -s .package SOLC_VERSION=$${version} ENV_NAME=$(ENV_NAME) && \
			$(MAKE) -s .deploy SOLC_VERSION=$${version} ENV_NAME=$(ENV_NAME) \
		) & \
	done
	@wait

.PHONY: .stacks-status
.stacks-status: ENV_NAME=stage
.stacks-status:
	$(env-name-check)
	@echo "================================"
	@echo "===== Success stacks for: $(ENV_NAME)"
	@echo "================================"
	@$(call stacks-status,CREATE_COMPLETE UPDATE_COMPLETE)

	@echo "================================"
	@echo "===== Failed stacks for: $(ENV_NAME)"
	@echo "================================"
	@$(call stacks-status,CREATE_FAILED UPDATE_ROLLBACK_COMPLETE UPDATE_ROLLBACK_FAILED ROLLBACK_COMPLETE ROLLBACK_FAILED DELETE_FAILED)

###############################################
################## Targets ####################
###############################################

.PHONY: help
help:
	@echo ""
	@echo "Usage:"
	@echo "  make <target>"
	@echo ""
	@echo "Common targets:"
	@echo "  make build                   - build compiler version, eg. [make build SOLC_VERSION=v0-8-20]"
	@echo ""
	@echo "Stage targets:"
	@echo "  make stage-deploy-single     - deploy single compiler version, eg. [make stage-deploy-single SOLC_VERSION=v0-8-20]"
	@echo "  make stage-deploy-all        - deploy all compiler versions"
	@echo "  make stage-deploy-all-async  - deploy all compiler versions in parallel - May be buggy, use with caution"
	@echo "  make stage-stacks-status     - show status of all stage stacks"
	@echo ""
	@echo "Prod targets:"
	@echo "  make prod-deploy-single      - deploy single compiler version, eg. [make prod-deploy-single SOLC_VERSION=v0-8-20]"
	@echo "  make prod-deploy-all         - deploy all compiler versions"
	@echo "  make prod-deploy-all-async   - deploy all compiler versions in parallel - May be buggy, use with caution"
	@echo "  make prod-stacks-status      - show status of all prod stacks"
	@echo ""
	@echo "Utils"
	@echo "  make help                    - show this help"
	@echo ""


.PHONY: build
build:
	$(solc-version-check)
	@$(MAKE) -s .build SOLC_VERSION=$(SOLC_VERSION)

################## Stage ####################

.PHONY: stage-deploy-single
stage-deploy-single:
	$(solc-version-check)
	@$(MAKE) -s .deploy-single SOLC_VERSION=$(SOLC_VERSION) ENV_NAME=stage

.PHONY: stage-deploy-all
stage-deploy-all:
	@$(MAKE) -s .deploy-all ENV_NAME=stage

.PHONY: stage-deploy-all-async
stage-deploy-all-async:
	@$(MAKE) -s .deploy-all-async ENV_NAME=stage

.PHONY: stage-stacks-status
stage-stacks-status:
	@$(MAKE) -s .stacks-status ENV_NAME=stage

################## Prod ####################

.PHONY: prod-deploy-single
prod-deploy-single:
	$(solc-version-check)
	@$(MAKE) -s .deploy-single SOLC_VERSION=$(SOLC_VERSION) ENV_NAME=prod

.PHONY: prod-deploy-all
prod-deploy-all:
	@$(MAKE) -s .deploy-all ENV_NAME=prod

.PHONY: prod-deploy-all-async
prod-deploy-all-async:
	@$(MAKE) -s .deploy-all-async ENV_NAME=prod

.PHONY: prod-stacks-status
prod-stacks-status:
	@$(MAKE) -s .stacks-status ENV_NAME=prod

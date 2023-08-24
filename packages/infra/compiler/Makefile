.DEFAULT_GOAL := build

###############################################
################## Variables ##################
###############################################

REGION=us-east-1
ARTIFACTS_BUCKET_NAME=artifacts.evm-transaction-trace.rumblefish.com
TEMPLATE_FILE=main.yml
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


###############################################
############# Internal Targets ################
###############################################

.PHONY: .deploy
.deploy: STACK_NAME=emv-debugger-$(ENV_NAME)-srcmap-compiler-$(SOLC_VERSION)
.deploy: PARAMETERS_FILE=template-config.$(ENV_NAME).json
.deploy: PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
.deploy: ARTIFACTS_S3_PREFIX=$(ENV_NAME)/infrastructure/compiler/$(S3_VERSION)
.deploy: TAGS="Owner=evm-debugger Environment=$(ENV_NAME)"
.deploy:
	$(solc-version-check)
	$(env-name-check)

	@echo "================================"
	@echo "===== Running for: $${SOLC_VERSION}"
	@echo "================================"

	node ./bin/prebuild.js $${SOLC_VERSION}
	sam build
	sam package --output-template-file $(TEMPLATE_FILE) --s3-bucket $(ARTIFACTS_BUCKET_NAME) --s3-prefix $(ARTIFACTS_S3_PREFIX) --region $(REGION)
	sam deploy --template-file $(TEMPLATE_FILE) --stack-name $(STACK_NAME) --capabilities $(CAPABILITIES)  --region $(REGION) --parameter-overrides $(PARAMETERS) CompilerVersion=$${SOLC_VERSION}  --tags $(TAGS);


.PHONY: .deploy-all
.deploy-all: VERSIONS_FILE=solc-versions.$(ENV_NAME).json
.deploy-all: VERSIONS=$(shell cat $(VERSIONS_FILE) | jqn 'join(" ")')
.deploy-all:
	$(env-name-check)
	for version in $(VERSIONS); do \
		$(MAKE) -s .deploy SOLC_VERSION=$${version} ENV_NAME=$(ENV_NAME); \
	done

###############################################
################## Targets ####################
###############################################

.PHONY: build
build:
	sam build

################## Stage ####################

.PHONY: deploy-stage-single
deploy-stage-single:
	$(solc-version-check)
	@$(MAKE) -s .deploy VERSION=$${version} ENV_NAME=stage

.PHONY: deploy-stage-all
deploy-stage-all:
	@$(MAKE) -s .deploy-all ENV_NAME=stage


################## Prod ####################

# .PHONY: deploy-prod-single
# deploy-prod-single:
# 	$(solc-version-check)
# 	@$(MAKE) -s .deploy VERSION=$${version} ENV_NAME=prod

# .PHONY: deploy-prod-all
# deploy-prod-all:
# 	@$(MAKE) -s .deploy-all ENV_NAME=prod

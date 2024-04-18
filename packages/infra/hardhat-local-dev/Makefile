FUNCTION_TO_TEST=TransactionTraceService/TransactionTraceSqsHandlerFunction
TEMPLATE_SOURCE=../template.yml
BUILD_DIR=sam-build

PARAMETERS_PATH=../template-config.stage.json

LOG_OUTPUT_FILE=log.txt
RESULT_OUTPUT_FILE=out.txt
PAYLOAD_FILE=example-payload.json
HOST=127.0.0.1
PORT=3001

.PHONY:build
build:
	echo "Building cloudformation template"
	sam build \
		--template-file $(TEMPLATE_SOURCE) \
		--build-dir $(BUILD_DIR) \
		$(FUNCTION_TO_TEST)

.PHONY:lambda-server
lambda-server: PARAMETERS=$(shell cat $(PARAMETERS_PATH) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')
lambda-server:
	echo "Starting local lambda server"
	sam local start-lambda \
		--template sam-build/template.yaml \
		--log-file $(LOG_OUTPUT_FILE) \
		--parameter-overrides $(PARAMETERS) \
		--host $(HOST) \
		--port $(PORT)

.PHONY:lambda-run
lambda-run:
	echo "Running lambda function"
	aws lambda invoke \
	--function-name TransactionTraceService/TransactionTraceSqsHandlerFunction \
	--endpoint-url http://$(HOST):$(PORT) \
	--no-verify-ssl \
	--payload fileb://$(PAYLOAD_FILE) \
	$(RESULT_OUTPUT_FILE)
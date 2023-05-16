STACK_NAME=test-transaction-trace-local
PARAMETERS_FILE=template-config.local.json
TAGS="Owner=evm-debugger"

PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')

start:
	sam sync --stack-name ${STACK_NAME} --parameter-overrides $(PARAMETERS) --tags=$(TAGS) --watch

logs:
	sam logs --stack-name ${STACK_NAME} --tail

logs-api:
	sam logs -n TransactionTraceFunction --stack-name ${STACK_NAME} --tail

logs-sqs:
	sam logs -n TransactionTraceSqsHandlerFunction --stack-name ${STACK_NAME} --tail

logs-dead-sqs:
	sam logs -n TransactionTraceSqsDeadLetterHandlerFunction --stack-name ${STACK_NAME} --tail

clean:
	sam delete --stack-name ${STACK_NAME}

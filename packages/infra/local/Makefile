.DEFAULT_GOAL := start

REGION=us-east-1
STACK_NAME=test-transaction-trace-local
PARAMETERS_FILE=template-config.local.json

PARAMETERS=$(shell cat $(PARAMETERS_FILE) | jqn 'get("Parameters") | entries | map(x => x[0] + "=" + x[1]) | join(" ")')

start:
	sam sync --stack-name ${STACK_NAME} --parameter-overrides $(PARAMETERS) --region $(REGION) --watch

logs:
	sam logs --stack-name ${STACK_NAME} --region $(REGION) --tail

logs-api:
	sam logs -n TransactionTraceApiFunction --stack-name ${STACK_NAME} --region $(REGION) --tail

logs-srcmap:
	sam logs -n SrcMapApiFunction --stack-name ${STACK_NAME} --region $(REGION) --tail

logs-srcmapcompiler:
	sam logs -n SrcMapCompilerFunction --stack-name ${STACK_NAME} --region $(REGION) --tail

logs-sqs:
	sam logs -n TransactionTraceSqsHandlerFunction --stack-name ${STACK_NAME} --region $(REGION) --tail

logs-dead-sqs:
	sam logs -n TransactionTraceSqsDeadLetterHandlerFunction --stack-name ${STACK_NAME} --region $(REGION) --tail

clean:
	sam delete --stack-name ${STACK_NAME}

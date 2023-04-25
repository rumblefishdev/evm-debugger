STACK_NAME=test-transaction-trace-local

start:
	lerna bootstrap
	sam sync --stack-name ${STACK_NAME} --watch

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

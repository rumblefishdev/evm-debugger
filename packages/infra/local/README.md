https://aws.amazon.com/blogs/compute/building-typescript-projects-with-aws-sam-cli/

sam sync --stack-name test-transaction-trace-api --watch

npm run unit -- --watch --maxWorkers=1



sam logs -n TransactionTraceFunction --stack-name test-transaction-trace-api --tail


sam logs -n TransactionTraceSqsHandlerFunction --stack-name test-transaction-trace-api --tail

sam logs -n TransactionTraceSqsDeadLetterHandlerFunction --stack-name test-transaction-trace-api --tail

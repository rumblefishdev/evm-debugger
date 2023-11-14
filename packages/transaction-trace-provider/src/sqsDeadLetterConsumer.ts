import type { Handler, SQSEvent } from 'aws-lambda'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import { AWSLambda } from '@sentry/serverless'

import { version } from '../package.json'

import { putTxEventToDdb } from './ddb'
import { DEFAULT_ERROR } from './errors'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'transaction-trace-provider-dlq')

export const consumeSqsAnalyzeTxError: Handler = async (event: SQSEvent) => {
  console.log('transaction-trace-provider-dlq', JSON.stringify(event))
  for (const record of event.Records) {
    const txHash = record.messageAttributes.txHash.stringValue!
    await putTxEventToDdb(TransactionTraceResponseStatus.FAILED, txHash, {
      errorDetails: DEFAULT_ERROR,
    })
  }
}

export const consumeSqsAnalyzeTxErrorEntrypoint = AWSLambda.wrapHandler(consumeSqsAnalyzeTxError)

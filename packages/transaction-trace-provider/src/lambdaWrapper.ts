/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/prefer-at */
import type { Handler, SQSEvent } from 'aws-lambda'
import { AWSLambda, captureException } from '@sentry/serverless'

import { version } from '../package.json'

import { localDebugTransaction } from './sqsConsumer'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'transaction-trace-provider')

export const consumeSqsAnalyzeTx: Handler = async (event: SQSEvent) => {
  console.log('consumeSqsAnalyzeTx', JSON.stringify(event, null, 2))
  console.trace('consumeSqsAnalyzeTx')
  const records = event.Records
  if (records.length === 0) {
    console.log('No records to process')
    return 'No records to process'
  }

  const txHash = records[0].messageAttributes.txHash.stringValue!
  const chainId = records[0].messageAttributes.chainId.stringValue!
  const hardhatForkingUrl = records[0].messageAttributes.hardhatForkingUrl.stringValue!
  const gasLimit = records[0].messageAttributes.gasLimit.stringValue!

  console.log(`txHash: ${txHash}`)
  console.log(`gasLimit: ${gasLimit}`)
  console.log(`chainId: ${chainId}`)
  console.log(`hardhatForkingUrl: ${hardhatForkingUrl}`)
  await localDebugTransaction({ txHash, hardhatForkingUrl, chainId, captureException })
  // await sqsConsumer({ txHash, hardhatForkingUrl, chainId, captureException })
}

export const consumeSqsAnalyzeTxEntrypoint = AWSLambda.wrapHandler(consumeSqsAnalyzeTx)

/* eslint-disable unicorn/prefer-at */
import type { Handler, SQSEvent } from 'aws-lambda'
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import hardhat from 'hardhat'
import { reset } from '@nomicfoundation/hardhat-network-helpers'
import type { TRawTransactionTraceResult } from '@evm-debuger/types'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import { AWSLambda, captureException } from '@sentry/serverless'

import { version } from '../package.json'

import { putTxEventToDdb } from './ddb'
import { getFileName, getFilePath } from './s3'
import { DEFAULT_ERROR, KNOWN_CHAIN_ERRORS } from './errors'
import { invalidateCloudFrontCache } from './cloudFront'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'transaction-trace-provider')

export const debugTransaction = async (txHash: string, chainId: string, hardhatForkingUrl: string): Promise<TRawTransactionTraceResult> => {
  await reset(`${hardhatForkingUrl}${process.env.ALCHEMY_KEY}`)
  const hardhatProvider = await hardhat.run(TASK_NODE_GET_PROVIDER, {
    chainId,
  })
  console.log(`Starting debug_traceTransaction for ${chainId}/${txHash}`)
  const traceResult: TRawTransactionTraceResult = await hardhatProvider.send('debug_traceTransaction', [txHash])
  // TODO: fix in https://github.com/rumblefishdev/evm-debugger/issues/285
  // traceResult.structLogs = traceResult.structLogs.map((structLog, index) => ({ ...structLog, index }))
  console.log(`Finished debug_traceTransaction for ${chainId}/${txHash} with ${traceResult.structLogs.length} structLogs`)
  return traceResult
}

export const consumeSqsAnalyzeTx: Handler = async (event: SQSEvent) => {
  const records = event.Records
  if (records.length === 0) {
    console.log('No records to process')
    return 'No records to process'
  }

  const txHash = records[0].messageAttributes.txHash.stringValue!
  const chainId = records[0].messageAttributes.chainId.stringValue!
  const hardhatForkingUrl = records[0].messageAttributes.hardhatForkingUrl.stringValue!

  await putTxEventToDdb(TransactionTraceResponseStatus.RUNNING, txHash)
  try {
    await debugTransaction(txHash, chainId, hardhatForkingUrl)
  } catch (error) {
    const errorMessage = { errorDetails: DEFAULT_ERROR }
    if (error instanceof Error) {
      console.log(error.message)
      errorMessage['errorDetails'] = error.message
      if (!KNOWN_CHAIN_ERRORS.includes(error.message)) captureException(error)
    }
    await putTxEventToDdb(TransactionTraceResponseStatus.FAILED, txHash, errorMessage)
    return
  }

  try {
    const path = `/${getFileName(txHash, chainId)}`
    await invalidateCloudFrontCache(process.env.CLOUDFRONT_DISTRIBUTION_ID!, [path])
  } catch (error) {
    captureException(error)
    console.log(error)
  }

  const s3Location = getFilePath(txHash, chainId)
  await putTxEventToDdb(TransactionTraceResponseStatus.SUCCESS, txHash, { s3Location })
  console.log(`Finished processing ${chainId}/${txHash}`)
  console.log(`Trace saved to ${s3Location}`)
}

export const consumeSqsAnalyzeTxEntrypoint = AWSLambda.wrapHandler(consumeSqsAnalyzeTx)

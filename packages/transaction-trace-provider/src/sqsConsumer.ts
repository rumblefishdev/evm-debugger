/* eslint-disable unicorn/prefer-at */
import type { Handler, SQSEvent } from 'aws-lambda'
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import hardhat from 'hardhat'
import { reset } from '@nomicfoundation/hardhat-network-helpers'
import type { TRawTransactionTraceResult } from '@evm-debuger/types'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import { AWSLambda, captureException } from '@sentry/serverless'
import type { CompletedPart } from '@aws-sdk/client-s3'

import { version } from '../package.json'

import { putTxEventToDdb } from './ddb'
import { getFilePath, abortMultiPartUpload, completeMultiPartUpload, createMultiPartUpload, uploadPart } from './s3'
import { DEFAULT_ERROR, KNOWN_CHAIN_ERRORS } from './errors'

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

export const uploadTrace = async (txHash: string, chainId: string, traceResult: TRawTransactionTraceResult) => {
  const uploadId = await createMultiPartUpload(txHash, chainId)

  const body = JSON.stringify({
    structLogs: traceResult.structLogs,
    returnValue: traceResult.returnValue,
    gas: traceResult.gas,
    failed: traceResult.failed,
  })
  const bufferBody = Buffer.from(body)
  const partSize = 1024 * 1024 * 10
  const parts: { PartNumber: number; body: Buffer }[] = []

  for (let rangeStart = 0; rangeStart < bufferBody.length; rangeStart += partSize) {
    const partNumber = Math.ceil(rangeStart / partSize) + 1
    const end = Math.min(rangeStart + partSize, bufferBody.length)
    const partBody = bufferBody.slice(rangeStart, end)
    parts.push({ PartNumber: partNumber, body: partBody })
  }

  const uploadedParts: CompletedPart[] = []
  for (const part of parts) {
    console.log(`Uploading part ${part.PartNumber}/${parts.length}`)
    console.log(`Part size: ${part.body.length}`)

    const partETag = await uploadPart(txHash, chainId, uploadId, part.PartNumber, part.body)
    if (!partETag) throw new Error(`Failed to upload part: ${part.PartNumber}/${parts.length}`)

    uploadedParts.push({ PartNumber: part.PartNumber, ETag: partETag })
  }

  await completeMultiPartUpload(txHash, chainId, uploadId, uploadedParts)
  console.log(`Finished uploading parts for ${chainId}/${txHash}`)
}

export const consumeSqsAnalyzeTx: Handler = async (event: SQSEvent) => {
  const records = event.Records
  if (records && records.length > 0) {
    const txHash = records[0].messageAttributes.txHash.stringValue!
    const chainId = records[0].messageAttributes.chainId.stringValue!
    const hardhatForkingUrl = records[0].messageAttributes.hardhatForkingUrl.stringValue!
    console.log(JSON.stringify({ txHash, hardhatForkingUrl, chainId }))
    await putTxEventToDdb(TransactionTraceResponseStatus.RUNNING, txHash)

    let traceResult: TRawTransactionTraceResult

    try {
      traceResult = await debugTransaction(txHash, chainId, hardhatForkingUrl)
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
      await uploadTrace(txHash, chainId, traceResult)
    } catch (error) {
      const errorMessage = { errorDetails: DEFAULT_ERROR }
      if (error instanceof Error) {
        console.log(error.message)
        errorMessage['errorDetails'] = error.message
        captureException(error)
      }
      await putTxEventToDdb(TransactionTraceResponseStatus.FAILED, txHash, errorMessage)
      return
    }

    const s3Location = getFilePath(txHash, chainId)
    putTxEventToDdb(TransactionTraceResponseStatus.SUCCESS, txHash, { s3Location })
    console.log(`Finished processing ${chainId}/${txHash}`)
    console.log(`Trace saved to ${s3Location}`)
  }
}

export const consumeSqsAnalyzeTxEntrypoint = AWSLambda.wrapHandler(consumeSqsAnalyzeTx)

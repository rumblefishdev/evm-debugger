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
import { DEFAULT_ERROR, knownErrors } from './errors'

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'transaction-trace-provider')

export const processTx = async (txHash: string, chainId: string, hardhatForkingUrl: string) => {
  await reset(`${hardhatForkingUrl}${process.env.ALCHEMY_KEY}`)
  const hardhatProvider = await hardhat.run(TASK_NODE_GET_PROVIDER, {
    chainId,
  })
  console.log(`Provider for ${chainId} is ${hardhatProvider}`)
  console.log(`Starting debug_traceTransaction for ${txHash}`)
  const traceResult: TRawTransactionTraceResult = await hardhatProvider.send('debug_traceTransaction', [txHash])
  // TODO: fix in https://github.com/rumblefishdev/evm-debugger/issues/285
  // traceResult.structLogs = traceResult.structLogs.map((structLog, index) => ({ ...structLog, index }))
  console.log(`Finished debug_traceTransaction for ${txHash}`)

  const uploadId = await createMultiPartUpload(txHash, chainId)

  if (!uploadId) throw new Error('Failed to create multi part upload')
  let j = 1

  const rootPartBody = JSON.stringify({
    returnValue: traceResult.returnValue,
    gas: traceResult.gas,
    failed: traceResult.failed,
  })

  // remove last bracket and array bracket and add comma
  const rootPartBodySanitized = `${rootPartBody.slice(0, -1)},"structLogs": ${JSON.stringify(traceResult.structLogs.slice(0, 1000)).slice(
    0,
    -1,
  )},`

  const rootPart = {
    PartNumber: j,
    ETag: `entityTag-${j}`,
    body: rootPartBodySanitized,
  }

  try {
    const parts: { PartNumber: number; body: string }[] = [rootPart]
    const uploadedParts: CompletedPart[] = []

    for (let index = 1000; index < traceResult.structLogs.length; ) {
      j++
      const partNumber = j
      const body = `${JSON.stringify(traceResult.structLogs.slice(index, index + 1000)).slice(1, -1)},`
      parts.push({ PartNumber: partNumber, body })
      index += 1000
    }

    parts[parts.length - 1].body = `${parts[parts.length - 1].body.slice(0, -1)}]}`

    for await (const part of parts) {
      console.log(`Uploading part ${part.PartNumber}`)
      const partETag = await uploadPart(txHash, chainId, uploadId, part.PartNumber, part.body)
      if (!partETag) throw new Error(`Failed to upload part: ${part.PartNumber}`)
      uploadedParts.push({ PartNumber: part.PartNumber, ETag: partETag })
    }

    await completeMultiPartUpload(txHash, chainId, uploadId, uploadedParts)

    console.log(`Finished uploading parts for ${txHash}`)
  } catch (error) {
    console.log(`Failed to upload to s3 for ${txHash}`)
    await abortMultiPartUpload(txHash, chainId, uploadId)
    throw error
  }
}

export const consumeSqsAnalyzeTx: Handler = async (event: SQSEvent) => {
  const records = event.Records
  if (records && records.length > 0) {
    const txHash = records[0].messageAttributes.txHash.stringValue!
    const chainId = records[0].messageAttributes.chainId.stringValue!
    const hardhatForkingUrl = records[0].messageAttributes.hardhatForkingUrl.stringValue!
    console.log(JSON.stringify({ txHash, hardhatForkingUrl, chainId }))
    await putTxEventToDdb(TransactionTraceResponseStatus.RUNNING, txHash)
    try {
      await processTx(txHash, chainId, hardhatForkingUrl)
      const s3Location = getFilePath(txHash, chainId)
      putTxEventToDdb(TransactionTraceResponseStatus.SUCCESS, txHash, { s3Location })
      console.log(`Finished processing ${txHash}`)
      console.log(`Trace saved to ${s3Location}`)
    } catch (error) {
      const errorMessage = { errorDetails: DEFAULT_ERROR }
      if (error instanceof Error) {
        console.log(error.message)
        errorMessage['errorDetails'] = error.message
        if (!knownErrors.includes(error.message)) captureException(error)
      }
      await putTxEventToDdb(TransactionTraceResponseStatus.FAILED, txHash, errorMessage)
    }
  }
}

export const consumeSqsAnalyzeTxEntrypoint = AWSLambda.wrapHandler(consumeSqsAnalyzeTx)

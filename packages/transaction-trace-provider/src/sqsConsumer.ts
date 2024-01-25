/* eslint-disable unicorn/prefer-at */
import type { Handler, SQSEvent } from 'aws-lambda'
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import hardhat from 'hardhat'
import { reset } from '@nomicfoundation/hardhat-network-helpers'
import type { IRawStructLog, TRawTransactionTraceResult } from '@evm-debuger/types'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import { AWSLambda, captureException } from '@sentry/serverless'
import type { CompletedPart } from '@aws-sdk/client-s3'
// import { structLogsEmitter } from 'hardhat/internal/hardhat-network/stack-traces/vm-debug-tracer'

import { version } from '../package.json'

import { putTxEventToDdb } from './ddb'
import { completeMultiPartUpload, createMultiPartUpload, getFileName, getFilePath, uploadPart } from './s3'
import { DEFAULT_ERROR, KNOWN_CHAIN_ERRORS } from './errors'
import { invalidateCloudFrontCache } from './cloudFront'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { structLogsEmitter } = require('hardhat/internal/hardhat-network/stack-traces/vm-debug-tracer.js')

AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'transaction-trace-provider')

let structLogs: IRawStructLog[] = []
let totalSize = 0
let partNumber = 1
const uploadedParts: CompletedPart[] = []

enum STATUS {
  PENDING,
  FINISHED,
  SENT,
  ERROR,
}

interface ChunksContainter {
  status: STATUS
  partNumber: number
  lock: boolean
  chunks: IRawStructLog[]
  txHash: string
  chainId: string
  uploadId: string
}

const uploadChunking: ChunksContainter = {
  uploadId: '',
  txHash: '',
  status: STATUS.PENDING,
  partNumber: 1,
  lock: false,
  chunks: [],
  chainId: '',
}

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

export const uploadTrace = async (uploadId: string, txHash: string, chainId: string, trace: string) => {
  if (structLogs.length > 0) {
    const part: { partNumber: number; body: string } = { partNumber: partNumber++, body: trace }
    console.log('HEEEREE', { trace })
    console.log(`Uploading part ${part.partNumber}`)
    console.log(`Part size: ${part.body.length}`)

    const partETag = await uploadPart(txHash, chainId, uploadId, part.partNumber, part.body)
    if (!partETag) throw new Error(`Failed to upload part: ${part.partNumber}`)

    uploadedParts.push({ PartNumber: part.partNumber, ETag: partETag })
  }
}

export const prepareBodyFromArray = (): string => {
  let body = JSON.stringify(uploadChunking.chunks).slice(1, -1)
  if (uploadChunking.partNumber > 1) body = `,${body}`
  return body
}

export const maxSize = 10 * 1024 * 1024 // 10 MB
export const structLogHandler = (uploadId: string, structLog: IRawStructLog, txHash: string, chainId: string) => {
  // totalSize += Buffer.from(JSON.stringify(structLog)).length
  // if (totalSize >= maxSize) {
  //   try {
  //     const body = prepareBodyFromArray()
  //     await uploadTrace(uploadId, txHash, chainId, body)
  //   } catch (error) {
  //     const errorMessage = { errorDetails: DEFAULT_ERROR }
  //     if (error instanceof Error) {
  //       console.log(error.message)
  //       errorMessage['errorDetails'] = error.message
  //       captureException(error)
  //     }
  //     await putTxEventToDdb(TransactionTraceResponseStatus.FAILED, txHash, errorMessage)
  //   }
  // }
  uploadChunking.chunks.push(structLog)
  uploadChunking.txHash = txHash
  uploadChunking.chainId = chainId
}

export const prepareTraceResultToUpload = (traceResult: TRawTransactionTraceResult): string => {
  const traceResultAsString = JSON.stringify({
    returnValue: traceResult.returnValue,
    gas: traceResult.gas,
    failed: traceResult.failed,
  })
  console.log('HEEEEEREEEE traceResultAsString!!!!!')
  console.log(traceResultAsString)
  return traceResultAsString.substring(1)
}

export const processChunks = async (): Promise<void> => {
  while (uploadChunking.status === STATUS.PENDING) {
    if (!uploadChunking.lock) {
      uploadChunking.lock = true

      const body = prepareBodyFromArray()
      // eslint-disable-next-line no-await-in-loop
      await uploadTrace(uploadChunking.uploadId, uploadChunking.txHash, uploadChunking.chainId, body)
      uploadChunking.partNumber++
      uploadChunking.chunks = []
      uploadChunking.lock = false
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      setTimeout(resolve, 200)
    })
  }
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
  console.log(JSON.stringify({ txHash, hardhatForkingUrl, chainId }))
  await putTxEventToDdb(TransactionTraceResponseStatus.RUNNING, txHash)

  const uploadId = await createMultiPartUpload(txHash, chainId)
  structLogsEmitter.on('structLog', async (structLog: IRawStructLog) => {
    await structLogHandler(uploadId, structLog, txHash, chainId)
    totalSize = 0
    structLogs = []
  })

  try {
    await uploadTrace(uploadId, txHash, chainId, '{"structLogs":[')

    const traceResult = await debugTransaction(txHash, chainId, hardhatForkingUrl)

    console.log('HELLO')
    setTimeout(function () {
      console.log('THIS IS')
    }, 2000)
    console.log('DOG')

    const preparedTraceResult = prepareTraceResultToUpload(traceResult)
    await uploadTrace(uploadId, txHash, chainId, preparedTraceResult)

    await completeMultiPartUpload(txHash, chainId, uploadId, uploadedParts)
    console.log(`Finished uploading parts for ${chainId}/${txHash}`)
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

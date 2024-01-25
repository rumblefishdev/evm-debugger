/* eslint-disable unicorn/prefer-at */
import type { Handler, SQSEvent } from 'aws-lambda'
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import hardhat from 'hardhat'
import { reset } from '@nomicfoundation/hardhat-network-helpers'
import type { IRawStructLog, TRawTransactionTraceResult } from '@evm-debuger/types'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'
import { AWSLambda, captureException } from '@sentry/serverless'
import type { CompletedPart } from '@aws-sdk/client-s3'
import { structLogsEmitter } from 'hardhat/internal/hardhat-network/stack-traces/vm-debug-tracer'

import { version } from '../package.json'

import { putTxEventToDdb } from './ddb'
import { completeMultiPartUpload, createMultiPartUpload, getFileName, getFilePath, uploadPart } from './s3'
import { DEFAULT_ERROR, KNOWN_CHAIN_ERRORS } from './errors'
import { invalidateCloudFrontCache } from './cloudFront'


AWSLambda.init({
  tracesSampleRate: 1,
  release: version,
  environment: process.env.ENVIRONMENT,
  dsn: process.env.SENTRY_DSN,
})
AWSLambda.setTag('lambda_name', 'transaction-trace-provider')

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
  structLogs: IRawStructLog[]
  txHash: string
  chainId: string
  uploadId: string
  currentChunkIndex: number
}

const uploadChunking: ChunksContainter = {
  uploadId: '',
  txHash: '',
  structLogs: [],
  status: STATUS.PENDING,
  partNumber: 1,
  lock: false,
  currentChunkIndex: -1,
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
  if (trace.length > 0) {
    const part: { partNumber: number; body: string } = { partNumber: uploadChunking.partNumber, body: trace }
    console.log(`Uploading part ${part.partNumber}`)
    console.log(`Part size: ${part.body.length}`)

    const partETag = await uploadPart(txHash, chainId, uploadId, part.partNumber, part.body)
    if (!partETag) throw new Error(`Failed to upload part: ${part.partNumber}`)

    uploadedParts.push({ PartNumber: part.partNumber, ETag: partETag })
    uploadChunking.partNumber++
  }
}
export const maxSize = 10 * 1024 * 1024 // 10 MB
export const structLogHandler = (uploadId: string, structLog: IRawStructLog, txHash: string, chainId: string) => {
  uploadChunking.structLogs.push(structLog)
  uploadChunking.txHash = txHash
  uploadChunking.chainId = chainId
  uploadChunking.uploadId = uploadId
}

export const prepareTraceResultToUpload = (traceResult: TRawTransactionTraceResult): string => {
  const traceResultAsString = JSON.stringify({
    returnValue: traceResult.returnValue,
    gas: traceResult.gas,
    failed: traceResult.failed,
  })
  return traceResultAsString.substring(1)
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const processChunks = async (): Promise<void> => {
  while ([STATUS.PENDING, STATUS.FINISHED].includes(uploadChunking.status)) {
    if (!uploadChunking.lock) {
      uploadChunking.lock = true
      let currentChunkSize = 0
      const currentChunk: IRawStructLog[] = []
      let currentIndex = uploadChunking.currentChunkIndex
      if (uploadChunking.status === STATUS.FINISHED && currentIndex >= uploadChunking.structLogs.length) {
        uploadChunking.status = STATUS.SENT
      } else {
        while (currentChunkSize < maxSize && currentIndex < uploadChunking.structLogs.length) {
          currentIndex++
          if (uploadChunking.structLogs[currentIndex]) {
            const currentStructLogSize = Buffer.from(JSON.stringify(uploadChunking.structLogs[currentIndex])).length
            if (currentChunkSize + currentStructLogSize < maxSize) {
              currentChunkSize += currentStructLogSize
              currentChunk.push(uploadChunking.structLogs[currentIndex])
            } else {
              break
            }
          }
        }
        uploadChunking.currentChunkIndex = currentIndex
        if (currentChunk.length > 0) {
          let body = JSON.stringify(currentChunk).slice(1, -1)
          if (uploadChunking.partNumber > 1) body = `,${body}`
          if (body.length > 2) {
            // eslint-disable-next-line no-await-in-loop
            await uploadTrace(uploadChunking.uploadId, uploadChunking.txHash, uploadChunking.chainId, body)
          } else {
            break
          }
        }
      }
      uploadChunking.lock = false
    }
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

  await putTxEventToDdb(TransactionTraceResponseStatus.RUNNING, txHash)

  const uploadId = await createMultiPartUpload(txHash, chainId)
  structLogsEmitter.on('finish', () => {
    if (uploadChunking.status === STATUS.PENDING) {
      uploadChunking.status = STATUS.FINISHED
    }
  })
  structLogsEmitter.on('structLog', async (structLog: IRawStructLog) => {
    if (structLog.op) {
      await structLogHandler(uploadId, structLog, txHash, chainId)
    }
  })

  try {
    await uploadTrace(uploadId, txHash, chainId, '{"structLogs":[')
    const traceResult = await debugTransaction(txHash, chainId, hardhatForkingUrl)
    await processChunks()
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

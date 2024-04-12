/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/prefer-at */
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import hardhat from 'hardhat'
import { reset } from '@nomicfoundation/hardhat-network-helpers'
import type { TRawTransactionTraceResult } from '@evm-debuger/types'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import { putTxEventToDdb } from './ddb'
import { getFileName, getFilePath, s3upload } from './s3'
import { DEFAULT_ERROR, KNOWN_CHAIN_ERRORS } from './errors'
import { invalidateCloudFrontCache } from './cloudFront'

export const debugTransaction = async (txHash: string, chainId: string, hardhatForkingUrl: string): Promise<TRawTransactionTraceResult> => {
  Object.assign(global, { txHash, chainId })
  // get version of hardhat package
  console.log(`Hardhat version: ${hardhat.version}`)

  await reset(`${hardhatForkingUrl}${process.env.ALCHEMY_KEY}`)
  const hardhatProvider = await hardhat.run(TASK_NODE_GET_PROVIDER, {
    chainId,
  })

  hardhatProvider.console.log(`Provider for ${chainId} is ready`)
  console.log(`Starting debug_traceTransaction for ${chainId}/${txHash}`)

  const traceResult: TRawTransactionTraceResult = await hardhatProvider.send('debug_traceTransaction', [txHash])
  // TODO: fix in https://github.com/rumblefishdev/evm-debugger/issues/285
  // traceResult.structLogs = traceResult.structLogs.map((structLog, index) => ({ ...structLog, index }))
  console.log(`Finished debug_traceTransaction for ${chainId}/${txHash} with ${traceResult.structLogs.length} structLogs`)
  return traceResult
}

export interface ConsumeSqsAnalyzeTx {
  txHash: string
  chainId: string
  hardhatForkingUrl: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  captureException: any
}

export const sqsConsumer = async ({ txHash, chainId, hardhatForkingUrl, captureException }: ConsumeSqsAnalyzeTx) => {
  await putTxEventToDdb(TransactionTraceResponseStatus.RUNNING, txHash)
  try {
    const result = await debugTransaction(txHash, chainId, hardhatForkingUrl)
    const s3Location = getFilePath(txHash, chainId)
    await s3upload({
      Key: getFileName(txHash, chainId),
      ContentType: 'application/json',
      Bucket: process.env.ANALYZER_DATA_BUCKET_NAME!,
      Body: JSON.stringify(result),
    })

    console.log(`Finished processing ${chainId}/${txHash}`)
    console.log(`Trace saved to ${s3Location}`)
    await putTxEventToDdb(TransactionTraceResponseStatus.SUCCESS, txHash, { s3Location })

    const path = `/${getFileName(txHash, chainId)}`
    await invalidateCloudFrontCache(process.env.CLOUDFRONT_DISTRIBUTION_ID!, [path])
  } catch (error) {
    const errorMessage = { errorDetails: DEFAULT_ERROR }
    if (error instanceof Error) {
      console.log(error.message)
      errorMessage['errorDetails'] = error.message
      if (!KNOWN_CHAIN_ERRORS.includes(error.message)) captureException(error)
    }
    await putTxEventToDdb(TransactionTraceResponseStatus.FAILED, txHash, errorMessage)
  }
}

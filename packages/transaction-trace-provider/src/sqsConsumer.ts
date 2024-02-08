/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable import/exports-last */
/* eslint-disable unicorn/prefer-at */
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import hardhat from 'hardhat'
import { reset } from '@nomicfoundation/hardhat-network-helpers'
import type { TRawTransactionTraceResult } from '@evm-debuger/types'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import { version } from '../package.json'

import { putTxEventToDdb } from './ddb'
import { getFileName, getFilePath } from './s3'
import { DEFAULT_ERROR, KNOWN_CHAIN_ERRORS } from './errors'
import { invalidateCloudFrontCache } from './cloudFront'

export const debugTransaction = async (txHash: string, chainId: string, hardhatForkingUrl: string): Promise<TRawTransactionTraceResult> => {
  Object.assign(global, { txHash, chainId })
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const consumeSqsAnalyzeTx = async (event: any) => {
  if (!event) {
    console.log('No records to process')
    return 'No records to process'
  }

  const { txHash, chainId, hardhatForkingUrl } = event

  await putTxEventToDdb(TransactionTraceResponseStatus.RUNNING, txHash)
  try {
    await debugTransaction(txHash, chainId, hardhatForkingUrl)
  } catch (error) {
    const errorMessage = { errorDetails: DEFAULT_ERROR }
    if (error instanceof Error) {
      console.log(error.message)
      errorMessage['errorDetails'] = error.message
      // if (!KNOWN_CHAIN_ERRORS.includes(error.message)) captureException(error)
    }
    await putTxEventToDdb(TransactionTraceResponseStatus.FAILED, txHash, errorMessage)
    return
  }

  try {
    const path = `/${getFileName(txHash, chainId)}`
    await invalidateCloudFrontCache(process.env.CLOUDFRONT_DISTRIBUTION_ID!, [path])
  } catch (error) {
    console.log(error)
  }

  const s3Location = getFilePath(txHash, chainId)
  await putTxEventToDdb(TransactionTraceResponseStatus.SUCCESS, txHash, { s3Location })
  console.log(`Finished processing ${chainId}/${txHash}`)
  console.log(`Trace saved to ${s3Location}`)
}

console.log(`started with: ${process.env.SQSEvent}`)
const parsedEvent = JSON.parse(process.env.SQSEvent as string)
consumeSqsAnalyzeTx(JSON.parse(parsedEvent))

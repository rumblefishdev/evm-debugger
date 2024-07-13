/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/prefer-at */
import hardhat from 'hardhat'
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import { extendConfig } from 'hardhat/config'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import { putTxEventToDdb } from './ddb'
import { getFileName, getFilePath, s3upload } from './s3'
import { DEFAULT_ERROR, KNOWN_CHAIN_ERRORS } from './errors'
import { invalidateCloudFrontCache } from './cloudFront'

export interface ConsumeSqsAnalyzeTx {
  txHash: string
  chainId: string
  hardhatForkingUrl: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  captureException: any
}

export const localDebugTransaction = async ({ txHash, chainId, hardhatForkingUrl, captureException }: ConsumeSqsAnalyzeTx) => {
  try {
    console.log('Current hardhat version: ', hardhat.version)
    console.log('Current hardhatConfig', JSON.stringify(hardhat.config.networks.hardhat.forking, null, 2))

    console.log('Extending hardhat config....')

    extendConfig((config, _userConfig) => {
      config.networks = {
        ...config.networks,
        hardhat: {
          ...config.networks.hardhat,
          forking: {
            url: `${hardhatForkingUrl}${process.env.ALCHEMY_KEY}`,
            enabled: true,
          },
          chainId: Number(chainId),
        },
      }
    })

    console.log('Hardhat config extended', JSON.stringify(hardhat.config.networks.hardhat.forking, null, 2))

    const hardhatProvider = await hardhat.run(TASK_NODE_GET_PROVIDER, {
      chainId,
    })

    console.log(`Provider for ${chainId} is ready`)

    console.log(`Starting debug_traceTransaction for ${chainId}/${txHash}`)

    await hardhatProvider.request({
      params: [
        {
          forking: {
            jsonRpcUrl: hardhat.config.networks.hardhat.forking!.url,
          },
        },
      ],
      method: 'hardhat_reset',
    })

    const traceResult = await hardhatProvider.send('debug_traceTransaction', [txHash])

    console.log(`Finished debug_traceTransaction for ${chainId}/${txHash} with ${traceResult.structLogs.length} structLogs`)
  } catch (error) {
    const errorMessage = { errorDetails: DEFAULT_ERROR }
    if (error instanceof Error) {
      console.log(error.message)
      errorMessage['errorDetails'] = error.message
      if (!KNOWN_CHAIN_ERRORS.includes(error.message)) captureException(error)
    }
    throw error
  }
}

export const debugTransaction = async (txHash: string, chainId: string) => {
  Object.assign(global, { txHash, chainId })

  const hardhatProvider = await hardhat.run(TASK_NODE_GET_PROVIDER, {
    chainId,
  })

  console.log(`Calling hardhat_reset`)
  await hardhatProvider.request({
    params: [
      {
        forking: {
          jsonRpcUrl: hardhat.config.networks.hardhat.forking!.url,
        },
      },
    ],
    method: 'hardhat_reset',
  })

  console.log(`Provider for ${chainId} is ready`)
  console.log(`Starting debug_traceTransaction for ${chainId}/${txHash}`)

  const traceResult = await hardhatProvider.send('debug_traceTransaction', [txHash])

  console.log(`Finished debug_traceTransaction for ${chainId}/${txHash} with ${traceResult.structLogs.length} structLogs`)
  return traceResult
}

export const sqsConsumer = async ({ txHash, chainId, captureException }: ConsumeSqsAnalyzeTx) => {
  await putTxEventToDdb(TransactionTraceResponseStatus.RUNNING, txHash)
  try {
    const result = await debugTransaction(txHash, chainId)
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

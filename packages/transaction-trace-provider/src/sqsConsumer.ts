import type { Handler, SQSEvent } from 'aws-lambda'
import { TASK_NODE_GET_PROVIDER } from 'hardhat/builtin-tasks/task-names'
import hardhat from 'hardhat'
import { reset } from '@nomicfoundation/hardhat-network-helpers'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import { putTxEventToDdb } from './ddb'
import { pushTraceToS3 } from './s3'

export const processTx = async (
  txHash: string,
  chainId: string,
  hardhatForkingUrl: string,
) => {
  await reset(`${hardhatForkingUrl}${process.env.ALCHEMY_KEY}`)
  const hardhatProvider = await hardhat.run(TASK_NODE_GET_PROVIDER, {
    chainId,
  })
  console.log(`Starting debug_traceTransaction for ${txHash}`)
  const traceResult = await hardhatProvider.send('debug_traceTransaction', [
    txHash,
  ])
  return pushTraceToS3(txHash, chainId, JSON.stringify(traceResult))
}

export const consumeSqsAnalyzeTx: Handler = async (event: SQSEvent) => {
  const records = event.Records
  if (records && records.length > 0) {
    const txHash = records[0].messageAttributes.txHash.stringValue!
    const chainId = records[0].messageAttributes.chainId.stringValue!
    const hardhatForkingUrl =
      records[0].messageAttributes.hardhatForkingUrl.stringValue!
    await putTxEventToDdb(TransactionTraceResponseStatus.RUNNING, txHash)
    const s3TracePath = await processTx(txHash, chainId, hardhatForkingUrl)
    await putTxEventToDdb(TransactionTraceResponseStatus.SUCCESS, txHash, {
      s3Location: s3TracePath,
    })
  }
}

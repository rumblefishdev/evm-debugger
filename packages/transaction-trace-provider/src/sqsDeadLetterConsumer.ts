import type { Handler, SQSEvent } from 'aws-lambda'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import { putTxEventToDdb } from './ddb'

export const consumeSqsAnalyzeTxError: Handler = async (event: SQSEvent) => {
  const records = event.Records
  if (records && records.length > 0) {
    const txHash = records[0].messageAttributes.txHash.stringValue!
    await putTxEventToDdb(TransactionTraceResponseStatus.FAILED, txHash)
  }
}

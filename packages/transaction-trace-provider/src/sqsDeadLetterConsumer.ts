import type { Handler, SQSEvent } from 'aws-lambda'
import { TransactionTraceResponseStatus } from '@evm-debuger/types'

import { putTxEventToDdb } from './ddb'

export const consumeSqsAnalyzeTxError: Handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const txHash = record.messageAttributes.txHash.stringValue!
    await putTxEventToDdb(TransactionTraceResponseStatus.FAILED, txHash)
  }
}

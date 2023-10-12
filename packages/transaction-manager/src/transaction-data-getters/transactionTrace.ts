import type { TTransactionTraceResult } from '@evm-debuger/types'
import { network } from 'hardhat'

import { checkIfPathExists, readFromFile, saveToFile } from '../utils'

const MAX_RETRIES = 20

const fetchTransactionTrace = async (
  transactionHash: string,
  retryCounter: { numberOfRetries: number },
): Promise<TTransactionTraceResult> => {
  try {
    const traceResult: TTransactionTraceResult = await network.provider.send('debug_traceTransaction', [transactionHash])

    return traceResult
  } catch (error) {
    if (error.code === 'UND_ERR_HEADERS_TIMEOUT' && retryCounter.numberOfRetries < MAX_RETRIES) {
      console.log(`Fetching trace for transaction ${transactionHash}`)
      retryCounter.numberOfRetries += 1
      return fetchTransactionTrace(transactionHash, retryCounter)
    }
  }
}

export const handleTransactionTraceFetching = async (transactionHash: string, path: string): Promise<TTransactionTraceResult> => {
  const isFileExist = checkIfPathExists(path)

  if (isFileExist) {
    return readFromFile<TTransactionTraceResult>(path)
  }

  const retryCounter = { numberOfRetries: 0 }

  const transactionTrace = await fetchTransactionTrace(transactionHash, retryCounter)
  saveToFile(path, transactionTrace)

  return transactionTrace
}

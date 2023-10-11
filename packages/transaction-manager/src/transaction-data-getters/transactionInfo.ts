import type { TTransactionInfo } from '@evm-debuger/types'
import { network } from 'hardhat'

import { checkIfPathExists, readFromFile, saveToFile } from '../utils'

export const fetchTransactionInfo = async (transactionHash: string): Promise<TTransactionInfo> => {
  const transactionInfo: TTransactionInfo = await network.provider.send('eth_getTransactionByHash', [transactionHash])
  return transactionInfo
}

export const handleTransactionInfoFetching = async (transactionHash: string, path: string): Promise<TTransactionInfo> => {
  try {
    const isFileExist = checkIfPathExists(path)
    if (isFileExist) {
      return readFromFile<TTransactionInfo>(path)
    }
    const transactionInfoResult: TTransactionInfo = await fetchTransactionInfo(transactionHash)
    saveToFile(path, transactionInfoResult)

    return transactionInfoResult
  } catch (error) {
    console.log(error)
  }
}

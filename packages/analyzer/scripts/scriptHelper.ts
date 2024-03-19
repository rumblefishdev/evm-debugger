/* eslint-disable no-await-in-loop */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { TAbis, TRawStructLog, TTransactionInfo } from '@evm-debuger/types'

import { TxAnalyzer } from '../src'

const TEST_TRANSACTIONS_DIR = join(__dirname, '../test')

export const prepareAnalyzer = async (transactionInfo: TTransactionInfo, structLogs: TRawStructLog[]) => {
  const transactionHash = transactionInfo.hash
  const abisAndSources: { contractNames: Record<string, string>; abis: TAbis } = JSON.parse(
    await readFile(`${TEST_TRANSACTIONS_DIR}/abis/${transactionHash}.json`, 'utf8'),
  )

  const analyzerInstance = new TxAnalyzer()
  analyzerInstance.dataLoader.inputTransactionData.set(transactionInfo)
  analyzerInstance.dataLoader.inputStructlogs.set(structLogs)

  const abis = Object.entries(abisAndSources.abis)

  analyzerInstance.dataLoader.setEmptyContracts(abis.map(([address]) => address.toLowerCase()))
  analyzerInstance.dataLoader.setEmptyContracts(Object.keys(abisAndSources.contractNames).map((address) => address.toLowerCase()))

  for (const [address, abi] of abis) {
    analyzerInstance.dataLoader.inputContractData.set(address.toLowerCase(), 'applicationBinaryInterface', abi)
  }

  const contractNames = Object.entries(abisAndSources.contractNames)

  for (const [address, name] of contractNames) {
    analyzerInstance.dataLoader.inputContractData.set(address.toLowerCase(), 'sourceData', { contractName: name })
  }

  return analyzerInstance
}

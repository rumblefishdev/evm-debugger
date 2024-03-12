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
  analyzerInstance.dataLoader.loadTransactionInfo(transactionInfo)
  analyzerInstance.dataLoader.loadStructlogs(structLogs)

  const abis = Object.entries(abisAndSources.abis)

  for (const [address, abi] of abis) {
    analyzerInstance.dataLoader.loadContractAbi(address.toLowerCase(), abi)
  }

  const contractNames = Object.entries(abisAndSources.contractNames)

  for (const [address, name] of contractNames) {
    analyzerInstance.dataLoader.loadContractName(address, name)
  }

  return analyzerInstance
}

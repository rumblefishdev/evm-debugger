/* eslint-disable no-await-in-loop */
import { writeFile, readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import fetch from 'node-fetch'
import type { TTransactionData } from '@evm-debuger/types'

import { TxAnalyzer } from '../src'

const TEST_TRANSACTIONS_DIR = join(__dirname, '../test')

export const prepareAnalyzer = async (transactionData: TTransactionData) => {
  const abisAndSources = JSON.parse(await readFile(`${TEST_TRANSACTIONS_DIR}/abis/${transactionData.transactionInfo.hash}.json`, 'utf8'))

  transactionData.abis = { ...transactionData.abis, ...abisAndSources.abis }
  transactionData.sourceCodes = {
    ...transactionData.sourceCodes,
    ...abisAndSources.sourceCodes,
  }
  transactionData.contractNames = {
    ...transactionData.contractNames,
    ...abisAndSources.contractNames,
  }

  return new TxAnalyzer(transactionData)
}

export const fetchAbisForTestTransactions = async () => {
  const testTransactions = await readdir(TEST_TRANSACTIONS_DIR)

  for (const file of testTransactions)
    if (file.endsWith('.json')) {
      const transactionData = JSON.parse(await readFile(`${TEST_TRANSACTIONS_DIR}/${file}`, 'utf8'))

      if (existsSync(`${TEST_TRANSACTIONS_DIR}/abis/${transactionData.transactionInfo.hash}.json`)) {
        console.log(`Abis for ${file} already fetched.`)
        continue
      }

      console.log(`Fetching abis for ${file}...`)

      const analyzer = new TxAnalyzer(transactionData)
      const addresses = analyzer.getContractAddressesInTransaction()
      const abisAndSources = { sourceCodes: {}, contractNames: {}, abis: {} }

      for (const address of addresses) {
        const response = await fetch(
          `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}&apikey=Y8XNE3W519FITZJRPRGYY4ZEII2IV3W73F`,
        )

        const { result, status } = await response.json()
        if (status === '1') {
          abisAndSources.abis[address] = JSON.parse(result[0].ABI)
          abisAndSources.sourceCodes[address] = result[0].SourceCode
          abisAndSources.contractNames[address] = result[0].ContractName
        }
      }

      console.log(`Saving into test/abis/${analyzer.transactionData.transactionInfo.hash}.json...`)

      await writeFile(
        `${TEST_TRANSACTIONS_DIR}/abis/${analyzer.transactionData.transactionInfo.hash}.json`,
        JSON.stringify(abisAndSources, null, 2),
      )
    }
}

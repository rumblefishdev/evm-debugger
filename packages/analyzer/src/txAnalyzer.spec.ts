import { promises } from 'node:fs'

import type { TTransactionData } from '@evm-debuger/types'

import { prepareAnalyzer } from '../scripts/scriptHelper'

const removeWhiteSpaces = (data: string) => {
  return data.replace(/\s/g, '')
}

async function runAnalyzerForTestDataFile(path: string) {
  const testData = await promises.readFile(path, 'utf8')
  const jsonTestData = JSON.parse(testData)

  const transactionData: TTransactionData = {
    transactionInfo: jsonTestData.transactionInfo,
    structLogs: jsonTestData.structLogs,
    sourceCodes: {},
    contractNames: {},
    abis: {},
  }

  const analyzer = await prepareAnalyzer(transactionData)

  return analyzer.analyze()
}

describe('TxAnalyzer', () => {
  describe('analyze transaction', () => {
    it('analyzes simple mint transaction', async () => {
      const result = await runAnalyzerForTestDataFile(
        './test/simpleMintTransactionLogs.json',
      )
      expect(result).toMatchSnapshot()
    }, 20_000)

    it('analyze transaction with revert', async () => {
      const result = await runAnalyzerForTestDataFile(
        './test/revertedTransactionLogs.json',
      )
      expect(result).toMatchSnapshot()
    }, 20_000)

    it('analyzes failed transaction', async () => {
      const result = await runAnalyzerForTestDataFile(
        './test/failedTransactionLogs.json',
      )
      expect(result).toMatchSnapshot()
    }, 20_000)

    it('analyzes failed transaction with extended errors', async () => {
      const result = await runAnalyzerForTestDataFile(
        './test/failedTransactionLogs2.json',
      )
      expect(result).toMatchSnapshot()
    }, 20_000)
  })
})

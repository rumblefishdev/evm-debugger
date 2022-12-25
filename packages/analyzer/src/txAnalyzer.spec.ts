import { promises } from 'node:fs'

import type { TTransactionData } from '@evm-debuger/types'

import { prepareAnalyzer } from '../scripts/scriptHelper'

const removeWhiteSpaces = (data: string) => {
  return data.replace(/\s/g, '')
}

describe('TxAnalyzer', () => {
  describe('analyze transaction', () => {
    it('analyze transaction with revert', async () => {
      const testData = await promises.readFile(
        './test/revertedTransactionLogs.json',
        'utf8',
      )
      const jsonTestData = JSON.parse(testData)

      const transactionData: TTransactionData = {
        transactionInfo: jsonTestData.transactionInfo,
        structLogs: jsonTestData.structLogs,
        abis: {},
      }

      const analyzer = await prepareAnalyzer(transactionData)

      const result = analyzer.analyze()

      expect(result).toMatchSnapshot()
    }, 20_000)
  })
})

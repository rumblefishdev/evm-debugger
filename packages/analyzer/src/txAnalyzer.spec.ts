import { promises } from 'node:fs'

import type { TTransactionData } from '@evm-debuger/types'

import { prepareAnalyzer } from '../scripts/scriptHelper'

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
    beforeAll(() => {
      jest.setTimeout(20_000)
    })

    it('analyzes simple mint transaction', async () => {
      const result = await runAnalyzerForTestDataFile('./test/simpleMintTransactionLogs.json')
      expect(result).toMatchSnapshot()
    })

    it('analyze transaction with revert', async () => {
      const result = await runAnalyzerForTestDataFile('./test/revertedTransactionLogs.json')
      expect(result).toMatchSnapshot()
    })

    it('analyzes failed transaction', async () => {
      const result = await runAnalyzerForTestDataFile('./test/failedTransactionLogs.json')
      expect(result).toMatchSnapshot()
    })

    it('analyzes failed transaction with extended errors', async () => {
      const result = await runAnalyzerForTestDataFile('./test/failedTransactionLogs2.json')
      expect(result).toMatchSnapshot()
    })

    it('Transaction with empty struct log', async () => {
      await expect(runAnalyzerForTestDataFile('./test/transactionWithEmptyStructLogs.json')).rejects.toThrow(
        'Too primitive transaction without stack calls.',
      )
    })

    it('analyzes transaction with invalid function with the same sighash as cached abis', async () => {
      // Analyzer is trying 1st decode using cached ABIs. In this tx 'transferFrom' have not standard(erc20) output.
      const result = await runAnalyzerForTestDataFile('./test/txWithInvalidOutputToDecode.json')
      expect(result).toMatchSnapshot()
    })

    it('analyze transaction with contract deployment', async () => {
      const result = await runAnalyzerForTestDataFile('./test/createContract.json')
      expect(result).toMatchSnapshot()
    })
  })
})

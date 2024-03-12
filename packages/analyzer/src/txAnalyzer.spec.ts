import { promises, writeFileSync } from 'node:fs'

import type { TRawStructLog, TTransactionInfo } from '@evm-debuger/types'

import { prepareAnalyzer } from '../scripts/scriptHelper'

async function runAnalyzerForTestDataFile(tracesPath: string) {
  const testData = await promises.readFile(tracesPath, 'utf8')
  const { structLogs, transactionInfo }: { transactionInfo: TTransactionInfo; structLogs: TRawStructLog[] } = JSON.parse(testData)

  const analyzer = await prepareAnalyzer(transactionInfo, structLogs)

  return analyzer.analyze()
}

describe('TxAnalyzer', () => {
  describe('analyze transaction', () => {
    beforeAll(() => {
      jest.setTimeout(20_000)
    })

    it('analyzes simple mint transaction', async () => {
      const result = await runAnalyzerForTestDataFile('./test/simpleMintTransactionLogs.json')
      delete result.structLogs
      expect(result).toMatchSnapshot('simpleMintTransactionLogs')
    })

    it('analyze transaction with revert', async () => {
      const result = await runAnalyzerForTestDataFile('./test/revertedTransactionLogs.json')
      delete result.structLogs
      expect(result).toMatchSnapshot('revertedTransactionLogs')
    })

    it('analyzes failed transaction', async () => {
      const result = await runAnalyzerForTestDataFile('./test/failedTransactionLogs.json')
      delete result.structLogs
      expect(result).toMatchSnapshot('failedTransactionLogs')
    })

    it('analyzes failed transaction with extended errors', async () => {
      const result = await runAnalyzerForTestDataFile('./test/failedTransactionLogs2.json')
      delete result.structLogs
      expect(result).toMatchSnapshot('failedTransactionLogs2')
    })

    it('Transaction with empty struct log', async () => {
      await expect(runAnalyzerForTestDataFile('./test/transactionWithEmptyStructLogs.json')).rejects.toThrow(
        'Too primitive transaction without stack calls.',
      )
    })

    it('analyzes transaction with invalid function with the same sighash as cached abis', async () => {
      // Analyzer is trying 1st decode using cached ABIs. In this tx 'transferFrom' have not standard(erc20) output.
      const result = await runAnalyzerForTestDataFile('./test/txWithInvalidOutputToDecode.json')
      delete result.structLogs
      expect(result).toMatchSnapshot('txWithInvalidOutputToDecode')
    })

    it('analyze transaction with contract deployment', async () => {
      const result = await runAnalyzerForTestDataFile('./test/createContract.json')
      delete result.structLogs
      expect(result).toMatchSnapshot('createContract')
    })
  })
})

import { promises } from 'fs'
import { TTransactionData } from '@evm-debuger/types'
import { prepareAnalyzer } from '../scripts/scriptHelper'

describe('TxAnalyzer', () => {
  describe('analyze transaction', () => {
    it('analyze transaction with revert', async () => {
      const testData = await promises.readFile('./test/revertedTransactionLogs.json', 'utf8')
      const jsonTestData = JSON.parse(testData)

      const transactionData: TTransactionData = {
        transactionInfo: jsonTestData.transactionInfo,
        structLogs: jsonTestData.structLogs,
        abis: {},
      }

      const analyzer = await prepareAnalyzer(transactionData)

      const result = analyzer.analyze()
      const resultAsStringWithoutWhiteSpaces = removeWhiteSpaces(JSON.stringify(result))

      const expectedResponse = await promises.readFile('./test/revertedTransactionResultLogs.json', 'utf8')
      const expectedResponseWithoutWhiteSpaces = removeWhiteSpaces(expectedResponse)

      expect(expectedResponseWithoutWhiteSpaces).toEqual(resultAsStringWithoutWhiteSpaces)
    }, 20000)
  })

  const removeWhiteSpaces = (data: string) => {
    return data.replace(/\s/g, '')
  }
})
export {}

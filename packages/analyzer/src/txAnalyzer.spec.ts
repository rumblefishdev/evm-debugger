import {promises} from "fs"
import {TxAnalyzer} from "./txAnalyzer"
import {TTransactionData} from "@evm-debuger/types"

describe('TxAnalyzer', () => {

    beforeAll(() => {
        jest.setTimeout(20000)
    })

    describe('analyze transaction', () => {

        it('analyze transaction with revert', async () => {
            const testData = await promises.readFile('./test/revertedTransactionLogs.json', "utf8")
            const jsonTestData = JSON.parse(testData)

            const transactionData: TTransactionData = {
                transactionInfo: jsonTestData.transactionInfo,
                structLogs: jsonTestData.structLogs,
                abis: {},
            }

            const analyzerForAddressesTranslation = new TxAnalyzer(transactionData)
            await analyzerForAddressesTranslation.enrichTransactionDataWithTranslatedAddresses()

            const analyzer = new TxAnalyzer(analyzerForAddressesTranslation.transactionData)
            const result = analyzer.analyze()
            const resultAsStringWithoutWhiteSpaces = removeWhiteSpaces(JSON.stringify(result))

            const expectedResponse = await promises.readFile('./test/revertedTransactionResultLogs.json', "utf8")
            const expectedResponseWithoutWhiteSpaces = removeWhiteSpaces(expectedResponse)

            expect(expectedResponseWithoutWhiteSpaces).toEqual(resultAsStringWithoutWhiteSpaces)
        })

    })

    const removeWhiteSpaces = (data: string) => {
        return data.replace(/\s/g, "")
    }

});
export {}

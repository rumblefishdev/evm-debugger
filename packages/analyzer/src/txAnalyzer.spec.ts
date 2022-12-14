import {promises} from "fs";
import {TxAnalyzer} from "./txAnalyzer";
import {TTransactionData} from "@evm-debuger/types";

describe('TxAnalyzer', () => {

    describe('analyze transaction', () => {
        jest.setTimeout(20000)
        it('analyze transaction with revert', async () => {
            const testData = await promises.readFile('./test/revertedTransactionTest.json', "utf8")
            const jsonTestData = JSON.parse(testData)

            const transactionData: TTransactionData = {
                transactionInfo: jsonTestData.transactionInfo,
                structLogs: jsonTestData.structLogs,
                abis: {},
            }

            const analyzer = new TxAnalyzer(transactionData)
            await analyzer.enrichTransactionDataWithTranslatedAddresses()

            const result = analyzer.analyze()
            const resultAsStringWithoutWhiteSpaces = removeWhiteSpaces(JSON.stringify(result))

            const expectedResponse = await promises.readFile('./test/revertedTransactionResultTest.json', "utf8")
            const expectedResponseWithoutWhiteSpaces = removeWhiteSpaces(expectedResponse)

            expect(expectedResponseWithoutWhiteSpaces).toEqual(resultAsStringWithoutWhiteSpaces)
        })
    });

    const removeWhiteSpaces = (data: string) => {
        return data.replace(/\s/g, "")
    }

});
export {}

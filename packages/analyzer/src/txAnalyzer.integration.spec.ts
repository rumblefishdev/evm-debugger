import {promises} from "fs";
import {TxAnalyzer} from "./txAnalyzer";
import {TTransactionData} from "@evm-debuger/types";
import fetch from "node-fetch";

describe('TxAnalyzer', () => {

    describe('analyze transaction', () => {
        jest.setTimeout(20000)
        it('analyze transaction with revert', async () => {
            const testData = await promises.readFile('./test/transactionData.test.json', "utf8")
            const jsonTestData = JSON.parse(testData)

            const transactionData: TTransactionData = {
                transactionInfo: jsonTestData.transactionInfo,
                structLogs: jsonTestData.structLogs,
                abis: {},
            }

            const analyzer = new TxAnalyzer(transactionData)

            const addresses = analyzer.getContractAddressesInTransaction()
            for (const address of addresses) {
                const response = await fetch(
                    `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=Y8XNE3W519FITZJRPRGYY4ZEII2IV3W73F`
                )

                const {result, status} = await response.json()
                if (status === '1') {
                    transactionData.abis[address] = result
                }
            }

            const result = analyzer.analyze()
            const resultAsStringWithoutWhiteSpaces = removeWhiteSpaces(JSON.stringify(result))


            const expectedResponse = await promises.readFile('./test/testResult.json', "utf8")
            const expectedResponseWithoutWhiteSpaces = removeWhiteSpaces(expectedResponse)

            expect(expectedResponseWithoutWhiteSpaces).toEqual(resultAsStringWithoutWhiteSpaces)
        })
    });

    const removeWhiteSpaces = (data: string) => {
        return data.replace(/\s/g, "")
    }

});
export {}

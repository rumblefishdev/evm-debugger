/* eslint-disable sort-keys-fix/sort-keys-fix */
import { readFileSync } from 'fs'

import type { TTransactionInfo, TTransactionTraceResult } from '@evm-debuger/types'
import { TxAnalyzer } from '@evm-debuger/analyzer'
import solc from 'solc'

import { inputPrompt } from '../src/prompts'
import { ensureDirectoryExistance, isValidTransaction, readFromFile, saveToFile } from '../src/utils'
import { ErrorMessages } from '../src/errors'
import { DefaultPaths, Paths } from '../src/paths'
import { handleTransactionInfoFetching } from '../src/transaction-data-getters/transactionInfo'
import { handleTransactionTraceFetching } from '../src/transaction-data-getters/transactionTrace'
import { handleBytecodeFetching } from '../src/transaction-data-getters/bytecodes'
import { handleSourceCodesFetching } from '../src/transaction-data-getters/sourceCodes'
import type { TTempExecs } from '../src/types'
import { handleSourceCode } from '../src/sourceCodeHandlers'

/* eslint-disable prettier/prettier */
(async () => {
  try {
    const { promptValue: transactionHash } = await inputPrompt<string>('Enter a transaction hash', { validate: (value) => isValidTransaction(value) || ErrorMessages.INVALID_TRANSACTION_HASH })
    const currentHardhatEnvironment: TTempExecs = JSON.parse(readFileSync(Paths.TEMP_EXECS, 'utf8'))

    console.log('Checking if result directory exists...')
    ensureDirectoryExistance(DefaultPaths.RESULTS)
    ensureDirectoryExistance(DefaultPaths.RESULTS_TMP)
    ensureDirectoryExistance(DefaultPaths.RESULTS_PERSISTED)

    ensureDirectoryExistance(`${Paths.RESULTS_PERSISTED}/${Paths.TRANSACTIONS}/${transactionHash}`)
    const transactionInfoPath = `${Paths.RESULTS_PERSISTED}/${Paths.TRANSACTIONS}/${transactionHash}/transactionInfo.json`
    const transactionTracePath = `${Paths.RESULTS_PERSISTED}/${Paths.TRANSACTIONS}/${transactionHash}/transactionTrace.json`


    const transactionInfoResult: TTransactionInfo = await handleTransactionInfoFetching(transactionHash, transactionInfoPath)
    const transactionTraceResult: TTransactionTraceResult = await handleTransactionTraceFetching(transactionHash, transactionTracePath)

    const txAnalyzer = new TxAnalyzer({
      transactionInfo: transactionInfoResult,
      structLogs: transactionTraceResult.structLogs,
      sourceMaps: {},
      sourceFiles: {},
      contractNames: {},
      bytecodeMaps: {},
      abis: {},
    })

    const { analyzeSummary: { contractAddresses } } = txAnalyzer.analyze()

    ensureDirectoryExistance(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}`)

    for (const address of contractAddresses) {
      ensureDirectoryExistance(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}`)

      const bytecodePath = `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/bytecode.json`
      const bytecode = await handleBytecodeFetching(address, bytecodePath)

      const sourceCodesPath = `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/sourceCodeData.json`
      const sourceCodesData = await handleSourceCodesFetching(address, currentHardhatEnvironment.chainId, sourceCodesPath)

      const isCotractVerified = sourceCodesData.SourceCode

      if (isCotractVerified) {

        console.log(`contract ${address} is being parsed`)
        const { language,settings,sources } = handleSourceCode(sourceCodesData, address)


        const solcInput = JSON.stringify({
          language,
          settings: {
            ...settings,
          outputSelection: {
            "*": {
              "": [
                "ast"
              ],
              "*": [
                "abi",
                "metadata",
                "devdoc",
                "userdoc",
                "storageLayout",
                "evm.legacyAssembly",
                "evm.bytecode",
                "evm.deployedBytecode",
                "evm.methodIdentifiers",
                "evm.gasEstimates",
                "evm.assembly"
              ]
            },
          },
          remappings: []
          },
          sources
        })

        const solcInput2 = address === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" ? readFileSync(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcInput2.json`,'utf8') : ''

        saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcInput.json`, JSON.parse(solcInput))

        if (address === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"){
          console.log(solcInput2)
        }

        const output: string = solc.compile(address === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" ? solcInput2 : solcInput)

        try {
          saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcOutput.json`, JSON.parse(output))
        } catch(error) {
          saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcOutput.json`, output)
        }

        // if (address === "0x7a250d5630b4cf539739df2c5dacb4c659f2488d"){
        //   const solcOutput: SolcOutput = JSON.parse(output)
        //   const {assembly} = solcOutput.contracts['UniswapV2Router02']['UniswapV2Router02'].evm
          
        //   const path = `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/assembly.json`

        //   saveToFile(path, assembly)
        // }
        // if (address === "0x10b35407d9623b3f2597908a5bf1e0f00bbd4a91"){
        //   const solcOutput: SolcOutput = JSON.parse(output)
        //   const {assembly} = solcOutput.contracts['contracts/accumulators/UniswapV2PA.sol']['AdrastiaUniswapV2PA'].evm
          
        //   const path = `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/assembly.json`

        //   saveToFile(path, assembly)
        // }

      } else {
        console.log(`contract ${address} is not verified`)
      }

    }

  } catch (error) {
    console.log(error)
  }
})()
import { readFileSync, writeFileSync } from 'fs'

import type { TEtherscanParsedSourceCode, TTransactionInfo, TTransactionTraceResult } from '@evm-debuger/types'
import { TxAnalyzer } from '@evm-debuger/analyzer'
import solc from 'solc'

import { inputPrompt, selectPrompt } from '../src/prompts'
import {
  ensureDirectoryExistance,
  isMultipleFilesJSON,
  isValidTransaction,
  mapEnumToObject,
  parseSourceCode,
  saveToFile,
} from '../src/utils'
import { ErrorMessages } from '../src/errors'
import { DefaultPaths, Paths } from '../src/paths'
import { fetchTransactionInfo, handleTransactionInfoFetching } from '../src/transaction-data-getters/transactionInfo'
import { handleTransactionTraceFetching } from '../src/transaction-data-getters/transactionTrace'
import { fetchBytecode, handleBytecodeFetching } from '../src/transaction-data-getters/bytecodes'
import { fetchSourceCodes, handleSourceCodesFetching } from '../src/transaction-data-getters/sourceCodes'
import type { SolcOutput, TTempExecs } from '../src/types'
import { handleSourceCode } from '../src/sourceCodeHandlers'

const wait = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

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
      sourceCodes: {},
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

      // await wait(1000)

      const isCotractVerified = sourceCodesData.SourceCode

      if (isCotractVerified) {

        const { language,settings,sources } = handleSourceCode(sourceCodesData, address)


        const output: string = solc.compile(JSON.stringify({
          sources,
          settings: {
            ...settings,
            outputSelection: {
              '*': {
                '*': ['*'],
              },
            },
            // evmVersion:"Default",
          },
          language,
        }))

        saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcOutput.json`, JSON.parse(output))


      } else {
        console.log(`contract ${address} is not verified`)
      }

    }

  } catch (error) {
    console.log(error)
  }
})()
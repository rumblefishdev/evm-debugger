import { readFileSync } from 'fs'

import type { TTransactionInfo, TTransactionTraceResult } from '@evm-debuger/types'
import { TxAnalyzer } from '@evm-debuger/analyzer'
import * as solc from 'solc'

import { inputPrompt } from '../src/prompts'
import { ensureDirectoryExistance, isValidTransaction, saveToFile } from '../src/utils'
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
            sources,
            settings: {
              ...settings,
              outputSelection: {
                '*': {
                  '*': ['*'],
                },
              }
            },

            language,
          })

          saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcInput.json`, JSON.parse(solcInput))

          // console.log(solc)

          const solcOutput = solc.compile(solcInput,1)

          try {
            saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcOutput.json`, JSON.parse(solcOutput))
          } catch(saveError) {
            saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcOutput.json`, solcOutput)
          }
          // solc.loadRemoteVersion(sourceCodesData.CompilerVersion, (error, solcSnapshot) => {
          //   console.log(`solc version ${sourceCodesData.CompilerVersion} is being used`)
          //   console.log(`solcSnapshot version ${solcSnapshot.version()} is being used`)

          //   const output = solcSnapshot.compileStandard(solcInput)
          //   console.log(output)
          // })

          // solc.loadRemoteVersion(sourceCodesData.CompilerVersion, (error, solcSnapshot) => {
          //   console.log(`solc version ${sourceCodesData.CompilerVersion} is being used`)
          //   console.log(`solcSnapshot version ${solcSnapshot.version()} is being used`)
          //   if (error) {
          //     console.log(error)
          //     return
          //   } 

          //   console.log(solcSnapshot)
          // const output: string = solcSnapshot.lowlevel.compileStandard(solcInput)

          // })          



      } else {
        console.log(`contract ${address} is not verified`)
      }

    }

  } catch (error) {
    console.log(error)
  }
})()

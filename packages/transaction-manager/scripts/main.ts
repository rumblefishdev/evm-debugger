import { readFileSync } from 'fs'

import type { TEtherscanParsedSourceCode, TTransactionInfo, TTransactionTraceResult } from '@evm-debuger/types'
import { TxAnalyzer } from '@evm-debuger/analyzer'

import { inputPrompt } from '../src/prompts'
import { ensureDirectoryExistance, isValidTransaction, saveToFile } from '../src/utils'
import { ErrorMessages } from '../src/errors'
import { DefaultPaths, Paths } from '../src/paths'
import { handleTransactionInfoFetching } from '../src/transaction-data-getters/transactionInfo'
import { handleTransactionTraceFetching } from '../src/transaction-data-getters/transactionTrace'
import { handleBytecodeFetching } from '../src/transaction-data-getters/bytecodes'
import { handleSourceCodesFetching } from '../src/transaction-data-getters/sourceCodes'
import type { TTempExecs } from '../src/types'
import { SolcManagerStrategy } from '../src/helpers/solc.strategy'
import { SoruceCodeManagerStrategy } from '../src/helpers/sourceCodeManager.strategy'

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
      
      // eslint-disable-next-line no-promise-executor-return
      await new Promise((resolve) => setTimeout(resolve, 5000))

      ensureDirectoryExistance(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}`)

      const bytecodePath = `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/bytecode.json`
      const bytecode = await handleBytecodeFetching(address, bytecodePath)

      const sourceCodesPath = `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/sourceCodeData.json`
      const sourceCodesData = await handleSourceCodesFetching(address, currentHardhatEnvironment.chainId, sourceCodesPath)

      const isCotractVerified = sourceCodesData.SourceCode

      if (isCotractVerified) {

        const sourceCodeManager = new SoruceCodeManagerStrategy(sourceCodesData.SourceCode)
        const settings = sourceCodeManager.createSettingsObject(sourceCodesData)
        const sources = sourceCodeManager.extractFiles(sourceCodesData)

        sources.forEach(([path, content]) => {
          ensureDirectoryExistance(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/sources/${path.slice(0, path.lastIndexOf('/'))}`)
          saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/sources/${path}`, content)
        })

        const parsedSources: Record<string, { content: string }> = sources.reduce((accumulator, [path, content]) => ({ ...accumulator, [path]: { content } }), {})

        const solcManager = new SolcManagerStrategy(settings.solcCompilerVersion)
          
          const solcInput: TEtherscanParsedSourceCode = {
            sources: parsedSources,
            settings: {
              ...settings.settings,
              outputSelection: {
                '*': {
                  '*': ['*'],
                },
              }
            },
            language: settings.language,
          }

          saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcInput.json`, solcInput)
          

          const solcOutput = solcManager.compile(solcInput)

          saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcOutput.json`, solcOutput)
        

          Object.entries(solcOutput.contracts).forEach(([fileName, fileInternals]) => {
            Object.entries(fileInternals).forEach(([contractName, contractInternals]) => {
              if (contractInternals.evm.assembly) {
                ensureDirectoryExistance(
                  `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/assembly/${fileName.slice(0, fileName.lastIndexOf('/'))}`,
                )
                saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/assembly/${fileName}_${contractName}.json`, contractInternals.evm.assembly)
              }
            })
          })

      } else {
        console.log(`contract ${address} is not verified`)
      }

    }

  } catch (error) {
    console.log(error)
  }
})()

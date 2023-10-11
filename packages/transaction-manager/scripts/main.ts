import { readFileSync, writeFileSync } from 'fs'

import type { TEtherscanParsedSourceCode, TTransactionInfo, TTransactionTraceResult } from '@evm-debuger/types'
import { TxAnalyzer } from '@evm-debuger/analyzer'
import { API_KEYS, ChainIds } from '@evm-debuger/config'
import solc from 'solc'

import { inputPrompt, selectPrompt } from '../src/prompts'
import { ensureDirectoryExistance, isValidTransaction, mapEnumToObject, parseSourceCode, saveToFile } from '../src/utils'
import { ErrorMessages } from '../src/errors'
import { DefaultPaths, Paths } from '../src/paths'
import { fetchTransactionInfo, handleTransactionInfoFetching } from '../src/transaction-data-getters/transactionInfo'
import { handleTransactionTraceFetching } from '../src/transaction-data-getters/transactionTrace'
import { fetchBytecode, handleBytecodeFetching } from '../src/transaction-data-getters/bytecodes'
import { fetchSourceCodes, handleSourceCodesFetching } from '../src/transaction-data-getters/sourceCodes2'
import type { SolcOutput } from '../src/transaction-data-getters/sourceCodes'
import type { TTempExecs } from '../src/types'

/* eslint-disable prettier/prettier */
(async () => {
  try {
    const { promptValue: transactionHash } = await inputPrompt<string>('Enter a transaction hash', { validate: (value) => isValidTransaction(value) || ErrorMessages.INVALID_TRANSACTION_HASH })
    const currentHardhatEnvironment:TTempExecs = JSON.parse(readFileSync(Paths.TEMP_EXECS, 'utf8')) 

    console.log('Checking if result directory exists...')
    ensureDirectoryExistance(DefaultPaths.RESULTS)
    ensureDirectoryExistance(DefaultPaths.RESULTS_TMP)
    ensureDirectoryExistance(DefaultPaths.RESULTS_PERSISTED)

    ensureDirectoryExistance(`${Paths.RESULTS_PERSISTED}/${Paths.TRANSACTIONS}/${transactionHash}`)
    const transactionInfoPath = `${Paths.RESULTS_PERSISTED}/${Paths.TRANSACTIONS}/${transactionHash}/transactionInfo.json`
    const transactionTracePath = `${Paths.RESULTS_PERSISTED}/${Paths.TRANSACTIONS}/${transactionHash}/transactionTrace.json`


    const transactionInfoResult: TTransactionInfo = await handleTransactionInfoFetching(transactionHash,transactionInfoPath)
    const transactionTraceResult: TTransactionTraceResult = await handleTransactionTraceFetching(transactionHash,transactionTracePath)

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
      const bytecode = await handleBytecodeFetching(address,bytecodePath)

      const sourceCodesPath = `${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/sourceCodes.json`
      const sourceCodesData = await handleSourceCodesFetching(address,currentHardhatEnvironment.chainId,sourceCodesPath)

      const isCotractVerified = sourceCodesData.SourceCode

      if (isCotractVerified) {
        const rawSourceCode = sourceCodesData.SourceCode.replace(/(\r\n)/gm,'').slice(1, -1)
        const sourceCodeObj: TEtherscanParsedSourceCode = JSON.parse(rawSourceCode)

        Object.entries(sourceCodeObj.sources).forEach(([path,{content}]) => {
          ensureDirectoryExistance(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/files/${path.slice(0, path.lastIndexOf('/'))}`)
          saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/files/${path}`, content)
        })


        const output: SolcOutput = solc.compile(JSON.stringify({
          sources: sourceCodeObj.sources,
          settings: {
            outputSelection: {
              '*': {
                '*': ['*'],
              },
            },
            optimizer: {
              ...sourceCodeObj.settings.optimizer
            }
          },
          language: 'Solidity',
          
        }))

        saveToFile(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/solcOutput.json`, output)

      }else {
        console.log(`contract ${address} is not verified`)
      }

      // console.log('sourceCodes.result', sourceCodes.result)
      // const rawSourceCode = readFileSync(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/rawSourceCode.sol`, 'utf8')

      // writeFileSync(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/rawSourceCode.sol`, rawSourceCode)

      // console.log('rawSourceCode', rawSourceCode)


      // const input = {
      //   sources: {
      //     'A.sol': {
      //       content: rawSourceCode,
      //     },
      //   },
      //   settings: {
      //     outputSelection: {
      //     '*': {
      //       '*': ['*'],
      //     },
      //   },
      //   optimizer: {
      //       runs: 200,
      //       enabled: false,
      //     }
      //   },
      //   language: 'Solidity',
      // }
      // const output: SolcOutput = JSON.parse(solc.compile(JSON.stringify(input))) as SolcOutput

      // console.log('sourceCodeObj', output.contracts["A.sol"]["A"].evm)

      // writeFileSync(`${Paths.RESULTS_PERSISTED}/${Paths.CONTRACTS}/${address}/sourceCodeObj.json`, JSON.stringify(output, null, 2))
    }


  } catch (error) {
    console.log(error)
  }
})()
import { TxAnalyzer } from '@evm-debuger/analyzer'
import type {
  IStructLog,
  TAbis,
  TContractDataByAddress,
  TContractNamesMap,
  TSourceCodesMap,
  TTransactionInfo,
} from '@evm-debuger/types'
import { apply, put, select } from 'typed-redux-saga'

import { createCallIdentifier } from '../../helpers/helpers'
import { loadActiveBlock } from '../activeBlock/activeBlock.slice'
import { addBytecodes, updateBytecode } from '../bytecodes/bytecodes.slice'
import { bytecodesSelectors } from '../bytecodes/bytecodes.selectors'
import { setContractAddresses, setTxInfo } from '../rawTxData/rawTxData.slice'
import { sighashSelectors } from '../sighash/sighash.selectors'
import { addSighashes } from '../sighash/sighash.slice'
import {
  addSourceCodes,
  updateSourceCode,
} from '../sourceCodes/sourceCodes.slice'
import { loadStructLogs } from '../structlogs/structlogs.slice'
import { addTraceLogs } from '../traceLogs/traceLogs.slice'
import {
  addContractNames,
  updateContractName,
} from '../contractNames/contractNames'

import { analyzerActions } from './analyzer.slice'
import type { ISourceProvider, IBytecodeProvider } from './analyzer.types'

function* callAnalyzerOnce(
  transactionInfo: TTransactionInfo,
  structLogs: IStructLog[],
  additionalData: TContractDataByAddress = {},
) {
  yield* put(analyzerActions.logMessage('Calling analyzer'))
  const abis = yield* select(sighashSelectors.abis)
  const { additionalAbis, sourceCodes, contractNames } = Object.entries(
    additionalData,
  ).reduce(
    (accumulator, [address, { abi, sourceCode, contractName }]) => {
      accumulator.additionalAbis[address] = abi
      accumulator.sourceCodes[address] = sourceCode
      accumulator.contractNames[address] = contractName
      return accumulator
    },
    {
      sourceCodes: {} as TSourceCodesMap,
      contractNames: {} as TContractNamesMap,
      additionalAbis: {} as TAbis,
    },
  )

  const analyzer = new TxAnalyzer({
    transactionInfo,
    structLogs,
    sourceCodes,
    contractNames,
    abis: { ...abis, ...additionalAbis },
  })
  const { mainTraceLogList, analyzeSummary } = yield* apply(
    analyzer,
    analyzer.analyze,
    [],
  )

  yield* put(addTraceLogs(mainTraceLogList))
  yield* put(
    loadActiveBlock({
      ...mainTraceLogList[0],
      id: createCallIdentifier(
        mainTraceLogList[0].stackTrace,
        mainTraceLogList[0].type,
      ),
    }),
  )
  yield* put(addSighashes(analyzeSummary.contractSighashesInfo))

  for (const [address, sourceCode] of Object.entries(sourceCodes))
    yield* put(updateSourceCode({ id: address, changes: { sourceCode } }))

  for (const [address, contractName] of Object.entries(contractNames))
    yield* put(updateContractName({ id: address, changes: { contractName } }))

  return analyzeSummary
}

function* fetchAdditionalAbisAndSources(
  sourceProvider: ISourceProvider,
  addresses: Set<string>,
) {
  const info = {}
  for (const address of addresses.values())
    try {
      yield* put(
        analyzerActions.logMessage(
          `Trying to fetch abi and source code of ${address}`,
        ),
      )
      const source = yield* apply(sourceProvider, sourceProvider.getSource, [
        address,
      ])
      if (!source) throw new Error(`No data for ${address}`)

      info[address] = source
      yield* put(analyzerActions.logMessage(`Success`))
    } catch (error) {
      yield* put(analyzerActions.logMessage(error.toString()))
    }

  return info
}

export function* fetchBytecodes(bytecodeProvider: IBytecodeProvider) {
  yield* put(
    analyzerActions.logMessage('Fetching bytecode of involved contracts'),
  )
  const addresses = yield* select(
    bytecodesSelectors.addressesWithMissingBytecode,
  )
  for (const address of addresses)
    try {
      yield* put(analyzerActions.logMessage(`Fetching bytecode of ${address}`))
      const bytecode = yield* apply(
        bytecodeProvider,
        bytecodeProvider.getBytecode,
        [address],
      )
      if (!bytecode)
        throw new Error(`Bytecode of address ${address} not found!`)

      yield* put(analyzerActions.logMessage('Success!'))
      yield* put(updateBytecode({ id: address, changes: { bytecode } }))
    } catch (error) {
      yield* put(analyzerActions.logMessage(error.toString()))
    }
}

export function* runAnalyzer(
  action: ReturnType<typeof analyzerActions.runAnalyzer>,
) {
  const {
    txInfoProvider,
    structLogProvider,
    sourceProvider,
    bytecodeProvider,
  } = action.payload
  yield* put(analyzerActions.reset())
  yield* put(analyzerActions.setLoading(true))

  try {
    yield* put(analyzerActions.logMessage('Fetching txInfo'))
    const transactionInfo = yield* apply(
      txInfoProvider,
      txInfoProvider.getTxInfo,
      [],
    )

    yield* put(analyzerActions.logMessage('Success!'))
    yield* put(analyzerActions.updateStage('Fetching transaction info'))
    yield* put(setTxInfo(transactionInfo))

    yield* put(analyzerActions.logMessage('Fetching structLogs'))
    const structLogs = yield* apply(
      structLogProvider,
      structLogProvider.getStructLog,
      [],
    )
    yield* put(analyzerActions.logMessage('Success!'))
    yield* put(analyzerActions.updateStage('Fetching structlogs'))
    yield* put(loadStructLogs(structLogs))

    const analyzeSummary = yield* callAnalyzerOnce(transactionInfo, structLogs)
    yield* put(analyzerActions.updateStage('Run analyzer'))

    yield* put(setContractAddresses(analyzeSummary.contractAddresses))
    yield* put(
      addBytecodes(
        analyzeSummary.contractAddresses.map((address) => ({
          error: null,
          disassembled: null,
          bytecode: null,
          address,
        })),
      ),
    )
    yield* put(
      addSourceCodes(
        analyzeSummary.contractAddresses.map((address) => ({
          sourceCode: null,
          address,
        })),
      ),
    )
    yield* put(
      addContractNames(
        analyzeSummary.contractAddresses.map((address) => ({
          contractName: null,
          address,
        })),
      ),
    )

    if (bytecodeProvider) yield* fetchBytecodes(bytecodeProvider)

    if (sourceProvider) {
      yield* put(
        analyzerActions.logMessage('Calculating address to fetch ABIs!'),
      )
      const addresses = yield* select(sighashSelectors.allAddresses)
      if (addresses.size === 0) {
        yield* put(analyzerActions.logMessage('No more data to fetch.'))
        yield* put(analyzerActions.updateStage('Trying to fetch missing data'))
      } else {
        const additionalAbisAndSource = yield* fetchAdditionalAbisAndSources(
          sourceProvider,
          addresses,
        )

        const sourceCodesCount = Object.keys(additionalAbisAndSource).length
        if (sourceCodesCount === 0) {
          yield* put(
            analyzerActions.logMessage('No additional data were fetched.'),
          )
          yield* put(
            analyzerActions.updateStage('Trying to fetch missing data'),
          )
        } else {
          yield* put(
            analyzerActions.updateStage('Trying to fetch missing data'),
          )
          yield* put(
            analyzerActions.logMessage(
              `${sourceCodesCount} were fetched. Calling analyzer again`,
            ),
          )
          yield* callAnalyzerOnce(
            transactionInfo,
            structLogs,
            additionalAbisAndSource,
          )
        }
      }
      yield* put(analyzerActions.updateStage('ReRun analyzer'))
    }
    yield* put(analyzerActions.setLoading(false))
  } catch (error) {
    console.error(error)
    yield* put(analyzerActions.setLoading(false))
    yield* put(analyzerActions.logMessage('Failed!'))
    yield* put(analyzerActions.setError(error.toString()))
  }
}

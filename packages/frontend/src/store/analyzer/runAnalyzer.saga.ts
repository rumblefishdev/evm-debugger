import { Buffer } from 'buffer'

import { TxAnalyzer } from '@evm-debuger/analyzer'
import type {
  IStructLog,
  TAbis,
  TMappedContractNames,
  TMappedSourceCodes,
  TMappedSourceMap,
  TTransactionData,
  TTransactionInfo,
} from '@evm-debuger/types'
import { apply, put, select } from 'typed-redux-saga'

import { createCallIdentifier } from '../../helpers/helpers'
import { bytecodesActions } from '../bytecodes/bytecodes.slice'
import { bytecodesSelectors } from '../bytecodes/bytecodes.selectors'
import { rawTxDataActions } from '../rawTxData/rawTxData.slice'
import { sighashSelectors } from '../sighash/sighash.selectors'
import { addInstructions } from '../instructions/instructions.slice'
import { sourceMapsActions } from '../sourceMaps/sourceMaps.slice'
import { structLogsActions } from '../structlogs/structlogs.slice'
import { traceLogsActions } from '../traceLogs/traceLogs.slice'
import { sighashActions } from '../sighash/sighash.slice'
import { sourceCodesActions } from '../sourceCodes/sourceCodes.slice'
import { contractNamesActions } from '../contractNames/contractNames.slice'
import { activeBlockActions } from '../activeBlock/activeBlock.slice'

import { analyzerActions } from './analyzer.slice'
import type { IContractSourceProvider, IBytecodeProvider, TContractsSources } from './analyzer.types'

function* callAnalyzerOnce(transactionInfo: TTransactionInfo, structLogs: IStructLog[], contractsSources: TContractsSources = {}) {
  yield* put(analyzerActions.logMessage('Calling analyzer'))
  const bytecodes = yield* select(bytecodesSelectors.selectAll)

  const abis = yield* select(sighashSelectors.abis)
  const { additionalAbis, sourceCodes, contractNames, sourceMaps } = Object.entries(contractsSources).reduce(
    (accumulator, [address, { abi, sourceCode, contractName, srcMap }]) => {
      accumulator.additionalAbis[address] = abi
      accumulator.sourceCodes[address] = sourceCode
      accumulator.contractNames[address] = contractName || address
      accumulator.sourceMaps[address] = srcMap
      return accumulator
    },
    {
      sourceMaps: {} as TMappedSourceMap,
      sourceCodes: {} as TMappedSourceCodes,
      contractNames: {} as TMappedContractNames,
      additionalAbis: {} as TAbis,
    },
  )

  const analyzerPayload: TTransactionData = {
    transactionInfo,
    structLogs,
    sourceMaps,
    sourceCodes,
    contractNames,
    bytecodeMaps: bytecodes.reduce((accumulator, bytecode) => {
      accumulator[bytecode.address] = bytecode.bytecode
      return accumulator
    }, {} as Record<string, string>),
    abis: { ...abis, ...additionalAbis },
  }

  // fix for Buffer not defined
  window.Buffer = window.Buffer || Buffer
  const analyzer = new TxAnalyzer(analyzerPayload)
  const { mainTraceLogList, instructionsMap, analyzeSummary } = yield* apply(analyzer, analyzer.analyze, [])

  yield* put(traceLogsActions.addTraceLogs(mainTraceLogList))
  yield* put(
    activeBlockActions.loadActiveBlock({
      ...mainTraceLogList[0],
      id: createCallIdentifier(mainTraceLogList[0].stackTrace, mainTraceLogList[0].type),
    }),
  )
  yield* put(sighashActions.addSighashes(analyzeSummary.contractSighashesInfo))

  yield* put(
    sourceCodesActions.addSourceCodes(
      Object.entries(sourceCodes).reduce((accumulator, [address, sourceCode]) => [...accumulator, { sourceCode, address }], []),
    ),
  )

  yield* put(
    contractNamesActions.updateContractNames(
      Object.entries(contractNames).reduce((accumulator, [address, contractName]) => {
        accumulator.push({ id: address, changes: { contractName } })
        return accumulator
      }, []),
    ),
  )

  yield* put(
    addInstructions(
      Object.entries(instructionsMap).reduce((accumulator, [address, instructions]) => {
        accumulator.push({ instructions, address })
        return accumulator
      }, []),
    ),
  )

  const sourceMapsPayload = Object.entries(sourceMaps)
    .reduce((accumulator, [address, sourceMap]) => {
      if (sourceMap) {
        accumulator.push(sourceMap.map((sourceMapEntry) => ({ ...sourceMapEntry, address })))
      }
      return accumulator
    }, [])
    .flat()

  yield* put(sourceMapsActions.setSourceMaps(sourceMapsPayload))

  return analyzeSummary
}

function* initializeContractInformations(transactionInfo: TTransactionInfo, structLogs: IStructLog[]) {
  const analyzeSummary = yield* callAnalyzerOnce(transactionInfo, structLogs)

  const addContractNamesPayload = analyzeSummary.contractAddresses.map((address) => ({ contractName: null, address }))
  yield* put(contractNamesActions.addContractNames(addContractNamesPayload))

  const addBytecodesPayload = analyzeSummary.contractAddresses.map((address) => ({
    error: null,
    disassembled: null,
    bytecode: null,
    address,
  }))
  yield* put(bytecodesActions.addBytecodes(addBytecodesPayload))
}

function* fetchContractsSources(sourceProvider: IContractSourceProvider, addresses: Set<string>) {
  try {
    yield* put(analyzerActions.logMessage(`Trying to fetch abi and source code of ${JSON.stringify(Array.from(addresses), null, 2)}`))
    const sources = yield* apply(sourceProvider, sourceProvider.getSources, [addresses])
    yield* put(analyzerActions.logMessage(`Success`))
    return sources
  } catch (error) {
    yield* put(analyzerActions.logMessage(error.toString()))
    return {}
  }
}

export function* fetchBytecodes(bytecodeProvider: IBytecodeProvider) {
  yield* put(analyzerActions.logMessage('Fetching bytecode of involved contracts'))
  const addresses = yield* select(bytecodesSelectors.addressesWithMissingBytecode)
  for (const address of addresses)
    try {
      yield* put(analyzerActions.logMessage(`Fetching bytecode of ${address}`))
      const bytecode = yield* apply(bytecodeProvider, bytecodeProvider.getBytecode, [address])
      if (!bytecode) throw new Error(`Bytecode of address ${address} not found!`)

      yield* put(analyzerActions.logMessage('Success!'))
      yield* put(bytecodesActions.updateBytecode({ id: address, changes: { bytecode } }))
    } catch (error) {
      yield* put(analyzerActions.logMessage(error.toString()))
    }
}

export function* regenerateAnalyzer(action: ReturnType<typeof analyzerActions.runAnalyzer>) {
  const { sourceProvider, txInfoProvider, structLogProvider } = action.payload

  const transactionInfo = yield* apply(txInfoProvider, txInfoProvider.getTxInfo, [])
  const structLogs = yield* apply(structLogProvider, structLogProvider.getStructLog, [])
  yield* initializeContractInformations(transactionInfo, structLogs)

  const addresses = yield* select(sighashSelectors.allAddresses)
  const additionalAbisAndSource = yield* fetchContractsSources(sourceProvider, addresses)

  yield* callAnalyzerOnce(transactionInfo, structLogs, additionalAbisAndSource)
}

export function* runAnalyzer(action: ReturnType<typeof analyzerActions.runAnalyzer>) {
  const { txInfoProvider, structLogProvider, sourceProvider, bytecodeProvider } = action.payload
  yield* put(analyzerActions.reset())
  yield* put(analyzerActions.setLoading(true))

  try {
    yield* put(analyzerActions.logMessage('Fetching txInfo'))
    const transactionInfo = yield* apply(txInfoProvider, txInfoProvider.getTxInfo, [])
    yield* put(analyzerActions.logMessage('Fetching txInfo success!'))
    yield* put(analyzerActions.updateStage('Fetching transaction info'))
    yield* put(rawTxDataActions.setTxInfo(transactionInfo))

    yield* put(analyzerActions.logMessage('Fetching structLogs'))
    const structLogs = yield* apply(structLogProvider, structLogProvider.getStructLog, [])
    yield* put(analyzerActions.logMessage('Fetching structLogs success!'))
    yield* put(analyzerActions.updateStage('Fetching structlogs'))
    yield* put(structLogsActions.loadStructLogs(structLogs))

    yield* initializeContractInformations(transactionInfo, structLogs)
    yield* put(analyzerActions.updateStage('Run analyzer'))

    if (bytecodeProvider) {
      yield* put(analyzerActions.logMessage('Fetching bytecodes'))
      yield* fetchBytecodes(bytecodeProvider)
    } else {
      yield* put(analyzerActions.logMessage('Bytecode provider does not exist. Skipping.'))
    }
    yield* apply(console, console.log, ['sourceProvider', sourceProvider])
    if (sourceProvider) {
      yield* put(analyzerActions.logMessage('Calculating address to fetch ABIs!'))
      const addresses = yield* select(sighashSelectors.allAddresses)
      if (addresses.size === 0) {
        yield* put(analyzerActions.logMessage('No more data to fetch.'))
        yield* put(analyzerActions.updateStage('Trying to fetch missing data'))
      } else {
        const contractsSources = yield* fetchContractsSources(sourceProvider, addresses)
        const sourceCodesCount = Object.keys(contractsSources).length
        if (sourceCodesCount === 0) {
          yield* put(analyzerActions.logMessage('No additional data were fetched.'))
          yield* put(analyzerActions.updateStage('Trying to fetch missing data'))
        } else {
          yield* put(analyzerActions.updateStage('Trying to fetch missing data'))
          yield* put(analyzerActions.logMessage(`${sourceCodesCount} were fetched. Calling analyzer again`))
          yield* callAnalyzerOnce(transactionInfo, structLogs, contractsSources)
        }
      }
      yield* put(analyzerActions.updateStage('ReRun analyzer'))
    } else {
      yield* put(analyzerActions.logMessage('Source provider does not exist. Skipping.'))
    }
    yield* put(analyzerActions.setLoading(false))
  } catch (error) {
    console.error(error)
    yield* put(analyzerActions.setLoading(false))
    yield* put(analyzerActions.logMessage('Failed!'))
    yield* put(analyzerActions.setError(error.toString()))
  }
}

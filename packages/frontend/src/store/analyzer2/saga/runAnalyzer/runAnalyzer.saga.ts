import { apply, select, type SagaGenerator, put } from 'typed-redux-saga'
import { TxAnalyzer } from '@evm-debuger/analyzer'
import type { TByteCodeMap, TMappedContractNames, TMappedSourceCodes, TMappedSourceMap, TTransactionData } from '@evm-debuger/types'

import { transactionInfoSelectors } from '../../../transactionInfo/transactionInfo.selectors'
import { structlogsSelectors } from '../../../structlogs/structlogs.selectors'
import { traceLogsActions } from '../../../traceLogs/traceLogs.slice'
import { activeBlockActions } from '../../../activeBlock/activeBlock.slice'
import { createCallIdentifier } from '../../../../helpers/helpers'
import { addInstructions } from '../../../instructions/instructions.slice'
import { sourceMapsSelectors } from '../../../sourceMaps/sourceMaps.selectors'
import { sourceCodesSelectors } from '../../../sourceCodes/sourceCodes.selectors'
import { contractNamesSelectors } from '../../../contractNames/contractNames.selectors'
import { bytecodesSelectors } from '../../../bytecodes/bytecodes.selectors'
import { sighashSelectors } from '../../../sighash/sighash.selectors'
import { analyzerSliceActions } from '../../analyzer.slice'

export function* runAnalyzerSaga(): SagaGenerator<void> {
  const transactionInfo = yield* select(transactionInfoSelectors.selectTransactionInfo)
  const structLogs = yield* select(structlogsSelectors.selectAll)
  const sourceMaps = yield* select(sourceMapsSelectors.selectAll)
  const sourceCodes = yield* select(sourceCodesSelectors.selectAll)
  const contractNames = yield* select(contractNamesSelectors.selectAll)
  const bytecodes = yield* select(bytecodesSelectors.selectAll)
  const abis = yield* select(sighashSelectors.abis)

  const analyzerPayload: TTransactionData = {
    transactionInfo,
    structLogs,
    sourceMaps: sourceMaps.reduce((accumulator, sourceMap) => {
      accumulator[sourceMap.address].push(sourceMap)
      return accumulator
    }, {} as TMappedSourceMap),
    sourceCodes: sourceCodes.reduce((accumulator, sourceCode) => {
      accumulator[sourceCode.address] = sourceCode.sourceCode
      return accumulator
    }, {} as TMappedSourceCodes),
    contractNames: contractNames.reduce((accumulator, contractName) => {
      accumulator[contractName.address] = contractName.contractName
      return accumulator
    }, {} as TMappedContractNames),
    bytecodeMaps: bytecodes.reduce((accumulator, bytecode) => {
      accumulator[bytecode.address] = bytecode.bytecode
      return accumulator
    }, {} as TByteCodeMap),
    abis: { ...abis },
  }
  // fix for Buffer not defined
  window.Buffer = window.Buffer || Buffer
  const analyzer = new TxAnalyzer(analyzerPayload)
  const { mainTraceLogList, instructionsMap } = yield* apply(analyzer, analyzer.analyze, [])

  yield* put(traceLogsActions.addTraceLogs(mainTraceLogList))
  yield* put(
    activeBlockActions.loadActiveBlock({
      ...mainTraceLogList[0],
      id: createCallIdentifier(mainTraceLogList[0].stackTrace, mainTraceLogList[0].type),
    }),
  )

  yield* put(
    addInstructions(
      Object.entries(instructionsMap).reduce((accumulator, [address, instructions]) => {
        accumulator.push({ instructions, address })
        return accumulator
      }, []),
    ),
  )

  yield* put(analyzerSliceActions.analyzerFinished)
}

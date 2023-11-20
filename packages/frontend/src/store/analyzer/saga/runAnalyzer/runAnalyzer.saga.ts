import { apply, select, type SagaGenerator, put } from 'typed-redux-saga'
import { TxAnalyzer } from '@evm-debuger/analyzer'
import type { TByteCodeMap, TMappedContractNames, TMappedSourceCodes, TTransactionData } from '@evm-debuger/types'

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
import { analyzerActions } from '../../analyzer.slice'
import { sighashActions } from '../../../sighash/sighash.slice'
import { abisSelectors } from '../../../abis/abis.selectors'
import { AnalyzerStages, AnalyzerStagesStatus, LogMessageStatus } from '../../analyzer.const'

export function* runAnalyzerSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Running analyzer' }))
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.RUNNING_ANALYZER }))

    const transactionInfo = yield* select(transactionInfoSelectors.selectTransactionInfo)
    const structLogs = yield* select(structlogsSelectors.selectAll)
    const sourceMaps = yield* select(sourceMapsSelectors.selectGroupedByAddress)
    const sourceCodes = yield* select(sourceCodesSelectors.selectAll)
    const contractNames = yield* select(contractNamesSelectors.selectAll)
    const bytecodes = yield* select(bytecodesSelectors.selectAll)
    const abis = yield* select(sighashSelectors.abis)
    const addionalAbis = yield* select(abisSelectors.selectAll)

    const analyzerPayload: TTransactionData = {
      transactionInfo,
      structLogs,
      sourceMaps,
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
      abis: {
        ...abis,
        ...addionalAbis.reduce((accumulator, abi) => {
          accumulator[abi.address] = abi.abi
          return accumulator
        }, {}),
      },
    }
    // fix for Buffer not defined
    window.Buffer = window.Buffer || Buffer
    const analyzer = new TxAnalyzer(analyzerPayload)
    const { mainTraceLogList, instructionsMap, analyzeSummary } = yield* apply(analyzer, analyzer.analyze, [])

    yield* put(sighashActions.addSighashes(analyzeSummary.contractSighashesInfo))

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

    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Analyzer finished' }))
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.RUNNING_ANALYZER,
      }),
    )
  } catch (error) {
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.RUNNING_ANALYZER }))
    yield* put(
      analyzerActions.addLogMessage({
        status: LogMessageStatus.ERROR,
        message: `Error while running analyzer: ${error.message}`,
      }),
    )
    throw error
  }
}

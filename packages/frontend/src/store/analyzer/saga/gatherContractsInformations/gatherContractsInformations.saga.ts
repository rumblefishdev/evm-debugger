import { select, type SagaGenerator, put, call } from 'typed-redux-saga'
import type { TIndexedStructLog, TTransactionData, TTransactionInfo } from '@evm-debuger/types'
import { TxAnalyzer } from '@evm-debuger/analyzer'

import { transactionInfoSelectors } from '../../../transactionInfo/transactionInfo.selectors'
import { structlogsSelectors } from '../../../structlogs/structlogs.selectors'
import { sighashActions } from '../../../sighash/sighash.slice'
import { contractNamesActions } from '../../../contractNames/contractNames.slice'
import { bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { analyzerActions } from '../../analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage } from '../../analyzer.utils'

export function gatherContractsInformations(transactionInfo: TTransactionInfo, structLogs: TIndexedStructLog[]) {
  const analyzerPayload: TTransactionData = {
    transactionInfo,
    structLogs,
    sourceMaps: {},
    sourceFiles: {},
    contractNames: {},
    bytecodeMaps: {},
    abis: {},
  }
  const analyzer = new TxAnalyzer(analyzerPayload)
  const { analyzeSummary } = analyzer.analyze()

  return analyzeSummary
}

export function* gatherContractsInformationsSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Gathering contracts information')))
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.IN_PROGRESS,
        stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION,
      }),
    )

    const transactionInfo = yield* select(transactionInfoSelectors.selectTransactionInfo)
    const structLogs = yield* select(structlogsSelectors.selectAll)

    const analyzeSummary = yield* call(gatherContractsInformations, transactionInfo, structLogs)

    const { contractAddresses, contractSighashesInfo } = analyzeSummary

    const sanitizedContractAddresses = contractAddresses.map((address) => address.toLowerCase())
    const uniqueContractAddresses = [...new Set(sanitizedContractAddresses)]

    yield* put(sighashActions.addSighashes(contractSighashesInfo))
    yield* put(contractNamesActions.initializeContractNames(uniqueContractAddresses))
    yield* put(bytecodesActions.initializeBytecodes(uniqueContractAddresses))

    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION,
      }),
    )

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage('Gathering contracts information success')))
  } catch (error) {
    console.log(error)
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION }),
    )
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Error while gathering contracts informations: ${error.message}`)))
  }
}

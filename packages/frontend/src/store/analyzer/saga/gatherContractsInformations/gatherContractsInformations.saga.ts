import { select, type SagaGenerator, apply, put } from 'typed-redux-saga'
import type { TTransactionData } from '@evm-debuger/types'
import { TxAnalyzer } from '@evm-debuger/analyzer'

import { transactionInfoSelectors } from '../../../transactionInfo/transactionInfo.selectors'
import { structlogsSelectors } from '../../../structlogs/structlogs.selectors'
import { sighashActions } from '../../../sighash/sighash.slice'
import { contractNamesActions } from '../../../contractNames/contractNames.slice'
import { bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { analyzerActions } from '../../analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus, LogMessageStatus } from '../../analyzer.const'

export function* gatherContractsInformationsSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Gathering contracts information' }))
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.IN_PROGRESS,
        stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION,
      }),
    )
    const transactionInfo = yield* select(transactionInfoSelectors.selectTransactionInfo)
    const structLogs = yield* select(structlogsSelectors.selectAll)

    const analyzerPayload: TTransactionData = {
      transactionInfo,
      structLogs,
      sourceMaps: {},
      sourceCodes: {},
      contractNames: {},
      bytecodeMaps: {},
      abis: {},
    }
    // fix for Buffer not defined
    window.Buffer = window.Buffer || Buffer
    const analyzer = new TxAnalyzer(analyzerPayload)
    const { analyzeSummary } = yield* apply(analyzer, analyzer.analyze, [])

    const { contractAddresses, contractSighashesInfo } = analyzeSummary

    yield* put(sighashActions.addSighashes(contractSighashesInfo))
    yield* put(contractNamesActions.initializeContractNames(contractAddresses))
    yield* put(bytecodesActions.initializeBytecodes(contractAddresses))

    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION,
      }),
    )

    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.SUCCESS, message: 'Gathering contracts information success' }))
  } catch (error) {
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION }),
    )
    yield* put(
      analyzerActions.addLogMessage({
        status: LogMessageStatus.ERROR,
        message: `Error while gathering contracts informations: ${error.message}`,
      }),
    )
  }
}

import { put, take, type SagaGenerator } from 'typed-redux-saga'

import { analyzerSliceActions, type TAnalyzerActions } from '../../analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus, LogMessageStatus } from '../../analyzer.const'
import { transactionInfoActions } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions } from '../../../structlogs/structlogs.slice'
import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'
import { bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { sourceCodesActions } from '../../../sourceCodes/sourceCodes.slice'

export function* processTransactionSaga({ payload }: TAnalyzerActions['processTransaction']): SagaGenerator<void> {
  const { chainId, transactionHash } = payload

  try {
    yield* put(analyzerSliceActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Initializing analyzer' }))
    yield* put(analyzerSliceActions.initializeStages)
    yield* put(transactionConfigActions.setChainId({ chainId }))
    yield* put(transactionConfigActions.setTransactionHash({ transactionHash }))

    yield* put(
      analyzerSliceActions.addLogMessage({
        status: LogMessageStatus.INFO,
        message: `Running transaction: ${transactionHash} on chain: ${chainId}`,
      }),
    )

    yield* put(analyzerSliceActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Fetching transaction data' }))
    yield* put(transactionInfoActions.fetchTransactionInfo({ transactionHash, chainId }))
    yield* take(transactionInfoActions.setTransactionInfo)
    yield* put(
      analyzerSliceActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }),
    )

    yield* put(analyzerSliceActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Fetching structLogs' }))
    yield* put(structLogsActions.fetchStructlogsLocation({ transactionHash, chainId }))
    yield* take(transactionConfigActions.setS3Location)

    yield* put(structLogsActions.fetchStructlogs)
    yield* take(structLogsActions.loadStructLogs)
    yield* put(
      analyzerSliceActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_STRUCTLOGS }),
    )

    yield* put(analyzerSliceActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Gathering contracts information' }))
    yield* put(analyzerSliceActions.gatherContractsInformations)
    yield* take(analyzerSliceActions.analyzerFinished)
    yield* put(
      analyzerSliceActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION,
      }),
    )

    yield* put(bytecodesActions.fetchBytecodes)
    yield* take(bytecodesActions.finishFetchingBytecodes)
    yield* put(
      analyzerSliceActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.FETCHING_BYTECODES,
      }),
    )

    yield* put(analyzerSliceActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Fetching source codes' }))
    yield* put(sourceCodesActions.fetchSourceCodes)
    yield* put(
      analyzerSliceActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.FETCHING_SOURCE_CODES,
      }),
    )

    yield* put(analyzerSliceActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Running analyzer' }))
    yield* put(analyzerSliceActions.runAnalyzer)
    yield* take(analyzerSliceActions.analyzerFinished)

    yield* put(analyzerSliceActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Analyzer finished' }))
    yield* put(
      analyzerSliceActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.RUNNING_ANALYZER,
      }),
    )
  } catch (error) {
    console.log(error)
  }
}

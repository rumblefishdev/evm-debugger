import { put, take, type SagaGenerator } from 'typed-redux-saga'

import { analyzerActions, type TAnalyzerActions } from '../../analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus, LogMessageStatus } from '../../analyzer.const'
import { transactionInfoActions } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions } from '../../../structlogs/structlogs.slice'
import { transactionConfigActions } from '../../../transactionConfig/transactionConfig.slice'
import { bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { sourceCodesActions } from '../../../sourceCodes/sourceCodes.slice'

export function* processTransactionSaga({ payload }: TAnalyzerActions['processTransaction']): SagaGenerator<void> {
  const { chainId, transactionHash } = payload

  try {
    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Initializing analyzer' }))

    yield* put(transactionConfigActions.setChainId({ chainId }))
    yield* put(transactionConfigActions.setTransactionHash({ transactionHash }))

    yield* put(
      analyzerActions.addLogMessage({
        status: LogMessageStatus.INFO,
        message: `Running transaction: ${transactionHash} on chain: ${chainId}`,
      }),
    )

    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Fetching transaction data' }))
    yield* put(transactionInfoActions.fetchTransactionInfo({ transactionHash, chainId }))
    yield* take(transactionInfoActions.setTransactionInfo)
    yield* put(
      analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }),
    )

    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Fetching structLogs' }))
    yield* put(structLogsActions.fetchStructlogsLocation({ transactionHash, chainId }))
    yield* take(transactionConfigActions.setS3Location)

    yield* put(structLogsActions.fetchStructlogs)
    yield* take(structLogsActions.loadStructLogs)
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_STRUCTLOGS }))

    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Gathering contracts information' }))
    yield* put(analyzerActions.gatherContractsInformations)
    yield* take(analyzerActions.analyzerFinished)
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION,
      }),
    )

    yield* put(bytecodesActions.fetchBytecodes)
    yield* take(bytecodesActions.finishFetchingBytecodes)
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.FETCHING_BYTECODES,
      }),
    )

    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Fetching source codes' }))
    yield* put(sourceCodesActions.fetchSourceCodes)
    yield* take(sourceCodesActions.addSourceCodes)
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.FETCHING_SOURCE_CODES,
      }),
    )

    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Running analyzer' }))
    yield* put(analyzerActions.runAnalyzer)
    yield* take(analyzerActions.analyzerFinished)

    yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: 'Analyzer finished' }))
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.RUNNING_ANALYZER,
      }),
    )
  } catch (error) {
    console.log(error)
  }
}

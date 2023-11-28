import { put, take, type SagaGenerator } from 'typed-redux-saga'

import { analyzerActions, type TAnalyzerActions } from '../../analyzer.slice'
import { AnalyzerStages } from '../../analyzer.const'
import { transactionInfoActions } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions } from '../../../structlogs/structlogs.slice'
import { bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { sourceCodesActions } from '../../../sourceCodes/sourceCodes.slice'
import { createErrorLogMessage, createInfoLogMessage } from '../../analyzer.utils'

import { processTransactionTakesMatchers } from './processTransaction.takes'

export function* processTransactionSaga({ payload }: TAnalyzerActions['processTransaction']): SagaGenerator<void> {
  const { chainId, transactionHash } = payload

  try {
    yield* put(analyzerActions.initializeTransactionProcessing(payload))
    yield* take(processTransactionTakesMatchers[AnalyzerStages.INITIALIZING_ANALYZER])

    yield* put(analyzerActions.addLogMessage(createInfoLogMessage(`Running transaction: ${transactionHash} on chain: ${chainId}`)))

    yield* put(transactionInfoActions.fetchTransactionInfo())
    yield* take(processTransactionTakesMatchers[AnalyzerStages.FETCHING_TRANSACTION_INFO])

    yield* put(structLogsActions.startPreparingStructlogs())
    yield* take(processTransactionTakesMatchers[AnalyzerStages.PREPARING_STRUCTLOGS])

    yield* put(structLogsActions.fetchStructlogs())
    yield* take(processTransactionTakesMatchers[AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS])

    yield* put(analyzerActions.gatherContractsInformations())
    yield* take(processTransactionTakesMatchers[AnalyzerStages.GATHERING_CONTRACTS_INFORMATION])

    yield* put(bytecodesActions.fetchBytecodes())
    yield* take(processTransactionTakesMatchers[AnalyzerStages.FETCHING_BYTECODES])

    yield* put(sourceCodesActions.startPoolingSources())
    yield* take(processTransactionTakesMatchers[AnalyzerStages.FETCHING_SOURCE_CODES])

    yield* put(analyzerActions.runAnalyzer())
    yield* take(processTransactionTakesMatchers[AnalyzerStages.RUNNING_ANALYZER])
  } catch (error) {
    yield* put(analyzerActions.setCriticalError(error.message))
    yield* put(
      analyzerActions.addLogMessage(createErrorLogMessage(`Error while processing transaction: ${transactionHash} on chain: ${chainId}`)),
    )
  }
}

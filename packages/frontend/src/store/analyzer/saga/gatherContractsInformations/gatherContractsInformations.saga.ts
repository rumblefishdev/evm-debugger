import { type SagaGenerator, put, call, apply } from 'typed-redux-saga'

import { analyzerActions } from '../../analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../analyzer.utils'
import { contractBaseActions } from '../../../contractBase/contractBase.slice'

export function* gatherContractsInformationsSaga(): SagaGenerator<void> {
  try {
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Gathering contracts information')))
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.IN_PROGRESS,
        stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION,
      }),
    )

    const analyzer = yield* call(getAnalyzerInstance)
    const contractAddresses = yield* apply(analyzer, analyzer.getTraceLogsContractAddresses, [])

    // TODO: move sanitization to analyzer
    const sanitizedContractAddresses = contractAddresses.map((address) => address.toLowerCase())
    const uniqueContractAddresses = [...new Set(sanitizedContractAddresses)]

    yield* apply(analyzer.dataLoader, analyzer.dataLoader.setEmptyContracts, [uniqueContractAddresses])
    yield* put(contractBaseActions.initializeContractsBase(uniqueContractAddresses))

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

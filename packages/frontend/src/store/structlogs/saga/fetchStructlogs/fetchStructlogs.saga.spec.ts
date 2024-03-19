import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'
import { Response } from 'node-fetch'

import { transactionConfigReducer } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerActions, analyzerReducer } from '../../../analyzer/analyzer.slice'
import { AnalyzerState, analyzerStagesAdapter } from '../../../analyzer/analyzer.state'
import { TransactionConfigState } from '../../../transactionConfig/transactionConfig.state'
import { StoreKeys } from '../../../store.keys'
import { createMockedStructLogs } from '../../structlogs.mock'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../../analyzer/analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'

import { fetchStructlogs, fetchStructlogsSaga, parseStructlogs } from './fetchStructlogs.saga'

const STRUCTLOGS = createMockedStructLogs(10)

describe('fetchStructlogsSaga', () => {
  it('should fetch structlogs', async () => {
    const analyzerInstance = getAnalyzerInstance()

    const initialState = {
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
      [StoreKeys.TRANSACTION_CONFIG]: { ...new TransactionConfigState(), s3Location: 's3Location' },
    }

    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS }

    const firstLogMessage = createInfoLogMessage('Downloading and parsing structLogs')
    const secondLogMessage = createSuccessLogMessage('Successfully downloaded and parsed structlogs')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))

    const STRUCTLOGS_ARRAY_BUFFER = await new Response(JSON.stringify(STRUCTLOGS)).arrayBuffer()

    const expectedState = {
      ...initialState,
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: analyzerStagesAdapter.updateOne(initialState[StoreKeys.ANALYZER].stages, {
          id: AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS,
          changes: successStage,
        }),
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(fetchStructlogsSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
        }),
      )
      .withState(initialState)
      .provide([
        [matchers.call.fn(fetchStructlogs), STRUCTLOGS_ARRAY_BUFFER],
        [matchers.call.fn(parseStructlogs), STRUCTLOGS],
        [matchers.call.fn(getAnalyzerInstance), analyzerInstance],
      ])
      .put.like({ action: addFirstLogAction })
      .put(analyzerActions.updateStage(inProgresStage))
      .call(fetchStructlogs, 's3Location')
      .call(parseStructlogs, STRUCTLOGS_ARRAY_BUFFER)
      .call(getAnalyzerInstance)
      .apply(analyzerInstance.dataLoader, analyzerInstance.dataLoader.inputStructlogs.set, [STRUCTLOGS])
      .put.like({ action: addSecondLogAction })
      .put(analyzerActions.updateStage(successStage))
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

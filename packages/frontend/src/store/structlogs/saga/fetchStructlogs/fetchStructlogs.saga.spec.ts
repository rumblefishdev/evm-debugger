import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'
import { Response } from 'node-fetch'

import { transactionConfigReducer } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerActions, analyzerReducer } from '../../../analyzer/analyzer.slice'
import { structLogsActions, structLogsAdapter, structLogsReducer } from '../../structlogs.slice'
import { AnalyzerState } from '../../../analyzer/analyzer.state'
import { TransactionConfigState } from '../../../transactionConfig/transactionConfig.state'
import { StoreKeys } from '../../../store.keys'
import { createStructLogs } from '../../structlogs.utils'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import {
  createLogMessageActionForTests,
  mockLogsInAnalyer,
  testLogMessages,
  updateAnalyzerStageStatus,
} from '../../../../helpers/sagaTests'

import { fetchStructlogs, fetchStructlogsSaga, parseStructlogs } from './fetchStructlogs.saga'

const STRUCTLOGS = createStructLogs(10)

describe('fetchStructlogsSaga', () => {
  it('should fetch structlogs', async () => {
    const initialState = {
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
      [StoreKeys.TRANSACTION_CONFIG]: { ...new TransactionConfigState(), s3Location: 's3Location' },
      [StoreKeys.STRUCT_LOGS]: structLogsAdapter.getInitialState(),
    }

    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS }

    const firstLogMessage = createInfoLogMessage('Downloading and parsing structLogs')
    const secondLogMessage = createSuccessLogMessage('Successfully downloaded and parsed structlogs')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))

    const STRUCTLOGS_ARRAY_BUFFER = await new Response(JSON.stringify(STRUCTLOGS)).arrayBuffer()

    const expectedState = {
      [StoreKeys.STRUCT_LOGS]: {
        ids: [...STRUCTLOGS.map((structLog) => structLog.index)],
        entities: { ...STRUCTLOGS.reduce((accumulator, structLog) => ({ ...accumulator, [structLog.index]: structLog }), {}) },
      },
      [StoreKeys.TRANSACTION_CONFIG]: initialState[StoreKeys.TRANSACTION_CONFIG],
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: updateAnalyzerStageStatus(
          AnalyzerStages.DOWNLOADING_AND_PARSING_STRUCTLOGS,
          AnalyzerStagesStatus.SUCCESS,
          initialState[StoreKeys.ANALYZER],
        ),
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(fetchStructlogsSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
          [StoreKeys.STRUCT_LOGS]: structLogsReducer,
        }),
      )
      .withState(initialState)
      .provide([
        [matchers.call.fn(fetchStructlogs), STRUCTLOGS_ARRAY_BUFFER],
        [matchers.call.fn(parseStructlogs), STRUCTLOGS],
      ])
      .put.like({ action: addFirstLogAction })
      .put(analyzerActions.updateStage(inProgresStage))
      .call(fetchStructlogs, 's3Location')
      .call(parseStructlogs, STRUCTLOGS_ARRAY_BUFFER)
      .put(structLogsActions.loadStructLogs(STRUCTLOGS))
      .put.like({ action: addSecondLogAction })
      .put(analyzerActions.updateStage(successStage))
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

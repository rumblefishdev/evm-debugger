import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'

import { analyzerActions, analyzerReducer } from '../../analyzer.slice'
import { AnalyzerState, analyzerStagesAdapter } from '../../analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { contractBaseActions, contractBaseAdapter, contractBaseReducer } from '../../../contractBase/contractBase.slice'
import { createMockedContractBase } from '../../../contractBase/contractBase.mock'

import { gatherContractsInformationsSaga } from './gatherContractsInformations.saga'

const mockedEmptyContractBases = [createMockedContractBase(), createMockedContractBase()]
const mockedContractBasesAddresses = mockedEmptyContractBases.map((contractBase) => contractBase.address)

describe('gatherContractsInformations', () => {
  it('should gather contracts informations', async () => {
    const analyzerInstance = getAnalyzerInstance()

    const initialState = {
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
      [StoreKeys.CONTRACT_BASE]: contractBaseAdapter.getInitialState(),
    }

    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION }

    const firstLogMessage = createInfoLogMessage('Gathering contracts information')
    const secondLogMessage = createSuccessLogMessage('Gathering contracts information success')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.CONTRACT_BASE]: contractBaseAdapter.addMany(initialState[StoreKeys.CONTRACT_BASE], mockedEmptyContractBases),
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: analyzerStagesAdapter.updateOne(initialState[StoreKeys.ANALYZER].stages, {
          id: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION,
          changes: successStage,
        }),
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(gatherContractsInformationsSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.ANALYZER]: analyzerReducer,
          [StoreKeys.CONTRACT_BASE]: contractBaseReducer,
        }),
      )
      .provide([
        [matchers.call.fn(getAnalyzerInstance), analyzerInstance],
        [matchers.apply.fn(analyzerInstance.getTraceLogsContractAddresses), mockedContractBasesAddresses],
      ])
      .withState(initialState)
      .put.like({ action: addFirstLogAction })
      .put(analyzerActions.updateStage(inProgresStage))
      .call(getAnalyzerInstance)
      .apply(analyzerInstance, analyzerInstance.getTraceLogsContractAddresses, [])
      .put(contractBaseActions.initializeContractsBase(mockedContractBasesAddresses))
      .put.like({ action: addSecondLogAction })
      .put(analyzerActions.updateStage(successStage))
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

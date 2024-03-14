import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'

import { analyzerActions, analyzerReducer } from '../../analyzer.slice'
import { AnalyzerState, analyzerStagesAdapter } from '../../analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { contractsActions, contractsAdapter, contractsReducer } from '../../../contracts/contracts.slice'
import { createMockedBytecodes } from '../../../bytecodes/bytecodes.mock'
import { createMockedContracts } from '../../../contracts/contracts.mock'

import { gatherContractsInformationsSaga } from './gatherContractsInformations.saga'

const mockedEmptyBytecodes = createMockedBytecodes(4)
const mockedEmptyContractNames = createMockedContracts(4)

const contractAddresses = mockedEmptyBytecodes.map((bytecode) => bytecode.address)

describe('gatherContractsInformations', () => {
  it('should gather contracts informations', async () => {
    const analyzerInstance = getAnalyzerInstance()

    const initialState = {
      [StoreKeys.CONTRACTS]: { ...contractsAdapter.getInitialState() },
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
    }

    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION }

    const firstLogMessage = createInfoLogMessage('Gathering contracts information')
    const secondLogMessage = createSuccessLogMessage('Gathering contracts information success')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.CONTRACTS]: contractsAdapter.addMany(initialState[StoreKeys.CONTRACTS], mockedEmptyContractNames),
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
          [StoreKeys.CONTRACTS]: contractsReducer,
        }),
      )
      .provide([
        [matchers.call.fn(getAnalyzerInstance), analyzerInstance],
        [matchers.apply.fn(analyzerInstance.getContractAddressesInTransaction), contractAddresses],
      ])
      .withState(initialState)
      .put.like({ action: addFirstLogAction })
      .put(analyzerActions.updateStage(inProgresStage))
      .call(getAnalyzerInstance)
      .apply(analyzerInstance, analyzerInstance.getContractAddressesInTransaction, [])
      .put(contractsActions.initializeContracts(contractAddresses))
      .put.like({ action: addSecondLogAction })
      .put(analyzerActions.updateStage(successStage))
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

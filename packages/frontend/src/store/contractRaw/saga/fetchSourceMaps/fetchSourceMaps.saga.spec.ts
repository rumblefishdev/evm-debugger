import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'

import { analyzerActions, analyzerReducer } from '../../../analyzer/analyzer.slice'
import { AnalyzerState } from '../../../analyzer/analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { createSuccessLogMessage, getAnalyzerInstance } from '../../../analyzer/analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { createMockedContractBase } from '../../../contractBase/contractBase.mock'
import { createMockedContractRawData, createMockedSourceMap } from '../../contractRaw.mock'
import { contractBaseAdapter, contractBaseReducer } from '../../../contractBase/contractBase.slice'
import { contractRawActions } from '../../contractRaw.slice'

import { fetchSourceMap, fetchSourceMapsForContractSaga } from './fetchSourceMaps.saga'

const MOCK_SOURCE_MAP_PATH = 'mockPath'
const mockedContractBase = createMockedContractBase()
const mockedSourceMapInfraContent = createMockedSourceMap(mockedContractBase.address)
const mockedContractRaw = createMockedContractRawData(mockedContractBase.address)

describe('fetchSourceMapsForContractSaga', () => {
  it('should fetch source maps for contract', async () => {
    const analyzerInstance = getAnalyzerInstance()
    analyzerInstance.dataLoader.setEmptyContracts([mockedContractBase.address])

    const initialState = {
      [StoreKeys.CONTRACT_BASE]: contractBaseAdapter.addOne(contractBaseAdapter.getInitialState(), mockedContractBase),
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
    }

    const logMessage = createSuccessLogMessage(`Source maps for ${mockedContractBase.address} fetched successfully`)

    const addLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(logMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(
      fetchSourceMapsForContractSaga,
      contractRawActions.fetchSourceMaps({ path: MOCK_SOURCE_MAP_PATH, contractAddress: mockedContractBase.address }),
    )
      .withReducer(combineReducers({ [StoreKeys.CONTRACT_BASE]: contractBaseReducer, [StoreKeys.ANALYZER]: analyzerReducer }), initialState)
      .withState(initialState)

      .provide([
        [matchers.call.fn(fetchSourceMap), mockedSourceMapInfraContent],
        [matchers.call.fn(getAnalyzerInstance), analyzerInstance],
      ])
      .call(getAnalyzerInstance)
      .call(fetchSourceMap, MOCK_SOURCE_MAP_PATH)
      .put.like({ action: addLogAction })
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [logMessage])
  })
})

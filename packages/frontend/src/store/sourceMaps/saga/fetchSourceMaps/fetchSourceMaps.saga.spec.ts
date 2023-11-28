import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'

import { analyzerActions, analyzerReducer } from '../../../analyzer/analyzer.slice'
import { AnalyzerState } from '../../../analyzer/analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { sourceMapsActions, sourceMapsAdapter, sourceMapsReducer } from '../../sourceMaps.slice'
import { createMockedSourceMap } from '../../sourceMaps.mock'

import { fetchSourceMaps, fetchSourceMapsForContractSaga } from './fetchSourceMaps.saga'

const MOCK_CONTRACT_ADDRESS = '0x123'
const MOCK_SOURCE_MAP_PATHS = ['mockPath']

const mockedSourceMap = createMockedSourceMap()

describe('fetchSourceMapsForContractSaga', () => {
  it('should fetch source maps for contract', async () => {
    const initialState = {
      [StoreKeys.SOURCE_MAPS]: sourceMapsAdapter.getInitialState(),
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
    }

    const logMessage = createSuccessLogMessage(`Source maps for ${MOCK_CONTRACT_ADDRESS} fetched successfully`)

    const addLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(logMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.SOURCE_MAPS]: sourceMapsAdapter.addOne(initialState[StoreKeys.SOURCE_MAPS], {
        ...mockedSourceMap,
        address: MOCK_CONTRACT_ADDRESS,
      }),
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(
      fetchSourceMapsForContractSaga,
      sourceMapsActions.fetchSourceMaps({ paths: MOCK_SOURCE_MAP_PATHS, contractAddress: MOCK_CONTRACT_ADDRESS }),
    )
      .withReducer(combineReducers({ [StoreKeys.SOURCE_MAPS]: sourceMapsReducer, [StoreKeys.ANALYZER]: analyzerReducer }), initialState)
      .withState(initialState)
      .provide([[matchers.call.fn(fetchSourceMaps), [mockedSourceMap]]])
      .call(fetchSourceMaps, MOCK_SOURCE_MAP_PATHS)
      .put(sourceMapsActions.addSourceMaps([{ ...mockedSourceMap, address: MOCK_CONTRACT_ADDRESS }]))
      .put.like({ action: addLogAction })
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [logMessage])
  })
})

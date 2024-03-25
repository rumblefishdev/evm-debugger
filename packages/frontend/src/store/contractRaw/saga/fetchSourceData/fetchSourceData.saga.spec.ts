import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'
import type { TEtherscanContractSourceCodeResult } from '@evm-debuger/types'

import { analyzerActions, analyzerReducer } from '../../../analyzer/analyzer.slice'
import { AnalyzerState } from '../../../analyzer/analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { createSuccessLogMessage, getAnalyzerInstance } from '../../../analyzer/analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { createMockedContractRawData } from '../../contractRaw.mock'
import { createMockedContractBase } from '../../../contractBase/contractBase.mock'
import { contractBaseAdapter, contractBaseReducer } from '../../../contractBase/contractBase.slice'
import { contractRawActions } from '../../contractRaw.slice'

import { fetchSourceData, fetchSourceDataForContractSaga, fetchSourcesOrder } from './fetchSourceData.saga'

const MOCK_SOURCE_DATA_PATH = 'mockPath'
const MOCK_SOURCES_PATH = 'sourcesPath'

const MOCKED_SOURCECODE = 'sourceCode'
const MOCKED_SOURCEORDER = { O: 'sourceOrder' }

const MOCKED_CONTRACT_BASE_WITH_NAME = createMockedContractBase()
const MOCKED_CONTRACT_RAW = createMockedContractRawData(MOCKED_CONTRACT_BASE_WITH_NAME.address)

const MOCKED_SOURCEDATA_RESPONSE: Omit<Partial<TEtherscanContractSourceCodeResult>, 'ABI'> & { ABI: string } = {
  SourceCode: MOCKED_SOURCECODE,
  ContractName: MOCKED_CONTRACT_BASE_WITH_NAME.name,
  ABI: JSON.stringify(MOCKED_CONTRACT_RAW.applicationBinaryInterface),
}

const MOCKED_SOURCES_RESPONSE = MOCKED_SOURCEORDER

describe('fetchSourceDataForContractSaga', () => {
  it('should fetch source data for contract', async () => {
    const analyzerInstance = getAnalyzerInstance()
    analyzerInstance.dataLoader.setEmptyContracts([MOCKED_CONTRACT_BASE_WITH_NAME.address])

    const initialState = {
      [StoreKeys.CONTRACT_BASE]: contractBaseAdapter.getInitialState(),
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
    }

    const logMessage = createSuccessLogMessage(`Source data for ${MOCKED_CONTRACT_BASE_WITH_NAME.address} fetched successfully`)

    const addLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(logMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(
      fetchSourceDataForContractSaga,
      contractRawActions.fetchSourceData({
        sourcesPath: MOCK_SOURCES_PATH,
        sourceDataPath: MOCK_SOURCE_DATA_PATH,
        contractAddress: MOCKED_CONTRACT_BASE_WITH_NAME.address,
      }),
    )
      .withReducer(
        combineReducers({
          [StoreKeys.ANALYZER]: analyzerReducer,
          [StoreKeys.CONTRACT_BASE]: contractBaseReducer,
        }),
      )
      .withState(initialState)
      .provide([
        [matchers.call.fn(fetchSourceData), MOCKED_SOURCEDATA_RESPONSE],
        [matchers.call.fn(fetchSourcesOrder), MOCKED_SOURCES_RESPONSE],
      ])
      .put.like({ action: addLogAction })
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [logMessage])
  })
})

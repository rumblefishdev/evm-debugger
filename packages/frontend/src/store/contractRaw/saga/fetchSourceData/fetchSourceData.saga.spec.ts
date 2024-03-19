import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'
import type { TEtherscanContractSourceCodeResult } from '@evm-debuger/types'

import { analyzerActions, analyzerReducer } from '../../../analyzer/analyzer.slice'
import { AnalyzerState } from '../../../analyzer/analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { sourceCodesActions, sourceCodesAdapter, sourceCodesReducer } from '../../sourceCodes.slice'
import { contractsActions, contractsAdapter, contractsReducer } from '../../../contracts/contracts.slice'
import { abisActions, abisAdapter, abisReducer } from '../../../abis/abis.slice'
import { createMockedAbi } from '../../../abis/abi.mock'
import { createMockedSourceCode } from '../../sourceCodes.mock'
import { createMockedContract } from '../../../contracts/contracts.mock'

import { fetchSourceData, fetchSourceDataForContractSaga, fetchSourcesOrder } from './fetchSourceData.saga'

const MOCK_CONTRACT_ADDRESS = '0x123'
const MOCK_SOURCE_DATA_PATH = 'mockPath'
const MOCK_SOURCES_PATH = 'sourcesPath'

const MOCKED_ABI = createMockedAbi(MOCK_CONTRACT_ADDRESS)
const MOCKED_SOURCECODE = createMockedSourceCode(MOCK_CONTRACT_ADDRESS)
const MOCKED_CONTRACT_NAME = createMockedContract(MOCK_CONTRACT_ADDRESS)

const MOCKED_SOURCEDATA_RESPONSE: Partial<TEtherscanContractSourceCodeResult> = {
  SourceCode: MOCKED_SOURCECODE.sourceCode,
  ContractName: MOCKED_CONTRACT_NAME.contractName,
  ABI: MOCKED_ABI.abi,
}

const MOCKED_SOURCES_RESPONSE = MOCKED_SOURCECODE.sourcesOrder

describe('fetchSourceDataForContractSaga', () => {
  it('should fetch source data for contract', async () => {
    const initialState = {
      [StoreKeys.SOURCE_CODES]: sourceCodesAdapter.getInitialState(),
      [StoreKeys.ABIS]: abisAdapter.getInitialState(),
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
    }

    const logMessage = createSuccessLogMessage(`Source data for ${MOCK_CONTRACT_ADDRESS} fetched successfully`)

    const addLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(logMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.SOURCE_CODES]: sourceCodesAdapter.addOne(initialState[StoreKeys.SOURCE_CODES], MOCKED_SOURCECODE),
      [StoreKeys.ABIS]: abisAdapter.addOne(initialState[StoreKeys.ABIS], MOCKED_ABI),
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(
      fetchSourceDataForContractSaga,
      sourceCodesActions.fetchSourceData({
        sourcesPath: MOCK_SOURCES_PATH,
        sourceDataPath: MOCK_SOURCE_DATA_PATH,
        contractAddress: MOCK_CONTRACT_ADDRESS,
      }),
    )
      .withReducer(
        combineReducers({
          [StoreKeys.SOURCE_CODES]: sourceCodesReducer,
          [StoreKeys.ABIS]: abisReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
        }),
      )
      .withState(initialState)
      .provide([
        [matchers.call.fn(fetchSourceData), MOCKED_SOURCEDATA_RESPONSE],
        [matchers.call.fn(fetchSourcesOrder), MOCKED_SOURCES_RESPONSE],
      ])
      .put(abisActions.addAbi(MOCKED_ABI))
      .put(sourceCodesActions.addSourceCode(MOCKED_SOURCECODE))
      .put.like({ action: addLogAction })
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [logMessage])
  })
})

import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { ChainId } from '@evm-debuger/types'
import { combineReducers } from 'redux'

import { transactionConfigReducer } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerActions, analyzerReducer } from '../../../analyzer/analyzer.slice'
import { TransactionConfigState } from '../../../transactionConfig/transactionConfig.state'
import { AnalyzerState, analyzerStagesAdapter } from '../../../analyzer/analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../../analyzer/analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { createMockedContractBase } from '../../../contractBase/contractBase.mock'
import { contractBaseAdapter, contractBaseReducer } from '../../../contractBase/contractBase.slice'
import { createMockedContractRawData } from '../../contractRaw.mock'

import { fetchBytecode, fetchBytecodesSaga } from './fetchBytecodes.saga'

const TRANSACTION_HASH = '0x1234567890'
const CHAIN_ID = ChainId.mainnet

const mockedContractBase = createMockedContractBase()
const mockedContractRaw = createMockedContractRawData(mockedContractBase.address)
describe('fetchBytecodesSaga', () => {
  it('should fetch bytecodes', async () => {
    const analyzerInstance = getAnalyzerInstance()
    analyzerInstance.dataLoader.setEmptyContracts([mockedContractBase.address])

    const initialState = {
      [StoreKeys.TRANSACTION_CONFIG]: { ...new TransactionConfigState(), transactionHash: TRANSACTION_HASH, chainId: CHAIN_ID },
      [StoreKeys.CONTRACT_BASE]: contractBaseAdapter.addOne(contractBaseAdapter.getInitialState(), mockedContractBase),
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
    }

    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.FETCHING_BYTECODES }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_BYTECODES }

    const firstLogMessage = createInfoLogMessage('Fetching bytecodes')
    const secondLogMessage = createSuccessLogMessage('Fetching bytecodes success')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: analyzerStagesAdapter.updateOne(initialState[StoreKeys.ANALYZER].stages, {
          id: AnalyzerStages.FETCHING_BYTECODES,
          changes: successStage,
        }),
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(fetchBytecodesSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
          [StoreKeys.CONTRACT_BASE]: contractBaseReducer,
        }),
      )
      .withState(initialState)
      .provide([
        [matchers.call.fn(fetchBytecode), mockedContractRaw.etherscanBytecode],
        [matchers.call.fn(getAnalyzerInstance), analyzerInstance],
      ])
      .put.like({ action: addFirstLogAction })
      .put(analyzerActions.updateStage(inProgresStage))
      .call(getAnalyzerInstance)
      .call(fetchBytecode, CHAIN_ID, mockedContractBase.address)
      .put(analyzerActions.updateStage(successStage))
      .put.like({ action: addSecondLogAction })
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

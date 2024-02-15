import { expectSaga } from 'redux-saga-test-plan'
import { ChainId } from '@evm-debuger/types'
import { combineReducers } from 'redux'
import * as matchers from 'redux-saga-test-plan/matchers'

import { transactionConfigActions, transactionConfigReducer } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerActions, analyzerReducer } from '../../analyzer.slice'
import { TransactionConfigState } from '../../../transactionConfig/transactionConfig.state'
import { AnalyzerState, analyzerStagesAdapter } from '../../analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'

import { estimateGasUsage, initializeTransactionProcessingSaga } from './initializeTransactionProcessing.saga'

const TRANSACTION_HASH = '0x1234567890'
const CHAIN_ID = ChainId.mainnet
const GAS_USED = BigInt(1000)

describe('initializeTransactionProcessingSaga', () => {
  it('should initialize transaction processing', async () => {
    const initialState = {
      [StoreKeys.TRANSACTION_CONFIG]: { ...new TransactionConfigState(), transactionHash: TRANSACTION_HASH, chainId: CHAIN_ID },
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
    }

    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.INITIALIZING_ANALYZER }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.INITIALIZING_ANALYZER }

    const firstLogMessage = createInfoLogMessage('Initializing analyzer')
    const secondLogMessage = createInfoLogMessage('Calculating gas usage of transaction')
    const thirdLogMessage = createSuccessLogMessage('Analyzer initialized')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))
    const addThirdLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(thirdLogMessage))

    const expectedState = {
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: analyzerStagesAdapter.updateOne(initialState[StoreKeys.ANALYZER].stages, {
          id: AnalyzerStages.INITIALIZING_ANALYZER,
          changes: successStage,
        }),
        logMessages: mockLogsInAnalyer(),
      },
      [StoreKeys.TRANSACTION_CONFIG]: {
        ...initialState[StoreKeys.TRANSACTION_CONFIG],
        transactionHash: TRANSACTION_HASH,
        gasUsed: GAS_USED.toString(),
        chainId: CHAIN_ID,
      },
    }

    const { storeState } = await expectSaga(
      initializeTransactionProcessingSaga,
      analyzerActions.initializeTransactionProcessing({ transactionHash: TRANSACTION_HASH, chainId: CHAIN_ID }),
    )
      .withReducer(combineReducers({ [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer, [StoreKeys.ANALYZER]: analyzerReducer }))
      .provide([[matchers.call.fn(estimateGasUsage), BigInt(1000)]])
      .withState(initialState)
      .put(analyzerActions.updateStage(inProgresStage))
      .put.like({ action: addFirstLogAction })
      .put(transactionConfigActions.setChainId({ chainId: CHAIN_ID }))
      .put(transactionConfigActions.setTransactionHash({ transactionHash: TRANSACTION_HASH }))
      .put.like({ action: addSecondLogAction })
      .call(estimateGasUsage, CHAIN_ID, TRANSACTION_HASH)
      .put(transactionConfigActions.setGasUsed({ gasUsed: GAS_USED.toString() }))
      .put(analyzerActions.updateStage(successStage))
      .put.like({ action: addThirdLogAction })
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage, thirdLogMessage])
  })
})

import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { ChainId } from '@evm-debuger/types'
import { combineReducers } from 'redux'

import { transactionInfoActions, transactionInfoReducer } from '../../transactionInfo.slice'
import { transactionConfigReducer } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerActions, analyzerReducer } from '../../../analyzer/analyzer.slice'
import { TransactionConfigState } from '../../../transactionConfig/transactionConfig.state'
import { TransactionInfoState } from '../../transactionInfo.state'
import { AnalyzerState, analyzerStagesAdapter } from '../../../analyzer/analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { formatTransactionReposne } from '../../transactionInfo.utils'
import type { TEthersTransactionReposnse } from '../../transactionInfo.types'

import { fetchTransactionInfoSaga, getTransactionInfo } from './fetchTransactionInfo.saga'

const TRANSACTION_HASH = '0x1234567890'
const CHAIN_ID = ChainId.mainnet

const transactionInfo: TEthersTransactionReposnse = {
  value: BigInt(0),
  to: '0x1234567890',
  nonce: 0,
  hash: TRANSACTION_HASH,
  gasLimit: BigInt(60599),
  from: '0x1234567890',
  data: '0x1234567890',
  chainId: BigInt(CHAIN_ID),
  blockNumber: 0,
  blockHash: '0x1234567890',
}

describe('fetchTransactionInfoSaga', () => {
  it('should fetch transaction info', async () => {
    const initialState = {
      [StoreKeys.TRANSACTION_INFO]: { ...new TransactionInfoState() },
      [StoreKeys.TRANSACTION_CONFIG]: { ...new TransactionConfigState(), transactionHash: TRANSACTION_HASH, chainId: CHAIN_ID },
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
    }
    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO }

    const firstLogMessage = createInfoLogMessage('Fetching transaction data')
    const secondLogMessage = createSuccessLogMessage('Transaction data fetched')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.TRANSACTION_INFO]: formatTransactionReposne(transactionInfo),
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: analyzerStagesAdapter.updateOne(initialState[StoreKeys.ANALYZER].stages, {
          id: AnalyzerStages.FETCHING_TRANSACTION_INFO,
          changes: successStage,
        }),
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(fetchTransactionInfoSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.TRANSACTION_INFO]: transactionInfoReducer,
          [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
        }),
      )
      .withState(initialState)
      .provide([[matchers.call.fn(getTransactionInfo), formatTransactionReposne(transactionInfo)]])
      .put.like({ action: addFirstLogAction })
      .put(analyzerActions.updateStage(inProgresStage))
      .call(getTransactionInfo, TRANSACTION_HASH, CHAIN_ID)
      .put(transactionInfoActions.setTransactionInfo(formatTransactionReposne(transactionInfo)))
      .put(analyzerActions.updateStage(successStage))
      .put.like({ action: addSecondLogAction })
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

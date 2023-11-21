import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { ChainId } from '@evm-debuger/types'
import { BigNumber } from 'ethers'
import { combineReducers } from 'redux'

import { transactionInfoActions, transactionInfoReducer } from '../../transactionInfo.slice'
import { transactionConfigReducer } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerActions, analyzerReducer } from '../../../analyzer/analyzer.slice'
import { TransactionConfigState } from '../../../transactionConfig/transactionConfig.state'
import { TransactionInfoState } from '../../transactionInfo.state'
import { AnalyzerState } from '../../../analyzer/analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { createLogMessageActionForTests } from '../../../../helpers/sagaTests'
import { formatTransactionReposne } from '../../transactionInfo.utils'
import type { TEthersTransactionReposnse } from '../../transactionInfo.types'
import { store } from '../../../store'

import { fetchTransactionInfoSaga, getTransactionInfo } from './fetchTransactionInfo.saga'

describe('fetchTransactionInfoSaga', () => {
  it('should fetch transaction info', async () => {
    const TRANSACTION_HASH = '0x1234567890'
    const CHAIN_ID = ChainId.mainnet

    const transactionInfo: TEthersTransactionReposnse = {
      wait: () => Promise.resolve(undefined),
      value: BigNumber.from(0),
      to: '0x1234567890',
      nonce: 0,
      hash: TRANSACTION_HASH,
      gasPrice: BigNumber.from(0),
      gasLimit: BigNumber.from(0),
      from: '0x1234567890',
      data: '0x1234567890',
      confirmations: 0,
      chainId: CHAIN_ID,
      blockNumber: 0,
      blockHash: '0x1234567890',
    }

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
      [StoreKeys.TRANSACTION_INFO]: formatTransactionReposne(transactionInfo),
      [StoreKeys.TRANSACTION_CONFIG]: initialState[StoreKeys.TRANSACTION_CONFIG],
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: {
          ids: [...initialState[StoreKeys.ANALYZER].stages.ids],
          entities: {
            ...initialState[StoreKeys.ANALYZER].stages.entities,
            [AnalyzerStages.FETCHING_TRANSACTION_INFO]: {
              stageStatus: AnalyzerStagesStatus.SUCCESS,
              stageName: AnalyzerStages.FETCHING_TRANSACTION_INFO,
            },
          },
        },
        logMessages: {
          ids: expect.any(Array),
          entities: expect.any(Object),
        },
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
    expect(storeState[StoreKeys.ANALYZER].logMessages.ids).toEqual([expect.any(String), expect.any(String)])
    expect(Object.values(storeState[StoreKeys.ANALYZER].logMessages.entities)).toEqual([
      {
        ...firstLogMessage,
        timestamp: expect.any(Number),
        identifier: expect.any(String),
      },
      {
        ...secondLogMessage,
        timestamp: expect.any(Number),
        identifier: expect.any(String),
      },
    ])
  })
})

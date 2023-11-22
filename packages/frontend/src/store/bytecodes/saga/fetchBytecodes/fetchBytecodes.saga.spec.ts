import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { ChainId } from '@evm-debuger/types'
import { BigNumber } from 'ethers'
import { combineReducers } from 'redux'

import { transactionConfigReducer } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerActions, analyzerReducer } from '../../../analyzer/analyzer.slice'
import { TransactionConfigState } from '../../../transactionConfig/transactionConfig.state'
import { AnalyzerState } from '../../../analyzer/analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import {
  createLogMessageActionForTests,
  mockLogsInAnalyer,
  testLogMessages,
  updateAnalyzerStageStatus,
} from '../../../../helpers/sagaTests'
import { bytecodesActions, bytecodesAdapter, bytecodesReducer } from '../../bytecodes.slice'
import type { TBytecodes } from '../../bytecodes.types'

import { fetchBytecode, fetchBytecodesSaga } from './fetchBytecodes.saga'

const TRANSACTION_HASH = '0x1234567890'
const CHAIN_ID = ChainId.mainnet

const BYTECODE_MISSING: TBytecodes = {
  disassembled: null,
  bytecode: null,
  address: '0x1234567890',
}

const BYTECODE: TBytecodes = {
  ...BYTECODE_MISSING,
  bytecode: '0x1234567890',
}

describe('fetchBytecodesSaga', () => {
  it('should fetch bytecodes', async () => {
    const initialState = {
      [StoreKeys.BYTECODES]: {
        ...bytecodesAdapter.getInitialState(),
        ids: [BYTECODE_MISSING.address],
        entities: { [BYTECODE_MISSING.address]: BYTECODE_MISSING },
      },
      [StoreKeys.TRANSACTION_CONFIG]: { ...new TransactionConfigState(), transactionHash: TRANSACTION_HASH, chainId: CHAIN_ID },
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
    }

    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.FETCHING_BYTECODES }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_BYTECODES }

    const firstLogMessage = createInfoLogMessage('Fetching bytecodes')
    const secondLogMessage = createSuccessLogMessage('Fetching bytecodes success')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))

    const expectedState = {
      [StoreKeys.BYTECODES]: {
        ...initialState[StoreKeys.BYTECODES],
        entities: {
          ...initialState[StoreKeys.BYTECODES].entities,
          [BYTECODE.address]: BYTECODE,
        },
      },
      [StoreKeys.TRANSACTION_CONFIG]: initialState[StoreKeys.TRANSACTION_CONFIG],
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: updateAnalyzerStageStatus(
          AnalyzerStages.FETCHING_BYTECODES,
          AnalyzerStagesStatus.SUCCESS,
          initialState[StoreKeys.ANALYZER],
        ),
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(fetchBytecodesSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.BYTECODES]: bytecodesReducer,
          [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
        }),
      )
      .withState(initialState)
      .provide([[matchers.call.fn(fetchBytecode), BYTECODE.bytecode]])
      .put.like({ action: addFirstLogAction })
      .put(analyzerActions.updateStage(inProgresStage))
      .call(fetchBytecode, CHAIN_ID, BYTECODE_MISSING.address)
      .put(bytecodesActions.updateBytecode({ id: BYTECODE.address, changes: { bytecode: BYTECODE.bytecode } }))
      .take(bytecodesActions.updateBytecode)
      .put(analyzerActions.updateStage(successStage))
      .put.like({ action: addSecondLogAction })
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

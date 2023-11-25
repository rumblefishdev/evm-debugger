import { expectSaga } from 'redux-saga-test-plan'
import { combineReducers } from 'redux'
import { ChainId } from '@evm-debuger/types'

import { transactionConfigActions, transactionConfigReducer } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerActions, analyzerReducer } from '../../analyzer.slice'
import { StoreKeys } from '../../../store.keys'
import { transactionInfoActions, transactionInfoReducer } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions, structLogsAdapter, structLogsReducer } from '../../../structlogs/structlogs.slice'
import { contractNamesReducer, contractNamesAdapter, contractNamesActions } from '../../../contractNames/contractNames.slice'
import { bytecodesReducer, bytecodesAdapter, bytecodesActions } from '../../../bytecodes/bytecodes.slice'
import { sourceCodesReducer, sourceCodesAdapter, sourceCodesActions } from '../../../sourceCodes/sourceCodes.slice'
import { sourceMapsReducer, sourceMapsAdapter, sourceMapsActions } from '../../../sourceMaps/sourceMaps.slice'
import { abisReducer, abisAdapter, abisActions } from '../../../abis/abis.slice'
import { instructionsReducer, instructionsAdapter, instructionsActions } from '../../../instructions/instructions.slice'
import { traceLogsReducer, traceLogsAdapter, traceLogsActions } from '../../../traceLogs/traceLogs.slice'
import { sighashReducer, sighashAdapter, sighashActions } from '../../../sighash/sighash.slice'
import { TransactionConfigState } from '../../../transactionConfig/transactionConfig.state'
import { TransactionInfoState } from '../../../transactionInfo/transactionInfo.state'
import { AnalyzerState } from '../../analyzer.state'
import { mockTransactionInfoState } from '../../../transactionInfo/transactionInfo.mock'
import { createMockedStructLogs } from '../../../structlogs/structlogs.mock'
import { createMockedContractNames } from '../../../contractNames/contractNames.mock'
import { createMockedBytecodes } from '../../../bytecodes/bytecodes.mock'
import { createMockedSourceCodes } from '../../../sourceCodes/sourceCodes.mock'
import { createMockedSourceMaps } from '../../../sourceMaps/sourceMaps.mock'
import { createMockedAbis } from '../../../abis/abi.mock'
import { createMockedInstructions } from '../../../instructions/instructions.mock'
import { createMockedTracelogs } from '../../../traceLogs/traceLogs.mock'
import { createMockedSighashes } from '../../../sighash/sighash.mock'
import { createDirtyAnalyerState } from '../../analyzer.mock'

import { resetAnalyzerSaga } from './resetAnalyzer.saga'

const mockedTransactionConfig = { transactionHash: '0x1234567890', s3Location: 's3Location', chainId: ChainId.mainnet }
const mockedTransactionInfo = mockTransactionInfoState()
const mockedStructlogs = createMockedStructLogs(4)
const mockedAnalyzerState = createDirtyAnalyerState()
const mockedContractNames = createMockedContractNames(4)
const mockedBytecodes = createMockedBytecodes(4)
const mockedSourceCodes = createMockedSourceCodes(4)
const mockedSourceMaps = createMockedSourceMaps(4)
const mockedAbis = createMockedAbis(4)
const mockedInstructions = createMockedInstructions(4)
const mockedTracelogs = createMockedTracelogs(4)
const mockedSighashes = createMockedSighashes(4)

describe('resetAnalyzerSaga', () => {
  it('should clear analyzer information', async () => {
    const initialState = {
      [StoreKeys.TRANSACTION_INFO]: { ...new TransactionInfoState() },
      [StoreKeys.TRANSACTION_CONFIG]: { ...new TransactionConfigState() },
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
      [StoreKeys.STRUCT_LOGS]: structLogsAdapter.getInitialState(),
      [StoreKeys.CONTRACT_NAMES]: contractNamesAdapter.getInitialState(),
      [StoreKeys.BYTECODES]: bytecodesAdapter.getInitialState(),
      [StoreKeys.SOURCE_CODES]: sourceCodesAdapter.getInitialState(),
      [StoreKeys.SOURCE_MAPS]: sourceMapsAdapter.getInitialState(),
      [StoreKeys.ABIS]: abisAdapter.getInitialState(),
      [StoreKeys.INSTRUCTIONS]: instructionsAdapter.getInitialState(),
      [StoreKeys.TRACE_LOGS]: traceLogsAdapter.getInitialState(),
      [StoreKeys.SIGHASH]: sighashAdapter.getInitialState(),
    }

    const dirtyState = {
      [StoreKeys.TRANSACTION_INFO]: { ...mockedTransactionInfo },
      [StoreKeys.TRANSACTION_CONFIG]: { ...mockedTransactionConfig },
      [StoreKeys.ANALYZER]: { ...mockedAnalyzerState },
      [StoreKeys.STRUCT_LOGS]: structLogsAdapter.setAll(initialState[StoreKeys.STRUCT_LOGS], mockedStructlogs),
      [StoreKeys.CONTRACT_NAMES]: contractNamesAdapter.setAll(initialState[StoreKeys.CONTRACT_NAMES], mockedContractNames),
      [StoreKeys.BYTECODES]: bytecodesAdapter.setAll(initialState[StoreKeys.BYTECODES], mockedBytecodes),
      [StoreKeys.SOURCE_CODES]: sourceCodesAdapter.setAll(initialState[StoreKeys.SOURCE_CODES], mockedSourceCodes),
      [StoreKeys.SOURCE_MAPS]: sourceMapsAdapter.setAll(initialState[StoreKeys.SOURCE_MAPS], mockedSourceMaps),
      [StoreKeys.ABIS]: abisAdapter.setAll(initialState[StoreKeys.ABIS], mockedAbis),
      [StoreKeys.INSTRUCTIONS]: instructionsAdapter.setAll(initialState[StoreKeys.INSTRUCTIONS], mockedInstructions),
      [StoreKeys.TRACE_LOGS]: traceLogsAdapter.setAll(initialState[StoreKeys.TRACE_LOGS], mockedTracelogs),
      [StoreKeys.SIGHASH]: sighashAdapter.setAll(initialState[StoreKeys.SIGHASH], mockedSighashes),
    }

    await expectSaga(resetAnalyzerSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.TRANSACTION_INFO]: transactionInfoReducer,
          [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
          [StoreKeys.STRUCT_LOGS]: structLogsReducer,
          [StoreKeys.CONTRACT_NAMES]: contractNamesReducer,
          [StoreKeys.BYTECODES]: bytecodesReducer,
          [StoreKeys.SOURCE_CODES]: sourceCodesReducer,
          [StoreKeys.SOURCE_MAPS]: sourceMapsReducer,
          [StoreKeys.ABIS]: abisReducer,
          [StoreKeys.INSTRUCTIONS]: instructionsReducer,
          [StoreKeys.TRACE_LOGS]: traceLogsReducer,
          [StoreKeys.SIGHASH]: sighashReducer,
        }),
      )
      .withState(dirtyState)
      .put(analyzerActions.clearAnalyzerInformation())
      .put(transactionConfigActions.clearTransactionConfig())
      .put(transactionInfoActions.clearTransactionInfo())
      .put(structLogsActions.clearStructLogs())
      .put(contractNamesActions.clearContractNames())
      .put(bytecodesActions.clearBytecodes())
      .put(sourceCodesActions.clearSourceCodes())
      .put(sourceMapsActions.clearSourceMaps())
      .put(abisActions.clearAbis())
      .put(instructionsActions.clearInstructions())
      .put(traceLogsActions.clearTraceLogs())
      .put(sighashActions.clearSighashes())
      .hasFinalState(initialState)
      .run()
  })
})

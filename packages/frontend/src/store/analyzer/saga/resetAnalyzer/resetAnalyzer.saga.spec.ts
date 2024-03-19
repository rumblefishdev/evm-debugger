import { expectSaga } from 'redux-saga-test-plan'
import { combineReducers } from 'redux'
import { ChainId } from '@evm-debuger/types'

import { transactionConfigActions, transactionConfigReducer } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerActions, analyzerReducer } from '../../analyzer.slice'
import { StoreKeys } from '../../../store.keys'
import { transactionInfoActions, transactionInfoReducer } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions, structLogsAdapter, structLogsReducer } from '../../../structlogs/structlogs.slice'
import { instructionsReducer, instructionsAdapter, instructionsActions } from '../../../instructions/instructions.slice'
import { traceLogsReducer, traceLogsAdapter, traceLogsActions } from '../../../traceLogs/traceLogs.slice'
import { sighashReducer, sighashAdapter, sighashActions } from '../../../sighash/sighash.slice'
import { TransactionConfigState } from '../../../transactionConfig/transactionConfig.state'
import { TransactionInfoState } from '../../../transactionInfo/transactionInfo.state'
import { AnalyzerState } from '../../analyzer.state'
import { mockTransactionInfoState } from '../../../transactionInfo/transactionInfo.mock'
import { createMockedStructLogs } from '../../../structlogs/structlogs.mock'
import { createMockedTracelogs } from '../../../traceLogs/traceLogs.mock'
import { createMockedSighashes } from '../../../sighash/sighash.mock'
import { createDirtyAnalyerState } from '../../analyzer.mock'
import { createMockedContractBaseWithName } from '../../../contractBase/contractBase.mock'
import { createMockedContractRawData } from '../../../contractRaw/contractRaw.mock'
import { contractBaseActions, contractBaseAdapter, contractBaseReducer } from '../../../contractBase/contractBase.slice'
import { contractRawActions, contractRawAdapter, contractRawReducer } from '../../../contractRaw/contractRaw.slice'
import { createMockedSourceFiles } from '../../../sourceFiles/sourceFiles.mock'
import { sourceFilesActions, sourceFilesAdapter, sourceFilesReducer } from '../../../sourceFiles/sourceFiles.slice'
import { createMockedInstruction } from '../../../instructions/instructions.mock'

import { resetAnalyzerSaga } from './resetAnalyzer.saga'

const mockedTransactionConfig = { transactionHash: '0x1234567890', s3Location: 's3Location', chainId: ChainId.mainnet }
const mockedTransactionInfo = mockTransactionInfoState()
const mockedStructlogs = createMockedStructLogs(4)
const mockedAnalyzerState = createDirtyAnalyerState()

const mockedContractBase = [
  createMockedContractBaseWithName(),
  createMockedContractBaseWithName(),
  createMockedContractBaseWithName(),
  createMockedContractBaseWithName(),
]

const mockedSourceFiles = createMockedSourceFiles()

const mockedContractRaw = mockedContractBase.map((contract) => createMockedContractRawData(contract.address))

const mockedInstructions = [createMockedInstruction(), createMockedInstruction(), createMockedInstruction(), createMockedInstruction()]
const mockedTracelogs = createMockedTracelogs(4)
const mockedSighashes = createMockedSighashes(4)

describe('resetAnalyzerSaga', () => {
  it('should clear analyzer information', async () => {
    const initialState = {
      [StoreKeys.TRANSACTION_INFO]: { ...new TransactionInfoState() },
      [StoreKeys.TRANSACTION_CONFIG]: { ...new TransactionConfigState() },
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
      [StoreKeys.STRUCT_LOGS]: structLogsAdapter.getInitialState(),
      [StoreKeys.CONTRACT_BASE]: contractBaseAdapter.getInitialState(),
      [StoreKeys.CONTRACT_RAW]: contractRawAdapter.getInitialState(),
      [StoreKeys.INSTRUCTIONS]: instructionsAdapter.getInitialState(),
      [StoreKeys.TRACE_LOGS]: traceLogsAdapter.getInitialState(),
      [StoreKeys.SIGHASH]: sighashAdapter.getInitialState(),
      [StoreKeys.SOURCE_FILES]: sourceFilesAdapter.getInitialState(),
    }

    const dirtyState = {
      [StoreKeys.TRANSACTION_INFO]: { ...mockedTransactionInfo },
      [StoreKeys.TRANSACTION_CONFIG]: { ...mockedTransactionConfig },
      [StoreKeys.ANALYZER]: { ...mockedAnalyzerState },
      [StoreKeys.CONTRACT_BASE]: contractBaseAdapter.setAll(contractBaseAdapter.getInitialState(), mockedContractBase),
      [StoreKeys.CONTRACT_RAW]: contractRawAdapter.setAll(contractRawAdapter.getInitialState(), mockedContractRaw),
      [StoreKeys.STRUCT_LOGS]: structLogsAdapter.setAll(initialState[StoreKeys.STRUCT_LOGS], mockedStructlogs),
      [StoreKeys.INSTRUCTIONS]: instructionsAdapter.setAll(initialState[StoreKeys.INSTRUCTIONS], mockedInstructions),
      [StoreKeys.TRACE_LOGS]: traceLogsAdapter.setAll(initialState[StoreKeys.TRACE_LOGS], mockedTracelogs),
      [StoreKeys.SIGHASH]: sighashAdapter.setAll(initialState[StoreKeys.SIGHASH], mockedSighashes),
      [StoreKeys.SOURCE_FILES]: sourceFilesAdapter.setOne(initialState[StoreKeys.SOURCE_FILES], mockedSourceFiles),
    }

    await expectSaga(resetAnalyzerSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.TRANSACTION_INFO]: transactionInfoReducer,
          [StoreKeys.TRANSACTION_CONFIG]: transactionConfigReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
          [StoreKeys.STRUCT_LOGS]: structLogsReducer,
          [StoreKeys.CONTRACT_BASE]: contractBaseReducer,
          [StoreKeys.CONTRACT_RAW]: contractRawReducer,
          [StoreKeys.INSTRUCTIONS]: instructionsReducer,
          [StoreKeys.TRACE_LOGS]: traceLogsReducer,
          [StoreKeys.SIGHASH]: sighashReducer,
          [StoreKeys.SOURCE_FILES]: sourceFilesReducer,
        }),
      )
      .withState(dirtyState)
      .put(analyzerActions.clearAnalyzerInformation())
      .put(transactionConfigActions.clearTransactionConfig())
      .put(transactionInfoActions.clearTransactionInfo())
      .put(structLogsActions.clearStructLogs())
      .put(contractBaseActions.clearContractsBase())
      .put(contractRawActions.clearContractsRaw())
      .put(sourceFilesActions.clearContractsSourceFiles())
      .put(instructionsActions.clearInstructions())
      .put(traceLogsActions.clearTraceLogs())
      .put(sighashActions.clearSighashes())
      .hasFinalState(initialState)
      .run()
  })
})

import { expectSaga } from 'redux-saga-test-plan'
import { combineReducers } from 'redux'

import { transactionConfigActions, transactionConfigReducer } from '../../../transactionConfig/transactionConfig.slice'
import { analyzerReducer } from '../../analyzer.slice'
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

import { clearAnalyzerInformationSaga } from './clearAnalyzerInformation.saga'

describe('clearAnalyzerInformationSaga', () => {
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

    const dirtyState = { ...initialState }
    dirtyState[StoreKeys.TRANSACTION_INFO] = {
      ...initialState[StoreKeys.TRANSACTION_INFO],
      hash: '0x1234567890',
      chainId: 1,
    }
    dirtyState[StoreKeys.TRANSACTION_CONFIG] = {
      ...initialState[StoreKeys.TRANSACTION_CONFIG],
      transactionHash: '0x1234567890',
      chainId: 1,
    }
    dirtyState[StoreKeys.STRUCT_LOGS] = {
      ...initialState[StoreKeys.STRUCT_LOGS],
      ids: [0],
      entities: {
        0: {
          storage: {},
          stack: [],
          pc: 0,
          op: 'ADD',
          memory: [],
          index: 0,
          gasCost: 0,
          gas: 0,
          depth: 0,
        },
      },
    }

    dirtyState[StoreKeys.CONTRACT_NAMES] = {
      ...initialState[StoreKeys.CONTRACT_NAMES],
      ids: ['0x1234567890'],
      entities: {
        '0x1234567890': { contractName: 'ContractName', address: '0x1234567890' },
      },
    }

    dirtyState[StoreKeys.BYTECODES] = {
      ...initialState[StoreKeys.BYTECODES],
      ids: ['0x1234567890'],
      entities: {
        '0x1234567890': { disassembled: null, bytecode: '0x1234567890', address: '0x1234567890' },
      },
    }

    dirtyState[StoreKeys.SOURCE_CODES] = {
      ...initialState[StoreKeys.SOURCE_CODES],
      ids: ['0x1234567890'],
      entities: {
        '0x1234567890': { sourceCode: 'SourceCode', address: '0x1234567890' },
      },
    }

    dirtyState[StoreKeys.SOURCE_MAPS] = {
      ...initialState[StoreKeys.SOURCE_MAPS],
      ids: ['0x1234567890'],
      entities: {
        '0x1234567890': {
          fileName: 'FileName',
          deployedBytecode: { sourceMap: '', opcodes: '', object: '' },
          contractName: 'ContractName',
          bytecode: { sourceMap: '', opcodes: '', object: '' },
          address: '0x1234567890',
        },
      },
    }

    dirtyState[StoreKeys.ABIS] = {
      ...initialState[StoreKeys.ABIS],
      ids: ['0x1234567890'],
      entities: {
        '0x1234567890': { address: '0x1234567890', abi: [] },
      },
    }

    dirtyState[StoreKeys.INSTRUCTIONS] = {
      ...initialState[StoreKeys.INSTRUCTIONS],
      ids: ['0x1234567890'],
      entities: {
        '0x1234567890': { instructions: [], address: '0x1234567890' },
      },
    }

    dirtyState[StoreKeys.TRACE_LOGS] = {
      ...initialState[StoreKeys.TRACE_LOGS],
      ids: ['0x1234567890'],
      entities: {
        '0x1234567890': {
          value: '0x1234567890',
          type: 'CALL',
          startIndex: 0,
          stackTrace: [],
          pc: 0,
          passedGas: 0,
          output: '0x1234567890',
          input: '0x1234567890',
          index: 0,
          id: '0x1234567890',
          gasCost: 0,
          events: [],
          depth: 0,
          address: '0x1234567890',
        },
      },
    }

    dirtyState[StoreKeys.SIGHASH] = {
      ...initialState[StoreKeys.SIGHASH],
      ids: ['0x1234567890'],
      entities: {
        '0x1234567890': { sighash: '0x1234567890', fragment: {}, found: false, addresses: new Set() },
      },
    }

    await expectSaga(clearAnalyzerInformationSaga)
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

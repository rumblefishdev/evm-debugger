import { create } from 'domain'

import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'

import { analyzerActions, analyzerReducer } from '../../analyzer.slice'
import { AnalyzerState, analyzerStagesAdapter } from '../../analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { sighashActions, sighashAdapter, sighashReducer } from '../../../sighash/sighash.slice'
import { transactionInfoActions, transactionInfoReducer } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions, structLogsAdapter, structLogsReducer } from '../../../structlogs/structlogs.slice'
import { mockTransactionInfoState } from '../../../transactionInfo/transactionInfo.mock'
import { createMockedStructLogs } from '../../../structlogs/structlogs.mock'
import { createMockedSighashes } from '../../../sighash/sighash.mock'
import { instructionsActions, instructionsAdapter, instructionsReducer } from '../../../instructions/instructions.slice'
import { traceLogsActions, traceLogsAdapter, traceLogsReducer } from '../../../traceLogs/traceLogs.slice'
import { activeBlockActions, activeBlockReducer } from '../../../activeBlock/activeBlock.slice'
import { createMockedTracelogs } from '../../../traceLogs/traceLogs.mock'
import { createMockedInstruction } from '../../../instructions/instructions.mock'
import { activeLineActions, activeLineReducer } from '../../../activeLine/activeLine.slice'
import { ActiveLineState } from '../../../activeLine/activeLine.state'
import { createMockedStructlogsPerActiveLine } from '../../../activeLine/activeLine.mock'
import { sourceFilesActions, sourceFilesAdapter, sourceFilesReducer } from '../../../sourceFiles/sourceFiles.slice'
import { contractRawActions, contractRawReducer } from '../../../contractRaw/contractRaw.slice'
import { contractBaseActions, contractBaseAdapter, contractBaseReducer } from '../../../contractBase/contractBase.slice'
import { createMockedSourceFiles } from '../../../sourceFiles/sourceFiles.mock'
import {
  disassembledBytecodesActions,
  disassembledBytecodesAdapter,
  disassembledBytecodesReducer,
} from '../../../disassembledBytecodes/disassembledBytecodes.slice'
import { createMockedContractBaseWithName } from '../../../contractBase/contractBase.mock'
import { createMockedContractRawData } from '../../../contractRaw/contractRaw.mock'
import { createMockedBytecode } from '../../../disassembledBytecodes/disassembledBytecodes.mock'

import { getContractsRawData, runAnalyzer, runAnalyzerSaga } from './runAnalyzer.saga'

const mockedTransactionInfo = mockTransactionInfoState()
const mockedStructlogs = createMockedStructLogs(1)

const mockedBytecodes = [createMockedBytecode(), createMockedBytecode()]
const mockedSighashes = createMockedSighashes(1)

const mockedContractBase = createMockedContractBaseWithName()
const mockedContractRaw = createMockedContractRawData(mockedContractBase.address)
const mockedSourceFiles = [createMockedSourceFiles(), createMockedSourceFiles()]

const mockedInstructions = [createMockedInstruction(), createMockedInstruction()]
const mockedStructlogsPerLine = createMockedStructlogsPerActiveLine('0x0')

const mockedTraceLogs = createMockedTracelogs(1)

const mockedActiveBlock = { ...mockedTraceLogs[0] }

describe('runAnalyzer', () => {
  it('should run analyzer', async () => {
    const initialState = {
      [StoreKeys.SIGHASH]: sighashAdapter.getInitialState(),
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
      [StoreKeys.TRANSACTION_INFO]: {},
      [StoreKeys.STRUCT_LOGS]: structLogsAdapter.getInitialState(),
      [StoreKeys.CONTRACT_BASE]: contractBaseAdapter.getInitialState(),
      [StoreKeys.CONTRACT_RAW]: contractBaseAdapter.getInitialState(),
      [StoreKeys.DISASSEMBLED_BYTECODES]: disassembledBytecodesAdapter.getInitialState(),
      [StoreKeys.SOURCE_FILES]: sourceFilesAdapter.getInitialState(),
      [StoreKeys.INSTRUCTIONS]: instructionsAdapter.getInitialState(),
      [StoreKeys.TRACE_LOGS]: traceLogsAdapter.getInitialState(),
      [StoreKeys.ACTIVE_BLOCK]: null,
      [StoreKeys.ACTIVE_LINE]: new ActiveLineState(null, null),
    }

    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.RUNNING_ANALYZER }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.RUNNING_ANALYZER }

    const firstLogMessage = createInfoLogMessage('Running analyzer')
    const secondLogMessage = createSuccessLogMessage('Analyzer finished')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.TRANSACTION_INFO]: mockedTransactionInfo,
      [StoreKeys.STRUCT_LOGS]: structLogsAdapter.addMany(initialState[StoreKeys.STRUCT_LOGS], mockedStructlogs),
      [StoreKeys.TRACE_LOGS]: traceLogsAdapter.addMany(initialState[StoreKeys.TRACE_LOGS], mockedTraceLogs),
      [StoreKeys.ACTIVE_BLOCK]: mockedActiveBlock,
      [StoreKeys.SIGHASH]: sighashAdapter.addMany(initialState[StoreKeys.SIGHASH], mockedSighashes),
      [StoreKeys.CONTRACT_BASE]: contractBaseAdapter.addOne(initialState[StoreKeys.CONTRACT_BASE], mockedContractBase),
      [StoreKeys.CONTRACT_RAW]: contractBaseAdapter.addOne(initialState[StoreKeys.CONTRACT_RAW], mockedContractRaw),
      [StoreKeys.SOURCE_FILES]: sourceFilesAdapter.addMany(initialState[StoreKeys.SOURCE_FILES], mockedSourceFiles),
      [StoreKeys.INSTRUCTIONS]: instructionsAdapter.addMany(initialState[StoreKeys.INSTRUCTIONS], mockedInstructions),
      [StoreKeys.ACTIVE_LINE]: { ...initialState[StoreKeys.ACTIVE_LINE], structlogsPerActiveLine: mockedStructlogsPerLine },
      [StoreKeys.DISASSEMBLED_BYTECODES]: disassembledBytecodesAdapter.addMany(
        initialState[StoreKeys.DISASSEMBLED_BYTECODES],
        mockedBytecodes,
      ),
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: analyzerStagesAdapter.updateOne(initialState[StoreKeys.ANALYZER].stages, {
          id: AnalyzerStages.RUNNING_ANALYZER,
          changes: successStage,
        }),
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(runAnalyzerSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.TRANSACTION_INFO]: transactionInfoReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
          [StoreKeys.STRUCT_LOGS]: structLogsReducer,
          [StoreKeys.CONTRACT_BASE]: contractBaseReducer,
          [StoreKeys.CONTRACT_RAW]: contractRawReducer,
          [StoreKeys.SOURCE_FILES]: sourceFilesReducer,
          [StoreKeys.SIGHASH]: sighashReducer,
          [StoreKeys.INSTRUCTIONS]: instructionsReducer,
          [StoreKeys.TRACE_LOGS]: traceLogsReducer,
          [StoreKeys.ACTIVE_BLOCK]: activeBlockReducer,
          [StoreKeys.ACTIVE_LINE]: activeLineReducer,
          [StoreKeys.DISASSEMBLED_BYTECODES]: disassembledBytecodesReducer,
        }),
      )
      .provide([
        [
          matchers.call.fn(runAnalyzer),
          {
            transactionInfo: mockedTransactionInfo,
            traceLogs: mockedTraceLogs,
            structLogs: mockedStructlogs,
            sighashes: mockedSighashes,
            disassembledBytecodes: mockedBytecodes,
            contractsStructLogsPerLine: mockedStructlogsPerLine,
            contractsSourceFiles: mockedSourceFiles,
            contractsInstructions: mockedInstructions,
            contractsDisassembledBytecodes: mockedBytecodes,
            contractsBaseData: [mockedContractBase],
          },
        ],
        [matchers.call.fn(getContractsRawData), { [mockedContractRaw.address]: mockedContractRaw }],
      ])
      .withState(initialState)
      .put.like({ action: addFirstLogAction })
      .put(analyzerActions.updateStage(inProgresStage))
      .call(runAnalyzer)
      .call(getContractsRawData)
      .put(transactionInfoActions.setTransactionInfo(mockedTransactionInfo))
      .put(structLogsActions.loadStructLogs(mockedStructlogs))
      .put(traceLogsActions.addTraceLogs(mockedTraceLogs))
      .put(activeBlockActions.loadActiveBlock(mockedActiveBlock))
      .put(sighashActions.addSighashes(mockedSighashes))
      .put(contractBaseActions.loadContractsBaseData([mockedContractBase]))
      .put(contractRawActions.loadContractsRawData({ [mockedContractRaw.address]: mockedContractRaw }))
      .put(disassembledBytecodesActions.loadBytecodes(mockedBytecodes))
      .put(sourceFilesActions.loadContractsSourceFiles(mockedSourceFiles))
      .put(instructionsActions.addInstructions(mockedInstructions))
      .put(activeLineActions.setStructlogsPerActiveLine(mockedStructlogsPerLine))
      .put.like({ action: addSecondLogAction })
      .put(analyzerActions.updateStage(successStage))
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

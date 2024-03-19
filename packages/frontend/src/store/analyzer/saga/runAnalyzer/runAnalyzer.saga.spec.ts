import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'
import type { TStepInstrctionsMap } from '@evm-debuger/types'

import { analyzerActions, analyzerReducer } from '../../analyzer.slice'
import { AnalyzerState, analyzerStagesAdapter } from '../../analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { bytecodesActions, bytecodesAdapter, bytecodesReducer } from '../../../disassembledBytecodes/bytecodes.slice'
import { sighashActions, sighashAdapter, sighashReducer } from '../../../sighash/sighash.slice'
import { contractsActions, contractsAdapter, contractsReducer } from '../../../contracts/contracts.slice'
import { transactionInfoReducer } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsActions, structLogsAdapter, structLogsReducer } from '../../../structlogs/structlogs.slice'
import { mockTransactionInfoState } from '../../../transactionInfo/transactionInfo.mock'
import { createMockedStructLogs } from '../../../structlogs/structlogs.mock'
import { createMockedBytecodes } from '../../../disassembledBytecodes/bytecodes.mock'
import { createMockedSighashes } from '../../../sighash/sighash.mock'
import { createEmptyMockedContract, createMockedContract } from '../../../contracts/contracts.mock'
import { sourceMapsAdapter, sourceMapsReducer } from '../../../sourceMaps/sourceMaps.slice'
import { sourceCodesAdapter, sourceCodesReducer } from '../../../sourceCodes/sourceCodes.slice'
import { abisAdapter, abisReducer } from '../../../abis/abis.slice'
import { instructionsActions, instructionsAdapter, instructionsReducer } from '../../../instructions/instructions.slice'
import { traceLogsActions, traceLogsAdapter, traceLogsReducer } from '../../../traceLogs/traceLogs.slice'
import { activeBlockActions, activeBlockReducer } from '../../../activeBlock/activeBlock.slice'
import { createMockedSourceMaps } from '../../../sourceMaps/sourceMaps.mock'
import { createMockedSourceCodes } from '../../../sourceCodes/sourceCodes.mock'
import { createMockedAbis } from '../../../abis/abi.mock'
import { createMockedTracelogs } from '../../../traceLogs/traceLogs.mock'
import { createMockedInstruction } from '../../../instructions/instructions.mock'
import { activeLineActions, activeLineReducer } from '../../../activeLine/activeLine.slice'
import { ActiveLineState } from '../../../activeLine/activeLine.state'
import { createMockedStructlogsPerActiveLine } from '../../../activeLine/activeLine.mock'

import { runAnalyzer, runAnalyzerSaga } from './runAnalyzer.saga'

const mockedTransactionInfo = mockTransactionInfoState()
const mockedStructlogs = createMockedStructLogs(1)

const mockedBytecodes = createMockedBytecodes(1, 'dissasembled')
const mockedSighashes = createMockedSighashes(1)
const mockedEmptyContract = createEmptyMockedContract()
const mockedContract = createMockedContract(mockedEmptyContract.address)

const mockedSourceMaps = createMockedSourceMaps(1)
const mockedSourceCodes = createMockedSourceCodes(1)
const mockedAbis = createMockedAbis(1)

const mockedInstruction = createMockedInstruction('0x0')

const mockedStructlogsPerLine = createMockedStructlogsPerActiveLine('0x0')

const stepInstructionsMap: TStepInstrctionsMap = {
  '0x0': { structlogsPerStartLine: mockedStructlogsPerLine['0x0'], instructions: mockedInstruction.instructions },
}

const mockedTraceLogs = createMockedTracelogs(1)

const mockedActiveBlock = { ...mockedTraceLogs[0] }

const addressesList = mockedBytecodes.map((bytecode) => bytecode.address)

describe('runAnalyzer', () => {
  it('should run analyzer', async () => {
    const initialState = {
      [StoreKeys.BYTECODES]: bytecodesAdapter.addMany(bytecodesAdapter.getInitialState(), mockedBytecodes),
      [StoreKeys.SIGHASH]: sighashAdapter.addMany(sighashAdapter.getInitialState(), mockedSighashes),
      [StoreKeys.CONTRACTS]: contractsAdapter.addOne(contractsAdapter.getInitialState(), mockedEmptyContract),
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
      [StoreKeys.TRANSACTION_INFO]: { ...mockedTransactionInfo },
      [StoreKeys.STRUCT_LOGS]: structLogsAdapter.addMany(structLogsAdapter.getInitialState(), mockedStructlogs),
      [StoreKeys.SOURCE_MAPS]: sourceMapsAdapter.addMany(sourceMapsAdapter.getInitialState(), mockedSourceMaps),
      [StoreKeys.SOURCE_CODES]: sourceCodesAdapter.addMany(sourceCodesAdapter.getInitialState(), mockedSourceCodes),
      [StoreKeys.ABIS]: abisAdapter.addMany(abisAdapter.getInitialState(), mockedAbis),
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
      [StoreKeys.INSTRUCTIONS]: instructionsAdapter.addOne(initialState[StoreKeys.INSTRUCTIONS], mockedInstruction),
      [StoreKeys.TRACE_LOGS]: traceLogsAdapter.addMany(initialState[StoreKeys.TRACE_LOGS], mockedTraceLogs),
      [StoreKeys.ACTIVE_BLOCK]: mockedActiveBlock,
      [StoreKeys.CONTRACTS]: contractsAdapter.updateOne(initialState[StoreKeys.CONTRACTS], {
        id: mockedContract.address,
        changes: mockedContract,
      }),
      [StoreKeys.BYTECODES]: bytecodesAdapter.updateOne(initialState[StoreKeys.BYTECODES], {
        id: mockedBytecodes[0].address,
        changes: mockedBytecodes[0],
      }),
      [StoreKeys.ACTIVE_LINE]: { ...initialState[StoreKeys.ACTIVE_LINE], structlogsPerActiveLine: mockedStructlogsPerLine },
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
          [StoreKeys.BYTECODES]: bytecodesReducer,
          [StoreKeys.SIGHASH]: sighashReducer,
          [StoreKeys.CONTRACTS]: contractsReducer,
          [StoreKeys.SOURCE_MAPS]: sourceMapsReducer,
          [StoreKeys.SOURCE_CODES]: sourceCodesReducer,
          [StoreKeys.ABIS]: abisReducer,
          [StoreKeys.INSTRUCTIONS]: instructionsReducer,
          [StoreKeys.TRACE_LOGS]: traceLogsReducer,
          [StoreKeys.ACTIVE_BLOCK]: activeBlockReducer,
          [StoreKeys.ACTIVE_LINE]: activeLineReducer,
        }),
      )
      .provide([
        [
          matchers.call.fn(runAnalyzer),
          {
            structLogs: mockedStructlogs,
            mainTraceLogList: mockedTraceLogs,
            instructionsMap: stepInstructionsMap,
            disassembledBytecodes: mockedBytecodes,
            contractBaseData: {
              [mockedContract.address]: mockedContract,
            },
            analyzeSummary: {
              contractSighashesInfo: mockedSighashes,
              contractAddresses: addressesList,
            },
          },
        ],
      ])
      .withState(initialState)
      .put.like({ action: addFirstLogAction })
      .put(analyzerActions.updateStage(inProgresStage))
      .call(runAnalyzer)
      .put(sighashActions.addSighashes(mockedSighashes))
      .put(structLogsActions.loadStructLogs(mockedStructlogs))
      .put(contractsActions.updateContracts([{ id: mockedContract.address, changes: mockedContract }]))
      .put(bytecodesActions.loadBytecodes(mockedBytecodes))
      .put(traceLogsActions.addTraceLogs(mockedTraceLogs))
      .put(activeBlockActions.loadActiveBlock(mockedActiveBlock))
      .put(
        instructionsActions.addInstructions(
          Object.entries(stepInstructionsMap).map(([address, { instructions }]) => ({ instructions, address })),
        ),
      )
      .put(
        activeLineActions.setStructlogsPerActiveLine(
          Object.entries(stepInstructionsMap).reduce((accumulator, [address, { structlogsPerStartLine }]) => {
            accumulator[address] = structlogsPerStartLine
            return accumulator
          }, {}),
        ),
      )
      .put.like({ action: addSecondLogAction })
      .put(analyzerActions.updateStage(successStage))
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

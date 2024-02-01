/* eslint-disable @typescript-eslint/ban-ts-comment */
// TODO: REMOVE WHEN FIXIGN TESTS
// @ts-nocheck
import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'
import type { TAbis, TByteCodeMap, TMappedContractNames, TMappedSourceMap, TStepInstrctionsMap, TTransactionData } from '@evm-debuger/types'

import { analyzerActions, analyzerReducer } from '../../analyzer.slice'
import { AnalyzerState, analyzerStagesAdapter } from '../../analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { bytecodesAdapter, bytecodesReducer } from '../../../bytecodes/bytecodes.slice'
import { sighashActions, sighashAdapter, sighashReducer } from '../../../sighash/sighash.slice'
import { contractNamesAdapter, contractNamesReducer } from '../../../contractNames/contractNames.slice'
import { transactionInfoReducer } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsAdapter, structLogsReducer } from '../../../structlogs/structlogs.slice'
import { mockTransactionInfoState } from '../../../transactionInfo/transactionInfo.mock'
import { createMockedStructLogs } from '../../../structlogs/structlogs.mock'
import { createMockedBytecodes } from '../../../bytecodes/bytecodes.mock'
import { createMockedSighashes } from '../../../sighash/sighash.mock'
import { createMockedContractNames } from '../../../contractNames/contractNames.mock'
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
import { createMockedInstructions } from '../../../instructions/instructions.mock'

import { runAnalyzer, runAnalyzerSaga } from './runAnalyzer.saga'

const mockedTransactionInfo = mockTransactionInfoState()
const mockedStructlogs = createMockedStructLogs(1)

const mockedBytecodes = createMockedBytecodes(1, 'dissasembled')
const mockedSighashes = createMockedSighashes(1)
const mockedContractNames = createMockedContractNames(1, 'contractName')

const mockedSourceMaps = createMockedSourceMaps(1)
const mockedSourceCodes = createMockedSourceCodes(1)
const mockedAbis = createMockedAbis(1)

const mockedInstruction = createMockedInstructions(1)
const mockedInstructionsMap = mockedInstruction.reduce((accumulator, instruction) => {
  accumulator[instruction.address] = instruction.instructions
  return accumulator
}, {})
const mockedTraceLogs = createMockedTracelogs(1)

const mockedActiveBlock = { ...mockedTraceLogs[0] }

const addressesList = mockedBytecodes.map((bytecode) => bytecode.address)

describe('runAnalyzer', () => {
  it('should run analyzer', async () => {
    const initialState = {
      [StoreKeys.BYTECODES]: bytecodesAdapter.addMany(bytecodesAdapter.getInitialState(), mockedBytecodes),
      [StoreKeys.SIGHASH]: sighashAdapter.addMany(sighashAdapter.getInitialState(), mockedSighashes),
      [StoreKeys.CONTRACT_NAMES]: contractNamesAdapter.addMany(contractNamesAdapter.getInitialState(), mockedContractNames),
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
      [StoreKeys.TRANSACTION_INFO]: { ...mockedTransactionInfo },
      [StoreKeys.STRUCT_LOGS]: structLogsAdapter.addMany(structLogsAdapter.getInitialState(), mockedStructlogs),
      [StoreKeys.SOURCE_MAPS]: sourceMapsAdapter.addMany(sourceMapsAdapter.getInitialState(), mockedSourceMaps),
      [StoreKeys.SOURCE_CODES]: sourceCodesAdapter.addMany(sourceCodesAdapter.getInitialState(), mockedSourceCodes),
      [StoreKeys.ABIS]: abisAdapter.addMany(abisAdapter.getInitialState(), mockedAbis),
      [StoreKeys.INSTRUCTIONS]: instructionsAdapter.getInitialState(),
      [StoreKeys.TRACE_LOGS]: traceLogsAdapter.getInitialState(),
      [StoreKeys.ACTIVE_BLOCK]: null,
    }

    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.RUNNING_ANALYZER }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.RUNNING_ANALYZER }

    const firstLogMessage = createInfoLogMessage('Running analyzer')
    const secondLogMessage = createSuccessLogMessage('Analyzer finished')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.INSTRUCTIONS]: instructionsAdapter.addMany(initialState[StoreKeys.INSTRUCTIONS], mockedInstruction),
      [StoreKeys.TRACE_LOGS]: traceLogsAdapter.addMany(initialState[StoreKeys.TRACE_LOGS], mockedTraceLogs),
      [StoreKeys.ACTIVE_BLOCK]: mockedActiveBlock,
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: analyzerStagesAdapter.updateOne(initialState[StoreKeys.ANALYZER].stages, {
          id: AnalyzerStages.RUNNING_ANALYZER,
          changes: successStage,
        }),
        logMessages: mockLogsInAnalyer(),
      },
    }

    const analyzerPayload: TTransactionData = {
      transactionInfo: mockedTransactionInfo,
      structLogs: mockedStructlogs,
      sourceMaps: mockedSourceMaps.reduce((accumulator: TMappedSourceMap, sourceMap) => {
        if (!accumulator[sourceMap.address]) {
          accumulator[sourceMap.address] = []
        }
        accumulator[sourceMap.address] = [...accumulator[sourceMap.address], sourceMap]
        return accumulator
      }, {}),
      sourceFiles: mockedSourceCodes.reduce((accumulator, sourceCode) => {
        accumulator[sourceCode.address] = { 0: { sourceName: sourceCode.sourcesOrder[0], content: sourceCode.sourceCode } }
        return accumulator
      }, {}),
      contractNames: mockedContractNames.reduce((accumulator: TMappedContractNames, contractName) => {
        accumulator[contractName.address] = contractName.contractName
        return accumulator
      }, {}),
      bytecodeMaps: mockedBytecodes.reduce((accumulator: TByteCodeMap, bytecode) => {
        accumulator[bytecode.address] = bytecode.bytecode
        return accumulator
      }, {}),
      abis: mockedAbis.reduce((accumulator: TAbis, abi) => {
        accumulator[abi.address] = abi.abi
        return accumulator
      }, {}),
    }

    const { storeState } = await expectSaga(runAnalyzerSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.TRANSACTION_INFO]: transactionInfoReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
          [StoreKeys.STRUCT_LOGS]: structLogsReducer,
          [StoreKeys.BYTECODES]: bytecodesReducer,
          [StoreKeys.SIGHASH]: sighashReducer,
          [StoreKeys.CONTRACT_NAMES]: contractNamesReducer,
          [StoreKeys.SOURCE_MAPS]: sourceMapsReducer,
          [StoreKeys.SOURCE_CODES]: sourceCodesReducer,
          [StoreKeys.ABIS]: abisReducer,
          [StoreKeys.INSTRUCTIONS]: instructionsReducer,
          [StoreKeys.TRACE_LOGS]: traceLogsReducer,
          [StoreKeys.ACTIVE_BLOCK]: activeBlockReducer,
        }),
      )
      .provide([
        [
          matchers.call.fn(runAnalyzer),
          {
            mainTraceLogList: mockedTraceLogs,
            instructionsMap: mockedInstructionsMap,
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
      .call(runAnalyzer, analyzerPayload)
      .put(sighashActions.addSighashes(mockedSighashes))
      .put(traceLogsActions.addTraceLogs(mockedTraceLogs))
      .put(activeBlockActions.loadActiveBlock(mockedActiveBlock))
      .put(
        instructionsActions.addInstructions(
          Object.entries(mockedInstructionsMap).map(([address, instructions]) => ({ instructions, address })),
        ),
      )
      .put.like({ action: addSecondLogAction })
      .put(analyzerActions.updateStage(successStage))
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

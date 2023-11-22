import { expectSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { combineReducers } from 'redux'

import { analyzerActions, analyzerReducer } from '../../analyzer.slice'
import { AnalyzerState, analyzerStagesAdapter } from '../../analyzer.state'
import { StoreKeys } from '../../../store.keys'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../analyzer.const'
import { createInfoLogMessage, createSuccessLogMessage } from '../../analyzer.utils'
import { createLogMessageActionForTests, mockLogsInAnalyer, testLogMessages } from '../../../../helpers/sagaTests'
import { bytecodesActions, bytecodesAdapter, bytecodesReducer } from '../../../bytecodes/bytecodes.slice'
import { sighashActions, sighashAdapter, sighashReducer } from '../../../sighash/sighash.slice'
import { contractNamesActions, contractNamesAdapter, contractNamesReducer } from '../../../contractNames/contractNames.slice'
import { transactionInfoReducer } from '../../../transactionInfo/transactionInfo.slice'
import { structLogsAdapter, structLogsReducer } from '../../../structlogs/structlogs.slice'
import { mockTransactionInfoState } from '../../../transactionInfo/transactionInfo.const'
import { createMockedStructLogs } from '../../../structlogs/structlogs.utils'
import { createMockedBytecodes } from '../../../bytecodes/bytecodes.utils'
import { createMockedSighashes } from '../../../sighash/sighash.utils'
import { createMockedContractNames } from '../../../contractNames/contractNames.utils'

import { gatherContractsInformations, gatherContractsInformationsSaga } from './gatherContractsInformations.saga'

const mockedTransactionInfo = mockTransactionInfoState()
const mockedStructlogs = createMockedStructLogs(10)

const mockedEmptyBytecodes = createMockedBytecodes(4)
const mockedSighashes = createMockedSighashes(4)
const mockedEmptyContractNames = createMockedContractNames(4)

const addressesList = mockedEmptyBytecodes.map((bytecode) => bytecode.address)

describe('gatherContractsInformations', () => {
  it('should gather contracts informations', async () => {
    const initialState = {
      [StoreKeys.BYTECODES]: { ...bytecodesAdapter.getInitialState() },
      [StoreKeys.SIGHASH]: { ...sighashAdapter.getInitialState() },
      [StoreKeys.CONTRACT_NAMES]: { ...contractNamesAdapter.getInitialState() },
      [StoreKeys.ANALYZER]: { ...new AnalyzerState() },
      [StoreKeys.TRANSACTION_INFO]: { ...mockedTransactionInfo },
      [StoreKeys.STRUCT_LOGS]: structLogsAdapter.addMany(structLogsAdapter.getInitialState(), mockedStructlogs),
    }

    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION }

    const firstLogMessage = createInfoLogMessage('Gathering contracts information')
    const secondLogMessage = createSuccessLogMessage('Gathering contracts information success')

    const addFirstLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(firstLogMessage))
    const addSecondLogAction = createLogMessageActionForTests(analyzerActions.addLogMessage(secondLogMessage))

    const expectedState = {
      ...initialState,
      [StoreKeys.BYTECODES]: bytecodesAdapter.addMany(initialState[StoreKeys.BYTECODES], mockedEmptyBytecodes),
      [StoreKeys.SIGHASH]: sighashAdapter.addMany(initialState[StoreKeys.SIGHASH], mockedSighashes),
      [StoreKeys.CONTRACT_NAMES]: contractNamesAdapter.addMany(initialState[StoreKeys.CONTRACT_NAMES], mockedEmptyContractNames),
      [StoreKeys.ANALYZER]: {
        ...initialState[StoreKeys.ANALYZER],
        stages: analyzerStagesAdapter.updateOne(initialState[StoreKeys.ANALYZER].stages, {
          id: AnalyzerStages.GATHERING_CONTRACTS_INFORMATION,
          changes: successStage,
        }),
        logMessages: mockLogsInAnalyer(),
      },
    }

    const { storeState } = await expectSaga(gatherContractsInformationsSaga)
      .withReducer(
        combineReducers({
          [StoreKeys.TRANSACTION_INFO]: transactionInfoReducer,
          [StoreKeys.ANALYZER]: analyzerReducer,
          [StoreKeys.STRUCT_LOGS]: structLogsReducer,
          [StoreKeys.BYTECODES]: bytecodesReducer,
          [StoreKeys.SIGHASH]: sighashReducer,
          [StoreKeys.CONTRACT_NAMES]: contractNamesReducer,
        }),
      )
      .provide([
        [
          matchers.call.fn(gatherContractsInformations),
          {
            contractSighashesInfo: mockedSighashes,
            contractAddresses: addressesList,
          },
        ],
      ])
      .withState(initialState)
      .put.like({ action: addFirstLogAction })
      .put(analyzerActions.updateStage(inProgresStage))
      .call(gatherContractsInformations, mockedTransactionInfo, mockedStructlogs)
      .put(sighashActions.addSighashes(mockedSighashes))
      .put(contractNamesActions.initializeContractNames(addressesList))
      .put(bytecodesActions.initializeBytecodes(addressesList))
      .put.like({ action: addSecondLogAction })
      .put(analyzerActions.updateStage(successStage))
      .run()

    expect(storeState).toEqual(expectedState)
    testLogMessages(storeState[StoreKeys.ANALYZER], [firstLogMessage, secondLogMessage])
  })
})

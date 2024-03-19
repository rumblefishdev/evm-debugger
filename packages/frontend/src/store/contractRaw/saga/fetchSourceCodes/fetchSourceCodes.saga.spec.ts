import { testSaga } from 'redux-saga-test-plan'
import type { ISrcMapApiPayload } from '@evm-debuger/types'
import { ChainId, SrcMapStatus } from '@evm-debuger/types'

import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { testLogMessageViaInspect } from '../../../../helpers/sagaTests'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { contractBaseSelectors } from '../../../contractBase/contractBase.selectors'
import { contractRawActions } from '../../contractRaw.slice'

import { fetchSourcesStatus, startPoolingSourcesStatusSaga } from './fetchSourceCodes.saga'

const CHAIN_ID = ChainId.mainnet
const CONTRACT_ADDRESSES = ['0x123', '0x456']
const TRANSACTION_HASH = '0x123'

const firstMockedResponse: Record<string, ISrcMapApiPayload> = {
  [CONTRACT_ADDRESSES[0]]: {
    status: SrcMapStatus.COMPILATION_SUCCESS,
    pathSources: 'pathSources',
    pathSourceMap: 'pathSourceMaps',
    pathSourceData: 'pathSourceData',
    chainId: CHAIN_ID,
    address: CONTRACT_ADDRESSES[0],
  },
  [CONTRACT_ADDRESSES[1]]: {
    status: SrcMapStatus.COMPILATOR_TRIGGERRING_SUCCESS,
    chainId: CHAIN_ID,
    address: CONTRACT_ADDRESSES[0],
  },
}

const secondMockedResponse: Record<string, ISrcMapApiPayload> = {
  [CONTRACT_ADDRESSES[1]]: {
    status: SrcMapStatus.COMPILATION_SUCCESS,
    pathSources: 'pathSources',
    pathSourceMap: 'pathSourceMaps',
    pathSourceData: 'pathSourceData',
    chainId: CHAIN_ID,
    address: CONTRACT_ADDRESSES[1],
  },
}

describe('startPoolingSourcesStatusSaga', () => {
  it('should successfully loop over sources statuses', () => {
    const inProgresStage = { stageStatus: AnalyzerStagesStatus.IN_PROGRESS, stageName: AnalyzerStages.FETCHING_SOURCE_CODES }
    const successStage = { stageStatus: AnalyzerStagesStatus.SUCCESS, stageName: AnalyzerStages.FETCHING_SOURCE_CODES }

    const firstLogMessage = createInfoLogMessage(`Compiling source code for ${CONTRACT_ADDRESSES[0]}`)
    const secondLogMessage = createInfoLogMessage(`Compiling source code for ${CONTRACT_ADDRESSES[1]}`)
    const thirdLogMessage = createSuccessLogMessage(`Compilation success for ${CONTRACT_ADDRESSES[0]}`)
    const fourthLogMessage = createInfoLogMessage(`Compilation pending for ${CONTRACT_ADDRESSES[1]}`)
    const fifthLogMessage = createSuccessLogMessage(`Compilation success for ${CONTRACT_ADDRESSES[1]}`)
    const sixthLogMessage = createSuccessLogMessage(`Fetched source codes`)

    testSaga(startPoolingSourcesStatusSaga)
      .next()
      .select(transactionConfigSelectors.selectChainId)
      .next(CHAIN_ID)
      .select(contractBaseSelectors.selectAllAddresses)
      .next(CONTRACT_ADDRESSES)
      .select(transactionConfigSelectors.selectTransactionHash)
      .next(TRANSACTION_HASH)
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, firstLogMessage))
      .next()
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, secondLogMessage))
      .next()
      .put(analyzerActions.updateStage(inProgresStage))
      .next()
      .call(fetchSourcesStatus, TRANSACTION_HASH, CHAIN_ID, CONTRACT_ADDRESSES)
      .next(firstMockedResponse)
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, thirdLogMessage))
      .next()
      .put(
        contractRawActions.fetchSourceData({
          sourcesPath: firstMockedResponse[CONTRACT_ADDRESSES[0]].pathSources,
          sourceDataPath: firstMockedResponse[CONTRACT_ADDRESSES[0]].pathSourceData,
          contractAddress: CONTRACT_ADDRESSES[0],
        }),
      )
      .next()
      .take(analyzerActions.addLogMessage)
      .next()
      .put(
        contractRawActions.fetchSourceMaps({
          path: firstMockedResponse[CONTRACT_ADDRESSES[0]].pathSourceMap,
          contractAddress: CONTRACT_ADDRESSES[0],
        }),
      )
      .next()
      .take(analyzerActions.addLogMessage)
      .next()
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, fourthLogMessage))
      .next()
      .delay(15_000)
      .next()
      .call(fetchSourcesStatus, TRANSACTION_HASH, CHAIN_ID, [CONTRACT_ADDRESSES[1]])
      .next(secondMockedResponse)
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, fifthLogMessage))
      .next()
      .put(
        contractRawActions.fetchSourceData({
          sourcesPath: secondMockedResponse[CONTRACT_ADDRESSES[1]].pathSources,
          sourceDataPath: secondMockedResponse[CONTRACT_ADDRESSES[1]].pathSourceData,
          contractAddress: CONTRACT_ADDRESSES[1],
        }),
      )
      .next()
      .take(analyzerActions.addLogMessage)
      .next()
      .put(
        contractRawActions.fetchSourceMaps({
          path: secondMockedResponse[CONTRACT_ADDRESSES[1]].pathSourceMap,
          contractAddress: CONTRACT_ADDRESSES[1],
        }),
      )
      .next()
      .take(analyzerActions.addLogMessage)
      .next()
      .put(analyzerActions.updateStage(successStage))
      .next()
      .inspect((inspect: unknown) => testLogMessageViaInspect(inspect, sixthLogMessage))
      .next()
      .isDone()
  })
})

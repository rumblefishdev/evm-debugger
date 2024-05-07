import { put, select, type SagaGenerator, call, take, delay } from 'typed-redux-saga'
import { SrcMapStatus } from '@evm-debuger/types'
import type { ChainId, ISrcMapApiResponseBody } from '@evm-debuger/types'

import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { srcMapProviderUrl } from '../../../../config'
import { contractBaseSelectors } from '../../../contractBase/contractBase.selectors'
import { contractRawActions } from '../../contractRaw.slice'
import { handleStageFailSaga } from '../../../analyzer/saga/handleStageFail/handleStageFail.saga'

export async function fetchSourcesStatus(
  transactionHash: string,
  chainId: ChainId,
  addresses: string[],
): Promise<ISrcMapApiResponseBody['data']> {
  const bodyContent = addresses.map((address) => ({ chainId, address }))
  const stringifiedBody = JSON.stringify({ transactionHash, addresses: bodyContent })

  const resp = await fetch(`${srcMapProviderUrl}/srcmap-api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: stringifiedBody,
  })
  if (resp.status !== 200) {
    throw new Error(`Cannot retrieve data for transaction: ${transactionHash} with addresses: ${addresses}`)
  }

  const sourceMapsResponse: ISrcMapApiResponseBody = await resp.json()

  if (!sourceMapsResponse.data) {
    throw new Error(`Empty data for addresses: ${addresses}`)
  }

  return sourceMapsResponse.data
}

export function* startPoolingSourcesStatusSaga(): SagaGenerator<void> {
  try {
    const chainId = yield* select(transactionConfigSelectors.selectChainId)
    const contractAddresses = yield* select(contractBaseSelectors.selectAllAddresses)
    const transactionHash = yield* select(transactionConfigSelectors.selectTransactionHash)

    for (const address of contractAddresses) {
      yield* put(analyzerActions.addLogMessage(createInfoLogMessage(`Compiling source code for ${address}`)))
    }

    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.IN_PROGRESS,
        stageName: AnalyzerStages.FETCHING_SOURCE_CODES,
      }),
    )

    let shouldBreakLoop = false
    let addressesToPool = contractAddresses
    let remainingAddresses = []

    while (true) {
      remainingAddresses = []

      if (!addressesToPool.length) {
        throw new Error('Empty addresses list')
      }

      if (addressesToPool.length > 0) {
        const responseData = yield* call(fetchSourcesStatus, transactionHash, chainId, addressesToPool)

        for (const entry of Object.entries(responseData)) {
          const [address, payload] = entry
          addressesToPool[address] = payload.status

          switch (payload.status) {
            case SrcMapStatus.COMPILATION_FAILED:
            case SrcMapStatus.FILES_EXTRACTING_FAILED:
            case SrcMapStatus.SOURCE_DATA_FETCHING_FAILED:
            case SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED:
            case SrcMapStatus.SOURCE_DATA_FETCHING_QUEUED_FAILED:
              yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Compilation failed for ${address}`)))
              break
            case SrcMapStatus.SOURCE_DATA_FETCHING_NOT_VERIFIED:
              yield* put(analyzerActions.addLogMessage(createInfoLogMessage(`Contract: ${address} is not verified`)))
              break
            case SrcMapStatus.COMPILATION_SUCCESS:
              yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Compilation success for ${address}`)))
              yield* put(
                contractRawActions.fetchSourceData({
                  sourcesPath: payload.pathSources,
                  sourceDataPath: payload.pathSourceData,
                  contractAddress: address,
                }),
              )
              yield* take(analyzerActions.addLogMessage)

              yield* put(contractRawActions.fetchSourceMaps({ path: payload.pathSourceMap, contractAddress: address }))
              yield* take(analyzerActions.addLogMessage)
              break
            default:
              remainingAddresses.push(address)
              yield* put(analyzerActions.addLogMessage(createInfoLogMessage(`Compilation pending for ${address}`)))
              break
          }
        }
      }

      if (remainingAddresses.length === 0) {
        shouldBreakLoop = true
        yield* put(
          analyzerActions.updateStage({
            stageStatus: AnalyzerStagesStatus.SUCCESS,
            stageName: AnalyzerStages.FETCHING_SOURCE_CODES,
          }),
        )
        yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Fetched source codes`)))
      }

      if (shouldBreakLoop) break

      addressesToPool = remainingAddresses
      yield* delay(15000)
    }
  } catch (error) {
    yield* call(handleStageFailSaga, AnalyzerStages.FETCHING_SOURCE_CODES, error)
  }
}

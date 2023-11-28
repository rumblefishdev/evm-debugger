import { put, select, type SagaGenerator, call, take, delay } from 'typed-redux-saga'
import { SrcMapStatus } from '@evm-debuger/types'
import type { ChainId, ISrcMapApiResponseBody } from '@evm-debuger/types'

import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { contractNamesSelectors } from '../../../contractNames/contractNames.selectors'
import { srcMapProviderUrl } from '../../../../config'
import { sourceCodesActions } from '../../sourceCodes.slice'
import { sourceMapsActions } from '../../../sourceMaps/sourceMaps.slice'
import { convertAddressesToStatuses } from '../../sourceCodes.utiils'

export async function fetchSourcesStatus(chainId: ChainId, addresses: string[]): Promise<ISrcMapApiResponseBody['data']> {
  const bodyContent = addresses.map((address) => ({ chainId, address }))
  const stringifiedBody = JSON.stringify({ addresses: bodyContent })

  const resp = await fetch(`${srcMapProviderUrl}/srcmap-api`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: stringifiedBody,
  })
  if (resp.status !== 200) {
    throw new Error(`Cannot retrieve data for addresses: ${addresses}`)
  }

  const sourceMapsResponse: ISrcMapApiResponseBody = await resp.json()

  if (!sourceMapsResponse.data) {
    throw new Error(`Empty data for addresses: ${addresses}`)
  }

  return sourceMapsResponse.data
}

export function* gatherAndHandleSourceStatus(chainId: ChainId, initialAddresses: Record<string, SrcMapStatus>): SagaGenerator<void> {
  if (!Object.keys(initialAddresses).length) {
    throw new Error('Empty addresses list')
  }

  const addressesToFetch = Object.keys(initialAddresses)

  if (addressesToFetch.length > 0) {
    const responseData = yield* call(fetchSourcesStatus, chainId, addressesToFetch)

    for (const entry of Object.entries(responseData)) {
      const [address, payload] = entry
      initialAddresses[address] = payload.status

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
          yield* put(sourceCodesActions.fetchSourceData({ path: payload.pathSourceData, contractAddress: address }))
          yield* take(analyzerActions.addLogMessage)

          yield* put(sourceMapsActions.fetchSourceMaps({ paths: payload.pathSourceMaps, contractAddress: address }))
          yield* take(analyzerActions.addLogMessage)
          break
        default:
          yield* put(analyzerActions.addLogMessage(createInfoLogMessage(`Compilation pending for ${address}`)))
          break
      }
    }
  }

  const remainingAddresses = Object.entries(initialAddresses)
    .filter(
      ([, status]) =>
        status !== SrcMapStatus.COMPILATION_SUCCESS &&
        status !== SrcMapStatus.COMPILATION_FAILED &&
        status !== SrcMapStatus.FILES_EXTRACTING_FAILED &&
        status !== SrcMapStatus.SOURCE_DATA_FETCHING_FAILED &&
        status !== SrcMapStatus.COMPILATOR_TRIGGERRING_FAILED &&
        status !== SrcMapStatus.SOURCE_DATA_FETCHING_NOT_VERIFIED,
    )
    .map(([address]) => address)

  if (remainingAddresses.length > 0) {
    yield* delay(15000)
    yield* call(gatherAndHandleSourceStatus, chainId, convertAddressesToStatuses(remainingAddresses))
  } else {
    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.SUCCESS,
        stageName: AnalyzerStages.FETCHING_SOURCE_CODES,
      }),
    )
    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Fetched source codes`)))
  }
}

export function* startPoolingSourcesStatus(): SagaGenerator<void> {
  try {
    const chainId = yield* select(transactionConfigSelectors.selectChainId)
    const contractAddresses = yield* select(contractNamesSelectors.selectAllAddresses)

    yield* put(analyzerActions.addLogMessage(createInfoLogMessage(`Compiling source codes for [${contractAddresses}] contracts`)))

    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.IN_PROGRESS,
        stageName: AnalyzerStages.FETCHING_SOURCE_CODES,
      }),
    )

    yield* call(gatherAndHandleSourceStatus, chainId, convertAddressesToStatuses(contractAddresses))
  } catch (error) {
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.FETCHING_SOURCE_CODES }))
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Error while compiling source codes: ${error.message}`)))
  }
}

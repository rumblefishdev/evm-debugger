import { put, select, type SagaGenerator, call, take } from 'typed-redux-saga'
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

export const convertAddressesToStatuses = (addresses: string[]): Record<string, SrcMapStatus> =>
  addresses.reduce((accumulator, address) => {
    accumulator[address] = SrcMapStatus.PENDING
    return accumulator
  }, {})

export function* gatherAndHandleSourceStatus(chainId: ChainId, initialAddresses: string[]): SagaGenerator<void> {
  const convertedAddresses = convertAddressesToStatuses(initialAddresses)

  if (!convertedAddresses) {
    throw new Error('Cannot convert addresses')
  }

  if (!Object.keys(convertedAddresses).length) {
    throw new Error('Empty addresses')
  }

  const addressesToFetch = Object.entries(convertedAddresses)
    .filter(([, status]) => status !== SrcMapStatus.COMPILATION_SUCCESS)
    .map(([address]) => address)

  if (addressesToFetch.length > 0) {
    const responseData = yield* call(fetchSourcesStatus, chainId, addressesToFetch)

    for (const entry of Object.entries(responseData)) {
      const [address, payload] = entry

      if (payload.status === SrcMapStatus.COMPILATION_SUCCESS) {
        convertedAddresses[address] = payload.status

        yield* put(sourceCodesActions.fetchSourceData({ path: payload.pathSourceData, contractAddress: address }))
        yield* put(sourceMapsActions.fetchSourceMaps({ paths: payload.pathSourceMaps, contractAddress: address }))
        yield* take(sourceMapsActions.addSourceMaps)
      }
    }
  }

  const remainingAddresses = Object.entries(convertedAddresses)
    .filter(([, status]) => status !== SrcMapStatus.COMPILATION_SUCCESS)
    .map(([address]) => address)

  if (remainingAddresses.length > 0) {
    yield* call(gatherAndHandleSourceStatus, chainId, remainingAddresses)
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
    yield* put(analyzerActions.addLogMessage(createInfoLogMessage('Fetching source codes')))

    yield* put(
      analyzerActions.updateStage({
        stageStatus: AnalyzerStagesStatus.IN_PROGRESS,
        stageName: AnalyzerStages.FETCHING_SOURCE_CODES,
      }),
    )

    const chainId = yield* select(transactionConfigSelectors.selectChainId)
    const contractAddresses = yield* select(contractNamesSelectors.selectAllAddresses)

    yield* call(gatherAndHandleSourceStatus, chainId, contractAddresses)
  } catch (error) {
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.FETCHING_SOURCE_CODES }))
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Error while fetching source codes: ${error.message}`)))
  }
}

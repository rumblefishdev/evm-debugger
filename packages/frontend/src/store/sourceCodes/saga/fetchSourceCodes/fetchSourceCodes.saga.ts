import { select, type SagaGenerator, call, put } from 'typed-redux-saga'
import { SrcMapStatus, type ChainId, type ISrcMapApiPayload, type ISrcMapApiResponseBody, type TSrcMapAddres } from '@evm-debuger/types'

import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { srcMapProviderUrl } from '../../../../config'
import { contractNamesSelectors } from '../../../contractNames/contractNames.selectors'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { LogMessageStatus } from '../../../analyzer/analyzer.const'
import { sourceMapsActions } from '../../../sourceMaps/sourceMaps.slice'
import { sourceCodesActions } from '../../sourceCodes.slice'
import { contractNamesActions } from '../../../contractNames/contractNames.slice'
import type { TContractsSources } from '../../sourceCodes.types'
import { sighashActions } from '../../../sighash/sighash.slice'

export async function fetchSourceCodes(chainId: ChainId, addresses: string[]): Promise<ISrcMapApiResponseBody> {
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

  return sourceMapsResponse
}

export function* fetchSourceCodesSaga(): SagaGenerator<void> {
  const chainId = yield* select(transactionConfigSelectors.selectChainId)
  const contractAddresses = yield* select(contractNamesSelectors.selectAllAddresses)

  const responseBody = yield* call(fetchSourceCodes, chainId, contractAddresses)
  const contractsData: Record<string, ISrcMapApiPayload> = responseBody.data

  const sources: TContractsSources = Object.entries(contractsData).reduce((accumulator: TContractsSources, [address, current]) => {
    if (current.status !== SrcMapStatus.COMPILATION_SUCCESS) {
      return accumulator
    }
    accumulator[address] = {
      srcMap: current.sourceMaps,
      sourceCode: current.sourceData.SourceCode,
      contractName: current.sourceData.ContractName,
      abi: current.sourceData.ABI,
    }
    return accumulator
  }, {})

  yield* put(analyzerActions.addLogMessage({ status: LogMessageStatus.INFO, message: `Fetching srcMap: ${responseBody.status}` }))
  if (responseBody.status === SrcMapStatus.FAILED) {
    throw new Error(`Cannot retrieve data for transaction with hash:Reason: ${responseBody.error}`)
  } else if (responseBody.status === SrcMapStatus.SUCCESS) {
    yield* put(
      sourceCodesActions.addSourceCodes(
        Object.entries(sources).reduce(
          (accumulator, [address, sourceCode]) => [...accumulator, { sourceCode: sourceCode.sourceCode, address }],
          [],
        ),
      ),
    )

    yield* put(
      contractNamesActions.updateContractNames(
        Object.entries(sources).map(([address, sourceCode]) => ({ id: address, changes: { contractName: sourceCode.contractName } })),
      ),
    )

    yield* put(
      sourceMapsActions.setSourceMaps(
        Object.entries(sources).reduce(
          (accumulator, [address, sourceCode]) => [
            ...accumulator,
            ...sourceCode.srcMap.map((sourceMapEntry) => ({ ...sourceMapEntry, address })),
          ],
          [],
        ),
      ),
    )
  }
}

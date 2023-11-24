import { select, type SagaGenerator, call, put, delay } from 'typed-redux-saga'
import { SrcMapStatus } from '@evm-debuger/types'
import type { TEtherscanContractSourceCodeResult, ISrcMapApiPayload, ISrcMapApiResponseBody, ChainId, TSourceMap } from '@evm-debuger/types'

import { transactionConfigSelectors } from '../../../transactionConfig/transactionConfig.selectors'
import { srcMapProviderUrl } from '../../../../config'
import { contractNamesSelectors } from '../../../contractNames/contractNames.selectors'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { AnalyzerStages, AnalyzerStagesStatus } from '../../../analyzer/analyzer.const'
import { sourceMapsActions } from '../../../sourceMaps/sourceMaps.slice'
import { sourceCodesActions } from '../../sourceCodes.slice'
import { contractNamesActions } from '../../../contractNames/contractNames.slice'
import type { TContractsSources, TRawContractsData } from '../../sourceCodes.types'
import { abisActions } from '../../../abis/abis.slice'
import { createErrorLogMessage, createInfoLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'

async function fetchSourceCodesRouterApi(chainId: ChainId, addresses: string[]): Promise<ISrcMapApiResponseBody> {
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

async function fetchSourceCodes(rawContractsData: TRawContractsData): Promise<TContractsSources> {
  const bucket = 'transaction-trace-storage-stage.rumblefish.dev'
  return Object.entries(rawContractsData).reduce(async (accumulator: Promise<TContractsSources>, [address, current]) => {
    let sourceData: TEtherscanContractSourceCodeResult | undefined
    let sourceMaps: TSourceMap[] | undefined
    // if (current.status !== SrcMapStatus.COMPILATION_SUCCESS) {
    //   return accumulator
    // }
    if (current.pathSourceData) {
      const rawSourceData = await fetch(`https://${bucket}/${current.pathSourceData}`)
      sourceData = await rawSourceData.json()
    }

    if (current.pathSourceMaps) {
      sourceMaps = await Promise.all(
        current.pathSourceMaps.map(async (pathSourceMap) => {
          const rawSourceMap = await fetch(`https://${bucket}/${pathSourceMap}`)
          const sourceMap: TSourceMap = await rawSourceMap.json()
          return sourceMap
        }),
      )
    }

    const contractSource = {
      srcMap: sourceMaps || [],
      sourceCode: sourceData?.SourceCode || '',
      contractName: sourceData?.ContractName || '',
      abi: sourceData?.ABI || [],
    }

    const resolvedAccumulator: TContractsSources = await accumulator
    resolvedAccumulator[address] = contractSource

    return resolvedAccumulator
  }, Promise.resolve({}))
}

export function* fetchSourceCodesSaga(): SagaGenerator<void> {
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

    // Initiall call
    const responseBody = yield* call(fetchSourceCodesRouterApi, chainId, contractAddresses)
    const contractsData: TRawContractsData = responseBody.data
    const sources: TContractsSources = yield* call(fetchSourceCodes, contractsData)
    console.log('Debug, sources:', sources)

    if (responseBody.status === SrcMapStatus.SUCCESS) {
      yield* put(abisActions.addAbis(Object.entries(sources).map(([address, current]) => ({ address, abi: current.abi }))))

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
        sourceMapsActions.addSourceMaps(
          Object.entries(sources).reduce(
            (accumulator, [address, sourceCode]) => [
              ...accumulator,
              ...sourceCode.srcMap.map((sourceMapEntry) => ({ ...sourceMapEntry, address })),
            ],
            [],
          ),
        ),
      )

      yield* put(
        analyzerActions.updateStage({
          stageStatus: AnalyzerStagesStatus.SUCCESS,
          stageName: AnalyzerStages.FETCHING_SOURCE_CODES,
        }),
      )
      yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Fetched ${Object.keys(sources).length} source codes`)))
    } else if (responseBody.status === SrcMapStatus.FAILED) {
      throw new Error(`Cannot retrieve data for transaction with hash:Reason: ${responseBody.error}`)
    }
  } catch (error) {
    yield* put(analyzerActions.updateStage({ stageStatus: AnalyzerStagesStatus.FAILED, stageName: AnalyzerStages.FETCHING_SOURCE_CODES }))
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Error while fetching source codes: ${error.message}`)))
  }
}

import { apply, call, put, type SagaGenerator } from 'typed-redux-saga'
import type { TEtherscanContractSourceCodeResult } from '@evm-debuger/types'

import { traceStorageBucket } from '../../../../config'
import { sourceCodesActions, type SourceCodesActions } from '../../sourceCodes.slice'
import { abisActions } from '../../../abis/abis.slice'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { createErrorLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../../analyzer/analyzer.utils'

export async function fetchSourceData(sourceDataPath: string) {
  const rawSourceData = await fetch(`https://${traceStorageBucket}/${sourceDataPath}`)
  const sourceData: TEtherscanContractSourceCodeResult = await rawSourceData.json()
  return sourceData
}

export async function fetchSourcesOrder(sourcesPath: string) {
  const rawSources = await fetch(`https://${traceStorageBucket}/${sourcesPath}`)
  const sources: Record<number, string> = await rawSources.json()
  return sources
}

export function* fetchSourceDataForContractSaga({ payload }: SourceCodesActions['fetchSourceData']): SagaGenerator<void> {
  const { sourceDataPath, sourcesPath, contractAddress } = payload
  const analyzer = yield* call(getAnalyzerInstance)

  try {
    const sourceData = yield* call(fetchSourceData, sourceDataPath)
    const sourcesOrder = yield* call(fetchSourcesOrder, sourcesPath)
    if (sourceData.ABI) {
      yield* put(abisActions.addAbi({ address: contractAddress, abi: sourceData.ABI }))
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [
        contractAddress,
        'applicationBinaryInterface',
        sourceData.ABI,
      ])
    }
    if (sourceData.SourceCode) {
      yield* put(sourceCodesActions.addSourceCode({ sourcesOrder, sourceCode: sourceData.SourceCode, address: contractAddress }))

      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [contractAddress, 'sourceCode', sourceData.SourceCode])
    }
    if (sourceData.ContractName) {
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [contractAddress, 'name', sourceData.ContractName])
    }

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Source data for ${contractAddress} fetched successfully`)))
  } catch (error) {
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Source data for ${contractAddress} fetching failed`)))
    console.log(error)
  }
}

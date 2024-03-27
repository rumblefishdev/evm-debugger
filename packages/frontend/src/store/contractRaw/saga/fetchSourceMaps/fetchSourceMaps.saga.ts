/* eslint-disable no-return-await */
import { apply, call, put, type SagaGenerator } from 'typed-redux-saga'
import type { TSourceMap } from '@evm-debuger/types'

import { traceStorageBucket } from '../../../../config'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { createErrorLogMessage, createSuccessLogMessage, getAnalyzerInstance } from '../../../analyzer/analyzer.utils'
import { yulNodesActions } from '../../../yulNodes/yulNodes.slice'
import type { ContractRawActions } from '../../contractRaw.slice'

export async function fetchSourceMap(path: string): Promise<TSourceMap> {
  const rawSourceMap = await fetch(`https://${traceStorageBucket}/${path}`)
  const sourceMap: TSourceMap = await rawSourceMap.json()
  return sourceMap
}

export function* fetchSourceMapsForContractSaga({ payload }: ContractRawActions['fetchSourceMaps']): SagaGenerator<void> {
  const { path, contractAddress } = payload

  try {
    const analyzer = yield* call(getAnalyzerInstance)
    const sourceMap = yield* call(fetchSourceMap, path)

    console.log('sourceMap', sourceMap)

    if (sourceMap.ast) {
      yield* put(yulNodesActions.createYulNodesStructure({ content: sourceMap.ast, address: contractAddress }))
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [contractAddress, 'yulTree', sourceMap.ast])
    }

    if (sourceMap.yulContents && sourceMap.yulContents.length > 0) {
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [contractAddress, 'yulSource', sourceMap.yulContents])
    }

    if (sourceMap.immutableReferences) {
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [
        contractAddress,
        'immutableReferences',
        sourceMap.immutableReferences,
      ])
    }

    if (sourceMap.functionDebugData) {
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [
        contractAddress,
        'functionDebugData',
        sourceMap.functionDebugData,
      ])
    }

    if (sourceMap.linkReferences) {
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [
        contractAddress,
        'linkReferences',
        sourceMap.linkReferences,
      ])
    }

    yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [contractAddress, 'bytecode', sourceMap.bytecode])
    yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [contractAddress, 'sourceMap', sourceMap.sourceMap])

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Source maps for ${contractAddress} fetched successfully`)))
  } catch (error) {
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Source maps for ${contractAddress} fetching failed`)))
    console.log(error)
  }
}

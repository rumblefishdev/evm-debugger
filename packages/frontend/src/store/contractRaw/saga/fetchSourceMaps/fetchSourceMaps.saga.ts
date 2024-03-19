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

    if (sourceMap.deployedBytecode.ast) {
      yield* put(yulNodesActions.createYulNodesStructure({ content: sourceMap.deployedBytecode.ast, address: contractAddress }))
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [
        contractAddress,
        'yulTree',
        sourceMap.deployedBytecode.ast,
      ])
    }

    if (sourceMap.deployedBytecode.contents && sourceMap.deployedBytecode.contents.length > 0) {
      yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [
        contractAddress,
        'yulSource',
        sourceMap.deployedBytecode.contents,
      ])
    }

    yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [
      contractAddress,
      'bytecode',
      sourceMap.deployedBytecode.object,
    ])
    yield* apply(analyzer.dataLoader, analyzer.dataLoader.inputContractData.set, [
      contractAddress,
      'sourceMap',
      sourceMap.deployedBytecode.sourceMap,
    ])

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Source maps for ${contractAddress} fetched successfully`)))
  } catch (error) {
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Source maps for ${contractAddress} fetching failed`)))
    console.log(error)
  }
}

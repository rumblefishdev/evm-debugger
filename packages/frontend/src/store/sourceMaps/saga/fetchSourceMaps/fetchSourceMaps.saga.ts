/* eslint-disable no-return-await */
import { call, put, type SagaGenerator } from 'typed-redux-saga'
import type { TSourceMap } from '@evm-debuger/types'

import { sourceMapsActions, type TSourceMapsActions } from '../../sourceMaps.slice'
import { traceStorageBucket } from '../../../../config'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { createErrorLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { sourceCodesActions } from '../../../sourceCodes/sourceCodes.slice'
import { yulNodesActions } from '../../../yulNodes/yulNodes.slice'

export async function fetchSourceMap(path: string): Promise<TSourceMap> {
  const rawSourceMap = await fetch(`https://${traceStorageBucket}/${path}`)
  const sourceMap: TSourceMap = await rawSourceMap.json()
  return sourceMap
}

export function* fetchSourceMapsForContractSaga({ payload }: TSourceMapsActions['fetchSourceMaps']): SagaGenerator<void> {
  const { path, contractAddress } = payload

  try {
    const sourceMap = yield* call(fetchSourceMap, path)

    const hasAst = sourceMap.deployedBytecode.ast !== undefined || sourceMap.deployedBytecode.ast !== null
    const hasYulContents = sourceMap.deployedBytecode.contents && sourceMap.deployedBytecode.contents.length > 0

    if (hasAst) {
      yield* put(yulNodesActions.createYulNodesStructure({ content: sourceMap.deployedBytecode.ast, address: contractAddress }))
    }

    if (hasYulContents) {
      yield* put(sourceCodesActions.addYulSource({ yulSource: sourceMap.deployedBytecode.contents, address: contractAddress }))
    }

    const sourceMapWithAddress = { ...sourceMap, address: contractAddress }
    yield* put(sourceMapsActions.addSourceMap(sourceMapWithAddress))

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Source maps for ${contractAddress} fetched successfully`)))
  } catch (error) {
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Source maps for ${contractAddress} fetching failed`)))
    console.log(error)
  }
}

/* eslint-disable no-return-await */
import { call, put, type SagaGenerator } from 'typed-redux-saga'
import type { TSourceMap } from '@evm-debuger/types'

import { sourceMapsActions, type TSourceMapsActions } from '../../sourceMaps.slice'
import { traceStorageBucket } from '../../../../config'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { createErrorLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { yulNodesActions } from '../../../yulNodes/yulNodes.slice'
import { convertYulTreeToArray } from '../../../yulNodes/yulNodes.utils'
import { sourceCodesActions } from '../../../sourceCodes/sourceCodes.slice'

export async function fetchSourceMaps(paths: string[]): Promise<TSourceMap[]> {
  return await Promise.all(
    paths.map(async (path) => {
      const rawSourceMap = await fetch(`https://${traceStorageBucket}/${path}`)
      const sourceMap: TSourceMap = await rawSourceMap.json()
      return sourceMap
    }),
  )
}

export function* fetchSourceMapsForContractSaga({ payload }: TSourceMapsActions['fetchSourceMaps']): SagaGenerator<void> {
  const { paths, contractAddress } = payload

  try {
    const sourceMaps = yield* call(fetchSourceMaps, paths)

    const test = [...sourceMaps].filter(
      (sourceMap) => sourceMap.deployedBytecode.ast !== undefined && Object.keys(sourceMap.deployedBytecode.ast).length > 0,
    )

    const {
      yulExpressionStatements,
      yulForLoops,
      yulFunctionCalls,
      yulFunctionDefinitions,
      yulIdentifiers,
      yulIfs,
      yulLiterals,
      yulNodeAssignments,
      yulNodeBlocks,
      yulNodesLinkArray,
      yulTypedNames,
    } = convertYulTreeToArray(test[0].deployedBytecode.ast)

    yield* put(yulNodesActions.initializeYulNodesForContract({ address: contractAddress }))
    yield* put(yulNodesActions.addYulExpressionStatements({ yulExpressionStatements, address: contractAddress }))
    yield* put(yulNodesActions.addYulForLoops({ yulForLoops, address: contractAddress }))
    yield* put(yulNodesActions.addYulFunctionCalls({ yulFunctionCalls, address: contractAddress }))
    yield* put(yulNodesActions.addYulFunctionDefinitions({ yulFunctionDefinitions, address: contractAddress }))
    yield* put(yulNodesActions.addYulIdentifiers({ yulIdentifiers, address: contractAddress }))
    yield* put(yulNodesActions.addYulIfs({ yulIfs, address: contractAddress }))
    yield* put(yulNodesActions.addYulLiterals({ yulLiterals, address: contractAddress }))
    yield* put(yulNodesActions.addYulAssignments({ yulAssignments: yulNodeAssignments, address: contractAddress }))
    yield* put(yulNodesActions.addYulBlocks({ yulBlocks: yulNodeBlocks, address: contractAddress }))
    yield* put(yulNodesActions.addYulTypedNames({ yulTypedNames, address: contractAddress }))
    yield* put(yulNodesActions.addYulNodes({ yulNodes: yulNodesLinkArray, address: contractAddress }))

    if (test[0].deployedBytecode.contents)
      yield* put(sourceCodesActions.addYulSource({ yulSource: test[0].deployedBytecode.contents, address: contractAddress }))

    const sourceMapsWithAddress = sourceMaps.map((sourceMap) => ({ ...sourceMap, address: contractAddress }))
    yield* put(sourceMapsActions.addSourceMaps(sourceMapsWithAddress))

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Source maps for ${contractAddress} fetched successfully`)))
  } catch (error) {
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Source maps for ${contractAddress} fetching failed`)))
    console.log(error)
  }
}

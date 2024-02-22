/* eslint-disable no-return-await */
import { call, put, type SagaGenerator } from 'typed-redux-saga'
import type { TSourceMap } from '@evm-debuger/types'

import { sourceMapsActions, type TSourceMapsActions } from '../../sourceMaps.slice'
import { traceStorageBucket } from '../../../../config'
import { analyzerActions } from '../../../analyzer/analyzer.slice'
import { createErrorLogMessage, createSuccessLogMessage } from '../../../analyzer/analyzer.utils'
import { convertYulTreeToArray } from '../../sourceMaps.utils'

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

    const converted = convertYulTreeToArray(test[0].deployedBytecode.ast)

    console.log('converted legth', Object.keys(converted).length)
    console.log('converted', converted)

    console.log('sourceMaps', sourceMaps)

    const sourceMapsWithAddress = sourceMaps.map((sourceMap) => ({ ...sourceMap, address: contractAddress }))
    yield* put(sourceMapsActions.addSourceMaps(sourceMapsWithAddress))

    yield* put(analyzerActions.addLogMessage(createSuccessLogMessage(`Source maps for ${contractAddress} fetched successfully`)))
  } catch (error) {
    yield* put(analyzerActions.addLogMessage(createErrorLogMessage(`Source maps for ${contractAddress} fetching failed`)))
    console.log(error)
  }
}

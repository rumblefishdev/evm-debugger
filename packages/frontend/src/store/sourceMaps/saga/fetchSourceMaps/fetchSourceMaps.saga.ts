import { call, put, type SagaGenerator } from 'typed-redux-saga'
import type { TSourceMap } from '@evm-debuger/types'

import { sourceMapsActions, type TSourceMapsActions } from '../../sourceMaps.slice'
import { traceStorageBucket } from '../../../../config'
import type { TSourceMapSlice } from '../../sourceMaps.types'

export async function fetchSourceMap(sourceMapPath: string) {
  const rawSourceMap = await fetch(`https://${traceStorageBucket}/${sourceMapPath}`)
  const sourceMap: TSourceMap = await rawSourceMap.json()
  return sourceMap
}

export function* fetchSourceMapsForContractSaga({ payload }: TSourceMapsActions['fetchSourceMaps']): SagaGenerator<void> {
  const { paths, contractAddress } = payload

  const sourceMaps: TSourceMapSlice[] = []

  try {
    for (const path of paths) {
      const sourceMap = yield* call(fetchSourceMap, path)
      sourceMaps.push({ ...sourceMap, address: contractAddress })
    }

    yield* put(sourceMapsActions.addSourceMaps(sourceMaps))
  } catch (error) {
    console.log(error)
  }
}

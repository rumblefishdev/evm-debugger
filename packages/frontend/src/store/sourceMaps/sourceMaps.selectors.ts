import type { Dictionary } from '@reduxjs/toolkit'
import { createSelector } from '@reduxjs/toolkit'
import type { TMappedSourceMap } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'

import { sourceMapsAdapter } from './sourceMaps.slice'

const selectSourceMapsState = createSelector([selectReducer(StoreKeys.SOURCE_MAPS)], (state) => state)

const selectAll = createSelector([selectSourceMapsState], (state) => sourceMapsAdapter.getSelectors().selectAll(state))

const selectCurrentSourceMap = createSelector([selectAll, activeBlockSelectors.selectActiveBlock], (sourceMaps, activeBlock) => {
  return sourceMaps.find((sourceMap) => sourceMap.address === activeBlock.address)
})

const selectIsCurrentSourceMapAvailable = createSelector([selectCurrentSourceMap], (currentSourceMap) => {
  return Boolean(currentSourceMap)
})

const selectGroupedByAddress = createSelector([selectAll], (sourceMaps) => {
  return sourceMaps.reduce((accumulator, sourceMap) => {
    if (!accumulator[sourceMap.address]) {
      accumulator[sourceMap.address] = []
    }
    accumulator[sourceMap.address] = [...accumulator[sourceMap.address], sourceMap]
    return accumulator
  }, {} as TMappedSourceMap)
})

export const createSourceMapId = (address: string, contractName: string) => `${address}|${contractName}`

export const sourceMapsSelectors = {
  selectIsCurrentSourceMapAvailable,
  selectGroupedByAddress,
  selectCurrentSourceMap,
  selectAll,
}

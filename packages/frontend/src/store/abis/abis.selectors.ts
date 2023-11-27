import { createSelector } from '@reduxjs/toolkit'
import type { TAbis } from '@evm-debuger/types'

import { selectReducer } from '../store.utils'
import { StoreKeys } from '../store.keys'

import { abisAdapter } from './abis.slice'

const selectAbisState = createSelector([selectReducer(StoreKeys.ABIS)], (state) => state)

const selectAll = createSelector([selectAbisState], (state) => abisAdapter.getSelectors().selectAll(state))

const selectGroupedByAddress = createSelector([selectAll], (abis) => {
  return abis.reduce((accumulator: TAbis, abi) => {
    accumulator[abi.address] = abi.abi
    return accumulator
  }, {})
})

export const abisSelectors = { selectGroupedByAddress, selectAll }

import { createSelector } from '@reduxjs/toolkit'

import { selectReducer } from '../store.utils'
import { StoreKeys } from '../store.keys'

import { abisAdapter } from './abis.slice'

const selectAbisState = createSelector([selectReducer(StoreKeys.ABIS)], (state) => state)

const selectAll = createSelector([selectAbisState], (state) => abisAdapter.getSelectors().selectAll(state))

const selectGroupedByAddress = createSelector([selectAll], (abis) => {
  return abis.reduce((accumulator, abi) => {
    accumulator[abi.address] = abi.abi
    return accumulator
  }, {})
})

export const abisSelectors = { selectGroupedByAddress, selectAll }

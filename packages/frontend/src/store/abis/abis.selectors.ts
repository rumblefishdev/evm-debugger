import { createSelector } from '@reduxjs/toolkit'

import { selectReducer } from '../store.utils'
import { StoreKeys } from '../store.keys'

import { abisAdapter } from './abis.slice'

const selectAbisState = createSelector([selectReducer(StoreKeys.ABIS)], (state) => state)

const selectAll = createSelector([selectAbisState], (state) => abisAdapter.getSelectors().selectAll(state))

export const abisSelectors = { selectAll }

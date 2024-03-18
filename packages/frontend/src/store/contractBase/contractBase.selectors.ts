import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { contractBaseAdapter } from './contractBase.slice'

const selectContractBaseState = createSelector([selectReducer(StoreKeys.CONTRACT_BASE)], (state) => state)

const selectAll = createSelector([selectContractBaseState], (state) => contractBaseAdapter.getSelectors().selectAll(state))

export const contractBaseSelectors = { selectAll }

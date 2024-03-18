import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { contractRawAdapter } from './contractRaw.slice'

const selectContractBaseState = createSelector([selectReducer(StoreKeys.CONTRACT_RAW)], (state) => state)

const selectAll = createSelector([selectContractBaseState], (state) => contractRawAdapter.getSelectors().selectAll(state))

export const contractBaseSelectors = { selectAll }

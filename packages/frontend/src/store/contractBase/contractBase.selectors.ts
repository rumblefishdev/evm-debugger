import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { contractBaseAdapter } from './contractBase.slice'

const selectContractBaseState = createSelector([selectReducer(StoreKeys.CONTRACT_BASE)], (state) => state)

const selectAll = createSelector([selectContractBaseState], (state) => contractBaseAdapter.getSelectors().selectAll(state))
const selectEntities = createSelector([selectContractBaseState], (state) => contractBaseAdapter.getSelectors().selectEntities(state))

const selectAllAddresses = createSelector([selectAll], (contracts) => contracts.map((contract) => contract.address))

export const contractBaseSelectors = { selectEntities, selectAllAddresses, selectAll }

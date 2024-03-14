import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { contractsAdapter } from './contracts.slice'

const selectContractNamesState = createSelector([selectReducer(StoreKeys.CONTRACTS)], (state) => state)

const selectAll = createSelector([selectContractNamesState], (state) => contractsAdapter.getSelectors().selectAll(state))

const selectAllAddresses = createSelector([selectAll], (contractNames) => contractNames.map(({ address }) => address))

const selectEntities = createSelector([selectContractNamesState], (state) => contractsAdapter.getSelectors().selectEntities(state))

const selectByAddress = createSelector([selectContractNamesState, (_: unknown, address: string) => address], (_, address) =>
  contractsAdapter.getSelectors().selectById(_, address),
)

export const contractsSelectors = { selectEntities, selectByAddress, selectAllAddresses, selectAll }

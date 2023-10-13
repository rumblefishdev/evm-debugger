import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { contractNamesAdapter } from './contractNames.slice'

const selectContractNamesState = createSelector([selectReducer(StoreKeys.CONTRACT_NAMES)], (state) => state)

const selectAll = createSelector([selectContractNamesState], (state) => contractNamesAdapter.getSelectors().selectAll(state))

const selectByAddress = createSelector([selectContractNamesState, (_: unknown, address: string) => address], (_, address) =>
  contractNamesAdapter.getSelectors().selectById(_, address),
)

export const contractNamesSelectors = { selectByAddress, selectAll }

import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import type { TContractNames } from '../../types'

import { contractNamesAdapter } from './contractNames.slice'

const selectContractNamesState = createSelector([selectReducer(StoreKeys.CONTRACT_NAMES)], (state) => state)

const selectAll = createSelector([selectContractNamesState], (state) => contractNamesAdapter.getSelectors().selectAll(state))

const selectByAddress = createSelector([selectAll, (_: unknown, address: string) => address], (state, address) =>
  state.find((contract) => contract.address === address),
)

export const contractNamesSelectors = { selectByAddress, selectAll }

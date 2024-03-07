import { createSelector } from '@reduxjs/toolkit'
import type { TAddressToContractNameDictionary } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { contractNamesAdapter } from './contractNames.slice'

const selectContractNamesState = createSelector([selectReducer(StoreKeys.CONTRACT_NAMES)], (state) => state)

const selectAll = createSelector([selectContractNamesState], (state) => contractNamesAdapter.getSelectors().selectAll(state))

const selectGroupedByAddress = createSelector([selectAll], (contractNames) => {
  return contractNames.reduce((accumulator: TAddressToContractNameDictionary, contractName) => {
    accumulator[contractName.address] = contractName.contractName
    return accumulator
  }, {})
})

const selectAllAddresses = createSelector([selectAll], (contractNames) => contractNames.map(({ address }) => address))

const selectEntities = createSelector([selectContractNamesState], (state) => contractNamesAdapter.getSelectors().selectEntities(state))

const selectByAddress = createSelector([selectContractNamesState, (_: unknown, address: string) => address], (_, address) =>
  contractNamesAdapter.getSelectors().selectById(_, address),
)

export const contractNamesSelectors = { selectGroupedByAddress, selectEntities, selectByAddress, selectAllAddresses, selectAll }

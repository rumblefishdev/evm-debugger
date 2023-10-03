import { createSelector } from '@reduxjs/toolkit'

import { selectReducer } from '../store.utils'
import { StoreKeys } from '../store.keys'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'

import { sighashAdapter } from './sighash.slice'

const selectSighashState = createSelector([selectReducer(StoreKeys.SIGHASH)], (state) => state)

const selectAll = createSelector([selectSighashState], (state) => sighashAdapter.getSelectors().selectAll(state))

const abis = createSelector([selectAll], (sighashes) =>
  Object.fromEntries(sighashes.filter((sighash) => Boolean(sighash.fragment)).map((sighash) => [sighash.sighash, [sighash.fragment]])),
)

const allAddresses = createSelector(
  [selectAll],
  (sighashes) => new Set<string>(sighashes.flatMap((sighash) => [...sighash.addresses.values()])),
)

const selectAllWithContractNames = createSelector([selectAll, contractNamesSelectors.selectAll], (sighashes, contractNames) =>
  sighashes.map((sighash) => {
    const contract = contractNames.find((_contractName) => sighash.addresses.has(_contractName.address))
    return { ...sighash, contractName: contract?.contractName || sighash.sighash }
  }),
)

export const sighashSelectors = { selectAllWithContractNames, selectAll, allAddresses, abis }

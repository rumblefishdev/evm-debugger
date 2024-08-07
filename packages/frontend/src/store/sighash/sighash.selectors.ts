import { createSelector } from '@reduxjs/toolkit'
import type { TSighashStatus } from '@evm-debuger/types'

import { selectReducer } from '../store.utils'
import { StoreKeys } from '../store.keys'
import { contractBaseSelectors } from '../contractBase/contractBase.selectors'

import { sighashAdapter } from './sighash.slice'

const selectSighashState = createSelector([selectReducer(StoreKeys.SIGHASH)], (state) => state)

const selectAll = createSelector([selectSighashState], (state) => sighashAdapter.getSelectors().selectAll(state))

const allAddresses = createSelector(
  [selectAll],
  (sighashes) => new Set<string>(sighashes.flatMap((sighash) => [...sighash.addresses.values()])),
)

const selectAllWithContractNames = createSelector([selectAll, contractBaseSelectors.selectAll], (sighashes, contractNames) =>
  sighashes.map((sighash) => {
    const contract = contractNames.find((_contractName) => sighash.addresses.has(_contractName.address))
    const result: TSighashStatus & { contractName: string } = { ...sighash, contractName: contract?.name || sighash.sighash }
    return result
  }),
)

export const sighashSelectors = { selectAllWithContractNames, selectAll, allAddresses }

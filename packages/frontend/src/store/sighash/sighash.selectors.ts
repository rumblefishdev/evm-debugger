import { createSelector } from '@reduxjs/toolkit'

import { selectReducer } from '../store.utils'
import { StoreKeys } from '../store.keys'

import { sighashAdapter } from './sighash.slice'

const selectSighashState = createSelector([selectReducer(StoreKeys.SIGHASH)], (state) => state)

const selectAll = createSelector([selectSighashState], sighashAdapter.getSelectors().selectAll)

const abis = createSelector([selectAll], (sighashes) =>
  Object.fromEntries(sighashes.filter((sighash) => Boolean(sighash.fragment)).map((sighash) => [sighash.sighash, [sighash.fragment]])),
)

const allAddresses = createSelector(
  [selectAll],
  (sighashes) => new Set<string>(sighashes.flatMap((sighash) => [...sighash.addresses.values()])),
)

export const sighashSelectors = { selectAll, allAddresses, abis }

import { createSelector } from '@reduxjs/toolkit'

import { selectReducer } from '../store.utils'
import { StoreKeys } from '../store.keys'

import { sighashAdapter } from './sighash.slice'

const selectSighashState = createSelector([selectReducer(StoreKeys.SIGHASH)], (state) => state)

const abis = createSelector([selectSighashState], (state) =>
  Object.fromEntries(
    sighashAdapter
      .getSelectors()
      .selectAll(state)
      .filter((sighash) => Boolean(sighash.fragment))
      .map((sighash) => [sighash.sighash, [sighash.fragment]]),
  ),
)

const allAddresses = createSelector(
  [selectSighashState],
  (state) =>
    new Set<string>(
      sighashAdapter
        .getSelectors()
        .selectAll(state)
        .flatMap((sighash) => [...sighash.addresses.values()]),
    ),
)

export const sighashSelectors = { allAddresses, abis }

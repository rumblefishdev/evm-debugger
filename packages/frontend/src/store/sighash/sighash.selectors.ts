import { createSelector } from '@reduxjs/toolkit'

import type { TRootState } from '../store'

import { sighashAdapter } from './sighash.slice'

const abis = createSelector([(state: TRootState) => state.sighashes], (state) =>
  Object.fromEntries(
    sighashAdapter
      .getSelectors()
      .selectAll(state)
      .filter((sighash) => Boolean(sighash.fragment))
      .map((sighash) => [sighash.sighash, [sighash.fragment]]),
  ),
)

export const sighashSelectors = { abis }

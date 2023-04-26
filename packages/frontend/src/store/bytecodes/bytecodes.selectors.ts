import { createSelector } from '@reduxjs/toolkit'

import type { TRootState } from '../store'

import { bytecodesAdapter } from './bytecodes.slice'

const addressesWithMissingBytecode = createSelector([(state: TRootState) => state.bytecodes], (state) =>
  bytecodesAdapter
    .getSelectors()
    .selectAll(state)
    .filter((code) => !code.bytecode)
    .map((code) => code.address),
)

export const bytecodesSelectors = { addressesWithMissingBytecode }

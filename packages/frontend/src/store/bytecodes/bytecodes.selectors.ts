import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { bytecodesAdapter } from './bytecodes.slice'

const selectBytecodesState = createSelector([selectReducer(StoreKeys.BYTECODES)], (state) => state)

const selectAll = createSelector(selectBytecodesState, bytecodesAdapter.getSelectors().selectAll)

const addressesWithMissingBytecode = createSelector([selectAll], (allBytecodes) =>
  allBytecodes.filter((code) => !code.bytecode).map((code) => code.address),
)

export const bytecodesSelectors = { addressesWithMissingBytecode }

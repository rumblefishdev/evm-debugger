import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { bytecodesAdapter } from './bytecodes.slice'

const selectBytecodesState = createSelector([selectReducer(StoreKeys.BYTECODES)], (state) => state)

const selectAll = createSelector(selectBytecodesState, bytecodesAdapter.getSelectors().selectAll)

const selectByAddress = createSelector([selectAll, (_: unknown, address: string) => address], (bytecodes, address) =>
  bytecodes.find((bytecode) => bytecode.address === address),
)

const addressesWithMissingBytecode = createSelector([selectAll], (allBytecodes) =>
  allBytecodes.filter((code) => !code.bytecode).map((code) => code.address),
)

export const bytecodesSelectors = { selectByAddress, selectAll, addressesWithMissingBytecode }

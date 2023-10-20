import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'

import { bytecodesAdapter } from './bytecodes.slice'

const selectBytecodesState = createSelector([selectReducer(StoreKeys.BYTECODES)], (state) => state)

const selectAll = createSelector([selectBytecodesState], (state) => bytecodesAdapter.getSelectors().selectAll(state))

const selectByAddress = createSelector([selectBytecodesState, (_: unknown, address: string) => address], (_, address) =>
  bytecodesAdapter.getSelectors().selectById(_, address),
)

const addressesWithMissingBytecode = createSelector([selectAll], (allBytecodes) =>
  allBytecodes.filter((code) => !code.bytecode).map((code) => code.address),
)

const selectAllWithContractNames = createSelector([selectAll, contractNamesSelectors.selectEntities], (allBytecodes, contractNames) => {
  return allBytecodes.map((bytecode) => {
    const contract = contractNames[bytecode.address]
    return { ...bytecode, contractName: contract?.contractName || bytecode.address }
  })
})

export const bytecodesSelectors = { selectByAddress, selectAllWithContractNames, selectAll, addressesWithMissingBytecode }

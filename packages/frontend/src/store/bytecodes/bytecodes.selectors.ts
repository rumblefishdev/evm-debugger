import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'

import { bytecodesAdapter } from './bytecodes.slice'

const selectBytecodesState = createSelector([selectReducer(StoreKeys.BYTECODES)], (state) => state)

const selectAll = createSelector(selectBytecodesState, bytecodesAdapter.getSelectors().selectAll)

const selectByAddress = createSelector([selectAll, (_: unknown, address: string) => address], (bytecodes, address) =>
  bytecodes.find((bytecode) => bytecode.address === address),
)

const addressesWithMissingBytecode = createSelector([selectAll], (allBytecodes) =>
  allBytecodes.filter((code) => !code.bytecode).map((code) => code.address),
)

const selectAllWithContractNames = createSelector([selectAll, contractNamesSelectors.selectAll], (bytecodes, contractNames) =>
  bytecodes.map((bytecode) => {
    const contract = contractNames.find((_contractName) => bytecode.address === _contractName.address)
    return { ...bytecode, contractName: contract?.contractName || bytecode.address }
  }),
)

export const bytecodesSelectors = { selectByAddress, selectAllWithContractNames, selectAll, addressesWithMissingBytecode }

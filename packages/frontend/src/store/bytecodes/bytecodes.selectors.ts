import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'

import { bytecodesAdapter } from './bytecodes.slice'
import type { TDisassembledBytecodeList } from './bytecodes.types'

const selectBytecodesState = createSelector([selectReducer(StoreKeys.BYTECODES)], (state) => state)

const selectAll = createSelector([selectBytecodesState], (state) => bytecodesAdapter.getSelectors().selectAll(state))

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

const selectCurrentDissasembledBytecode = createSelector([selectAll, activeBlockSelectors.selectActiveBlock], (bytecodes, activeBlock) => {
  const bytecode = bytecodes.find((code) => code.address === activeBlock?.address)
  return bytecode?.disassembled.reduce((accumulator: TDisassembledBytecodeList, element, index) => {
    accumulator[element.pc] = { ...element, index }
    return accumulator
  }, {})
})

export const bytecodesSelectors = {
  selectCurrentDissasembledBytecode,
  selectByAddress,
  selectAllWithContractNames,
  selectAll,
  addressesWithMissingBytecode,
}

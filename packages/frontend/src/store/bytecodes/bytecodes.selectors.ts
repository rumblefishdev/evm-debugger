import { createSelector } from '@reduxjs/toolkit'
import type { TByteCodeMap } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'

import { bytecodesAdapter } from './bytecodes.slice'
import type { TDisassembledBytecodeList } from './bytecodes.types'

const selectBytecodesState = createSelector([selectReducer(StoreKeys.BYTECODES)], (state) => state)

const selectAll = createSelector([selectBytecodesState], (state) => bytecodesAdapter.getSelectors().selectAll(state))

const selectByAddress = createSelector([selectBytecodesState, (_: unknown, address: string) => address], (_, address) =>
  bytecodesAdapter.getSelectors().selectById(_, address),
)

const selectGroupedByAddress = createSelector([selectAll], (bytecodes) => {
  return bytecodes.reduce((accumulator: TByteCodeMap, bytecode) => {
    accumulator[bytecode.address] = bytecode.bytecode
    return accumulator
  }, {})
})

const addressesWithMissingBytecode = createSelector([selectAll], (allBytecodes) =>
  allBytecodes.filter((code) => !code.bytecode).map((code) => code.address),
)

const selectAllWithContractNames = createSelector([selectAll, contractNamesSelectors.selectEntities], (allBytecodes, contractNames) => {
  return allBytecodes.map((bytecode) => {
    const contract = contractNames[bytecode.address]
    return { ...bytecode, contractName: contract?.contractName || bytecode.address }
  })
})

const selectCurrentDissasembledBytecode = createSelector([selectAll, activeBlockSelectors.selectActiveBlock], (bytecodes, activeBlock) => {
  const bytecode = bytecodes.find((code) => code.address === activeBlock?.address)
  return bytecode?.disassembled.reduce((accumulator: TDisassembledBytecodeList, element, index) => {
    accumulator[element.pc] = { ...element, index }
    return accumulator
  }, {})
})

export const bytecodesSelectors = {
  selectGroupedByAddress,
  selectCurrentDissasembledBytecode,
  selectByAddress,
  selectAllWithContractNames,
  selectAll,
  addressesWithMissingBytecode,
}

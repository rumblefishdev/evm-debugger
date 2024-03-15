import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractsSelectors } from '../contracts/contracts.selectors'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'

import { bytecodesAdapter } from './bytecodes.slice'

const selectBytecodesState = createSelector([selectReducer(StoreKeys.BYTECODES)], (state) => state)

const selectAll = createSelector([selectBytecodesState], (state) => bytecodesAdapter.getSelectors().selectAll(state))

const selectEntities = createSelector([selectBytecodesState], (state) => bytecodesAdapter.getSelectors().selectEntities(state))

const selectAllWithContractNames = createSelector([selectAll, contractsSelectors.selectEntities], (allBytecodes, contractNames) => {
  return allBytecodes.map((bytecode) => {
    const contract = contractNames[bytecode.address]
    return { ...bytecode, contractName: contract?.name || bytecode.address }
  })
})

const selectCurrentDissasembledBytecode = createSelector(
  [selectEntities, activeBlockSelectors.selectActiveBlock],
  (bytecodes, activeBlock) => {
    return bytecodes[activeBlock?.address].disassembledBytecode || {}
  },
)

export const bytecodesSelectors = {
  selectCurrentDissasembledBytecode,
  selectAllWithContractNames,
  selectAll,
}

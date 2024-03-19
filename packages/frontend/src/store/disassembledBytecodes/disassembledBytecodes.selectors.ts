import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { activeBlockSelectors } from '../activeBlock/activeBlock.selector'
import { contractBaseSelectors } from '../contractBase/contractBase.selectors'

import { disassembledBytecodesAdapter } from './disassembledBytecodes.slice'

const selectBytecodesState = createSelector([selectReducer(StoreKeys.DISASSEMBLED_BYTECODES)], (state) => state)

const selectAll = createSelector([selectBytecodesState], (state) => disassembledBytecodesAdapter.getSelectors().selectAll(state))

const selectEntities = createSelector([selectBytecodesState], (state) => disassembledBytecodesAdapter.getSelectors().selectEntities(state))

const selectAllWithContractNames = createSelector([selectAll, contractBaseSelectors.selectEntities], (allBytecodes, contractNames) => {
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

export const disassembledBytecodesSelectors = {
  selectCurrentDissasembledBytecode,
  selectAllWithContractNames,
  selectAll,
}

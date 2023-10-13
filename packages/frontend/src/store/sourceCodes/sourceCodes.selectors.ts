import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'

import { sourceCodesAdapter } from './sourceCodes.slice'

const selectSourceCodesState = createSelector([selectReducer(StoreKeys.SOURCE_CODES)], (state) => state)

const selectAll = createSelector([selectSourceCodesState], (state) => sourceCodesAdapter.getSelectors().selectAll(state))

const selectByAddress = createSelector([selectSourceCodesState, (_: unknown, address: string) => address], (state, address) =>
  sourceCodesAdapter.getSelectors().selectById(state, address),
)

const selectAllWithContractNames = createSelector(
  [selectAll, contractNamesSelectors.selectEntities],
  (allSourceCodes, contractEntities) => {
    return allSourceCodes.map((sourceCode) => {
      const contract = contractEntities[sourceCode.address]
      return { ...sourceCode, contractName: contract?.contractName || sourceCode.address }
    })
  },
)

export const sourceCodesSelectors = { selectByAddress, selectAllWithContractNames, selectAll }

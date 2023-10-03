import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'
import { contractNamesSelectors } from '../contractNames/contractNames.selectors'

import { sourceCodesAdapter } from './sourceCodes.slice'

const selectSourceCodesState = createSelector([selectReducer(StoreKeys.SOURCE_CODES)], (state) => state)

const selectAll = createSelector([selectSourceCodesState], (state) => sourceCodesAdapter.getSelectors().selectAll(state))

const selectByAddress = createSelector([selectAll, (_: unknown, address: string) => address], (sourceCodes, address) =>
  sourceCodes.find((sourceCode) => sourceCode.address === address),
)

const selectAllWithContractNames = createSelector([selectAll, contractNamesSelectors.selectAll], (sourceCodes, contractNames) =>
  sourceCodes.map((sourceCode) => {
    const contract = contractNames.find((_contractName) => sourceCode.address === _contractName.address)
    return { ...sourceCode, contractName: contract?.contractName || sourceCode.address }
  }),
)

export const sourceCodesSelectors = { selectByAddress, selectAllWithContractNames, selectAll }

import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

import { sourceCodesAdapter } from './sourceCodes.slice'

const selectSourceCodesState = createSelector([selectReducer(StoreKeys.SOURCE_CODES)], (state) => state)

const selectAll = createSelector(selectSourceCodesState, sourceCodesAdapter.getSelectors().selectAll)

const selectByAddress = createSelector([selectAll, (_: unknown, address: string) => address], (sourceCodes, address) =>
  sourceCodes.find((sourceCode) => sourceCode.address === address),
)

export const sourceCodesSelectors = { selectByAddress, selectAll }

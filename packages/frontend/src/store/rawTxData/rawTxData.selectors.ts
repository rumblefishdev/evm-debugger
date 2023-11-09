import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const selectRawTxDataState = createSelector([selectReducer(StoreKeys.RAW_TX_DATA)], (state) => state)

const selectTxHash = createSelector(selectRawTxDataState, (state) => state.txHash)

const selectTxInfo = createSelector(selectRawTxDataState, (state) => state.transactionInfo)

export const rawTxDataSelectors = { selectTxInfo, selectTxHash }

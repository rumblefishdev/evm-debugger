import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const selectTransactionInfoState = createSelector([selectReducer(StoreKeys.TRANSACTION_INFO)], (state) => state)

const selectChainId = createSelector([selectTransactionInfoState], (state) => state.chainId)

const selectTransactionHash = createSelector([selectTransactionInfoState], (state) => state.hash)

const selectTransactionInfo = createSelector([selectTransactionInfoState], (state) => state)

export const transactionInfoSelectors = { selectTransactionInfo, selectTransactionHash, selectChainId }

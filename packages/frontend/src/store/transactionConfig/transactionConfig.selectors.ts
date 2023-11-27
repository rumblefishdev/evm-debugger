import { createSelector } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'
import { selectReducer } from '../store.utils'

const selectTransactionConfigState = createSelector([selectReducer(StoreKeys.TRANSACTION_CONFIG)], (state) => state)

const selectChainId = createSelector([selectTransactionConfigState], (state) => state.chainId)

const selectTransactionHash = createSelector([selectTransactionConfigState], (state) => state.transactionHash)

const selectS3Location = createSelector([selectTransactionConfigState], (state) => state.s3Location)

export const transactionConfigSelectors = { selectTransactionHash, selectS3Location, selectChainId }

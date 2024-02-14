import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { StoreKeys } from '../store.keys'

import type { TSetChainIdPayload, TSetGasLimitPayload, TSetS3LocationPayload, TSetTransactionHashPayload } from './transactionConfig.types'
import { TransactionConfigState } from './transactionConfig.state'

export const transactionConfigSlice = createSlice({
  reducers: {
    setTransactionHash: (state, { payload }: PayloadAction<TSetTransactionHashPayload>) => {
      state.transactionHash = payload.transactionHash
    },
    setS3Location: (state, { payload }: PayloadAction<TSetS3LocationPayload>) => {
      state.s3Location = payload.s3Location
    },
    setGasLimit: (state, { payload }: PayloadAction<TSetGasLimitPayload>) => {
      state.gasLimit = payload.gasLimit
    },
    setChainId: (state, { payload }: PayloadAction<TSetChainIdPayload>) => {
      state.chainId = payload.chainId
    },
    clearTransactionConfig: () => {
      return { ...new TransactionConfigState() }
    },
  },
  name: StoreKeys.TRANSACTION_CONFIG,
  initialState: { ...new TransactionConfigState() },
})

export const transactionConfigReducer = transactionConfigSlice.reducer
export const transactionConfigActions = transactionConfigSlice.actions

export type TTransactionConfigActions = typeof transactionConfigActions

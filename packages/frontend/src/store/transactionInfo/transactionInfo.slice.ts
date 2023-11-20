import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { TTransactionInfo } from '@evm-debuger/types'

import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

import type { TTransactionInfoState, TFetchTransactionInfoPayload } from './transactionInfo.types'
import { TransactionInfoState } from './transactionInfo.state'

export const transactionInfoInitialState: TTransactionInfoState = { ...new TransactionInfoState() }

export const transactionInfoSlice = createSlice({
  reducers: {
    setTransactionInfo: (_, action: PayloadAction<TTransactionInfo>) => {
      return action.payload
    },
    fetchTransactionInfo: () => {},
    clearTransactionInfo: () => {
      return transactionInfoInitialState
    },
  },
  name: StoreKeys.TRANSACTION_INFO,
  initialState: transactionInfoInitialState,
})

export const transactionInfoReducer = transactionInfoSlice.reducer
export const transactionInfoActions = transactionInfoSlice.actions

export type TTransactionInfoActions = ActionsType<typeof transactionInfoActions>

import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { TTransactionInfo } from '@evm-debuger/types'

import type { TRawTxData } from '../../types'
import { StoreKeys } from '../store.keys'
import type { ActionsType } from '../store.types'

const initialState = {
  txHash: '',
  transactionInfo: {},
  contractAddresses: [],
} as TRawTxData
export const rawTxDataSlice = createSlice({
  reducers: {
    setTxInfo: (state, action: PayloadAction<TTransactionInfo>) => {
      state.transactionInfo = action.payload
    },
    setTxHash: (state, action: PayloadAction<string>) => {
      state.txHash = action.payload
    },
    setContractAddresses: (state, action: PayloadAction<string[]>) => {
      state.contractAddresses = action.payload
    },
  },
  name: StoreKeys.RAW_TX_DATA,
  initialState,
})

export const rawTxDataReducer = rawTxDataSlice.reducer
export const rawTxDataActions = rawTxDataSlice.actions

export type RawTxDataActions = ActionsType<typeof rawTxDataActions>

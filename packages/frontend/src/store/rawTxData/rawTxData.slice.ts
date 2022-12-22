import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { TTransactionInfo } from '@evm-debuger/types'

import type { TRawTxData } from '../../types'

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
  name: 'rawTxData',
  initialState,
})

export const rawTxDataReducer = rawTxDataSlice.reducer
export const { setTxInfo, setTxHash, setContractAddresses } = rawTxDataSlice.actions

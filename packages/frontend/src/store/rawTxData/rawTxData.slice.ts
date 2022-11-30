import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { IStructLog, TTransactionInfo, TTransactionTraceResult } from '@evm-debuger/types'

const initialState = {
  txHash: '',
  transactionInfo: {} as TTransactionInfo,
  structLogs: [] as IStructLog[],
}
export const rawTxDataSlice = createSlice({
  reducers: {
    setTxInfo: (state, action: PayloadAction<TTransactionInfo>) => {
      state.transactionInfo = action.payload
    },
    setTxHash: (state, action: PayloadAction<string>) => {
      state.txHash = action.payload
    },
    setStructLogs: (state, action: PayloadAction<TTransactionTraceResult>) => {
      state.structLogs = action.payload.structLogs
    },
  },
  name: 'rawTxData',
  initialState,
})
export const rawTxDataReducer = rawTxDataSlice.reducer
export const { setTxInfo, setTxHash, setStructLogs } = rawTxDataSlice.actions

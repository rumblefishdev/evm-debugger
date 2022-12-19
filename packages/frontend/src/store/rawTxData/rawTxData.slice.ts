import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'

import type { TRootState } from '../store'
import type { TRawTxData } from '../../types'

const initialState = {
  txHash: '',
  transactionInfo: {},
  structLogs: [],
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
    setStructLogs: (state, action: PayloadAction<IStructLog[]>) => {
      state.structLogs = action.payload
    },
    setContractAddresses: (state, action: PayloadAction<string[]>) => {
      state.contractAddresses = action.payload
    },
  },
  name: 'rawTxData',
  initialState,
})

export const getParsedStructLogs = (state: TRawTxData, startIndex: number, returnIndex: number) => {
  return state.structLogs.slice(startIndex, returnIndex)
}

export const selectParsedStructLogs = createSelector(
  [
    (state: TRootState) => state.rawTxData,
    (state: TRootState, startIndex: number) => startIndex,
    (state: TRootState, startIndex: number, returnIndex: number) => returnIndex,
  ],
  getParsedStructLogs
)

export const rawTxDataReducer = rawTxDataSlice.reducer
export const { setTxInfo, setTxHash, setStructLogs, setContractAddresses } = rawTxDataSlice.actions

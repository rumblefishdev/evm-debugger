import type { PayloadAction } from '@reduxjs/toolkit'
import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { IStructLog, TMainTraceLogs, TTransactionInfo } from '@evm-debuger/types'
import { checkIfOfCallType, checkIfOfCreateType } from '@evm-debuger/analyzer'

import type { TRootState } from '../store'
import type { IExtendedStructLog, TRawTxData } from '../../types'
import { argStackExtractor } from '../../helpers/argStackExtractor'
import { extendStack } from '../../helpers/helpers'

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
    setContractAddresses: (state, action: PayloadAction<string[]>) => {
      state.contractAddresses = action.payload
    },
  },
  name: 'rawTxData',
  initialState,
})

export const rawTxDataReducer = rawTxDataSlice.reducer
export const { setTxInfo, setTxHash, setContractAddresses } = rawTxDataSlice.actions

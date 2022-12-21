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

export const getParsedStructLogs = (
  structLogs: IStructLog[],
  traceLogs: TMainTraceLogs[],
  startIndex: number,
  returnIndex: number
): IExtendedStructLog[] => {
  return structLogs
    .slice(startIndex, returnIndex)
    .filter((item) => item.depth === structLogs[startIndex].depth)
    .map((item, index) => {
      if (checkIfOfCallType(item) || checkIfOfCreateType(item))
        return {
          ...argStackExtractor(item),
          stack: extendStack(item.stack),
          index,
          gasCost: traceLogs.find((traceLog) => traceLog.pc === item.pc)?.gasCost,
        }

      return {
        ...argStackExtractor(item),
        stack: extendStack(item.stack),
        index,
      }
    })
}

export const selectParsedStructLogs = createSelector(
  (state: TRootState) => state.rawTxData.structLogs,
  (state: TRootState) => state.traceLogs,
  (state: TRootState) => state.activeBlock.startIndex,
  (state: TRootState) => state.activeBlock.returnIndex,
  getParsedStructLogs
)

export const rawTxDataReducer = rawTxDataSlice.reducer
export const { setTxInfo, setTxHash, setStructLogs, setContractAddresses } = rawTxDataSlice.actions

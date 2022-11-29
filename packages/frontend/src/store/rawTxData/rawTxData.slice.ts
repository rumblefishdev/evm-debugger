import { createSlice } from '@reduxjs/toolkit'
import type { IStructLog, TTransactionInfo } from '@evm-debuger/types'

const initialState = {
    txHash: '',
    transactionInfo: {} as TTransactionInfo,
    structLogs: [] as IStructLog[],
}
export const rawTxDataSlice = createSlice({
    reducers: {
        setTxInfo: (state, action) => {
            state.transactionInfo = action.payload
        },
        setTxHash: (state, action) => {
            state.txHash = action.payload
        },
        setStructLogs: (state, action) => {
            state.structLogs = action.payload
        },
    },
    name: 'rawTxData',
    initialState,
})
export const rawTxDataReducer = rawTxDataSlice.reducer
export const { setTxInfo, setTxHash, setStructLogs } = rawTxDataSlice.actions

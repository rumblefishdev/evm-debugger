import { ethers } from 'ethers'
import { TCallTypeOpcodes, TCreateTypeOpcodes, TOpCodes, TReturnTypeOpcodes } from './opcodes'

export type TTransactionTrace = {
    jsonrpc: string
    id: number
    result: TTransactionTraceResult
}

export type TTransactionTraceResult = {
    gas: number
    failed: boolean
    returnValue: string
    structLogs: IStructLog[]
}

export interface IStructLog {
    pc: number
    op: TOpCodes
    gas: number
    gasCost: number
    depth: number
    stack: string[]
    memory: string[]
    storage: string[]
}

export interface IStructLogWithIndex extends IStructLog {
    index: number
}

export interface IParsedTraceLogs {
    type: TOpCodes
    depth: number
    passedGas: number
    gasCost: number
    pc: number
    index: number
}
export interface ICallTypeTraceLogs extends IParsedTraceLogs {
    type: TCallTypeOpcodes
    input: string
    output: string
    address: string
    decodedInput?: ethers.utils.TransactionDescription
    decodedOutput?: ethers.utils.Result

    startIndex?: number
    returnIndex?: number
    stackTrace?: number[]
    value?: string

    contractOpCodes?: any
}

export interface IReturnTypeTraceLogs extends IParsedTraceLogs {
    type: TReturnTypeOpcodes
    output: string
}

export interface ICreateTypeTraceLogs extends IParsedTraceLogs {
    type: TCreateTypeOpcodes
}

export interface IStopTypeTraceLogs extends IParsedTraceLogs {
    type: 'STOP'
}

export type TReturnedTraceLogs = ICallTypeTraceLogs | IReturnTypeTraceLogs | ICreateTypeTraceLogs | IStopTypeTraceLogs

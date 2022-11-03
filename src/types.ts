import { ethers } from 'ethers'
import { TCallTypeOpcodes, TCreateTypeOpcodes, TOpCodes, TReturnTypeOpcodes } from './opcodes'

export type TTransactionRootLog = {
    blockHash: string
    blockNumber: string
    from: string
    gas: string
    hash: string
    input: string
    nonce: string
    to: string
    transactionIndex: string
    value: string
    v: string
    r: string
    s: string
    type: string
    accessList: string
    chainId: string
    gasPrice: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
}

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

    startIndex: number
    stackTrace: number[]
    value: string

    decodedInput?: ethers.utils.TransactionDescription
    decodedOutput?: ethers.utils.Result
    returnIndex?: number
    success?: boolean
}

export interface IReturnTypeTraceLogs extends IParsedTraceLogs {
    type: TReturnTypeOpcodes
    output: string
}

export interface ICreateTypeTraceLogs extends IParsedTraceLogs {
    type: TCreateTypeOpcodes
    startIndex: number
    stackTrace: number[]
    value: string
    input: string
    salt?: string
    success?: boolean
}

export interface IStopTypeTraceLogs extends IParsedTraceLogs {
    type: 'STOP'
}

export type TReturnedTraceLogs = ICallTypeTraceLogs | IReturnTypeTraceLogs | ICreateTypeTraceLogs | IStopTypeTraceLogs

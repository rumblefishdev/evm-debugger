import { ethers } from 'ethers'
import { CallTypeOpcodes, CreateTypeOpcodes, OpCodes, ReturnTypeOpcodes } from './opcodes'

export interface TransactionTrace {
    jsonrpc: string
    id: number
    result: TransactionTraceResult
}

export interface TransactionTraceResult {
    gas: number
    failed: boolean
    returnValue: string
    structLogs: StructLog[]
}

export interface StructLog {
    pc: number
    op: OpCodes
    gas: number
    gasCost: number
    depth: number
    stack: string[]
    memory: string[]
    storage: string[]
}

export interface StructLogWithIndex extends StructLog {
    index: number
}

export interface ParsedTraceLogs {
    type: OpCodes
    depth: number
    passedGas: number
    gasCost: number
    pc: number
    index: number
}
export interface CallTypeTraceLogs extends ParsedTraceLogs {
    type: CallTypeOpcodes
    input: string
    output: string
    address: string
    decodedInput?: ethers.utils.TransactionDescription
    decodedOutput?: ethers.utils.Result

    startIndex?: number
    returnIndex?: number
    stackTrace?: number[]

    contractOpCodes?: any
}

export interface ReturnTypeTraceLogs extends ParsedTraceLogs {
    type: ReturnTypeOpcodes
    output: string
}

export interface CreateTypeTraceLogs extends ParsedTraceLogs {
    type: CreateTypeOpcodes
}

export interface StopTypeTraceLogs extends ParsedTraceLogs {
    type: 'STOP'
}

export type ReturnedTraceLogs = CallTypeTraceLogs | ReturnTypeTraceLogs | CreateTypeTraceLogs | StopTypeTraceLogs

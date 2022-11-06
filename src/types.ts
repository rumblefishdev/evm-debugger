import { ethers } from 'ethers'
import { StorageOpCodes as TStorageOpCodes, TCallTypeOpcodes, TCreateTypeOpcodes, TOpCodes, TReturnTypeOpcodes } from './opcodes'

export type TStorage = Array<{ [key: string]: string }>

export type TLoadedStorage = Array<{ key: string; value: string; index: number }>
export type TChangedStorage = Array<{ key: string; initialValue: string; updatedValue: string; index: number }>
export type TReturnedStorage = Array<{ key: string; value: string }>

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
    op: TOpCodes | TStorageOpCodes
    gas: number
    gasCost: number
    depth: number
    stack: string[]
    memory: string[]
    storage: TStorage
}

export interface IStructLogWithIndex extends IStructLog {
    index: number
    op: TOpCodes
}

export interface IStorageStructLogs extends IStructLog {
    index: number
    op: TStorageOpCodes
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
    isContract?: boolean

    storageLogs?: {
        loadedStorage: TLoadedStorage
        returnedStorage: TReturnedStorage
        changedStorage: TChangedStorage
    }
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
    returnIndex?: number

    storageLogs?: {
        loadedStorage: TLoadedStorage
        returnedStorage: TReturnedStorage
        changedStorage: TChangedStorage
    }
}

export interface IStopTypeTraceLogs extends IParsedTraceLogs {
    type: 'STOP'
}

export type TReturnedTraceLogs = ICallTypeTraceLogs | IReturnTypeTraceLogs | ICreateTypeTraceLogs | IStopTypeTraceLogs

export interface IDataProvider {
    getTransactionTrace(transactionHash: string): Promise<TTransactionTraceResult>
    getTransactionByHash(transactionHash: string): Promise<TTransactionRootLog>
    getContractCode(address: string): Promise<string>
    fetchAbiCode(address: string): Promise<string>
}
